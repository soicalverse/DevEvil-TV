
export default function adblockDetector() {
  return new Promise(async (resolve) => {
    // 1. Whitelist browsers that should always pass.
    try {
      const isBrave = navigator.brave && typeof navigator.brave.isBrave === 'function' && (await navigator.brave.isBrave());
      const userAgent = navigator.userAgent.toLowerCase();
      const isQuetta = userAgent.includes('quetta');
      // The user also mentioned "Free Adblocker Browser", whose user agent often contains 'adb'.
      const isFreeAdblockerBrowser = userAgent.includes('adb');

      if (isBrave || isQuetta || isFreeAdblockerBrowser) {
        console.log('Whitelisted browser detected.');
        return resolve(true); // Treat as having a "good" adblocker.
      }
    } catch (e) {
      console.warn('Browser whitelist check failed:', e);
    }

    // 2. Fallback to a standard DOM-based "bait" technique for other cases.
    const bait = document.createElement('div');
    bait.innerHTML = '&nbsp;';
    bait.className = 'pub_300x250 pub_300x250m pub_728x90 text-ad text-ads text-ad-links'; // Common ad class names
    bait.style.cssText = 'position:absolute; top:-9999px; left:-9999px; width:1px; height:1px; visibility:hidden;';
    document.body.appendChild(bait);

    // Use a short timeout to allow adblocker extensions to act on the element.
    setTimeout(() => {
      try {
        const baitElement = document.querySelector('.pub_300x250');
        // If the bait element is removed, hidden, or has no size, an adblocker is active.
        if (
          !baitElement || 
          !document.body.contains(baitElement) ||
          baitElement.offsetHeight === 0 ||
          window.getComputedStyle(baitElement).getPropertyValue('display') === 'none'
        ) {
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (e) {
        resolve(false); // Assume no adblocker on error.
      } finally {
        // Clean up the bait element from the DOM.
        if (bait.parentNode) {
          bait.parentNode.removeChild(bait);
        }
      }
    }, 150);
  });
}
