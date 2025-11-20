import React from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Movies.css';

const MediaCard = ({ item, type }) => {
  if (!item) {
    return null;
  }

  const navigate = useNavigate();
  const { id, poster_path, profile_path, title, name } = item;
  const cardTitle = title || name;
  const imagePath = type === 'person' ? profile_path : poster_path;

  const linkDestination = type === 'person'
    ? `https://en.wikipedia.org/wiki/${name}`
    : `/${type}/${id}`;

  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(linkDestination);
  };

  const cardContent = (
    <div className="movie-card">
      <img src={`https://image.tmdb.org/t/p/w500${imagePath}`} alt={cardTitle} className="movie-image" />
      <div className="movie-info-overlay">
        <div className="movie-title-container">
          <h3 className="movie-title">{`${cardTitle} - ${cardTitle}`}</h3>
        </div>
        {type !== 'person' && (
          <div className="play-button-container">
            <button className="play-button" onClick={handlePlayClick}>
              <i className="fas fa-play"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (type === 'person') {
    return (
      <a href={linkDestination} target="_blank" rel="noopener noreferrer" className="movie-card-link">
        {cardContent}
      </a>
    );
  }

  return (
    <Link to={linkDestination} className="movie-card-link">
      {cardContent}
    </Link>
  );
};

MediaCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    poster_path: PropTypes.string,
    profile_path: PropTypes.string,
    title: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  type: PropTypes.string.isRequired,
};

export default MediaCard;
