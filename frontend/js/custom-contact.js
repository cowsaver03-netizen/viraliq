(function() {
    "use strict";

    var targetEmail = "Info@ViraliQ.ai";
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    function getField(form, selectors) {
        for (var i = 0; i < selectors.length; i++) {
            var field = form.querySelector(selectors[i]);
            if (field) {
                return field;
            }
        }
        return null;
    }

    function setFieldError(field, message) {
        field.setCustomValidity(message);
        field.reportValidity();
    }

    function clearFieldError(field) {
        field.setCustomValidity("");
    }

    function normalizePhone(rawPhone) {
        return rawPhone.replace(/[^\d+]/g, "");
    }

    function closeCountryCodePicker(picker) {
        if (!picker) {
            return;
        }

        picker.classList.remove("is-open");
        var button = picker.querySelector(".country-code-picker__button");
        if (button) {
            button.setAttribute("aria-expanded", "false");
        }
    }

    function bindCountryCodePicker(picker) {
        if (!picker || picker.dataset.bound === "true") {
            return;
        }

        var button = picker.querySelector(".country-code-picker__button");
        var valueLabel = picker.querySelector(".country-code-picker__value");
        var menu = picker.querySelector(".country-code-picker__menu");
        var hiddenInput = picker.querySelector("[name='form_country_code']");

        if (!button || !valueLabel || !menu || !hiddenInput) {
            return;
        }

        picker.dataset.bound = "true";

        button.addEventListener("click", function(event) {
            event.preventDefault();
            var isOpen = picker.classList.toggle("is-open");
            button.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });

        menu.addEventListener("click", function(event) {
            var optionButton = event.target.closest("button[data-value]");
            if (!optionButton) {
                return;
            }

            hiddenInput.value = optionButton.getAttribute("data-value") || "+91";
            valueLabel.textContent = optionButton.getAttribute("data-label") || hiddenInput.value;
            picker.querySelectorAll("[role='option']").forEach(function(option) {
                option.setAttribute("aria-selected", option === optionButton ? "true" : "false");
            });
            closeCountryCodePicker(picker);
        });
    }

    function getCountryCode(form) {
        var countryCodeField = getField(form, ["[name='form_country_code']", "[name='country_code']", "select[autocomplete='tel-country-code']"]);
        return countryCodeField ? countryCodeField.value.trim() : "+91";
    }

    function buildMailto(subject, body) {
        return "mailto:" +
            encodeURIComponent(targetEmail) +
            "?subject=" + encodeURIComponent(subject) +
            "&body=" + encodeURIComponent(body);
    }

    function bindContactForm(form) {
        if (!form || form.dataset.mailtoBound === "true") {
            return;
        }

        var looksLikeContactForm = !!form.querySelector("[name='form_phone'], [name='phone'], input[type='tel'], input[placeholder*='Phone']") || form.id === "contact-form";
        if (!looksLikeContactForm) {
            return;
        }

        form.dataset.mailtoBound = "true";

        form.addEventListener("submit", function(event) {
            event.preventDefault();

            var nameField = getField(form, ["[name='form_name']", "[name='name']", "input[placeholder*='Name']"]);
            var emailField = getField(form, ["[name='form_email']", "[name='email']", "input[type='email']", "input[placeholder*='Email']"]);
            var phoneField = getField(form, ["[name='form_phone']", "[name='phone']", "input[type='tel']", "input[placeholder*='Phone']"]);
            var subjectField = getField(form, ["[name='form_subject']", "[name='subject']", "input[placeholder*='Subject']"]);
            var messageField = getField(form, ["[name='form_message']", "[name='message']", "textarea"]);
            var countryCode = getCountryCode(form);

            var name = nameField ? nameField.value.trim() : "";
            var email = emailField ? emailField.value.trim() : "";
            var phone = phoneField ? phoneField.value.trim() : "";
            var subject = subjectField ? subjectField.value.trim() : "Website Contact Form Submission";
            var message = messageField ? messageField.value.trim() : "";

            if (nameField) {
                clearFieldError(nameField);
            }
            if (emailField) {
                clearFieldError(emailField);
            }
            if (phoneField) {
                clearFieldError(phoneField);
            }
            if (messageField) {
                clearFieldError(messageField);
            }

            if (nameField && !name) {
                setFieldError(nameField, "Please enter your name.");
                return;
            }

            if (!emailField || !emailRegex.test(email)) {
                if (emailField) {
                    setFieldError(emailField, "Please enter a valid email address.");
                }
                return;
            }

            if (phoneField) {
                var normalizedPhone = normalizePhone(phone);
                if (!phone || !/^\d{10}$/.test(normalizedPhone)) {
                    setFieldError(phoneField, "Please enter a valid 10-digit phone number.");
                    return;
                }
                phone = countryCode + normalizedPhone;
            }

            if (messageField && !message) {
                setFieldError(messageField, "Please enter your message.");
                return;
            }

            var bodyLines = [
                "Name: " + (name || "N/A"),
                "Email: " + email,
                "Phone: " + (phone || "N/A"),
                "",
                "Message:",
                message || "N/A"
            ];

            window.location.href = buildMailto(subject || "Website Contact Form Submission", bodyLines.join("\n"));
        });
    }

    document.addEventListener("DOMContentLoaded", function() {
        document.querySelectorAll("[data-country-code-picker]").forEach(bindCountryCodePicker);

        document.addEventListener("click", function(event) {
            document.querySelectorAll("[data-country-code-picker].is-open").forEach(function(picker) {
                if (!picker.contains(event.target)) {
                    closeCountryCodePicker(picker);
                }
            });
        });

        document.addEventListener("keydown", function(event) {
            if (event.key === "Escape") {
                document.querySelectorAll("[data-country-code-picker].is-open").forEach(closeCountryCodePicker);
            }
        });

        bindContactForm(document.getElementById("contact_form"));
        bindContactForm(document.getElementById("contact-form"));
    });
})();
