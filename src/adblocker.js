// In-Website Ad & Redirect Blocker
(function() {
    'use strict';

    // --- Configuration ---
    const allowedDomains = [
        'youtube.com',
        'github.com',
        'player.videasy.net',
        'vidlink.pro',
        'vidfast.pro',
        'moviesapi.club',
        'superembed.stream',
        'vidsrc.pro',
        'vidsrc.to'
    ];

    const blockedDomains = [
        'doubleclick.net', 'adservice.google.com', 'googlesyndication.com',
        'ad.zuckmedia.com', 'adsafeprotected.com', 'analytics.google.com',
        'track.adform.net', 'adroll.com', 'exoclick.com', 'popads.net',
        'propellerads.com', 'adsterra.com', 'whitebit.com'
    ];

    const blockedKeywords = [
        'ad-container', 'ad-banner', 'ad-wrapper', 'adbox', 'ad-slot',
        'advertisement', 'google_ads', 'popup-ad'
    ];

    // --- Blocker Logic ---

    function isUrlBlocked(url) {
        if (!url) return false;
        try {
            const urlHostname = new URL(url).hostname;

            if (allowedDomains.some(domain => urlHostname.includes(domain))) {
                return false; // Never block allowed domains
            }

            if (blockedDomains.some(domain => urlHostname.includes(domain))) {
                return true; // Always block ad domains
            }

            return false; // Don't block any other domains

        } catch (e) {
            return false; // Invalid URL
        }
    }

    function removeElement(element) {
        if (element && element.parentNode) {
            console.log('Ad-Blocker: Removing element:', element);
            element.parentNode.removeChild(element);
        }
    }

    function cleanPage() {
        document.querySelectorAll('script, iframe').forEach(element => {
            if (isUrlBlocked(element.src)) {
                removeElement(element);
            }
        });

        blockedKeywords.forEach(keyword => {
            document.querySelectorAll(`[class*="${keyword}"], [id*="${keyword}"]`).forEach(removeElement);
        });
    }

    // --- Event Listeners and Observers ---

    document.addEventListener('click', function(event) {
        let target = event.target.closest('a');
        if (target && target.href && target.href !== '#') {
            if (isUrlBlocked(target.href)) {
                console.log('Ad-Blocker: Blocked redirect to:', target.href);
                event.preventDefault();
                event.stopPropagation();
                alert('Redirect to this website is blocked.');
            }
        }
    }, true);

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // ELEMENT_NODE
                    cleanNode(node);
                }
            });
        });
    });

    function cleanNode(node) {
        if (node.matches('script, iframe') && isUrlBlocked(node.src)) {
            removeElement(node);
            return;
        }
        if (blockedKeywords.some(keyword => (String(node.className) || '').includes(keyword) || (node.id || '').includes(keyword))) {
            removeElement(node);
            return;
        }

        node.querySelectorAll('script, iframe').forEach(el => {
            if (isUrlBlocked(el.src)) {
                removeElement(el);
            }
        });
        blockedKeywords.forEach(keyword => {
            node.querySelectorAll(`[class*="${keyword}"], [id*="${keyword}"]`).forEach(removeElement);
        });
    }

    function init() {
        cleanPage();
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        console.log('In-Website Ad & Redirect Blocker is active.');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
