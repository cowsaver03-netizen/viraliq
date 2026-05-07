
    const { BASE_URL, API } = window.APP_CONFIG;
    const API_URL = BASE_URL + API.TEAM;

    // ─── Render ───────────────────────────────────────────────────────────────

    async function renderTeamCards() {
        const res = await fetch(API_URL);
        const team = await res.json();

        const grid = document.getElementById('teamGrid');

        if (team.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                    <p style="color: var(--text-secondary); font-size: 18px;">No team members yet</p>
                    <button class="btn btn-primary" style="margin-top: 20px;" onclick="openModal('teamModal')">
                        <i class="fas fa-plus"></i> Add First Member
                    </button>
                </div>
            `;
            return;
        }

        grid.innerHTML = team.map(member => `
            <div class="team-card">
                ${member.image
                    ? `<img src="${member.image}" alt="${escapeHtml(member.name)}" class="team-avatar">`
                    : `<div class="team-avatar" style="background: linear-gradient(135deg, var(--primary), var(--accent)); display: flex; align-items: center; justify-content: center; color: white; font-size: 40px;">
                        <i class="fas fa-user"></i>
                       </div>`
                }
                <h3 class="team-name">${escapeHtml(member.name)}</h3>
                <p class="team-designation">${escapeHtml(member.designation)}</p>

                <div class="team-socials">
                    ${member.instagram ? `<a href="${member.instagram}" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a>` : ''}
                    ${member.facebook  ? `<a href="${member.facebook}"  target="_blank" title="Facebook"><i class="fab fa-facebook"></i></a>`  : ''}
                    ${member.twitter   ? `<a href="${member.twitter}"   target="_blank" title="Twitter"><i class="fab fa-twitter"></i></a>`     : ''}
                    ${member.whatsapp  ? `<a href="https://wa.me/${member.whatsapp.replace(/[^\d]/g, '')}" target="_blank" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>` : ''}
                </div>

                <div style="display: flex; gap: var(--spacing-md); margin-top: var(--spacing-lg);">
                    <button class="btn btn-secondary flex-1 btn-small" onclick="editTeamMember('${member._id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger flex-1 btn-small" onclick="deleteTeamMember('${member._id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    // ─── Create ───────────────────────────────────────────────────────────────

    async function createTeamMember(formData) {
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                body: formData   // multipart — handles image upload
            });

            if (!res.ok) throw new Error('Failed to create');

            alert('✅ Team member added');
            renderTeamCards();

        } catch (err) {
            console.error(err);
            alert('❌ Error adding team member');
        }
    }

    // ─── Update ───────────────────────────────────────────────────────────────

    async function updateTeamMember(id, formData) {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                body: formData
            });

            if (!res.ok) throw new Error('Failed to update');

            alert('✅ Team member updated');
            renderTeamCards();

        } catch (err) {
            console.error(err);
            alert('❌ Error updating team member');
        }
    }

    // ─── Delete ───────────────────────────────────────────────────────────────

    async function deleteTeamMember(id) {
        if (!confirm('Delete this team member?')) return;

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Failed to delete');

            alert('✅ Team member deleted');
            renderTeamCards();

        } catch (err) {
            console.error(err);
            alert('❌ Error deleting team member');
        }
    }

    // ─── Edit (populate modal) ────────────────────────────────────────────────

    async function editTeamMember(id) {
        try {
            const res = await fetch(API_URL);
            const team = await res.json();

            const member = team.find(m => m._id === id);
            if (!member) return;

            document.getElementById('teamName').value        = member.name;
            document.getElementById('teamDesignation').value = member.designation;
            document.getElementById('teamInstagram').value   = member.instagram || '';
            document.getElementById('teamFacebook').value    = member.facebook  || '';
            document.getElementById('teamTwitter').value     = member.twitter   || '';
            document.getElementById('teamWhatsapp').value    = member.whatsapp  || '';

            const preview = document.getElementById('teamPhotoPreview');
            if (preview) {
                preview.innerHTML = member.image
                    ? `<img src="${member.image}" style="width:100%;height:100%;object-fit:cover;">`
                    : 'No image';
            }

            // Store editing ID globally so the submit handler knows it's an update
            window.editingTeamId = id;

            openModal('teamModal');

        } catch (err) {
            console.error(err);
            alert('❌ Error loading member data');
        }
    }

    // ─── Form submit ──────────────────────────────────────────────────────────

    document.getElementById('teamForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        try {
            if (window.editingTeamId) {
                await updateTeamMember(window.editingTeamId, formData);
                window.editingTeamId = null;
            } else {
                await createTeamMember(formData);
            }

            form.reset();
            closeModal('teamModal');

        } catch (err) {
            console.error(err);
        }
    });

    // ─── Init ─────────────────────────────────────────────────────────────────

    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('teamGrid')) {
            renderTeamCards();
        }
    });