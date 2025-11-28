import React from 'react';
import PropTypes from 'prop-types';
import MediaCard from './MediaCard';
import DonationCard from './DonationCard';
import '../styles/Carousel.css';
import '../styles/main.css';
import '../styles/SeeMoreButton.css';
import useHorizontalScroll from '../hooks/useHorizontalScroll';

const Carousel = ({ items, type, handleSeeMore, showSeeMore }) => {
  const carouselRef = useHorizontalScroll();

  const itemsWithDonation = items.reduce((acc, item, index) => {
    acc.push(
      <div className="carousel-item" key={item.id}>
        <MediaCard item={item} type={type} />
      </div>
    );
    if ((index + 1) % 5 === 0) {
      acc.push(
        <div className="carousel-item" key={`donation-${index}`}>
          <DonationCard sectionId={type} />
        </div>
      );
    }
    return acc;
  }, []);

  return (
    <div className="carousel-container" ref={carouselRef}>
      <div className="carousel-wrapper">
        {itemsWithDonation}
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
