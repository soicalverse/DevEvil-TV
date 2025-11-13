import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/NavBar.css';

const Navbar = ({ isCategoryOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const isSearchPage = location.pathname === '/search';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (isSearchPage) {
      const handler = setTimeout(() => {
        if (query) {
          navigate(`/search?query=${query}`);
        } else {
          navigate('/search');
        }
      }, 300); // Debounce search

      return () => {
        clearTimeout(handler);
      };
    }
  }, [query, navigate, isSearchPage]);

  return (
    <div className={`navbar ${isMenuOpen ? 'mobile-menu-open' : ''} ${isCategoryOpen ? 'at-top' : ''}`}>
      <div className="nav-left">
        <a href="/" className="logo-link">
          <img src="/assets/logo2.png" alt="Logo" className="logo" />
        </a>
        <div className="desktop-links">
          <a href="/" className="navbar-link">Home</a>
          {isHomePage && (
            <>
              <a href="/#movies" className="navbar-link">Movies</a>
              <a href="/#tvshows" className="navbar-link">TV Shows</a>
              <div className="dropdown">
                <button className="dropbtn">Others <i className='fas fa-sort-down'></i></button>
                <div className="dropdown-content">
                  <a href="#anime" className="navbar-link">Anime</a>
                  <a href="#nowplaying" className="navbar-link">Now Playing</a>
                  <a href="#trailers" className="navbar-link">Trailers</a>
                  <a href="#performers" className="navbar-link">Popular Performers</a>
                  <a href="#companies" className="navbar-link">Top Companies</a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="nav-center">
        {isSearchPage ? (
          <input
            type="text"
            placeholder="Search for movies and TV shows"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
        ) : (
          <a href="/search" className="search-link">
            <i className="fas fa-magnifying-glass search-icon"></i>
          </a>
        )}
      </div>

      <div className="nav-right">
        <div className="mobile-icon">
          {isHomePage ? (
            <i className='fas fa-bars menu-icon' onClick={toggleMenu}></i>
          ) : (
            <a href="/" className="home-icon-link"><i className="fa-solid fa-home"></i></a>
          )}
        </div>
      </div>

      <div className="mobile-menu">
          <a href="/" className="navbar-link">Home</a>
          {isHomePage && (
            <>
              <a href="/#movies" className="navbar-link">Movies</a>
              <a href="/#tvshows" className="navbar-link">TV Shows</a>
              <a href="#anime" className="navbar-link">Anime</a>
              <a href="#nowplaying" className="navbar-link">Now Playing</a>
              <a href="#trailers" className="navbar-link">Trailers</a>
              <a href="#performers" className="navbar-link">Popular Performers</a>
              <a href="#companies" className="navbar-link">Top Companies</a>
            </>
          )}
        </div>
    </div>
  );
};

export default Navbar;
