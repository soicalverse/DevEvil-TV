import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import MobileNavBar from './MobileNavBar';
import PromoBanner from '../PromoBanner'; // Import PromoBanner
import DonationModal from '../DonationModal'; // Import DonationModal

const Layout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showDonationModal, setShowDonationModal] = useState(false);
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

  const shouldShowHeader = !location.pathname.includes('/player');

  return (
    <>
      {shouldShowHeader && (
        <>
          {isMobile ? <MobileNavBar /> : <NavBar />}
          <PromoBanner setShowDonationModal={setShowDonationModal} />
        </>
      )}
      <main>{children}</main>
      <DonationModal show={showDonationModal} onClose={() => setShowDonationModal(false)} />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
