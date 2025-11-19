import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const SeeMoreCard = ({ type }) => {
  return (
    <div className="see-more-card-container">
      <Link to={`/upcoming?type=${type}`} className="see-more-card">
        See more
      </Link>
    </div>
  );
};

SeeMoreCard.propTypes = {
  type: PropTypes.string.isRequired,
};

export default SeeMoreCard;
