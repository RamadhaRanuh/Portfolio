// Theme toggle
(function () {
  var root = document.documentElement, btn = document.getElementById('theme');
  if (!btn) return;
  var sync = function () { btn.setAttribute('aria-pressed', String(root.dataset.theme === 'dark')); };
  btn.addEventListener('click', function () {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
    sync();
  });
  sync();
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
  var pinned = -1, hovering = false, timer = null, next = 5;

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

  if (!reduce) {
    show(4);
    timer = setInterval(function () {
      if (hovering) return;
      show(next); next = (next + 1) % toks.length;
    }, 1400);
  }
})();
