
import React, { useState, useEffect } from 'react';
import { getTrendingMovies } from '../services/tmdbService';
import { Link } from 'react-router-dom';
import '../styles/Banner.css';

const Banner = () => {
  const [latestReleased, setLatestReleased] = useState(null);

  useEffect(() => {
    const fetchLatestReleased = async () => {
      try {
        const trendingMovies = await getTrendingMovies();
        const latestReleasedItem = trendingMovies[0];
        setLatestReleased(latestReleasedItem);
      } catch (error) {
        // Handle error
      }
    };

    fetchLatestReleased();
  }, []);

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <section className="banner" id="home">
      <div className="banner-card">
        {latestReleased && (
          <div className="banner-img-wrapper">
            <img
              className="banner-img"
              src={`https://image.tmdb.org/t/p/w1280/${latestReleased.backdrop_path}`}
              alt={latestReleased.title || latestReleased.name}
              key={latestReleased.id}
              draggable="false"
            />
          </div>
        )}

        <div className="card-content">
          <div className="title-wrapper">
            <h1 className="banner-title">{latestReleased && (latestReleased.title || latestReleased.name)}</h1>
          </div>
          {latestReleased && (
            <div className="card-info">
              <span>{latestReleased.release_date && latestReleased.release_date.substring(0, 4)}</span> •
              <span>{formatTime(latestReleased.runtime)}</span> •
              <span>{Math.round(latestReleased.vote_average * 10)}% liked</span>
            </div>
          )}
        </div>

        {latestReleased && (
          <div className="banner-nav">
            <Link to={`/player/${latestReleased.id}`} className="watch-now-button">
              Watch Now <i className="fa-solid fa-play"></i>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Banner;
