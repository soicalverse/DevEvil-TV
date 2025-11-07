
import React, { useState, useEffect } from 'react';
import { getTrendingMovies, getPopularMovies } from '../services/tmdbService';
import Carousel from './Carousel';
import '../styles/Movies.css';

const Movies = ({ movieType, page, setPage }) => {
  const [movies, setMovies] = useState([]);
  const [showSeeMore, setShowSeeMore] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      const fetchFunction = movieType === 'trending' ? getTrendingMovies : getPopularMovies;
      const response = await fetchFunction(page);
      setMovies(prev => page === 1 ? response : [...prev, ...response]);
      setShowSeeMore(response.length > 0);
    };
    fetchMovies();
  }, [page, movieType]);

  const handleSeeMore = () => {
    setPage(prev => prev + 1);
    setShowSeeMore(false);
  };

  return (
    <div className="movies-section">
      <Carousel items={movies} type="movie" handleSeeMore={handleSeeMore} showSeeMore={showSeeMore} />
    </div>
  );
};

export default Movies;
