/* ===== NEWSLETTER MODULE ===== */

function renderNewsletterTable() {
    const subscribers = storage.getNewsletterSubscribers();
    const tbody = document.getElementById('newsletterTable');

    if (subscribers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center">No subscribers yet</td></tr>';
        return;
    }

    tbody.innerHTML = subscribers.map(subscriber => `
        <tr>
            <td>
                <a href="mailto:${escapeHtml(subscriber.email)}" style="color: var(--primary);">
                    ${escapeHtml(subscriber.email)}
                </a>
            </td>
            <td>${formatDate(subscriber.date)}</td>
            <td>
                <button class="btn btn-danger btn-small" onclick="deleteNewsletter(${subscriber.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

function deleteNewsletter(id) {
    const subscribers = storage.getNewsletterSubscribers();
    const subscriber = subscribers.find(s => s.id === id);

    if (!subscriber) return;

    setDeleteCallback(() => {
        storage.deleteNewsletterSubscriber(id);
        storage.logActivity('Delete', 'Newsletter', `Removed subscriber: ${subscriber.email}`);
        notificationManager.success('Subscriber removed successfully');
        renderNewsletterTable();
        app.updateDashboard();
    });

    showDeleteConfirmation(`Unsubscribe "${subscriber.email}"?`);
}

function downloadNewsletterCSV() {
    const subscribers = storage.getNewsletterSubscribers();
    if (subscribers.length === 0) {
        notificationManager.warning('No subscribers to export');
        return;
    }

    const data = subscribers.map(s => ({
        'Email': s.email,
        'Subscribed Date': s.date
    }));

    exportToCSV(data, 'newsletter-subscribers.csv');
}

// Initialize newsletter on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('newsletterTable')) {
        renderNewsletterTable();
    }
});
