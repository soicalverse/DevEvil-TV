import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/ShareModal.css';

const ShareModal = ({ show, onClose, title, url, overview, posterPath }) => {
  if (!show) {
    return null;
  }

  const encodedUrl = encodeURIComponent(url);
  const text = `${title}\n\n${overview}`;
  const encodedText = encodeURIComponent(text);

  const shareOptions = [
    { name: 'Chat', icon: 'fa-regular fa-comment-dots', link: `sms:?body=${encodedText}%20${encodedUrl}` },
    { name: 'Telegram', icon: 'fa-brands fa-telegram', link: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(`*${title}*\n\n${overview}`)}` },
    { name: 'Twitter', icon: 'fa-brands fa-twitter', link: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}` },
    { name: 'Whatsapp', icon: 'fa-brands fa-whatsapp', link: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}` },
    { name: 'E-mail', icon: 'fa-regular fa-envelope', link: `mailto:?subject=${encodeURIComponent(title)}&body=${encodedText}%20${encodedUrl}` },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
      .then(() => alert('Link copied to clipboard!'))
      .catch(err => alert('Failed to copy link.'));
  };

  const handleMore = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: overview,
          url: url,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert('Web Share API not supported in your browser.');
    }
  };

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Share with</h2>
        <div className="share-icons">
          {shareOptions.map(option => (
            <a href={option.link} key={option.name} target="_blank" rel="noopener noreferrer" className="share-icon">
              <i className={option.icon}></i>
              <span>{option.name}</span>
            </a>
          ))}
          <div className="share-icon" onClick={handleMore}>
            <i className="fa-solid fa-share-nodes"></i>
            <span>More</span>
          </div>
        </div>
        <p className="or-share">Or share with link</p>
        <div className="share-link-container">
          <input type="text" value={url} readOnly />
          <button onClick={handleCopy}>
            <i className="fa-regular fa-copy"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

ShareModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  overview: PropTypes.string.isRequired,
  posterPath: PropTypes.string.isRequired,
};

export default ShareModal;
