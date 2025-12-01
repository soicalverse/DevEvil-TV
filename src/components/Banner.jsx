import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getTrendingMovies } from '../services/tmdbService';
import { Link } from 'react-router-dom';

const Banner = () => {
  const [latestReleased, setLatestReleased] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const source = axios.CancelToken.source();
    const fetchLatestReleased = async () => {
      try {
        const trendingMovies = await getTrendingMovies(1, source.token);
        const latestReleasedItem = trendingMovies[0];
        setLatestReleased(latestReleasedItem);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error('Error fetching latest released movie:', error);
        }
      }
    };

    fetchLatestReleased();

    return () => {
      source.cancel('Component unmounted');
    };
  }, []);

  const formatTime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  if (!latestReleased) {
    return (
        <section className="banner" id="home">
            <div className="banner-card">
                {/* Loading Skeleton can be placed here */}
            </div>
        </section>
    );
  }

  const watchNowPath = isMobile ? `/movie/${latestReleased.id}` : `/player/${latestReleased.id}`;
  const watchNowClasses = `watch-now-button ${isMobile ? '' : 'watch-now'}`;

  return (
    <section className="banner" id="home">
      <div className="banner-card">
        <div className="banner-img-wrapper">
            <img
              className="banner-img"
              src={`https://image.tmdb.org/t/p/w1280/${latestReleased.backdrop_path}`}
              alt={latestReleased.title || latestReleased.name}
              key={latestReleased.id}
              draggable="false"
            />
        </div>

        <div className="card-content">
          <div className="title-wrapper">
            <h1 className="banner-title">{latestReleased.title || latestReleased.name}</h1>
          </div>
          <div className="card-info">
              <span>{latestReleased.release_date ? latestReleased.release_date.substring(0, 4) : 'N/A'}</span> •
              <span>{formatTime(latestReleased.runtime)}</span> •
              <span>{latestReleased.vote_average ? `${Math.round(latestReleased.vote_average * 10)}% liked` : 'N/A'}</span>
          </div>
          <div className="banner-nav">
              <Link to={watchNowPath} className={watchNowClasses}>
                Watch Now <i className="fa-solid fa-play"></i>
              </Link>
              <Link to={`/movie/${latestReleased.id}`} className="insights-button">
                Insights
              </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
