
import React from 'react';
import '../../../styles/InfoPages.css';

const Contact = () => {
  return (
    <div className="info-page">
      <h1 className="info-title">Contact Us</h1>
      <div className="info-content">
        <p>We'd love to hear from you! If you have any questions, feedback, or suggestions, please don't hesitate to get in touch.</p>
        <p>You can reach us by email at <a href="mailto:support@filmfind.online">support@filmfind.online</a>.</p>
        <p>For DMCA-related inquiries, please see our <a href="/dmca">DMCA Policy</a> page for specific instructions on how to submit a notice.</p>
        <p>Thank you for using FilmFind!</p>
      </div>
    </div>
  );
};

export default Contact;
