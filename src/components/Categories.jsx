
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getMoviesByGenre, getGenres, getTvGenres, getTvByGenre } from '../services/tmdbService';
import Carousel from './Carousel';
import GenreFilter from './GenreFilter';
import '../styles/Movies.css';

const Categories = () => {
  const [moviesByCategory, setMoviesByCategory] = useState([]);
  const [tvByCategory, setTvByCategory] = useState([]);
  const [selectedMovieGenre, setSelectedMovieGenre] = useState('28');
  const [selectedTvGenre, setSelectedTvGenre] = useState('10759');
  const [movieGenres, setMovieGenres] = useState([]);
  const [tvGenres, setTvGenres] = useState([]);
  const [currentPageMovies, setCurrentPageMovies] = useState(1);
  const [currentPageTv, setCurrentPageTv] = useState(1);
  const [showSeeMoreMovies, setShowSeeMoreMovies] = useState(false);
  const [showSeeMoreTv, setShowSeeMoreTv] = useState(false);
  const [buttonText, setButtonText] = useState(window.innerWidth < 768 ? 'Category' : 'Select Category');

  useEffect(() => {
    const handleResize = () => {
        setButtonText(window.innerWidth < 768 ? 'Category' : 'Select Category');
    };

    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, []);

  useEffect(() => {
    const source = axios.CancelToken.source();
    const fetchGenres = async () => {
      try {
        const fetchedMovieGenres = await getGenres(source.token);
        setMovieGenres(fetchedMovieGenres.filter(genre => genre.name !== 'Horror' && genre.name !== 'Drama' && genre.name !== 'Romance'));

        const fetchedTvGenres = await getTvGenres(source.token);
        setTvGenres(fetchedTvGenres.filter(genre => genre.name !== 'Horror' && genre.name !== 'Drama' && genre.name !== 'Romance'));
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error('Error fetching genres:', error);
        }
      }
    };

    fetchGenres();
    return () => {
      source.cancel('Component unmounted');
    };
  }, []);

  useEffect(() => {
    const source = axios.CancelToken.source();
    const fetchMoviesByCategory = async () => {
      if (selectedMovieGenre) {
        try {
          const movies = await getMoviesByGenre(selectedMovieGenre, currentPageMovies, source.token);
          setMoviesByCategory(prev => currentPageMovies === 1 ? movies : [...prev, ...movies]);
          setShowSeeMoreMovies(movies.length > 0);
        } catch (error) {
          if (!axios.isCancel(error)) {
            console.error('Error fetching movies by category:', error);
          }
        }
      } else {
        setMoviesByCategory([]);
      }
    };

    fetchMoviesByCategory();
    return () => {
      source.cancel('Component unmounted');
    };
  }, [selectedMovieGenre, currentPageMovies]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    const fetchTvByCategory = async () => {
      if (selectedTvGenre) {
        try {
          const tv = await getTvByGenre(selectedTvGenre, currentPageTv, source.token);
          setTvByCategory(prev => currentPageTv === 1 ? tv : [...prev, ...tv]);
          setShowSeeMoreTv(tv.length > 0);
        } catch (error) {
          if (!axios.isCancel(error)) {
            console.error('Error fetching TV shows by category:', error);
          }
        }
      } else {
        setTvByCategory([]);
      }
    };

    fetchTvByCategory();
    return () => {
      source.cancel('Component unmounted');
    };
  }, [selectedTvGenre, currentPageTv]);

  const handleMovieGenreChange = (genre) => {
    setSelectedMovieGenre(genre);
    setCurrentPageMovies(1);
  };

  const handleTvGenreChange = (genre) => {
    setSelectedTvGenre(genre);
    setCurrentPageTv(1);
  };

  const handleSeeMoreMovies = () => {
    setCurrentPageMovies(prev => prev + 1);
  };

  const handleSeeMoreTv = () => {
    setCurrentPageTv(prev => prev + 1);
  };

  return (
    <div>
      <section className="movies-section" id='categories'>
        <div className="section-header">
          <h2>Movie Categories</h2>
          <GenreFilter genres={movieGenres} selectedGenre={selectedMovieGenre} onGenreChange={handleMovieGenreChange} title={buttonText} />
        </div>
        <Carousel items={moviesByCategory} type="movie" handleSeeMore={handleSeeMoreMovies} showSeeMore={showSeeMoreMovies} />
      </section>

      <section className="movies-section">
        <div className="section-header">
          <h2>TV Show Categories</h2>
          <GenreFilter genres={tvGenres} selectedGenre={selectedTvGenre} onGenreChange={handleTvGenreChange} title={buttonText} />
        </div>
        <Carousel items={tvByCategory} type="tv" handleSeeMore={handleSeeMoreTv} showSeeMore={showSeeMoreTv} />
      </section>
    </div>
  );
};

export default Categories;
