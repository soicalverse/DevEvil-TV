import React, { useState, useRef, useEffect } from 'react';
import '../styles/GenreFilter.css';

const GenreFilter = ({ genres, selectedGenre, onGenreChange, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const sheetRef = useRef(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleGenreSelect = (genreId) => {
    onGenreChange(genreId);
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (sheetRef.current && !sheetRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="genre-filter-container">
      <button className="genre-filter-trigger" onClick={handleToggle}>
        {title} <i className={`fa-solid fa-chevron-down ${isOpen ? 'open' : ''}`}></i>
      </button>

      <div className={`genre-filter-sheet ${isOpen ? 'open' : ''}`} ref={sheetRef}>
        <div className="grabber"></div>
        <ul className="genre-list">
          {genres.map((genre) => (
            <li key={genre.id} onClick={() => handleGenreSelect(genre.id)}>
              <div className={`genre-pill ${selectedGenre === genre.id ? 'selected' : ''}`}>
                <span>{genre.name}</span>
                {selectedGenre === genre.id && <i className="fa-solid fa-check"></i>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GenreFilter;
