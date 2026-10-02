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

// More work as cards: the list stays; a toggle under it opens a horizontal shelf of compact
// cards. Not remembered between visits.
(function () {
  var btn = document.querySelector('.mtoggle'), wrap = document.getElementById('more-cards');
  if (!btn || !wrap) return;
  var shelf = wrap.querySelector('.shelf'), prev = wrap.querySelector('.prev'), next = wrap.querySelector('.next');
  function edges() {
    var end = shelf.scrollLeft + shelf.clientWidth >= shelf.scrollWidth - 2;
    prev.hidden = shelf.scrollLeft <= 2; next.hidden = end;
    shelf.classList.toggle('at-end', end);
  }
  function set(on) {
    wrap.hidden = !on; btn.setAttribute('aria-expanded', String(on));
    btn.textContent = on ? '× hide the cards' : '→ all 7 as cards';
    if (on) edges();
  }
  function step(dir) { // one card at a time
    var card = shelf.querySelector('.wcard'), gap = parseFloat(getComputedStyle(shelf).columnGap) || 0;
    shelf.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
  btn.addEventListener('click', function () { set(wrap.hidden); });
  prev.addEventListener('click', function () { step(-1); });
  next.addEventListener('click', function () { step(1); });
  shelf.addEventListener('scroll', edges, { passive: true });
  addEventListener('resize', function () { if (!wrap.hidden) edges(); });
  document.addEventListener('shelf:open', function () { if (wrap.hidden) set(true); }); // Ask opens it to show a cited card
})();

// Ask this page: no model, no server. A question first tries the answers Rama wrote ahead of
// time (assets/ask.json, fetched on first focus), then quotes the page itself. Both are ranked
// with BM25 plus an alias map for questions that share no words with the page, and a question
// the page can't answer still gets the closest passages and questions it can.
(function () {
  var box = document.querySelector('.ask');
  if (!box) return;
  var input = box.querySelector('input'), out = box.querySelector('.out'), chipBox = box.querySelector('.chips');
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var SUGGEST = ['What did he do at GDP Labs?', 'Has he built AI agents?', 'How does he evaluate LLM apps?', "What's his strongest project?"];
  var T_CURATED = 2.5, T_DIRECT = 3.5; // tuned on the fixed question list
  var WORD = /[A-Za-z0-9]+(?:\.[0-9]+)?/g;
  var STOP = {}, ALIAS = {}, CURATED = [];
  ("a an and are as at be by did do does for from had has have he her him his how i in is it its me my of on or our she that the their them they this to was were what when where which who whom why will with you your much many get got can could would about into than then there any rama ranuh he's whats what's should first look")
    .split(' ').forEach(function (w) { STOP[w] = 1; });
  function stem(w) {
    if (w.length > 5 && /ing$/.test(w)) return w.slice(0, -3);
    if (w.length > 4 && /e[ds]$/.test(w)) return w.slice(0, -2);
    if (w.length > 3 && /s$/.test(w) && !/ss$/.test(w)) return w.slice(0, -1);
    return w;
  }
  function words(s) { return (s.toLowerCase().match(WORD) || []).filter(function (w) { return !STOP[w]; }); }
  function terms(q) {
    var t = [];
    words(q).forEach(function (w) {
      t.push([stem(w), 1]);
      if (ALIAS[w]) ALIAS[w].split(' ').forEach(function (a) { t.push([stem(a), .8]); });
    });
    return t;
  }

  // ---- one BM25 index, used for page passages and for the curated questions
  function index(docs) { // docs: [{text, head, named}]
    var DF = {}, AVG = 0;
    docs.forEach(function (d) {
      d.t = words(d.text).map(stem);
      d.tf = {}; d.t.forEach(function (w) { d.tf[w] = (d.tf[w] || 0) + 1; });
      d.hf = {}; words(d.head || '').forEach(function (w) { d.hf[stem(w)] = 1; });
      Object.keys(d.tf).concat(Object.keys(d.hf).filter(function (w) { return !d.tf[w]; }))
        .forEach(function (w) { DF[w] = (DF[w] || 0) + 1; });
      AVG += d.t.length / docs.length;
    });
    function idf(w) { return Math.log(1 + (docs.length - DF[w] + .5) / (DF[w] + .5)); }
    function lookup(tf, q) { // exact term, else a shared prefix of four or more letters
      if (tf[q]) return [q];
      if (q.length < 4) return [];
      return Object.keys(tf).filter(function (w) { return w.length >= 4 && (w.indexOf(q) === 0 || q.indexOf(w) === 0); });
    }
    return function (q) {
      var tt = terms(q);
      return docs.map(function (d) {
        var score = 0, hit = {};
        tt.forEach(function (t) {
          lookup(d.tf, t[0]).forEach(function (w) {
            if (hit[w] === t) return; // a word counts once per query term
            var f = d.tf[w];
            score += t[1] * idf(w) * f * 2.2 / (f + 1.2 * (.6 + .4 * d.t.length / AVG));
            hit[w] = t;
          });
          // A word from the heading counts strongly for the main paragraph, weakly for its stats.
          if (d.hf[t[0]]) score += t[1] * idf(t[0]) * (d.named === false ? .5 : 2);
        });
        return { d: d, score: score, hit: hit };
      }).filter(function (r) { return r.score > 0; }).sort(function (a, b) { return b.score - a.score; });
    };
  }

  // ---- passages: one per paragraph, stat, timeline row, list row or shelf card, with its heading
  var P = [];
  function add(el, head, named) { // named: a question about the heading should land here
    var text = (el.innerText || el.textContent).replace(/\s+/g, ' ').trim();
    if (text) P.push({ el: el, text: text, head: head, named: named !== false });
  }
  $$('.hero h1, .hero .lede, .hero .about').forEach(function (el) { add(el, 'about'); });
  $$('.card').forEach(function (c) {
    var h = c.querySelector('h3').textContent.trim();
    $$('div:first-child > p:not(.venue)', c).forEach(function (el) { add(el, h); });
    $$('.venue, .stats div', c).forEach(function (el) { add(el, h, false); });
  });
  $$('.time li, .also').forEach(function (el) { add(el, 'experience'); });
  $$('.more li, .wcard p').forEach(function (el) { add(el, 'more work'); });
  $$('.contact > p, .contact .mail').forEach(function (el) { add(el, 'contact'); });
  var searchP = index(P), searchC = function () { return []; };

  // ---- curated answers, loaded once; a question asked before they arrive waits for them
  var loading = null;
  function load() {
    if (!loading) loading = fetch('assets/ask.json').then(function (r) { return r.json(); }).then(function (data) {
      ALIAS = data.alias || {};
      CURATED = data.curated.map(function (c) {
        var cites = c.cite.map(function (s) { return P.filter(function (p) { return p.text.indexOf(s) >= 0; })[0]; }).filter(Boolean);
        return { c: c, text: c.q + ' ' + c.also + ' ' + c.also + ' ' + c.a, cites: cites };
      });
      searchC = index(CURATED);
    }).catch(function () {}); // without the file, the box still quotes the page
    return loading;
  }
  function answer(q) {
    var cur = searchC(q), pas = searchP(q), top = pas.length ? pas[0].score : 0;
    var quotes = pas.filter(function (r) { return r.score >= top * .35; }).slice(0, 3);
    // A curated answer wins unless the page itself matches far better (a question about one card).
    if (cur.length && cur[0].score >= T_CURATED && top < cur[0].score * 2) return { kind: 'curated', cur: cur, top: top };
    if (top >= T_DIRECT) return { kind: 'quotes', quotes: quotes, cur: cur, top: top };
    return { kind: 'fallback', quotes: pas.slice(0, 2), cur: cur, top: top };
  }

  // ---- marks on the page: an outline on each cited passage, a tint on the matched words
  function clearMarks() {
    $$('.cited').forEach(function (e) { e.classList.remove('cited'); });
    if (window.CSS && CSS.highlights) CSS.highlights.delete('ask');
  }
  function mark(cited) { // cited: [{d, hit}]
    clearMarks();
    var ranges = [];
    cited.forEach(function (r) {
      r.d.el.classList.add('cited');
      var walk = document.createTreeWalker(r.d.el, NodeFilter.SHOW_TEXT), n, m;
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
  function goTo(p) {
    var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (p.el.closest('[hidden]')) document.dispatchEvent(new CustomEvent('shelf:open')); // a card on the closed shelf
    document.dispatchEvent(new CustomEvent('ask:reveal', { detail: p.el })); // motion.js shows it without its rise-in
    p.el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: calm ? 'auto' : 'smooth' });
    if (!matchMedia('(max-width: 720px)').matches || back) return;
    back = document.createElement('button'); back.type = 'button'; back.className = 'ask-back'; back.textContent = '↑ back to answer';
    back.onclick = function () { box.scrollIntoView({ block: 'center', behavior: calm ? 'auto' : 'smooth' }); dropBack(); };
    document.body.appendChild(back);
  }
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function quote(r) {
    return '“' + esc(r.d.text).replace(WORD, function (w) { return r.hit[stem(w.toLowerCase())] ? '<b>' + w + '</b>' : w; }) + '” ';
  }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }
  function chip(text, parent) {
    var b = el('button', '', text); b.type = 'button';
    b.onclick = function () { ask(text); input.focus(); };
    parent.appendChild(b);
  }
  function active() {
    var on = box.contains(document.activeElement) || box.classList.contains('has-answer');
    document.dispatchEvent(new CustomEvent('ask:active', { detail: on })); // hero.js pauses the heatmap
  }

  function render(q) {
    out.innerHTML = ''; dropBack();
    box.classList.remove('has-answer', 'no-match');
    if (!q.trim()) { clearMarks(); active(); return; }
    var r = answer(q), cited = [];
    function cite(c, parent) { // c: {d, hit}; one number per passage across the whole answer
      var k = 0; while (k < cited.length && cited[k].d !== c.d) k++;
      if (k === cited.length) cited.push(c);
      var b = el('button', 'cite', String(k + 1)); b.type = 'button';
      b.setAttribute('aria-label', 'Source ' + (k + 1) + ': ' + c.d.head);
      b.onclick = function () { goTo(c.d); };
      parent.appendChild(b); parent.appendChild(document.createTextNode(' '));
    }

    if (r.kind === 'curated') {
      var c = r.cur[0].d, m = el('p', 'matched', 'Answering: ');
      m.appendChild(el('b', '', c.c.q)); out.appendChild(m);
      var p = el('p', 'answer curated', c.c.a + ' ');
      c.cites.forEach(function (d) { cite({ d: d, hit: {} }, p); });
      out.appendChild(p);
      out.appendChild(el('p', 'by', "Rama's answer, written ahead of time"));
      var alt = r.cur.slice(1, 3).filter(function (x) { return x.score >= T_CURATED * .5; });
      if (alt.length) {
        var nq = el('div', 'chips alt'); nq.appendChild(el('span', 'lbl', 'Not quite? '));
        alt.forEach(function (x) { chip(x.d.c.q, nq); }); out.appendChild(nq);
      }
    } else {
      if (r.kind === 'fallback') {
        box.classList.add('no-match');
        out.appendChild(el('p', 'none', r.quotes.length ? "This page doesn't answer that directly. The closest it gets:" : "This page doesn't cover that. Try one of these, or email me:"));
      }
      if (r.quotes.length) {
        var qp = el('p', 'answer' + (r.kind === 'fallback' ? ' weak' : ''));
        r.quotes.forEach(function (x) { var s = el('span'); s.innerHTML = quote(x); qp.appendChild(s); cite(x, qp); });
        out.appendChild(qp);
      }
      if (r.kind === 'fallback') { // closest curated questions first, then the suggestions
        var tries = el('div', 'chips alt'), picks = r.cur.slice(0, 3).map(function (x) { return x.d.c.q; });
        SUGGEST.forEach(function (s) { if (picks.length < 4 && picks.indexOf(s) < 0) picks.push(s); });
        picks.forEach(function (s) { chip(s, tries); }); out.appendChild(tries);
      }
    }
    if (cited.length) out.appendChild(el('p', 'srcs', 'Sources: ' + cited.map(function (c, k) { return (k + 1) + ' ' + c.d.head; }).join(' · ')));
    if (r.kind !== 'fallback') box.classList.add('has-answer');
    mark(cited); active();
  }
  var asked = 0;
  function ask(q) {
    input.value = q;
    var n = ++asked;
    load().then(function () { if (n === asked) render(q); }); // a newer question wins
  }

  SUGGEST.forEach(function (s) { chip(s, chipBox); });
  var timer;
  input.addEventListener('input', function () { // wait for a pause in typing, so half a question never shows a miss
    clearTimeout(timer);
    timer = setTimeout(function () { ask(input.value); }, 250);
  });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { clearTimeout(timer); ask(''); }
    if (e.key === 'Enter') { clearTimeout(timer); ask(input.value); }
  });
  box.addEventListener('focusin', function () { load(); active(); });
  box.addEventListener('focusout', function () { setTimeout(active); });
  document.addEventListener('keydown', function (e) { // "/" jumps to the box, unless the visitor is typing or a dialog is open
    var a = document.activeElement;
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey || /INPUT|TEXTAREA|SELECT/.test(a.tagName) || a.isContentEditable || document.querySelector('dialog[open]')) return;
    e.preventDefault(); input.focus();
  });
  window.askThisPage = function (q) { return load().then(function () { return answer(q); }); }; // for tuning from the console
})();
