const adblockDetector = () => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return resolve(false);
    }

    const adScript = document.createElement('script');
    const baitDiv = document.createElement('div');
    let detectionFinished = false;

    const cleanup = () => {
      if (adScript.parentNode) adScript.parentNode.removeChild(adScript);
      if (baitDiv.parentNode) baitDiv.parentNode.removeChild(baitDiv);
    };

    const resolveOnce = (result) => {
      if (!detectionFinished) {
        detectionFinished = true;
        cleanup();
        resolve(result);
      }
    };

    setTimeout(() => {
      resolveOnce(false);
    }, 800);

    adScript.onerror = () => {
      resolveOnce(true);
    };

    adScript.onload = () => {
      setTimeout(() => {
        if (baitDiv.offsetHeight === 0) {
          resolveOnce(true);
        } else {
          resolveOnce(false);
        }
      }, 50);
    };

    baitDiv.className = 'adsbygoogle';
    baitDiv.style.cssText = 'position:absolute !important; left:-9999px !important; top:-9999px !important; width:1px !important; height:1px !important;';
    if (document.body) {
        document.body.appendChild(baitDiv);
    } else {
        return resolveOnce(false);
    }
    
adScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
adScript.async = true;
    document.head.appendChild(adScript);
  });
};

export default adblockDetector;
