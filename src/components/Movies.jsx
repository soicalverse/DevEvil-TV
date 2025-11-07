import React, { useState, useEffect } from 'react';
import { getTrendingMovies, getPopularMovies } from '../services/tmdbService';
import Carousel from './Carousel';
import '../styles/Movies.css';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [movieType, setMovieType] = useState('trending');
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

  const handleMovieTypeChange = (type) => {
    setMovieType(type);
    setPage(1);
  }

  return (
    <div className="movies-section">
      <div className="section-header">
          <h2>Movies</h2>
          <div className="movie-type-buttons">
              <button className={movieType === 'trending' ? 'active' : ''} onClick={() => handleMovieTypeChange('trending')}>Trending</button>
              <button className={movieType === 'popular' ? 'active' : ''} onClick={() => handleMovieTypeChange('popular')}>Popular</button>
          </div>
      </div>
      <Carousel items={movies} type="movie" handleSeeMore={handleSeeMore} showSeeMore={showSeeMore} />
    </div>
  );
};

export default Movies;
