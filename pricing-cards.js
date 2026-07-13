(function () {
  var container = document.getElementById('pricing-cards-container');
  if (!container) return;

  container.innerHTML = `
    <div class="pricing-cards">

      <div class="pricing-card scroll-reveal" data-delay="0">
        <div class="pricing-card-header">
          <h3 class="pricing-tier-name">The First Chapter</h3>
          <div class="pricing-amount">
            <span class="pricing-price">$0</span>
          </div>
        </div>
        <div class="pricing-card-body">
          <p class="pricing-description">See what two of your bullets become.</p>
          <ul class="pricing-features">
            <li>
              <svg class="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Two finished bullets, fully written from your own answers</span>
            </li>
            <li>
              <svg class="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Yours to keep, whatever you decide</span>
            </li>
          </ul>
        </div>
        <div class="pricing-card-footer">
          <p class="pricing-transparency-line">When you want the rest: $10, one week.</p>
          <a href="https://write.story.cv" target="_blank" rel="noopener noreferrer" class="pricing-cta-button pricing-cta-secondary">Start free</a>
        </div>
      </div>

      <div class="pricing-card scroll-reveal" data-delay="100">
        <div class="pricing-card-header">
          <h3 class="pricing-tier-name">The Full Story</h3>
          <div class="pricing-amount">
            <span class="pricing-price">$10</span>
            <span class="pricing-pass-label">&middot; one-week pass</span>
          </div>
        </div>
        <div class="pricing-card-body">
          <p class="pricing-description">Enough time to rewrite your entire resume. Every role, every bullet, unlimited edits.</p>
          <ul class="pricing-features">
            <li>
              <svg class="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Every bullet fully written, including the ones waiting from your free interview</span>
            </li>
            <li>
              <svg class="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Work as much as you want for 7 days</span>
            </li>
            <li>
              <svg class="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>After the week, your bullets stay yours</span>
            </li>
          </ul>
        </div>
        <div class="pricing-card-footer">
          <a href="https://write.story.cv" target="_blank" rel="noopener noreferrer" class="pricing-cta-button pricing-cta-primary">Get my pass</a>
        </div>
      </div>

    </div>

    <div class="pricing-philosophy scroll-reveal">
      <h4 class="pricing-philosophy-heading">Why a pass and not a subscription?</h4>
      <p class="pricing-philosophy-body">Rewriting your resume is a project. It has an end. Subscriptions make money by assuming you'll forget to cancel (we'd rather not build a business on that).</p>
      <p class="pricing-philosophy-body">So you pay for the week you're actually working. When it ends, your bullets are yours forever. Need it again next year? Come back. Same price.</p>
    </div>
  `;
})();
