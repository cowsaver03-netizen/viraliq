// // js/modules/links.js

// (function () {

//     const { BASE_URL, API } = window.APP_CONFIG;

//     const API_URL = BASE_URL + API.PRICING;

//     let pricingPlans = [];



//     /* ================= INIT ================= */

//     document.addEventListener("DOMContentLoaded", () => {

//         initializeLinksPage();

//     });



//     async function initializeLinksPage() {

//         await updatePlanSelectOptions();

//         renderGeneratedLinks();

//     }



//     /* ================= FETCH PRICING PLANS ================= */

//     async function updatePlanSelectOptions() {

//         const select = document.getElementById("selectPlan");

//         if (!select) return;

//         try {

//             const response = await fetch(API_URL);

//             const data = await response.json();

//             pricingPlans = data.plans || [];

//             if (!pricingPlans.length) {

//                 select.innerHTML = `
//                     <option value="">
//                         No plans found
//                     </option>
//                 `;

//                 return;

//             }

//             select.innerHTML = `
//                 <option value="">
//                     Choose a plan...
//                 </option>

//                 ${pricingPlans.map(plan => `
                    
//                     <option value="${plan._id}">
//                         ${plan.planName} - ₹${plan.planPrice}
//                     </option>

//                 `).join("")}
//             `;

//         } catch (error) {

//             console.error("Fetch Pricing Plans Error:", error);

//             select.innerHTML = `
//                 <option value="">
//                     Failed to load plans
//                 </option>
//             `;

//         }

//     }



//     /* ================= GENERATE LINK ================= */

//     window.generatePricingLink = function () {

//         const planId =
//             document.getElementById("selectPlan").value;

//         const linkMode =
//             document.getElementById("linkMode").value;

//         const discount =
//             document.getElementById("discount").value;

//         const customDiscount =
//             document.getElementById("customDiscount").value;

//         const selectedPlan = planId
//             ? pricingPlans.find(plan => plan._id === planId)
//             : null;


//         if (linkMode !== "amount" && !selectedPlan) {

//             notificationManager.error("Please select a plan");

//             return;

//         }


//         let finalDiscount = 0;

//         let discountAmount = 0;

//         let finalPrice = selectedPlan
//             ? Number(selectedPlan.planPrice)
//             : 0;

//         let linkType = "discount";

//         let displayLabel = "Discount";

//         let linkPlanName = selectedPlan
//             ? selectedPlan.planName
//             : "Custom Payment";

//         let originalPrice = selectedPlan
//             ? Number(selectedPlan.planPrice)
//             : null;

//         let razorpayId = selectedPlan?.razorpayId || "";



//         /* ===== CUSTOM AMOUNT ===== */

//         if (linkMode === "amount") {

//             linkType = "amount";

//             displayLabel = "Custom Amount";

//             finalPrice = parseFloat(customDiscount);


//             if (!customDiscount || isNaN(finalPrice) || finalPrice <= 0) {

//                 notificationManager.error(
//                     "Please enter a valid custom price"
//                 );

//                 return;

//             }


//             if (selectedPlan) {

//                 originalPrice =
//                     Number(selectedPlan.planPrice);

//                 discountAmount =
//                     Math.max(0, originalPrice - finalPrice);

//                 finalDiscount =
//                     originalPrice > 0
//                         ? parseFloat(
//                             (
//                                 (discountAmount / originalPrice) * 100
//                             ).toFixed(2)
//                         )
//                         : 0;

//                 linkPlanName =
//                     selectedPlan.planName;

//             }

//         }


//         /* ===== DISCOUNT ===== */

//         else {

//             if (discount === "custom") {

//                 if (!customDiscount || customDiscount <= 0) {

//                     notificationManager.error(
//                         "Please enter valid custom discount amount"
//                     );

//                     return;

//                 }

//                 discountAmount =
//                     parseFloat(customDiscount);

//             }

//             else if (discount !== "0") {

//                 discountAmount =
//                     (Number(selectedPlan.planPrice) * parseInt(discount)) / 100;

