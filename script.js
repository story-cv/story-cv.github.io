// Document ready with improved scroll animations
document.addEventListener('DOMContentLoaded', function() {
    // Hero section animation
    const heroSection = document.querySelector('.hero');
    
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });
    
    if (heroSection) {
        heroObserver.observe(heroSection);
    }
    
    // Below the fold section animation
    const belowFoldSection = document.querySelector('.below-fold');
    
    const belowFoldObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });
    
    if (belowFoldSection) {
        belowFoldObserver.observe(belowFoldSection);
    }
    
    // Advantages section animation with stagger
    const advantageCards = document.querySelectorAll('.advantage-card');
    
    const advantageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 150);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    advantageCards.forEach(card => {
        advantageObserver.observe(card);
    });
    
    // Timeline section with scroll-triggered animations
    const timelineSteps = document.querySelectorAll('.timeline-step');
    const timelineHeader = document.querySelector('.timeline-sticky-header');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.6,
        rootMargin: '0px 0px -100px 0px'
    });
    
    timelineSteps.forEach(step => {
        timelineObserver.observe(step);
    });
    
    // Sticky header visibility
    if (timelineHeader) {
        const headerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                timelineHeader.classList.toggle('visible', entry.isIntersecting);
            });
        }, {
            threshold: 0.1
        });
        
        const timelineSection = document.querySelector('.timeline');
        if (timelineSection) {
            headerObserver.observe(timelineSection);
        }
    }
    
    // Process cards animation with progress bar
    const processCards = document.querySelectorAll('.process-card');
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressLine = document.querySelector('.progress-line');
    let currentStep = 0;
    let animationInterval;
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Start the animation when cards come into view
                startProgressAnimation();
                // Make all cards visible with stagger
                processCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 150);
                });
            } else {
                // Stop animation when out of view
                stopProgressAnimation();
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });
    
    function updateProgress(step) {
        // Update progress line
        const progressPercentage = step === 0 ? 0 : (step / 2) * 100;
        if (progressLine) {
            progressLine.style.setProperty('--progress-width', `${progressPercentage}%`);
            progressLine.querySelector('::after') && 
            (progressLine.style.setProperty('--progress-width', `${progressPercentage}%`));
        }
        
        // Update progress steps
        progressSteps.forEach((stepEl, index) => {
            stepEl.classList.remove('active', 'completed');
            if (index < step) {
                stepEl.classList.add('completed');
            } else if (index === step) {
                stepEl.classList.add('active');
            }
        });
        
        // Update cards
        processCards.forEach((card, index) => {
            card.classList.toggle('active', index === step);
        });
    }
    
    function startProgressAnimation() {
        if (animationInterval) return; // Already running
        
        currentStep = 0;
        updateProgress(currentStep);
        
        animationInterval = setInterval(() => {
            currentStep = (currentStep + 1) % 3;
            updateProgress(currentStep);
            
            // Update progress line width
            if (progressLine) {
                const progressWidth = currentStep === 0 ? 0 : (currentStep / 2) * 100;
                progressLine.style.setProperty('--progress-width', `${progressWidth}%`);
            }
        }, 2500); // Change step every 2.5 seconds
    }
    
    function stopProgressAnimation() {
        if (animationInterval) {
            clearInterval(animationInterval);
            animationInterval = null;
        }
    }
    
    // Observe the process section
    const processSection = document.querySelector('.process-flow');
    if (processSection) {
        cardObserver.observe(processSection);
    }
    
    // Static fallback for users who can't see animations
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Show all steps as active for accessibility
        processCards.forEach(card => {
            card.classList.add('visible', 'active');
        });
        progressSteps.forEach(step => {
            step.classList.add('active');
        });
    }
    
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
    
    if (!singleRows.length) return;
    
    // Use Intersection Observer to show all rows as user scrolls
    const comparisonObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all rows for scroll-triggered visibility
    singleRows.forEach(row => {
        comparisonObserver.observe(row);
    });
    
    // Show first row immediately
    if (singleRows[0]) {
        singleRows[0].classList.add('visible');
    }
}