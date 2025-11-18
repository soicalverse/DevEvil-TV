import React, { useState, useEffect } from 'react';
import { getNowPlayingMovies } from '../../services/tmdbService';
import MediaCard from '../MediaCard';
import '../../styles/SideButtons.css';

const SideButtons = () => {
    const [nowPlaying, setNowPlaying] = useState([]);

    useEffect(() => {
        const fetchNowPlaying = async () => {
            const nowPlayingMovies = await getNowPlayingMovies();
            setNowPlaying(nowPlayingMovies.results.slice(0, 5)); // show first 5
        };

        fetchNowPlaying();
    }, []);

    return (
        <div className="side-buttons-container">
            <h3 className="side-buttons-title">Now Playing</h3>
            <div className="side-buttons-list">
                {nowPlaying.map(movie => (
                    <MediaCard key={movie.id} item={movie} type="movie" />
                ))}
            </div>
        </div>
    );
};

export default SideButtons;
