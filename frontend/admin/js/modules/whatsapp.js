/* ===== WHATSAPP INTEGRATION MODULE ===== */

function loadWhatsAppConfig() {
    const config = storage.getWhatsAppConfig();
    document.getElementById('whatsappApi').value = config.apiUrl || 'https://sensational-faun-1a5a11.netlify.app';
    document.getElementById('whatsappNumber').value = config.number || '';
}

function saveWhatsAppConfig() {
    const apiUrl = document.getElementById('whatsappApi').value.trim();
    const number = document.getElementById('whatsappNumber').value.trim();

    if (!apiUrl) {
        notificationManager.error('API URL is required');
        return;
    }

    if (!validators.url(apiUrl)) {
        notificationManager.error('Invalid API URL');
        return;
    }

    storage.updateWhatsAppConfig({ apiUrl, number });
    storage.logActivity('Update', 'WhatsApp', 'WhatsApp configuration updated');
    notificationManager.success('Configuration saved successfully');
}

function populateCustomerSelect() {
    const customers = storage.getCustomers();
    const select = document.getElementById('selectCustomer');

    if (!select) return;

    select.innerHTML = '<option value="">Choose customer...</option>' +
        customers.map(c => `<option value="${c.id}" data-name="${escapeHtml(c.name)}" data-phone="${escapeHtml(c.phone)}" data-plan="${escapeHtml(c.plan)}">${escapeHtml(c.name)} (${escapeHtml(c.phone)})</option>`).join('');
}

function sendWhatsAppMessage() {
    const customerId = document.getElementById('selectCustomer').value;
    const message = document.getElementById('whatsappMessage').value.trim();

    if (!customerId) {
        notificationManager.error('Please select a customer');
        return;
    }

    if (!message) {
        notificationManager.error('Please enter a message');
        return;
    }

    const customers = storage.getCustomers();
    const customer = customers.find(c => c.id === parseInt(customerId));

    if (!customer) {
        notificationManager.error('Customer not found');
        return;
    }

    const config = storage.getWhatsAppConfig();
    const phone = customer.phone.replace(/[^\\d]/g, '');

    // Create WhatsApp message
    const whatsappMessage = encodeURIComponent(`Hi ${customer.name},\n\n${message}`);
    const whatsappUrl = `https://wa.me/${phone}?text=${whatsappMessage}`;

    // Log activity
    storage.logActivity('Send', 'WhatsApp', `Message sent to ${customer.name}`);
    notificationManager.success('WhatsApp message opened');

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    // Clear form
    document.getElementById('selectCustomer').value = '';
    document.getElementById('whatsappMessage').value = '';
}

// Initialize WhatsApp on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('whatsappForm')) {
        loadWhatsAppConfig();
        populateCustomerSelect();
    }
});
