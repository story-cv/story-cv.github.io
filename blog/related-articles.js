// Related Articles Component - Modular system for all blog posts
class RelatedArticles {
    constructor() {
        this.articles = [
            {
                title: "Passing the ATS is the easiest (and the most pointless) part",
                excerpt: "Stop wasting time on ATS keywords. Understand why your resume fails the human test & how a foundation-first career narrative is the only strategy that gets you hired.",
                image: "/blog/images/ATS filter versus recruiter.webp",
                url: "/blog/articles/ats-filter-90-10-rule/",
                category: "Resume Tips",
                readTime: "4 min read"
            },
            {
                title: "The #1 Question to Ask Before Hiring a Resume Writer",
                excerpt: "Job seekers usually try two quick fixes: free AI or paid services. But what if both paths lead to the same dead end?",
                image: "/blog/images/what-is-resume-writer.webp",
                url: "/blog/articles/what-is-resume-writer/",
                category: "Career Advice",
                readTime: "8 min read"
            },
            {
                title: "The only student resume template you'll ever need",
                excerpt: "Real student resume examples you can copy. Perfect for internships, part-time jobs, and your first full-time position.",
                image: "/blog/images/student-resume-template.webp", 
                url: "/blog/articles/student-resume-template-with-real-examples/",
                category: "Resume Tips",
                readTime: "3 min read"
            }
        ];
    }

    // Get related articles excluding current article
    getRelatedArticles(currentUrl, maxArticles = 3) {
        return this.articles
            .filter(article => {
                // Check multiple URL formats to ensure matching
                const articlePath = article.url.replace(/^\/+/, '');
                const currentPath = currentUrl.replace(/^\/+/, '');
                const isMatch = articlePath === currentPath || 
                               article.url === currentUrl ||
                               currentUrl.includes(articlePath.split('/').pop());
                return !isMatch;
            })
            .slice(0, maxArticles);
    }

    // Generate HTML for related articles
    generateHTML(currentUrl) {
        const relatedArticles = this.getRelatedArticles(currentUrl);
        
        if (relatedArticles.length === 0) {
            return '';
        }

        let html = `
            <section class="related-articles">
                <div class="container">
                    <h2 class="related-articles-title">Related Articles</h2>
                    <div class="related-articles-grid">`;

        relatedArticles.forEach(article => {
            html += `
                        <article class="related-article-card">
                            <div class="related-article-image">
                                <img src="${article.image}" alt="${article.title}" loading="lazy">
                            </div>
                            <div class="related-article-content">
                                <div class="related-article-top">
                                    <div class="related-article-meta">
                                        <span class="related-article-read-time">${article.readTime}</span>
                                    </div>
                                    <h3 class="related-article-title">
                                        <a href="${article.url}">${article.title}</a>
                                    </h3>
                                    <p class="related-article-excerpt">${article.excerpt}</p>
                                </div>
                                <a href="${article.url}" class="related-article-link">Read article →</a>
                            </div>
                        </article>`;
        });

        html += `
                    </div>
                </div>
            </section>`;

        return html;
    }

    // Render related articles to a specific element
    render(containerId, currentUrl) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Related Articles: Container with ID "${containerId}" not found`);
            return;
        }

        const html = this.generateHTML(currentUrl);
        container.innerHTML = html;
    }

    // Auto-render at the end of article content
    autoRender(currentUrl) {
        // Find the main article content container
        const mainContent = document.querySelector('main') || document.querySelector('.blog-post-content') || document.querySelector('article');
        
        if (!mainContent) {
            console.warn('Related Articles: Could not find main content container');
            return;
        }

        const html = this.generateHTML(currentUrl);
        if (html) {
            // Create a container for related articles
            const relatedContainer = document.createElement('div');
            relatedContainer.innerHTML = html;
            
            // Insert before footer or at end of main content
            const footer = document.querySelector('footer');
            if (footer) {
                footer.parentNode.insertBefore(relatedContainer, footer);
            } else {
                document.body.appendChild(relatedContainer);
            }
        }
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const relatedArticles = new RelatedArticles();
    const currentUrl = window.location.pathname;
    
    // Auto-render related articles
    relatedArticles.autoRender(currentUrl);
});

// Export for manual use
window.RelatedArticles = RelatedArticles;