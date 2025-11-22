
import React, { useState, useEffect } from 'react';
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
    const fetchGenres = async () => {
      try {
        const fetchedMovieGenres = await getGenres();
        setMovieGenres(fetchedMovieGenres.filter(genre => genre.name !== 'Horror'));

        const fetchedTvGenres = await getTvGenres();
        setTvGenres(fetchedTvGenres.filter(genre => genre.name !== 'Horror'));
      } catch (error) {
        // Handle error
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchMoviesByCategory = async () => {
      if (selectedMovieGenre) {
        try {
          const movies = await getMoviesByGenre(selectedMovieGenre, currentPageMovies);
          setMoviesByCategory(prev => currentPageMovies === 1 ? movies : [...prev, ...movies]);
          setShowSeeMoreMovies(movies.length > 0);
        } catch (error) {
          // Handle error
        }
      } else {
        setMoviesByCategory([]);
      }
    };

    fetchMoviesByCategory();
  }, [selectedMovieGenre, currentPageMovies]);

  useEffect(() => {
    const fetchTvByCategory = async () => {
      if (selectedTvGenre) {
        try {
          const tv = await getTvByGenre(selectedTvGenre, currentPageTv);
          setTvByCategory(prev => currentPageTv === 1 ? tv : [...prev, ...tv]);
          setShowSeeMoreTv(tv.length > 0);
        } catch (error) {
          // Handle error
        }
      } else {
        setTvByCategory([]);
      }
    };

    fetchTvByCategory();
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
