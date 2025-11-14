import React from 'react';
import PropTypes from 'prop-types';
import MediaCard from './MediaCard';
import '../styles/Carousel.css';
import useHorizontalScroll from '../hooks/useHorizontalScroll';

const Carousel = ({ items, type, handleSeeMore, showSeeMore }) => {
  const carouselRef = useHorizontalScroll();

  return (
    <div className="carousel-container" ref={carouselRef}>
      <div className="carousel-wrapper">
        {items.map((item) => (
          <div className="carousel-item" key={item.id}>
            <MediaCard item={item} type={type} />
          </div>
        ))}
        {showSeeMore && (
          <div className="see-more-card-container">
            <div className="see-more-card" onClick={handleSeeMore}>
              <i className="fas fa-arrow-right"></i>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Carousel.propTypes = {
  items: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  handleSeeMore: PropTypes.func.isRequired,
  showSeeMore: PropTypes.bool.isRequired,
};

export default Carousel;
