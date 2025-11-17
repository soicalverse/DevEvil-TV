import React from 'react';
import PropTypes from 'prop-types';
import '../styles/main.css';

const MediaCard = ({ item, type, fromSearchPage }) => {
  if (!item) {
    return null;
  }

  const { id, poster_path, profile_path, title, name } = item;
  const cardTitle = title || name;
  const imagePath = type === 'person' ? profile_path : poster_path;

  const CardContent = () => (
    <>
      <img src={`https://image.tmdb.org/t/p/w500${imagePath}`} alt={cardTitle} className="card-img" />
      <div className="card-overlay">
        <div className="card-bottom-content">
          <h3 className="card-title">{cardTitle}</h3>
          {type !== 'person' && (
            <div className="play-button-hover">
              <i className="fa-solid fa-play"></i>
              <span>Play</span>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const CardComponent = ({ children }) => {
    const commonProps = {
      className: "movie-card-link",
    };

    if (type === 'person') {
      return (
        <a href={`https://en.wikipedia.org/wiki/${name}`} target='_blank' rel='noreferrer noopener' {...commonProps}>
          {children}
        </a>
      );
    } else {
      return (
        <a href={`/${type}/${id}`} {...commonProps}>
          {children}
        </a>
      );
    }
  };

  return (
    <div className="movie-card">
      <CardComponent>
        <CardContent />
      </CardComponent>
      {fromSearchPage && <p className="movie-card-title" style={{margin: 0, textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{cardTitle}</p>}
    </div>
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
  fromSearchPage: PropTypes.bool,
};

MediaCard.defaultProps = {
  fromSearchPage: false,
};

export default MediaCard;
