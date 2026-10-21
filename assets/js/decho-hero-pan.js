/* DECHO - hero panorama berjalan. Mengatur durasi agar kecepatan selalu konstan (px/detik) di semua lebar layar. */
(function () {
  var els = document.querySelectorAll('.decho-pan');
  if (!els.length) return;
  Array.prototype.forEach.call(els, function (el) {
    var track = el.querySelector('.decho-pan-track'), img = track && track.querySelector('img');
    if (!img) return;
    function calc() {
      var speed = parseFloat(el.getAttribute('data-speed')) || 45;
      var w = img.getBoundingClientRect().width;
      if (!w) return;
      if (el.getAttribute('data-mode') === 'bounce') {
        var dist = Math.max(0, w - el.clientWidth);
        el.style.setProperty('--pan-dist', dist + 'px');
        el.style.setProperty('--pan-dur', Math.max(8, dist / speed) + 's');
      } else {
        el.style.setProperty('--pan-dur', (w / speed) + 's');
      }
    }
    if (img.complete) calc(); else img.addEventListener('load', calc);
    addEventListener('resize', calc);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          el.classList.toggle('is-paused', !entry.isIntersecting);
        });
      }).observe(el);
    }
  });
})();
