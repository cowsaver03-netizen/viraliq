(function () {

    const { BASE_URL, API } = window.APP_CONFIG;
    const API_URL = BASE_URL + API.CUSTOMERS;
    const PLAN_API_URL = BASE_URL + API.PRICING;

    let filteredStatus = 'all';

    /* ================= FETCH HELPERS ================= */

    async function fetchCustomers() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            return data.success ? data.customers : [];
        } catch (error) {
            console.error("Fetch Customers Error:", error);
            return [];
        }
    }

    async function fetchPlans() {
        try {
            const response = await fetch(PLAN_API_URL);
            const data = await response.json();
            return data.success ? data.plans : [];
        } catch (error) {
            console.error("Fetch Plans Error:", error);
            return [];
        }
    }

    /* ================= FORMATTERS ================= */

    function formatStatusLabel(status) {
        if (!status) return 'Pending';
        return status.charAt(0).toUpperCase() + status.slice(1);
    }

    /* ================= PLAN SELECT ================= */

    async function populateCustomerPlanOptions() {
        const planSelect = document.getElementById('customerPlan');
        if (!planSelect) return;

        const plans = await fetchPlans();

        if (plans.length === 0) {
            planSelect.innerHTML = '<option value="">No plans found</option>';
            return;
        }

        planSelect.innerHTML = plans.map(plan => `
            <option 
                value="${escapeHtml(plan.planName)}"
                data-price="${Number(plan.planPrice) || 0}"
            >
                ${escapeHtml(plan.planName)}
            </option>
        `).join('');

        syncAmountToSelectedPlan();
    }

    function syncAmountToSelectedPlan() {
        const planSelect = document.getElementById('customerPlan');
        const amountInput = document.getElementById('customerAmount');
        if (!planSelect || !amountInput) return;

        const selectedOption = planSelect.options[planSelect.selectedIndex];
        amountInput.value = selectedOption.dataset.price || 0;
    }

    /* ================= OPEN MODAL ================= */

    window.openCustomerModal = function () {
        populateCustomerPlanOptions();
        document.getElementById('customerForm').reset();
        openModal('customerModal');
    };

    /* ================= CREATE CUSTOMER ================= */

    async function handleCustomerSubmit(e) {
        e.preventDefault();

        const name          = document.getElementById('customerName')?.value.trim();
        const phone         = document.getElementById('customerPhone')?.value.trim();
        const plan          = document.getElementById('customerPlan')?.value;
        const amount        = parseFloat(document.getElementById('customerAmount')?.value || '0');
        const paymentMethod = document.getElementById('customerPaymentMethod')?.value;
        const status        = document.getElementById('customerStatus')?.value || 'pending';

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

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phone, plan, amount, paymentMethod, status })
            });

            const data = await response.json();

            if (!data.success) {
                notificationManager.error(data.message || 'Failed to add customer');
                return;
            }

            notificationManager.success('Customer added successfully');
            closeModal('customerModal');
            renderCustomersTable(filteredStatus);

        } catch (error) {
            console.error("Create Customer Error:", error);
            notificationManager.error('Something went wrong');
        }
    }

    /* ================= CUSTOMER STATS ================= */

    async function renderCustomerStats() {
        const customers = await fetchCustomers();

        let totalPaid    = 0;
        let totalPending = 0;
        let online       = 0;
        let cash         = 0;

        customers.forEach(customer => {
            const amount = Number(customer.amount || 0);
            if (customer.status === 'completed') {
                totalPaid += amount;
            } else {
                totalPending += amount;
            }
            if (customer.paymentMethod === 'cash') {
                cash++;
            } else {
                online++;
            }
        });

        document.getElementById('totalCustomersCount').textContent  = customers.length;
        document.getElementById('totalPaidAmount').textContent       = formatCurrency(totalPaid);
        document.getElementById('totalPendingAmount').textContent    = formatCurrency(totalPending);
        document.getElementById('paymentMethodBreakdown').textContent = `${online} Online / ${cash} Cash`;
    }

    /* ================= RENDER TABLE ================= */

    async function renderCustomersTable(status = 'all') {
        const customers = await fetchCustomers();

        let filtered = status !== 'all'
            ? customers.filter(c => c.status === status)
            : customers;

        const tbody = document.getElementById('customersTable');
        await renderCustomerStats();
        if (!tbody) return;

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">No customers found</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = filtered.map(customer => `
            <tr>
                <td><strong>${escapeHtml(customer.name)}</strong></td>
                <td>${escapeHtml(customer.phone)}</td>
                <td>${escapeHtml(customer.plan)}</td>
                <td>
                    <span class="payment-badge ${customer.paymentMethod === 'cash' ? 'cash' : 'online'}">
                        ${customer.paymentMethod === 'cash' ? 'Cash' : 'Online'}
                    </span>
                </td>
                <td>${formatCurrency(customer.amount)}</td>
                <td>
                    <span class="badge status-badge ${customer.status === 'completed' ? 'badge-completed' : 'badge-pending'}">
                        ${formatStatusLabel(customer.status)}
                    </span>
                </td>
                <td>
                    <div style="display:flex;gap:10px;flex-wrap:wrap;">
                        <button 
                            class="btn btn-secondary btn-small"
                            onclick="showStatusUpdateModal('${customer._id}', '${customer.status}', updateCustomerStatusConfirm)"
                        >
                            <i class="fas fa-sync"></i>
                        </button>
                        <button 
                            class="btn btn-secondary btn-small"
                            onclick="downloadInvoice('${customer._id}')"
                        >
                            <i class="fas fa-file-pdf"></i>
                        </button>
                        <button 
                            class="btn btn-danger btn-small"
                            onclick="deleteCustomer('${customer._id}')"
                        >
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    /* ================= FILTERS ================= */

    function setupCustomerFilters() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filteredStatus = btn.dataset.filter;
                renderCustomersTable(filteredStatus);
            });
        });
    }

    /* ================= UPDATE STATUS ================= */

    window.updateCustomerStatusConfirm = async function (id, newStatus) {
        try {
            const customers = await fetchCustomers();
            const customer  = customers.find(c => c._id === id);
            if (!customer) return;

            const response = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...customer, status: newStatus })
            });

            const data = await response.json();

            if (!data.success) {
                notificationManager.error('Failed to update status');
                return;
            }

            notificationManager.success(`Status updated to "${newStatus}"`);
            renderCustomersTable(filteredStatus);

        } catch (error) {
            console.error("Update Status Error:", error);
        }
    };

    /* ================= INVOICE ================= */

    window.downloadInvoice = async function (id) {
        const customers = await fetchCustomers();
        const customer  = customers.find(c => c._id === id);
        if (!customer) return;
        showInvoiceModal(customer);
    };

    /* ================= DELETE CUSTOMER ================= */

    window.deleteCustomer = function (id) {
        setDeleteCallback(async () => {
            try {
                const response = await fetch(`${API_URL}/${id}`, {
                    method: "DELETE"
                });

                const data = await response.json();

                if (!data.success) {
                    notificationManager.error('Failed to delete customer');
                    return;
                }

                notificationManager.success('Customer deleted successfully');
                renderCustomersTable(filteredStatus);

            } catch (error) {
                console.error("Delete Customer Error:", error);
            }
        });

        showDeleteConfirmation('Are you sure you want to delete this customer?');
    };

    /* ================= EXPORT CSV ================= */

    window.downloadCustomerCSV = async function () {
        const customers = await fetchCustomers();

        if (customers.length === 0) {
            notificationManager.warning('No customers to export');
            return;
        }

        const data = customers.map(c => ({
            'Name':           c.name,
            'Phone':          c.phone,
            'Plan':           c.plan,
            'Payment Method': c.paymentMethod,
            'Amount':         c.amount,
            'Status':         c.status
        }));

        exportToCSV(data, 'customers.csv');
    };

    /* ================= INIT ================= */

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

})();