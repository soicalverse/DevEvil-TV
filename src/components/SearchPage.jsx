import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { searchMedia, getTrendingMedia } from '../services/tmdbService';
import MediaCard from './MediaCard';
import '../styles/Search.css';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      try {
        if (query.trim() !== '') {
          const results = await searchMedia(query);
          setSearchResults(results);
        } else {
          const trendingResults = await getTrendingMedia();
          setSearchResults(trendingResults);
        }
      } catch (error) {
        console.error("Failed to fetch media:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    const searchParam = new URLSearchParams(location.search).get('search');
    if (searchParam) {
      setQuery(searchParam);
    } else {
      fetchMedia();
    }
  }, [location.search]);

  useEffect(() => {
    const fetchQueryResults = async () => {
        if (query.trim() === '') {
            // Optionally, you could reload trending media here if the user clears the search
            // For now, it will just clear the results, which is also a valid approach.
            setSearchResults([]);
            return;
        }

        setLoading(true);
        try {
            const results = await searchMedia(query);
            setSearchResults(results);
        } catch (error) {
            console.error("Failed to fetch search results:", error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    // This will avoid running a search on the initial render if the query is set from the URL
    const searchParam = new URLSearchParams(location.search).get('search');
    if (query !== searchParam) {
        const handler = setTimeout(() => {
            fetchQueryResults();
        }, 500); // Debounce API calls

        return () => {
            clearTimeout(handler);
        };
    }
}, [query]);


  return (
    <div>
      <input
        className='search'
        type="text"
        placeholder="Search for movies and TV shows"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="search-results">
          {searchResults.map((media) => (
            <MediaCard key={media.id} media={media} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
