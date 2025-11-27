import React from 'react';
import '../styles/PromoBanner.css';

const PromoBanner = ({ setShowDonationModal }) => {
    return (
        <div className="promo-banner-container">
            <div className="promo-banner">
                {/* Left Curve SVG */}
                <svg className="banner-curve left" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M16 0H0V16C0 7.16344 7.16344 0 16 0Z" />
                </svg>

                {/* Main Content */}
                <div className="logo-section">
                    <img src="/assets/logo2.png" alt="Logo" className="promo-logo" />
                </div>

                <div className="promo-text-section">
                    <span className="main-promo-text">Every gift keeps the stream alive, thank you!</span>
                </div>

                <div className="promo-action-section">
                    <button className="donate-button" onClick={() => setShowDonationModal(true)}>
                        <img src="/assets/gift-box.png" alt="Donate" className="donate-icon" />
                        <span>Donate</span>
                    </button>
                </div>

                {/* Right Curve SVG */}
                <svg className="banner-curve right" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M16 0H0V16C0 7.16344 7.16344 0 16 0Z" />
                </svg>
            </div>
        </div>
    );
};

export default PromoBanner;
