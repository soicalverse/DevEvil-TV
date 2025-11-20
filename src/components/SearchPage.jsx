import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { searchMedia, getTrendingMedia } from '../services/tmdbService';
import MediaCard from './MediaCard';
import Footer from './Others/Footer';
import Loader from './Loader';
import '../styles/Search.css';
import '../styles/Movies.css';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true); // Set initial loading to true
  const location = useLocation();

  const fetchMedia = useCallback(async (searchQuery) => {
    const startTime = Date.now();
    try {
      let results;
      if (searchQuery) {
        results = await searchMedia(searchQuery);
      } else {
        results = await getTrendingMedia();
      }
      setSearchResults(results);
    } catch (error) {
      console.error('Failed to fetch media:', error);
      setSearchResults([]);
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
    setLoading(true); // Ensure loading is true on new search
    const searchParam = new URLSearchParams(location.search).get('q');
    fetchMedia(searchParam);
  }, [location.search, fetchMedia]);

  return (
    <div>
      {loading ? (
        <div className="loading-container">
          <Loader />
        </div>
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
