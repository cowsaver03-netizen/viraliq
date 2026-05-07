// js/modules/pricing.js

(function () {

    const { BASE_URL, API } = window.APP_CONFIG;

    const API_URL = BASE_URL + API.PRICING;

    let editMode = false;
    let editPlanId = null;
    let deletePlanId = null;


    document.addEventListener("DOMContentLoaded", () => {

        setupPricingForm();
        renderPricingCards();

    });



    /* ================= RENDER PRICING ================= */

    async function renderPricingCards() {

        const pricingGrid = document.getElementById("pricingGrid");

        if (!pricingGrid) return;

        try {

            const res = await fetch(API_URL);

            const data = await res.json();

            const plans = data.plans || [];

            if (!plans.length) {

                pricingGrid.innerHTML = `
                    <div class="empty-state">
                        <h3>No Pricing Plans Found</h3>
                    </div>
                `;

                return;
            }

            pricingGrid.innerHTML = plans.map(plan => `
            
                <div class="pricing-card">

                    <div class="pricing-card-header">
                        <h3>${plan.planName}</h3>
                        <h2>₹${plan.planPrice}</h2>
                    </div>

                    <p class="pricing-description">
                        ${plan.planDescription}
                    </p>

                    <ul class="pricing-features">
                        ${plan.planFeatures.map(feature => `
                            <li>
                                <i class="fas fa-check"></i>
                                ${feature}
                            </li>
                        `).join("")}
                    </ul>

                    <div class="pricing-actions">

                        <button 
                            class="btn btn-primary"
                            onclick='editPlan(${JSON.stringify(plan)})'
                        >
                            <i class="fas fa-edit"></i>
                            Edit
                        </button>

                        <button 
                            class="btn btn-danger"
                            onclick="openDeleteModal('${plan._id}')"
                        >
                            <i class="fas fa-trash"></i>
                            Delete
                        </button>

                    </div>

                </div>

            `).join("");


        } catch (error) {

            console.error("Render Pricing Error:", error);

        }

    }



    /* ================= FORM SUBMIT ================= */

    function setupPricingForm() {

        const form = document.getElementById("pricingForm");

        if (!form) return;

        form.addEventListener("submit", async function (e) {

            e.preventDefault();

            const features = document
                .getElementById("planFeatures")
                .value
                .split("\n")
                .map(item => item.trim())
                .filter(item => item !== "");


            const payload = {

                planName:
                    document.getElementById("planName").value,

                planPrice:
                    document.getElementById("planPrice").value,

                planDescription:
                    document.getElementById("planDescription").value,

                planFeatures: features

            };


            try {

                let res;

                /* ===== EDIT ===== */
                if (editMode) {

                    res = await fetch(`${API_URL}/${editPlanId}`, {

                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(payload)

                    });

                }

                /* ===== CREATE ===== */
                else {

                    res = await fetch(API_URL, {

                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(payload)

                    });

                }


                const result = await res.json();

                if (result.success) {

                    alert(
                        editMode
                            ? "✅ Plan updated successfully"
                            : "✅ Plan created successfully"
                    );

                    form.reset();

                    closeModal("pricingModal");

                    editMode = false;
                    editPlanId = null;

                    renderPricingCards();

                } else {

                    alert(result.message || "❌ Operation failed");

                }


            } catch (error) {

                console.error("Pricing Submit Error:", error);

                alert("❌ Server error");

            }

        });

    }



    /* ================= EDIT PLAN ================= */

    window.editPlan = function (plan) {

        editMode = true;

        editPlanId = plan._id;

        document.getElementById("planName").value =
            plan.planName;

        document.getElementById("planPrice").value =
            plan.planPrice;

        document.getElementById("planDescription").value =
            plan.planDescription;

        document.getElementById("planFeatures").value =
            plan.planFeatures.join("\n");


        openModal("pricingModal");

    };



    /* ================= DELETE ================= */

    window.openDeleteModal = function (id) {

        deletePlanId = id;

        openModal("confirmDeleteModal");

    };


    window.confirmDelete = async function () {

        if (!deletePlanId) return;

        try {

            const res = await fetch(`${API_URL}/${deletePlanId}`, {

                method: "DELETE"

            });

            const result = await res.json();

            if (result.success) {

                alert("✅ Plan deleted successfully");

                closeModal("confirmDeleteModal");

                renderPricingCards();

            } else {

                alert(result.message || "❌ Delete failed");

            }

        } catch (error) {

            console.error("Delete Pricing Error:", error);

            alert("❌ Server error");

        }

    };



window.openModal = function (id) {

    const modal = document.getElementById(id);

    modal.classList.add("show");
    modal.style.display = "flex";

};


window.closeModal = function (id) {

    const modal = document.getElementById(id);

    modal.classList.remove("show");
    modal.style.display = "none";

    if (id === "pricingModal") {

        editMode = false;
        editPlanId = null;

        document.getElementById("pricingForm").reset();

    }

};


})();