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
});
