    const { BASE_URL, API } = window.APP_CONFIG;
    const API_URL = BASE_URL + API.BLOGS;



async function renderBlogTable() {
    const res = await fetch(API_URL);
    const blogs = await res.json();

    const tbody = document.getElementById('blogTable');

    if (blogs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No blogs yet</td></tr>';
        return;
    }

    tbody.innerHTML = blogs.map(blog => `
        <tr>
            <td>
                <div class="blog-thumb">
                    ${blog.image ? `<img src="${blog.image}" alt="${escapeHtml(blog.title)}">` : '<i class="fas fa-image"></i>'}
                </div>
            </td>
            <td><strong>${escapeHtml(blog.title)}</strong></td>
            <td><span class="badge badge-info">${escapeHtml(blog.keyword)}</span></td>
            <td>${escapeHtml(truncateText(blog.description, 50))}</td>
            <td>${formatDate(new Date(blog.createdAt).toLocaleDateString())}</td>
            <td>
                <div style="display: flex; gap: var(--spacing-sm);">
                    <button class="btn btn-secondary btn-small" onclick="viewBlogPreview('${blog._id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-secondary btn-small" onclick="editBlog('${blog._id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-small" onclick="deleteBlog('${blog._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

async function createBlog(formData) {
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            body: formData   // ⚠️ multipart (image upload)
        });

        if (!res.ok) throw new Error("Failed");

        alert("✅ Blog created");
        renderBlogTable();

    } catch (err) {
        console.error(err);
        alert("❌ Error creating blog");
    }
}

async function updateBlog(id, formData) {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            body: formData
        });

        if (!res.ok) throw new Error("Failed");

        alert("✅ Blog updated");
        renderBlogTable();

    } catch (err) {
        console.error(err);
        alert("❌ Error updating blog");
    }
}

async function deleteBlog(id) {
    if (!confirm("Delete this blog?")) return;

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) throw new Error("Failed");

        alert("✅ Blog deleted");
        renderBlogTable();

    } catch (err) {
        console.error(err);
        alert("❌ Error deleting blog");
    }
}

async function editBlog(id) {
    try {
        const res = await fetch(API_URL);
        const blogs = await res.json();

        const blog = blogs.find(b => b._id === id);
        if (!blog) return;

        document.getElementById('blogKeyword').value = blog.keyword;
        document.getElementById('blogHeading').value = blog.title;
        document.getElementById('blogDescription').value = blog.description;

        const preview = document.getElementById('blogImagePreview');
        if (preview) {
            preview.innerHTML = blog.image
                ? `<img src="${blog.image}" style="width:100%;height:100%;object-fit:cover;">`
                : "No image";
        }

        // store editing ID globally
        window.editingBlogId = id;

        openModal('blogModal');

    } catch (err) {
        console.error(err);
    }
}


document.getElementById("blogForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    for (let pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}

    try {
        if (window.editingBlogId) {
            await updateBlog(window.editingBlogId, formData);
            window.editingBlogId = null;
        } else {
            await createBlog(formData);
        }

        form.reset();
        closeModal('blogModal');

    } catch (err) {
        console.error(err);
    }
});

async function viewBlogPreview(id) {
    const res = await fetch(`${API_URL}/${id}`); 
     const blogs = await fetch(API_URL).then(r => r.json());
    const blog = blogs.find(b => b._id === id);
    if (!blog) return;
     const win = window.open('', '_blank');
    win.document.write(`
        <html><body style="font-family:sans-serif;padding:2rem;max-width:800px;margin:auto">
            ${blog.image ? `<img src="${blog.image}" style="width:100%;border-radius:8px">` : ''}
            <h2>${blog.title}</h2>
            <p><strong>${blog.keyword}</strong></p>
            <p>${blog.description}</p>
        </body></html>
    `);
}

// Initialize blogs on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('blogTable')) {
        renderBlogTable();
    }
});
