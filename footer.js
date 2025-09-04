
// Footer component that can be included on any page
function createFooter() {
    return `
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <!-- Logo and Tagline -->
                <div class="footer-brand">
                    <div class="footer-logo">
                        <img src="/logo-with-text-light.svg" alt="Story.CV">
                    </div>
                    <p class="footer-tagline">The only resume writer that truly tells your story.</p>
                </div>

                <!-- Social Media and CTA -->
                <div class="footer-actions">
                    <div class="footer-social">
                        <a href="https://x.com/story_cv_" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Follow us on Twitter">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                        </a>
                        <a href="https://www.linkedin.com/company/story-cv/" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Follow us on LinkedIn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </a>
                        <a href="https://www.instagram.com/story.cv_/" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Follow us on Instagram">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                        </a>
                        <a href="https://www.reddit.com/r/StoryCV/" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Join our Reddit community">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.169-.231-.442-.377-.735-.377-.216 0-.414.063-.581.178-.622-.44-1.479-.718-2.407-.763L14.451 4.4 16.8 4.934c.058.495.497.892 1.018.892.581 0 1.05-.469 1.05-1.05s-.469-1.05-1.05-1.05c-.444 0-.824.27-.989.657l-2.867-.523c-.081-.015-.162.004-.218.051s-.098.126-.109.208l-.506 2.571c-.982.043-1.896.322-2.539.772-.168-.115-.366-.178-.582-.178-.293 0-.566.146-.735.377-.293.398-.211.95.181 1.226-.037.153-.037.315 0 .469-.012.004-.020.007-.029.014-.009.006-.009.006-.009.006s-.009.006-.009.006-.009.006-.009.006c0 1.832 2.112 3.318 4.718 3.318s4.718-1.486 4.718-3.318c0 0-.009-.006-.009-.006s-.009-.006-.009-.006-.009-.006-.009-.006c-.009-.007-.017-.01-.029-.014.037-.154.037-.316 0-.469.392-.276.474-.828.181-1.226zm-2.206 2.792c-.554.586-1.656.929-3.362.929s-2.808-.343-3.362-.929c-.119-.126-.119-.329 0-.455.119-.126.313-.126.432 0 .383.406 1.271.68 2.93.68s2.547-.274 2.93-.68c.119-.126.313-.126.432 0 .119.126.119.329 0 .455z"/>
                            </svg>
                        </a>
                    </div>
                    <a href="https://tally.so/r/wzBlA0" target="_blank" rel="noopener noreferrer" class="footer-cta-button">
                        Join the waitlist
                    </a>
                </div>
            </div>

            <!-- Legal Links -->
            <div class="footer-legal">
                <div class="legal-links">
                    <a href="about-us.html" class="legal-link">About Us</a>
                    <span class="legal-separator">•</span>
                    <a href="privacy-policy.html" class="legal-link">Privacy Policy</a>
                    <span class="legal-separator">•</span>
                    <a href="terms-of-service.html" class="legal-link">Terms of Service</a>
                    <span class="legal-separator">•</span>
                    <a href="mailto:write@story.cv" class="legal-link">Contact</a>
                </div>
                <p class="footer-copyright">© 2025 StoryCV. All rights reserved.</p>
            </div>
        </div>
    </footer>
    `;
}

// Initialize footer when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        footerContainer.innerHTML = createFooter();
    }
});
