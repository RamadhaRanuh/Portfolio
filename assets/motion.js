// Motion: the page's optional animations, all in this one file so they can be removed wholesale.
// Every effect is skipped under reduced motion, and none of them holds content back: anything on
// screen at load is never hidden. Numbers match the feedback-pass spec.
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.IntersectionObserver) return;
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  function whenSeen(els, fn, margin) { // run fn(el) once, the first time el comes into view
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); fn(e.target); } });
    }, { rootMargin: margin || '0px 0px -10% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  // 1. Rise in on scroll: content below the fold fades up as it enters, staggered among siblings.
  // Uses the translate property, so it never fights the card tilt's transform.
  $$('main section h2, .card, .time li, .also, .more li, .contact > *').forEach(function (el) {
    if (el.getBoundingClientRect().top < innerHeight) return;
    el.classList.add('fx-rise');
    el.style.setProperty('--d', Math.min([].indexOf.call(el.parentNode.children, el), 6) * 60 + 'ms');
  });
  whenSeen($$('.fx-rise'), function (el) { el.classList.add('in'); });
  // A passage Ask scrolls to shows at once, without its rise.
  document.addEventListener('ask:reveal', function (e) {
    var el = e.detail.closest('.fx-rise');
    if (el && !el.classList.contains('in')) el.classList.add('fx-now', 'in');
  });

  // 2. Stats count up from 0 the first time they're seen. Arrow stats and the shelf's cards don't.
  whenSeen($$('.card .stats dt'), function (dt) {
    var raw = dt.textContent, m = raw.match(/^([^0-9]*)([0-9][0-9,]*\.?[0-9]*)(.*)$/);
    if (!m || /→/.test(raw)) return;
    var end = parseFloat(m[2].replace(/,/g, '')), dec = (m[2].split('.')[1] || '').length, comma = /,/.test(m[2]);
    var t0 = performance.now();
    dt.setAttribute('aria-label', raw);
    (function step(t) {
      var k = Math.min(1, (t - t0) / 900), v = end * (1 - Math.pow(1 - k, 3)), s = v.toFixed(dec);
      if (comma) s = Number(s).toLocaleString('en-US', { minimumFractionDigits: dec });
      dt.textContent = m[1] + s + m[3];
      if (k < 1) requestAnimationFrame(step); else { dt.textContent = raw; dt.removeAttribute('aria-label'); }
    })(t0);
  });

  // 3. Diagrams draw in: boxes and bars fade in, arrows draw as strokes. features.js holds any
  // playback until the 'drawn' event, then the diagram is handed back to its own styles.
  $$('.media svg[data-diagram]').forEach(function (svg) {
    var paths = $$('.ln path', svg), rects = $$('rect', svg), last = 0;
    svg.classList.add('fx-draw');
    paths.forEach(function (p, i) {
      var L = p.getTotalLength(), d = 300 + i * 90;
      p.style.strokeDasharray = L; p.style.strokeDashoffset = L; p.style.setProperty('--d', d + 'ms');
      last = Math.max(last, d + 700);
    });
    rects.forEach(function (r, i) { r.style.setProperty('--d', i * 50 + 'ms'); last = Math.max(last, i * 50 + 400); });
    svg.drawMs = last;
  });
  whenSeen($$('.fx-draw'), function (svg) {
    svg.classList.add('in');
    setTimeout(function () {
      $$('.ln path, rect', svg).forEach(function (el) { el.style.strokeDasharray = el.style.strokeDashoffset = ''; el.style.removeProperty('--d'); });
      svg.classList.remove('fx-draw', 'in');
      svg.dispatchEvent(new Event('drawn'));
    }, svg.drawMs + 50);
  });

  // 4. The hero lede streams in word by word behind a block cursor, like a model writing it.
  // Screen readers get the whole sentence at once; every word is forced visible at the end.
  var lede = document.querySelector('.hero .lede');
  if (lede) {
    var full = lede.textContent, parts = full.split(/(\s+)/), n = 0;
    lede.innerHTML = '<span class="sr-only"></span><span aria-hidden="true">' + parts.map(function (w) {
      return /^\s*$/.test(w) ? w : '<span class="fx-w" style="animation-delay:' + (150 + n++ * 45) + 'ms">' + w.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</span>';
    }).join('') + '<span class="fx-caret"></span></span>';
    lede.firstChild.textContent = full;
    setTimeout(function () { lede.classList.add('done'); }, 150 + n * 45 + 1200);
  }

  // 6. With a mouse, the headline word nearest the pointer becomes the heatmap's query.
  // hero.js decides whether it shows (a pinned word or Ask in use wins).
  var hero = document.querySelector('.hero'), toks = $$('.hero .tok'), near = -1;
  function follow(i) { if (i !== near) { near = i; document.dispatchEvent(new CustomEvent('heat:follow', { detail: i })); } }
  if (hero && toks.length) {
    hero.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      if (e.target.closest('.ask, .cta, a, button, input')) { follow(-1); return; }
      var best = -1, bd = 260 * 260;
      toks.forEach(function (t, i) {
        var r = t.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        if (dx * dx + dy * dy * 4 < bd) { bd = dx * dx + dy * dy * 4; best = i; }
      });
      follow(best);
    });
    hero.addEventListener('pointerleave', function () { follow(-1); });
  }

  // 5. A faint glow drifts behind the hero: the one effect that loops on its own. It pauses while
  // the hero is off screen or the tab is hidden.
  if (hero) {
    var glow = document.createElement('div'), seen = true;
    glow.className = 'fx-glow'; glow.setAttribute('aria-hidden', 'true'); hero.prepend(glow);
    var still = function () { glow.classList.toggle('paused', !seen || document.hidden); };
    new IntersectionObserver(function (es) { seen = es[0].isIntersecting; still(); }).observe(hero);
    document.addEventListener('visibilitychange', still);
  }

  // 7. With a mouse, project cards tilt slightly toward the pointer under a faint highlight.
  // They ease flat over a link or button, so nothing moves under a click.
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('.card').forEach(function (c) {
      c.classList.add('fx-tilt');
      function flat() { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); }
      c.addEventListener('pointermove', function (e) {
        if (e.pointerType !== 'mouse') return;
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.setProperty('--mx', (x * 100).toFixed(1) + '%'); c.style.setProperty('--my', (y * 100).toFixed(1) + '%');
        if (e.target.closest('a, button')) { flat(); return; }
        c.style.setProperty('--rx', ((.5 - y) * 3).toFixed(2) + 'deg');
        c.style.setProperty('--ry', ((x - .5) * 4).toFixed(2) + 'deg');
      });
      c.addEventListener('pointerleave', flat);
    });
  }

  // 8. Section labels type themselves out, unless the visitor jumped straight to that section.
  var heads = $$('main section h2');
  function jumped(hash) {
    var s = hash && hash.length > 1 && document.getElementById(hash.slice(1));
    var h = s && s.querySelector('h2');
    if (h) h.dataset.jumped = '1';
  }
  jumped(location.hash);
  addEventListener('hashchange', function () { jumped(location.hash); });
  $$('a[href^="#"]').forEach(function (a) { a.addEventListener('click', function () { jumped(a.getAttribute('href')); }); });
  whenSeen(heads, function (h) {
    if (h.dataset.jumped) return;
    var full = h.textContent, i = 0;
    h.setAttribute('aria-label', full); h.classList.add('fx-typing'); h.textContent = '';
    (function next() {
      if (h.dataset.jumped) i = full.length - 1; // a nav jump mid-typing finishes it at once
      h.textContent = full.slice(0, ++i);
      if (i < full.length) setTimeout(next, 55);
      else setTimeout(function () { h.classList.remove('fx-typing'); h.removeAttribute('aria-label'); }, 900);
    })();
  }, '0px 0px -25% 0px');
})();
