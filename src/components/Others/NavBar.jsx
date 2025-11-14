import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import '../../styles/NavBar.css';

const Navbar = () => {
  const [query, setQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const [isGenreSheetOpen, setIsGenreSheetOpen] = useState(false); // State for genre filter
  const [isNavAtTop, setIsNavAtTop] = useState(false); // State for mobile scroll animation
  const lastScrollY = useRef(0);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsMobileSearchActive(false);
    setQuery('');
  }, [location]);

  useEffect(() => {
    // --- Main scroll handler ---
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      // --- Mobile scroll-to-top animation logic ---
      if (window.innerWidth <= 768) {
        const windowHeight = window.innerHeight;
        const pageHeight = document.documentElement.scrollHeight;
        const isScrollingDown = currentScrollY > lastScrollY.current;
        const isNearPageBottom = currentScrollY + windowHeight >= pageHeight - 150;

        if (isScrollingDown && isNearPageBottom) {
          if (!isNavAtTop) setIsNavAtTop(true);
        } else if (!isScrollingDown) {
          if (isNavAtTop) setIsNavAtTop(false);
        }
      }
      lastScrollY.current = currentScrollY < 0 ? 0 : currentScrollY;
    };

    // --- Observer for genre filter sheet ---
    const observer = new MutationObserver(() => {
      const sheet = document.querySelector('.genre-filter-sheet');
      const sheetIsOpen = sheet ? sheet.classList.contains('open') : false;
      if (sheetIsOpen !== isGenreSheetOpen) {
        setIsGenreSheetOpen(sheetIsOpen);
      }
    });
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [isNavAtTop, isGenreSheetOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?query=${query.trim()}`);
  };

  const openMobileSearch = (e) => {
    e.preventDefault();
    setIsMobileSearchActive(true);
  };

  const closeMobileSearch = () => setIsMobileSearchActive(false);

  const renderContent = () => {
    if (isMobileSearchActive) {
      return (
        <div className="mobile-search-view">
          <form onSubmit={handleSearch} className="search-form-mobile">
            <button type="button" onClick={closeMobileSearch} className="back-button"><i className="fas fa-arrow-left"></i></button>
            <input type="text" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} className="search-input-mobile" autoFocus />
            {/* VISIBLE SEARCH SUBMIT BUTTON ADDED */}
            <button type="submit" className="mobile-search-submit-button"><i className="fas fa-magnifying-glass"></i></button>
          </form>
        </div>
      );
    }

    return (
      <div className="default-nav-view">
        {/* --- Desktop Content --- */}
        <div className="nav-left desktop-only">
          <NavLink to="/" className="logo-link"><img src="/assets/logo2.png" alt="Logo" className="logo" /></NavLink>
          {/* HOME BUTTON ADDED */}
          <NavLink to="/" className={({isActive}) => isActive ? "navbar-link active" : "navbar-link"}>Home</NavLink>
        </div>
        <div className="nav-center desktop-only">
          <form onSubmit={handleSearch} className="search-form">
            <input type="text" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} className="search-input" />
            <button type="submit" className="search-button"><i className="fas fa-magnifying-glass"></i></button>
          </form>
        </div>
        <div className="nav-right desktop-only"></div>

        {/* --- Mobile Content --- */}
        <div className="mobile-nav-links mobile-only">
          <NavLink to="/" className="logo-link mobile-logo-link"><img src="/assets/logo2.png" alt="Logo" className="mobile-logo" /></NavLink>
          <NavLink to="/" className={({isActive}) => isActive ? "navbar-link active" : "navbar-link"}><i className="fas fa-home"></i><span className="nav-text">Home</span></NavLink>
          <a href="/search" onClick={openMobileSearch} className="navbar-link"><i className="fas fa-magnifying-glass"></i><span className="nav-text">Search</span></a>
        </div>
      </div>
    );
  };

  const navClasses = [
    'navbar',
    isScrolled ? 'scrolled' : '',
    isMobileSearchActive ? 'search-active' : '',
    isGenreSheetOpen ? 'genre-sheet-open' : '', // Class for hiding
    !isGenreSheetOpen && isNavAtTop ? 'navbar--at-top' : '' // Class for scroll animation
  ].filter(Boolean).join(' ');

  return (
    <div className={navClasses}>
        {renderContent()}
    </div>
  );
};

export default Navbar;
