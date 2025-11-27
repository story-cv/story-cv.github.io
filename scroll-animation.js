/**
 * Scroll Reveal Animations
 * Uses Intersection Observer API to trigger smooth reveal animations
 * as elements enter the viewport.
 */

(function() {
  'use strict';

  // Configuration
  const config = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', initScrollReveal);

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
})();
