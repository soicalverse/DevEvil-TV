import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { getMovieDetails, getMovieTrailer, getMovieRecommendations, getMovieReviews } from "../services/tmdbService";
import { useHorizontalScroll } from "../hooks/useHorizontalScroll";
import "../styles/MovieDetails.css";

const MovieDetails = () => {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [suggestedMovies, setSuggestedMovies] = useState([]);
  const [movieReviews, setMovieReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('suggested');

  const recommendationsRef = useHorizontalScroll();
  const castRef = useHorizontalScroll();

  const handleShare = async () => {
    const shareData = {
      title: movieDetails.title,
      text: `${movieDetails.overview.split('.')[0] + '.'}\n\nWatch Now on Movie Streaming Website (Ad-free streaming)`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        const response = await fetch(`https://image.tmdb.org/t/p/original/${movieDetails.backdrop_path}`);
        const blob = await response.blob();
        const file = new File([blob], `${movieDetails.title}.jpg`, { type: 'image/jpeg' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            ...shareData,
            files: [file],
          });
        } else {
          await navigator.share(shareData);
        }
      } catch (error) {
        console.error('Error sharing:', error);
        try {
            await navigator.share(shareData);
        } catch (shareError) {
            console.error('Error in fallback sharing:', shareError);
            alert('Could not open share dialog.');
        }
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const details = await getMovieDetails(id);
        setMovieDetails(details);

        const trailer = await getMovieTrailer(id);
        setTrailerKey(trailer);
        
        const reviews = await getMovieReviews(id);
        setMovieReviews(reviews.results);
      } catch (error) {
        // Handle error
      }
    };

    const fetchSuggestedMovies = async () => {
      try {
        const recommendations = await getMovieRecommendations(id);
        setSuggestedMovies(recommendations.results);
      } catch (error) {
        // Handle error
      }
    };

    fetchMovieDetails();
    if (activeTab === 'suggested') {
      fetchSuggestedMovies();
    }
  }, [id, activeTab]);

  if (!movieDetails) {
    return <div className="loading">Loading...</div>;
  }

  const {
    title,
    runtime,
    genres,
    overview,
    vote_average,
    images,
    credits,
    backdrop_path,
  } = movieDetails;

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div
        className="banner-details"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original/${backdrop_path})`,
        }}
      ></div>

      <div className="media-content">
        {images && images.logos && images.logos.length > 0 && (
          <div className="logo-container">
            <img
              src={`https://image.tmdb.org/t/p/original/${images.logos[0].file_path}`}
              alt={`${title} Logo`}
              draggable={'false'}
            />
          </div>
        )}

        <div className="genre-container">
          {genres.map((genre) => (
            <span key={genre.id} className="genre-button">
              {genre.name}
            </span>
          ))}
          <span className="genre-button">{formatTime(runtime)}</span>
          <span className="genre-button rating">
            <i className="fas fa-star"></i> {vote_average.toFixed(1)}
          </span>
        </div>

        <p className="overview">{overview}</p>

        <div className="media-actions">
          <Link to={`/player/${id}`}>
            <button>
              <i className="fa-solid fa-play"></i>
              <p>Play</p>
            </button>
          </Link>

          {trailerKey && (
            <a
              href={`https://www.youtube.com/watch?v=${trailerKey}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button>
                <i className="fa-solid fa-film"></i>
                <p>Watch Trailer</p>
              </button>
            </a>
          )}
          <button className="btn-glass-action" onClick={handleShare}>
            <i className="fas fa-share-alt"></i>
          </button>
        </div>

        <div className="tab-section">
          <button
            className={`tab-button ${activeTab === "suggested" ? "active" : ""}`}
            onClick={() => toggleTab("suggested")}
          >
            Recommendations
          </button>
          <button
            className={`tab-button ${activeTab === "cast" ? "active" : ""}`}
            onClick={() => toggleTab("cast")}
          >
            Top Billed Cast
          </button>
          <button
            className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => toggleTab('reviews')}
          >
            Users Reviews
          </button>
        </div>

        {activeTab === "suggested" && (
          <div className="recommendations-container" ref={recommendationsRef}>
            <ul className="recommendations-ul">
              {suggestedMovies.slice(0, 8).map((movie) => (
                <li key={movie.id}>
                  <Link to={`/movie/${movie.id}`}>
                    <div>
                      <img
                        className="cast-poster"
                        src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
                        alt={movie.title}
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "cast" && (
          <div className="cast-container" ref={castRef}>
            <ul className="cast-ul">
              {credits.cast.slice(0, 8).map((cast) => (
                <li key={cast.id}>
                  <img
                    className="cast-poster"
                    src={`https://image.tmdb.org/t/p/w1280/${cast.profile_path}`}
                    alt={cast.title || cast.name}
                    draggable="false"
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <ul className="reviews-list">
              {movieReviews.map((review) => (
                <li key={review.id} className="review">
                  <p>A review by {review.author}</p>
                  <p>{review.content}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
