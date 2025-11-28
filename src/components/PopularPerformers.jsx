import React, { useState, useEffect } from 'react';
import Carousel from './Carousel';
import '../styles/Movies.css';
import axios from 'axios';

const PopularPerformers = () => {
  const [performers, setPerformers] = useState([]);
  const [page, setPage] = useState(1);
  const [showSeeMore, setShowSeeMore] = useState(false);

  useEffect(() => {
    const source = axios.CancelToken.source();
    const fetchPopularPerformers = async () => {
      try {
        const API_KEY = process.env.REACT_APP_API_KEY;
        const response = await axios.get(`https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}&page=${page}`, { cancelToken: source.token });
        if (response.data && response.data.results) {
          setPerformers(prev => page === 1 ? response.data.results : [...prev, ...response.data.results]);
          setShowSeeMore(response.data.results.length > 0);
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error('Error fetching popular performers:', error);
        }
      }
    };
    fetchPopularPerformers();

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
          <h2>Popular Performers</h2>
      </div>
      <Carousel items={performers} type="person" handleSeeMore={handleSeeMore} showSeeMore={showSeeMore} />
    </div>
  );
};

export default PopularPerformers;
