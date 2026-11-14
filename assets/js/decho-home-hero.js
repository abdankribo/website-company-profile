/* Hero beranda: skala panggung 1920x1080, kolase foto bergerak, partikel, motto ID/EN.
   Teks motto ada di MOTTO, kecepatan loop di IN / HOLD / OUT, kecepatan baris di data-dur pada HTML. */

(function () {
  'use strict';

  var hero = document.getElementById('beranda');
  if (!hero || !hero.classList.contains('dh-hero')) return;

  hero.classList.add('dh-init');                 // entrance aktif hanya bila JS berjalan (fallback: tanpa kelas ini hero tampil penuh)

  var COLLAGE = 'assets/images/decho-hero-collage.jpg';
  var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // Skala panggung
  var lastW = 0, lastH = 0;

  function fit(force) {
    var w = hero.clientWidth;
    // di beranda hero ada di paling atas (navbar tidak ikut alur halaman)
    var top = document.documentElement.classList.contains('dh-home') ? 0 : hero.getBoundingClientRect().top + (window.pageYOffset || 0);
    var availH = Math.max(420, window.innerHeight - top);

    // Di ponsel, bilah alamat yang menyusut saat scroll mengubah innerHeight;
    // abaikan perubahan kecil agar hero tidak "melompat".
    if (!force && w === lastW && Math.abs(availH - lastH) < 150) return;
    lastW = w; lastH = availH;

    var s, h;
    if (w < 700 || w / availH < 1) {
      h = Math.max(520, availH);
      s = h / 1080;
    } else {
      s = w / 1920;
      var full = 1080 * s;
      // layar lebih tinggi dari 16:9: hero diperpanjang (maks. 16%) dan sisanya
      // menjadi kelanjutan bar bawah; layar lebih pendek: bagian bawah dipotong
      h = availH >= full ? Math.min(availH, full * 1.16) : Math.max(availH, full * 0.82);
    }
    hero.classList.toggle('dh-crop', h < 1080 * s - 1);
    hero.style.setProperty('--dh-gap', Math.max(0, h - 1080 * s).toFixed(1) + 'px');
    hero.style.setProperty('--dh-s', s.toFixed(5));
    hero.style.setProperty('--dh-ox', '0px');
    hero.style.height = Math.round(h) + 'px';
  }
  fit(true);

  var resizeTimer = 0;
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () { fit(false); }, 60);
  });
  window.addEventListener('orientationchange', function () {
    window.setTimeout(function () { fit(true); }, 200);
  });
  window.addEventListener('load', function () { fit(true); });

  // Kolase foto
  var TILES = [
    [0, 0, 228, 385], [228, 0, 274, 385], [0, 385, 228, 370], [228, 385, 274, 370],
    [0, 755, 228, 325], [228, 755, 274, 325],
    [502, 0, 748, 320], [502, 320, 748, 408], [502, 728, 336, 352], [838, 728, 412, 352],
    [1250, 0, 670, 415], [1250, 415, 670, 313], [1250, 728, 670, 352]
  ];

  var rows = Array.prototype.slice.call(hero.querySelectorAll('.dh-cs'));
  rows.forEach(function (row) {
    var track = document.createElement('div');
    track.className = 'dh-ct' + (row.getAttribute('data-up') === '1' ? '' : ' dh-rev');
    track.style.setProperty('--dur', row.getAttribute('data-dur') + 's');

    for (var k = 0; k < 2; k++) {              // dua salinan = loop mulus
      var ph = document.createElement('div');
      ph.className = 'dh-ph';
      ph.style.marginLeft = '-' + row.getAttribute('data-x') + 'px';

      var img = new Image();
      img.alt = '';
      img.draggable = false;
      img.decoding = 'async';
      img.loading = 'eager';                    // hero tidak boleh lazy-load
      img.src = COLLAGE;
      ph.appendChild(img);

      TILES.forEach(function (t) {
        var g = document.createElement('i');
        g.className = 'dh-tg';
        g.style.cssText = 'left:' + t[0] + 'px;top:' + t[1] + 'px;width:' + t[2] + 'px;height:' + t[3] + 'px';
        ph.appendChild(g);
      });
      track.appendChild(ph);
    }
    row.appendChild(track);
  });

  // Partikel panel kiri + parallax
  var orbsBox = hero.querySelector('.dh-orbs');
  var orbEls = [];

  if (orbsBox) {
    for (var i = 0; i < 26; i++) {
      var d = document.createElement('i');
      var size = 6 + Math.random() * 16;
      d.style.cssText =
        'background:rgba(255,255,255,' + (0.12 + Math.random() * 0.3).toFixed(2) + ');' +
        'width:' + size.toFixed(1) + 'px;height:' + size.toFixed(1) + 'px;' +
        'left:' + (Math.random() * 600).toFixed(0) + 'px;top:' + (Math.random() * 1080).toFixed(0) + 'px';
      d.setAttribute('data-v', (Math.random() * 60 + 15).toFixed(0));
      orbsBox.appendChild(d);
      orbEls.push(d);
    }
  }

  if (!reduced && orbEls.length && window.matchMedia('(pointer: fine)').matches) {
    var px = 0, py = 0, raf = 0;
    hero.addEventListener('mousemove', function (e) {
      px = e.clientX / window.innerWidth - 0.5;
      py = e.clientY / window.innerHeight - 0.5;
      if (raf) return;
      raf = window.requestAnimationFrame(function () {
        raf = 0;
        orbEls.forEach(function (o) {
          var v = +o.getAttribute('data-v');
          o.style.translate = (px * v).toFixed(1) + 'px ' + (py * v).toFixed(1) + 'px';
        });
      });
    }, { passive: true });
  }

  // Motto — dwibahasa, mengikuti toggle bahasa situs (language.js)
  var MOTTO = {
    id: [['Ini', 'Tentang'], ['Kami,'], ['Ini', 'tentang'], ['Kepercayaan.']],
    en: [['It’s', 'About'], ['Us,'], ['It’s', 'About'], ['Trust.']]
  };
  var SHINE_LINES = { 1: true, 3: true };

  function currentLang() {
    // sama dengan language.js: nilai tersimpan di 'decho-language'
    try { return window.localStorage.getItem('decho-language') === 'en' ? 'en' : 'id'; }
    catch (e) { return 'id'; }
  }

  var motto = document.getElementById('dhMotto');
  var bar = document.getElementById('dhMbar');

  function buildMotto(lang) {
    if (!motto) return;
    var lines = MOTTO[lang] || MOTTO.id, n = 0, html = '';
    lines.forEach(function (words, li) {
      words.forEach(function (w, wi) {
        html += '<span class="dh-mw' + (SHINE_LINES[li] ? ' dh-shine' : '') + '" style="--i:' + (n++) + '"><span>' + w + '</span></span>';
        if (wi < words.length - 1) html += ' ';
      });
      if (li < lines.length - 1) html += '<br>';
    });
    motto.innerHTML = html;
  }
  buildMotto(currentLang());


  // Petunjuk gulir
  var cue = hero.querySelector('.dh-scroll');
  if (cue) {
    cue.firstChild.textContent = currentLang() === 'en' ? 'Scroll to explore' : 'Gulir untuk menjelajah';
    cue.addEventListener('click', function () {
      var next = hero.nextElementSibling;
      while (next && next.tagName === 'SCRIPT') next = next.nextElementSibling;
      if (next) next.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  // Menu overlay dan navbar situs
  var root = document.documentElement;
  var menu = document.getElementById('dhMenu');
  var menuBtn = document.getElementById('dhMenuBtn');
  var langBtn = document.getElementById('dhLang');
  var closeBtn = document.getElementById('dhMenuClose');
  var lang = currentLang();

  if (menu && menuBtn) {
    document.body.appendChild(menu);           // di luar hero agar tidak tertimpa navbar
    closeBtn.setAttribute('aria-label', lang === 'en' ? 'Close menu' : 'Tutup menu');
    if (langBtn) langBtn.textContent = lang === 'en' ? 'ID' : 'EN';

    var links = Array.prototype.slice.call(menu.querySelectorAll('a, button'));
    var setMenu = function (open) {
      menu.classList.toggle('dh-open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.setAttribute('aria-hidden', open ? 'false' : 'true');
      root.style.overflow = open ? 'hidden' : '';
      if (open) links[0].focus(); else menuBtn.focus();
    };
    menu.setAttribute('aria-hidden', 'true');
    menuBtn.addEventListener('click', function () { setMenu(true); });
    closeBtn.addEventListener('click', function () { setMenu(false); });
    menu.addEventListener('click', function (e) { if (e.target === menu) setMenu(false); });
    menu.querySelector('nav').addEventListener('click', function (e) {
      if (e.target.tagName === 'A') root.style.overflow = '';
    });
    document.addEventListener('keydown', function (e) {
      if (!menu.classList.contains('dh-open')) return;
      if (e.key === 'Escape') { setMenu(false); return; }
      if (e.key === 'Tab') {                      // fokus tetap di dalam menu
        var first = links[0], last = links[links.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    if (langBtn) langBtn.addEventListener('click', function () {
      var t = document.getElementById('langToggle');   // dikelola language.js
      if (t) t.click();
    });
  }

  // Navbar situs muncul setelah hero terlewati
  if (root.classList.contains('dh-home')) {
    var navTick = 0;
    var navState = function () {
      navTick = 0;
      root.classList.toggle('dh-nav-on', (window.pageYOffset || 0) > hero.offsetHeight - 160);
    };
    window.addEventListener('scroll', function () {
      if (!navTick) navTick = window.requestAnimationFrame(navState);
    }, { passive: true });
    navState();
  }

  var IN = 2000, HOLD = 6500, OUT = 900;        // atur kecepatan loop motto (ms)

  function cycle() {
    if (!motto || !bar) return;
    motto.classList.remove('dh-out', 'dh-reset');
    void motto.offsetWidth;
    motto.classList.add('dh-in');

    bar.style.transition = 'none';
    bar.style.width = '0';
    void bar.offsetWidth;
    bar.style.transition = 'width ' + (IN + HOLD) + 'ms linear';
    bar.style.width = '100%';

    window.setTimeout(function () {
      motto.classList.remove('dh-in');
      motto.classList.add('dh-out');
      window.setTimeout(function () {
        motto.classList.remove('dh-out');
        motto.classList.add('dh-reset');
        window.setTimeout(cycle, 150);
      }, OUT);
    }, IN + HOLD);
  }

  // Mulai entrance: setelah kolase siap (maks. 1,8 dtk), tidak menunggu seluruh halaman selesai dimuat.
  var started = false;
  function start() {
    if (started) return;
    started = true;
    window.requestAnimationFrame(function () {
      hero.classList.add('dh-ready');            // semua elemen mengikuti token di decho-home-hero.css
      var headingDelay = parseFloat(getComputedStyle(hero).getPropertyValue('--dh-content')) * 1000 || 550;
      if (reduced) {
        if (motto) motto.classList.add('dh-in');
        if (bar) bar.style.width = '100%';
      } else {
        window.setTimeout(cycle, headingDelay);  // heading = elemen pertama kelompok konten
      }
    });
  }
  var lead = rows[0] && rows[0].querySelector('img');
  if (lead && lead.decode) {
    Promise.race([lead.decode().catch(function () {}), new Promise(function (r) { window.setTimeout(r, 1800); })]).then(start);
  } else {
    window.addEventListener('load', start);
  }
  window.setTimeout(start, 2500);                // jaring pengaman: hero tidak boleh tertahan tersembunyi

  // Hemat daya — jeda saat hero keluar dari layar
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      var visible = entries[0].isIntersecting;
      hero.classList.toggle('dh-offscreen', !visible);
    }, { threshold: 0 }).observe(hero);
  }
})();
