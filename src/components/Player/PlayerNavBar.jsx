
import React, { useState } from 'react';
import '../../styles/PlayerNavBar.css';

const PlayerNavBar = () => {
  const [isServerOpen, setIsServerOpen] = useState(false);
  const servers = ['VIDEASY', 'VidLink', 'VidFast', 'MoviesAPI', 'SuperEmbed', 'VidSrc.pro', 'VidSrc.to'];

  const toggleServerDropdown = () => {
    setIsServerOpen(!isServerOpen);
  };

  return (
    <div className="player-overlay-nav">
      {/* Top bar for Home and Close buttons */}
      <div className="player-nav-top">
        <a href="/">
          <i className="fa-solid fa-home"></i>
        </a>
        <a href="/tv/213402">
          <i className="fa-solid fa-xmark"></i>
        </a>
      </div>

      {/* Main container for all selectors */}
      <div className="selectors-container">
        <div className="source-selector-wrapper">
          <div className="server-info">
            <i className="fa-solid fa-info-circle"></i>
            <span>If the movie isn't working, try changing the server.</span>
          </div>
          <div className="source-selector">
            {servers.slice(0, 4).map((server, index) => (
              <button key={index} className={`source-btn ${index === 0 ? 'active' : ''}`}>
                {server}
              </button>
            ))}
            {servers.length > 4 && (
                <button className={`dropdown-toggle ${isServerOpen ? 'open' : ''}`} onClick={toggleServerDropdown}>
                  <i className="fa-solid fa-chevron-down"></i>
                </button>
            )}
          </div>

          {/* Conditionally render the container for extra servers */}
          {isServerOpen && (
             <div className="extra-servers-container">
                {servers.slice(4).map((server, index) => (
                  <button key={index} className="source-btn">{server}</button>
                ))}
              </div>
          )}
        </div>

        <div className="episode-selector">
          <div className="custom-dropdown">
            <div className="dropdown-selected">
              Season 1
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
          <div className="custom-dropdown">
            <div className="dropdown-selected">
              Episode 2: The Salient Familiar Is a Living Legend
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerNavBar;
