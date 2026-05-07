/* ===== DASHBOARD MODULE ===== */

function updateDashboard() {
    const customers = storage.getCustomers();
    const contacts = storage.getContactInquiries();
    const blogs = storage.getBlogs();
    const testimonials = storage.getTestimonials();

    // Update stats
    document.getElementById('totalCustomers').textContent = customers.length;
    document.getElementById('totalLeads').textContent = contacts.length;
    document.getElementById('activePlans').textContent = 
        customers.filter(c => c.status === 'completed').length;
    document.getElementById('pendingPlans').textContent = 
        customers.filter(c => c.status === 'pending').length;

    // Update activity log
    renderActivityLog();
}

function renderActivityLog() {
    const log = storage.getActivityLog();
    const tbody = document.getElementById('activityLog');

    if (log.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No activity yet</td></tr>';
        return;
    }

    tbody.innerHTML = log.map(activity => {
        const date = new Date(activity.timestamp);
        const time = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        const dateStr = date.toLocaleDateString('en-IN');

        return `
            <tr>
                <td>${dateStr} ${time}</td>
                <td>${escapeHtml(activity.action)}</td>
                <td><span class="badge badge-info">${escapeHtml(activity.module)}</span></td>
                <td>${escapeHtml(truncateText(activity.details, 40))}</td>
                <td><span class="badge badge-success">Done</span></td>
            </tr>
        `;
    }).join('');
}
