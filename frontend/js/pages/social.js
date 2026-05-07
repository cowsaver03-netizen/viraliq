(function () {

  const { BASE_URL, API } = window.APP_CONFIG;

  const API_URL = BASE_URL + API.SOCIALS;

  document.addEventListener('DOMContentLoaded', function () {

    loadSocial();

  });

  async function loadSocial() {

    try {

      const res = await fetch(API_URL);
      const social = await res.json();

      renderFooterSocial(social);

      renderNavbarSocial(social);

    } catch (error) {

      console.error("Error loading social links:", error);

    }

  }

  /* =========================
     FOOTER SOCIAL
  ========================= */

  function renderFooterSocial(social) {

    const container =
      document.getElementById('footerSocial');

    if (!container) return;

    let html = '';

    if (social.instagram) {
      html += `
        <a href="${social.instagram}"
           target="_blank"
           rel="noopener noreferrer">

          <i class="fa-brands fa-instagram"></i>
          Instagram

        </a>
      `;
    }

    if (social.whatsapp) {
      html += `
        <a href="${social.whatsapp}"
           target="_blank"
           rel="noopener noreferrer">

          <i class="fa-brands fa-whatsapp"></i>
          WhatsApp

        </a>
      `;
    }

    if (social.twitter) {
      html += `
        <a href="${social.twitter}"
           target="_blank"
           rel="noopener noreferrer">

          <i class="fa-brands fa-x-twitter"></i>
          Twitter

        </a>
      `;
    }

    if (social.facebook) {
      html += `
        <a href="${social.facebook}"
           target="_blank"
           rel="noopener noreferrer">

          <i class="fa-brands fa-facebook-f"></i>
          Facebook

        </a>
      `;
    }

    container.innerHTML = html;

  }

  /* =========================
     NAVBAR SOCIAL
  ========================= */

  function renderNavbarSocial(social) {

    const container =
      document.getElementById('navbarSocial');

    if (!container) return;

    let html = '';

    if (social.twitter) {
      html += `
        <li>
          <a href="${social.twitter}"
             target="_blank"
             rel="noopener noreferrer">

            <i class="fa-brands fa-x-twitter"></i>

          </a>
        </li>
      `;
    }

    if (social.facebook) {
      html += `
        <li>
          <a href="${social.facebook}"
             target="_blank"
             rel="noopener noreferrer">

            <i class="fa-brands fa-facebook-f"></i>

          </a>
        </li>
      `;
    }

    if (social.whatsapp) {
      html += `
        <li>
          <a href="${social.whatsapp}"
             target="_blank"
             rel="noopener noreferrer">

            <i class="fa-brands fa-whatsapp"></i>

          </a>
        </li>
      `;
    }

    if (social.instagram) {
      html += `
        <li>
          <a href="${social.instagram}"
             target="_blank"
             rel="noopener noreferrer">

            <i class="fa-brands fa-instagram"></i>

          </a>
        </li>
      `;
    }

    container.innerHTML = html;

  }

})();