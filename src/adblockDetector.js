export default async function adblockDetector() {
  // First, whitelist browsers with known built-in adblockers as a fast-path.
  if (navigator.brave && typeof navigator.brave.isBrave === 'function' && (await navigator.brave.isBrave())) {
    return true; // Brave browser detected
  }
  if (navigator.userAgent.toLowerCase().includes('quetta')) {
    return true; // Quetta browser detected via user agent
  }

  // If whitelisting fails, fallback to a more aggressive DOM-based detection.
  // This method is more reliable for browsers with adblockers that don't have a specific API.
  return new Promise((resolve) => {
    // Create a bait element with multiple, common ad-related identifiers.
    const adBait = document.createElement('div');
    adBait.innerHTML = '&nbsp;';
    // Using a combination of class names and an ID to increase chances of detection.
    adBait.className = 'ad-container adsbox banner-ad text-ad ad-unit';
    adBait.id = 'google-ad';
    
    // Style the bait to be invisible to the user.
    adBait.style.position = 'absolute';
    adBait.style.left = '-9999px';
    adBait.style.width = '1px';
    adBait.style.height = '1px';
    adBait.style.visibility = 'hidden';

    // Append bait to the body
    document.body.appendChild(adBait);

    // Use a short timeout to allow the adblocker to act on the element.
    setTimeout(() => {
      try {
        const baitElement = document.getElementById('google-ad');
        
        // An adblocker is active if the bait element is:
        // 1. null (removed from the DOM)
        // 2. has an offsetHeight of 0 (CSS rule like `height: 0 !important`)
        // 3. is not visible (CSS rule like `display: none !important`)
        if (
          baitElement === null || 
          baitElement.offsetHeight === 0 || 
          window.getComputedStyle(baitElement).getPropertyValue('display') === 'none'
        ) {
          resolve(true); // Adblocker is active
        } else {
          resolve(false); // No adblocker detected
        }
      } catch (e) {
        // In case of any error during detection, assume no adblocker.
        resolve(false);
      } finally {
        // Always clean up the bait element from the DOM.
        if (adBait && adBait.parentNode) {
          adBait.parentNode.removeChild(adBait);
        }
      }
    }, 150); // Increased timeout slightly for more reliability
  });
}
