
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/MobileNavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { blockedWords } from '../../blockedWords'; // Import the blocked words
import AuthNavbar from '../AuthNavbar.tsx';

const MobileNavBar = () => {
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearchToggle = () => {
        setIsSearchActive(!isSearchActive);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const trimmedSearchTerm = searchTerm.trim();

        if (trimmedSearchTerm) {
            const isQueryBlocked = blockedWords.some(word =>
                trimmedSearchTerm.toLowerCase().includes(word.toLowerCase())
            );

            navigate(`/search?q=${encodeURIComponent(trimmedSearchTerm)}`);
            setSearchTerm('');
            setIsSearchActive(false);
        }
    };

    return (
        <div className={`mobile-nav-bar-container ${isSearchActive ? 'search-active' : ''}`}>
            <div className="mobile-nav-bar">
                <div className="nav-bar-content">
                    {isSearchActive ? (
                        <form className="search-view" onSubmit={handleSearchSubmit}>
                            <button type="button" className="back-btn" onClick={handleSearchToggle}>
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </button>
                            <input 
                                type="text" 
                                placeholder="Search movies, actors..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                            <button type="submit" className="search-action-btn">
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                        </form>
                    ) : (
                        <div className="tabs-view">
                            <div className="nav-items">
                                <a href="/" className="nav-item logo-item">
                                    <img src="/assets/logo2.png" alt="Logo" />
                                </a>
                                <a href="/" className="nav-item active">
                                    <FontAwesomeIcon icon={faHome} />
                                    <span>Home</span>
                                </a>
                                <div className='nav-item'>
                                  <AuthNavbar />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                {!isSearchActive && (
                    <button className="floating-search-btn" onClick={handleSearchToggle}>
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default MobileNavBar;
