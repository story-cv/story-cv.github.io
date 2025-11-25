
function createHeader() {
    // Determine the correct base path based on current location
    const currentPath = window.location.pathname;
    let basePath = '';
    
    if (currentPath.includes('/blog/articles/')) {
        basePath = '../../';
    } else if (currentPath.includes('/blog/')) {
        basePath = '../';
    }
    
    const headerHTML = `
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
    }
}

// Initialize header when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createHeader);
} else {
    createHeader();
}
