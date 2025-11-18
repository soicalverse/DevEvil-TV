import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const SeeMoreCard = ({ type }) => {
  return (
    <div className="see-more-card-container">
      <Link to={`/upcoming?type=${type}`} className="see-more-card">
        <i className="fas fa-arrow-right"></i>
      </Link>
    </div>
  );
};

SeeMoreCard.propTypes = {
  type: PropTypes.string.isRequired,
};

export default SeeMoreCard;
