/* Arsip proyek berbentuk lemari: laci (kategori) -> folder (lokasi) -> file (proyek). */
(function () {
  'use strict';

  var cab = document.getElementById('arCabinet');
  if (!cab) return;

  var root = document.documentElement;
  var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var lang = 'id';
  try { lang = window.localStorage.getItem('decho-language') === 'en' ? 'en' : 'id'; } catch (e) {}

  var drawers = Array.prototype.slice.call(cab.querySelectorAll('.cb-drawer'));
  var crumbs = document.getElementById('cbCrumbs');
  var closeAll = document.getElementById('cbCloseAll');
  var TXT = {
    root: { id: 'Arsip', en: 'Archive' },
    hint: { id: 'Pilih laci untuk membuka arsip', en: 'Choose a drawer to open the archive' },
    pick: { id: 'Pilih folder', en: 'Choose a folder' }
  };

  root.classList.add('ar-js');

  var nav = document.querySelector('.navbar');
  function setSticky() { if (nav) root.style.setProperty('--ar-sticky', nav.offsetHeight + 'px'); }
  setSticky();
  window.addEventListener('resize', setSticky);

  function nm(el) { return el.getAttribute('data-n-' + lang) || el.getAttribute('data-n-id') || ''; }
  function front(d) { return d.querySelector('.cb-front'); }
  function folders(d) { return Array.prototype.slice.call(d.querySelectorAll('.cb-folder')); }
  function tabOf(f) { return document.getElementById(f.getAttribute('data-tab')); }
  function openFolder(d) { return folders(d).filter(function (f) { return f.classList.contains('is-open'); })[0] || null; }
  function openDrawer() { return drawers.filter(function (x) { return x.classList.contains('is-open'); })[0] || null; }

  function renderCrumbs() {
    if (!crumbs) return;
    var d = openDrawer();
    var items = [TXT.root[lang]];
    if (!d) items.push(TXT.hint[lang]);
    else {
      items.push(nm(d));
      var f = openFolder(d);
      items.push(f ? nm(f) : TXT.pick[lang]);
    }
    crumbs.innerHTML = '';
    items.forEach(function (t) {
      var li = document.createElement('li');
      li.textContent = t;
      crumbs.appendChild(li);
    });
    if (closeAll) closeAll.hidden = !d;
  }

  function setFolder(d, f, open) {
    folders(d).forEach(function (x) {
      var on = open && x === f;
      x.classList.toggle('is-open', on);
      tabOf(x).setAttribute('aria-expanded', on ? 'true' : 'false');
    });
    d.classList.toggle('has-open', !!(open && f));
    renderCrumbs();
  }

  function setDrawer(d, open) {
    drawers.forEach(function (x) {
      if (open && x === d) return;
      if (!x.classList.contains('is-open')) return;
      x.classList.remove('is-open', 'has-open');
      front(x).setAttribute('aria-expanded', 'false');
      folders(x).forEach(function (f) { f.classList.remove('is-open'); tabOf(f).setAttribute('aria-expanded', 'false'); });
    });
    if (open && d) {
      d.classList.add('is-open');
      front(d).setAttribute('aria-expanded', 'true');
      Array.prototype.forEach.call(d.querySelectorAll('img[loading="lazy"]'), function (i) { i.loading = 'eager'; });
      var fs = folders(d);
      if (fs.length === 1) setFolder(d, fs[0], true);       // satu folder: langsung terbuka
      var top = front(d).getBoundingClientRect().top;
      if (top < 140 || top > window.innerHeight * 0.55) {
        window.setTimeout(function () { front(d).scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); }, 60);
      }
    }
    renderCrumbs();
  }

  drawers.forEach(function (d, di) {
    var fr = front(d);
    fr.addEventListener('click', function () { setDrawer(d, !d.classList.contains('is-open')); });
    fr.addEventListener('keydown', function (e) {           // panah atas/bawah antar laci
      var n = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
      if (!n) return;
      e.preventDefault();
      front(drawers[(di + n + drawers.length) % drawers.length]).focus();
    });

    var fs = folders(d);
    fs.forEach(function (f, fi) {
      var tab = tabOf(f);
      tab.addEventListener('click', function () { setFolder(d, f, !f.classList.contains('is-open')); });
      tab.addEventListener('keydown', function (e) {        // panah kiri/kanan antar folder
        var n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!n) return;
        e.preventDefault();
        tabOf(fs[(fi + n + fs.length) % fs.length]).focus();
      });
    });
  });

  // Esc menutup tingkat terdalam: folder dulu, lalu laci
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var modal = document.getElementById('pd-modal');
    if (modal && modal.classList.contains('is-open')) return;
    var d = openDrawer();
    if (!d) return;
    var f = openFolder(d);
    if (f) { setFolder(d, f, false); tabOf(f).focus(); }
    else { setDrawer(d, false); front(d).focus(); }
  });

  if (closeAll) closeAll.addEventListener('click', function () {
    var d = openDrawer();
    setDrawer(null, false);
    if (d) front(d).focus();
  });

  // Reveal lemari saat scroll
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    drawers.forEach(function (d, i) { d.style.transitionDelay = (i * 0.1) + 's'; io.observe(d); });
  } else {
    drawers.forEach(function (d) { d.classList.add('is-in'); });
  }

  renderCrumbs();
})();
