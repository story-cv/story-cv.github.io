(function () {
  var container = document.getElementById('transform-animation-container');
  if (!container) return;

  var rawText = 'uh, I basically kept the vendor stuff on track when we switched systems\u2026 a lot of chasing people honestly';
  var bulletText = 'Led vendor coordination through an ERP migration, keeping 14 supplier integrations live with zero missed order cycles';

  container.innerHTML =
    '<div class="transform-card">' +
      '<div class="transform-label transform-label-muted">What you said</div>' +
      '<div class="transform-raw-text" id="transform-raw-' + container.dataset.instance + '"></div>' +
      '<hr class="transform-divider">' +
      '<div class="transform-label transform-label-orange">What you actually did</div>' +
      '<div class="transform-bullet-text" id="transform-bullet-' + container.dataset.instance + '"></div>' +
    '</div>' +
    '<p class="transform-caption">This happens live, from your own answers. Twice, free.</p>';

  var instanceId = container.dataset.instance || Math.random().toString(36).slice(2);
  container.dataset.instance = instanceId;

  var rawEl = container.querySelector('.transform-raw-text');
  var bulletEl = container.querySelector('.transform-bullet-text');

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    rawEl.textContent = rawText;
    bulletEl.textContent = bulletText;
    return;
  }

  var cycleTimeout = null;
  var typingInterval = null;
  var isVisible = false;
  var aborted = false;

  function clearState() {
    if (typingInterval) { clearInterval(typingInterval); typingInterval = null; }
    if (cycleTimeout) { clearTimeout(cycleTimeout); cycleTimeout = null; }
  }

  function type(el, text, speed, done) {
    var i = 0;
    el.textContent = '';
    typingInterval = setInterval(function () {
      if (aborted) { clearInterval(typingInterval); typingInterval = null; return; }
      el.textContent = text.slice(0, ++i);
      if (i >= text.length) {
        clearInterval(typingInterval);
        typingInterval = null;
        if (done) setTimeout(done, 700);
      }
    }, speed);
  }

  function cycle() {
    if (!isVisible || aborted) return;
    rawEl.textContent = '';
    bulletEl.textContent = '';
    type(rawEl, rawText, 26, function () {
      if (!isVisible || aborted) return;
      type(bulletEl, bulletText, 20, function () {
        if (!isVisible || aborted) return;
        cycleTimeout = setTimeout(cycle, 2500);
      });
    });
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        isVisible = true;
        aborted = false;
        if (!typingInterval && !cycleTimeout) {
          cycle();
        }
      } else {
        isVisible = false;
        aborted = true;
        clearState();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(container);
})();
