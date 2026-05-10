(function () {

  const { BASE_URL, API } = window.APP_CONFIG;
  const API_URL = BASE_URL + API.BLOGS;

  document.addEventListener("DOMContentLoaded", () => {
    loadBlogDetails();
  });

  async function loadBlogDetails() {

    try {

      const params = new URLSearchParams(window.location.search);
      const blogId = params.get("id");

      if (!blogId) return;

      const res = await fetch(API_URL);
      const blogs = await res.json();

      const currentBlog = blogs.find(blog => blog._id === blogId);

      if (!currentBlog) {
        console.log("Blog not found");
        return;
      }

      // =========================
      // MAIN BLOG
      // =========================

      // Image
      const image = document.querySelector('[data-blog-field="image"]');

      if (image) {
        image.src = currentBlog.image;
        image.alt = currentBlog.title;
      }

      // Title
      const title = document.querySelector('[data-blog-field="title"]');

      if (title) {
        title.textContent = currentBlog.title;
      }

      // Description
      const description = document.querySelector('[data-blog-field="p1"]');

      if (description) {
        description.innerHTML = formatDescription(currentBlog.description);
      }

      // Keyword / Category
      const categoryBox = document.querySelector(".sidebar__category-list");

      if (categoryBox) {
        categoryBox.innerHTML = `
          <li class="active">
            <a href="#">
              ${currentBlog.keyword || "Blog"}
              <span class="icon-right-arrow"></span>
            </a>
          </li>
        `;
      }

      // =========================
      // LATEST BLOGS
      // =========================

      const latestContainer = document.querySelector(".sidebar__post-list");

      if (latestContainer) {

        const latestBlogs = blogs
          .filter(blog => blog._id !== currentBlog._id)
          .slice(0, 3);

        latestContainer.innerHTML = latestBlogs.map(blog => `
          <li>

            <div class="sidebar__post-image">
              <img src="${blog.image}" alt="${blog.title}">
            </div>

            <div class="sidebar__post-content">

              <h3>

                <span class="sidebar__post-content-meta">
                  <i class="fa-solid fa-user-circle"></i>
                  Admin
                </span>

                <a href="blogs-details.html?id=${blog._id}">
                  ${blog.title}
                </a>

              </h3>

            </div>

          </li>
        `).join("");

      }

      // =========================
      // SEO TITLE
      // =========================

      document.title = currentBlog.title + " | Viraliq";

    } catch (error) {

      console.error("Error loading blog details:", error);

    }

  }

  // =========================
  // FORMAT DESCRIPTION
  // =========================

  function formatDescription(text) {

    if (!text) return "";

    return text
      .split("\n")
      .filter(line => line.trim() !== "")
      .map(line => `<p class="blog-details__text-2 mb-3">${line}</p>`)
      .join("");

  }

})();