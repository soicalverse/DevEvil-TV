import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { searchMedia, getTrendingMovies, getTrendingTvShows } from '../services/tmdbService';
import { advancedSearch } from '../advancedSearch';
import MediaCard from './MediaCard';
import Footer from './Others/Footer';
import Loader from './Loader';
import { blockedWords } from '../blockedWords';
import BlockedContent from './BlockedContent'; // Import the new component
import '../styles/Search.css';
import '../styles/Movies.css';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const location = useLocation();

  const fetchMedia = useCallback(async (searchQuery, cancelToken) => {
    const startTime = Date.now();
    try {
      let results;
      if (searchQuery) {
        results = await advancedSearch(searchQuery, async (query) => {
          const res = await searchMedia(query, cancelToken);
          return res;
      });
      results = results.map(r => ({...r.result, confidence: r.confidence, debug: r.debug}));

      } else {
        // Fetch both trending movies and TV shows
        const [movies, tvShows] = await Promise.all([
          getTrendingMovies(1, cancelToken),
          getTrendingTvShows(1, cancelToken)
        ]);
        // Add media_type to each item for the MediaCard
        const moviesWithMediaType = movies.map(movie => ({ ...movie, media_type: 'movie' }));
        const tvShowsWithMediaType = tvShows.map(tv => ({ ...tv, media_type: 'tv' }));
        // Combine and shuffle the results for a mixed view
        results = [...moviesWithMediaType, ...tvShowsWithMediaType].sort(() => Math.random() - 0.5);
      }
      setSearchResults(results);
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error('Failed to fetch media:', error);
        setSearchResults([]);
      }
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = 1300 - elapsedTime;
      if (remainingTime > 0) {
        setTimeout(() => setLoading(false), remainingTime);
      } else {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setIsBlocked(false);
    const searchParam = new URLSearchParams(location.search).get('q');
    const source = axios.CancelToken.source();

    if (searchParam) {
      const isQueryBlocked = blockedWords.some(word =>
        searchParam.toLowerCase().includes(word.toLowerCase())
      );

      if (isQueryBlocked) {
        setIsBlocked(true);
        setLoading(false);
        return;
      }
    }

    fetchMedia(searchParam, source.token);

    return () => {
      source.cancel('Component unmounted');
    };
  }, [location.search, fetchMedia]);

  return (
    <div>
      {loading ? (
        <div className="loading-container">
          <Loader />
        </div>
      ) : isBlocked ? (
        <BlockedContent 
          title="Sorry, searches containing 18+ or explicit words are not allowed."
          message="This is a family-friendly movie site. Please use appropriate search terms."
        />
      ) : (
        <div className="search-results-grid">
          {searchResults.map((media) => (
            <MediaCard key={media.id} item={media} type={media.media_type} fromSearchPage={true} />
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default SearchPage;
