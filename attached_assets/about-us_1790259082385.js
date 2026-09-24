/* ==========================================================
   StoryCV About page motion  (about-us.js)
   - Scroll reveals for .ab-reveal (below-the-fold only)
   - Manifesto paragraphs "ink in" as they reach mid-screen
   - Hero user count ticks up once
   Respects prefers-reduced-motion. Content is fully visible
   without this script.
   ========================================================== */
(function () {
  'use strict';

  function init() {
    var root = document.querySelector('.ab');
    if (!root) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;

    var vh = window.innerHeight || document.documentElement.clientHeight;

    /* 1. Scroll reveals: only hide what's genuinely below the fold */
    var reveals = [].slice.call(root.querySelectorAll('.ab-reveal'));
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.remove('ab-pre');
        e.target.classList.add('ab-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    reveals.forEach(function (el) {
      if (el.getBoundingClientRect().top > vh * 0.92) {
        el.classList.add('ab-pre');
        io.observe(el);
      } else {
        el.classList.add('ab-in');
      }
    });

    /* 2. Manifesto ink-in */
    var ink = root.querySelector('.ab-ink');
    if (ink) {
      var paras = [].slice.call(ink.querySelectorAll('p'));
      var unread = paras.filter(function (p) { return p.getBoundingClientRect().top > vh * 0.7; });
      if (unread.length) {
        ink.classList.add('ab-ink-on');
        paras.forEach(function (p) { if (unread.indexOf(p) === -1) p.classList.add('ab-read'); });
        var inkIO = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting || e.boundingClientRect.top < 0) {
              e.target.classList.add('ab-read');
              inkIO.unobserve(e.target);
            }
          });
        }, { rootMargin: '0px 0px -35% 0px', threshold: 0 });
        unread.forEach(function (p) { inkIO.observe(p); });
      }
    }

    /* 3. Hero count-up (the real number stays in the HTML for crawlers) */
    var counter = root.querySelector('.ab-count');
    if (counter) {
      var to = parseInt(counter.getAttribute('data-to'), 10) || 0;
      var start = null, dur = 1400;
      counter.textContent = '0';
      var step = function (t) {
        if (start === null) start = t;
        var k = Math.min(1, (t - start) / dur);
        var eased = 1 - Math.pow(1 - k, 3);
        counter.textContent = String(Math.round(to * eased));
        if (k < 1) requestAnimationFrame(step);
      };
      setTimeout(function () { requestAnimationFrame(step); }, 500);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
