
import React from 'react';
import '../../../styles/InfoPages.css';

const Privacy = () => {
  return (
    <div className="info-page">
      <h1 className="info-title">Privacy Policy</h1>
      <div className="info-content">
        <p>At FilmFind, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and disclose your personal information when you use our website.</p>
        <h2>Information We Collect</h2>
        <p>We may collect the following types of information:</p>
        <ul>
          <li><strong>Personal Information:</strong> When you create an account, we may collect your name, email address, and other contact details.</li>
          <li><strong>Usage Information:</strong> We may collect information about how you use our website, such as the pages you visit, the content you view, and the searches you perform.</li>
          <li><strong>Device Information:</strong> We may collect information about the device you use to access our website, including your IP address, browser type, and operating system.</li>
        </ul>
        <h2>How We Use Your Information</h2>
        <p>We may use your information to:</p>
        <ul>
          <li>Provide and improve our services.</li>
          <li>Personalize your experience.</li>
          <li>Communicate with you about our services.</li>
          <li>Analyze how our website is used.</li>
        </ul>
        <h2>Information Sharing and Disclosure</h2>
        <p>We do not sell or rent your personal information to third parties. We may share your information with third-party service providers who help us operate our website and provide our services. We may also disclose your information if required by law.</p>
        <h2>Your Choices</h2>
        <p>You may choose not to provide us with certain information, but this may limit your ability to use some of our features. You can also opt out of receiving promotional emails from us by following the instructions in those emails.</p>
        <h2>Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@filmfind.online">support@filmfind.online</a>.</p>
      </div>
    </div>
  );
};

export default Privacy;
