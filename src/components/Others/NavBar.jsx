import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import '../../styles/NavBar.css';

const Navbar = () => {
  const [query, setQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const [isGenreSheetOpen, setIsGenreSheetOpen] = useState(false); // New state for genre sheet
  const navigate = useNavigate();
  const location = useLocation();

  // Reset search on page change
  useEffect(() => {
    setIsMobileSearchActive(false);
    setQuery('');
  }, [location]);

  // Handle scroll effect for desktop
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- THE FIX for genre sheet detection ---
  // This effect watches for changes in the DOM to see if the genre sheet is open
  useEffect(() => {
    const targetNode = document.body;
    
    const checkGenreSheet = () => {
      const sheet = document.querySelector('.genre-filter-sheet');
      const sheetIsOpen = sheet ? sheet.classList.contains('open') : false;
      // Update state only if it has changed to prevent unnecessary re-renders
      if (sheetIsOpen !== isGenreSheetOpen) {
        setIsGenreSheetOpen(sheetIsOpen);
      }
    };

    // Check when the component mounts
    checkGenreSheet();
    
    // Use a MutationObserver to efficiently detect class changes on the sheet
    const observer = new MutationObserver(checkGenreSheet);

    // Start observing the entire document body for changes
    observer.observe(targetNode, { attributes: true, childList: true, subtree: true });

    // Clean up observer on component unmount
    return () => {
      observer.disconnect();
    };
  }, [isGenreSheetOpen]); // Rerun check if state is changed from somewhere else

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${query.trim()}`);
    }
  };

  const openMobileSearch = (e) => {
    e.preventDefault();
    setIsMobileSearchActive(true);
  };

  const closeMobileSearch = () => {
    setIsMobileSearchActive(false);
  };

  const renderContent = () => {
    if (isMobileSearchActive) {
      return (
        <div className="mobile-search-view">
          <form onSubmit={handleSearch} className="search-form-mobile">
            <button type="button" onClick={closeMobileSearch} className="back-button">
                <i className="fas fa-arrow-left"></i>
            </button>
            <input 
              type="text" 
              placeholder="Search for movies, TV shows..." 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              className="search-input-mobile" 
              autoFocus 
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} className="clear-button">
                <i className="fas fa-times"></i>
              </button>
            )}
            <button type="submit" className="mobile-search-submit-button">
               <i className="fas fa-magnifying-glass"></i>
            </button>
          </form>
        </div>
      );
    }

    return (
      <div className="default-nav-view">
         <div className="nav-left">
          <a href="/" className="logo-link">
            <img src="/assets/logo2.png" alt="Logo" className="logo" />
          </a>
          <div className="desktop-links">
            <NavLink to="/" className="navbar-link">Home</NavLink>
            <NavLink to="/#movies" className="navbar-link">Movies</NavLink>
            <NavLink to="/#tvshows" className="navbar-link">TV Shows</NavLink>
          </div>
        </div>

        <div className="nav-center">
          <form onSubmit={handleSearch} className="search-form">
            <input type="text" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} className="search-input" />
            <button type="submit" className="search-button"><i className="fas fa-magnifying-glass"></i></button>
          </form>
        </div>

        <div className="nav-right">
          <a href="/search" onClick={openMobileSearch} className="search-link-mobile">
            <i className="fas fa-magnifying-glass"></i>
          </a>
          <div className="desktop-links">
            <div className="dropdown">
              <button className="dropbtn">Others <i className='fas fa-sort-down'></i></button>
              <div className="dropdown-content">
                <a href="#anime">Anime</a>
                <a href="#nowplaying">Now Playing</a>
                <a href="#trailers">Trailers</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`navbar ${isScrolled ? 'scrolled' : ''} ${isGenreSheetOpen ? 'genre-sheet-open' : ''}`}>
        {renderContent()}
    </div>
  );
};

export default Navbar;
