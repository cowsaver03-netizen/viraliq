(function() {
    "use strict";

    var RAZORPAY_KEY_ID = "rzp_live_SZMDPGqVXVOZn5";
    var RAZORPAY_THEME_COLOR = "#FF6B1E";
    var modalState = {
        element: null,
        form: null,
        nameInput: null,
        mobileInput: null,
        planInput: null,
        amountInput: null,
        submitButton: null,
        errorBox: null,
        currentPlanName: "",
        currentAmount: 0,
        scrollY: 0,
        previousUrl: ""
    };
    var noticeState = {
        container: null
    };
    var resultState = {
        element: null,
        icon: null,
        title: null,
        message: null,
        copyButton: null,
        okButton: null,
        paymentId: "",
        scrollY: 0,
        previousUrl: ""
    };

    function getNoticeContainer() {
        if (noticeState.container) {
            return noticeState.container;
        }

        var container = document.createElement("div");
        container.className = "pricing-notice-stack";
        document.body.appendChild(container);
        noticeState.container = container;
        return container;
    }

    function showScreenPopup(type, message, timeout, action) {
        var container = getNoticeContainer();
        var popup = document.createElement("div");
        var content;
        var closeButton;
        var actionButton;
        var hideTimer;
        var delay = typeof timeout === "number" ? timeout : 3500;

        popup.className = "pricing-notice pricing-notice--" + (type || "info");
        popup.setAttribute("role", "status");

        content = document.createElement("div");
        content.className = "pricing-notice__content";
        content.textContent = message;
        popup.appendChild(content);

        if (action && action.label && action.href) {
            actionButton = document.createElement("a");
            actionButton.className = "pricing-notice__action";
            actionButton.textContent = action.label;
            actionButton.href = action.href;
            actionButton.target = action.target || "_blank";
            actionButton.rel = "noopener noreferrer";
            popup.appendChild(actionButton);
        }

        closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.className = "pricing-notice__close";
        closeButton.setAttribute("aria-label", "Close message");
        closeButton.innerHTML = "&times;";
        popup.appendChild(closeButton);

        closeButton.addEventListener("click", function() {
            popup.classList.remove("is-visible");
            window.setTimeout(function() {
                if (popup.parentNode) {
                    popup.parentNode.removeChild(popup);
                }
            }, 180);
        });

        container.appendChild(popup);
        window.requestAnimationFrame(function() {
            popup.classList.add("is-visible");
        });

        hideTimer = window.setTimeout(function() {
            popup.classList.remove("is-visible");
            window.setTimeout(function() {
                if (popup.parentNode) {
                    popup.parentNode.removeChild(popup);
                }
            }, 180);
        }, delay);

        return function() {
            window.clearTimeout(hideTimer);
            popup.classList.remove("is-visible");
            window.setTimeout(function() {
                if (popup.parentNode) {
                    popup.parentNode.removeChild(popup);
                }
            }, 180);
        };
    }

    function buildPaymentResultModal() {
        var resultModal;

        if (resultState.element) {
            return resultState.element;
        }

        resultModal = document.createElement("div");
        resultModal.className = "payment-result-modal";
        resultModal.setAttribute("aria-hidden", "true");
        resultModal.innerHTML = [
            '<div class="payment-result-modal__backdrop" data-payment-result-close></div>',
            '<div class="payment-result-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="payment-result-title">',
            '  <button type="button" class="payment-result-modal__close" data-payment-result-close aria-label="Close message">&times;</button>',
            '  <div class="payment-result-modal__icon">!</div>',
            '  <h3 id="payment-result-title" class="payment-result-modal__title"></h3>',
            '  <p class="payment-result-modal__message"></p>',
            '  <div class="payment-result-modal__actions">',
            '    <button type="button" class="payment-result-modal__btn payment-result-modal__btn--copy">Copy Payment ID</button>',
            '    <button type="button" class="payment-result-modal__btn payment-result-modal__btn--ok" data-payment-result-close>OK</button>',
            '  </div>',
            '</div>'
        ].join("");

        document.body.appendChild(resultModal);

        resultState.element = resultModal;
        resultState.icon = resultModal.querySelector(".payment-result-modal__icon");
        resultState.title = resultModal.querySelector(".payment-result-modal__title");
        resultState.message = resultModal.querySelector(".payment-result-modal__message");
        resultState.copyButton = resultModal.querySelector(".payment-result-modal__btn--copy");
        resultState.okButton = resultModal.querySelector(".payment-result-modal__btn--ok");

        resultModal.addEventListener("click", function(event) {
            if (event.target.hasAttribute("data-payment-result-close")) {
                closePaymentResult();
            }
        });

        resultState.copyButton.addEventListener("click", function() {
            var originalText;

            if (!resultState.paymentId) {
                return;
            }

            originalText = resultState.copyButton.textContent;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(resultState.paymentId).then(function() {
                    resultState.copyButton.textContent = "Copied";
                    window.setTimeout(function() {
                        resultState.copyButton.textContent = originalText;
                    }, 1300);
                }).catch(function() {
                    showScreenPopup("info", "Payment ID: " + resultState.paymentId, 5200);
                });
                return;
            }

            showScreenPopup("info", "Payment ID: " + resultState.paymentId, 5200);
        });

        document.addEventListener("keydown", function(event) {
            if (event.key === "Escape" && resultState.element && resultState.element.classList.contains("is-open")) {
                closePaymentResult();
            }
        });

        return resultModal;
    }

    function showPaymentResult(type, title, message, paymentId) {
        buildPaymentResultModal();

        resultState.paymentId = paymentId || "";
        resultState.scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        resultState.previousUrl = modalState.previousUrl || resultState.previousUrl || "";
        resultState.element.classList.remove("is-success", "is-error");
        resultState.element.classList.add(type === "success" ? "is-success" : "is-error");
        resultState.title.textContent = title;
        resultState.message.textContent = message;
        resultState.icon.textContent = type === "success" ? "\u2713" : "!";
        resultState.copyButton.style.display = resultState.paymentId ? "inline-flex" : "none";
        resultState.copyButton.textContent = "Copy Payment ID";

        resultState.element.classList.add("is-open");
        resultState.element.setAttribute("aria-hidden", "false");
        document.body.classList.add("payment-result-open");
    }

    function closePaymentResult() {
        if (!resultState.element) {
            return;
        }

        resultState.element.classList.remove("is-open");
        resultState.element.setAttribute("aria-hidden", "true");
        document.body.classList.remove("payment-result-open");
        if (resultState.previousUrl && window.history && window.history.replaceState) {
            window.history.replaceState(null, "", resultState.previousUrl);
        }
        restoreScrollPosition(resultState.scrollY);
    }

    function loadRazorpayCheckout() {
        return new Promise(function(resolve, reject) {
            if (window.Razorpay) {
                resolve();
                return;
            }

            var script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            script.onload = function() {
                resolve();
            };
            script.onerror = function() {
                reject(new Error("Unable to load Razorpay checkout script."));
            };
            document.head.appendChild(script);
        });
    }

    function parseAmountFromCard(card) {
        var priceNode = card ? card.querySelector(".price") : null;
        if (!priceNode) {
            return NaN;
        }

        var rawText = (priceNode.textContent || "").toLowerCase();
        var text = rawText.replace(/,/g, "");
        var match = text.match(/\d+/g);
        if (!match || !match.length) {
            return NaN;
        }

        var value = parseInt(match.join(""), 10);
        if (rawText.indexOf("lakh") !== -1 || rawText.indexOf("lac") !== -1) {
            value = value * 100000;
        }
        if (rawText.indexOf("crore") !== -1 || rawText.indexOf("cr") !== -1) {
            value = value * 10000000;
        }
        return value;
    }

    function formatAmountForDisplay(amount) {
        var value = Number(amount);

        if (!value || Number.isNaN(value)) {
            return "";
        }

        return "INR " + value.toLocaleString("en-IN");
    }

    function getPlanFromUrl() {
        var params = new URLSearchParams(window.location.search);
        var rawPlan = params.get("plan");

        if (!rawPlan) {
            return NaN;
        }

        return parseInt(String(rawPlan).replace(/[^\d]/g, ""), 10);
    }

    function getAmountFromUrl() {
        var params = new URLSearchParams(window.location.search);
        var rawAmount = params.get("amount");

        if (!rawAmount) {
            return NaN;
        }

        return parseFloat(String(rawAmount).replace(/[^\d.]/g, ""));
    }

    function getPaymentLabelFromUrl() {
        var params = new URLSearchParams(window.location.search);

        return params.get("name") || params.get("title") || "Custom Payment";
    }

    function findPlanCardByAmount(amount) {
        var cards = document.querySelectorAll(".pricing-block");
        var targetAmount = Number(amount);
        var i;

         if (!cards.length || !targetAmount || Number.isNaN(targetAmount)) {
            return null;
        }

        for (i = 0; i < cards.length; i += 1) {
            if (parseAmountFromCard(cards[i]) === targetAmount) {
                return cards[i];
            }
        }

        return null;
    }

    function restoreScrollPosition(scrollY) {
        var targetScrollY = typeof scrollY === "number" && !Number.isNaN(scrollY) ? scrollY : 0;

        window.setTimeout(function() {
            window.scrollTo(0, targetScrollY);
        }, 50);
    }

    function openCheckout(planName, amount, buyer) {
        var options = {
            key: RAZORPAY_KEY_ID,
            amount: amount * 100,
            currency: "INR",
            name: "ViraliQ",
            description: planName,
            prefill: {
                name: buyer && buyer.name ? buyer.name : "",
                email: buyer && buyer.email ? buyer.email : "",
                contact: buyer && buyer.contact ? buyer.contact : ""
            },
            notes: {
                plan: planName,
                amount: String(amount)
            },
            theme: {
                color: RAZORPAY_THEME_COLOR
            },
            handler: function(response) {
                showPaymentResult(
                    "success",
                    "Your payment was successful",
                    "Thank you for your payment. We will be in contact with more details shortly.",
                    response.razorpay_payment_id
                );
            },
            modal: {
                ondismiss: function() {
                    showPaymentResult(
                        "error",
                        "Your payment failed",
                        "Please try again.",
                        ""
                    );
                }
            }
        };

        var rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function(resp) {
            var paymentId = resp && resp.error && resp.error.metadata && resp.error.metadata.payment_id ? resp.error.metadata.payment_id : "";

            showPaymentResult(
                "error",
                "Your payment failed",
                "Please try again.",
                paymentId
            );
        });
        rzp.open();
    }

    function buildModal() {
        if (modalState.element) {
            return modalState.element;
        }

        var modal = document.createElement("div");
        modal.className = "pricing-modal";
        modal.id = "pricing-lead-modal";
        modal.setAttribute("aria-hidden", "true");
        modal.innerHTML = [
            '<div class="pricing-modal__backdrop" data-pricing-modal-close></div>',
            '<div class="pricing-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="pricing-lead-title">',
            '  <button type="button" class="pricing-modal__close" data-pricing-modal-close aria-label="Close form">&times;</button>',
            '  <div class="pricing-modal__header">',
            '    <span class="pricing-modal__eyebrow">Quick Payment Integration</span>',
            '  </div>',
            '  <form class="pricing-modal__form" novalidate>',
            '    <div class="pricing-modal__field">',
            '      <label for="pricing-lead-name">Name</label>',
            '      <input id="pricing-lead-name" name="name" type="text" placeholder="Enter your name" autocomplete="name" required>',
            '    </div>',
            '    <div class="pricing-modal__field">',
            '      <label for="pricing-lead-mobile">Mobile No</label>',
            '      <div class="pricing-modal__phone-row">',
            '        <select id="pricing-lead-country" name="country_code" class="pricing-modal__country-code" autocomplete="tel-country-code">',
            '          <option value="+91" selected>🇮🇳 +91</option>',
            '          <option value="+1">🇺🇸 +1</option>',
            '          <option value="+1">🇨🇦 +1</option>',
            '          <option value="+44">🇬🇧 +44</option>',
            '          <option value="+61">🇦🇺 +61</option>',
            '          <option value="+971">🇦🇪 +971</option>',
            '          <option value="+966">🇸🇦 +966</option>',
            '          <option value="+65">🇸🇬 +65</option>',
            '          <option value="+33">🇫🇷 +33</option>',
            '          <option value="+49">🇩🇪 +49</option>',
            '          <option value="+39">🇮🇹 +39</option>',
            '          <option value="+34">🇪🇸 +34</option>',
            '          <option value="+31">🇳🇱 +31</option>',
            '          <option value="+81">🇯🇵 +81</option>',
            '          <option value="+82">🇰🇷 +82</option>',
            '          <option value="+86">🇨🇳 +86</option>',
            '          <option value="+55">🇧🇷 +55</option>',
            '          <option value="+52">🇲🇽 +52</option>',
            '          <option value="+27">🇿🇦 +27</option>',
            '          <option value="+20">🇪🇬 +20</option>',
            '          <option value="+63">🇵🇭 +63</option>',
            '          <option value="+62">🇮🇩 +62</option>',
            '          <option value="+90">🇹🇷 +90</option>',
            '        </select>',
            '        <input id="pricing-lead-mobile" name="mobile" type="tel" inputmode="numeric" placeholder="Enter mobile number" autocomplete="tel-national" required>',
            '      </div>',
            '    </div>',
            '    <div class="pricing-modal__field">',
            '      <label for="pricing-lead-plan">Plan</label>',
            '      <input id="pricing-lead-plan" name="plan" type="text" readonly>',
            '    </div>',
            '    <div class="pricing-modal__field">',
            '      <label for="pricing-lead-amount">Amount</label>',
            '      <input id="pricing-lead-amount" name="amount" type="text" readonly>',
            '    </div>',
            '    <div class="pricing-modal__error" aria-live="polite"></div>',
            '    <div class="pricing-modal__trust">Secure checkout via Razorpay</div>',
            '    <button type="submit" class="pricing-modal__submit">Active Now</button>',
            '  </form>',
            '</div>'
        ].join("");

        document.body.appendChild(modal);

        modalState.element = modal;
        modalState.form = modal.querySelector(".pricing-modal__form");
        modalState.countryCodeInput = modal.querySelector("#pricing-lead-country");
        modalState.nameInput = modal.querySelector("#pricing-lead-name");
        modalState.mobileInput = modal.querySelector("#pricing-lead-mobile");
        modalState.planInput = modal.querySelector("#pricing-lead-plan");
        modalState.amountInput = modal.querySelector("#pricing-lead-amount");
        modalState.submitButton = modal.querySelector(".pricing-modal__submit");
        modalState.errorBox = modal.querySelector(".pricing-modal__error");

        modal.addEventListener("click", function(event) {
            if (event.target.hasAttribute("data-pricing-modal-close")) {
                closeModal();
            }
        });

        modalState.form.addEventListener("submit", function(event) {
            event.preventDefault();

            var buyerName = (modalState.nameInput.value || "").trim();
            var mobileNumber = (modalState.mobileInput.value || "").replace(/\D/g, "");
            var countryCode = modalState.countryCodeInput ? modalState.countryCodeInput.value.trim() : "+91";
            var fullMobileNumber = (countryCode + mobileNumber).replace(/\s+/g, "");

            if (!buyerName) {
                showModalError("Please enter your name.");
                modalState.nameInput.focus();
                return;
            }

            if (!/^\d{10}$/.test(mobileNumber)) {
                showModalError("Please enter a valid 10-digit mobile number.");
                modalState.mobileInput.focus();
                return;
            }

            modalState.submitButton.disabled = true;
            modalState.submitButton.textContent = "Opening...";
            clearModalError();

            loadRazorpayCheckout()
                .then(function() {
                    closeModal();
                    openCheckout(modalState.currentPlanName, modalState.currentAmount, {
                        name: buyerName,
                        contact: fullMobileNumber
                    });
                })
                .catch(function() {
                    modalState.submitButton.disabled = false;
                    modalState.submitButton.textContent = "Active Now";
                    showModalError("Unable to open payment right now. Please refresh and try again.");
                });
        });

        document.addEventListener("keydown", function(event) {
            if (event.key === "Escape" && modalState.element && modalState.element.classList.contains("is-open")) {
                closeModal();
            }
        });

        return modal;
    }

    function showModalError(message) {
        if (!modalState.errorBox) {
            return;
        }

        modalState.errorBox.textContent = message;
        modalState.errorBox.classList.add("is-visible");
    }

    function clearModalError() {
        if (!modalState.errorBox) {
            return;
        }

        modalState.errorBox.textContent = "";
        modalState.errorBox.classList.remove("is-visible");
    }

    function openModal(planName, amount) {
        buildModal();

        modalState.currentPlanName = planName;
        modalState.currentAmount = amount;
        modalState.scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        modalState.planInput.value = planName;
        modalState.amountInput.value = formatAmountForDisplay(amount);
        if (modalState.countryCodeInput) {
            modalState.countryCodeInput.value = "+91";
        }
        modalState.nameInput.value = "";
        modalState.mobileInput.value = "";
        modalState.submitButton.disabled = false;
        modalState.submitButton.textContent = "Active Now";
        clearModalError();

        modalState.element.classList.add("is-open");
        modalState.element.setAttribute("aria-hidden", "false");
        document.body.classList.add("pricing-modal-open");

        setTimeout(function() {
            modalState.nameInput.focus();
        }, 50);
    }

    function closeModal() {
        if (!modalState.element) {
            return;
        }

        modalState.element.classList.remove("is-open");
        modalState.element.setAttribute("aria-hidden", "true");
        document.body.classList.remove("pricing-modal-open");
        modalState.submitButton.disabled = false;
        modalState.submitButton.textContent = "Active Now";
        clearModalError();
        if (modalState.previousUrl && window.history && window.history.replaceState) {
            window.history.replaceState(null, "", modalState.previousUrl);
        }
        restoreScrollPosition(modalState.scrollY);
    }

    function bindBuyNowButtons() {
        var buttons = document.querySelectorAll(".pricing-btn");
        if (!buttons.length) {
            return;
        }

        loadRazorpayCheckout().catch(function() {
            console.warn("Razorpay checkout script preloading failed.");
        });

        buttons.forEach(function(button) {
            var card = button.closest(".pricing-block");
            var amount = parseAmountFromCard(card);
            var planNameNode = card ? card.querySelector(".sub-title") : null;
            var planName = planNameNode ? planNameNode.textContent.trim() : "Lead Generation Plan";

            if (amount && !Number.isNaN(amount)) {
                button.setAttribute("href", "?plan=" + amount + "#pricing-section");
                button.setAttribute("data-plan-amount", String(amount));
            }

            if (planName) {
                button.setAttribute("data-plan-name", planName);
            }

            button.addEventListener("click", function(event) {
                if (!amount || Number.isNaN(amount)) {
                    event.preventDefault();
                    showScreenPopup("error", "This plan has no valid amount configured.", 4200);
                    return;
                }

                event.preventDefault();

                if (window.history && window.history.pushState) {
                    modalState.previousUrl = window.location.pathname + window.location.search + window.location.hash;
                    window.history.pushState(null, "", "?plan=" + amount + "#pricing-section");
                }

                openModal(planName, amount);
            });
        });
    }

    function openPlanFromQuery() {
        var customAmount = getAmountFromUrl();
        var amount = getPlanFromUrl();
        var card;
        var planNameNode;
        var planName;

        if (customAmount && !Number.isNaN(customAmount)) {
            openModal(getPaymentLabelFromUrl(), customAmount);
            return;
        }

        if (!amount || Number.isNaN(amount)) {
            return;
        }

        card = findPlanCardByAmount(amount);
        planNameNode = card ? card.querySelector(".sub-title") : null;
        planName = planNameNode ? planNameNode.textContent.trim() : "Lead Generation Plan";

        if (!card) {
            showScreenPopup("error", "No pricing plan matches ?plan=" + amount + ".", 4200);
            return;
        }

        modalState.previousUrl = window.location.pathname;

        window.setTimeout(function() {
            openModal(planName, amount);
        }, 150);
    }

    document.addEventListener("DOMContentLoaded", function() {
        buildModal();
        buildPaymentResultModal();
        bindBuyNowButtons();
        openPlanFromQuery();
    });
})();
