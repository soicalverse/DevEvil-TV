
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/NavBar.css'; 

const NavBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  return (
    <div className="navbar-fixed">
        <div className="navbar-container">
            <div className="navbar-left">
                <Link to="/" className="navbar-logo">
                    <img src="https://i.imgur.com/J8hX72t.png" alt="Logo" style={{height: '40px'}} />
                </Link>
                <Link to="/" className="navbar-link-home">Home</Link>
            </div>
            <div className="navbar-center">
                <form onSubmit={handleSearchSubmit} className="search-bar-form">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-bar-input"
                    />
                    <button type="submit" className="search-bar-button">
                        <i className="fas fa-search"></i>
                    </button>
                </form>
            </div>
            <div className="navbar-right">
            </div>
        </div>
    </div>
  );
};

export default NavBar;
