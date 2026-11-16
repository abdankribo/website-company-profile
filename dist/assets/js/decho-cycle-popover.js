/* DECHO – artikel (popover) di samping bulatan pada orbit "Pelaksanaan Proyek".
   Hover = pratinjau, klik = sematkan. Berdiri sendiri: CSS disuntikkan oleh skrip ini. */
(function () {
  'use strict';

  var css =
    'html #decho-cycle-popover{position:fixed!important;left:0;top:0;z-index:2147483000!important;box-sizing:border-box;width:330px;max-width:calc(100vw - 24px);margin:0;padding:18px 20px;' +
    'background:rgba(255,255,255,.97);color:#0b1038;font-family:inherit;text-align:left;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border-radius:22px;' +
    'border:1.5px solid color-mix(in srgb,var(--pc,#7b61ff) 55%,#fff);' +
    'box-shadow:0 30px 60px -24px color-mix(in srgb,var(--pc,#7b61ff) 55%,rgba(11,16,56,.3)),0 4px 14px rgba(11,16,56,.08);' +
    'opacity:0;visibility:hidden;pointer-events:none;transform:translateY(8px) scale(.96);' +
    'transition:opacity .25s,transform .35s cubic-bezier(.22,1,.36,1),visibility 0s .25s}' +
    'html #decho-cycle-popover.is-show{opacity:1;visibility:visible;pointer-events:auto;transform:none;transition:opacity .25s,transform .35s cubic-bezier(.22,1,.36,1)}' +
    '#decho-cycle-popover::before{content:"";position:absolute;left:-8px;top:calc(var(--ay,50%) - 7px);width:14px;height:14px;background:#fff;' +
    'border-left:1.5px solid color-mix(in srgb,var(--pc,#7b61ff) 55%,#fff);border-bottom:1.5px solid color-mix(in srgb,var(--pc,#7b61ff) 55%,#fff);transform:rotate(45deg)}' +
    '#decho-cycle-popover.is-left::before{left:auto;right:-8px;transform:rotate(225deg)}' +
    '#decho-cycle-popover.is-sheet::before{display:none}' +
    '#decho-cycle-popover .decho-cycle-popover-head{display:flex;align-items:flex-start;gap:12px}' +
    '#decho-cycle-popover .decho-cycle-popover-number{flex:none;display:grid;place-items:center;width:40px;height:40px;border-radius:50%;background:var(--pc,#7b61ff);color:#08103a;font-size:.9rem;font-weight:800}' +
    '#decho-cycle-popover h3{flex:1;margin:0;padding-top:6px;font-size:1.1rem;font-weight:800;line-height:1.2;color:#0b1038}' +
    '#decho-cycle-popover-close{display:none;flex:none;place-items:center;width:32px;height:32px;padding:0;border:0;border-radius:50%;background:#eef0fa;color:#0b1038;font-size:1.2rem;font-weight:700;line-height:1;cursor:pointer}' +
    '#decho-cycle-popover-close:hover{background:#dfe3f3}' +
    '#decho-cycle-popover.is-pinned #decho-cycle-popover-close{display:grid}' +
    '#decho-cycle-popover #decho-cycle-popover-description{margin:12px 0 0;font-size:.95rem;line-height:1.6;color:#2c3562;animation:dchoPopIn .5s cubic-bezier(.22,1,.36,1)}' +
    '#decho-cycle-popover .decho-cycle-popover-hint{margin:12px 0 0;font-size:.75rem;font-weight:600;color:#566089}' +
    '#decho-cycle-popover.is-pinned .decho-cycle-popover-hint{display:none}' +
    '.decho-cycle-node.is-pinned .decho-cycle-disc{outline:3px solid var(--cycle-color);outline-offset:4px}' +
    '@keyframes dchoPopIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}' +
    '@media (max-width:639px){#decho-cycle-popover.is-sheet{width:auto}}' +
    '@media (prefers-reduced-motion:reduce){#decho-cycle-popover,#decho-cycle-popover #decho-cycle-popover-description{transition:none;animation:none}}';

  function init() {
    var section = document.getElementById('decho-construction-cycle');
    var pop = document.getElementById('decho-cycle-popover');
    if (!section || !pop) return;
    var discs = [].slice.call(section.querySelectorAll('.decho-cycle-disc'));
    if (!discs.length) return;

    var numEl = document.getElementById('decho-cycle-popover-number');
    var titleEl = document.getElementById('decho-cycle-popover-title');
    var descEl = document.getElementById('decho-cycle-popover-description');
    var closeBtn = document.getElementById('decho-cycle-popover-close');

    var style = document.createElement('style');
    style.id = 'decho-cycle-popover-style';
    style.textContent = css;
    document.head.appendChild(style);

    /* Pasang langsung ke html agar transform animasi body/section tidak menggeser fixed popup. */
    document.documentElement.appendChild(pop);

    var idx = -1, pinned = -1, closeT = null, lastLang = '';

    function lang() { return (document.documentElement.lang || 'id').toLowerCase().indexOf('en') === 0 ? 'en' : 'id'; }
    function node(i) { return discs[i].closest('.decho-cycle-node'); }

    function fill(i) {
      var d = discs[i], l = lang();
      var color = (node(i).style.getPropertyValue('--cycle-color') || '#7b61ff').trim();
      pop.style.setProperty('--pc', color);
      numEl.textContent = '0' + (i + 1);
      titleEl.textContent = d.getAttribute('data-title-' + l) || d.getAttribute('data-title-id') || '';
      descEl.textContent = d.getAttribute('data-description-' + l) || d.getAttribute('data-description-id') || '';
      lastLang = l;
    }

    function position() {
      if (idx < 0) return;
      var r = discs[idx].getBoundingClientRect();
      var vw = document.documentElement.clientWidth || window.innerWidth;
      var vh = document.documentElement.clientHeight || window.innerHeight;
      var W = Math.min(330, vw - 24);
      pop.style.width = W + 'px';
      var ph = pop.offsetHeight;
      if (vw < 640) {
        pop.classList.add('is-sheet');
        var mobileLeft = Math.max(12, Math.min(r.left + r.width / 2 - W / 2, vw - W - 12));
        var mobileTop = r.bottom + 14;
        if (mobileTop + ph > vh - 12) mobileTop = r.top - ph - 14;
        mobileTop = Math.max(12, Math.min(mobileTop, vh - ph - 12));
        pop.style.left = mobileLeft + 'px';
        pop.style.top = mobileTop + 'px';
        return;
      }
      pop.classList.remove('is-sheet');
      var toRight = r.right + 20 + W < vw - 12;
      var left = toRight ? r.right + 20 : r.left - 20 - W;
      var top = r.top + r.height / 2 - ph / 2;
      left = Math.max(12, Math.min(left, vw - W - 12));
      top = Math.max(12, Math.min(top, vh - ph - 12));
      pop.style.left = left + 'px';
      pop.style.top = top + 'px';
      pop.classList.toggle('is-left', left < r.left);
      pop.style.setProperty('--ay', Math.max(24, Math.min(ph - 24, r.top + r.height / 2 - top)) + 'px');
    }

    function open(i) {
      clearTimeout(closeT);
      if (idx !== i) {
        idx = i; fill(i);
        descEl.style.animation = 'none'; void descEl.offsetWidth; descEl.style.animation = '';
      }
      pop.classList.add('is-show');
      pop.setAttribute('aria-hidden', 'false');
      discs.forEach(function (disc, k) { disc.setAttribute('aria-expanded', String(k === i)); });
      position();
    }

    function close() {
      pop.classList.remove('is-show', 'is-pinned');
      pop.setAttribute('aria-hidden', 'true');
      idx = -1; pinned = -1;
      discs.forEach(function (disc) { disc.setAttribute('aria-expanded', 'false'); });
      discs.forEach(function (d, k) { node(k).classList.remove('is-pinned'); });
      section.classList.remove('is-popover-pinned');
    }

    function softClose() {
      clearTimeout(closeT);
      closeT = setTimeout(function () { if (pinned < 0) close(); }, 260);
    }

    window.addEventListener('scroll', function () {
      if (pinned < 0) return;
      var r = discs[pinned].getBoundingClientRect();
      if (r.bottom <= 0 || r.top >= window.innerHeight || r.right <= 0 || r.left >= window.innerWidth) close();
    }, { passive: true });

    discs.forEach(function (d, i) {
      d.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch' && pinned < 0) open(i); });
      d.addEventListener('pointerleave', function (e) { if (e.pointerType !== 'touch' && pinned < 0) softClose(); });
      d.addEventListener('focus', function () { if (pinned < 0) open(i); });
      d.addEventListener('blur', function () { if (pinned < 0) softClose(); });
    });

    /* Tangkap klik dari tombol, ikon SVG, atau badge sebelum handler lain berjalan. */
    document.addEventListener('click', function (e) {
      var target = e.target instanceof Element ? e.target.closest('.decho-cycle-disc') : null;
      if (!target || !section.contains(target)) return;
      var i = discs.indexOf(target);
      if (i < 0) return;
      if (pinned === i) { close(); return; }
      pinned = i; open(i);
      pop.classList.add('is-pinned');
      discs.forEach(function (x, k) { node(k).classList.toggle('is-pinned', k === i); });
      section.classList.add('is-popover-pinned');
    }, true);

    pop.addEventListener('pointerenter', function () { clearTimeout(closeT); });
    pop.addEventListener('pointerleave', function () { if (pinned < 0) softClose(); });
    closeBtn.addEventListener('click', close);
    document.addEventListener('pointerdown', function (e) {
      if (pinned > -1 && !e.target.closest('.decho-cycle-node') && !e.target.closest('#decho-cycle-popover')) close();
    }, true);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    /* ikuti bulatan yang bergerak + perbarui teks jika bahasa berganti */
    (function loop() {
      if (idx > -1) {
        if (lang() !== lastLang) fill(idx);
        position();
      }
      requestAnimationFrame(loop);
    })();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
