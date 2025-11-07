import React, { useState, useEffect } from 'react';
import { getNowPlayingMovies } from '../services/tmdbService';
import Carousel from './Carousel';
import '../styles/Movies.css';

const NowPlaying = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [showSeeMore, setShowSeeMore] = useState(false);

  useEffect(() => {
    const fetchNowPlayingMovies = async () => {
      const response = await getNowPlayingMovies(page);
      setMovies(prev => page === 1 ? response : [...prev, ...response]);
      setShowSeeMore(response.length > 0);
    };
    fetchNowPlayingMovies();
  }, [page]);

  const handleSeeMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div className="movies-section">
      <div className="section-header">
          <h2>Now Playing Movies</h2>
      </div>
      <Carousel items={movies} type="movie" handleSeeMore={handleSeeMore} showSeeMore={showSeeMore} />
    </div>
  );
};

export default NowPlaying;
