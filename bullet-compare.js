(function () {
  var compare = document.getElementById('bulletCompare');
  var divider = document.getElementById('bcDivider');
  if (!compare || !divider) return;

  var afterPanel = compare.querySelector('.bc-after');
  var handle = divider.querySelector('.bc-handle');
  var dragging = false;

  function updatePosition(pct) {
    pct = Math.min(0.95, Math.max(0.05, pct));
    var p = pct * 100;
    divider.style.left = p + '%';
    afterPanel.style.clipPath = 'inset(0 ' + (100 - p) + '% 0 0)';
    if (handle) {
      handle.setAttribute('aria-valuenow', Math.round(p));
    }
  }

  updatePosition(0.5);

  compare.addEventListener('pointerdown', function (e) {
    dragging = true;
    compare.setPointerCapture(e.pointerId);
    e.preventDefault();
    var rect = compare.getBoundingClientRect();
    updatePosition((e.clientX - rect.left) / rect.width);
  });

  compare.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    var rect = compare.getBoundingClientRect();
    updatePosition((e.clientX - rect.left) / rect.width);
  });

  compare.addEventListener('pointerup', function () {
    dragging = false;
  });

  compare.addEventListener('pointercancel', function () {
    dragging = false;
  });

  if (handle) {
    handle.addEventListener('keydown', function (e) {
      var current = parseFloat(handle.getAttribute('aria-valuenow')) / 100;
      if (e.key === 'ArrowLeft') { updatePosition(current - 0.05); e.preventDefault(); }
      if (e.key === 'ArrowRight') { updatePosition(current + 0.05); e.preventDefault(); }
    });
  }
})();
