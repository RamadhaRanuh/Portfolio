// Screenshot lightbox: the Deepnote screenshot opens full size in a native dialog.
(function () {
  var box = document.getElementById('lightbox'), zoom = document.querySelector('.zoom');
  if (!box || !zoom || !box.showModal) return;
  var big = box.querySelector('img'), small = zoom.querySelector('img');
  zoom.addEventListener('click', function () {
    big.src = small.currentSrc || small.src; big.alt = small.alt; // the file the card already loaded
    box.showModal();
  });
  box.addEventListener('click', function (e) { // the dimmed area is the dialog itself
    if (e.target === box || e.target.closest('.close')) box.close();
  });
})();

// Flagship diagrams: each one plays through its steps once when the visitor hovers, taps or
// presses play, then rests. Nothing moves until they act.
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var svgs = {}; // keyed by data-diagram, so cards can be added or reordered
  [].forEach.call(document.querySelectorAll('.card .media > svg[data-diagram]'), function (s) { svgs[s.dataset.diagram] = s; });
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function boxes(svg, texts) { // each box is a rect followed by its label
    return !svg ? [] : [].slice.call(svg.querySelectorAll('rect')).map(function (r, i) {
      return { els: [r, r.nextElementSibling], text: texts[i] };
    });
  }
  var TRAIN = [97.43, 98.77, 100, 93.8, 100], TEST = [97.56, 89.74, 87.18, 87.18, 79.49];
  var NAMES = ['YOLO', 'InceptionResNetV2', 'DenseNet201', 'GoogLeNet', 'MobileNet'];
  var chart = !svgs.accuracy ? [] : [].slice.call(svgs.accuracy.querySelectorAll('rect:not(.bar-bg)')).map(function (bar, i) {
    var tick = document.createElementNS(NS, 'line'), x = 156 + TRAIN[i] * 2, y = +bar.getAttribute('y');
    tick.setAttribute('x1', x); tick.setAttribute('x2', x); tick.setAttribute('y1', y - 4); tick.setAttribute('y2', y + 20);
    tick.setAttribute('class', 'tick'); bar.parentNode.appendChild(tick);
    var bg = bar.previousElementSibling, gap = TRAIN[i] - TEST[i];
    return {
      els: [bg.previousElementSibling, bg, bar, bar.nextElementSibling, tick], bar: bar, w: bar.getAttribute('width'),
      text: NAMES[i] + ': ' + TRAIN[i] + '% on training, ' + TEST[i] + '% on the test set. ' +
        (gap > 1 ? 'It lost ' + gap.toFixed(1) + ' points on unseen images.' : 'It held up on unseen images.')
    };
  });
  var D = [
    { svg: svgs.scopa, name: 'agent pipeline walkthrough',
      rest: 'An orchestrator agent runs the loop: 10 cycles of 20 items, 200 in all, for $2.05 of GPT-5 calls.',
      steps: boxes(svgs.scopa, [
        'About 4,000 posts on X about Indonesian culture and regional dialects, grouped by topic.',
        'The Data agent pulls one random post through a tool call.',
        'The Transformator agent distils the post into structured seed data: the theme, the cultural norms, the local terms.',
        'The Generator agent writes twenty COPA items per seed: a premise, a cause-or-effect question and two choices.',
        'The Validator agent checks five criteria, logic and cultural relevance among them, and drops near-duplicates with Sentence-BERT and TF-IDF. Failures go back to the Generator.',
        'The Annotator agent tags what each item tests: language, terminology or culture.',
        'The Colloquial agent rewrites each item in Jakarta dialect, checked against the original with Sentence-BERT.'
      ]) },
    { svg: svgs.accuracy, steps: chart, name: 'accuracy comparison',
      rest: 'Lines mark training accuracy. The further a bar stops short of its line, the more the model overfit.' },
    { svg: svgs.rag, name: 'pipeline walkthrough', rest: 'Index once, then retrieve and answer per question.',
      steps: boxes(svgs.rag, [
        'Five volumes of the Gale Encyclopedia of Medicine, as PDFs.',
        'Pages are split into chunks, and each chunk is turned into a vector.',
        'The vectors are stored once in ChromaDB, on disk.',
        'A medical question comes in from the chat UI.',
        'The chunks closest to the question are fetched from the store.',
        'A local GGUF model writes the answer from those chunks, streamed token by token.'
      ]) },
    { svg: svgs.stacks, name: 'architecture walkthrough', rest: 'Two stacks, written block by block in PyTorch.',
      steps: boxes(svgs.stacks, [
        'Each token becomes a vector, plus a signal for where it sits in the sentence.',
        'Every token looks at every other token, through several heads at once.',
        'A small network applied to each token on its own.',
        'Scores over the vocabulary, turned into probabilities for the next token.',
        'Normalises by root mean square before each sub-layer.',
        'Position is encoded by rotating queries and keys (RoPE); groups of query heads share one key and value head (GQA).',
        'A gated feed-forward layer built on the SiLU activation.',
        'Keys and values from earlier tokens are kept, so each new token is computed once.'
      ]) }
  ];

  D.forEach(function (d) {
    if (!d.svg) return;
    var cap = document.createElement('p'); cap.className = 'dcap';
    var ctl = document.createElement('div'); ctl.className = 'dctl';
    var btn = document.createElement('button'); btn.type = 'button';
    var all = document.createElement('ol'); all.className = 'sr-only'; // every step, for screen readers
    d.steps.forEach(function (s) { var li = document.createElement('li'); li.textContent = s.text; all.appendChild(li); });
    ctl.appendChild(btn); d.svg.parentNode.appendChild(cap); d.svg.parentNode.appendChild(ctl); d.svg.parentNode.appendChild(all);
    var timer = null, played = false;

    function label(replay) {
      btn.textContent = replay ? '↻ replay' : '▸ play';
      btn.setAttribute('aria-label', (replay ? 'Replay the ' : 'Play the ') + d.name);
    }
    function set(i) {
      d.svg.classList.toggle('has-on', i >= 0);
      d.steps.forEach(function (s, j) { s.els.forEach(function (e) { e.classList.toggle('on', j === i); }); });
    }
    function finish() {
      clearInterval(timer); timer = null; played = true; set(-1);
      d.steps.forEach(function (s) { if (s.bar) s.bar.setAttribute('width', s.w); });
      d.svg.classList.add('played'); cap.textContent = d.rest; label(true); btn.disabled = false;
    }
    function play() {
      if (timer) return;
      if (reduce) { finish(); return; }
      d.svg.classList.remove('played'); btn.disabled = true;
      d.steps.forEach(function (s) { if (s.bar) s.bar.setAttribute('width', 0); });
      var i = 0;
      function tick() {
        if (i >= d.steps.length) { finish(); return; }
        var s = d.steps[i]; set(i); cap.textContent = s.text;
        if (s.bar) s.bar.setAttribute('width', s.w);
        i++;
      }
      tick(); timer = setInterval(tick, 1500);
    }
    label(false);
    btn.addEventListener('click', play);
    d.svg.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse' && !played) play(); });
    d.svg.addEventListener('click', function () { if (!played) play(); });
  });
})();

