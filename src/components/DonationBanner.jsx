import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import '../styles/DonationBanner.css';

const DonationBanner = () => {
  return (
    <div className="donation-banner">
      <a href="#">
        <DotLottieReact
          src="https://lottie.host/4658c2ad-1eb1-4e06-92c0-5804be4db662/2c6Uf62AnL.lottie"
          loop
          autoplay
        />
        <p>Support us with a donation!</p>
      </a>
    </div>
  );
};

export default DonationBanner;
