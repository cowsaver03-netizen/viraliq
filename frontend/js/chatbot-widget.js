(function() {
    'use strict';

    var STORAGE_KEY = 'viraliq_chatbot_history_v1';
    var WIDGET_ID = 'viraliq-chatbot-widget';
    var RESPONSE_DELAY_MIN = 650;
    var RESPONSE_DELAY_MAX = 950;

    var QUICK_REPLIES = [
        'View Pricing',
        'All Pricing Details',
        'Our Services',
        'All Services',
        'Contact Us'
    ];

    var CONTACT_DETAILS = {
        phone: '+91 79735 69236',
        whatsapp: '+91 70870 12231',
        email: 'Info@ViraliQ.ai',
        supportEmail: 'support@viraliq.ai',
        location: 'Mohali, India'
    };

    var SERVICES = [
        {
            name: 'Lead Generation System',
            detail: 'High-converting ad systems that bring ready-to-buy customers to your WhatsApp or funnel.'
        },
        {
            name: 'Audience Targeting',
            detail: 'Reach the right users most likely to inquire and convert quickly.'
        },
        {
            name: 'Ad Creative Strategy',
            detail: 'Scroll-stopping ad creatives built for leads and conversions.'
        },
        {
            name: 'Sales Conversion System',
            detail: 'Follow-up and closing workflows that convert more leads into paying customers.'
        },
        {
            name: 'Automation & CRM',
            detail: 'Lead tracking, reminders, and automation so no inquiry is missed.'
        },
        {
            name: 'Revenue Scaling',
            detail: 'Optimize campaigns and funnels to increase ROI and profitable growth.'
        }
    ];

    var PRICING_PLANS = [
        {
            name: 'Starter Lead Boost',
            duration: '7 Days',
            price: 'Rs 500',
            points: [
                'Quick lead generation campaign',
                'AI-based targeting strategy',
                'High-converting creative',
                'Direct lead collection system'
            ]
        },
        {
            name: 'Starter Lead Boost',
            duration: '7 Days',
            price: 'Rs 1,000',
            points: [
                'Quick lead generation campaign',
                'AI-based targeting strategy',
                'Lead-ready audience targeting',
                'Fast activation'
            ]
        },
        {
            name: 'Starter Lead Boost',
            duration: '7 Days',
            price: 'Rs 5,000',
            points: [
                'Quick lead generation campaign',
                'AI-based targeting strategy',
                'Creative + direct lead flow',
                'Fast activation with early leads'
            ]
        },
        {
            name: 'Basic Lead Generation',
            duration: '7 Days',
            price: 'Rs 10,000',
            points: [
                'Multi-campaign setup',
                'Optimized target audience',
                'Lead tracking system',
                'Continuous optimization'
            ]
        },
        {
            name: 'Growth Lead System',
            duration: '15 Days',
            price: 'Rs 20,000',
            points: [
                'Advanced lead generation campaigns',
                'Retargeting for interested users',
                'Funnel-based strategy',
                'Scalable lead flow setup'
            ]
        },
        {
            name: 'Conversion Lead System',
            duration: '15 Days',
            price: 'Rs 30,000',
            points: [
                'Full lead funnel setup',
                'Retargeting + lookalike audience',
                'Lead filtering strategy',
                'WhatsApp lead handling flow'
            ]
        },
        {
            name: 'Lead Scaling Machine',
            duration: '30 Days',
            price: 'Rs 50,000',
            points: [
                'Aggressive lead generation',
                'Campaign scaling for higher volume',
                'CRM for lead management',
                'Daily optimization'
            ]
        },
        {
            name: 'Advanced Lead System',
            duration: '60 Days',
            price: 'Rs 1 Lakh',
            points: [
                'Complete lead funnel',
                'Landing page optional',
                'Lead nurturing system',
                'Dedicated manager'
            ]
        },
        {
            name: 'Business Lead Engine',
            duration: '6 Months',
            price: 'Rs 5 Lakh',
            points: [
                'High-ticket lead systems',
                'Multi-platform leads (Meta + Google)',
                'Advanced funnel + CRM',
                'Automated follow-ups and growth planning'
            ]
        }
    ];

    function formatServicesDetails() {
        return SERVICES.map(function(service, index) {
            return (index + 1) + '. ' + service.name + ': ' + service.detail;
        }).join('\n');
    }

    function formatPricingDetails() {
        return PRICING_PLANS.map(function(plan, index) {
            var topPoints = plan.points.join(', ');
            return (index + 1) + '. ' + plan.name + ' (' + plan.duration + ') - ' + plan.price + '\n   Includes: ' + topPoints;
        }).join('\n\n');
    }

    var CONFIG = {
        title: 'Chat Support',
        status: 'Typically replies instantly',
        welcome: 'Hi, welcome to Viraliq. How can I help you today?',
        intro: 'You can ask about pricing, services, contact details, or lead generation.',
        responses: [
            {
                keywords: ['hello', 'hi', 'hey', 'namaste'],
                reply: 'Hello! How can I help you today? You can ask about pricing, services, or contact details.'
            },
            {
                keywords: ['range', 'budget', 'minimum', 'starting', 'start from'],
                reply: 'Our smaller lead campaigns start from affordable test packages, and full-scale systems go up to higher-growth plans depending on ad spend and support needs. If you share your budget, I can point you to the right range.'
            },
            {
                keywords: ['all pricing', 'pricing details', 'full pricing', 'complete pricing', 'all plans'],
                reply: formatPricingDetails()
            },
            {
                keywords: ['price', 'pricing', 'cost', 'package', 'plans'],
                reply: 'Our pricing starts from Rs 500 and goes up to Rs 5 Lakh based on duration and growth level. Send "All Pricing Details" and I will share every plan with inclusions.'
            },
            {
                keywords: ['contact', 'phone', 'email', 'whatsapp', 'reach'],
                reply: 'You can reach us at ' + CONTACT_DETAILS.phone + ', WhatsApp ' + CONTACT_DETAILS.whatsapp + ', or email ' + CONTACT_DETAILS.email + '. Our support email is ' + CONTACT_DETAILS.supportEmail + ' and we are based in ' + CONTACT_DETAILS.location + '.'
            },
            {
                keywords: ['service', 'services', 'what do you do', 'offer', 'solutions'],
                reply: 'We help with lead generation, audience targeting, ad creatives, sales conversion systems, automation & CRM, and revenue scaling. I can also explain any one service in simple words if you want.'
            },
            {
                keywords: ['all services', 'service details', 'full services', 'complete services'],
                reply: formatServicesDetails()
            },
            {
                keywords: ['lead generation', 'generate leads', 'lead generation system', 'ads', 'campaign'],
                reply: 'Lead generation is our core service. We build ad systems that bring ready-to-buy customers to your WhatsApp or funnel, then help you convert them with follow-up systems.'
            },
            {
                keywords: ['sales', 'conversion', 'closing', 'follow up', 'follow-up'],
                reply: 'Our sales conversion systems help you follow up faster, close more leads, and turn enquiries into paying customers with better process and automation.'
            },
            {
                keywords: ['automation', 'crm', 'followup', 'follow-up system'],
                reply: 'Automation & CRM helps you track leads, automate follow-ups, and keep your team organized so no enquiry gets missed.'
            },
            {
                keywords: ['revenue', 'scale', 'scaling', 'grow'],
                reply: 'Revenue scaling means we optimize your campaigns and funnels so you can increase ROI and grow profitably without wasting spend.'
            },
            {
                keywords: ['lead', 'leads', 'generate', 'lead generation'],
                reply: 'We build lead generation systems that bring ready-to-buy customers into your funnel fast.'
            },
            {
                keywords: ['call', 'mobile', 'number', 'phone number'],
                reply: 'You can call us at ' + CONTACT_DETAILS.phone + ' or tap Contact Us for the full details.'
            },
            {
                keywords: ['location', 'office', 'address', 'where are you'],
                reply: 'We are based in ' + CONTACT_DETAILS.location + '. If needed, I can also share the full contact page details.'
            },
            {
                keywords: ['thanks', 'thank you', 'bye', 'goodbye'],
                reply: 'You are welcome. If you need more help, just send another message anytime.'
            }
        ]
    };

    var state = {
        open: false,
        history: [],
        typingTimer: null
    };

    var elements = {};

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function getTimeLabel(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function loadHistory() {
        try {
            var stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) {
                return [];
            }
            var parsed = JSON.parse(stored);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            return [];
        }
    }

    function saveHistory() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state.history));
        } catch (error) {
            // Ignore storage failures.
        }
    }

    function buildWidget() {
        if (document.getElementById(WIDGET_ID)) {
            return document.getElementById(WIDGET_ID);
        }

        var widget = document.createElement('div');
        widget.id = WIDGET_ID;
        widget.className = 'chatbot-widget';
        widget.setAttribute('aria-live', 'polite');
        widget.innerHTML = '\n            <button type="button" class="chatbot-launcher" aria-label="Open chat support" aria-expanded="false">\n                <svg class="chatbot-launcher__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">\n                    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"></path>\n                    <path d="M8 10h8"></path>\n                    <path d="M8 14h5"></path>\n                </svg>\n            </button>\n            <div class="chatbot-panel" role="dialog" aria-modal="false" aria-label="Chat Support">\n                <div class="chatbot-header">\n                    <div class="chatbot-header__title-wrap">\n                        <div class="chatbot-header__avatar" aria-hidden="true">\n                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n                                <path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2"></path>\n                                <circle cx="12" cy="7" r="4"></circle>\n                            </svg>\n                        </div>\n                        <div>\n                            <h3 class="chatbot-header__title">' + escapeHtml(CONFIG.title) + '</h3>\n                            <p class="chatbot-header__status">' + escapeHtml(CONFIG.status) + '</p>\n                        </div>\n                    </div>\n                    <div class="chatbot-header__actions">\n                        <button type="button" class="chatbot-icon-btn chatbot-minimize" aria-label="Minimize chat">\n                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">\n                                <path d="M5 12h14"></path>\n                            </svg>\n                        </button>\n                        <button type="button" class="chatbot-icon-btn chatbot-close" aria-label="Close chat">\n                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n                                <path d="M18 6 6 18"></path>\n                                <path d="M6 6l12 12"></path>\n                            </svg>\n                        </button>\n                    </div>\n                </div>\n                <div class="chatbot-messages" aria-label="Chat messages"></div>\n                <div class="chatbot-quick-replies" aria-label="Quick replies"></div>\n                <form class="chatbot-input-area" autocomplete="off">\n                    <input class="chatbot-input" type="text" placeholder="Type your message..." aria-label="Type your message" maxlength="240">\n                    <button type="submit" class="chatbot-send" aria-label="Send message">\n                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n                            <path d="M22 2 11 13"></path>\n                            <path d="M22 2 15 22 11 13 2 9 22 2z"></path>\n                        </svg>\n                    </button>\n                </form>\n            </div>\n        ';

        document.body.appendChild(widget);
        return widget;
    }

    function cacheElements() {
        var widget = document.getElementById(WIDGET_ID);
        elements.widget = widget;
        elements.launcher = widget.querySelector('.chatbot-launcher');
        elements.panel = widget.querySelector('.chatbot-panel');
        elements.messages = widget.querySelector('.chatbot-messages');
        elements.quickReplies = widget.querySelector('.chatbot-quick-replies');
        elements.form = widget.querySelector('.chatbot-input-area');
        elements.input = widget.querySelector('.chatbot-input');
        elements.closeButton = widget.querySelector('.chatbot-close');
        elements.minimizeButton = widget.querySelector('.chatbot-minimize');
    }

    function renderQuickReplies() {
        elements.quickReplies.innerHTML = '';
        QUICK_REPLIES.forEach(function(label) {
            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'chatbot-quick-reply';
            button.textContent = label;
            button.addEventListener('click', function() {
                sendUserMessage(label);
            });
            elements.quickReplies.appendChild(button);
        });
    }

    function renderMessage(message) {
        var row = document.createElement('div');
        row.className = 'chatbot-row chatbot-row--' + message.role;

        var bubble = document.createElement('div');
        bubble.className = 'chatbot-bubble chatbot-bubble--' + message.role;
        bubble.innerHTML = '<div>' + escapeHtml(message.text) + '</div>' + '<div class="chatbot-meta">' + escapeHtml(message.time) + '</div>';

        row.appendChild(bubble);
        elements.messages.appendChild(row);
        scrollToBottom();
    }

    function renderTyping() {
        var row = document.createElement('div');
        row.className = 'chatbot-row chatbot-row--bot chatbot-typing-row';
        row.innerHTML = '\n            <div class="chatbot-bubble chatbot-bubble--bot">\n                <div class="chatbot-typing" aria-label="Bot typing">\n                    <span></span><span></span><span></span>\n                </div>\n            </div>\n        ';
        elements.messages.appendChild(row);
        scrollToBottom();
        return row;
    }

    function scrollToBottom() {
        elements.messages.scrollTop = elements.messages.scrollHeight;
    }

    function getResponse(text) {
        var normalized = String(text).toLowerCase();

        for (var i = 0; i < CONFIG.responses.length; i += 1) {
            var rule = CONFIG.responses[i];
            for (var j = 0; j < rule.keywords.length; j += 1) {
                if (normalized.indexOf(rule.keywords[j]) !== -1) {
                    return rule.reply;
                }
            }
        }

        return 'Thanks for your message. I can help with all pricing details, full service details, contact details, lead generation, sales systems, and CRM automation. Try sending "All Pricing Details" or "All Services".';
    }

    function addMessage(role, text) {
        var message = {
            role: role,
            text: text,
            time: getTimeLabel(new Date())
        };

        state.history.push(message);
        saveHistory();
        renderMessage(message);
    }

    function sendBotReply(userText) {
        if (state.typingTimer) {
            clearTimeout(state.typingTimer);
        }

        var typingRow = renderTyping();
        var reply = getResponse(userText);
        var delay = RESPONSE_DELAY_MIN + Math.floor(Math.random() * (RESPONSE_DELAY_MAX - RESPONSE_DELAY_MIN));

        state.typingTimer = window.setTimeout(function() {
            typingRow.remove();
            addMessage('bot', reply);
        }, delay);
    }

    function sendUserMessage(text) {
        var value = String(text || '').trim();
        if (!value) {
            return;
        }

        addMessage('user', value);
        elements.input.value = '';
        sendBotReply(value);
    }

    function openWidget() {
        state.open = true;
        elements.widget.classList.remove('is-minimized');
        elements.widget.classList.add('is-open');
        elements.launcher.setAttribute('aria-expanded', 'true');
        window.setTimeout(function() {
            elements.input.focus();
        }, 120);
    }

    function closeWidget() {
        state.open = false;
        elements.widget.classList.remove('is-open');
        elements.launcher.setAttribute('aria-expanded', 'false');
    }

    function toggleWidget() {
        if (state.open) {
            closeWidget();
        } else {
            openWidget();
        }
    }

    function minimizeWidget() {
        state.open = false;
        elements.widget.classList.remove('is-open');
        elements.widget.classList.add('is-minimized');
        elements.launcher.setAttribute('aria-expanded', 'false');
    }

    function injectWelcomeMessages() {
        if (state.history.length === 0) {
            addMessage('bot', CONFIG.welcome);
            addMessage('bot', CONFIG.intro);
            saveHistory();
            return;
        }

        state.history.forEach(function(message) {
            renderMessage(message);
        });
    }

    function bindEvents() {
        elements.launcher.addEventListener('click', toggleWidget);
        elements.closeButton.addEventListener('click', closeWidget);
        elements.minimizeButton.addEventListener('click', minimizeWidget);

        elements.form.addEventListener('submit', function(event) {
            event.preventDefault();
            sendUserMessage(elements.input.value);
        });

        elements.input.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                sendUserMessage(elements.input.value);
            }
        });

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && state.open) {
                closeWidget();
            }
        });

        document.addEventListener('click', function(event) {
            if (!state.open) {
                return;
            }

            if (!elements.widget.contains(event.target)) {
                closeWidget();
            }
        });
    }

    function init() {
        if (!document.body || document.getElementById(WIDGET_ID)) {
            return;
        }

        buildWidget();
        cacheElements();
        renderQuickReplies();
        state.history = loadHistory();
        injectWelcomeMessages();
        bindEvents();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.ViraliqChatbot = {
        open: openWidget,
        close: closeWidget,
        toggle: toggleWidget,
        sendMessage: sendUserMessage,
        config: CONFIG,
        quickReplies: QUICK_REPLIES
    };
})();