// Ask this page: answers a question by quoting passages from this page. No model, no server,
// and nothing is generated. Ranking is BM25 over the page's own text plus a small alias map
// for questions that share no words with it.
(function () {
  var box = document.querySelector('.ask');
  if (!box) return;
  var input = box.querySelector('input'), out = box.querySelector('.out'), chipBox = box.querySelector('.chips');
  var $$ = function (s) { return [].slice.call(document.querySelectorAll(s)); };
  var SUGGEST = ['What did he do at GDP Labs?', 'Which project has citations?', 'Where did he study?', 'How accurate was the skin model?'];
  var WORD = /[A-Za-z0-9]+(?:\.[0-9]+)?/g;

  // ---- passages: one per paragraph, stat, timeline row or list row, with its heading
  var P = [];
  function add(el, head, named) { // named: a question about the heading should land here
    var text = (el.innerText || el.textContent).replace(/\s+/g, ' ').trim();
    if (text) P.push({ el: el, text: text, head: head, named: named !== false });
  }
  $$('.hero h1, .hero .lede, .hero .about').forEach(function (el) { add(el, 'about'); });
  $$('.card').forEach(function (c) {
    var h = c.querySelector('h3').textContent.trim();
    [].forEach.call(c.querySelectorAll('div:first-child > p:not(.venue)'), function (el) { add(el, h); });
    [].forEach.call(c.querySelectorAll('.venue, .stats div'), function (el) { add(el, h, false); });
  });
  $$('.time li, .also').forEach(function (el) { add(el, 'experience'); });
  $$('.more li').forEach(function (el) { add(el, 'more work'); });
  $$('.contact > p, .contact .mail').forEach(function (el) { add(el, 'contact'); });

  // ---- search
  var STOP = {};
  'a an and are as at be by did do does for from had has have he her him his how i in is it its me my of on or our she that the their them they this to was were what when where which who whom why will with you your much many get got can could would about into than then there'
    .split(' ').forEach(function (w) { STOP[w] = 1; });
  var ALIAS = {
    study: 'university bachelor binus', studied: 'university bachelor binus', school: 'university bachelor', education: 'university bachelor gpa', degree: 'bachelor university', college: 'university', graduate: 'bachelor university',
    faster: 'throughput latency', fast: 'throughput latency median', speed: 'throughput latency', performance: 'throughput latency', inference: 'serving sglang',
    work: 'engineer gdp labs', works: 'engineer gdp labs', job: 'engineer gdp labs', company: 'gdp labs', employer: 'gdp labs', role: 'engineer',
    publication: 'paper', publications: 'paper', published: 'paper', research: 'paper',
    reach: 'email', hire: 'email', contact: 'email', mail: 'email',
    live: 'jakarta based', located: 'jakarta based', location: 'jakarta based', country: 'jakarta',
    rag: 'retrieval', accurate: 'accuracy correctness', cite: 'citations', sources: 'citations', private: 'local', offline: 'local',
    llm: 'model', grade: 'gpa', grades: 'gpa'
  };
  function stem(w) {
    if (w.length > 5 && /ing$/.test(w)) return w.slice(0, -3);
    if (w.length > 4 && /e[ds]$/.test(w)) return w.slice(0, -2);
    if (w.length > 3 && /s$/.test(w) && !/ss$/.test(w)) return w.slice(0, -1);
    return w;
  }
  function words(s) { return (s.toLowerCase().match(WORD) || []).filter(function (w) { return !STOP[w]; }); }
  var DF = {}, AVG = 0;
  P.forEach(function (p) {
    p.t = words(p.text).map(stem);
    p.tf = {}; p.t.forEach(function (w) { p.tf[w] = (p.tf[w] || 0) + 1; });
    p.hf = {}; words(p.head).forEach(function (w) { p.hf[stem(w)] = 1; });
    Object.keys(p.tf).concat(Object.keys(p.hf).filter(function (w) { return !p.tf[w]; }))
      .forEach(function (w) { DF[w] = (DF[w] || 0) + 1; });
    AVG += p.t.length / P.length;
  });
  function idf(w) { return Math.log(1 + (P.length - DF[w] + .5) / (DF[w] + .5)); }
  function lookup(tf, q) { // exact term, else a shared prefix of four or more letters
    if (tf[q]) return [q];
    if (q.length < 4) return [];
    return Object.keys(tf).filter(function (w) { return w.length >= 4 && (w.indexOf(q) === 0 || q.indexOf(w) === 0); });
  }
  function search(question) {
    var terms = [];
    words(question).forEach(function (w) {
      terms.push([stem(w), 1]);
      if (ALIAS[w]) ALIAS[w].split(' ').forEach(function (a) { terms.push([stem(a), .8]); });
    });
    var hits = P.map(function (p) {
      var score = 0, hit = {};
      terms.forEach(function (t) {
        lookup(p.tf, t[0]).forEach(function (w) {
          var f = p.tf[w];
          score += t[1] * idf(w) * f * 2.2 / (f + 1.2 * (.6 + .4 * p.t.length / AVG));
          hit[w] = 1;
        });
        // A word from the heading counts strongly for the main paragraph, weakly for its stats.
        if (p.hf[t[0]]) score += t[1] * idf(t[0]) * (p.named ? 2 : .5);
      });
      return { p: p, score: score, hit: hit };
    }).filter(function (r) { return r.score > 0; }).sort(function (a, b) { return b.score - a.score; });
    return hits.filter(function (r) { return r.score >= hits[0].score * .35; }).slice(0, 3);
  }

  // ---- marks on the page: an outline on each cited passage, a tint on the matched words
  function clearMarks() {
    $$('.cited').forEach(function (e) { e.classList.remove('cited'); });
    if (window.CSS && CSS.highlights) CSS.highlights.delete('ask');
  }
  function mark(results) {
    clearMarks();
    var ranges = [];
    results.forEach(function (r) {
      r.p.el.classList.add('cited');
      var walk = document.createTreeWalker(r.p.el, NodeFilter.SHOW_TEXT), n, m;
      while ((n = walk.nextNode())) {
        WORD.lastIndex = 0;
        while ((m = WORD.exec(n.data))) {
          if (!r.hit[stem(m[0].toLowerCase())]) continue;
          var g = document.createRange(); g.setStart(n, m.index); g.setEnd(n, m.index + m[0].length); ranges.push(g);
        }
      }
    });
    if (window.CSS && CSS.highlights && window.Highlight && ranges.length) {
      var h = new Highlight(); ranges.forEach(function (g) { h.add(g); }); CSS.highlights.set('ask', h);
    }
  }

  // ---- rendering
  var back = null;
  function dropBack() { if (back) { back.remove(); back = null; } }
  function goTo(r) {
    var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    r.p.el.scrollIntoView({ block: 'center', behavior: calm ? 'auto' : 'smooth' });
    if (!matchMedia('(max-width: 720px)').matches || back) return;
    back = document.createElement('button'); back.type = 'button'; back.className = 'ask-back'; back.textContent = '↑ back to answer';
    back.onclick = function () { box.scrollIntoView({ block: 'center', behavior: calm ? 'auto' : 'smooth' }); dropBack(); };
    document.body.appendChild(back);
  }
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function active() {
    var on = box.contains(document.activeElement) || box.classList.contains('has-answer');
    document.dispatchEvent(new CustomEvent('ask:active', { detail: on })); // hero.js pauses the heatmap
  }
  function run(q) {
    input.value = q; out.innerHTML = ''; dropBack();
    box.classList.remove('has-answer', 'no-match');
    var results = q.trim() ? search(q) : [];
    if (!results.length) {
      clearMarks();
      if (q.trim()) {
        box.classList.add('no-match');
        out.innerHTML = '<p class="none">Nothing on this page answers that. It only quotes what is written here.</p>';
      }
      active(); return;
    }
    var p = document.createElement('p'); p.className = 'answer';
    results.forEach(function (r, i) {
      var s = document.createElement('span');
      s.innerHTML = '“' + esc(r.p.text).replace(WORD, function (w) { return r.hit[stem(w.toLowerCase())] ? '<b>' + w + '</b>' : w; }) + '” ';
      var c = document.createElement('button'); c.type = 'button'; c.className = 'cite'; c.textContent = i + 1;
      c.setAttribute('aria-label', 'Source ' + (i + 1) + ': ' + r.p.head);
      c.onclick = function () { goTo(r); };
      p.appendChild(s); p.appendChild(c); p.appendChild(document.createTextNode(' '));
    });
    var src = document.createElement('p'); src.className = 'srcs';
    src.textContent = 'Sources: ' + results.map(function (r, i) { return (i + 1) + ' ' + r.p.head; }).join(' · ');
    out.appendChild(p); out.appendChild(src);
    box.classList.add('has-answer'); mark(results); active();
  }

  SUGGEST.forEach(function (s) {
    var b = document.createElement('button'); b.type = 'button'; b.textContent = s;
    b.onclick = function () { run(s); input.focus(); };
    chipBox.appendChild(b);
  });
  input.addEventListener('input', function () { run(input.value); });
  input.addEventListener('keydown', function (e) { if (e.key === 'Escape') run(''); });
  box.addEventListener('focusin', active);
  box.addEventListener('focusout', function () { setTimeout(active); });
  document.addEventListener('keydown', function (e) { // "/" jumps to the box, unless the visitor is typing or a dialog is open
    var a = document.activeElement;
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey || /INPUT|TEXTAREA|SELECT/.test(a.tagName) || a.isContentEditable || document.querySelector('dialog[open]')) return;
    e.preventDefault(); input.focus();
  });
  window.askThisPage = search; // for tuning the ranking from the console
})();
