import React, { useState } from 'react';
import PropTypes from 'prop-types';
import NavBar from './NavBar';
import MobileNavBar from './MobileNavBar';
import PromoBanner from '../PromoBanner';
import DonationModal from '../DonationModal';
import AdblockerModal from '../AdblockerModal';

const Layout = ({ children }) => {
  const [showDonationModal, setShowDonationModal] = useState(false);

  return (
    <div className="main-layout">
      <PromoBanner setShowDonationModal={setShowDonationModal} />
      <NavBar />
      <MobileNavBar />
      <main className="main-content">
        {children}
      </main>
      <DonationModal show={showDonationModal} onClose={() => setShowDonationModal(false)} />
      <AdblockerModal />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
