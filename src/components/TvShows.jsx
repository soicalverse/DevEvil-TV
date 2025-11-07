import React, { useState, useEffect } from 'react';
import { getTrendingTvShows, getPopularTvShows, getUpcomingTvShows } from '../services/tmdbService';
import Carousel from './Carousel';
import '../styles/Movies.css';

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
    <div className="movies-section">
      <div className="section-header">
          <h2>TV Shows <i className="fa-solid fa-tv"></i></h2>
          <div className="movie-type-buttons">
              <button className={showType === 'trending' ? 'active' : ''} onClick={() => handleShowTypeChange('trending')}>Trending</button>
              <button className={showType === 'popular' ? 'active' : ''} onClick={() => handleShowTypeChange('popular')}>Popular</button>
              <button className={showType === 'upcoming' ? 'active' : ''} onClick={() => handleShowTypeChange('upcoming')}>Upcoming</button>
          </div>
      </div>
      <Carousel items={tvShows} type="tv" handleSeeMore={handleSeeMore} showSeeMore={showSeeMore} />
    </div>
  );
};

export default TvShows;
