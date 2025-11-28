
export default function adblockDetector() {
  return new Promise((resolve) => {
    const testURL = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    const myRequest = new Request(testURL, {
      method: 'HEAD',
      mode: 'no-cors',
    });

    fetch(myRequest)
      .then(response => {
        // The request was successful, which means ad-blocking is NOT active.
        resolve(false);
      })
      .catch(error => {
        // The request failed, which means an adblocker is likely active.
        resolve(true);
      });
  });
}
