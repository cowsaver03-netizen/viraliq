(function () {
  



  document.addEventListener('DOMContentLoaded', async function () {

    const pricingContainer = document.getElementById('pricingPlansContainer');
      const { BASE_URL, API } = window.APP_CONFIG;
      const API_URL = BASE_URL + API.PRICING;
    try {

      const res = await fetch(API_URL);
      const data = await res.json();

      if (!data.success) {
        pricingContainer.innerHTML = `
          <div class="col-12 text-center">
            <p>Failed to load pricing plans.</p>
          </div>
        `;
        return;
      }

      const plans = data.plans;

      if (plans.length === 0) {
        pricingContainer.innerHTML = `
          <div class="col-12 text-center">
            <p>No pricing plans available.</p>
          </div>
        `;
        return;
      }

      pricingContainer.innerHTML = '';

      plans.forEach((plan, index) => {

        let featuresHTML = '';

        if (Array.isArray(plan.planFeatures)) {

          featuresHTML = plan.planFeatures.map(feature => `
            <li>
              <img src="images/icons/check-2-1.png" alt="">
              ${feature}
            </li>
          `).join('');

        }

        pricingContainer.innerHTML += `

          <div class="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".3s">

            <div class="pricing-block ${index === 1 ? 'style-2' : ''}">

              <div class="inner-box">

                ${index === 1 ? `
                  <div class="recommend">Most Popular</div>
                ` : ''}

                <div class="pricing-header">

                  <h6 class="sub-title">${plan.planName}</h6>

                  <h2 class="price">
                    <sup>&#8377;</sup> ${plan.planPrice}
                  </h2>

                  <div class="pricing-flower">
                    <img src="images/icons/pricing-flower-2-1.png" alt="">
                  </div>

                </div>

                <ul class="pricing-list">
                  ${featuresHTML}
                </ul>

                <div class="pricing-button">
                  <a href="contact.html" class="pricing-btn">
                    Buy Now
                  </a>
                </div>

              </div>

            </div>

          </div>

        `;

      });

    } catch (error) {

      console.error("Pricing Fetch Error:", error);

      pricingContainer.innerHTML = `
        <div class="col-12 text-center">
          <p>Something went wrong while loading plans.</p>
        </div>
      `;

    }

  });

})();