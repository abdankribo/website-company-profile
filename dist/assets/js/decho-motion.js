/* ==========================================================================
   DECHO MOTION ENGINE — satu implementasi global untuk semua halaman.
   Tanggung jawab:
     1. Reveal berkelompok (Intersection Observer, sekali jalan, stagger per kelompok)
     2. Kursor kustom (dot + ring) dengan satu standar hover/klik
     3. Dorongan magnetis halus pada tombol utama
     4. State navbar saat scroll
     5. Transisi halaman (fade) tanpa mengubah perilaku navigasi
   Semua nilai durasi/jarak/stagger dibaca dari CSS variables di decho-motion.css.
   ========================================================================== */
(() => {
  'use strict';
  if (window.__dechoMotion) return;
  window.__dechoMotion = true;

  const doc = document.documentElement;
  const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
  const mqFine = matchMedia('(hover: hover) and (pointer: fine)');

  /* ---------- util: baca token CSS ---------- */
  const token = (name, fallback) => {
    const raw = getComputedStyle(doc).getPropertyValue(name).trim();
    if (!raw) return fallback;
    const n = parseFloat(raw);
    if (Number.isNaN(n)) return fallback;
    if (raw.endsWith('ms')) return n;
    if (raw.endsWith('s')) return n * 1000;
    return n;
  };

  /* ======================================================================
     1. REVEAL BERKELOMPOK
     Prinsip: semua elemen bergerak ke arah yang sama (naik), dengan durasi & easing sama.
     Elemen yang terlihat pada saat yang sama diurutkan sesuai posisi, lalu diberi jeda stagger.
     ====================================================================== */

  // Bagian yang sudah punya sistem animasi sendiri (hero, infografis, orbit) tidak disentuh.
  const SKIP_ROOTS = [
    '[data-dm="off"]', '#beranda', '.dh-hero', '#decho-motto-stage', '.lk-section',
    '.decho-process-section', '.decho-cycle-section', '#arsip', '.ar-archive'
  ].join(',');

  // Elemen yang dianggap satu unit (tidak dipecah lagi).
  const LEAF = 'h1,h2,h3,h4,h5,h6,p,ul,ol,dl,blockquote,figure,img,picture,form,table,a,button,label,hr';
  const BLOCK = [
    '.about-image', '.service-card', '.dm-card', '.stat', '.stat-card', '.contact-strip', '.contact-info',
    '.hero-actions', '.ar-eyebrow', '.section-kicker', '.eyebrow', 'article'
  ].join(',');
  const IGNORE = [
    'canvas', 'script', 'style', 'link', 'template', 'noscript', '.decho-wave-canvas',
    '[aria-hidden="true"]', '.decho-pan', '[data-dm="off"]', '[hidden]',
    '[class*="aurora"]', '[class*="-dots"]', '#decho-progress', '#decho-top', '.decho-lightbox'
  ].join(',');

  const collect = (root, maxDepth = 3) => {
    const items = [];
    const walk = (el, depth) => {
      for (const child of el.children) {
        if (!(child instanceof HTMLElement) || child.matches(IGNORE)) continue;
        const split = child.matches('.about-gallery, [data-dm-group]');           // kelompok: pecah jadi anak-anaknya
        const isUnit = !split && (child.matches(LEAF) || child.matches(BLOCK) || !child.firstElementChild || depth >= maxDepth);
        if (isUnit) items.push(child);
        else walk(child, depth + 1);
      }
    };
    walk(root, 0);
    return items;
  };

  const tag = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.position === 'fixed') return false;
    if (cs.animationName !== 'none' || parseFloat(cs.opacity) < 1) return false;   // jangan bentrok dengan animasi/opacity bawaan
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false;
    if (rect.bottom < 0) return false;                                           // sudah terlewati (mis. lompat anchor)
    // Baca dulu SEBELUM kelas ditambahkan (getComputedStyle bersifat live).
    const hasOwnTranslate = cs.translate && cs.translate !== 'none';
    const fadeOnly = hasOwnTranslate || cs.display === 'inline';                    // hanya fade agar posisi aslinya aman
    el.classList.add('dm-item');
    if (fadeOnly) el.classList.add('dm-fade');
    return true;
  };

  const release = (el) => {
    el.classList.remove('dm-item', 'dm-in', 'dm-fade');
    el.style.removeProperty('--dm-delay');
  };

  let io = null;
  const pending = new Set();

  const initReveal = () => {
    if (mqReduce.matches || !('IntersectionObserver' in window)) return;

    const targets = [];
    const seen = new Set();
    const add = (el) => { if (el && !seen.has(el)) { seen.add(el); targets.push(el); } };

    document.querySelectorAll('main > section, main > header, body > header.page-hero, body > section').forEach((section) => {
      if (section.matches(SKIP_ROOTS) || section.closest(SKIP_ROOTS)) return;
      collect(section).forEach(add);
    });
    document.querySelectorAll('footer').forEach((footer) => {
      if (footer.closest(SKIP_ROOTS)) return;
      footer.querySelectorAll(':scope .footer-grid > *, :scope .footer-bottom').forEach(add);
    });

    const play = (el, index) => {
      const stagger = token('--dm-stagger', 90);
      const steps = token('--dm-steps', 7);
      const dur = token('--dm-dur', 800);
      const delay = Math.min(index, steps) * stagger;
      io.unobserve(el);
      el.style.setProperty('--dm-delay', delay + 'ms');
      requestAnimationFrame(() => el.classList.add('dm-in'));
      setTimeout(() => { pending.delete(el); release(el); }, dur + delay + 150);
    };

    io = new IntersectionObserver((entries) => {
      // Elemen yang sudah di atas viewport (scroll cepat/anchor): tampilkan langsung tanpa animasi.
      entries.filter((e) => !e.isIntersecting && e.boundingClientRect.bottom < 0).forEach((e) => {
        io.unobserve(e.target); pending.delete(e.target); release(e.target);
      });

      // Yang terlihat bersamaan = satu kelompok: urut sesuai posisi, lalu stagger.
      entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (a.boundingClientRect.top - b.boundingClientRect.top) || (a.boundingClientRect.left - b.boundingClientRect.left))
        .forEach((entry, i) => play(entry.target, i));
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

    // Ujung halaman: margin pengamat membuat elemen terbawah tak pernah "terlihat" karena
    // halaman tak bisa di-scroll lagi. Saat mentok di bawah, ungkap sisa elemen yang sudah masuk layar.
    let endTick = false;
    const flushAtEnd = () => {
      endTick = false;
      if (!pending.size) return;
      if (window.innerHeight + window.scrollY < doc.scrollHeight - 4) return;
      let i = 0;
      pending.forEach((el) => {
        if (el.classList.contains('dm-in')) return;
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) play(el, i++);
      });
    };
    window.addEventListener('scroll', () => {
      if (!endTick && pending.size) { endTick = true; requestAnimationFrame(flushAtEnd); }
    }, { passive: true });

    // Jaring pengaman: bila observer macet karena sebab apa pun, elemen yang sudah di layar tetap diungkap.
    window.addEventListener('load', () => setTimeout(() => {
      let i = 0;
      pending.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (!el.classList.contains('dm-in') && r.top < window.innerHeight && r.bottom > 0) play(el, i++);
      });
    }, 3500));

    // Tandai dulu semua (satu putaran baca-tulis), baru amati.
    const tagged = targets.filter(tag);
    tagged.forEach((el) => { pending.add(el); io.observe(el); });
    requestAnimationFrame(flushAtEnd);      // halaman pendek yang sudah mentok sejak awal

    // Jaring pengaman: cetak halaman / perubahan preferensi => tampilkan semua.
    const revealAll = () => { pending.forEach(release); pending.clear(); io && io.disconnect(); };
    window.addEventListener('beforeprint', revealAll);
    mqReduce.addEventListener('change', (e) => { if (e.matches) revealAll(); });
  };

  /* ======================================================================
     2. KURSOR KUSTOM — dot (instan) + ring (mengikuti halus)
     Hanya aktif untuk mouse/pen; tidak pernah dibuat di perangkat sentuh.
     ====================================================================== */
  const INTERACTIVE = [
    'a[href]', 'button:not([disabled])', '[role="button"]', '[role="link"]', '[role="tab"]', 'summary',
    'label[for]', 'input[type="checkbox"]', 'input[type="radio"]', 'input[type="submit"]', 'input[type="button"]',
    '[data-detail]', '[data-hover]', '.ph', '[tabindex]:not([tabindex="-1"]):not(input):not(textarea)'
  ].join(',');
  const NATIVE_ZONE = [
    'input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]):not([type="range"]):not([type="file"])',
    'textarea', 'select', '[contenteditable=""]', '[contenteditable="true"]'
  ].join(',');

  let cursor = null;

  const initCursor = () => {
    if (cursor) return cursor;
    const ring = document.createElement('span');
    ring.id = 'dm-cursor-ring';
    ring.setAttribute('aria-hidden', 'true');
    const dot = document.createElement('span');
    dot.id = 'dm-cursor-dot';
    dot.setAttribute('aria-hidden', 'true');
    doc.append(ring, dot);

    let tx = -100, ty = -100, rx = -100, ry = -100, raf = 0, placed = false, last = 0;

    // Kecepatan ikut berbasis WAKTU (bukan per frame): sama di layar 60Hz, 144Hz, maupun halaman berat.
    const FOLLOW_MS = 70;
    const frame = (now) => {
      raf = 0;
      const dt = last ? Math.min(now - last, 64) : 16;
      last = now;
      const k = mqReduce.matches ? 1 : 1 - Math.exp(-dt / FOLLOW_MS);
      rx += (tx - rx) * k;
      ry += (ty - ry) * k;
      ring.style.translate = `${rx}px ${ry}px`;      // `translate` dipakai (bukan transform) agar tidak ikut terskala saat hover/klik
      if (Math.abs(tx - rx) > 0.1 || Math.abs(ty - ry) > 0.1) raf = requestAnimationFrame(frame);
      else last = 0;
    };

    const moveTo = (x, y) => {
      tx = x; ty = y;
      dot.style.translate = `${x}px ${y}px`;
      if (!placed) { rx = x; ry = y; ring.style.translate = dot.style.translate; placed = true; }
      if (!raf) raf = requestAnimationFrame(frame);
    };

    cursor = { ring, dot, moveTo };
    return cursor;
  };

  const setCursorActive = (on) => {
    doc.classList.toggle('dm-cursor-on', on);
    if (!on) doc.classList.remove('dm-cursor-visible', 'dm-cursor-native');
  };

  const bindPointer = () => {
    let magnet = null;

    const resetMagnet = () => {
      if (!magnet) return;
      magnet.style.removeProperty('--dm-mx');
      magnet.style.removeProperty('--dm-my');
      magnet = null;
    };

    document.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      if (!mqFine.matches) return;

      const c = initCursor();
      if (!doc.classList.contains('dm-cursor-on')) setCursorActive(true);
      doc.classList.add('dm-cursor-visible');
      c.moveTo(e.clientX, e.clientY);

      // Dorongan magnetis: hanya tombol utama, maksimal 6px, hanya jika gerak diizinkan.
      if (mqReduce.matches) return;
      const target = e.target instanceof Element ? e.target.closest('.btn, .navcta') : null;
      if (target !== magnet) resetMagnet();
      if (target) {
        const r = target.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        target.style.setProperty('--dm-mx', Math.max(-1, Math.min(1, dx)) * 6 + 'px');
        target.style.setProperty('--dm-my', Math.max(-1, Math.min(1, dy)) * 4 + 'px');
        magnet = target;
      }
    }, { passive: true });

    // Respons hover: satu standar untuk semua elemen interaktif.
    document.addEventListener('pointerover', (e) => {
      if (!cursor || !(e.target instanceof Element)) return;
      const native = Boolean(e.target.closest(NATIVE_ZONE));
      doc.classList.toggle('dm-cursor-native', native);
      const hot = !native && Boolean(e.target.closest(INTERACTIVE));
      cursor.ring.classList.toggle('is-hover', hot);
      cursor.dot.classList.toggle('is-hover', hot);
    }, { passive: true });

    // Satu standar feedback klik.
    document.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch') { setCursorActive(false); return; }
      if (cursor) cursor.ring.classList.add('is-down');
    }, { passive: true });
    const release = () => cursor && cursor.ring.classList.remove('is-down');
    window.addEventListener('pointerup', release, { passive: true });
    window.addEventListener('pointercancel', release, { passive: true });

    // Pointer meninggalkan jendela => sembunyikan kursor kustom.
    document.addEventListener('pointerout', (e) => {
      if (e.relatedTarget === null) {
        doc.classList.remove('dm-cursor-visible');
        if (cursor) { cursor.ring.classList.remove('is-hover', 'is-down'); cursor.dot.classList.remove('is-hover'); }
        resetMagnet();
      }
    }, { passive: true });
    window.addEventListener('blur', () => { doc.classList.remove('dm-cursor-visible'); resetMagnet(); });
  };

  /* ======================================================================
     3. STATE NAVBAR SAAT SCROLL (menggantikan versi lama di ux-optimization.js)
     ====================================================================== */
  const initNavState = () => {
    const nav = document.querySelector('.navbar, .nav, header.site-header');
    if (!nav) return;
    let ticking = false;
    const update = () => { nav.classList.toggle('is-scrolled', window.scrollY > 18); ticking = false; };
    update();
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
  };

  /* ======================================================================
     4. TRANSISI HALAMAN — fade keluar singkat, tidak menunda navigasi lebih dari ~220ms.
     Tidak mengganggu: klik dengan modifier, target baru, unduhan, hash internal, dialog/galeri.
     ====================================================================== */
  const initPageTransition = () => {
    let leaving = false;

    document.addEventListener('click', (e) => {
      if (mqReduce.matches || leaving) return;
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target instanceof Element ? e.target.closest('a[href]') : null;
      if (!link || (link.target && link.target !== '_self') || link.hasAttribute('download')) return;
      if (link.hasAttribute('data-detail') || link.hasAttribute('aria-haspopup') || link.closest('.decho-lightbox')) return;

      let url;
      try { url = new URL(link.href, location.href); } catch (_) { return; }
      if (!/^https?:|^file:/.test(url.protocol) || url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return;                       // hash/halaman yang sama
      if (/\.(?:pdf|zip|png|jpe?g|webp|gif|svg|mp4|webm|docx?|xlsx?)$/i.test(url.pathname)) return;

      e.preventDefault();
      leaving = true;
      doc.classList.add('dm-leaving');
      setTimeout(() => { location.href = url.href; }, token('--dm-dur-page', 220));
      // Jika navigasi dibatalkan browser, pulihkan tampilan.
      setTimeout(() => { leaving = false; doc.classList.remove('dm-leaving'); }, 2500);
    });

    // Kembali lewat tombol Back (bfcache): jangan biarkan halaman tetap transparan.
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) { leaving = false; doc.classList.remove('dm-leaving'); }
    });
  };

  /* ---------- Inisialisasi ---------- */
  const start = () => {
    try { initReveal(); } catch (err) {
      // Jika terjadi masalah, pastikan tidak ada konten yang tertinggal tersembunyi.
      document.querySelectorAll('.dm-item').forEach(release);
      console.warn('[DECHO motion] reveal dinonaktifkan:', err);
    }
    initNavState();
    initPageTransition();
    bindPointer();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
