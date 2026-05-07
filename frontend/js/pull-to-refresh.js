/**
 * Native Pull-to-Refresh Compatibility Helper
 * Intentionally keeps browser default behavior (no custom UI, no manual reload).
 */

(function() {
    'use strict';

    function applyNativeSettings() {
        const root = document.documentElement;
        const body = document.body;

        if (!body) {
            return;
        }

        // Allow normal vertical scrolling and native pull-to-refresh on mobile browsers.
        root.style.overscrollBehaviorY = 'auto';
        body.style.overscrollBehaviorY = 'auto';

        // Ensure page remains scrollable.
        root.style.overflowY = 'auto';
        body.style.overflowY = 'auto';
    }

    function ensureChatbotAssets() {
        if (document.getElementById('viraliq-chatbot-widget') || document.querySelector('script[src*="chatbot-widget.js"]')) {
            return;
        }

        if (!document.querySelector('link[href*="chatbot-widget.css"]')) {
            const style = document.createElement('link');
            style.rel = 'stylesheet';
            style.href = 'css/chatbot-widget.css';
            document.head.appendChild(style);
        }

        if (!document.querySelector('script[src*="chatbot-widget.js"]')) {
            const script = document.createElement('script');
            script.src = 'js/chatbot-widget.js';
            script.defer = true;
            document.body.appendChild(script);
        }
    }

    window.PullToRefresh = {
        init: applyNativeSettings,
        disable: function() {},
        enable: applyNativeSettings
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            applyNativeSettings();
            ensureChatbotAssets();
        });
    } else {
        applyNativeSettings();
        ensureChatbotAssets();
    }
})();
