import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import '../styles/Player.css';
import { Link } from 'react-router-dom';

const Player = () => {
  const { id: routeId } = useParams();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const id = queryParams.get('id') || routeId || '';
  const season = queryParams.get('s') || '';
  const episode = queryParams.get('e') || '';

  let embedUrl;
  let detailsUrl;

  if (season && episode) {
    embedUrl = `https://multiembed.mov/?video_id=${encodeURIComponent(id)}&tmdb=1&s=${encodeURIComponent(season)}&e=${encodeURIComponent(episode)}`;
    detailsUrl = `/tv/${id}`
  } else {
    embedUrl = `https://multiembed.mov/?video_id=${encodeURIComponent(id)}&tmdb=1`;
    detailsUrl = `/movie/${id}`
  }

  return (
    <div         className='player'>
      <iframe
        title="player"
        src={embedUrl}
        frameBorder="0"
        allowFullScreen
      ></iframe>

<div className="overlay">
            <Link to="/">
              <i className="fa-solid fa-home"></i>
            </Link>

            <Link to={`${detailsUrl}`}>
              <i className="fa-solid fa-xmark"></i>
            </Link>

            
          </div>


    </div>
  );
};

export default Player;