//             }


//             finalDiscount =
//                 parseInt(discount === "custom" ? "0" : discount);

//             finalPrice =
//                 Math.max(
//                     0,
//                     Number(selectedPlan.planPrice) - discountAmount
//                 );

//         }



//         /* ================= GENERATE URL ================= */

//         const linkId =
//             generateRandomString(12);

//         const baseUrl =
//             new URL("../pricing.html", window.location.href);

//         const linkParams = {

//             link: linkId,

//             type: linkType,

//             name: linkPlanName,

//             discount:
//                 linkType === "amount"
//                     ? finalPrice.toFixed(2)
//                     : (
//                         discount === "custom"
//                             ? discountAmount.toFixed(2)
//                             : finalDiscount
//                     ),

//             razorpay: razorpayId,

//             price: finalPrice.toFixed(2)

//         };


//         if (selectedPlan) {

//             linkParams.plan =
//                 selectedPlan._id;

//         }


//         if (linkType === "amount") {

//             linkParams.amount =
//                 finalPrice.toFixed(2);

//         }


//         const generatedLink =
//             generateUrlWithParams(
//                 baseUrl.toString(),
//                 linkParams
//             );



//         /* ================= SAVE LINK ================= */

//         const linkData = {

//             id: Date.now(),

//             planId:
//                 selectedPlan
//                     ? selectedPlan._id
//                     : null,

//             planName: linkPlanName,

//             discountType: linkType,

//             discount:
//                 linkType === "amount"
//                     ? finalPrice.toFixed(2)
//                     : (
//                         discount === "custom"
//                             ? discountAmount.toFixed(2)
//                             : finalDiscount
//                     ),

//             originalPrice: originalPrice,

//             discountAmount:
//                 discountAmount.toFixed(2),

//             finalPrice:
//                 finalPrice.toFixed(2),

//             url: generatedLink,

//             linkId: linkId,

//             razorpayId: razorpayId,

//             createdAt:
//                 new Date().toLocaleString()

//         };


//         const links = getStoredLinks();

//         links.unshift(linkData);

//         saveStoredLinks(links);

//         storage.logActivity(
//             "Create",
//             "Links",
//             `Generated ${displayLabel.toLowerCase()} link for ${linkPlanName}`
//         );

//         notificationManager.success(
//             "Link generated successfully! ✓"
//         );


//         renderGeneratedLinks();

//         resetForm();

//     };



//     /* ================= RESET FORM ================= */

//     function resetForm() {

//         document.getElementById("selectPlan").value = "";

//         document.getElementById("linkMode").value = "discount";

//         document.getElementById("discount").value = "0";

//         document.getElementById("customDiscount").value = "";

//         document.getElementById("customDiscountGroup").style.display = "none";

//         const discountGroup =
//             document.getElementById("discountPresetGroup");

//         if (discountGroup) {

//             discountGroup.style.display = "block";

//         }

//         const label =
//             document.getElementById("customValueLabel");

//         if (label) {

//             label.textContent =
//                 "Custom Discount (₹)";

//         }

//     }



//     /* ================= RENDER LINKS ================= */

//     function renderGeneratedLinks() {

//         const links =
//             getStoredLinks()

//         const container =
//             document.getElementById("generatedLinksList");


//         if (!container) return;


//         if (!links.length) {

//             container.innerHTML = `
//                 <p 
//                     class="text-center"
//                     style="
//                         color: var(--text-secondary);
//                         padding: 20px;
//                     "
//                 >
//                     No links generated yet
//                 </p>
//             `;

//             return;

//         }


//         container.innerHTML = links.map(link => `

//             <div 
//                 class="generated-link"
//                 style="
//                     margin-bottom: 15px;
//                     padding: 15px;
//                     background: var(--bg-secondary);
//                     border-radius: var(--radius-md);
//                     border-left: 4px solid var(--primary);
//                 "
//             >

//                 <div 
//                     style="
//                         display: flex;
//                         justify-content: space-between;
//                         align-items: start;
//                         gap: 15px;
//                         flex-wrap: wrap;
//                     "
//                 >

