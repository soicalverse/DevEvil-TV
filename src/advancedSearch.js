import Fuse from 'fuse.js';
import { searchCorrections } from './searchCorrections';
import { pipeline, cos_sim } from '@xenova/transformers';
import { doubleMetaphone } from 'double-metaphone';
import { get, set } from 'idb-keyval';

// --- Constants ---
const FUSE_THRESHOLD = 0.6;
const FUSE_RESULT_LIMIT = 100;
const VECTOR_SCORE_WEIGHT = 10;
const PHONETIC_SCORE_WEIGHT = 3;
const SINGLE_LETTER_KEYWORD_BOOST = 5;
const KEYWORD_BOOST = 2;
const POPULARITY_NORMALIZATION_DIVISOR = 10;
const SHORT_TITLE_PENALTY = -1;
const LONG_TITLE_PENALTY = -0.5;

// --- Caching ---
const neuralCache = {
  get: async (key) => await get(key),
  set: async (key, value) => await set(key, value),
};

// --- Model Pipeline ---
// Singleton for the embedding model
class EmbeddingPipeline {
    static task = 'feature-extraction';
    static model = 'Xenova/all-MiniLM-L6-v2';
    static instance = null;
    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = pipeline(this.task, this.model, { progress_callback });
        }
        return this.instance;
    }
}

// --- Query Processing ---
const generateQueryVariations = (userInput) => {
  const correctedQuery = (searchCorrections[userInput.toLowerCase()] || userInput).toLowerCase();
  return [correctedQuery];
};

// --- Feature Extraction ---
const analyzeAndEmbed = async (query, results, embedder) => {
    const queryEmbedding = await embedder(query, { pooling: 'mean', normalize: true });
    const queryPhonetic = doubleMetaphone(query);

    const resultTexts = results.map(r => r.title || r.name || '');
    const resultEmbeddings = await embedder(resultTexts, { pooling: 'mean', normalize: true });

    return results.map((result, i) => {
        const title = result.title || result.name || '';
        const vectorScore = cos_sim(queryEmbedding.data, resultEmbeddings[i].data);
        const phoneticScore = title ? doubleMetaphone(title).reduce((acc, phone) => Math.max(acc, queryPhonetic.includes(phone) ? 1 : 0), 0) : 0;
        return { ...result, vectorScore, phoneticScore };
    });
};

// --- Scoring ---
const calculateRelevanceScore = (result, queryVariations, query) => {
    const title = (result.title || result.name || '').toLowerCase();
    let score = 0;
    const debug = {};

    // Vector Score
    const vectorScore = result.vectorScore || 0;
    score += vectorScore * VECTOR_SCORE_WEIGHT;
    debug.vectorScore = vectorScore;

    // Phonetic Score
    const phoneticScore = result.phoneticScore || 0;
    score += phoneticScore * PHONETIC_SCORE_WEIGHT;
    debug.phoneticScore = phoneticScore;

    // Keyword Boost
    let keywordBoost = 0;
    if (title.includes(queryVariations[0])) {
        keywordBoost = query.length === 1 ? SINGLE_LETTER_KEYWORD_BOOST : KEYWORD_BOOST;
    }
    score += keywordBoost;
    debug.keywordBoost = keywordBoost;

    // Popularity Score
    const voteCount = result.vote_count || 0;
    const voteAverage = result.vote_average || 0;
    const popularityEntropy = voteCount > 0 && voteAverage > 0 ? voteCount * Math.log1p(voteAverage) : 0;
    const normalizedPopularity = Math.log1p(popularityEntropy) / POPULARITY_NORMALIZATION_DIVISOR;
    score += normalizedPopularity;
    debug.popularity = normalizedPopularity;

    // Length Penalty
    let lengthPenalty = 0;
    if (query.length > 1) { // Only apply penalty for multi-character queries
        if (title.length < 5) {
            lengthPenalty = SHORT_TITLE_PENALTY;
        } else if (title.length > 50) {
            lengthPenalty = LONG_TITLE_PENALTY;
        }
    }
    score += lengthPenalty;
    debug.lengthPenalty = lengthPenalty;
    
    debug.finalScore = score;

    return { score, debug };
};


// --- Main Search Function ---
export const advancedSearch = async (userInput, searchFunction) => {
  const cacheKey = `advanced_search_${userInput}`;
  if (userInput.length > 1) {
      const cachedResults = await neuralCache.get(cacheKey);
      if (cachedResults) return cachedResults;
  }

  // --- Round 1: Candidate Selection ---
  const initialResults = await searchFunction(userInput);
  if (!initialResults || initialResults.length === 0) return [];

  let candidateSet;

  if (userInput.length < 2) {
    candidateSet = initialResults;
  } else {
    const fuse = new Fuse(initialResults, {
      keys: ['title', 'name'],
      threshold: FUSE_THRESHOLD,
    });
    const fuseResults = fuse.search(userInput).slice(0, FUSE_RESULT_LIMIT).map(r => r.item);
    candidateSet = fuseResults.length > 0 ? fuseResults : initialResults;
  }

  // --- Round 2: Re-ranking ---
  const embedder = await EmbeddingPipeline.getInstance();
  const analyzedResults = await analyzeAndEmbed(userInput, candidateSet, embedder);
  const queryVariations = generateQueryVariations(userInput);

  const scoredResults = analyzedResults.map(result => {
    const { score, debug } = calculateRelevanceScore(result, queryVariations, userInput);
    return { 
        result: result, 
        confidence: score, 
        debug: debug 
    };
  });

  const sortedResults = scoredResults.sort((a, b) => b.confidence - a.confidence);

  if (userInput.length > 1 && sortedResults.length > 0) {
      await neuralCache.set(cacheKey, sortedResults);
  }

  return sortedResults;
};
