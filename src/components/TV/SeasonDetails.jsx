import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getSeasonEpisodes } from '../../services/tmdbService';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const SeasonDetails = ({ tvShowId, seasonNumber, tvShowBackdrop, episodes: initialEpisodes }) => {
  const [episodes, setEpisodes] = useState(initialEpisodes);

  useEffect(() => {
    if (!initialEpisodes || initialEpisodes.length === 0) {
        const source = axios.CancelToken.source();
        const fetchSeasonEpisodes = async () => {
            try {
                const seasonEpisodes = await getSeasonEpisodes(tvShowId, seasonNumber, source.token);
                setEpisodes(seasonEpisodes);
            } catch (error) {
                if (!axios.isCancel(error)) {
                    console.error(`Error fetching episodes for tvShowId: ${tvShowId} and season: ${seasonNumber}`, error);
                }
            }
        };

        fetchSeasonEpisodes();

        return () => {
            source.cancel('Component unmounted');
        };
    }
  }, [tvShowId, seasonNumber, initialEpisodes]);

  return (
    <div>
      <ul className='episode-ul'>
        {episodes.map((episode, index) => (
          <li className='episode-list' key={episode.id}>
            <Link to={`/player/${tvShowId}?e=${index + 1}&s=${seasonNumber}`}>
              <div
                className="episode-image-container"
                style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w500${tvShowBackdrop})` }}
              >
                {episode.still_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                    alt={episode.name}
                    className="episode-image"
                    draggable="false"
                  />
                ) : (
                    <div className="no-image-overlay"></div>
                )}
              </div>
            </Link>
            <div className='episode-details'>
              <p>{index + 1}. {episode.name}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

SeasonDetails.propTypes = {
  tvShowId: PropTypes.string.isRequired,
  seasonNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  tvShowBackdrop: PropTypes.string,
  episodes: PropTypes.array.isRequired,
};

SeasonDetails.defaultProps = {
    tvShowBackdrop: '',
};

export default SeasonDetails;
