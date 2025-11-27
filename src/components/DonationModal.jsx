import React from 'react';
import '../../src/styles/DonationModal.css';

const DonationModal = ({ show, onClose }) => {
  if (!show) {
    return null;
  }

  const handleGlobalDonation = () => {
    const isMobile = window.innerWidth < 768;
    const url = 'https://nowpayments.io/donation/Filmfind';
    if (isMobile) {
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleUzbekDonation = () => {
    // Placeholder for Uzbek donation link
    const isMobile = window.innerWidth < 768;
    const url = 'https://www.google.com/search?q=uzbekistan'; // Placeholder
    if (isMobile) {
        window.location.href = url;
    } else {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
  };


  return (
    <div className="donation-modal-overlay" onClick={onClose}>
      <div className="donation-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="donation-modal-close" onClick={onClose}>
          &times;
        </button>
        <h2>Support Us</h2>
        <p>Your contributions help us keep the service running.</p>
        <div className="donation-modal-buttons">
          <button className="donation-btn global" onClick={handleGlobalDonation}>
            Global Donation
          </button>
          <button className="donation-btn uzbek" onClick={handleUzbekDonation}>
            For Uzbeks
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;