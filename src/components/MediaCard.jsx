import React from 'react';
import { Link } from 'react-router-dom';

const MediaCard = ({ item, type }) => {
  if (!item) {
    return null;
  }

  const { id, poster_path, title, name } = item;
  const cardTitle = title || name;

  return (
    <div className="movie-card">
      <Link to={`/${type}/${id}`}>
        <img src={`https://image.tmdb.org/t/p/w500${poster_path}`} alt={cardTitle} className="card-img" />
        <div className="card-overlay">
          <div className="card-bottom-content">
            <h3 className="card-title">{cardTitle}</h3>
            <div className="play-button-hover">
              <i className="fa-solid fa-play"></i>
              <span>Play</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MediaCard;
