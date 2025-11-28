import Fuse from 'fuse.js';
import { searchCorrections } from './searchCorrections';
import { pipeline, cos_sim } from '@xenova/transformers';
import { doubleMetaphone } from 'double-metaphone';
import { get, set } from 'idb-keyval';

// Phase 5: Self-Evolving Neural Cache

// Singleton for the embedding model
class MyTransformationPipeline {
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

// Self-Evolving Neural Cache
const neuralCache = {
  get: async (key) => await get(key),
  set: async (key, value) => await set(key, value),
};

// Quantum Query Superposition Engine (v1.0)
const generateQueryStates = (userInput) => {
  const correctedQuery = (searchCorrections[userInput.toLowerCase()] || userInput).toLowerCase();
  return [correctedQuery];
};

// Vector & Phonetic Calculation
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

// Quantum Entanglement Scoring (v3.2)
const calculateQuantumScore = (result, queryStates, query) => {
    const title = (result.title || result.name || '').toLowerCase();
    let score = 0;
    const debug = {};

    const vectorScore = result.vectorScore || 0;
    score += vectorScore * 10;
    debug.vectorScore = vectorScore;

    const phoneticScore = result.phoneticScore || 0;
    score += phoneticScore * 3;
    debug.phoneticScore = phoneticScore;

    let keywordBoost = 0;
    if (title.includes(queryStates[0])) {
        if (query.length === 1) {
            keywordBoost = 5; // Higher boost for single-letter matches
        } else {
            keywordBoost = 2;
        }
    }
    score += keywordBoost;
    debug.keywordBoost = keywordBoost;

    const voteCount = result.vote_count || 0;
    const voteAverage = result.vote_average || 0;
    const popularityEntropy = voteCount > 0 && voteAverage > 0 ? voteCount * Math.log1p(voteAverage) : 0;
    const normalizedPopularity = Math.log1p(popularityEntropy) / 10;
    score += normalizedPopularity;
    debug.popularity = normalizedPopularity;

    let lengthPenalty = 0;
    if (query.length === 1 && title.length < 5) {
        lengthPenalty = 0; 
    } else if (title.length < 5) {
        lengthPenalty = -1;
    }
    else if (title.length > 50) {
        lengthPenalty = -0.5;
    }
    score += lengthPenalty;
    debug.lengthPenalty = lengthPenalty;
    
    debug.finalScore = score;

    return { score, debug };
};

// Main Exported Function
export const quantumSearch = async (userInput, searchFunction) => {
  const cacheKey = `quantum_search_${userInput}`;
  // Only check cache for queries longer than one character
  if (userInput.length > 1) {
      const cachedResults = await neuralCache.get(cacheKey);
      if (cachedResults) return cachedResults;
  }

  // --- Round 1: Superposition & Candidate Selection ---
  const initialResults = await searchFunction(userInput);
  if (!initialResults || initialResults.length === 0) return [];

  let amplificationSet;

  if (userInput.length < 2) {
    amplificationSet = initialResults;
  } else {
    const fuse = new Fuse(initialResults, {
      keys: ['title', 'name'],
      threshold: 0.6,
    });
    const candidateResults = fuse.search(userInput).slice(0, 100).map(r => r.item);
    amplificationSet = candidateResults.length > 0 ? candidateResults : initialResults;
  }

  // --- Round 2: Amplification & Re-ranking ---
  const embedder = await MyTransformationPipeline.getInstance();
  const analyzedResults = await analyzeAndEmbed(userInput, amplificationSet, embedder);
  const queryStates = generateQueryStates(userInput);

  const scoredResults = analyzedResults.map(result => {
    const { score, debug } = calculateQuantumScore(result, queryStates, userInput);
    return { 
        result: result, 
        confidence: score, 
        debug: debug 
    };
  });

  const sortedResults = scoredResults.sort((a, b) => b.confidence - a.confidence);

  // Cache the results if the query is longer than one character and there are results
  if (userInput.length > 1 && sortedResults.length > 0) {
      await neuralCache.set(cacheKey, sortedResults);
  }

  return sortedResults;
};
