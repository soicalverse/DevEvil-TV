import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdblockerModal.css';
import adblockDetector from '../adblockDetector';

const PROTECTED_ELEMENT_SELECTORS = '.play-button, .watch-now';

const browsers = {
  desktop: [
    { name: 'Chrome', logo: '/assets/chrome-svgrepo-com.svg', adguard: 'https://chromewebstore.google.com/detail/adguard-adblocker/bgnkhhnnamicmpeenaelnjfhikgbkllg', adblockPlus: 'https://chromewebstore.google.com/detail/adblock-plus-free-ad-bloc/cfhdojbkjhnklbpkdaibdccddilifddb' },
    { name: 'Safari', logo: '/assets/safari-svgrepo-com.svg', adguard: 'https://apps.apple.com/us/app/adguard-mini/id1440147259?mt=12', adblockPlus: 'https://apps.apple.com/us/app/adblock-plus-for-safari-abp/id1432731683?mt=12' },
    { name: 'Edge', logo: '/assets/edge-svgrepo-com.svg', adguard: 'https://microsoftedge.microsoft.com/addons/detail/adguard-adblocker/pdffkfellgipmhklpdmokmckkkfcopbh', adblockPlus: 'https://microsoftedge.microsoft.com/addons/detail/adblock-plus-free-ad-bl/gmgoamodcdcjnbaobigkjelfplakmdhh' },
    { name: 'Yandex', logo: '/assets/yandex-svgrepo-com.svg', adguard: 'https://adguard.com/en/adguard-browser-extension/yandex/overview.html', adblockPlus: 'https://chromewebstore.google.com/detail/adblock-plus-free-ad-bloc/cfhdojbkjhnklbpkdaibdccddilifddb' },
    { name: 'Opera', logo: '/assets/opera-svgrepo-com.svg', adguard: 'https://adguard.com/en/adguard-browser-extension/opera/overview.html', adblockPlus: 'https://addons.opera.com/en/extensions/details/adblock-plus/' },
    { name: 'Firefox', logo: '/assets/firefox-57-70-svgrepo-com.svg', adguard: 'https://adguard.com/en/adguard-browser-extension/firefox/overview.html', adblockPlus: 'https://addons.mozilla.org/en-US/firefox/addon/adblock-plus/' },
  ],
  mobile: [
    { name: 'Android', logo: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/f7/1a/45/f71a45d1-4dde-0f41-6e58-f41c6e03bb43/AppIcon-0-0-1x_U007epad-0-1-0-85-220.png/200x200ia-75.webp', link: 'https://play.google.com/store/apps/details?id=net.quetta.browser&referrer=utm_source%3Dofficial%2520website%26utm_campaign%3Dgeneral', store: 'Play Market' },
    { name: 'iOS', logo: 'https://play-lh.googleusercontent.com/MwgKUhzQbLqYtp4WWA7J5BSB3ns0ETP0sRUL8ZvdcV86XxcwNwtB2aD9EaYf8s8io1o=s48-rw', link: 'https://apps.apple.com/us/app/quetta-your-adblock-browser/id6504077999', store: 'App Store' },
    { name: 'Huawei', logo: 'https://appimg-dra.dbankcdn.com/application/icon144/65/41cd4a726a4346a2a2464a914e1f590f.png', link: 'https://appgallery.huawei.com/app/C101886403', store: 'AppGallery' },
  ],
};

const AdblockerModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('desktop');
  const [selectedDesktop, setSelectedDesktop] = useState(null);
  const [selectedMobile, setSelectedMobile] = useState('Android');
  const isMobile = /android|iphone|ipad|ipod|harmonyos/i.test(navigator.userAgent);

  useEffect(() => {
    if (isMobile) setActiveTab('mobile');
  }, [isMobile]);

  const getMobileInfo = () => browsers.mobile.find(m => m.name === selectedMobile);

  return (
    <div className="adblocker-modal-overlay" onClick={onClose}>
      <div className="adblocker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="adblocker-modal-header">
          <button className={`adblocker-tab ${activeTab === 'desktop' ? 'active' : ''}`} onClick={() => setActiveTab('desktop')}>Desktop</button>
          <button className={`adblocker-tab ${activeTab === 'mobile' ? 'active' : ''}`} onClick={() => setActiveTab('mobile')}>Mobile</button>
        </div>
        <div className="adblocker-modal-body">
          {activeTab === 'desktop' && (
            <div className="desktop-content">
              <h2>Select which browser you are using:</h2>
              <div className="browser-list">
                {browsers.desktop.map((browser) => (
                  <div key={browser.name} className="browser-item-container">
                    <div className={`browser-item glass-background ${selectedDesktop === browser ? 'selected' : ''}`} onClick={() => setSelectedDesktop(browser)}>
                      <img src={browser.logo} alt={browser.name} />
                    </div>
                    <span>{browser.name}</span>
                  </div>
                ))}
              </div>
              {selectedDesktop && (
                <div className="extension-container">
                  <div className="extension-list">
                    <a href={selectedDesktop.adguard} target="_blank" rel="noopener noreferrer" className="extension-item glass-background">
                      <img src="https://camo.githubusercontent.com/834641c27706ace755bcc2f717994b02d16dde68362d09daf7e790a59a77e069/68747470733a2f2f63646e2e616467756172642e636f6d2f7075626c69632f416467756172642f436f6d6d6f6e2f4c6f676f732f6578745f6c6f676f2e737667" alt="AdGuard" />
                    </a>
                    <a href={selectedDesktop.adblockPlus} target="_blank" rel="noopener noreferrer" className="extension-item glass-background">
                      <img src="https://adblockplus.org/img/adblockplus-logo-color.svg?2497015760" alt="AdBlock Plus" />
                    </a>
                  </div>
                  <p className="instruction-text">Download once and restart the page again. It will work correctly without ads. Watch Films As you want without ads.</p>
                </div>
              )}
            </div>
          )}
          {activeTab === 'mobile' && (
            <div className="mobile-content">
              <div className="mobile-tabs">
                {browsers.mobile.map((mobile) => (
                  <button key={mobile.name} className={`mobile-tab ${selectedMobile === mobile.name ? 'active' : ''}`} onClick={() => setSelectedMobile(mobile.name)}>{mobile.name}</button>
                ))}
              </div>
              {selectedMobile && (
                <div className="mobile-recommendation">
                    <a href={getMobileInfo().link} target="_blank" rel="noopener noreferrer" className="mobile-app-item glass-background">
                        <img src={getMobileInfo().logo} alt={getMobileInfo().name} />
                    </a>
                    <div className="mobile-text-container">
                        <p className="instruction-text">Download once and enter to the website and it will work correctly without ads. Watch Films As you want without ads.</p>
                        <a href={getMobileInfo().link} target="_blank" rel="noopener noreferrer" className="download-link">Download from {getMobileInfo().store}</a>
                    </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AdBlockerTrigger = () => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleProtectedClick = useCallback(async (event) => {
        const targetElement = event.target.closest(PROTECTED_ELEMENT_SELECTORS);
        if (!targetElement) return;

        event.preventDefault();

        const adblockerIsActive = await adblockDetector();

        if (!adblockerIsActive) { 
            setShowModal(true);
        } else { 
            const destination = targetElement.getAttribute('href');
            if (destination) {
                navigate(destination);
            }
        }
    }, [navigate]);

    useEffect(() => {
        document.addEventListener('click', handleProtectedClick, true);
        return () => {
            document.removeEventListener('click', handleProtectedClick, true);
        };
    }, [handleProtectedClick]);

    return showModal ? <AdblockerModal onClose={() => setShowModal(false)} /> : null;
}

export default AdBlockerTrigger;
