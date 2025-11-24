import React from 'react';
import '../../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      {/* Glow Effect */}
      <div className="footer-glow"></div>
      
      {/* Main Content */}
      <div className="footer-content">
        {/* Logo and Brand */}
        <div className="footer-brand">
          <img src="/assets/logo.png" alt="FilmFind Logo" className="footer-logo" />
          <span className="footer-title">FilmFind</span>
        </div>
        
        {/* Description */}
        <p className="footer-description text-glow">
        Beyond the screen, lies a universe of stories. Discover yours.
          <br />
          <span className="footer-tagline">Your cinematic journey begins here.</span>
        </p>
        
      </div>
      
      {/* Bottom Section */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-grid">
            
            {/* Navigation Links */}
            <nav className="footer-nav">
              <ul className="footer-nav-list">
                <li>
                  <a className="footer-link pulse" href="/about">
                    About
                  </a>
                </li>
                <li>
                  <a className="footer-link pulse" href="/contact">
                    Contact
                  </a>
                </li>
                <li>
                  <a className="footer-link pulse" href="/privacy">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </nav>
            
            {/* Social Links and Copyright */}
            <div className="footer-social-section">
              <div className="footer-social-container">
                {/* X / Twitter */}
                <a
                  target="_blank"
                  rel="noreferrer"
                  className="footer-social-link pulse"
                  href="https://x.com/filmfind.online"
                >
                  <span className="sr-only">X / Twitter</span>
                  <svg width="300" height="300" viewBox="0 0 300 300" className="footer-icon">
                    <path
                      fill="currentColor"
                      d="M178.57 127.15 290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59h89.34M36.01 19.54H76.66l187.13 262.13h-40.66"
                    ></path>
                  </svg>
                </a>
                
                {/* Github */}
                <a
                  target="_blank"
                  rel="noreferrer"
                  className="footer-social-link pulse"
                  href="https://github.com/filmfind.online"
                >
                  <span className="sr-only">Github</span>
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="footer-icon">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                  </svg>
                </a>
                
                {/* Instagram */}
                <a
                  target="_blank"
                  rel="noreferrer"
                  className="footer-social-link pulse"
                  href="https://www.instagram.com/filmfind.online"
                >
                  <span className="sr-only">Instagram</span>
                  <svg fill="currentColor" width="20" height="20" viewBox="0 0 24 24" className="footer-icon">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
              </div>
              
              {/* Copyright */}
              <span className="footer-copyright text-glow">
                © 2024 Your Company, Inc. All rights reserved.
              </span>
            </div>
            
          </div>
        </div>
      </div>
      <div className="mobile-footer-spacer"></div>
    </footer>
  );
};

export default Footer;
