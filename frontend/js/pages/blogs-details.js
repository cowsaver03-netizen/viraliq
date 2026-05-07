(function () {
  

  const BASE_URL = "http://localhost:5000"; // change if needed
  const API_URL = `${BASE_URL}/api/blogs`;

  document.addEventListener("DOMContentLoaded", function () {
    loadBlogs();
  });

  async function loadBlogs() {
    try {
      const res = await fetch(API_URL);
      const blogs = await res.json();

      const row = document.querySelector(".blog-section .row");

      if (!row) return;

      row.innerHTML = "";

      if (!blogs.length) {
        row.innerHTML = `
          <div class="col-12 text-center">
            <h4>No Blogs Found</h4>
          </div>
        `;
        return;
      }

      blogs.forEach((blog, index) => {
        const delay = (index + 1) / 10;

        const slug = createSlug(blog.title);

        const image = blog.image
          ? `${blog.image}`
          : "images/default-blog.jpg";

        row.innerHTML += `
          <div class="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".${index + 1}s">
            <div class="blog-box">
              <div class="inner-box">

                <div class="image-box">
                  <img src="${image}" alt="${blog.title}">
                  <img src="${image}" alt="${blog.title}">
                </div>

                <div class="content-box">

                  <a href="blogs-details.html?id=${blog._id}" class="post-text">
                    ${blog.keyword || "Blog"}
                  </a>

                  <h4 class="title">
                    <a href="blogs-details.html?id=${blog._id}">
                      ${blog.title}
                    </a>
                  </h4>

                  <a href="blogs-details.html?id=${blog._id}" class="arrow-link">
                    Read More

                    <svg width="13" height="12" viewBox="0 0 13 12" fill="none"
                      xmlns="http://www.w3.org/2000/svg">

                      <path
                        d="M0 5.60006L10.5 5.60006M12.8353 5.61358C10.6569 5.48049 6.3 6.41212 6.3 11.2034M12.8353 5.58981C10.6569 5.7229 6.3 4.79127 6.3 0"
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
      });

    } catch (error) {
      console.error("Error loading blogs:", error);
    }
  }

  function createSlug(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

})();