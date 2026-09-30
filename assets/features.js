// Screenshot lightbox: the Local Notebook screenshot opens full size in a native dialog.
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
  var svgs = [].slice.call(document.querySelectorAll('.card .media > svg')); // chart, pipeline, stacks
  if (svgs.length !== 3) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function boxes(svg, texts) { // each box is a rect followed by its label
    return [].slice.call(svg.querySelectorAll('rect')).map(function (r, i) {
      return { els: [r, r.nextElementSibling], text: texts[i] };
    });
  }
  var TRAIN = [97.43, 98.77, 100, 93.8, 100], TEST = [97.56, 89.74, 87.18, 87.18, 79.49];
  var NAMES = ['YOLO', 'InceptionResNetV2', 'DenseNet201', 'GoogLeNet', 'MobileNet'];
  var chart = [].slice.call(svgs[0].querySelectorAll('rect:not(.bar-bg)')).map(function (bar, i) {
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
    { svg: svgs[0], steps: chart, name: 'accuracy comparison',
      rest: 'Lines mark training accuracy. The further a bar stops short of its line, the more the model overfit.' },
    { svg: svgs[1], name: 'pipeline walkthrough', rest: 'Index once, then retrieve and answer per question.',
      steps: boxes(svgs[1], [
        'Five volumes of the Gale Encyclopedia of Medicine, as PDFs.',
        'Pages are split into chunks, and each chunk is turned into a vector.',
        'The vectors are stored once in ChromaDB, on disk.',
        'A medical question comes in from the chat UI.',
        'The chunks closest to the question are fetched from the store.',
        'A local GGUF model writes the answer from those chunks, streamed token by token.'
      ]) },
    { svg: svgs[2], name: 'architecture walkthrough', rest: 'Two stacks, written block by block in PyTorch.',
      steps: boxes(svgs[2], [
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
