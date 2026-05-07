/* ===== REUSABLE COMPONENTS & UTILITIES ===== */

// Modal Management
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        // Clear form if it exists
        const form = modal.querySelector('form');
        if (form) form.reset();
    }
}

// Close modal on background click
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Form Utilities
function getFormData(formId) {
    const form = document.getElementById(formId);
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            // Convert to array if multiple values
            if (!Array.isArray(data[key])) {
                data[key] = [data[key]];
            }
            data[key].push(value);
        } else {
            data[key] = value;
        }
    }
    return data;
}

function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) form.reset();
}

// File Upload & Preview
function handleFilePreview(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    if (!input || !preview) return;

    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });
}

// Image to Base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Date Formatting
function formatDate(date) {
    if (typeof date === 'string') {
        return date;
    }
    return new Date(date).toISOString().split('T')[0];
}

function formatDatetime(date) {
    if (typeof date === 'string') {
        const d = new Date(date);
        return d.toLocaleString();
    }
    return new Date(date).toLocaleString();
}

// String Utilities
function truncateText(text, length = 100) {
    if (text.length > length) {
        return text.substring(0, length) + '...';
    }
    return text;
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Validation
const validators = {
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    phone: (value) => /^[\d\s+\-()]+$/.test(value) && value.length >= 10,
    url: (value) => {
        try {
            new URL(value);
            return true;
        } catch {
            return false;
        }
    },
    required: (value) => value && value.trim().length > 0,
    minLength: (value, length) => value.length >= length,
    maxLength: (value, length) => value.length <= length,
    number: (value) => !isNaN(value) && value !== ''
};

function validateField(value, type) {
    const validator = validators[type];
    return validator ? validator(value) : true;
}

// CSV Export
function exportToCSV(data, filename = 'export.csv') {
    let csv = '';
    
    if (data.length === 0) {
        notificationManager.warning('No data to export');
        return;
    }

    // Headers
    const headers = Object.keys(data[0]);
    csv += headers.map(h => `"${h}"`).join(',') + '\n';

    // Rows
    data.forEach(row => {
        const values = headers.map(header => {
            const value = row[header];
            // Escape quotes and wrap in quotes
            return `"${String(value).replace(/"/g, '""')}"`;
        });
        csv += values.join(',') + '\n';
    });

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notificationManager.success('File exported successfully');
}

// PDF Invoice Generation
function generateInvoicePDF(customerData) {
    let html = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1E3A8A; padding-bottom: 20px;">
                <h1 style="color: #1E3A8A; margin: 0;">Invoice</h1>
                <p style="color: #666; margin: 5px 0;">Gencyo Services</p>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                <div>
                    <h3 style="color: #1E3A8A; margin-top: 0;">Customer Details</h3>
                    <p><strong>Name:</strong> ${escapeHtml(customerData.name)}</p>
                    <p><strong>Phone:</strong> ${escapeHtml(customerData.phone)}</p>
                </div>
                <div>
                    <h3 style="color: #1E3A8A; margin-top: 0;">Invoice Details</h3>
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                    <p><strong>Invoice ID:</strong> #${customerData.id || 'N/A'}</p>
                </div>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr style="background-color: #f0f0f0; border-bottom: 2px solid #1E3A8A;">
                    <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Description</th>
                    <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Amount</th>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(customerData.plan || 'Service')}</td>
                    <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">₹${customerData.amount || 0}</td>
                </tr>
                <tr style="background-color: #f0f0f0; border-top: 2px solid #1E3A8A;">
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Total</strong></td>
                    <td style="padding: 10px; text-align: right; border: 1px solid #ddd;"><strong>₹${customerData.amount || 0}</strong></td>
                </tr>
            </table>

            <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <p><strong>Status:</strong> <span style="color: ${customerData.status === 'completed' ? 'green' : 'orange'};">${customerData.status || 'Pending'}</span></p>
            </div>

            <div style="text-align: center; border-top: 1px solid #ddd; padding-top: 20px; color: #666; font-size: 12px;">
                <p>Thank you for your business!</p>
                <p>Generated on: ${new Date().toLocaleString()}</p>
            </div>
        </div>
    `;
    return html;
}

function printInvoice() {
    const invoiceContent = document.getElementById('invoiceContent').innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Invoice</title></head><body>');
    printWindow.document.write(invoiceContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
}

// Copy to Clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        notificationManager.success('Copied to clipboard');
        return true;
    } catch (err) {
        notificationManager.error('Failed to copy');
        return false;
    }
}

// Generate Random String
function generateRandomString(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Generate URL with Parameters
function generateUrlWithParams(baseUrl, params) {
    const url = new URL(baseUrl);
    Object.keys(params).forEach(key => {
        url.searchParams.append(key, params[key]);
    });
    return url.toString();
}

// Currency Formatting
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}

// Highlight Search Text
function highlightSearch(text, searchTerm) {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Get Query Parameters
function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

// Confirm Delete Dialog
let deleteCallback = null;

function showDeleteConfirmation(message = "Are you sure you want to delete this item? This action cannot be undone.") {
    document.getElementById('deleteConfirmText').textContent = message;
    openModal('confirmDeleteModal');
}

function setDeleteCallback(callback) {
    deleteCallback = callback;
}

function confirmDelete() {
    if (deleteCallback && typeof deleteCallback === 'function') {
        deleteCallback();
    }
    closeModal('confirmDeleteModal');
    deleteCallback = null;
}

// Update Status Dialog
let statusUpdateCallback = null;
let currentStatusId = null;

function showStatusUpdateModal(id, currentStatus, callback) {
    currentStatusId = id;
    statusUpdateCallback = callback;
    const select = document.getElementById('statusSelect');
    if (select) {
        select.value = currentStatus;
    }
    openModal('updateStatusModal');
}

function updateCustomerStatus() {
    if (statusUpdateCallback && typeof statusUpdateCallback === 'function') {
        const select = document.getElementById('statusSelect');
        const newStatus = select ? select.value : 'pending';
        statusUpdateCallback(currentStatusId, newStatus);
    }
    closeModal('updateStatusModal');
}

// Show Invoice Modal
function showInvoiceModal(customerData) {
    const invoiceContent = document.getElementById('invoiceContent');
    invoiceContent.innerHTML = generateInvoicePDF(customerData);
    openModal('invoiceModal');
}
