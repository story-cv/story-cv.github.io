// Document ready with improved scroll animations
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - script starting');
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
    
    // Initialize tabs functionality - with immediate execution test
    console.log('About to initialize tabs...');
    initializeTabs();
    console.log('Tabs initialization called');
    
    // Initialize accordion functionality
    console.log('About to initialize accordion...');
    initializeAccordion();
    console.log('Accordion initialization called');
    
    // Initialize new tabbed comparison functionality
    initializeNewComparisonTabs();
    
    // Initialize comparison section animation
    initializeComparisonAnimation();
});

// Tabs functionality for comparison section - simplified
function initializeTabs() {
    console.log('=== TABS INITIALIZATION STARTING ===');
    
    // Simple approach: direct button listeners
    const buttons = document.querySelectorAll('.tab-button');
    const panels = document.querySelectorAll('.tab-panel');
    
    console.log('Found buttons:', buttons.length);
    console.log('Found panels:', panels.length);
    
    if (buttons.length === 0 || panels.length === 0) {
        console.error('NO BUTTONS OR PANELS FOUND!');
        return;
    }
    
    buttons.forEach((button, index) => {
        console.log(`Setting up button ${index}: ${button.getAttribute('data-tab')}`);
        
        button.onclick = function(e) {
            e.preventDefault();
            console.log('=== BUTTON CLICKED ===');
            console.log('Clicked button:', this.getAttribute('data-tab'));
            
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active from all buttons
            buttons.forEach(btn => btn.classList.remove('active'));
            
            // Remove active from all panels  
            panels.forEach(panel => panel.classList.remove('active'));
            
            // Add active to clicked button
            this.classList.add('active');
            
            // Add active to target panel
            const targetPanel = document.querySelector(`[data-panel="${targetTab}"]`);
            if (targetPanel) {
                targetPanel.classList.add('active');
                console.log('SUCCESS: Panel activated for', targetTab);
            } else {
                console.error('FAILED: No panel found for', targetTab);
            }
            
            console.log('=== BUTTON CLICK COMPLETE ===');
        };
    });
    
    console.log('=== TABS INITIALIZATION COMPLETE ===');
    
    // Initialize tooltip functionality for info icons only
    initializeTooltips();
}

// New Tabbed Comparison Functionality
function initializeNewComparisonTabs() {
    console.log('=== NEW COMPARISON TABS STARTING ===');
    
    const comparisonTabs = document.querySelectorAll('.comparison-tab');
    const comparisonPanels = document.querySelectorAll('.comparison-panel');
    
    console.log('Found comparison tabs:', comparisonTabs.length);
    console.log('Found comparison panels:', comparisonPanels.length);
    
    if (comparisonTabs.length === 0 || comparisonPanels.length === 0) {
        console.log('No new comparison tabs found - this is normal if section not loaded yet');
        return;
    }
    
    comparisonTabs.forEach((tab, index) => {
        console.log(`Setting up comparison tab ${index}: ${tab.getAttribute('data-tab')}`);
        
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('=== COMPARISON TAB CLICKED ===');
            console.log('Clicked tab:', this.getAttribute('data-tab'));
            
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active from all tabs
            comparisonTabs.forEach(t => t.classList.remove('active'));
            
            // Remove active from all panels
            comparisonPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active to clicked tab
            this.classList.add('active');
            
            // Add active to target panel
            const targetPanel = document.getElementById(`${targetTab}-panel`);
            if (targetPanel) {
                // Small delay for smooth transition
                setTimeout(() => {
                    targetPanel.classList.add('active');
                }, 50);
                console.log('SUCCESS: Comparison panel activated for', targetTab);
            } else {
                console.error('FAILED: No comparison panel found for', targetTab);
            }
            
            console.log('=== COMPARISON TAB CLICK COMPLETE ===');
        });
    });
    
    console.log('=== NEW COMPARISON TABS COMPLETE ===');
}

