(function () {

  const { BASE_URL, API } = window.APP_CONFIG;
  const API_URL = BASE_URL + API.CONTACT;

  document.addEventListener('DOMContentLoaded', function () {
    setupContactForm();
  });

  function setupContactForm() {
    const form = document.getElementById('contact-form');

    if (!form) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const formData = new FormData(form);

      const data = Object.fromEntries(formData.entries());

      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const result = await res.json();

        if (result.success) {
          alert("✅ Message sent successfully!");
          form.reset();
        } else {
          alert("❌ Failed to send message");
        }

      } catch (error) {
        console.error("Error:", error);
        alert("❌ Server error");
      }
    });
  }


})();

// (function () {

//   const { BASE_URL, API } = window.APP_CONFIG;
//   const API_URL = BASE_URL + API.CONTACT;

//   document.addEventListener('DOMContentLoaded', function () {
//     setupContactForms();
//   });

//   function setupContactForms() {

//     // supports BOTH:
//     // id="contact-form"
//     // id="contact_form"

//     const forms = document.querySelectorAll('#contact-form, #contact_form');

//     if (!forms.length) return;

//     forms.forEach(form => {

//       form.addEventListener('submit', async function (e) {
//         e.preventDefault();

//         const formData = new FormData(form);

//         // convert HTML names into backend payload
//         const data = {
//           name:
//             formData.get('name') ||
//             formData.get('form_name'),

//           email:
//             formData.get('email') ||
//             formData.get('form_email'),

//           subject:
//             formData.get('subject') ||
//             formData.get('form_subject'),

//           countryCode:
//             formData.get('countryCode') ||
//             formData.get('form_country_code'),

//           phone:
//             formData.get('phone') ||
//             formData.get('form_phone'),

//           message:
//             formData.get('message') ||
//             formData.get('form_message')
//         };

//         // combine full phone
//         if (data.countryCode && data.phone) {
//           data.phone = `${data.countryCode} ${data.phone}`;
//         }

//         try {

//           const res = await fetch(API_URL, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(data)
//           });

//           const result = await res.json();

//           if (result.success) {

//             alert("✅ Message sent successfully!");
//             form.reset();

//           } else {

//             alert(result.message || "❌ Failed to send message");

//           }

//         } catch (error) {

//           console.error("Contact Error:", error);
//           alert("❌ Server error");

//         }

//       });

//     });

//   }

// })();

