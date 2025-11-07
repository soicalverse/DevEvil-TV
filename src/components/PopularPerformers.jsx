import React, { useState, useEffect } from 'react';
import { getPopularPerformers } from '../services/tmdbService';
import Carousel from './Carousel';
import '../styles/Movies.css';

const PopularPerformers = () => {
  const [performers, setPerformers] = useState([]);
  const [page, setPage] = useState(1);
  const [showSeeMore, setShowSeeMore] = useState(false);

  useEffect(() => {
    const fetchPopularPerformers = async () => {
      const response = await getPopularPerformers(page);
      setPerformers(prev => page === 1 ? response : [...prev, ...response]);
      setShowSeeMore(response.length > 0);
    };
    fetchPopularPerformers();
  }, [page]);

  const handleSeeMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div className="movies-section">
      <div className="section-header">
          <h2>Popular Performers</h2>
      </div>
      <Carousel items={performers} type="person" handleSeeMore={handleSeeMore} showSeeMore={showSeeMore} />
    </div>
  );
};

export default PopularPerformers;
