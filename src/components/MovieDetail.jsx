import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import MediaCard from './MediaCard';
import { Link, useParams, useLocation } from "react-router-dom";
import YouTube from "react-youtube";
import "../../src/styles/MovieDetails.css";
import SeasonDetails from './TV/SeasonDetails';
import { getMovieDetails, getTvShowDetails, getTrendingMovies, getTrendingTvShows } from "../services/tmdbService";
import useHorizontalScroll from "../hooks/useHorizontalScroll";
import CustomDropdown from './CustomDropdown';
import ShareModal from "./Share/ShareModal";
import { Helmet } from 'react-helmet-async';
import '../styles/Carousel.css';
import Trending from "./Others/Trending";
import Footer from "./Others/Footer";
import Loader from "./Loader";

// Carousel Components
const Carousel = ({ items, type, handleSeeMore, showSeeMore }) => {
  const carouselRef = useHorizontalScroll();
  return (
    <div className="carousel-container" ref={carouselRef}>
      <div className="carousel-wrapper">
        {(items || []).map((item) => (
          <div className="carousel-item" key={item.id}>
            <MediaCard item={item} type={type} />
          </div>
        ))}
        {showSeeMore && (
          <div className="see-more-card-container">
            <div className="see-more-card" onClick={handleSeeMore}>
              <i className="fas fa-arrow-right"></i>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
Carousel.propTypes = { items: PropTypes.array, type: PropTypes.string.isRequired, handleSeeMore: PropTypes.func, showSeeMore: PropTypes.bool };

const CastCarousel = ({ items }) => {
  const carouselRef = useHorizontalScroll();
  return (
    <div className="carousel-container" ref={carouselRef}>
      <div className="carousel-wrapper">
        {(items || []).map((item) => (
          <div className="carousel-item" key={item.id}>
            <div className="cast-card">
              <img src={`https://image.tmdb.org/t/p/w200/${item.profile_path}`} alt={item.name} className="cast-image" />
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

const MovieDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const isMovie = location.pathname.includes("/movie/");

  const [activeTab, setActiveTab] = useState(isMovie ? "suggested" : "seasons");
  const [media, setMedia] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showPoster, setShowPoster] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [showShareModal, setShowShareModal] = useState(false);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const startTime = Date.now();
      try {
        const data = isMovie ? await getMovieDetails(id) : await getTvShowDetails(id);
        setMedia(data);
        const trailer = data.videos?.results?.find(vid => vid.type === "Trailer");
        setTrailerKey(trailer?.key);
        if (!isMovie && data.seasons && data.seasons.length > 0) {
          const firstSeason = data.seasons.find(s => s.season_number > 0) || data.seasons[0];
          setSelectedSeason(firstSeason.season_number);
        }
        if (!data.recommendations || data.recommendations.results.length === 0) {
          const trendingData = isMovie ? await getTrendingMovies() : await getTrendingTvShows();
          setTrending(trendingData);
        }
      } catch (error) {
        console.error("Error fetching media details:", error);
      } finally {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = 1000 - elapsedTime;
        if (remainingTime > 0) {
          setTimeout(() => setLoading(false), remainingTime);
        } else {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [id, isMovie]);

  const handleWatchTrailer = () => setShowTrailer(!!trailerKey);
  const handleCloseTrailer = () => setShowTrailer(false);
  const handlePosterClick = () => setShowPoster(true);
  const handleClosePoster = () => setShowPoster(false);

  if (loading) return <div className="loading-container"><Loader /></div>;

  const { title, name, release_date, first_air_date, genres, runtime, number_of_seasons, vote_average, overview, backdrop_path, poster_path, recommendations, credits, reviews, seasons } = media;
  const mediaTitle = title || name;
  const releaseYear = release_date ? new Date(release_date).getFullYear() : (first_air_date ? new Date(first_air_date).getFullYear() : 'N/A');
  const genreNames = (genres || []).map((g) => g.name).join(" ");
  const duration = isMovie ? (runtime ? `${Math.floor(runtime / 60)}h ${runtime % 60}m` : 'N/A') : (`${number_of_seasons} Seasons`);

  const selectedSeasonData = !isMovie && seasons ? seasons.find(s => s.season_number === selectedSeason) : null;
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
        {showTrailer && (
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
                  <Link to={`/player/${id}${!isMovie ? '?s=1&e=1' : ''}`} className="share-button">
                      <i className="fas fa-play"></i> Play
                  </Link>
                <button className="trailer-button" onClick={handleWatchTrailer}><i className="fas fa-film"></i> Trailer</button>
                <button className="share-button" onClick={() => setShowShareModal(true)}><i className="fas fa-share-nodes"></i> Share</button>
              </div>
            </div>
          </section>

          <div className="movie-details-content">
            <div className="tab-buttons">
                {isMovie ? (
                    <button className={`tab-button ${activeTab === "suggested" ? "active" : ""}`} onClick={() => setActiveTab("suggested")}>Suggested</button>
                ) : (
                  <>
                    <button className={`tab-button ${activeTab === "seasons" ? "active" : ""}`} onClick={() => setActiveTab("seasons")}>Seasons</button>
                    <button className={`tab-button ${activeTab === "recommendations" ? "active" : ""}`} onClick={() => setActiveTab("recommendations")}>Recommendations</button>
                  </>
                )}
                <button className={`tab-button ${activeTab === "cast" ? "active" : ""}`} onClick={() => setActiveTab("cast")}>{isMovie ? "Cast" : "Series Cast"}</button>
                <button className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews</button>
            </div>

            <div className="tab-content">
                {!isMovie && activeTab === 'seasons' && (
                    <div className="seasons-content">
                        <CustomDropdown options={seasonOptions} selected={selectedSeason} onSelect={setSelectedSeason} />
                        <SeasonDetails tvShowId={id} seasonNumber={selectedSeason} episodes={episodesForSeason} tvShowBackdrop={backdrop_path} />
                    </div>
                )}
                {activeTab === (isMovie ? "suggested" : "recommendations") && (
                    (recommendations && recommendations.results.length > 0) ? (
                        <Carousel items={recommendations.results} type={isMovie ? 'movie' : 'tv'} />
                    ) : (
                        <Trending mediaType={isMovie ? 'movie' : 'tv'} />
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
      <Footer />
    </>
  );
};

export default MovieDetails;
