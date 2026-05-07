

    const { BASE_URL, API } = window.APP_CONFIG;
    const API_URL = BASE_URL + API.TESTIMONIALS;
    let editingId = null

async function renderTestimonials() {
    const res = await fetch(API_URL);
    const testimonials = await res.json();
    
    const grid = document.getElementById('testimonialsGrid');

    if (testimonials.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <p style="color: var(--text-secondary); font-size: 18px;">No testimonials yet</p>
                <button class="btn btn-primary" style="margin-top: 20px;" onclick="openModal('testimonialModal')">
                    <i class="fas fa-plus"></i> Add First Testimonial
                </button>
            </div>
        `;
        return;
    }

    grid.innerHTML = testimonials.map(testimonial => {
        const stars = '⭐'.repeat(testimonial.rating || 5);
        return `
            <div class="testimonial-card">
                <p class="testimonial-text">"${escapeHtml(truncateText(testimonial.comment, 120))}"</p>
                <div class="testimonial-rating">${stars}</div>
                <p class="testimonial-author">${escapeHtml(testimonial.name)}</p>
                <p class="testimonial-position">${escapeHtml(testimonial.position)}</p>

                <div style="display: flex; gap: var(--spacing-md); margin-top: var(--spacing-lg);">
                    <button class="btn btn-secondary flex-1 btn-small" onclick="editTestimonial('${testimonial._id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger flex-1 btn-small" onclick="deleteTestimonial('${testimonial._id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');
}


   async function createTestimonial(data) {
        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error("Create failed");

            alert("✅ Created");
            renderTestimonials();

        } catch (err) {
            console.error(err);
            alert("❌ Error creating");
        }
    }

      async function updateTestimonial(id, data) {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error("Update failed");

            alert("✅ Updated");
            renderTestimonials();

        } catch (err) {
            console.error(err);
            alert("❌ Error updating");
        }
    }


     async function deleteTestimonial(id) {
        if (!confirm("Delete this testimonial?")) return;

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            if (!res.ok) throw new Error("Delete failed");

            alert("✅ Deleted");
            renderTestimonials();

        } catch (err) {
            console.error(err);
            alert("❌ Error deleting");
        }
    }


     async function editTestimonial(id) {
        try {
            const res = await fetch(API_URL);
            const testimonials = await res.json();

            const t = testimonials.find(x => x._id === id);
            if (!t) return;

            document.getElementById('testimonialName').value = t.name;
            document.getElementById('testimonialPosition').value = t.position;
            document.getElementById('testimonialComment').value = t.comment;
            document.getElementById('testimonialRating').value = t.rating;

            editingId = id;

            openModal('testimonialModal');

        } catch (err) {
            console.error(err);
        }
    }


     document.getElementById("testimonialForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const data = {
            name: document.getElementById('testimonialName').value,
            position: document.getElementById('testimonialPosition').value,
            comment: document.getElementById('testimonialComment').value,
            rating: document.getElementById('testimonialRating').value
        };

        if (editingId) {
            await updateTestimonial(editingId, data);
            editingId = null;
        } else {
            await createTestimonial(data);
        }

        this.reset();
        closeModal('testimonialModal');
    });

    // ================= GLOBAL ACCESS =================
    window.renderTestimonials = renderTestimonials;
    window.editTestimonial = editTestimonial;
    window.deleteTestimonial = deleteTestimonial;

    // ================= INIT =================
    document.addEventListener('DOMContentLoaded', renderTestimonials);
