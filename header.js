
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
    }
}

// Initialize header when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createHeader);
} else {
    createHeader();
}
