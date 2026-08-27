/* Gallery lightbox. Progressive enhancement: the markup ships as plain
   figures, and this turns each plate into a button that opens the image
   full size. With JS off nothing is promised and nothing breaks. */
(function () {
  var gallery = document.querySelector('.gallery');
  if (!gallery || typeof HTMLDialogElement === 'undefined') return;

  // Figures that already link somewhere (the live-site links) keep that
  // click. A plate can do one thing or the other, not both.
  var plates = [].filter.call(
    gallery.querySelectorAll('figure > .plate'),
    function (plate) { return !plate.closest('.figlink'); }
  );
  if (!plates.length) return;

  function arrow(dir, label, path) {
    return '<button class="lightbox-step lightbox-' + dir + '" type="button" ' +
      'aria-label="' + label + '">' +
      '<svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
        '<path d="' + path + '" stroke="currentColor" stroke-width="1.7" ' +
        'stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg></button>';
  }

  var dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.innerHTML =
    '<button class="lightbox-close label" type="button" aria-label="Close">Close' +
      '<svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
        '<path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
      '</svg>' +
    '</button>' +
    '<figure class="lightbox-fig">' +
      '<img alt="">' +
      '<figcaption class="label"></figcaption>' +
    '</figure>' +
    arrow('prev', 'Previous image', 'M10 3L5 8l5 5') +
    arrow('next', 'Next image', 'M6 3l5 5-5 5');
  document.body.appendChild(dialog);

  var full = dialog.querySelector('img');
  var cap = dialog.querySelector('figcaption');
  var steps = dialog.querySelectorAll('.lightbox-step');
  var current = 0;

  // One image has nothing to step to.
  if (plates.length < 2) {
    [].forEach.call(steps, function (step) { step.remove(); });
  }

  function show(index) {
    current = (index + plates.length) % plates.length;
    var plate = plates[current];
    var img = plate.querySelector('img');
    var caption = plate.closest('figure').querySelector('figcaption');
    full.src = img.currentSrc || img.src;
    full.alt = img.alt;
    // Marks are drawn small on a plate; photographs fill the frame.
    dialog.classList.toggle('is-mark', !plate.classList.contains('shot'));
    cap.textContent = caption ? caption.textContent.trim() : '';
    cap.hidden = !cap.textContent;
  }

  function open(index) {
    show(index);
    dialog.showModal();
    document.documentElement.classList.add('lightbox-open');
  }

  function step(delta) {
    show(current + delta);
  }

  plates.forEach(function (plate, index) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'plate-button';
    var img = plate.querySelector('img');
    button.setAttribute('aria-label', 'Expand: ' + (img ? img.alt : 'image'));
    plate.parentNode.insertBefore(button, plate);
    button.appendChild(plate);
    button.addEventListener('click', function () { open(index); });
  });

  dialog.querySelector('.lightbox-close').addEventListener('click', function () {
    dialog.close();
  });

  if (plates.length > 1) {
    dialog.querySelector('.lightbox-prev')
      .addEventListener('click', function () { step(-1); });
    dialog.querySelector('.lightbox-next')
      .addEventListener('click', function () { step(1); });
    dialog.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
    });
  }

  // Clicking the surround closes; the image and the controls do not.
  dialog.addEventListener('click', function (event) {
    if (!event.target.closest('.lightbox-fig, .lightbox-close, .lightbox-step')) {
      dialog.close();
    }
  });

  dialog.addEventListener('close', function () {
    document.documentElement.classList.remove('lightbox-open');
    full.removeAttribute('src');
  });
})();
