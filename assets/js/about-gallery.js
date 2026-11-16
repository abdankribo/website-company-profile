(function () {
  'use strict';

  var gallery = document.querySelector('.about-background-section .about-gallery');
  if (!gallery) return;

  var photos = Array.prototype.slice.call(gallery.querySelectorAll('.ph'));
  if (!photos.length) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    photos.forEach(function (photo) {
      photo.addEventListener('pointermove', function (event) {
        var bounds = photo.getBoundingClientRect();
        photo.style.setProperty('--ry', ((event.clientX - bounds.left) / bounds.width - 0.5) * 8 + 'deg');
        photo.style.setProperty('--rx', ((event.clientY - bounds.top) / bounds.height - 0.5) * -8 + 'deg');
      });
      photo.addEventListener('pointerleave', function () {
        photo.style.setProperty('--rx', '0deg');
        photo.style.setProperty('--ry', '0deg');
      });
    });
  }

  var lightbox = document.createElement('div');
  lightbox.className = 'decho-about-lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Pratinjau foto workshop');

  var closeButton = document.createElement('button');
  closeButton.className = 'close';
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', 'Tutup pratinjau foto');
  closeButton.textContent = '\u00d7';

  var previousButton = document.createElement('button');
  previousButton.className = 'previous';
  previousButton.type = 'button';
  previousButton.setAttribute('aria-label', 'Foto sebelumnya');
  previousButton.textContent = '\u2039';

  var nextButton = document.createElement('button');
  nextButton.className = 'next';
  nextButton.type = 'button';
  nextButton.setAttribute('aria-label', 'Foto berikutnya');
  nextButton.textContent = '\u203a';

  var figure = document.createElement('figure');
  var image = document.createElement('img');
  image.alt = '';
  var caption = document.createElement('figcaption');
  figure.appendChild(image);
  figure.appendChild(caption);
  lightbox.appendChild(closeButton);
  lightbox.appendChild(previousButton);
  lightbox.appendChild(figure);
  lightbox.appendChild(nextButton);
  document.documentElement.appendChild(lightbox);

  var current = 0;
  var opener = null;
  var originalOverflow = '';

  function showPhoto(index) {
    current = (index + photos.length) % photos.length;
    var source = photos[current].querySelector('img');
    image.src = source.currentSrc || source.src;
    image.alt = source.alt;
    caption.textContent = source.alt + ' (' + (current + 1) + '/' + photos.length + ')';
    previousButton.hidden = photos.length < 2;
    nextButton.hidden = photos.length < 2;
  }

  function open(index, trigger) {
    opener = trigger;
    showPhoto(index);
    originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    lightbox.hidden = false;
    lightbox.classList.add('is-open');
    closeButton.focus();
  }

  function close() {
    lightbox.classList.remove('is-open');
    lightbox.hidden = true;
    image.removeAttribute('src');
    document.body.style.overflow = originalOverflow;
    if (opener) opener.focus();
  }

  photos.forEach(function (photo, index) {
    photo.addEventListener('click', function () {
      open(index, photo);
    });
  });

  closeButton.addEventListener('click', close);
  previousButton.addEventListener('click', function () {
    showPhoto(current - 1);
  });
  nextButton.addEventListener('click', function () {
    showPhoto(current + 1);
  });
  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) close();
  });
  document.addEventListener('keydown', function (event) {
    if (lightbox.hidden) return;
    if (event.key === 'Escape') {
      close();
    } else if (event.key === 'ArrowLeft') {
      showPhoto(current - 1);
    } else if (event.key === 'ArrowRight') {
      showPhoto(current + 1);
    } else if (event.key === 'Tab') {
      var controls = [closeButton, previousButton, nextButton].filter(function (button) {
        return !button.hidden;
      });
      var first = controls[0];
      var last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
})();
