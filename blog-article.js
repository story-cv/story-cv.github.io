(function () {
  'use strict';

  var body = document.querySelector('.blog-post-body');
  if (!body) return;

  body.querySelectorAll(':scope > .toc').forEach(function (oldToc) {
    oldToc.remove();
  });

  var headings = Array.from(body.querySelectorAll('h2, h3'));
  var tocHeadings = headings.filter(function (heading) {
    return heading.tagName === 'H2';
  });
  var usedIds = new Set(
    Array.from(document.querySelectorAll('[id]'))
      .map(function (element) { return element.id; })
      .filter(Boolean)
  );

  function slugify(text) {
    var base = text.toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section';
    var slug = base;
    var suffix = 2;
    while (usedIds.has(slug)) {
      slug = base + '-' + suffix++;
    }
    usedIds.add(slug);
    return slug;
  }

  headings.forEach(function (heading) {
    if (!heading.id) heading.id = slugify(heading.textContent);
  });

  document.querySelectorAll('[data-article-toc]').forEach(function (list) {
    tocHeadings.forEach(function (heading) {
      var item = document.createElement('li');
      var link = document.createElement('a');
      link.href = '#' + heading.id;
      link.textContent = heading.textContent;
      link.dataset.tocTarget = heading.id;
      item.appendChild(link);
      list.appendChild(item);
    });
  });

  if (!tocHeadings.length) {
    document.querySelectorAll('.article-toc-desktop, .article-toc-mobile').forEach(function (toc) {
      toc.hidden = true;
    });
  } else if ('IntersectionObserver' in window) {
    var tocLinks = Array.from(document.querySelectorAll('[data-toc-target]'));
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        tocLinks.forEach(function (link) {
          var active = link.dataset.tocTarget === entry.target.id;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-18% 0px -72% 0px' });
    headings.forEach(function (heading) { observer.observe(heading); });
  }

  document.querySelectorAll('.blog-post-body a').forEach(function (link) {
    var url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
  });

  document.querySelectorAll('[data-video-trigger]').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var card = trigger.closest('[data-video-card]');
      if (!card || card.classList.contains('is-playing')) return;
      var poster = card.querySelector('.article-video-poster');
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/RiYBO2_xQ_M?autoplay=1&rel=0';
      iframe.title = 'Why I built StoryCV instead of another template';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      iframe.tabIndex = 0;
      poster.replaceWith(iframe);
      card.classList.add('is-playing');
      window.requestAnimationFrame(function () { iframe.focus(); });
    });
  });
})();