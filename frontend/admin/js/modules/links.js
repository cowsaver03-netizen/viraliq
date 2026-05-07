/* ===== PRICING LINKS GENERATOR MODULE ===== */

function updatePlanSelectOptions() {
    const plans = storage.getPricingPlans();
    const select = document.getElementById('selectPlan');

    if (!select) {
        return;
    }

    select.innerHTML = '<option value="">Choose a plan...</option>' +
        plans.map(plan => `<option value="${plan.id}">${escapeHtml(plan.name)} - ₹${plan.price}</option>`).join('');
}

function generatePricingLink() {
    const planId = document.getElementById('selectPlan').value;
    const linkMode = document.getElementById('linkMode').value;
    const discount = document.getElementById('discount').value;
    const customDiscount = document.getElementById('customDiscount').value;
    const plans = storage.getPricingPlans();
    const selectedPlan = planId ? plans.find(p => p.id === parseInt(planId)) : null;

    if (linkMode !== 'amount' && !planId) {
        notificationManager.error('Please select a plan');
        return;
    }

    if (linkMode !== 'amount' && !selectedPlan) {
        notificationManager.error('Plan not found');
        return;
    }

    let finalDiscount = 0;
    let discountAmount = 0;
    let finalPrice = selectedPlan ? selectedPlan.price : 0;
    let linkType = 'discount';
    let displayLabel = 'Discount';
    let linkPlanName = selectedPlan ? selectedPlan.name : 'Custom Payment';
    let originalPrice = selectedPlan ? selectedPlan.price : null;
    let razorpayId = selectedPlan && selectedPlan.razorpayId ? selectedPlan.razorpayId : '';

    if (linkMode === 'amount') {
        linkType = 'amount';
        displayLabel = 'Custom Amount';
        finalPrice = parseFloat(customDiscount);

        if (!customDiscount || isNaN(finalPrice) || finalPrice <= 0) {
            notificationManager.error('Please enter a valid custom price');
            return;
        }

        if (selectedPlan) {
            originalPrice = selectedPlan.price;
            discountAmount = Math.max(0, selectedPlan.price - finalPrice);
            finalDiscount = selectedPlan.price > 0 ? parseFloat(((discountAmount / selectedPlan.price) * 100).toFixed(2)) : 0;
            linkPlanName = selectedPlan.name;
            razorpayId = selectedPlan.razorpayId || '';
        } else {
            linkPlanName = 'Custom Payment';
            originalPrice = null;
            discountAmount = 0;
            finalDiscount = 0;
        }
    } else {
        if (discount === 'custom') {
            if (!customDiscount || customDiscount <= 0) {
                notificationManager.error('Please enter valid custom discount amount');
                return;
            }
            discountAmount = parseFloat(customDiscount);
        } else if (discount !== '0') {
            discountAmount = (selectedPlan.price * parseInt(discount)) / 100;
        }

        finalDiscount = parseInt(discount === 'custom' ? '0' : discount);
        finalPrice = Math.max(0, selectedPlan.price - discountAmount);
    }

    // Generate unique link with parameters
    const linkId = generateRandomString(12);
    const baseUrl = new URL('../pricing.html', window.location.href);
    const linkParams = {
        link: linkId,
        type: linkType,
        name: linkPlanName,
        discount: linkType === 'amount' ? finalPrice.toFixed(2) : (discount === 'custom' ? discountAmount.toFixed(2) : finalDiscount),
        razorpay: razorpayId,
        price: finalPrice.toFixed(2)
    };

    if (selectedPlan) {
        linkParams.plan = selectedPlan.id;
    }

    if (linkType === 'amount') {
        linkParams.amount = finalPrice.toFixed(2);
    }

    const generatedLink = generateUrlWithParams(baseUrl.toString(), linkParams);

    // Save link with all details
    const linkData = {
        planId: selectedPlan ? selectedPlan.id : null,
        planName: linkPlanName,
        discountType: linkType,
        discount: linkType === 'amount' ? finalPrice.toFixed(2) : (discount === 'custom' ? discountAmount.toFixed(2) : finalDiscount),
        originalPrice: originalPrice,
        discountAmount: discountAmount.toFixed(2),
        finalPrice: finalPrice.toFixed(2),
        url: generatedLink,
        linkId: linkId,
        razorpayId: razorpayId,
        createdAt: new Date().toLocaleString()
    };

    storage.addGeneratedLink(linkData);
    storage.logActivity('Create', 'Links', `Generated ${displayLabel.toLowerCase()} link for ${linkPlanName}`);
    notificationManager.success('Link generated successfully! ✓');

    renderGeneratedLinks();
    
    // Reset form
    document.getElementById('selectPlan').value = '';
    document.getElementById('linkMode').value = 'discount';
    document.getElementById('discount').value = '0';
    document.getElementById('customDiscount').value = '';
    document.getElementById('customDiscountGroup').style.display = 'none';
    const discountGroup = document.getElementById('discountPresetGroup');
    if (discountGroup) {
        discountGroup.style.display = 'block';
    }
    const label = document.getElementById('customValueLabel');
    if (label) {
        label.textContent = 'Custom Discount (₹)';
    }
}