function initializeTooltips() {
    const tooltipTriggers = document.querySelectorAll('.tooltip-trigger');
    const tooltip = document.getElementById('tooltip');
    
    console.log('Tooltip element:', tooltip);
    console.log('Tooltip triggers found:', tooltipTriggers.length);
    
    if (!tooltip) {
        console.error('Tooltip element with ID "tooltip" not found');
        return;
    }
    
    tooltipTriggers.forEach((trigger, index) => {
        console.log(`Setting up trigger ${index}:`, trigger.getAttribute('data-tooltip'));
        
        // Handle both hover and click for mobile compatibility
        const showTooltip = (e) => {
            const triggerElement = e.target.closest('.tooltip-trigger');
            const tooltipText = triggerElement ? triggerElement.getAttribute('data-tooltip') : null;
            console.log('Showing tooltip:', tooltipText);
            
            if (tooltipText) {
                tooltip.innerHTML = tooltipText; // Use innerHTML to support rich text
                tooltip.style.display = 'block';
                tooltip.classList.add('show');
                
                // Wait for tooltip to be rendered so we can get its dimensions
                requestAnimationFrame(() => {
                    const rect = triggerElement.getBoundingClientRect();
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
                    
                    // Position tooltip above the trigger
                    let tooltipLeft = rect.left + scrollLeft + (rect.width / 2) - (tooltip.offsetWidth / 2);
                    let tooltipTop = rect.top + scrollTop - tooltip.offsetHeight - 15;
                    
                    // Keep tooltip within viewport bounds
                    const viewportWidth = window.innerWidth;
                    if (tooltipLeft < 10) tooltipLeft = 10;
                    if (tooltipLeft + tooltip.offsetWidth > viewportWidth - 10) {
                        tooltipLeft = viewportWidth - tooltip.offsetWidth - 10;
                    }
                    
                    // If tooltip would go off screen top, position it below instead
                    if (tooltipTop < 0) {
                        tooltipTop = rect.bottom + scrollTop + 10;
                        // Update arrow position for bottom placement
                        tooltip.classList.add('tooltip-below');
                    } else {
                        tooltip.classList.remove('tooltip-below');
                    }
                    
                    tooltip.style.left = tooltipLeft + 'px';
                    tooltip.style.top = tooltipTop + 'px';
                });
            }
        };
        
        const hideTooltip = () => {
            console.log('Hiding tooltip');
            tooltip.style.display = 'none';
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
            tooltip.classList.remove('show');
        };
        
        // Mouse events for desktop
        trigger.addEventListener('mouseenter', showTooltip);
        trigger.addEventListener('mouseleave', hideTooltip);
        
        // Click events for mobile/touch devices
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (tooltip.classList.contains('show')) {
                hideTooltip();
            } else {
                showTooltip(e);
            }
        });
        
        // Also listen on the info icon specifically
        const infoIcon = trigger.querySelector('.info-icon');
        if (infoIcon) {
            infoIcon.addEventListener('mouseenter', showTooltip);
            infoIcon.addEventListener('mouseleave', hideTooltip);
            infoIcon.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (tooltip.classList.contains('show')) {
                    hideTooltip();
                } else {
                    showTooltip(e);
                }
            });
        }
    });
    
    // Hide tooltip when clicking elsewhere
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.tooltip-trigger')) {
            tooltip.style.display = 'none';
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
            tooltip.classList.remove('show');
        }
    });
}

// Comparison section scroll animation
function initializeComparisonAnimation() {
    const comparisonSection = document.querySelector('.comparison-section');
    const comparisonTitle = document.querySelector('.comparison-title');
    const tabsNav = document.querySelector('.tabs-nav');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    if (!comparisonSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate title
                if (comparisonTitle) {
                    comparisonTitle.style.opacity = '0';
                    comparisonTitle.style.transform = 'translateY(30px)';
                    setTimeout(() => {
                        comparisonTitle.style.transition = 'all 0.6s ease-out';
                        comparisonTitle.style.opacity = '1';
                        comparisonTitle.style.transform = 'translateY(0)';
                    }, 100);
                }
                
                // Animate tabs navigation
                if (tabsNav) {
                    tabsNav.style.opacity = '0';
                    tabsNav.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        tabsNav.style.transition = 'all 0.6s ease-out';
                        tabsNav.style.opacity = '1';
                        tabsNav.style.transform = 'translateY(0)';
                    }, 300);
                }
                
                // Animate active tab panel
                const activePanel = document.querySelector('.tab-panel.active');
                if (activePanel) {
                    activePanel.style.opacity = '0';
                    activePanel.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        activePanel.style.transition = 'all 0.6s ease-out';
                        activePanel.style.opacity = '1';
                        activePanel.style.transform = 'translateY(0)';
                    }, 500);
                }
                
                // Only animate once
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });
    
    observer.observe(comparisonSection);
}

// Accordion functionality
function initializeAccordion() {
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');
    
    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const currentItem = this.closest('.accordion-item');
            const currentContent = currentItem.querySelector('.accordion-content');
            const currentState = this.getAttribute('data-state');
            
            // Close all other accordion items
            accordionTriggers.forEach(otherTrigger => {
                if (otherTrigger !== this) {
                    const otherItem = otherTrigger.closest('.accordion-item');
                    const otherContent = otherItem.querySelector('.accordion-content');
                    
                    otherTrigger.setAttribute('data-state', 'closed');
                    otherContent.setAttribute('data-state', 'closed');
                    otherContent.style.height = '0px';
                }
            });
            
            // Toggle current accordion item
            if (currentState === 'closed' || !currentState) {
                this.setAttribute('data-state', 'open');
                currentContent.setAttribute('data-state', 'open');
                
                // Set height to auto temporarily to measure content
                currentContent.style.height = 'auto';
                const height = currentContent.scrollHeight;
                currentContent.style.height = '0px';
                
                // Force reflow then animate to full height
                requestAnimationFrame(() => {
                    currentContent.style.height = height + 'px';
                });
                
                // After transition ends, set to auto for responsive behavior
                setTimeout(() => {
                    if (currentContent.getAttribute('data-state') === 'open') {
                        currentContent.style.height = 'auto';
                    }
                }, 200);
                
            } else {
                this.setAttribute('data-state', 'closed');
                currentContent.setAttribute('data-state', 'closed');
                
                // Get current height and animate to 0
                const height = currentContent.scrollHeight;
                currentContent.style.height = height + 'px';
                
                requestAnimationFrame(() => {
                    currentContent.style.height = '0px';
                });
            }
        });
    });
    
    // Initialize heights
    accordionTriggers.forEach(trigger => {
        const content = trigger.closest('.accordion-item').querySelector('.accordion-content');
        const state = trigger.getAttribute('data-state');
        
        if (state === 'closed' || !state) {
            content.style.height = '0px';
            content.setAttribute('data-state', 'closed');
        }
    });
}