//                     <div style="flex: 1; min-width: 250px;">

//                         <strong 
//                             style="
//                                 color: var(--text-primary);
//                                 display: block;
//                                 margin-bottom: 8px;
//                             "
//                         >
//                             ${escapeHtml(link.planName)}
//                         </strong>

//                         <div 
//                             style="
//                                 color: var(--text-secondary);
//                                 font-size: 13px;
//                                 line-height: 1.6;
//                             "
//                         >

//                             ${link.originalPrice
//                                 ? `<div>💰 Original: ₹${parseFloat(link.originalPrice).toFixed(2)}</div>`
//                                 : `<div>💰 Type: Custom Payment</div>`
//                             }

//                             <div>
//                                 🏷️ ${link.discountType === "amount"
//                                     ? `Custom Amount: ₹${parseFloat(link.finalPrice).toFixed(2)}`
//                                     : `Discount: ${link.discount}%`
//                                 }
//                             </div>

//                             <div>
//                                 ✨ Final: ₹${parseFloat(link.finalPrice).toFixed(2)}
//                             </div>

//                             ${link.razorpayId
//                                 ? `<div>💳 Razorpay ID: ${escapeHtml(link.razorpayId)}</div>`
//                                 : ""
//                             }

//                             <div 
//                                 style="
//                                     margin-top: 8px;
//                                     color: var(--text-tertiary);
//                                     font-size: 12px;
//                                 "
//                             >
//                                 📅 ${link.createdAt}
//                             </div>

//                         </div>

//                     </div>



//                     <div 
//                         style="
//                             display: flex;
//                             gap: 8px;
//                             flex-wrap: wrap;
//                         "
//                     >

//                         <button
//                             class="btn btn-primary btn-small"
//                             data-url="${encodeURIComponent(link.url)}"
//                             onclick="copyLinkToClipboard(decodeURIComponent(this.dataset.url)); notificationManager.success('Link copied! 📋')"
//                             title="Copy Link"
//                         >
//                             <i class="fas fa-copy"></i>
//                         </button>

//                         <button
//                             class="btn btn-secondary btn-small"
//                             data-url="${encodeURIComponent(link.url)}"
//                             onclick="viewLink(decodeURIComponent(this.dataset.url))"
//                             title="Preview Link"
//                         >
//                             <i class="fas fa-external-link-alt"></i>
//                         </button>

//                         <button
//                             class="btn btn-danger btn-small"
//                             onclick="deleteGeneratedLink(${link.id})"
//                             title="Delete"
//                         >
//                             <i class="fas fa-trash"></i>
//                         </button>

//                     </div>

//                 </div>

//             </div>

//         `).join("");

//     }



//     /* ================= COPY LINK ================= */

//     window.copyLinkToClipboard = function (url) {

//         copyToClipboard(url);

//     };



//     /* ================= VIEW LINK ================= */

//     window.viewLink = function (url) {

//         window.open(url, "_blank");

//     };



//     /* ================= DELETE LINK ================= */

//     window.deleteGeneratedLink = function (id) {

//         const links =
//             getStoredLinks()

//         const link =
//             links.find(link => link.id === id);


//         if (!link) return;


//         setDeleteCallback(() => {

//             const updatedLinks = getStoredLinks().filter(
//                 item => item.id !== id
//             );

//             saveStoredLinks(updatedLinks);

//             storage.logActivity(
//                 "Delete",
//                 "Links",
//                 `Deleted link for ${link.planName}`
//             );

//             notificationManager.success(
//                 "Link deleted successfully"
//             );

//             renderGeneratedLinks();

//         });


//         showDeleteConfirmation(
//             `Delete link for "${link.planName}"? This will remove the discount link.`
//         );

//     };



//     /* ================= TOGGLE MODE ================= */

//     window.toggleLinkMode = function () {

//         const mode =
//             document.getElementById("linkMode").value;

//         const customGroup =
//             document.getElementById("customDiscountGroup");

//         const discountGroup =
//             document.getElementById("discountPresetGroup");

