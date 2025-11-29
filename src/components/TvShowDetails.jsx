
import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import axios from 'axios';
import MediaCard from './MediaCard';
import { useParams, useLocation, useNavigate } from "react-router-dom";
import YouTube from "react-youtube";
import "../../src/styles/MovieDetails.css";
import SeasonDetails from './TV/SeasonDetails';
import { getTvShowDetails } from "../services/tmdbService";
import useHorizontalScroll from "../hooks/useHorizontalScroll";
import CustomDropdown from './CustomDropdown';
import ShareModal from "./Share/ShareModal";
import { Helmet } from 'react-helmet-async';
import '../styles/Carousel.css';
import Trending from "./Others/Trending";
import Footer from "./Others/Footer";
import Loader from "./Loader";
import { blockedMedia } from '../blockedMedia';
import BlockedContent from './BlockedContent';
import DonationModal from './DonationModal';
import AdblockerModal from './AdblockerModal';
import adblockDetector from '../adblockDetector';

// Carousel Components
const Carousel = ({ items, type, handleSeeMore, showSeeMore = false }) => {
  const carouselRef = useHorizontalScroll();
  return (
    <div className="carousel-container" ref={carouselRef}>
      <div className="carousel-wrapper">
        {(items || []).map((item) => (
          <div className="carousel-item" key={item.id}>
            <MediaCard item={item} type={type} />
          </div>
        ))}
      </div>
    </div>
  );
};
Carousel.propTypes = { items: PropTypes.array, type: PropTypes.string.isRequired, handleSeeMore: PropTypes.func, showSeeMore: PropTypes.bool };

