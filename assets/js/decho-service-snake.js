/* DECHO - animasi ular pada tangga layanan. Berjalan saat bagian masuk layar; tidak menambah tinggi halaman. */
(function () {
  var root = document.getElementById('decho-service-snake');
  if (!root) return;
  var $ = function (q) { return Array.prototype.slice.call(root.querySelectorAll(q)); };
  var fit = root.querySelector('.dcs-fit'), stage = root.querySelector('.dcs-stage');
  var snake = $('.dcs-snake path'), cuts = $('.dcs-cuts line'), nodes = $('.dcs-node'), cards = $('.dcs-card'), dots = $('.dcs-dot');
  var arrow = root.querySelector('.dcs-arrow'), head = root.querySelector('.dcs-head');
  var wide = window.matchMedia('(min-width:1001px)');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js');

  function size() {
    if (!wide.matches) { stage.style.transform = ''; fit.style.height = ''; return; }
    var w = fit.clientWidth; if (!w) return;
    var k = Math.min(1, w / 1152);
    stage.style.transform = 'scale(' + k + ')';
    fit.style.height = (648 * k) + 'px';
  }
  size();
  if ('ResizeObserver' in window) new ResizeObserver(size).observe(fit); else addEventListener('resize', size);
  if (wide.addEventListener) wide.addEventListener('change', size);

  var cols = ['#7b68f2', '#0a84ff', '#07c9ac', '#10dc86', '#5be12b'];
  var lens = snake.map(function (p) { return p.getTotalLength(); }), starts = [], L = 0;
  lens.forEach(function (l, i) { starts[i] = L; L += l; });
  snake.forEach(function (p, i) { p.style.strokeDasharray = lens[i] + ' ' + lens[i]; p.style.strokeDashoffset = lens[i]; });
  var th = [.8, .55, .6, .55, .5].map(function (f, i) { return starts[i] + lens[i] * f; });

  function render(p) {
    var d = p * L;
    snake.forEach(function (el, i) { el.style.strokeDashoffset = lens[i] - Math.min(lens[i], Math.max(0, d - starts[i])); });
    cuts.forEach(function (c, i) { c.style.opacity = d > starts[i] ? 1 : 0; });
    nodes.forEach(function (n, i) { n.classList.toggle('on', d >= th[i]); });
    cards.forEach(function (c, i) { var on = d >= th[i]; c.classList.toggle('on', on); dots[i].classList.toggle('on', on); });
    var s = 0; while (s < 4 && d > starts[s] + lens[s]) s++;
    var pt = snake[s].getPointAtLength(Math.min(lens[s], Math.max(0, d - starts[s])));
    head.setAttribute('cx', pt.x); head.setAttribute('cy', pt.y); head.setAttribute('fill', cols[s]);
    head.style.opacity = (d > 0 && p < .97) ? 1 : 0;
    arrow.classList.toggle('on', p >= .97);
  }

  var DUR = 3600, raf = 0, played = false;
  var ease = function (t) { return -(Math.cos(Math.PI * t) - 1) / 2; };
  function play() {
    cancelAnimationFrame(raf);
    var t0 = performance.now();
    (function tick(now) {
      var t = Math.min(1, (now - t0) / DUR);
      render(ease(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    })(t0);
  }

  if (reduce || !('IntersectionObserver' in window)) { render(1); return; }
  render(0);

  /* desktop: ular + bulatan */
  new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!wide.matches) return;
      if (e.intersectionRatio >= .35 && !played) { played = true; play(); }
      else if (e.intersectionRatio === 0 && played) { played = false; cancelAnimationFrame(raf); render(0); }
    });
  }, { threshold: [0, .35] }).observe(fit);

  /* layar kecil: kartu muncul satu per satu saat terlihat */
  var io2 = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting && !wide.matches) { e.target.classList.add('on'); io2.unobserve(e.target); } });
  }, { threshold: .2 });
  cards.forEach(function (c) { io2.observe(c); });
})();