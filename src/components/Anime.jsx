import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAnimeMovies } from '../services/tmdbService';
import Carousel from './Carousel';
import '../styles/Movies.css';

const Anime = () => {
  const [animeMovies, setAnimeMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [showSeeMore, setShowSeeMore] = useState(false);

  useEffect(() => {
    const source = axios.CancelToken.source();
    const fetchAnimeMovies = async () => {
      try {
        const response = await getAnimeMovies(page, source.token);
        setAnimeMovies(prev => page === 1 ? response : [...prev, ...response]);
        setShowSeeMore(response.length > 0);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error('Error fetching anime movies:', error);
        }
      }
    };
    fetchAnimeMovies();
    return () => {
      source.cancel('Component unmounted');
    };
  }, [page]);

  const handleSeeMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div className="movies-section">
      <div className="section-header">
          <h2>Anime Movies</h2>
      </div>
      <Carousel items={animeMovies} type="movie" handleSeeMore={handleSeeMore} showSeeMore={showSeeMore} />
    </div>
  );
};

export default Anime;
