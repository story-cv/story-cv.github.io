/**
 * Scroll Reveal Animations & Sticky Card Effect
 * Uses Intersection Observer API to trigger smooth reveal animations
 * and creates a typeless.com-style stacking card effect on scroll.
 */

(function() {
  'use strict';

  // Configuration
  const config = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  // Sticky card configuration
  const stickyConfig = {
    baseTop: 80,        // All cards stick at same top position (accounts for header)
    baseZIndex: 10      // Starting z-index
  };

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initWigglyUnderline();
  });

  /**
   * Wiggly Underline Animation
   * Triggers the "writing" effect for the hero headline underline with continuous loop
   */
  function initWigglyUnderline() {
    const wigglyPath = document.querySelector('.wiggly-path');
    
    if (!wigglyPath) {
      return;
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Show line immediately for users who prefer reduced motion
      wigglyPath.style.strokeDashoffset = '0';
      return;
    }

    // Calculate actual path length and set initial state
    const pathLength = wigglyPath.getTotalLength();
    wigglyPath.style.strokeDasharray = pathLength;
    wigglyPath.style.strokeDashoffset = pathLength;
    wigglyPath.style.transition = 'stroke-dashoffset 1.5s ease-in-out';

    // Animation loop function
    function animateWigglyLine() {
      // Draw the line
      wigglyPath.style.strokeDashoffset = '0';
      
      // After line is fully drawn, wait a moment then erase it
      setTimeout(() => {
        // Ensure full erasure by using negative offset
        wigglyPath.style.strokeDashoffset = -pathLength;
        
        // After erasing, wait a moment then reset and start again
        setTimeout(() => {
          // Reset to starting position without animation
          wigglyPath.style.transition = 'none';
          wigglyPath.style.strokeDashoffset = pathLength;
          
          // Re-enable transition after a brief moment
          setTimeout(() => {
            wigglyPath.style.transition = 'stroke-dashoffset 1.5s ease-in-out';
            animateWigglyLine();
          }, 50);
        }, 1600); // Wait for erase animation to complete (1.5s) + small buffer
      }, 2000); // Keep line visible for 2 seconds
    }

    // Start the animation after initial delay
    setTimeout(() => {
      animateWigglyLine();
    }, 800);
  }

  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    if (!revealElements.length) {
      return;
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Show all elements immediately for users who prefer reduced motion
      revealElements.forEach(el => el.classList.add('visible'));
      return;
    }

    // Create the Intersection Observer
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const delay = element.dataset.delay || 0;
          
          // Apply delay if specified
          setTimeout(() => {
            element.classList.add('visible');
          }, parseInt(delay, 10));
          
          // Stop observing once revealed
          obs.unobserve(element);
        }
      });
    }, config);

    // Observe all reveal elements
    revealElements.forEach(el => observer.observe(el));
  }

  function initStickyCards() {
    // Only apply on desktop
    if (window.innerWidth <= 768) {
      return;
    }

    // Get all section-wrapper elements (these contain the floating cards)
    const sectionWrappers = document.querySelectorAll('.section-wrapper');
    
    if (!sectionWrappers.length) {
      return;
    }

    // Apply sticky positioning to each section
    sectionWrappers.forEach((section, index) => {
      section.classList.add('sticky-card-section');
      
      // All cards stick at the same top position for clean overlap effect
      section.style.setProperty('--sticky-top', `${stickyConfig.baseTop}px`);
      
      // Set z-index (higher for later cards so they stack on top)
      const zIndex = stickyConfig.baseZIndex + index;
      section.style.setProperty('--sticky-z', zIndex);
    });

    // Handle resize - disable sticky on mobile
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (window.innerWidth <= 768) {
          sectionWrappers.forEach(section => {
            section.classList.remove('sticky-card-section');
          });
        } else {
          sectionWrappers.forEach((section, index) => {
            section.classList.add('sticky-card-section');
            section.style.setProperty('--sticky-top', `${stickyConfig.baseTop}px`);
            const zIndex = stickyConfig.baseZIndex + index;
            section.style.setProperty('--sticky-z', zIndex);
          });
        }
      }, 100);
    });
  }
})();
