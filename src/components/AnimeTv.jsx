import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAnimeTv } from '../services/tmdbService';
import Carousel from './Carousel';
import '../styles/Movies.css';

const AnimeTv = () => {
  const [animeTv, setAnimeTv] = useState([]);
  const [page, setPage] = useState(1);
  const [showSeeMore, setShowSeeMore] = useState(false);

  useEffect(() => {
    const source = axios.CancelToken.source();
    const fetchAnimeTv = async () => {
      try {
        const response = await getAnimeTv(page, source.token);
        setAnimeTv(prev => page === 1 ? response : [...prev, ...response]);
        setShowSeeMore(response.length > 0);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error('Error fetching anime TV shows:', error);
        }
      }
    };
    fetchAnimeTv();
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
          <h2>Anime TV Shows</h2>
      </div>
      <Carousel items={animeTv} type="tv" handleSeeMore={handleSeeMore} showSeeMore={showSeeMore} />
    </div>
  );
};

export default AnimeTv;
