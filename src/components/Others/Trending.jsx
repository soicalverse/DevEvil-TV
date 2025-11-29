
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getTrendingMovies, getTrendingTvShows } from '../../services/tmdbService';
import MediaCard from '../MediaCard';
import '../../styles/Carousel.css';
import useHorizontalScroll from '../../hooks/useHorizontalScroll';

const Carousel = ({ items, type }) => {
    const carouselRef = useHorizontalScroll();

    return (
        <div className="carousel-container" ref={carouselRef}>
            <div className="carousel-wrapper">
                {items.map(item => (
                    <div className="carousel-item" key={item.id}>
                        <MediaCard item={item} type={type} />
                    </div>
                ))}
            </div>
        </div>
    );
};

Carousel.propTypes = {
    items: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,
};

const Trending = ({ mediaType }) => {
    const [trending, setTrending] = useState([]);

    useEffect(() => {
        const fetchTrending = async () => {
            let trendingData;
            if (mediaType === 'movie') {
                trendingData = await getTrendingMovies();
            } else if (mediaType === 'tv') {
                trendingData = await getTrendingTvShows();
            }
            setTrending(trendingData || []);
        };

        fetchTrending();
    }, [mediaType]);

    return <Carousel items={trending} type={mediaType} />;
};

Trending.propTypes = {
    mediaType: PropTypes.string.isRequired,
};

export default Trending;
