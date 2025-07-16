// Timeline scroll animations and sticky header functionality
document.addEventListener('DOMContentLoaded', function() {
    const stickyHeader = document.getElementById('sticky-header');
    const timelineSection = document.getElementById('chatgpt-section');
    const timelineSteps = document.querySelectorAll('.timeline-step');
    
    // Intersection Observer for timeline steps animation
    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all timeline steps
    timelineSteps.forEach(step => {
        stepObserver.observe(step);
    });
    
    // Sticky header visibility logic
    const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Show sticky header when timeline content is visible
                const rect = entry.target.getBoundingClientRect();
                const timelineContainer = entry.target.querySelector('.timeline-container');
                
                if (timelineContainer) {
                    const containerRect = timelineContainer.getBoundingClientRect();
                    
                    // Show sticky header when we start scrolling through timeline steps
                    if (containerRect.top < 200) {
                        stickyHeader.classList.add('visible');
                    } else {
                        stickyHeader.classList.remove('visible');
                    }
                }
            } else {
                // Hide sticky header when section is not visible
                stickyHeader.classList.remove('visible');
            }
        });
    }, {
        threshold: 0,
        rootMargin: '-100px 0px -100px 0px'
    });
    
    // Observe the timeline section
    if (timelineSection) {
        headerObserver.observe(timelineSection);
    }
    
    // Additional scroll listener for fine-tuned sticky header control
    let ticking = false;
    
    function updateStickyHeader() {
        if (!timelineSection || !stickyHeader) return;
        
        const sectionRect = timelineSection.getBoundingClientRect();
        const timelineContainer = timelineSection.querySelector('.timeline-container');
        
        if (timelineContainer) {
            const containerRect = timelineContainer.getBoundingClientRect();
            
            // Show sticky header when scrolling through timeline steps
            if (sectionRect.top < 0 && sectionRect.bottom > 300 && containerRect.top < 200) {
                stickyHeader.classList.add('visible');
            } else {
                stickyHeader.classList.remove('visible');
            }
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateStickyHeader);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Process cards animation
    const processCards = document.querySelectorAll('.process-card');
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add delay for staggered animation
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 150);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all process cards
    processCards.forEach(card => {
        cardObserver.observe(card);
    });
    
    // Mini hero animation
    const miniHero = document.querySelector('.mini-hero');
    
    const miniHeroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });
    
    if (miniHero) {
        miniHeroObserver.observe(miniHero);
    }
    
    // Comparison table functionality
    initComparisonTable();
});

function initComparisonTable() {
    const comparisonSection = document.querySelector('.comparison-section');
    const comparisonRows = document.querySelector('.comparison-rows');
    const fallbackTable = document.querySelector('.comparison-fallback');
    const rows = document.querySelectorAll('.comparison-row');
    
    if (!comparisonSection || !comparisonRows || !rows.length) return;
    
    // Feature detection for scroll-snap and sticky positioning
    const supportsScrollSnap = CSS.supports('scroll-snap-type', 'y mandatory');
    const supportsSticky = CSS.supports('position', 'sticky');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Check if we should use fallback
    if (!supportsScrollSnap || !supportsSticky || reducedMotion) {
        showFallbackTable();
        return;
    }
    
    // Set up scroll-triggered animations for comparison rows
    const rowObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.3,
        root: comparisonRows,
        rootMargin: '-10% 0px -10% 0px'
    });
    
    // Observe all comparison rows
    rows.forEach(row => {
        rowObserver.observe(row);
    });
    
    // Add keyboard navigation for accessibility
    comparisonRows.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            
            const currentRow = document.querySelector('.comparison-row.visible');
            if (!currentRow) return;
            
            let nextRow;
            if (e.key === 'ArrowDown') {
                nextRow = currentRow.nextElementSibling;
            } else {
                nextRow = currentRow.previousElementSibling;
            }
            
            if (nextRow && nextRow.classList.contains('comparison-row')) {
                nextRow.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
    
    // Make the container focusable for keyboard navigation
    comparisonRows.tabIndex = 0;
    
    function showFallbackTable() {
        // Hide the scroll-snap table and show fallback
        comparisonRows.style.display = 'none';
        fallbackTable.style.display = 'block';
        
        // Copy content to fallback table
        const fallbackRows = fallbackTable.querySelector('.fallback-rows');
        rows.forEach(row => {
            const clonedRow = row.cloneNode(true);
            clonedRow.classList.add('visible');
            clonedRow.style.opacity = '1';
            clonedRow.style.transform = 'none';
            fallbackRows.appendChild(clonedRow);
        });
    }
}
