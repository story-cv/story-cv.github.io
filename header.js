
function createProductHuntBanner() {
    const BANNER_DISMISSED_KEY = 'ph_banner_dismissed';
    
    if (localStorage.getItem(BANNER_DISMISSED_KEY)) {
        return '';
    }
    
    return `
        <div class="ph-launch-banner" id="ph-launch-banner">
            <div class="ph-banner-content">
                <span class="ph-banner-icon">🚀</span>
                <span class="ph-banner-text">We're launching on Product Hunt! Your support would mean the world to us.</span>
                <a href="https://www.producthunt.com/products/storycv?launch=storycv" target="_blank" rel="noopener noreferrer" class="ph-banner-button">Support Us!</a>
                <button class="ph-banner-close" id="ph-banner-close" aria-label="Dismiss banner">&times;</button>
            </div>
        </div>
        <style>
            .ph-launch-banner {
                background: #2e2e2e;
                color: white;
                padding: 12px 20px;
                text-align: center;
                font-family: 'Onest', -apple-system, BlinkMacSystemFont, sans-serif;
                position: relative;
                z-index: 1001;
            }
            .ph-banner-content {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                flex-wrap: wrap;
                max-width: 1200px;
                margin: 0 auto;
            }
            .ph-banner-icon {
                font-size: 18px;
            }
            .ph-banner-text {
                font-size: 14px;
                font-weight: 500;
            }
            .ph-banner-button {
                background: white;
                color: #ee4e34;
                padding: 8px 20px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 600;
                font-size: 14px;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            .ph-banner-button:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .ph-banner-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0 8px;
                opacity: 0.8;
                transition: opacity 0.2s;
                line-height: 1;
            }
            .ph-banner-close:hover {
                opacity: 1;
            }
            @media (max-width: 600px) {
                .ph-banner-content {
                    gap: 8px;
                }
                .ph-banner-text {
                    font-size: 13px;
                }
                .ph-banner-button {
                    padding: 6px 14px;
                    font-size: 13px;
                }
            }
        </style>
    `;
}

function initBannerClose() {
    const closeBtn = document.getElementById('ph-banner-close');
    const banner = document.getElementById('ph-launch-banner');
    
    if (closeBtn && banner) {
        closeBtn.addEventListener('click', function() {
            banner.style.display = 'none';
            localStorage.setItem('ph_banner_dismissed', 'true');
        });
    }
}

function createHeader() {
    // Determine the correct base path based on current location
    const currentPath = window.location.pathname;
    let basePath = '';
    
    if (currentPath.includes('/blog/articles/')) {
        basePath = '../../';
    } else if (currentPath.includes('/blog/')) {
        basePath = '../';
    }
    
    const bannerHTML = createProductHuntBanner();
    
    const headerHTML = `
        ${bannerHTML}
        <header class="header">
            <div class="container">
                <div class="header-content">
                    <a href="/" class="header-logo">
                        <img src="/logo-with-text-light.svg" alt="Story.CV">
                    </a>
                    <nav class="nav">
                        <button class="mobile-menu-toggle" aria-label="Toggle mobile menu" aria-expanded="false">
                            <span class="hamburger-line"></span>
                            <span class="hamburger-line"></span>
                            <span class="hamburger-line"></span>
                        </button>
                        <div class="nav-links">
                            <button class="mobile-menu-close" aria-label="Close mobile menu">
                                <span class="close-line"></span>
                                <span class="close-line"></span>
                            </button>
                            <div class="header-nav">
                                <a href="/about-us" class="nav-link">About</a>
                                <a href="/pricing" class="nav-link">Pricing</a>
                                <a href="/blog" class="nav-link">Blog</a>
                                <a href="/student-resume" class="nav-link">For Students</a>
                                <a href="https://write.story.cv" target="_blank" rel="noopener noreferrer" class="nav-cta">Write my resume</a>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    `;

    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        headerContainer.innerHTML = headerHTML;
        
        // Set active nav link based on current page
        const currentPath = window.location.pathname;
        const navLinks = headerContainer.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const linkPath = href.split('/').pop();
            const pagePath = currentPath.split('/').pop().replace('.html', '');
            
            if (linkPath === pagePath || 
                (pagePath === '' && linkPath === '') ||
                (pagePath === 'index' && linkPath === '')) {
                link.classList.add('nav-link-active');
            }
        });

        // Mobile menu functionality
        const mobileMenuToggle = headerContainer.querySelector('.mobile-menu-toggle');
        const mobileMenuClose = headerContainer.querySelector('.mobile-menu-close');
        const navLinksContainer = headerContainer.querySelector('.nav-links');
        
        function closeMenu() {
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileMenuToggle.classList.remove('active');
            navLinksContainer.classList.remove('active');
            document.body.classList.remove('mobile-menu-open');
        }
        
        function openMenu() {
            mobileMenuToggle.setAttribute('aria-expanded', 'true');
            mobileMenuToggle.classList.add('active');
            navLinksContainer.classList.add('active');
            document.body.classList.add('mobile-menu-open');
        }
        
        if (mobileMenuToggle && navLinksContainer) {
            mobileMenuToggle.addEventListener('click', function() {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                
                if (isExpanded) {
                    closeMenu();
                } else {
                    openMenu();
                }
            });
            
            // Close button functionality
            if (mobileMenuClose) {
                mobileMenuClose.addEventListener('click', closeMenu);
            }

            // Close menu when clicking on nav links
            const allNavLinks = headerContainer.querySelectorAll('.nav-link, .nav-cta');
            allNavLinks.forEach(link => {
                link.addEventListener('click', closeMenu);
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(event) {
                if (!headerContainer.contains(event.target)) {
                    closeMenu();
                }
            });
        }
        
        // Initialize banner close functionality
        initBannerClose();
    }
}

// Initialize header when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createHeader);
} else {
    createHeader();
}
