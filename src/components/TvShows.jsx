
import React, { useState, useEffect } from 'react';
import { getTrendingTvShows, getPopularTvShows, getUpcomingTvShows } from '../services/tmdbService';
import Carousel from './Carousel';
import '../styles/Movies.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTv } from '@fortawesome/free-solid-svg-icons';

const TvShows = () => {
  const [tvShows, setTvShows] = useState([]);
  const [page, setPage] = useState(1);
  const [showType, setShowType] = useState('trending');
  const [showSeeMore, setShowSeeMore] = useState(false);

  useEffect(() => {
    const fetchTvShows = async () => {
      let fetchFunction;
      if (showType === 'trending') {
        fetchFunction = getTrendingTvShows;
      } else if (showType === 'popular') {
        fetchFunction = getPopularTvShows;
      } else {
        fetchFunction = getUpcomingTvShows;
      }
      const response = await fetchFunction(page);
      setTvShows(prev => page === 1 ? response : [...prev, ...response]);
      setShowSeeMore(response.length > 0);
    };
    fetchTvShows();
  }, [page, showType]);

  const handleSeeMore = () => {
    setPage(prev => prev + 1);
    setShowSeeMore(false);
  };

  const handleShowTypeChange = (type) => {
    setShowType(type);
    setPage(1);
  }

  return (
    <div className="movies-section with-buttons">
      <div className="section-header">
        <div className="section-title">
            <FontAwesomeIcon icon={faTv} className="section-icon" />
            <h2>TV Shows</h2>
        </div>
        <div className="movie-type-buttons">
            <button onClick={() => handleShowTypeChange('trending')} className={showType === 'trending' ? 'active' : ''}>Trending</button>
            <button onClick={() => handleShowTypeChange('popular')} className={showType === 'popular' ? 'active' : ''}>Popular</button>
            <button onClick={() => handleShowTypeChange('upcoming')} className={showType === 'upcoming' ? 'active' : ''}>Upcoming</button>
        </div>
      </div>
      <Carousel items={tvShows} type="tv" handleSeeMore={handleSeeMore} showSeeMore={showSeeMore} />
    </div>
  );
};

export default TvShows;
