import React, { useState, useEffect } from 'react';
import { getSeasonEpisodes } from '../../services/tmdbService';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../../styles/TvShowDetails.css'; // Ensure the CSS is imported

const SeasonDetails = ({ tvShowId, seasonNumber }) => {
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    const fetchSeasonEpisodes = async () => {
      try {
        // Fetch episodes and sort them by episode number to ensure correct order
        const seasonEpisodes = await getSeasonEpisodes(tvShowId, seasonNumber);
        const sortedEpisodes = seasonEpisodes.sort((a, b) => a.episode_number - b.episode_number);
        setEpisodes(sortedEpisodes);
      } catch (error) {
        console.error("Error fetching season episodes:", error); 
      }
    };

    fetchSeasonEpisodes(); 
  }, [tvShowId, seasonNumber]);

  return (
    <div className="episode-buttons-container">
      {episodes.map((episode) => (
        <Link 
          key={episode.id} 
          to={`/player/${tvShowId}?s=${seasonNumber}&e=${episode.episode_number}`}
          className="episode-glass-button"
        >
          <span className="episode-number">{`E${episode.episode_number}`}</span>
          <span className="episode-title">{episode.name}</span>
          <span className="episode-play-icon">
            <i className="fas fa-play"></i>
          </span>
        </Link>
      ))}
    </div>
  );
};

SeasonDetails.propTypes = {
  tvShowId: PropTypes.string.isRequired, // ID can be a string
  seasonNumber: PropTypes.number.isRequired,
};

export default SeasonDetails;
