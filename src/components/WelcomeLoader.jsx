import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PyramidLoader from './PyramidLoader';

const WelcomeLoader = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisited');

    if (hasVisited) {
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem('hasVisited', 'true');
    }, 1200); // Display loader for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return loading ? <div className="loading-container"><PyramidLoader /></div> : children;
};

WelcomeLoader.propTypes = {
  children: PropTypes.node.isRequired,
};

export default WelcomeLoader;
