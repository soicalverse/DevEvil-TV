import React from 'react';
import '../../src/styles/DonationModal.css';

const DonationModal = ({ show, onClose }) => {

    if (!show) {
        return null;
    }

    const handleDonationClick = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className={`donation-modal-overlay ${show ? 'show' : ''}`} onClick={onClose}>
            <div className="donation-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="donation-modal-close" onClick={onClose}>&times;</button>

                <div className="donation-modal-header">
                    <h2>Support Us</h2>
                    <p>Your contributions help us keep the service running.</p>
                </div>

                <div className="donation-options">
                    <button 
                        className="donation-option-btn"
                        onClick={() => handleDonationClick('https://nowpayments.io/donation/Filmfind')}
                    >
                        <img src="https://nowpayments.io/images/logo/logo.svg" alt="Donate with NowPayments" />
                    </button>
                    <button 
                        className="donation-option-btn"
                        onClick={() => handleDonationClick('https://tirikchilik.uz/filmfind')}
                    >
                        <img src="https://tirikchilik.uz/assets/logo-28859fe5.svg" alt="Donate with Tirikchilik" />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default DonationModal;
