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
    baseTop: 80,        // Starting top position (accounts for header)
    topIncrement: 16,   // How much to increment top for each card
    baseZIndex: 10      // Starting z-index
  };

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initStickyCards();
  });

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
      
      // Calculate sticky top position (staggered so cards peek behind)
      const topPosition = stickyConfig.baseTop + (index * stickyConfig.topIncrement);
      section.style.setProperty('--sticky-top', `${topPosition}px`);
      
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
            const topPosition = stickyConfig.baseTop + (index * stickyConfig.topIncrement);
            section.style.setProperty('--sticky-top', `${topPosition}px`);
            const zIndex = stickyConfig.baseZIndex + index;
            section.style.setProperty('--sticky-z', zIndex);
          });
        }
      }, 100);
    });
  }
})();
