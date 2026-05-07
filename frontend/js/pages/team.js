// (function () {
  
//   const { BASE_URL, API } = window.APP_CONFIG;
//   const API_URL = BASE_URL + API.TEAM;

//   document.addEventListener('DOMContentLoaded', function () {
//     loadTeam();
//   });

//   async function loadTeam() {
//     try {
//       const res = await fetch(API_URL);
//       const teamMembers = await res.json();

//       const container = document.querySelector('.team-section .row');

//       if (!teamMembers.length) {
//         container.innerHTML = "<p>No team members found</p>";
//         return;
//       }

//       container.innerHTML = teamMembers.map((member, index) => `
//         <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay=".${index + 1}s">
//           <div class="team-block">
//             <div class="inner-block">
//               <div class="image-block">
//                 <img src="${member.image}" alt="${member.name}">
//                 <img src="${member.image}" alt="${member.name}">
//               </div>
//               <div class="content-block">
//                 <h4 class="title">${member.name}</h4>
//                 <div class="text">${member.designation}</div>
//                 <div class="social-icon">
//                   ${member.twitter ? `<a href="${member.twitter}" target="_blank"><i class="fa-brands fa-x-twitter"></i></a>` : ""}
//                   ${member.facebook ? `<a href="${member.facebook}" target="_blank"><i class="fa-brands fa-facebook-f"></i></a>` : ""}
//                   ${member.whatsapp ? `<a href="${member.whatsapp}" target="_blank"><i class="fa-brands fa-whatsapp"></i></a>` : ""}
//                   ${member.instagram ? `<a href="${member.instagram}" target="_blank"><i class="fa-brands fa-instagram"></i></a>` : ""}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       `).join('');

//     } catch (error) {
//       console.error("Error loading team:", error);
//     }
//   }

// })();

(function () {

  const { BASE_URL, API } = window.APP_CONFIG;
  const API_URL = BASE_URL + API.TEAM;

  document.addEventListener('DOMContentLoaded', function () {
    loadTeam();
  });

  async function loadTeam() {

    try {

      const res = await fetch(API_URL);
      const teamMembers = await res.json();

      const container = document.getElementById('teamContainer');

      if (!container) return;

      if (!teamMembers.length) {
        container.innerHTML = "<p>No team members found</p>";
        return;
      }

      // ✅ Detect current page
      const isTeamPage =
        window.location.pathname.includes("team");

      // ✅ About page = 3 members
      // ✅ Team page = all members
      const displayMembers = isTeamPage
        ? teamMembers
        : teamMembers.slice(0, 3);

      container.innerHTML = displayMembers.map((member, index) => `

        <div class="col-lg-4 col-md-6 wow fadeInUp"
             data-wow-delay=".${index + 1}s">

          <div class="team-block">

            <div class="inner-block">

              <div class="image-block">
                <img src="${member.image}" alt="${member.name}">
                <img src="${member.image}" alt="${member.name}">
              </div>

              <div class="content-block">

                <h4 class="title">
                  ${member.name}
                </h4>

                <div class="text">
                  ${member.designation}
                </div>

                <div class="social-icon">

                  ${member.twitter
                    ? `<a href="${member.twitter}" target="_blank">
                        <i class="fa-brands fa-x-twitter"></i>
                      </a>`
                    : ""}

                  ${member.facebook
                    ? `<a href="${member.facebook}" target="_blank">
                        <i class="fa-brands fa-facebook-f"></i>
                      </a>`
                    : ""}

                  ${member.whatsapp
                    ? `<a href="${member.whatsapp}" target="_blank">
                        <i class="fa-brands fa-whatsapp"></i>
                      </a>`
                    : ""}

                  ${member.instagram
                    ? `<a href="${member.instagram}" target="_blank">
                        <i class="fa-brands fa-instagram"></i>
                      </a>`
                    : ""}

                </div>

              </div>

            </div>

          </div>

        </div>

      `).join('');

    } catch (error) {
      console.error("Error loading team:", error);
    }

  }

})();