import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import MobileNavBar from './MobileNavBar';

const Layout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const shouldShowNavBar = !location.pathname.includes('/player');

  return (
    <>
      {shouldShowNavBar && (isMobile ? <MobileNavBar /> : <NavBar />)}
      {children}
    </>
  );
};

export default Layout;
