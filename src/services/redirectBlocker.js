'''
(function() {
    'use strict';

    const currentOrigin = window.location.origin;

    // Override window.open
    const originalWindowOpen = window.open;
    window.open = function(url, target, features) {
        let isInternal = false;
        if (url) {
            try {
                const targetUrl = new URL(url, window.location.href);
                isInternal = targetUrl.origin === currentOrigin;
            } catch (e) {
                isInternal = !url.startsWith('http');
            }
        }

        if (isInternal) {
            return originalWindowOpen.call(window, url, target, features);
        }

        console.log('Redirect Blocker: Blocked popup attempt to:', url);
        return null;
    };

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.tagName === 'IFRAME') {
                        node.sandbox.add('allow-scripts', 'allow-same-origin');
                    }
                });
            }
        }
    });

    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

})();
'''