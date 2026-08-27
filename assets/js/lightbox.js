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
    '</figure>';
  document.body.appendChild(dialog);

  var full = dialog.querySelector('img');
  var cap = dialog.querySelector('figcaption');

  function open(plate) {
    var img = plate.querySelector('img');
    var caption = plate.closest('figure').querySelector('figcaption');
    full.src = img.currentSrc || img.src;
    full.alt = img.alt;
    // Marks are drawn small on a plate; photographs fill the frame.
    dialog.classList.toggle('is-mark', !plate.classList.contains('shot'));
    cap.textContent = caption ? caption.textContent.trim() : '';
    cap.hidden = !cap.textContent;
    dialog.showModal();
    document.documentElement.classList.add('lightbox-open');
  }

  plates.forEach(function (plate) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'plate-button';
    var img = plate.querySelector('img');
    button.setAttribute('aria-label', 'Expand: ' + (img ? img.alt : 'image'));
    plate.parentNode.insertBefore(button, plate);
    button.appendChild(plate);
    button.addEventListener('click', function () { open(plate); });
  });

  dialog.querySelector('.lightbox-close').addEventListener('click', function () {
    dialog.close();
  });

  // Clicking the surround closes; clicking the image itself does not.
  dialog.addEventListener('click', function (event) {
    if (!event.target.closest('.lightbox-fig, .lightbox-close')) dialog.close();
  });

  dialog.addEventListener('close', function () {
    document.documentElement.classList.remove('lightbox-open');
    full.removeAttribute('src');
  });
})();
