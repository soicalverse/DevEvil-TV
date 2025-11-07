
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

  return (
    <div className="movies-section">
      <div className="section-header">
          <h2>TV Shows <i className="fa-solid fa-tv"></i></h2>
      </div>
      <Carousel items={tvShows} type="tv" handleSeeMore={handleSeeMore} showSeeMore={showSeeMore} />
    </div>
  );
};

export default TvShows;
