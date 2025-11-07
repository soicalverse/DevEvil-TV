import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import '../styles/Player.css';
import { getTvShowDetails } from '../services/tmdbService';

const sources = [
  {
    name: 'VidFast',
    movieUrl: (id) => `https://vidfast.pro/movie/${id}`,
    tvUrl: (id, s, e) => `https://vidfast.pro/tv/${id}/${s}/${e}`,
  },
  {
    name: 'VIDEASY',
    movieUrl: (id) => `https://player.videasy.net/movie/${id}`,
    tvUrl: (id, s, e) => `https://player.videasy.net/tv/${id}/${s}/${e}`,
  },
  {
    name: 'MoviesAPI',
    movieUrl: (id) => `https://moviesapi.club/movie/${id}`,
    tvUrl: (id, s, e) => `https://moviesapi.club/tv/${id}/${s}/${e}`,
  },
  {
    name: 'SuperEmbed',
    movieUrl: (id) => `https://superembed.stream/movie/${id}`,
    tvUrl: (id, s, e) => `https://superembed.stream/tv/${id}/${s}/${e}`,
  },
  {
    name: 'VidSrc.pro',
    movieUrl: (id) => `https://vidsrc.pro/embed/movie/${id}`,
    tvUrl: (id, s, e) => `https://vidsrc.pro/embed/tv/${id}/${s}/${e}`,
  },
   {
    name: 'VidSrc.to',
    movieUrl: (id) => `https://vidsrc.to/embed/movie/${id}`,
    tvUrl: (id, s, e) => `https://vidsrc.to/embed/tv/${id}/${s}/${e}`,
  },
];

const Player = () => {
  const { id: routeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const getParams = (search) => {
    const queryParams = new URLSearchParams(search);
    const id = queryParams.get('id') || routeId || '';
    const season = queryParams.get('s') || '';
    const episode = queryParams.get('e') || '';
    return { id, season, episode };
  };

  const [params, setParams] = useState(getParams(location.search));
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [detailsUrl, setDetailsUrl] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  const [sourceIndex, setSourceIndex] = useState(0);

  useEffect(() => {
    const newParams = getParams(location.search);
    setParams(newParams);
    setSourceIndex(0);
  }, [location.search, routeId]);

  useEffect(() => {
    const { id, season, episode } = params;
    if (id) {
      const source = sources[sourceIndex];
      const newUrl = season && episode ? source.tvUrl(id, season, episode) : source.movieUrl(id);
      setEmbedUrl(newUrl);

      if (season && episode) setDetailsUrl(`/tv/${id}`);
      else setDetailsUrl(`/movie/${id}`);
    }
  }, [params, sourceIndex]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (params.id && params.season) {
        try {
          const details = await getTvShowDetails(params.id);
          if (details && details.seasons) {
            setSeasons(details.seasons);
            const currentSeasonData = details.seasons.find(s => s.season_number === parseInt(params.season, 10));
            if (currentSeasonData && currentSeasonData.episodes) {
              setEpisodes(currentSeasonData.episodes);
            }
          }
        } catch (error) {
          console.error("Failed to fetch TV show details:", error);
        }
      }
    };
    fetchDetails();
  }, [params.id, params.season]);

  const handleSeasonChange = (e) => {
    const newSeason = e.target.value;
    const seasonData = seasons.find(s => s.season_number === parseInt(newSeason, 10));
    if (seasonData && seasonData.episodes && seasonData.episodes.length > 0) {
      const firstEpisode = seasonData.episodes[0].episode_number;
      navigate(`/player/${params.id}?s=${newSeason}&e=${firstEpisode}`);
    }
  };

  const handleEpisodeChange = (e) => {
    const newEpisode = e.target.value;
    navigate(`/player/${params.id}?s=${params.season}&e=${newEpisode}`);
  };

  return (
    <div className='player'>
      {embedUrl && (
        <iframe
          key={embedUrl}
          title="player"
          src={embedUrl}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      )}

      <div className="player-overlay-nav">
        <Link to="/">
          <i className="fa-solid fa-home"></i>
        </Link>

        <div className="source-selector">
          {sources.map((source, index) => (
            <button
              key={source.name}
              className={`source-btn ${index === sourceIndex ? 'active' : ''}`}
              onClick={() => setSourceIndex(index)}
            >
              {source.name}
            </button>
          ))}
        </div>

        {params.season && (
          <div className="episode-selector">
            <select value={params.season} onChange={handleSeasonChange}>
              {seasons.map(s => (
                <option key={s.season_number} value={s.season_number}>
                  Season {s.season_number}
                </option>
              ))}
            </select>
            <select value={params.episode} onChange={handleEpisodeChange}>
              {episodes.map(ep => (
                <option key={ep.id} value={ep.episode_number}>
                  Episode {ep.episode_number}: {ep.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {detailsUrl && (
          <Link to={detailsUrl}>
            <i className="fa-solid fa-xmark"></i>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Player;
