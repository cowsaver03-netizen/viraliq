(function(){
    const { BASE_URL, API} = window.APP_CONFIG;
    const API_URL = BASE_URL + API.SOCIALS;
    
async function loadSocialLinks() {
    const res = await fetch(API_URL);
    const links = await res.json();
    
    document.getElementById('instagram').value = links.instagram || '';
    document.getElementById('facebook').value = links.facebook || '';
    document.getElementById('twitter').value = links.twitter || '';
    document.getElementById('whatsapp').value = links.whatsapp || '';
}

function saveSocialLinks() {
    const instagram = document.getElementById('instagram').value.trim();
    const facebook = document.getElementById('facebook').value.trim();
    const twitter = document.getElementById('twitter').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();

    // Validate URLs
    if (instagram && !validators.url(instagram)) {
        notificationManager.error('Invalid Instagram URL');
        return;
    }
    if (facebook && !validators.url(facebook)) {
        notificationManager.error('Invalid Facebook URL');
        return;
    }
    if (twitter && !validators.url(twitter)) {
        notificationManager.error('Invalid Twitter URL');
        return;
    }

    const links = { instagram, facebook, twitter, whatsapp };
    storage.updateSocialLinks(links);
    storage.logActivity('Update', 'Social Media', 'Social links updated');
    notificationManager.success('Social links saved successfully');
}

// Initialize social on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('socialForm')) {
        loadSocialLinks();
    }
});

})();