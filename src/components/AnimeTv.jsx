import React, { useState, useEffect } from 'react';
import { getAnimeTv } from '../services/tmdbService';
import Carousel from './Carousel';
import '../styles/Movies.css';

const AnimeTv = () => {
  const [animeTv, setAnimeTv] = useState([]);
  const [page, setPage] = useState(1);
  const [showSeeMore, setShowSeeMore] = useState(false);

  useEffect(() => {
    const fetchAnimeTv = async () => {
      const response = await getAnimeTv(page);
      setAnimeTv(prev => page === 1 ? response : [...prev, ...response]);
      setShowSeeMore(response.length > 0);
    };
    fetchAnimeTv();
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
