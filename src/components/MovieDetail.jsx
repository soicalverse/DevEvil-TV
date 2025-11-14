import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import YouTube from "react-youtube";
import "../../src/styles/MovieDetails.css";

const MovieDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const isMovie = location.pathname.includes("/movie/");

  // Determine the initial active tab
  const [activeTab, setActiveTab] = useState(isMovie ? "suggested" : "seasons");

  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [suggestedMovies, setSuggestedMovies] = useState([]);
  const [movieReviews, setMovieReviews] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedSeason] = useState(1);
  const [selectedEpisode] = useState(1);

  const recommendationsRef = useRef(null);
  const castRef = useRef(null);

  useEffect(() => {
    const endpointType = isMovie ? "movie" : "tv";
    const apiKey = process.env.REACT_APP_API_KEY;

    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/${endpointType}/${id}?api_key=${apiKey}&append_to_response=videos`
        );
        const data = await response.json();
        setMovie(data);
        const trailer = data.videos?.results?.find(
          (vid) => vid.type === "Trailer"
        );
        if (trailer) {
          setTrailerKey(trailer.key);
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    const fetchCredits = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/${endpointType}/${id}/credits?api_key=${apiKey}`
        );
        const data = await response.json();
        setCredits(data);
      } catch (error) {
        console.error("Error fetching credits:", error);
      }
    };
    
    const fetchSuggestedMovies = async () => {
      try {
        // CORRECTED: Use the correct endpoint based on content type
        const response = await fetch(
          `https://api.themoviedb.org/3/${endpointType}/${id}/recommendations?api_key=${apiKey}`
        );
        const data = await response.json();
        setSuggestedMovies(data.results);
      } catch (error) {
        console.error("Error fetching suggested movies:", error);
      }
    };

    const fetchMovieReviews = async () => {
        try {
          const response = await fetch(`https://api.themoviedb.org/3/${endpointType}/${id}/reviews?api_key=${apiKey}`);
          const data = await response.json();
          setMovieReviews(data.results);
        } catch (error) {
          console.error("Error fetching movie reviews:", error);
        }
      };

    fetchMovieDetails();
    fetchCredits();
    fetchMovieReviews();
    fetchSuggestedMovies();
  }, [id, isMovie]);

  // NEW: Effect for horizontal wheel scrolling on desktop
  useEffect(() => {
    const applyWheelScroll = (ref) => {
        const element = ref.current;
        if (element) {
            const onWheel = (e) => {
                if (e.deltaY === 0) return;
                e.preventDefault();
                element.scrollTo({
                    left: element.scrollLeft + e.deltaY,
                    behavior: "smooth"
                });
            };
            element.addEventListener("wheel", onWheel);
            return () => element.removeEventListener("wheel", onWheel);
        }
    };

    const cleanupRecs = applyWheelScroll(recommendationsRef);
    const cleanupCast = applyWheelScroll(castRef);

    return () => {
        if (cleanupRecs) cleanupRecs();
        if (cleanupCast) cleanupCast();
    };
  }, [activeTab]); // Re-apply when tab changes

  const handlePlay = () => {
    console.log("Play button clicked");
  };

  const handleWatchTrailer = () => {
    if (trailerKey) {
      setShowTrailer(true);
    } else {
      alert("No trailer available.");
    }
  };

  const handleCloseTrailer = () => {
    setShowTrailer(false);
  };
    
  // NEW: Share button handler
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert("Link copied to clipboard!");
    }).catch(err => {
        console.error('Failed to copy link: ', err);
        alert("Failed to copy link.");
    });
  };

  if (!movie || !credits) {
    return <div>Loading...</div>;
  }

  const title = movie.title || movie.name;
  const releaseYear = new Date(
    movie.release_date || movie.first_air_date
  ).getFullYear();
  const genres = (movie.genres || []).map((genre) => genre.name).join(" ");
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : `${movie.number_of_seasons} Seasons ${movie.number_of_episodes} Episodes`;

  return (
    <div className="movie-details-container">
      {showTrailer && (
        <div className="youtube-overlay" onClick={handleCloseTrailer}>
          <div className="youtube-container" onClick={(e) => e.stopPropagation()}>
            <YouTube videoId={trailerKey} opts={{ width: "100%", height: "100%" }} />
            <button className="close-trailer-button" onClick={handleCloseTrailer}>
                <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}

      <div
        className="movie-details-backdrop"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w1280/${movie.backdrop_path})`,
        }}
      >
        <div className="backdrop-overlay">
          <div className="movie-details-header">
            <div className="movie-details-info">
              <h1 className="movie-title-details">{title}</h1>
              <div className="movie-meta">
                <span>{genres}</span>
                <span>{releaseYear}</span>
                <span>{`${movie.vote_average.toFixed(1)}% liked`}</span>
                <span>{runtime}</span>
              </div>
              <p className="movie-overview">{movie.overview}</p>
            </div>
            <div className="movie-details-actions">
              <button className="play-button" onClick={handlePlay}>
                <i className="fas fa-play"></i>
                {isMovie ? "Play" : `Play Season ${selectedSeason} Episode ${selectedEpisode}`}
              </button>
              <button className="trailer-button" onClick={handleWatchTrailer}>
                <i className="fas fa-film"></i> Watch Trailer
              </button>
               {/* SHARE BUTTON ADDED */}
              <button className="share-button" onClick={handleShare}>
                <i className="fas fa-share-nodes"></i> Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="movie-details-content">
        <div className="tabs">
            {isMovie ? null : (
            <button
                className={`tab-button ${activeTab === "seasons" ? "active" : ""}`}
                onClick={() => setActiveTab("seasons")}
            >
                Seasons
            </button>
            )}
            <button
            className={`tab-button ${activeTab === "suggested" ? "active" : ""}`}
            onClick={() => setActiveTab("suggested")}
            >
            Recommendations
            </button>
            <button
                className={`tab-button ${activeTab === "cast" ? "active" : ""}`}
                onClick={() => setActiveTab("cast")}
            >
                {isMovie ? "Cast" : "Series Cast"}
            </button>
            <button
                className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
            >
                User Reviews
            </button>
        </div>

        <div className="tab-content">
            {!isMovie && activeTab === 'seasons' && (
                <div className="seasons-container">
                    {/* Seasons content would go here */}
                    <p>Seasons functionality to be implemented.</p>
                </div>
            )}
  
            {activeTab === "suggested" && (
              <div className="recommendations-container" ref={recommendationsRef}>
                <ul className="recommendations-ul">
                  {(suggestedMovies || []).slice(0, 8).map((movie) => (
                    <li key={movie.id}>
                      <Link to={`/${isMovie ? 'movie' : 'tv'}/${movie.id}`}>
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
                  {(credits.cast || []).slice(0, 8).map((cast) => (
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
                  {(movieReviews || []).map((review) => (
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
    </div>
  );
};
    
export default MovieDetails;
