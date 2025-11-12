import React from 'react';

const VidLinkPlayer = ({ tmdbId, season, episode, type }) => {
  let src = '';
  if (type === 'movie') {
    src = `https://vidlink.pro/movie/${tmdbId}`;
  } else {
    src = `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}`;
  }

  return (
    <iframe
      src={src}
      frameBorder="0"
      allowFullScreen
      style={{ width: '100%', height: '100%' }}
    ></iframe>
  );
};

export default VidLinkPlayer;
