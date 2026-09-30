// Theme toggle
(function () {
  var root = document.documentElement, btn = document.getElementById('theme');
  if (!btn) return;
  var sync = function () { btn.setAttribute('aria-pressed', String(root.dataset.theme === 'dark')); };
  var last = null;
  function apply() {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
    sync();
  }
  // Going dark, the new theme grows out of the toggle as a circle; going light, the dark page
  // shrinks back into it. Browsers without view transitions keep the CSS colour fade.
  btn.addEventListener('click', function () {
    if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) { apply(); return; }
    var r = btn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    var end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) * 1.1;
    var at = ' at ' + x + 'px ' + y + 'px)';
    var frames = ['circle(0px' + at, 'circle(' + end + 'px' + at];
    var shrink = root.dataset.theme === 'dark';
    if (shrink) frames.reverse();
    root.classList.toggle('vt-in', shrink);
    root.classList.add('vt'); // keeps the page's own colour fades out of the snapshot
    var t = document.startViewTransition(apply); last = t;
    t.ready.then(function () {
      root.animate({ clipPath: frames }, {
        duration: 450, easing: 'cubic-bezier(.3,0,.2,1)', fill: 'forwards',
        pseudoElement: shrink ? '::view-transition-old(root)' : '::view-transition-new(root)'
      });
    }).catch(function () {}); // a newer toggle aborted this one
    t.finished.finally(function () { if (last === t) root.classList.remove('vt', 'vt-in'); });
  });
  sync();
})();

// Navigation feedback: mark the section crossing a line a third of the way down the screen.
(function () {
  var links = [].slice.call(document.querySelectorAll('.bar nav a[href^="#"]'));
  var secs = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
  if (!links.length) return;
  var queued = false;
  function mark() {
    queued = false;
    var line = innerHeight / 3, cur = -1;
    secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top <= line) cur = i; });
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) cur = links.length - 1;
    links.forEach(function (a, i) { if (i === cur) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  function queue() { if (!queued) { queued = true; requestAnimationFrame(mark); } }
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  mark();
})();

// Hero attention heatmap. AFF[i][j] is how strongly word i "attends" to word j.
// The weights are hand-picked to look plausible; no model produced them.
(function () {
  var toks = [].slice.call(document.querySelectorAll('.hero .tok'));
  var hint = document.querySelector('.hero .hint');
  if (!toks.length) return;
  var AFF = [
    [.2, .5, .4, .1, .1, .2],
    [.3, .1, .9, .1, .2, .3],
    [.2, .9, .1, .1, .2, .3],
    [.1, .2, .2, .1, .8, .7],
    [.1, .2, .3, .3, .1, .95],
    [.2, .4, .5, .4, .95, .1]
  ];
  var word = function (i) { return toks[i].textContent.replace(/[.,]/g, ''); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pinned = -1, hovering = false, paused = false, timer = null, next = 5;

  function show(q) {
    toks.forEach(function (t, j) {
      t.style.setProperty('--w', q < 0 || j === q ? 0 : (AFF[q][j] * .55).toFixed(2));
      t.classList.toggle('q', j === q);
    });
    if (!hint) return;
    if (q < 0) { hint.textContent = ''; return; }
    var top = AFF[q].map(function (w, j) { return [j, w]; })
      .filter(function (x) { return x[0] !== q; })
      .sort(function (a, b) { return b[1] - a[1]; }).slice(0, 2);
    hint.textContent = 'query "' + word(q) + '" attends to: ' +
      top.map(function (x) { return word(x[0]) + ' ' + x[1].toFixed(2); }).join(', ');
  }
  function stopWalk() { clearInterval(timer); timer = null; }

  toks.forEach(function (t, j) {
    t.addEventListener('pointerenter', function (e) {
      if (e.pointerType !== 'mouse') return;
      hovering = true; show(j);
    });
    t.addEventListener('pointerleave', function (e) {
      if (e.pointerType !== 'mouse') return;
      hovering = false; show(pinned);
    });
    // Tap (or click) pins a word as the query; tapping it again clears it.
    t.addEventListener('click', function (e) {
      e.stopPropagation();
      stopWalk();
      pinned = pinned === j ? -1 : j;
      show(pinned);
    });
  });
  document.addEventListener('click', function () {
    if (pinned < 0) return;
    pinned = -1; show(-1);
  });

  // The idle walk rests while Ask this page is in use (features.js sends this event).
  document.addEventListener('ask:active', function (e) {
    if (paused === e.detail) return;
    paused = e.detail;
    if (paused && !hovering) show(pinned);
  });

  if (!reduce) {
    show(4);
    timer = setInterval(function () {
      if (hovering || paused) return;
      show(next); next = (next + 1) % toks.length;
    }, 1400);
  }
})();
