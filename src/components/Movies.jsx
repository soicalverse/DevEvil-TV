
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getTrendingMovies, getPopularMovies, getUpcomingMovies } from '../services/tmdbService';
import Carousel from './Carousel';
import '../styles/Movies.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm } from '@fortawesome/free-solid-svg-icons';

const Movies = ({ movieType, page, setPage, onMovieTypeChange }) => {
  const [movies, setMovies] = useState([]);
  const [showSeeMore, setShowSeeMore] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      let fetchFunction;
      if (movieType === 'trending') {
        fetchFunction = getTrendingMovies;
      } else if (movieType === 'popular') {
        fetchFunction = getPopularMovies;
      } else {
        fetchFunction = getUpcomingMovies;
      }
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
    <div className="movies-section with-buttons">
      <div className="section-header">
          <h2><FontAwesomeIcon icon={faFilm} /> Movies</h2>
          <div className="movie-type-buttons">
            <button onClick={() => onMovieTypeChange('trending')} className={movieType === 'trending' ? 'active' : ''}>Trending</button>
            <button onClick={() => onMovieTypeChange('popular')} className={movieType === 'popular' ? 'active' : ''}>Popular</button>
            <button onClick={() => onMovieTypeChange('upcoming')} className={movieType === 'upcoming' ? 'active' : ''}>Upcoming</button>
          </div>
      </div>
      <Carousel items={movies} type="movie" handleSeeMore={handleSeeMore} showSeeMore={showSeeMore} />
    </div>
  );
};

Movies.propTypes = {
  movieType: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  onMovieTypeChange: PropTypes.func.isRequired,
};

export default Movies;
