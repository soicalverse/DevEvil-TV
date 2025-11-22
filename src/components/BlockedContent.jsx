import React from 'react';
import '../styles/BlockedContent.css';

const BlockedContent = ({ title, message }) => {
  return (
    <div className="blocked-content-container">
      <div className="outer">
        <div className="dot"></div>
        <div className="card">
          <div className="ray"></div>
          <div className="title">{title}</div>
          <div className="subtitle">{message}</div>
          <div className="line topl"></div>
          <div className="line leftl"></div>
          <div className="line bottoml"></div>
          <div className="line rightl"></div>
        </div>
      </div>
    </div>
  );
};

export default BlockedContent;