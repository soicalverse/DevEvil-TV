const adblockDetector = () => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return resolve(false);
    }

    // Method 1: Bait element. More likely to work for element-hiding rules.
    const bait = document.createElement('div');
    bait.className = 'ad-zone ad-space ad-banner ad-container ads ad-placeholder pub_300x250 pub_300x250m pub_728x90 text-ad text-ads text-ad-links ad-wrapper';
    bait.style.cssText = 'position:absolute!important;left:-9999px!important;top:-9999px!important;width:1px!important;height:1px!important;pointer-events:none!important;';
    bait.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bait);

    // Give the browser a moment to apply styles
    setTimeout(() => {
      const baitFailed = !document.body.contains(bait) || bait.offsetHeight === 0 || window.getComputedStyle(bait).display === 'none';
      if (bait.parentNode) {
        bait.parentNode.removeChild(bait);
      }
      if (baitFailed) {
        return resolve(true); // Ad blocker detected by bait element
      }

      // Method 2: Fetch request to a known ad-serving domain.
      // This is very reliable for network-level blockers.
      fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store'
      }).then(response => {
        // If fetch succeeds, it might still be a false negative, but it's less likely.
        // We'll trust the bait check result if fetch succeeds.
        resolve(false);
      }).catch(error => {
        // A failed fetch is a strong indicator of an ad blocker.
        resolve(true);
      });
    }, 100);
  });
};

export default adblockDetector;
