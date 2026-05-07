/* ===== CONTACT INQUIRIES MODULE ===== */

function renderContactTable() {
    const inquiries = storage.getContactInquiries();
    const tbody = document.getElementById('contactTable');

    if (inquiries.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No inquiries yet</td></tr>';
        return;
    }

    tbody.innerHTML = inquiries.map(inquiry => `
        <tr>
            <td><strong>${escapeHtml(inquiry.name)}</strong></td>
            <td>
                <a href="mailto:${escapeHtml(inquiry.email)}" style="color: var(--primary);">
                    ${escapeHtml(inquiry.email)}
                </a>
            </td>
            <td>
                <a href="tel:${escapeHtml(inquiry.phone)}" style="color: var(--primary);">
                    ${escapeHtml(inquiry.phone)}
                </a>
            </td>
            <td>${escapeHtml(truncateText(inquiry.message, 40))}</td>
            <td>${formatDate(inquiry.date)}</td>
            <td>
                <div style="display: flex; gap: var(--spacing-sm);">
                    <button class="btn btn-secondary btn-small" onclick="viewContactPreview(${inquiry.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-danger btn-small" onclick="deleteContact(${inquiry.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function viewContactPreview(id) {
    const inquiries = storage.getContactInquiries();
    const inquiry = inquiries.find(i => i.id === id);

    if (!inquiry) return;

    const previewHtml = `
        <div style="background: var(--bg-primary); padding: 20px; border-radius: 8px;">
            <h3 style="color: var(--primary); margin-top: 0;">${escapeHtml(inquiry.name)}</h3>
            <p><strong>Email:</strong> <a href="mailto:${escapeHtml(inquiry.email)}">${escapeHtml(inquiry.email)}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${escapeHtml(inquiry.phone)}">${escapeHtml(inquiry.phone)}</a></p>
            <p><strong>Date:</strong> ${formatDate(inquiry.date)}</p>
            <hr style="border: none; border-top: 1px solid var(--border-color); margin: 15px 0;">
            <div style="color: var(--text-primary); line-height: 1.6;">
                <strong>Message:</strong><br>
                ${escapeHtml(inquiry.message).replace(/\n/g, '<br>')}
            </div>
        </div>
    `;

    alert(previewHtml);
}

function deleteContact(id) {
    const inquiries = storage.getContactInquiries();
    const inquiry = inquiries.find(i => i.id === id);

    if (!inquiry) return;

    setDeleteCallback(() => {
        storage.deleteContactInquiry(id);
        storage.logActivity('Delete', 'Contact', `Deleted inquiry from ${inquiry.name}`);
        notificationManager.success('Inquiry deleted successfully');
        renderContactTable();
        app.updateDashboard();
    });

    showDeleteConfirmation(`Delete inquiry from "${inquiry.name}"?`);
}

function downloadContactCSV() {
    const inquiries = storage.getContactInquiries();
    if (inquiries.length === 0) {
        notificationManager.warning('No inquiries to export');
        return;
    }

    const data = inquiries.map(i => ({
        'Name': i.name,
        'Email': i.email,
        'Phone': i.phone,
        'Message': i.message,
        'Date': i.date
    }));

    exportToCSV(data, 'contact-inquiries.csv');
}

// Initialize contact on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('contactTable')) {
        renderContactTable();
    }
});
