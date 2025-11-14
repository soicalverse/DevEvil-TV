// === COMPREHENSIVE REDIRECT BLOCKER ===
(() => {
    'use strict';
    const parentOrigin = new URL(window.location.href).origin;

    const isSafeUrl = (url) => {
        if (!url || typeof url !== 'string') return true;
        if (url.startsWith('blob:')) return true;
        try {
            const targetUrl = new URL(url, window.location.href);
            return targetUrl.origin === parentOrigin;
        } catch (e) {
            return false;
        }
    };

    // 1. Block Popups (window.open)
    const originalWindowOpen = window.open;
    window.open = function(url) {
        if (!isSafeUrl(url)) {
            console.log('[Redirect Blocker] Blocked popup:', url);
            return null;
        }
        return originalWindowOpen.apply(this, arguments);
    };

    // 2. Block Clicks on External Links
    document.addEventListener('click', (e) => {
        let target = e.target;
        while (target && target.tagName !== 'A') {
            target = target.parentElement;
        }
        if (target && target.href && !isSafeUrl(target.href)) {
            console.log('[Redirect Blocker] Blocked click on external link:', target.href);
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);

    // 3. Auto-sandbox iframes and block meta-refreshes using MutationObserver
    const processNode = (node) => {
        if (node.nodeType !== 1) return; // Only process element nodes

        // Sandbox iframes
        const iframes = node.tagName === 'IFRAME' ? [node] : (node.querySelectorAll ? node.querySelectorAll('iframe') : []);
        iframes.forEach(iframe => {
            iframe.sandbox.add('allow-forms', 'allow-presentation', 'allow-scripts', 'allow-same-origin');
            console.log('[Redirect Blocker] Sandboxed an iframe:', iframe.src || 'no-src');
        });

        // Block meta refresh tags
        const metas = node.tagName === 'META' && node.httpEquiv.toLowerCase() === 'refresh' ? [node] : (node.querySelectorAll ? node.querySelectorAll('meta[http-equiv="refresh"]') : []);
        metas.forEach(meta => {
            const content = meta.getAttribute('content') || '';
            const urlMatch = content.match(/url=(.*?)(;|$)/i);
            if (urlMatch && urlMatch[1] && !isSafeUrl(urlMatch[1].trim())) {
                console.log('[Redirect Blocker] Removed meta-refresh tag:', meta.outerHTML);
                meta.remove();
            }
        });
    };

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach(processNode);
        });
    });

    // Initial scan of the DOM
    processNode(document.body);

    // Start observing for future changes
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });

    console.log('[Redirect Blocker] Comprehensive protection is active.');
})();