function renderGeneratedLinks() {
    const links = storage.getGeneratedLinks();
    const container = document.getElementById('generatedLinksList');

    if (links.length === 0) {
        container.innerHTML = '<p class="text-center" style="color: var(--text-secondary); padding: 20px;">No links generated yet</p>';
        return;
    }

    container.innerHTML = links.map(link => `
        <div class="generated-link" style="margin-bottom: 15px; padding: 15px; background: var(--bg-secondary); border-radius: var(--radius-md); border-left: 4px solid var(--primary);">
            <div style="display: flex; justify-content: space-between; align-items: start; gap: 15px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 250px;">
                    <strong style="color: var(--text-primary); display: block; margin-bottom: 8px;">${escapeHtml(link.planName)}</strong>
                    <div style="color: var(--text-secondary); font-size: 13px; line-height: 1.6;">
                        ${link.originalPrice !== null && link.originalPrice !== undefined && link.originalPrice !== '' ? `<div>💰 Original: ₹${parseFloat(link.originalPrice).toFixed(2)}</div>` : '<div>💰 Type: Custom Payment</div>'}
                        <div>🏷️ ${link.discountType === 'amount' ? 'Custom Amount' : 'Discount'}: ${link.discountType === 'amount' ? '₹' + parseFloat(link.finalPrice).toFixed(2) : (link.discountType === 'custom' ? '₹' + parseFloat(link.discount).toFixed(2) : link.discount + '%')}</div>
                        <div>✨ Final: ₹${parseFloat(link.finalPrice).toFixed(2)}</div>
                        ${link.razorpayId ? `<div>💳 Razorpay ID: ${escapeHtml(link.razorpayId)}</div>` : ''}
                        <div style="margin-top: 8px; color: var(--text-tertiary); font-size: 12px;">
                            📅 ${link.createdAt}
                        </div>
                    </div>
                </div>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <button class="btn btn-primary btn-small" data-url="${encodeURIComponent(link.url)}" onclick="copyLinkToClipboard(decodeURIComponent(this.dataset.url)); notificationManager.success('Link copied! 📋')" title="Copy Link">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="btn btn-secondary btn-small" data-url="${encodeURIComponent(link.url)}" onclick="viewLink(decodeURIComponent(this.dataset.url))" title="Preview Link">
                        <i class="fas fa-external-link-alt"></i>
                    </button>
                    <button class="btn btn-danger btn-small" onclick="deleteGeneratedLink(${link.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-color); word-break: break-all;">
                <small style="color: var(--text-tertiary);">
                    <strong>Link:</strong> <code style="background: var(--bg-primary); padding: 4px 6px; border-radius: 3px; color: var(--primary);">${escapeHtml(truncateText(link.url, 80))}</code>
                </small>
            </div>
        </div>
    `).join('');
}

function copyLinkToClipboard(url) {
    copyToClipboard(url);
}

function viewLink(url) {
    window.open(url, '_blank');
}

function deleteGeneratedLink(id) {
    const links = storage.getGeneratedLinks();
    const link = links.find(l => l.id === id);

    if (!link) return;

    setDeleteCallback(() => {
        storage.deleteGeneratedLink(id);
        storage.logActivity('Delete', 'Links', `Deleted link for ${link.planName}`);
        notificationManager.success('Link deleted successfully');
        renderGeneratedLinks();
    });

    showDeleteConfirmation(`Delete link for "${link.planName}"? This will remove the discount link.`);
}

// Initialize links on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('generatedLinksList')) {
        updatePlanSelectOptions();
        renderGeneratedLinks();
    }
});
