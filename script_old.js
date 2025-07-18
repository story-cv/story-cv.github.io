// Timeline scroll animations and sticky header functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Mission banner animation observer for About Us page
    const missionBanner = document.querySelector('.mission-banner');
    if (missionBanner) {
        const missionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        });
        
        missionObserver.observe(missionBanner);
    }
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

// CTA Banner animation
const ctaBanner = document.querySelector('.cta-banner');

const ctaBannerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
});

if (ctaBanner) {
    // Set initial state
    ctaBanner.style.opacity = '0';
    ctaBanner.style.transform = 'translateY(30px)';
    ctaBanner.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    
    ctaBannerObserver.observe(ctaBanner);
}

// Tooltip functionality
const tooltipTriggers = document.querySelectorAll('.tooltip-trigger');
const tooltip = document.getElementById('tooltip');

tooltipTriggers.forEach(trigger => {
    trigger.addEventListener('mouseenter', (e) => {
        const tooltipText = e.target.getAttribute('data-tooltip');
        if (tooltipText && tooltip) {
            tooltip.textContent = tooltipText;
            tooltip.classList.add('show');
            
            const rect = e.target.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            
            // Position tooltip above the element, centered
            let left = rect.left + scrollLeft + (rect.width / 2) - (tooltip.offsetWidth / 2);
            let top = rect.top + scrollTop - tooltip.offsetHeight - 10;
            
            // Keep tooltip within viewport bounds
            const viewportWidth = window.innerWidth;
            if (left < 10) left = 10;
            if (left + tooltip.offsetWidth > viewportWidth - 10) {
                left = viewportWidth - tooltip.offsetWidth - 10;
            }
            
            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';
        }
    });
    
    trigger.addEventListener('mouseleave', () => {
        if (tooltip) {
            tooltip.classList.remove('show');
        }
    });
    
    // Touch support for mobile
    trigger.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const tooltipText = e.target.getAttribute('data-tooltip');
        if (tooltipText && tooltip) {
            tooltip.textContent = tooltipText;
            tooltip.classList.add('show');
            
            const rect = e.target.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            
            // Position tooltip above the element, centered
            let left = rect.left + scrollLeft + (rect.width / 2) - (tooltip.offsetWidth / 2);
            let top = rect.top + scrollTop - tooltip.offsetHeight - 10;
            
            // Keep tooltip within viewport bounds
            const viewportWidth = window.innerWidth;
            if (left < 10) left = 10;
            if (left + tooltip.offsetWidth > viewportWidth - 10) {
                left = viewportWidth - tooltip.offsetWidth - 10;
            }
            
            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';
            
            // Auto-hide after 4 seconds on mobile (longer for longer text)
            setTimeout(() => {
                tooltip.classList.remove('show');
            }, 4000);
        }
    });
});

// Hide tooltip when clicking elsewhere
document.addEventListener('click', (e) => {
    if (!e.target.classList.contains('tooltip-trigger') && tooltip) {
        tooltip.classList.remove('show');
    }
});

// About section animations
const aboutSections = document.querySelectorAll('.about-header, .philosophy-section, .take-section, .founders-section');

const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
});

aboutSections.forEach((section, index) => {
    // Set initial state
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
    
    aboutObserver.observe(section);
});



// ShadCN Accordion functionality
const accordionTriggers = document.querySelectorAll('.accordion-trigger');

accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const isOpen = trigger.getAttribute('data-state') === 'open';
        const content = trigger.nextElementSibling;
        
        // Close all other accordions
        accordionTriggers.forEach(otherTrigger => {
            if (otherTrigger !== trigger) {
                otherTrigger.setAttribute('data-state', 'closed');
                const otherContent = otherTrigger.nextElementSibling;
                otherContent.setAttribute('data-state', 'closed');
                otherContent.style.height = '0px';
            }
        });
        
        // Toggle current accordion
        if (isOpen) {
            trigger.setAttribute('data-state', 'closed');
            content.setAttribute('data-state', 'closed');
            content.style.height = '0px';
        } else {
            trigger.setAttribute('data-state', 'open');
            content.setAttribute('data-state', 'open');
            
            // Set height to content height for smooth animation
            const contentInner = content.querySelector('.accordion-content-inner');
            const height = contentInner.scrollHeight;
            content.style.height = height + 'px';
        }
    });
});

// Initialize accordion heights
document.addEventListener('DOMContentLoaded', () => {
    const accordionContents = document.querySelectorAll('.accordion-content');
    accordionContents.forEach(content => {
        if (content.getAttribute('data-state') === 'closed') {
            content.style.height = '0px';
        }
    });
});

// FAQ section animation
const faqHeader = document.querySelector('.faq-header');
const accordionItems = document.querySelectorAll('.accordion-item');

const faqObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Animate FAQ header
if (faqHeader) {
    faqHeader.style.opacity = '0';
    faqHeader.style.transform = 'translateY(30px)';
    faqHeader.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    faqObserver.observe(faqHeader);
}

// Animate accordion items with stagger
accordionItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s`;
    faqObserver.observe(item);
});
