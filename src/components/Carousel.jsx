import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import MediaCard from './MediaCard';
import '../styles/Carousel.css';

const Carousel = ({ items, type, handleSeeMore, showSeeMore }) => {
  const carouselRef = useRef(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    // --- Wheel Scroll ---
    const handleWheel = (e) => {
      e.preventDefault();
      carousel.scrollLeft += e.deltaY;
    };

    // --- Drag and Swipe Scroll ---
    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      carousel.classList.add('grabbing');
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      carousel.classList.remove('grabbing');
    };

    const handleMouseUp = () => {
      isDown = false;
      carousel.classList.remove('grabbing');
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 2; // Multiply for faster scrolling
      carousel.scrollLeft = scrollLeft - walk;
    };
    
    // --- Touch Events for Mobile ---
    const handleTouchStart = (e) => {
        isDown = true;
        const touch = e.touches[0];
        startX = touch.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    };

    const handleTouchMove = (e) => {
        if(!isDown) return;
        const touch = e.touches[0];
        const x = touch.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => {
        isDown = false;
    };


    // --- Add All Event Listeners ---
    carousel.addEventListener('wheel', handleWheel);
    carousel.addEventListener('mousedown', handleMouseDown);
    carousel.addEventListener('mouseleave', handleMouseLeave);
    carousel.addEventListener('mouseup', handleMouseUp);
    carousel.addEventListener('mousemove', handleMouseMove);
    carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
    carousel.addEventListener('touchmove', handleTouchMove, { passive: false });
    carousel.addEventListener('touchend', handleTouchEnd);

    // --- Cleanup ---
    return () => {
      carousel.removeEventListener('wheel', handleWheel);
      carousel.removeEventListener('mousedown', handleMouseDown);
      carousel.removeEventListener('mouseleave', handleMouseLeave);
      carousel.removeEventListener('mouseup', handleMouseUp);
      carousel.removeEventListener('mousemove', handleMouseMove);
      carousel.removeEventListener('touchstart', handleTouchStart);
      carousel.removeEventListener('touchmove', handleTouchMove);
      carousel.removeEventListener('touchend', handleTouchEnd);
    };
  }, []); // Empty dependency array ensures this runs only once

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