const CastCarousel = ({ items }) => {
  const carouselRef = useHorizontalScroll();
  const placeholderImg = '/assets/user.png';

  const handleImageError = (e) => {
    e.target.onerror = null; 
    e.target.src = placeholderImg;
  };

  return (
    <div className="carousel-container" ref={carouselRef}>
      <div className="carousel-wrapper">
        {(items || []).map((item) => (
          <div className="carousel-item" key={item.id}>
            <div className="cast-card">
              <img 
                src={item.profile_path ? `https://image.tmdb.org/t/p/w200/${item.profile_path}` : placeholderImg}
                alt={item.name} 
                className="cast-image" 
                onError={handleImageError} 
              />
              <div className="cast-info">
                <p className="cast-name">{item.name}</p>
                <p className="cast-character">{item.character}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
CastCarousel.propTypes = { items: PropTypes.array };

const TvShowDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("seasons");
  const [media, setMedia] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showPoster, setShowPoster] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [showShareModal, setShowShareModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showAdblockModal, setShowAdblockModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    const source = axios.CancelToken.source();

    const isMediaBlocked = blockedMedia.some(item => item.id.toString() === id && item.type === 'tv');

    if (isMediaBlocked) {
      setIsBlocked(true);
      setLoading(false);
      return;
    }

    setIsBlocked(false);

    const fetchData = async () => {
      try {
        const data = await getTvShowDetails(id, source.token);
        setMedia(data);
        const trailer = data.videos?.results?.find(vid => vid.type === "Trailer");
        setTrailerKey(trailer?.key);
        if (data.seasons && data.seasons.length > 0) {
          const firstSeason = data.seasons.find(s => s.season_number > 0) || data.seasons[0];
          setSelectedSeason(firstSeason.season_number);
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Error fetching media details:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    return () => {
      source.cancel('Component unmounted');
    };
  }, [id]);
  
  const playerPath = `/player/${id}?s=${selectedSeason}&e=1`;

  const handlePlayClick = async () => {
    const isAdblockerActive = await adblockDetector();

    if (isAdblockerActive) {
      navigate(playerPath);
    } else {
      setShowAdblockModal(true);
    }
  };

  const handleWatchTrailer = () => {
    if (trailerKey) setShowTrailer(true);
  };
  const handleCloseTrailer = () => setShowTrailer(false);
  const handlePosterClick = () => setShowPoster(true);
  const handleClosePoster = () => setShowPoster(false);

  if (loading) {
    return <div className="loading-container"><Loader /></div>;
  }

  if (isBlocked) {
    return <BlockedContent title="Sorry, this 18+ content is not available." message="This is a family-friendly movie site." />;
  }

  if (!media) return <div></div>;

  const { name, first_air_date, genres, number_of_seasons, vote_average, overview, backdrop_path, poster_path, recommendations, credits, reviews, seasons } = media;
  const mediaTitle = name;
  const releaseYear = first_air_date ? new Date(first_air_date).getFullYear() : 'N/A';
  const genreNames = (genres || []).map((g) => g.name).join(" ");
  const duration = `${number_of_seasons} Seasons`;

  const selectedSeasonData = seasons ? seasons.find(s => s.season_number === selectedSeason) : null;
  const episodesForSeason = selectedSeasonData ? selectedSeasonData.episodes : [];
  const seasonOptions = (seasons || []).filter(s => s.season_number > 0).map(s => ({ value: s.season_number, label: s.name }));

  const pageUrl = window.location.href;
  const posterUrl = `https://image.tmdb.org/t/p/w500${poster_path}`;

  return (
    <>
      <Helmet>
        <title>{mediaTitle}</title>
        <meta name="description" content={overview} />
        <meta property="og:title" content={mediaTitle} />
        <meta property="og:description" content={overview} />
        <meta property="og:image" content={posterUrl} />
        <meta property="og:url" content={pageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={mediaTitle} />
        <meta name="twitter:description" content={overview} />
        <meta name="twitter:image" content={posterUrl} />
      </Helmet>
      <div className="movie-details-page">
        <div className="movie-details-background" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${backdrop_path})` }}></div>
        <div className="page-overlay"></div>
        {showTrailer && trailerKey && (
          <div className="youtube-overlay" onClick={handleCloseTrailer}>
            <div className="youtube-container">
              <YouTube videoId={trailerKey} opts={{ width: "100%", height: "100%" }} className="youtube-player-wrapper" />
              <button className="close-trailer-button" onClick={handleCloseTrailer}>&times;</button>
            </div>
          </div>
        )}
        {showPoster && (
          <div className="poster-lightbox-overlay" onClick={handleClosePoster}>
            <div className="poster-lightbox-content">
              <img src={`https://image.tmdb.org/t/p/w780/${poster_path}`} alt={mediaTitle} />
            </div>
            <button className="close-poster-button" onClick={handleClosePoster}>&times;</button>
          </div>
        )}

        <ShareModal 
          show={showShareModal} 
          onClose={() => setShowShareModal(false)} 
          title={mediaTitle} 
          url={pageUrl} 
          overview={overview} 
          posterPath={poster_path} 
        />
        
        <DonationModal show={showDonationModal} onClose={() => setShowDonationModal(false)} />

        <AdblockerModal show={showAdblockModal} onClose={() => setShowAdblockModal(false)} />

        <div className="movie-details-body px-4 sm:px-6 md:px-8 lg:px-10 pt-32 sm:pt-40 md:pt-48 lg:pt-56">
          <div className="movie-details-main-content">
            <div className="movie-details-container">
              <section className="movie-details-header-section">
                <div className="movie-details-header">
                  <div className="movie-poster-mobile-wrapper" onClick={handlePosterClick}>
                      <img src={`https://image.tmdb.org/t/p/w500/${poster_path}`} alt={mediaTitle} className="movie-poster-mobile" />
                  </div>
                  <div className="movie-details-info">
                    <h1 className="movie-title-details">{mediaTitle}</h1>
                    <div className="movie-meta">
                      <span>{genreNames}</span>
                      <span>{releaseYear}</span>
                      <span>{`${vote_average?.toFixed(1) || 'N/A'}% liked`}</span>
                      <span>{duration}</span>
                    </div>
                    <p className="movie-overview">{overview}</p>
                  </div>
                  <div className="movie-details-actions">
                      <button onClick={handlePlayClick} className="play-button share-button">
                          <i className="fas fa-play"></i> Play
                      </button>
                    <button className="trailer-button" onClick={handleWatchTrailer} disabled={!trailerKey}><i className="fas fa-film"></i> Trailer</button>
                    <button className="share-button" onClick={() => setShowShareModal(true)}><i className="fas fa-share-nodes"></i> Share</button>
                  </div>
                </div>
              </section>

              <div className="movie-details-content">
                <div className="tab-buttons">
                    
                        <button className={`tab-button ${activeTab === "seasons" ? "active" : ""}`} onClick={() => setActiveTab("seasons")}>Seasons</button>
                        <button className={`tab-button ${activeTab === "recommendations" ? "active" : ""}`} onClick={() => setActiveTab("recommendations")}>Recommendations</button>
                    
                    <button className={`tab-button ${activeTab === "cast" ? "active" : ""}`} onClick={() => setActiveTab("cast")}>Series Cast</button>
                    <button className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews</button>
                </div>

                <div className="tab-content">
                    {activeTab === 'seasons' && (
                        <div className="seasons-content">
                            <CustomDropdown options={seasonOptions} selected={selectedSeason} onSelect={setSelectedSeason} />
                            <SeasonDetails tvShowId={id} seasonNumber={selectedSeason} episodes={episodesForSeason} tvShowBackdrop={backdrop_path} />
                        </div>
                    )}
                    {activeTab === "recommendations" && (
                        (recommendations && recommendations.results.length > 0) ? (
                            <Carousel items={recommendations.results} type='tv' />
                        ) : (
                            <Trending mediaType='tv' />
                        )
                    )}
                    {activeTab === "cast" && credits && <CastCarousel items={credits.cast} />}
                    {activeTab === 'reviews' && (
                      <div className="reviews-list">
                        {(reviews?.results || []).length > 0 ? (
                          reviews.results.map((review) => (
                            <div key={review.id} className="review">
                              <p>A review by {review.author}</p>
                              <p>{review.content}</p>
                            </div>
                          ))
                        ) : <p>No reviews available.</p>}
                      </div>
                    )}
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TvShowDetails;
