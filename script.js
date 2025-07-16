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
    const singleRows = document.querySelectorAll('.single-row');
    const progressDots = document.querySelectorAll('.progress-dot');
    let currentRowIndex = 0;
    let isAnimating = false;
    
    if (!singleRows.length || !progressDots.length) return;
    
    // Auto-advance timer
    let autoAdvanceTimer;
    const autoAdvanceDelay = 4000; // 4 seconds
    
    function showRow(index) {
        if (isAnimating || index < 0 || index >= singleRows.length) return;
        
        isAnimating = true;
        
        // Hide all rows
        singleRows.forEach((row, i) => {
            row.classList.remove('active');
        });
        
        // Update progress dots
        progressDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        // Show target row after a brief delay
        setTimeout(() => {
            singleRows[index].classList.add('active');
            currentRowIndex = index;
            isAnimating = false;
        }, 100);
        
        resetAutoAdvance();
    }
    
    function nextRow() {
        const nextIndex = (currentRowIndex + 1) % singleRows.length;
        showRow(nextIndex);
    }
    
    function resetAutoAdvance() {
        clearTimeout(autoAdvanceTimer);
        autoAdvanceTimer = setTimeout(nextRow, autoAdvanceDelay);
    }
    
    // Progress dot click handlers
    progressDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showRow(index);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            const prevIndex = currentRowIndex === 0 ? singleRows.length - 1 : currentRowIndex - 1;
            showRow(prevIndex);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextRow();
        }
    });
    
    // Scroll-based navigation
    const comparisonSection = document.querySelector('.comparison-section');
    if (comparisonSection) {
        let scrollTimeout;
        
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    resetAutoAdvance();
                } else {
                    clearTimeout(autoAdvanceTimer);
                }
            });
        }, {
            threshold: 0.5
        });
        
        scrollObserver.observe(comparisonSection);
        
        // Mouse wheel navigation within the section
        comparisonSection.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaY) > 50) { // Significant scroll
                e.preventDefault();
                
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    if (e.deltaY > 0) {
                        nextRow();
                    } else {
                        const prevIndex = currentRowIndex === 0 ? singleRows.length - 1 : currentRowIndex - 1;
                        showRow(prevIndex);
                    }
                }, 100);
            }
        }, { passive: false });
    }
    
    // Pause auto-advance on hover
    const singleRowContainer = document.querySelector('.single-row-container');
    if (singleRowContainer) {
        singleRowContainer.addEventListener('mouseenter', () => {
            clearTimeout(autoAdvanceTimer);
        });
        
        singleRowContainer.addEventListener('mouseleave', () => {
            resetAutoAdvance();
        });
    }
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (singleRowContainer) {
        singleRowContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        singleRowContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swipe right - go to previous
                const prevIndex = currentRowIndex === 0 ? singleRows.length - 1 : currentRowIndex - 1;
                showRow(prevIndex);
            } else {
                // Swipe left - go to next
                nextRow();
            }
        }
    }
    
    // Start auto-advance
    resetAutoAdvance();
}
