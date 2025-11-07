import React from 'react';
import '../../styles/PlayerNavBar.css';

const PlayerNavBar = () => {
  const servers = ['VidFast', 'VIDEASY', 'MoviesAPI', 'SuperEmbed', 'VidSrc.pro', 'VidSrc.to'];

  return (
    <div className="player-navbar">
      <div className="player-nav-left">
        <a href="/" className="player-home-link">
          <i className="fas fa-home"></i>
        </a>
      </div>
      <div className="player-nav-center">
        {servers.map((server, index) => (
          <button key={index} className={`server-button ${index === 0 ? 'active' : ''}`}>
            {server}
          </button>
        ))}
      </div>
      <div className="player-nav-right">
        <div className="player-dropdown">
          <select name="season" id="season-select">
            <option value="1">Season 1</option>
            {/* Add other seasons here */}
          </select>
        </div>
        <div className="player-dropdown">
          <select name="episode" id="episode-select">
            <option value="1">Episode 1: The Pilot</option>
            {/* Add other episodes here */}
          </select>
        </div>
      </div>
    </div>
  );
};

export default PlayerNavBar;