//         const label =
//             document.getElementById("customValueLabel");


//         if (mode === "amount") {

//             customGroup.style.display = "block";

//             discountGroup.style.display = "none";

//             label.textContent =
//                 "Custom Amount (₹)";

//         }

//         else {

//             customGroup.style.display = "none";

//             discountGroup.style.display = "block";

//             label.textContent =
//                 "Custom Discount (₹)";

//         }

//     };

// })();

// js/modules/links.js

(function () {

    const { BASE_URL, API } = window.APP_CONFIG;

    const API_URL = BASE_URL + API.PRICING;

    const LINK_STORAGE_KEY = "admin_generated_links";

    let pricingPlans = [];



    /* ================= STORAGE ================= */

    function getStoredLinks() {

        try {

            return JSON.parse(
                localStorage.getItem(LINK_STORAGE_KEY)
            ) || [];

        } catch (error) {

            console.error("Get Stored Links Error:", error);

            return [];

        }

    }


    function saveStoredLinks(links) {

        localStorage.setItem(
            LINK_STORAGE_KEY,
            JSON.stringify(links)
        );

    }



    /* ================= INIT ================= */

    document.addEventListener("DOMContentLoaded", () => {

        initializeLinksPage();

    });


    async function initializeLinksPage() {

        await updatePlanSelectOptions();

        renderGeneratedLinks();

    }



    /* ================= FETCH PRICING PLANS ================= */

    async function updatePlanSelectOptions() {

        const select = document.getElementById("selectPlan");

        if (!select) return;

        try {

            const response = await fetch(API_URL);

            const data = await response.json();

            pricingPlans = data.plans || [];

            if (!pricingPlans.length) {

                select.innerHTML = `
                    <option value="">
                        No plans found
                    </option>
                `;

                return;

            }

            select.innerHTML = `
                <option value="">
                    Choose a plan...
                </option>

                ${pricingPlans.map(plan => `

                    <option value="${plan._id}">
                        ${plan.planName} - ₹${Number(plan.planPrice).toFixed(2)}
                    </option>

                `).join("")}
            `;

        } catch (error) {

            console.error("Fetch Pricing Plans Error:", error);

            select.innerHTML = `
                <option value="">
                    Failed to load plans
                </option>
            `;

        }

    }



    /* ================= GENERATE LINK ================= */

    window.generatePricingLink = function () {

        const planId =
            document.getElementById("selectPlan").value;

        const linkMode =
            document.getElementById("linkMode").value;

        const discount =
            document.getElementById("discount").value;

        const customDiscount =
            document.getElementById("customDiscount").value.trim();

        const selectedPlan = planId
            ? pricingPlans.find(plan => String(plan._id) === String(planId))
            : null;


        if (linkMode !== "amount" && !selectedPlan) {

            notificationManager.error("Please select a plan");

            return;

        }


        let finalDiscount = 0;

        let discountAmount = 0;

        let finalPrice = selectedPlan
            ? Number(selectedPlan.planPrice || 0)
            : 0;

        let linkType = "discount";

        let linkPlanName = selectedPlan
            ? selectedPlan.planName
            : "Custom Payment";

        let originalPrice = selectedPlan
            ? Number(selectedPlan.planPrice || 0)
            : null;

        let razorpayId =
            selectedPlan?.razorpayId || "";



        /* ================= CUSTOM AMOUNT ================= */

        if (linkMode === "amount") {

            linkType = "amount";

            finalPrice = parseFloat(customDiscount);


            if (
                !customDiscount ||
                Number.isNaN(finalPrice) ||
                finalPrice <= 0
            ) {

                notificationManager.error(
                    "Please enter a valid custom price"
                );

                return;

            }


            if (selectedPlan) {

                originalPrice =
                    Number(selectedPlan.planPrice || 0);

                discountAmount =
                    Math.max(
                        0,
                        originalPrice - finalPrice
                    );

                finalDiscount =
                    originalPrice > 0
                        ? Number(
                            (
                                (discountAmount / originalPrice) * 100
                            ).toFixed(2)
                        )
                        : 0;

                linkPlanName =
                    selectedPlan.planName;

            }

        }



        /* ================= DISCOUNT ================= */

        else {

            if (discount === "custom") {

                if (
                    !customDiscount ||
                    Number(customDiscount) <= 0
                ) {

                    notificationManager.error(
                        "Please enter valid custom discount amount"
                    );

                    return;

                }

                discountAmount =
                    Number(customDiscount);

            }

            else if (discount !== "0") {

                discountAmount =
                    (
                        Number(selectedPlan.planPrice || 0) *
                        Number(discount)
                    ) / 100;

            }


            finalDiscount =
                discount === "custom"
                    ? 0
                    : Number(discount);

            finalPrice =
                Math.max(
                    0,
                    Number(selectedPlan.planPrice || 0) - discountAmount
                );

        }



        /* ================= GENERATE URL ================= */

        const linkId =
            generateRandomString(12);

        const baseUrl =
            new URL("../pricing.html", window.location.href);

        const linkParams = {

            link: linkId,

            type: linkType,

            name: linkPlanName,

            discount:
                linkType === "amount"
                    ? finalPrice.toFixed(2)
                    : (
                        discount === "custom"
                            ? discountAmount.toFixed(2)
                            : finalDiscount
                    ),

            razorpay: razorpayId,

            price: finalPrice.toFixed(2)

        };


        if (selectedPlan) {

            linkParams.plan =
                selectedPlan._id;

        }


        if (linkType === "amount") {

            linkParams.amount =
                finalPrice.toFixed(2);

        }


        const generatedLink =
            generateUrlWithParams(
                baseUrl.toString(),
                linkParams
            );



        /* ================= SAVE LINK ================= */

        const linkData = {

            id: Date.now(),

            planId:
                selectedPlan
                    ? selectedPlan._id
                    : null,

            planName: linkPlanName,

            discountType: linkType,

            discount:
                linkType === "amount"
                    ? finalPrice.toFixed(2)
                    : (
                        discount === "custom"
                            ? discountAmount.toFixed(2)
                            : finalDiscount
                    ),

            originalPrice: originalPrice,

            discountAmount:
                discountAmount.toFixed(2),

            finalPrice:
                finalPrice.toFixed(2),

            url: generatedLink,

            linkId: linkId,

            razorpayId: razorpayId,

            createdAt:
                new Date().toLocaleString()

        };


        const links = getStoredLinks();

        links.unshift(linkData);

        saveStoredLinks(links);


        notificationManager.success(
            "Link generated successfully! ✓"
        );


        renderGeneratedLinks();

        resetForm();

    };



    /* ================= RESET FORM ================= */

    function resetForm() {

        document.getElementById("selectPlan").value = "";

        document.getElementById("linkMode").value = "discount";

        document.getElementById("discount").value = "0";

        document.getElementById("customDiscount").value = "";

        document.getElementById("customDiscountGroup").style.display = "none";

        const discountGroup =
            document.getElementById("discountPresetGroup");

        if (discountGroup) {

            discountGroup.style.display = "block";

        }

        const label =
            document.getElementById("customValueLabel");

        if (label) {

            label.textContent =
                "Custom Discount (₹)";

        }

    }



    /* ================= RENDER LINKS ================= */

    function renderGeneratedLinks() {

        const links =
            getStoredLinks();

        const container =
            document.getElementById("generatedLinksList");


        if (!container) return;


        if (!links.length) {

            container.innerHTML = `
                <p
                    class="text-center"
                    style="
                        color: var(--text-secondary);
                        padding: 20px;
                    "
                >
                    No links generated yet
                </p>
            `;

            return;

        }


        container.innerHTML = links.map(link => `

            <div
                class="generated-link"
                style="
                    margin-bottom: 15px;
                    padding: 15px;
                    background: var(--bg-secondary);
                    border-radius: var(--radius-md);
                    border-left: 4px solid var(--primary);
                "
            >

                <div
                    style="
                        display: flex;
                        justify-content: space-between;
                        align-items: start;
                        gap: 15px;
                        flex-wrap: wrap;
                    "
                >

                    <div style="flex: 1; min-width: 250px;">

                        <strong
                            style="
                                color: var(--text-primary);
                                display: block;
                                margin-bottom: 8px;
                            "
                        >
                            ${escapeHtml(link.planName)}
                        </strong>

                        <div
                            style="
                                color: var(--text-secondary);
                                font-size: 13px;
                                line-height: 1.6;
                            "
                        >

                            ${link.originalPrice !== null
                                ? `<div>💰 Original: ₹${Number(link.originalPrice).toFixed(2)}</div>`
                                : `<div>💰 Type: Custom Payment</div>`
                            }

                            <div>
                                🏷️ ${link.discountType === "amount"
                                    ? `Custom Amount: ₹${Number(link.finalPrice).toFixed(2)}`
                                    : `Discount: ${link.discount}%`
                                }
                            </div>

                            <div>
                                ✨ Final: ₹${Number(link.finalPrice).toFixed(2)}
                            </div>

                            ${link.razorpayId
                                ? `<div>💳 Razorpay ID: ${escapeHtml(link.razorpayId)}</div>`
                                : ""
                            }

                            <div
                                style="
                                    margin-top: 8px;
                                    color: var(--text-tertiary);
                                    font-size: 12px;
                                "
                            >
                                📅 ${escapeHtml(link.createdAt)}
                            </div>

                        </div>

                    </div>



                    <div
                        style="
                            display: flex;
                            gap: 8px;
                            flex-wrap: wrap;
                        "
                    >

                        <button
                            class="btn btn-primary btn-small"
                            data-url="${encodeURIComponent(link.url)}"
                            onclick="copyLinkToClipboard(decodeURIComponent(this.dataset.url)); notificationManager.success('Link copied! 📋')"
                            title="Copy Link"
                        >
                            <i class="fas fa-copy"></i>
                        </button>

                        <button
                            class="btn btn-secondary btn-small"
                            data-url="${encodeURIComponent(link.url)}"
                            onclick="viewLink(decodeURIComponent(this.dataset.url))"
                            title="Preview Link"
                        >
                            <i class="fas fa-external-link-alt"></i>
                        </button>

                        <button
                            class="btn btn-danger btn-small"
                            onclick="deleteGeneratedLink(${link.id})"
                            title="Delete"
                        >
                            <i class="fas fa-trash"></i>
                        </button>

                    </div>

                </div>

            </div>

        `).join("");

    }



    /* ================= COPY LINK ================= */

    window.copyLinkToClipboard = function (url) {

        copyToClipboard(url);

    };



    /* ================= VIEW LINK ================= */

    window.viewLink = function (url) {

        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );

    };



    /* ================= DELETE LINK ================= */

    window.deleteGeneratedLink = function (id) {

        const links =
            getStoredLinks();

        const link =
            links.find(link => link.id === id);


        if (!link) return;


        setDeleteCallback(() => {

            const updatedLinks =
                getStoredLinks().filter(
                    item => item.id !== id
                );

            saveStoredLinks(updatedLinks);

            notificationManager.success(
                "Link deleted successfully"
            );

            renderGeneratedLinks();

        });


        showDeleteConfirmation(
            `Delete link for "${link.planName}"? This will remove the discount link.`
        );

    };



    /* ================= TOGGLE MODE ================= */

    window.toggleLinkMode = function () {

        const mode =
            document.getElementById("linkMode").value;

        const customGroup =
            document.getElementById("customDiscountGroup");

        const discountGroup =
            document.getElementById("discountPresetGroup");

        const label =
            document.getElementById("customValueLabel");


        if (mode === "amount") {

            customGroup.style.display = "block";

            discountGroup.style.display = "none";

            label.textContent =
                "Custom Amount (₹)";

        }

        else {

            customGroup.style.display = "none";

            discountGroup.style.display = "block";

            label.textContent =
                "Custom Discount (₹)";

        }

    };

})();