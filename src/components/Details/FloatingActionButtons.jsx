import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/FloatingActionButtons.css';

const FloatingActionButtons = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="floating-buttons-container">
      <div className="top-buttons">
        <button className="btn-glass back-btn" onClick={handleBackClick}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <button className="btn-glass settings-btn">
          <i className="fas fa-cog"></i>
        </button>
      </div>
    </div>
  );
};

export default FloatingActionButtons;
