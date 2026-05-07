/* ===== CUSTOMERS MODULE ===== */

let filteredStatus = 'all';

function formatStatusLabel(status) {
    if (!status) return 'Pending';
    return status.charAt(0).toUpperCase() + status.slice(1);
}

function getPlansForCustomerForm() {
    return storage.getPricingPlans().map(plan => ({
        name: plan.name,
        price: Number(plan.price) || 0
    }));
}

function populateCustomerPlanOptions() {
    const planSelect = document.getElementById('customerPlan');
    if (!planSelect) return;

    const plans = getPlansForCustomerForm();
    if (plans.length === 0) {
        planSelect.innerHTML = '<option value="">No plans found</option>';
        return;
    }

    planSelect.innerHTML = plans
        .map(plan => `<option value="${escapeHtml(plan.name)}">${escapeHtml(plan.name)}</option>`)
        .join('');

    const amountInput = document.getElementById('customerAmount');
    if (amountInput && !amountInput.value) {
        amountInput.value = plans[0].price;
    }
}

function syncAmountToSelectedPlan() {
    const planSelect = document.getElementById('customerPlan');
    const amountInput = document.getElementById('customerAmount');
    if (!planSelect || !amountInput) return;

    const selectedPlan = storage.getPricingPlans().find(plan => plan.name === planSelect.value);
    if (selectedPlan) {
        amountInput.value = Number(selectedPlan.price) || 0;
    }
}

function openCustomerModal() {
    populateCustomerPlanOptions();
    openModal('customerModal');
}

function handleCustomerSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('customerName')?.value.trim();
    const phone = document.getElementById('customerPhone')?.value.trim();
    const plan = document.getElementById('customerPlan')?.value;
    const amount = parseFloat(document.getElementById('customerAmount')?.value || '0');
    const status = document.getElementById('customerStatus')?.value || 'pending';

    if (!name || !phone || !plan) {
        notificationManager.error('Please fill all required customer fields');
        return;
    }

    if (!validators.phone(phone)) {
        notificationManager.error('Please enter a valid phone number');
        return;
    }

    if (Number.isNaN(amount) || amount < 0) {
        notificationManager.error('Please enter a valid amount');
        return;
    }

    storage.addCustomer({
        name,
        phone,
        plan,
        amount,
        status
    });

    storage.logActivity('Create', 'Customers', `Added customer: ${name}`);
    notificationManager.success('Customer added successfully');

    closeModal('customerModal');
    renderCustomersTable(filteredStatus);
    if (typeof app !== 'undefined' && app && typeof app.updateDashboard === 'function') {
        app.updateDashboard();
    }
}

function renderCustomersTable(status = 'all') {
    const customers = storage.getCustomers();
    let filtered = customers;

    if (status !== 'all') {
        filtered = customers.filter(c => c.status === status);
    }

    const tbody = document.getElementById('customersTable');

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No customers found</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(customer => `
        <tr>
            <td><strong>${escapeHtml(customer.name)}</strong></td>
            <td>${escapeHtml(customer.phone)}</td>
            <td>${escapeHtml(customer.plan)}</td>
            <td>${formatCurrency(customer.amount)}</td>
            <td>
                <span class="badge status-badge ${customer.status === 'completed' ? 'badge-completed' : 'badge-pending'}">
                    ${formatStatusLabel(customer.status)}
                </span>
            </td>
            <td>
                <div style="display: flex; gap: var(--spacing-sm); flex-wrap: wrap;">
                    <button class="btn btn-secondary btn-small" onclick="showStatusUpdateModal(${customer.id}, '${customer.status}', updateCustomerStatusConfirm)">
                        <i class="fas fa-sync"></i>
                    </button>
                    <button class="btn btn-secondary btn-small" onclick="downloadInvoice(${customer.id})">
                        <i class="fas fa-file-pdf"></i>
                    </button>
                    <button class="btn btn-danger btn-small" onclick="deleteCustomer(${customer.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function setupCustomerFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const status = btn.dataset.filter;
            filteredStatus = status;
            renderCustomersTable(status);
        });
    });
}

function updateCustomerStatusConfirm(id, newStatus) {
    const customer = storage.getCustomers().find(c => c.id === id);
    if (!customer) return;

    storage.updateCustomer(id, { ...customer, status: newStatus });
    storage.logActivity('Update', 'Customers', `Updated ${customer.name} status to ${newStatus}`);
    notificationManager.success(`Status updated to "${newStatus}"`);
    renderCustomersTable(filteredStatus);
    app.updateDashboard();
}

function downloadInvoice(id) {
    const customer = storage.getCustomers().find(c => c.id === id);
    if (!customer) return;

    showInvoiceModal(customer);
}

function deleteCustomer(id) {
    const customer = storage.getCustomers().find(c => c.id === id);
    if (!customer) return;

    setDeleteCallback(() => {
        storage.deleteCustomer(id);
        storage.logActivity('Delete', 'Customers', `Deleted customer: ${customer.name}`);
        notificationManager.success('Customer deleted successfully');
        renderCustomersTable(filteredStatus);
        app.updateDashboard();
    });

    showDeleteConfirmation(`Delete customer "${customer.name}"?`);
}

function downloadCustomerCSV() {
    const customers = storage.getCustomers();
    if (customers.length === 0) {
        notificationManager.warning('No customers to export');
        return;
    }

    const data = customers.map(c => ({
        'Name': c.name,
        'Phone': c.phone,
        'Plan': c.plan,
        'Amount': c.amount,
        'Status': c.status
    }));

    exportToCSV(data, 'customers.csv');
}

// Initialize customers on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('customersTable')) {
        renderCustomersTable();
        setupCustomerFilters();
    }

    const customerForm = document.getElementById('customerForm');
    if (customerForm) {
        customerForm.addEventListener('submit', handleCustomerSubmit);
    }

    const customerPlan = document.getElementById('customerPlan');
    if (customerPlan) {
        populateCustomerPlanOptions();
        customerPlan.addEventListener('change', syncAmountToSelectedPlan);
    }
});
