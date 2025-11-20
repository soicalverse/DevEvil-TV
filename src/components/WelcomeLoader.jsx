import React, { useState, useEffect } from 'react';
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

export default WelcomeLoader;
