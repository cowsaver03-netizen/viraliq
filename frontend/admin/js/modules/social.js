(function () {
    const { BASE_URL, API } = window.APP_CONFIG;
    const API_URL = BASE_URL + API.SOCIALS;

    /* =========================
       LOAD SOCIAL LINKS
    ========================= */
    async function loadSocialLinks() {
        try {
            const res = await fetch(API_URL);

            if (res.status === 404) {
                // No data yet — fields stay empty, that's fine
                return;
            }

            if (!res.ok) {
                notificationManager.error('Failed to load social links');
                return;
            }

            const social = await res.json();

            document.getElementById('instagram').value = social.instagram || '';
            document.getElementById('facebook').value  = social.facebook  || '';
            document.getElementById('twitter').value   = social.twitter   || '';
            document.getElementById('whatsapp').value  = social.whatsapp  || '';

        } catch (err) {
            console.error('Load error:', err);
            notificationManager.error('Server error while loading');
        }
    }

    /* =========================
       SAVE / UPDATE SOCIAL LINKS
       → PUT /api/social
    ========================= */
    window.saveSocialLinks = async function () {
        const instagram = document.getElementById('instagram').value.trim();
        const facebook  = document.getElementById('facebook').value.trim();
        const twitter   = document.getElementById('twitter').value.trim();
        const whatsapp  = document.getElementById('whatsapp').value.trim();

        if (!instagram || !facebook || !twitter || !whatsapp) {
            notificationManager.error('All fields are required');
            return;
        }

        try {
            const res = await fetch(API_URL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ instagram, facebook, twitter, whatsapp })
            });

            const data = await res.json();

            if (!res.ok) {
                notificationManager.error(data.message || 'Failed to save');
                return;
            }

            notificationManager.success('Social links saved successfully');

        } catch (err) {
            console.error('Save error:', err);
            notificationManager.error('Server error while saving');
        }
    };

    /* =========================
       CLEAR ALL SOCIAL LINKS
       → DELETE /api/social
    ========================= */
    window.clearSocialLinks = async function () {
        if (!confirm('Are you sure you want to clear all social links?')) return;

        try {
            const res = await fetch(API_URL, {
                method: 'DELETE'
            });

            const data = await res.json();

            if (!res.ok) {
                notificationManager.error(data.message || 'Failed to clear');
                return;
            }

            // Clear all input fields
            document.getElementById('instagram').value = '';
            document.getElementById('facebook').value  = '';
            document.getElementById('twitter').value   = '';
            document.getElementById('whatsapp').value  = '';

            notificationManager.success(data.message || 'Social links cleared');

        } catch (err) {
            console.error('Clear error:', err);
            notificationManager.error('Server error while clearing');
        }
    };

    /* =========================
       INIT
    ========================= */
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('socialForm')) {
            loadSocialLinks();
        }
    });

})();