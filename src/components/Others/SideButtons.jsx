import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/Btn.css';

const SideButtons = () => {
  const [showScroll, setShowScroll] = useState(false);
  const location = useLocation();

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 400){ 
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 400){ 
      setShowScroll(false);
    }
  };

  const scrollTop = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  useEffect(() => {
    window.addEventListener('scroll', checkScrollTop)
    return () => window.removeEventListener('scroll', checkScrollTop)
  }, [showScroll]);

  const isHomePage = location.pathname === '/' || location.pathname === '/home';

  return (
    <div className="floating-buttons-container">
       {showScroll && isHomePage && (
        <a onClick={scrollTop} className="floating-btn" title="Go to top">
            <i className='fas fa-arrow-up'></i>
        </a>
      )}
      {location.pathname === '/search' && (
        <a href="/" className="floating-btn" title="Home">
          <i className='fas fa-home'></i>
        </a>
      )}
    </div>
  );
};

export default SideButtons;
