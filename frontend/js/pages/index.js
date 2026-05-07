(function () {
  
  const { BASE_URL, API } = window.APP_CONFIG;
  const API_URL = BASE_URL + API.TEAM;
  const IMAGE_BASE = BASE_URL.replace('/api/', '');

  document.addEventListener('DOMContentLoaded', function () {
    loadHomeTeam();
  });

  async function loadHomeTeam() {
    try {
      const res = await fetch(API_URL);
      const team = await res.json();

      const container = document.getElementById('homeTeamContainer');

      if (!team.length) {
        container.innerHTML = "<p>No team found</p>";
        return;
      }

      // 👉 Show only first 3 members on homepage
      const limitedTeam = team.slice(0, 3);

      container.innerHTML = limitedTeam.map((member, index) => `
        <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay=".${index + 1}s">
          <div class="team-block">
            <div class="inner-block">
              <div class="image-block">
                <img src="${member.image}" alt="${member.name}">
                <img src="${member.image}" alt="${member.name}">
              </div>
              <div class="content-block">
                <h4 class="title">
                  <a href="team.html">${member.name}</a>
                </h4>
                <div class="text">${member.designation}</div>
                <div class="social-icon">
                  ${member.twitter ? `<a href="${member.twitter}" target="_blank"><i class="fa-brands fa-x-twitter"></i></a>` : ""}
                  ${member.facebook ? `<a href="${member.facebook}" target="_blank"><i class="fa-brands fa-facebook-f"></i></a>` : ""}
                  ${member.whatsapp ? `<a href="${member.whatsapp}" target="_blank"><i class="fa-brands fa-whatsapp"></i></a>` : ""}
                  ${member.instagram ? `<a href="${member.instagram}" target="_blank"><i class="fa-brands fa-instagram"></i></a>` : ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      `).join('');

    } catch (error) {
      console.error("Error loading home team:", error);
    }
  }

})();