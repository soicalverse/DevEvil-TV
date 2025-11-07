import React, { useState, useEffect } from 'react';
import { getAnimeMovies } from '../services/tmdbService';
import Carousel from './Carousel';
import '../styles/Movies.css';

const Anime = () => {
  const [animeMovies, setAnimeMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [showSeeMore, setShowSeeMore] = useState(false);

  useEffect(() => {
    const fetchAnimeMovies = async () => {
      const response = await getAnimeMovies(page);
      setAnimeMovies(prev => page === 1 ? response : [...prev, ...response]);
      setShowSeeMore(response.length > 0);
    };
    fetchAnimeMovies();
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
