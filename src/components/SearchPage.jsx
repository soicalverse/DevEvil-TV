import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { searchMedia, getTrendingMedia } from '../services/tmdbService';
import MediaCard from './MediaCard';
import '../styles/Search.css';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const fetchMedia = useCallback(async (searchQuery) => {
    setLoading(true);
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
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const searchParam = new URLSearchParams(location.search).get('query');
    fetchMedia(searchParam);
  }, [location.search, fetchMedia]);

  return (
    <div>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="search-results">
          {searchResults.map((media) => (
            <MediaCard key={media.id} item={media} type={media.media_type} fromSearchPage={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
