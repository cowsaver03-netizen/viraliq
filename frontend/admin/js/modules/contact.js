/* ===== CONTACT INQUIRIES MODULE ===== */

(function () {

    const { BASE_URL, API } = window.APP_CONFIG;
    const API_URL = BASE_URL + API.CONTACT;

    async function renderContactTable() {

        const tbody = document.getElementById('contactTable');

        if (!tbody) return;

        try {

            const res = await fetch(API_URL);
            const inquiries = await res.json();

            if (!inquiries.length) {
                tbody.innerHTML =
                    '<tr><td colspan="6" class="text-center">No inquiries yet</td></tr>';
                return;
            }

            tbody.innerHTML = inquiries.map(inquiry => `

                <tr>
                    <td>
                        <strong>${escapeHtml(inquiry.name || '')}</strong>
                    </td>

                    <td>
                        <a href="mailto:${escapeHtml(inquiry.email || '')}" style="color: var(--primary);">
                            ${escapeHtml(inquiry.email || '')}
                        </a>
                    </td>

                    <td>
                        <a href="tel:${escapeHtml(
                            `${inquiry.countryCode || ''} ${inquiry.phone || ''}`
                        )}" style="color: var(--primary);">

                            ${escapeHtml(
                                `${inquiry.countryCode || ''} ${inquiry.phone || ''}`
                            )}

                        </a>
                    </td>

                    <td>
                        ${escapeHtml(truncateText(inquiry.message || '', 40))}
                    </td>

                    <td>
                        ${formatDate(inquiry.createdAt)}
                    </td>

                    <td>
                        <div style="display:flex; gap: var(--spacing-sm);">

                            <button 
                                class="btn btn-secondary btn-small"
                                onclick='viewContactPreview(${JSON.stringify(inquiry)})'
                            >
                                <i class="fas fa-eye"></i>
                            </button>

                        </div>
                    </td>
                </tr>

            `).join('');

        } catch (error) {

            console.error('Error loading contacts:', error);

            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        Failed to load inquiries
                    </td>
                </tr>
            `;
        }
    }

    window.viewContactPreview = function (inquiry) {

        const previewHtml = `
            <div style="background: var(--bg-primary); padding:20px; border-radius:8px;">

                <h3 style="color: var(--primary); margin-top:0;">
                    ${escapeHtml(inquiry.name || '')}
                </h3>

                <p>
                    <strong>Email:</strong>
                    <a href="mailto:${escapeHtml(inquiry.email || '')}">
                        ${escapeHtml(inquiry.email || '')}
                    </a>
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${escapeHtml(
                        `${inquiry.countryCode || ''} ${inquiry.phone || ''}`
                    )}
                </p>

                <p>
                    <strong>Subject:</strong>
                    ${escapeHtml(inquiry.subject || '')}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${formatDate(inquiry.createdAt)}
                </p>

                <hr style="border:none; border-top:1px solid var(--border-color); margin:15px 0;">

                <div style="line-height:1.6;">
                    <strong>Message:</strong><br>
                    ${escapeHtml(inquiry.message || '').replace(/\n/g, '<br>')}
                </div>

            </div>
        `;

        openPreviewModal(previewHtml, 'Contact Inquiry');
    };

    async function downloadContactCSV() {

        try {

            const res = await fetch(API_URL);
            const inquiries = await res.json();

            if (!inquiries.length) {
                notificationManager.warning('No inquiries to export');
                return;
            }

            const data = inquiries.map(i => ({
                Name: i.name,
                Email: i.email,
                Phone: `${i.countryCode || ''} ${i.phone || ''}`,
                Subject: i.subject,
                Message: i.message,
                Date: formatDate(i.createdAt)
            }));

            exportToCSV(data, 'contact-inquiries.csv');

        } catch (error) {

            console.error(error);
            notificationManager.error('Failed to export CSV');
        }
    }

    window.downloadContactCSV = downloadContactCSV;

    document.addEventListener('DOMContentLoaded', () => {

        if (document.getElementById('contactTable')) {
            renderContactTable();
        }

    });

})();