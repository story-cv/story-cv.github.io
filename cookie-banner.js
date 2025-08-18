
// Cookie Banner Management
class CookieBanner {
    constructor() {
        this.cookieName = 'storycv_cookie_consent';
        this.cookieExpiry = 365; // days
        this.init();
    }

    init() {
        // Check if user has already made a choice
        if (!this.hasConsent()) {
            this.showBanner();
        }
        
        // Initialize analytics based on consent
        this.initializeAnalytics();
    }

    hasConsent() {
        const consent = this.getCookie(this.cookieName);
        return consent !== null;
    }

    getConsentLevel() {
        const consent = this.getCookie(this.cookieName);
        if (consent) {
            try {
                return JSON.parse(consent);
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    showBanner() {
        // Remove existing banner if any
        const existingBanner = document.getElementById('cookie-banner');
        if (existingBanner) {
            existingBanner.remove();
        }

        // Create banner HTML
        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-banner-content">
                <div class="cookie-banner-text">
                    <h3 class="cookie-banner-title">We use cookies</h3>
                    <p class="cookie-banner-description">
                        We use essential cookies to make our site work and analytics cookies to understand how you interact with our website.
                        <a href="privacy-policy.html" class="cookie-banner-link">Learn more in our Privacy Policy</a>
                    </p>
                </div>
                <div class="cookie-banner-actions">
                    <button class="cookie-banner-btn cookie-banner-btn-secondary" id="cookie-manage">
                        Manage preferences
                    </button>
                    <button class="cookie-banner-btn cookie-banner-btn-primary" id="cookie-accept-all">
                        Accept all
                    </button>
                </div>
            </div>
        `;

        // Add to page
        document.body.appendChild(banner);

        // Add event listeners
        document.getElementById('cookie-accept-all').addEventListener('click', () => {
            this.acceptAll();
        });

        document.getElementById('cookie-manage').addEventListener('click', () => {
            this.showPreferencesModal();
        });

        // Show banner with animation
        setTimeout(() => {
            banner.classList.add('cookie-banner-visible');
        }, 100);
    }

    showPreferencesModal() {
        // Remove existing modal if any
        const existingModal = document.getElementById('cookie-preferences-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal HTML
        const modal = document.createElement('div');
        modal.id = 'cookie-preferences-modal';
        modal.className = 'cookie-modal';
        modal.innerHTML = `
            <div class="cookie-modal-backdrop"></div>
            <div class="cookie-modal-content">
                <div class="cookie-modal-header">
                    <h3 class="cookie-modal-title">Cookie Preferences</h3>
                    <button class="cookie-modal-close" id="cookie-modal-close">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="cookie-modal-body">
                    <p class="cookie-modal-description">
                        Choose which cookies you want to accept. You can change these settings at any time.
                    </p>
                    
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <div class="cookie-category-info">
                                <h4 class="cookie-category-title">Essential Cookies</h4>
                                <p class="cookie-category-description">Required for the website to function properly.</p>
                            </div>
                            <div class="cookie-toggle">
                                <input type="checkbox" id="essential-cookies" checked disabled>
                                <label for="essential-cookies" class="toggle-label">Always On</label>
                            </div>
                        </div>
                    </div>

                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <div class="cookie-category-info">
                                <h4 class="cookie-category-title">Analytics Cookies</h4>
                                <p class="cookie-category-description">Help us understand how visitors interact with our website.</p>
                            </div>
                            <div class="cookie-toggle">
                                <input type="checkbox" id="analytics-cookies" class="toggle-checkbox">
                                <label for="analytics-cookies" class="toggle-switch">
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="cookie-modal-footer">
                    <button class="cookie-banner-btn cookie-banner-btn-secondary" id="cookie-reject-all">
                        Reject all
                    </button>
                    <button class="cookie-banner-btn cookie-banner-btn-primary" id="cookie-save-preferences">
                        Save preferences
                    </button>
                </div>
            </div>
        `;

        // Add to page
        document.body.appendChild(modal);

        // Set current preferences
        const currentConsent = this.getConsentLevel();
        if (currentConsent) {
            document.getElementById('analytics-cookies').checked = currentConsent.analytics;
        }

        // Add event listeners
        document.getElementById('cookie-modal-close').addEventListener('click', () => {
            this.hidePreferencesModal();
        });

        document.getElementById('cookie-reject-all').addEventListener('click', () => {
            this.rejectAll();
            this.hidePreferencesModal();
        });

        document.getElementById('cookie-save-preferences').addEventListener('click', () => {
            this.savePreferences();
            this.hidePreferencesModal();
        });

        // Close on backdrop click
        modal.querySelector('.cookie-modal-backdrop').addEventListener('click', () => {
            this.hidePreferencesModal();
        });

        // Show modal with animation
        setTimeout(() => {
            modal.classList.add('cookie-modal-visible');
        }, 100);
    }

    hidePreferencesModal() {
        const modal = document.getElementById('cookie-preferences-modal');
        if (modal) {
            modal.classList.remove('cookie-modal-visible');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }

    acceptAll() {
        const consent = {
            essential: true,
            analytics: true,
            timestamp: new Date().toISOString()
        };
        
        this.setCookie(this.cookieName, JSON.stringify(consent), this.cookieExpiry);
        this.hideBanner();
        this.initializeAnalytics();
    }

    rejectAll() {
        const consent = {
            essential: true,
            analytics: false,
            timestamp: new Date().toISOString()
        };
        
        this.setCookie(this.cookieName, JSON.stringify(consent), this.cookieExpiry);
        this.hideBanner();
        this.initializeAnalytics();
    }

    savePreferences() {
        const analyticsConsent = document.getElementById('analytics-cookies').checked;
        
        const consent = {
            essential: true,
            analytics: analyticsConsent,
            timestamp: new Date().toISOString()
        };
        
        this.setCookie(this.cookieName, JSON.stringify(consent), this.cookieExpiry);
        this.hideBanner();
        this.initializeAnalytics();
    }

    hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.remove('cookie-banner-visible');
            setTimeout(() => {
                banner.remove();
            }, 300);
        }
    }

    initializeAnalytics() {
        const consent = this.getConsentLevel();
        
        if (consent && consent.analytics) {
            // Enable Google Analytics if consent given
            if (typeof gtag !== 'undefined') {
                gtag('consent', 'update', {
                    'analytics_storage': 'granted'
                });
            }
        } else {
            // Disable analytics if no consent
            if (typeof gtag !== 'undefined') {
                gtag('consent', 'update', {
                    'analytics_storage': 'denied'
                });
            }
        }
    }

    // Utility methods
    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Public method to show preferences (for settings page)
    showPreferences() {
        this.showPreferencesModal();
    }

    // Public method to reset consent
    resetConsent() {
        document.cookie = `${this.cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
        location.reload();
    }
}

// Initialize cookie banner when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.cookieBanner = new CookieBanner();
});

// Export for external use
window.CookieBanner = CookieBanner;
