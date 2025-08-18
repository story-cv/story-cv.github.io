
function createHeader() {
    const headerHTML = `
        <div class="container">
            <div class="header-content">
                <a href="index.html" class="header-logo">
                    <img src="logo-with-text-light.svg" alt="Story.CV">
                </a>
                <nav class="header-nav">
                    <a href="about-us.html" class="nav-link">About</a>
                    <a href="blog.html" class="nav-link">Blog</a>
                    <a href="https://tally.so/r/wzBlA0" target="_blank" rel="noopener noreferrer" class="nav-cta">Join the waitlist</a>
                </nav>
            </div>
        </div>
    `;

    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        headerContainer.innerHTML = headerHTML;
        
        // Set active nav link based on current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = headerContainer.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || 
                (currentPage === '' && href === 'index.html') ||
                (currentPage === 'index.html' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
}

// Initialize header when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createHeader);
} else {
    createHeader();
}
