import React, { useState } from 'react';
import PropTypes from 'prop-types';
import NavBar from './NavBar';
import MobileNavBar from './MobileNavBar';
import PromoBanner from '../PromoBanner';
import DonationModal from '../DonationModal';
import AdblockerModal from '../AdblockerModal';
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

const Layout = ({ children }) => {
  const [showDonationModal, setShowDonationModal] = useState(false);

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
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
    </ClerkProvider>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
