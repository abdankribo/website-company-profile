/* Arsip proyek horizontal: tiga logo arsip -> panel proyek memanjang ke kanan logo yang dipilih. */
(function () {
  'use strict';

  var rail = document.getElementById('hxRail');
  if (!rail) return;

  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var cats = Array.prototype.slice.call(rail.querySelectorAll('.hx-cat'));
  var crumbs = document.getElementById('hxCrumbs');
  var closeBtn = document.getElementById('hxClose');
  var current = null;

  root.classList.add('hx-js');

  function lang() {
    try { return window.localStorage.getItem('decho-language') === 'en' ? 'en' : 'id'; } catch (e) { return 'id'; }
  }
  function logoOf(c) { return c.querySelector('.hx-logo'); }
  function panelOf(c) { return c.querySelector('.hx-panel'); }
  function scrollerOf(c) { return c.querySelector('.hx-scroller'); }

  /* ---------- breadcrumb ---------- */
  function renderCrumbs() {
    if (!crumbs) return;
    var L = lang();
    var items = [{ id: 'Arsip', en: 'Archive' }];
    if (current) items.push({ id: current.getAttribute('data-n-id'), en: current.getAttribute('data-n-en') });
    else items.push({ id: 'Pilih salah satu arsip untuk membukanya', en: 'Choose an archive to open it' });
    crumbs.innerHTML = '';
    items.forEach(function (t) {
      var li = document.createElement('li');
      li.setAttribute('data-id', t.id); li.setAttribute('data-en', t.en);
      li.textContent = t[L];
      crumbs.appendChild(li);
    });
    if (closeBtn) closeBtn.hidden = !current;
  }

  /* ---------- buka / tutup ---------- */
  function collapseStages(c) {
    var st = c.querySelector('.hx-stages');
    if (!st) return;
    st.classList.remove('is-open');
    var b = st.querySelector('.hx-stg-btn');
    if (b) b.setAttribute('aria-expanded', 'false');
  }

  function setOpen(target, opts) {
    opts = opts || {};
    var prev = current;
    current = target || null;

    cats.forEach(function (c) {
      var on = c === current;
      c.classList.toggle('is-open', on);
      logoOf(c).setAttribute('aria-expanded', on ? 'true' : 'false');
      var p = panelOf(c);
      if (on) { p.removeAttribute('inert'); } else { p.setAttribute('inert', ''); }
      if (!on && c === prev) collapseStages(c);
    });
    rail.classList.toggle('has-open', !!current);

    if (current) {
      Array.prototype.forEach.call(current.querySelectorAll('img[loading="lazy"]'), function (i) { i.loading = 'eager'; });
      var sc = scrollerOf(current);
      sc.scrollLeft = 0;
      window.requestAnimationFrame(function () { updateScroll(current); });
      window.setTimeout(function () { updateScroll(current); }, 900);
      if (window.matchMedia('(max-width: 640px)').matches && !opts.silent) {
        window.setTimeout(function () {
          current.scrollIntoView({ behavior: mq.matches ? 'auto' : 'smooth', block: 'nearest' });
        }, 120);
      }
    }
    renderCrumbs();

    if (!opts.silent && window.history && history.replaceState) {
      try { history.replaceState(null, '', current ? '#' + current.getAttribute('data-slug') : location.pathname + location.search); } catch (e) {}
    }
  }

  cats.forEach(function (c, i) {
    var lg = logoOf(c);
    panelOf(c).setAttribute('inert', '');
    lg.addEventListener('click', function () { setOpen(current === c ? null : c); });
    lg.addEventListener('keydown', function (e) {
      var d = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      logoOf(cats[(i + d + cats.length) % cats.length]).focus();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', function () {
    var c = current; setOpen(null); if (c) logoOf(c).focus();
  });

  // Esc: bila dialog galeri sedang terbuka, Esc hanya menutup dialog (dicek di fase capture, sebelum dialog menutup diri)
  var modalOpenAtKey = false;
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var modal = document.getElementById('pd-modal');
    modalOpenAtKey = !!(modal && modal.classList.contains('is-open'));
  }, true);
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !current || modalOpenAtKey) return;
    var c = current; setOpen(null); logoOf(c).focus();
  });

  /* ---------- tahapan pengerjaan (dirender proyek-tabs.js) ---------- */
  Array.prototype.forEach.call(rail.querySelectorAll('.hx-stg-btn'), function (b) {
    b.addEventListener('click', function () {
      var st = b.closest('.hx-stages');
      var on = !st.classList.contains('is-open');
      st.classList.toggle('is-open', on);
      b.setAttribute('aria-expanded', on ? 'true' : 'false');
    });
  });

  /* ---------- geser horizontal: tombol, progres, seret mouse ---------- */
  function updateScroll(c) {
    var sc = scrollerOf(c); if (!sc) return;
    var max = sc.scrollWidth - sc.clientWidth;
    var bar = c.querySelector('.hx-progress i');
    var prev = c.querySelector('.hx-cb[data-dir="-1"]'), next = c.querySelector('.hx-cb[data-dir="1"]');
    var ratio = sc.scrollWidth ? Math.min(1, sc.clientWidth / sc.scrollWidth) : 1;
    var pos = max > 0 ? sc.scrollLeft / max : 0;
    if (bar) {
      bar.style.width = (ratio * 100) + '%';
      bar.style.transform = 'translateX(' + (pos * (1 / ratio - 1) * 100) + '%)';
    }
    if (prev) prev.disabled = sc.scrollLeft <= 2;
    if (next) next.disabled = max <= 2 || sc.scrollLeft >= max - 2;
  }

  cats.forEach(function (c) {
    var sc = scrollerOf(c);
    sc.addEventListener('scroll', function () { updateScroll(c); }, { passive: true });
    Array.prototype.forEach.call(c.querySelectorAll('.hx-cb'), function (b) {
      b.addEventListener('click', function () {
        var step = (c.querySelector('.hx-card') || { offsetWidth: 260 }).offsetWidth + 16;
        sc.scrollBy({ left: step * parseInt(b.getAttribute('data-dir'), 10), behavior: mq.matches ? 'auto' : 'smooth' });
      });
    });

    var down = false, sx = 0, sl = 0, moved = false;
    sc.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = false; sx = e.clientX; sl = sc.scrollLeft;
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - sx;
      if (!moved && Math.abs(dx) > 5) { moved = true; sc.classList.add('is-drag'); }
      if (moved) sc.scrollLeft = sl - dx;
    });
    window.addEventListener('pointerup', function () {
      if (!down) return;
      down = false; sc.classList.remove('is-drag');
    });
    sc.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    sc.addEventListener('dragstart', function (e) { e.preventDefault(); });
    sc.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        sc.scrollBy({ left: (e.key === 'ArrowRight' ? 1 : -1) * 280, behavior: 'smooth' });
        e.preventDefault();
      }
    });
  });
  window.addEventListener('resize', function () { if (current) updateScroll(current); });

  /* ---------- muncul saat scroll ---------- */
  if ('IntersectionObserver' in window && !mq.matches) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    cats.forEach(function (c, i) { c.style.transitionDelay = ''; c.style.setProperty('--d', (i * 0.1) + 's'); io.observe(c); });
  } else {
    cats.forEach(function (c) { c.classList.add('is-in'); });
  }

  /* ---------- tautan langsung: proyek.html#moveable-bridge dst. ---------- */
  function fromHash() {
    var h = (location.hash || '').replace('#', '');
    var c = cats.filter(function (x) { return x.getAttribute('data-slug') === h; })[0];
    if (c) setOpen(c, { silent: true });
  }
  fromHash();
  window.addEventListener('hashchange', function () {
    var h = (location.hash || '').replace('#', '');
    var c = cats.filter(function (x) { return x.getAttribute('data-slug') === h; })[0];
    if (c && c !== current) setOpen(c, { silent: true });
  });

  renderCrumbs();
})();
