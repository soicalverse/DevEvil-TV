import React, { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import MediaCard from './MediaCard';
import { Link, useParams, useLocation } from "react-router-dom";
import YouTube from "react-youtube";
import "../../src/styles/MovieDetails.css";
import SeasonDetails from './TV/SeasonDetails';
import { getMovieDetails, getTvShowDetails } from "../services/tmdbService";
import useHorizontalScroll from "../hooks/useHorizontalScroll";
import '../styles/Carousel.css';

const Carousel = ({ items, type, handleSeeMore, showSeeMore }) => {
  const carouselRef = useHorizontalScroll();

  return (
    <div className="carousel-container" ref={carouselRef}>
      <div className="carousel-wrapper">
        {items.map((item) => (
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

Carousel.propTypes = {
  items: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  handleSeeMore: PropTypes.func.isRequired,
  showSeeMore: PropTypes.bool.isRequired,
};

const CastCarousel = ({ items }) => {
  const carouselRef = useHorizontalScroll();

  return (
    <div className="carousel-container" ref={carouselRef}>
      <div className="carousel-wrapper">
        {items.map((item) => (
          <div className="carousel-item" key={item.id}>
            <div className="cast-card">
              <img
                src={`https://image.tmdb.org/t/p/w200/${item.profile_path}`}
                alt={item.name}
                className="cast-image"
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

CastCarousel.propTypes = {
  items: PropTypes.array.isRequired,
};

const MovieDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const isMovie = location.pathname.includes("/movie/");

  const [activeTab, setActiveTab] = useState(isMovie ? "suggested" : "seasons");
  const [media, setMedia] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = isMovie ? await getMovieDetails(id) : await getTvShowDetails(id);
        setMedia(data);
        const trailer = data.videos?.results?.find(vid => vid.type === "Trailer");
        setTrailerKey(trailer?.key);
      } catch (error) {
        console.error("Error fetching media details:", error);
      }
    };
    fetchData();
  }, [id, isMovie]);

  const handleWatchTrailer = () => setShowTrailer(!!trailerKey);
  const handleCloseTrailer = () => setShowTrailer(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert("Link copied to clipboard!"))
      .catch(err => alert("Failed to copy link."));
  };

  if (!media) return <div>Loading...</div>;

  const { title, name, release_date, first_air_date, genres, runtime, number_of_seasons, number_of_episodes, vote_average, overview, backdrop_path, recommendations, credits, reviews } = media;

  const mediaTitle = title || name;
  const releaseYear = release_date ? new Date(release_date).getFullYear() : (first_air_date ? new Date(first_air_date).getFullYear() : 'N/A');
  const genreNames = (genres || []).map((g) => g.name).join(" ");
  const duration = isMovie ? (runtime ? `${Math.floor(runtime / 60)}h ${runtime % 60}m` : 'N/A') : (`${number_of_seasons} Seasons`);

  return (
    <div className="movie-details-page">
      {showTrailer && (
        <div className="youtube-overlay" onClick={handleCloseTrailer}>
          <div className="youtube-container">
            <YouTube videoId={trailerKey} opts={{ width: "100%", height: "100%" }} className="youtube-player-wrapper" />
            <button className="close-trailer-button" onClick={handleCloseTrailer}>&times;</button>
          </div>
        </div>
      )}

      <div className="movie-details-container">
        <section
          className="movie-details-header-section"
          style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w1280/${backdrop_path})` }}
        >
          <div className="header-overlay"></div>
            <div className="movie-details-header">
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
                  <Link to={`/player/${id}${!isMovie ? `/${selectedSeason}/${selectedEpisode}` : ''}`} className="play-button">
                      <i className="fas fa-play"></i> Play
                  </Link>
                <button className="trailer-button" onClick={handleWatchTrailer}>
                  <i className="fas fa-film"></i> Watch Trailer
                </button>
                <button className="share-button" onClick={handleShare}>
                  <i className="fas fa-share-nodes"></i> Share
                </button>
              </div>
            </div>
        </section>

        <div className="movie-details-content">
          <div className="tabs">
              {isMovie && (
                  <button className={`tab-button ${activeTab === "suggested" ? "active" : ""}`} onClick={() => setActiveTab("suggested")}>
                      Suggested
                  </button>
              )}
              {!isMovie && (
                  <button className={`tab-button ${activeTab === "seasons" ? "active" : ""}`} onClick={() => setActiveTab("seasons")}>
                      Seasons
                  </button>
              )}
              <button className={`tab-button ${activeTab === "cast" ? "active" : ""}`} onClick={() => setActiveTab("cast")}>
                  {isMovie ? "Cast" : "Series Cast"}
              </button>
              <button className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
                  Reviews
              </button>
          </div>

          <div className="tab-content">
              {activeTab === 'seasons' && !isMovie && (
                  <SeasonDetails tvShowId={id} seasons={media.seasons} onSeasonSelect={setSelectedSeason} />
              )}

              {activeTab === "suggested" && (
                <Carousel items={recommendations.results} type={"movie"} />
              )}

              {activeTab === "cast" && (
                <CastCarousel items={credits.cast} />
              )}

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
  );
};

export default MovieDetails;
