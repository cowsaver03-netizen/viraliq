// (function () {

//   const { BASE_URL, API } = window.APP_CONFIG;
//   const API_URL = BASE_URL + API.BLOGS;

//   document.addEventListener('DOMContentLoaded', function () {
//     loadBlogs();
//   });

//   async function loadBlogs() {
//     try {
//       const res = await fetch(API_URL);
//       const blogs = await res.json();

//       const container = document.getElementById('blogContainer');

//       if (!blogs.length) {
//         container.innerHTML = "<p>No blogs found</p>";
//         return;
//       }

//       // 👉 Show only 3 blogs on homepage
//       const limitedBlogs = blogs.slice(0, 3);

//       container.innerHTML = limitedBlogs.map((blog, index) => {

//         const imageUrl = blog.image;

//         return `
//         <div class="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".${index + 1}s">
//           <div class="blog-box">
//             <div class="inner-box">
              
//               <div class="image-box">
//                 <img src="${imageUrl}" alt="${blog.title}">
//                 <img src="${imageUrl}" alt="${blog.title}">
//               </div>

//               <div class="content-box">
//                 <a href="blogs-details.html?id=${blog._id}" class="post-text">
//                   ${blog.keyword || 'Blog'}
//                 </a>

//                 <h4 class="title">
//                   <a href="blogs-details.html?id=${blog._id}">
//                     ${blog.title}
//                   </a>
//                 </h4>

//                 <a href="blogs-details.html?id=${blog._id}" class="arrow-link">
//                   Read More
//                   <svg width="13" height="12" viewBox="0 0 13 12" fill="none">
//                     <path d="M0 5.6L10.5 5.6M12.8 5.6C10.6 5.4 6.3 6.4 6.3 11.2M12.8 5.6C10.6 5.7 6.3 4.7 6.3 0" stroke="white" stroke-width="1.5"/>
//                   </svg>
//                 </a>

//               </div>

//             </div>
//           </div>
//         </div>
//         `;
//       }).join('');

//     } catch (error) {
//       console.error("Error loading blogs:", error);
//     }
//   }

// })();

(function () {

  const { BASE_URL, API } = window.APP_CONFIG;
  const API_URL = BASE_URL + API.BLOGS;

  document.addEventListener('DOMContentLoaded', function () {
    loadBlogs();
  });

  async function loadBlogs() {
    try {

      const res = await fetch(API_URL);
      const blogs = await res.json();

      const container = document.getElementById('blogContainer');

      if (!container) return;

      if (!blogs.length) {
        container.innerHTML = "<p>No blogs found</p>";
        return;
      }

      // ✅ Detect page automatically
      const isHomePage =
        window.location.pathname === "/" ||
        window.location.pathname.includes("index");

      // ✅ Homepage = only 3 blogs
      // ✅ Blog page = all blogs
      const displayBlogs = isHomePage
        ? blogs.slice(0, 3)
        : blogs;

      container.innerHTML = displayBlogs.map((blog, index) => {

        const imageUrl = blog.image;

        return `
        <div class="col-xl-4 col-lg-6 col-md-6 wow fadeInUp"
             data-wow-delay=".${index + 1}s">

          <div class="blog-box">
            <div class="inner-box">

              <div class="image-box">
                <img src="${imageUrl}" alt="${blog.title}">
                <img src="${imageUrl}" alt="${blog.title}">
              </div>

              <div class="content-box">

                <a href="blogs-details.html?id=${blog._id}" class="post-text">
                  ${blog.keyword || 'Blog'}
                </a>

                <h4 class="title">
                  <a href="blogs-details.html?id=${blog._id}">
                    ${blog.title}
                  </a>
                </h4>

                <a href="blogs-details.html?id=${blog._id}" class="arrow-link">
                  Read More

                  <svg width="13" height="12" viewBox="0 0 13 12" fill="none">
                    <path
                      d="M0 5.6L10.5 5.6M12.8 5.6C10.6 5.4 6.3 6.4 6.3 11.2M12.8 5.6C10.6 5.7 6.3 4.7 6.3 0"
                      stroke="white"
                      stroke-width="1.5"
                    />
                  </svg>

                </a>

              </div>

            </div>
          </div>

        </div>
        `;
      }).join('');

    } catch (error) {
      console.error("Error loading blogs:", error);
    }
  }

})();