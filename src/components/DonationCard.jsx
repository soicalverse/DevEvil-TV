import React, { useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import '../styles/DonationCard.css';
import DonationModal from './DonationModal';

const DonationCard = ({ sectionId }) => {
  const [showDonationModal, setShowDonationModal] = useState(false);
  const adId = `${sectionId}_donation_card`;

  return (
    <>
      <div id={adId} className="donation-card-container" onClick={() => setShowDonationModal(true)}>
        <DotLottieReact
          src="https://lottie.host/4658c2ad-1eb1-4e06-92c0-5804be4db662/2c6Uf62AnL.lottie"
          loop
          autoplay
        />
        <p className="donation-text">Donate</p>
      </div>
      <DonationModal show={showDonationModal} onClose={() => setShowDonationModal(false)} />
    </>
  );
};

export default DonationCard;
