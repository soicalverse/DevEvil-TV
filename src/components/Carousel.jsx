import React from 'react';
import PropTypes from 'prop-types';
import MediaCard from './MediaCard';
import '../styles/Carousel.css';
import '../styles/main.css';
import '../styles/SeeMoreButton.css';
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
          <div className="carousel-item">
            <div className="see-more-container" onClick={handleSeeMore}>
              <button className="see-more-button">See more</button>
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
