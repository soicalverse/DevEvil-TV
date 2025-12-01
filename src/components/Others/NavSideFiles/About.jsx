
import React from 'react';
import '../../../styles/InfoPages.css';

const About = () => {
  return (
    <div className="info-page">
      <h1 className="info-title">About FilmFind</h1>
      <div className="info-content">
        <p>Welcome to FilmFind, your ultimate destination for discovering and exploring the world of movies and TV shows. Our mission is to provide a seamless and enjoyable experience for film enthusiasts everywhere.</p>
        <p>At FilmFind, we believe that movies are more than just entertainment; they are a form of art that inspires, educates, and brings people together. That's why we've created a platform that allows you to:</p>
        <ul>
          <li>Discover new and trending movies and TV shows.</li>
          <li>Get detailed information about your favorite films, including cast, crew, and reviews.</li>
          <li>Watch trailers and find out where to stream content.</li>
          <li>Create and share your own watchlists.</li>
        </ul>
        <p>Our team is passionate about cinema and dedicated to building the best possible platform for our users. We are constantly working to improve FilmFind and add new features to enhance your experience.</p>
        <p>Thank you for being a part of our community. We hope you enjoy using FilmFind as much as we enjoy building it.</p>
      </div>
    </div>
  );
};

export default About;
