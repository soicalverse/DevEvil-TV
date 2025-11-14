import React, { useState, useEffect } from 'react';
import Carousel from './Carousel';
import '../styles/Movies.css';

const PopularPerformers = () => {
  const [performers, setPerformers] = useState([]);
  const [page, setPage] = useState(1);
  const [showSeeMore, setShowSeeMore] = useState(false);

  useEffect(() => {
    const fetchPopularPerformers = async () => {
        const API_KEY = process.env.REACT_APP_API_KEY;
        const response = await fetch(`https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}&page=${page}`);
        const data = await response.json();
      if (data && data.results) {
        setPerformers(prev => page === 1 ? data.results : [...prev, ...data.results]);
        setShowSeeMore(data.results.length > 0);
      }
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
