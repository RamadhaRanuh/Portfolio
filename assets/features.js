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
