
(function() {
    'use strict';

    const BYPASS_FLAG = 'adblockAllowed';
    const DETECTION_TIMEOUT = 800;
    const PROTECTED_ELEMENT_SELECTORS = [
        '.play-button',
        '.watch-now',
    ].join(', ');

    if (localStorage.getItem(BYPASS_FLAG) === 'true') {
        return;
    }

    function isMobileDevice() {
        return /android|iphone|ipad|ipod|harmonyos/i.test(navigator.userAgent);
    }

    function isSupportedBrowser() {
        const supportedBrowsers = [
            'Brave', 'Adblock', 'AdBlock', 'AdGuard', 'uBlock', 'Ghostery',
            'FreeAdblock', 'HSV', 'Quetta', 'BrowseHere', 'com.tcl.browser',
            'com.hsv.freeadblockerbrowser', 'net.quetta.browser', 'Aloha',
            'DuckDuckGo', 'Firefox Focus', 'Stargon', 'Kiwi', 'Privacy Browser'
        ];
        const userAgent = navigator.userAgent;
        return supportedBrowsers.some(browser => new RegExp(browser, 'i').test(userAgent));
    }

    function isAdblockActive() {
        const detectionPromise = new Promise((resolve) => {
            let adblockerDetected = false;

            const adScript = document.createElement('script');
            adScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
            adScript.onerror = () => {
                adblockerDetected = true;
                resolve(true);
            };
            adScript.onload = () => resolve(adblockerDetected);
            document.head.appendChild(adScript);

            const baitDiv = document.createElement('div');
            baitDiv.className = 'adsbygoogle';
            baitDiv.style.cssText = 'height:1px !important; width:1px !important; position:absolute !important; left:-9999px !important; top:-9999px !important;';
            document.body.appendChild(baitDiv);

            setTimeout(() => {
                if (baitDiv.offsetHeight === 0) {
                    adblockerDetected = true;
                    resolve(true);
                }
                if(baitDiv.parentNode) {
                    baitDiv.parentNode.removeChild(baitDiv);
                }
                resolve(adblockerDetected);
            }, 50);
        });

        return Promise.race([
            detectionPromise,
            new Promise(resolve => setTimeout(() => resolve(false), DETECTION_TIMEOUT))
        ]);
    }

    function blockAction(event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        document.dispatchEvent(new CustomEvent('showAdblockModal'));
    }

    async function handleProtectedClick(event) {
        const targetElement = event.target.closest(PROTECTED_ELEMENT_SELECTORS);
        if (!targetElement) {
            return;
        }
        
        if (localStorage.getItem(BYPASS_FLAG) === 'true') {
            return;
        }

        if (isMobileDevice()) {
            if (isSupportedBrowser()) {
                return; // Allow action on supported mobile browsers
            } else {
                blockAction(event); // Block on unsupported mobile browsers
                return;
            }
        }

        const adblockerDetected = await isAdblockActive();
        if (adblockerDetected) {
            return; // Allow action for desktop with adblocker
        }

        blockAction(event);
    }

    document.addEventListener('click', handleProtectedClick, true);

    document.addEventListener('showAdblockModal', () => {
        document.body.dispatchEvent(new CustomEvent('openAdblockModal', {
            bubbles: true
        }));
    });

    window.bypassAdblockCheck = () => {
        localStorage.setItem(BYPASS_FLAG, 'true');
        location.reload();
    };

})();
