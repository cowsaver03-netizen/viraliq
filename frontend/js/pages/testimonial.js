// (function () {

//   const { BASE_URL, API } = window.APP_CONFIG;
//   const API_URL = BASE_URL + API.TESTIMONIALS;

//   document.addEventListener('DOMContentLoaded', function () {
//     loadTestimonials();
//   });

//   async function loadTestimonials() {
//     try {
//       const res = await fetch(API_URL);
//       const testimonials = await res.json();

//       const container = document.getElementById('testimonialContainer');

//       if (!testimonials.length) {
//         container.innerHTML = "<p>No testimonials found</p>";
//         return;
//       }

//       container.innerHTML = testimonials.map(t => `
//         <div class="swiper-slide">
//           <div class="testimonial-block-one">
//             <div class="inner-box">
              
//               <div class="star">
//                 ${generateStars(t.rating)}
//               </div>

//               <div class="text">
//                 ${t.comment}
//               </div>

//               <div class="infu">
//                 <div class="image">
//                   <span class="initial-avatar">${t.name.charAt(0)}</span>
//                 </div>
//                 <div class="name-info">
//                   <h5 class="name">${t.name}</h5>
//                   <span>${t.position}</span>
//                 </div>
//               </div>

//             </div>
//           </div>
//         </div>
//       `).join('');

//       // 🔥 IMPORTANT: Re-init swiper after dynamic load
//       initTestimonialSlider();

//     } catch (error) {
//       console.error("Error loading testimonials:", error);
//     }
//   }

//   function generateStars(rating = 5) {
//     let stars = '';
//     for (let i = 0; i < rating; i++) {
//       stars += '<i class="fa-solid fa-star"></i>';
//     }
//     return stars;
//   }

//   function initTestimonialSlider() {
//     if (typeof Swiper !== "undefined") {
//       new Swiper(".testimonial-slider", {
//         spaceBetween: 30,
//         speed: 1300,
//         loop: true,
//         autoplay: {
//           delay: 2000,
//           disableOnInteraction: false,
//         },
//         navigation: {
//           nextEl: ".array-next",
//           prevEl: ".array-prev",
//         },
//       });
//     }
//   }

// })();

(function () {

  const { BASE_URL, API } = window.APP_CONFIG;
  const API_URL = BASE_URL + API.TESTIMONIALS;

  document.addEventListener('DOMContentLoaded', function () {
    loadTestimonials();
  });

  async function loadTestimonials() {

    try {

      const res = await fetch(API_URL);
      const testimonials = await res.json();

      const container =
        document.getElementById('testimonialContainer');

      if (!container) return;

      if (!testimonials.length) {
        container.innerHTML =
          "<p>No testimonials found</p>";
        return;
      }

      // ✅ Detect current page
      const isTestimonialPage =
        window.location.pathname.includes("testimonial");

      // ✅ Homepage = show few
      // ✅ Testimonials page = show all
      const displayTestimonials =
        isTestimonialPage
          ? testimonials
          : testimonials.slice(0, 5);

      container.innerHTML =
        displayTestimonials.map((t) => `

        <div class="swiper-slide">

          <div class="${isTestimonialPage
            ? 'inner-box'
            : 'testimonial-block-one'}">

            ${isTestimonialPage
              ? `
                <div class="text">${t.comment}</div>

                <div class="clinet-info">
                  <h4 class="name">${t.name}</h4>
                  <div class="sub-text">
                    ${t.position || ""}
                  </div>
                </div>
              `
              : `
                <div class="inner-box">

                  <div class="star">
                    ${generateStars(t.rating)}
                  </div>

                  <div class="text">
                    ${t.comment}
                  </div>

                  <div class="infu">

                    <div class="image">
                      <span class="initial-avatar">
                        ${t.name.charAt(0)}
                      </span>
                    </div>

                    <div class="name-info">
                      <h5 class="name">${t.name}</h5>
                      <span>${t.position || ""}</span>
                    </div>

                  </div>

                </div>
              `
            }

          </div>

        </div>

      `).join('');

      initSwiper(isTestimonialPage);

    } catch (error) {

      console.error(
        "Error loading testimonials:",
        error
      );

    }

  }

  function generateStars(rating = 5) {

    let stars = '';

    for (let i = 0; i < rating; i++) {
      stars +=
        '<i class="fa-solid fa-star"></i>';
    }

    return stars;

  }

  function initSwiper(isTestimonialPage) {

    if (typeof Swiper === "undefined") return;

    // ✅ Destroy old swiper if exists
    const oldSwiper =
      document.querySelector('.swiper')?.swiper;

    if (oldSwiper) {
      oldSwiper.destroy(true, true);
    }

    // ✅ Different slider for different pages
    new Swiper(
      isTestimonialPage
        ? ".testimonial-slider-5"
        : ".testimonial-slider",

      {
        spaceBetween: 30,
        speed: 1300,
        loop: true,

        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },

        navigation: {
          nextEl: ".array-next",
          prevEl: ".array-prev",
        },
      }
    );

  }

})();