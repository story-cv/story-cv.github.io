
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
                    <a href="${basePath}index.html" class="header-logo">
                        <img src="${basePath}logo-with-text-light.svg" alt="Story.CV">
                    </a>
                    <nav class="nav">
                        <button class="mobile-menu-toggle" aria-label="Toggle mobile menu" aria-expanded="false">
                            <span class="hamburger-line"></span>
                            <span class="hamburger-line"></span>
                            <span class="hamburger-line"></span>
                        </button>
                        <div class="nav-links">
                            <div class="header-nav">
                                <a href="${basePath}about-us.html" class="nav-link">About</a>
                                <a href="${basePath}blog.html" class="nav-link">Blog</a>
                                <a href="${basePath}student-resume.html" class="nav-link">For Students</a>
                                <a href="https://tally.so/r/wzBlA0" target="_blank" rel="noopener noreferrer" class="nav-cta">Join the waitlist</a>
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
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = headerContainer.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const linkFileName = href.split('/').pop();
            if (linkFileName === currentPage || 
                (currentPage === '' && linkFileName === 'index.html') ||
                (currentPage === 'index.html' && linkFileName === 'index.html')) {
                link.classList.add('nav-link-active');
            }
        });

        // Mobile menu functionality
        const mobileMenuToggle = headerContainer.querySelector('.mobile-menu-toggle');
        const navLinksContainer = headerContainer.querySelector('.nav-links');
        
        if (mobileMenuToggle && navLinksContainer) {
            mobileMenuToggle.addEventListener('click', function() {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                
                this.setAttribute('aria-expanded', !isExpanded);
                this.classList.toggle('active');
                navLinksContainer.classList.toggle('active');
                
                // Prevent body scroll when menu is open
                document.body.classList.toggle('mobile-menu-open', !isExpanded);
            });

            // Close menu when clicking on nav links
            const allNavLinks = headerContainer.querySelectorAll('.nav-link, .nav-cta');
            allNavLinks.forEach(link => {
                link.addEventListener('click', function() {
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    mobileMenuToggle.classList.remove('active');
                    navLinksContainer.classList.remove('active');
                    document.body.classList.remove('mobile-menu-open');
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(event) {
                if (!headerContainer.contains(event.target)) {
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    mobileMenuToggle.classList.remove('active');
                    navLinksContainer.classList.remove('active');
                    document.body.classList.remove('mobile-menu-open');
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
