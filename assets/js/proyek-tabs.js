/* Tahapan pengerjaan di dalam laci arsip: satu panel per laci (.pj-proc[data-proc]). */
(function () {
  'use strict';
  var els = [].slice.call(document.querySelectorAll('.pj-proc[data-proc]'));
  if (!els.length) return;

  var still = window.matchMedia('(prefers-reduced-motion: reduce)');
  var lang = 'id';
  try { lang = window.localStorage.getItem('decho-language') === 'en' ? 'en' : 'id'; } catch (e) {}
  var L = function (id, en) { return lang === 'en' ? en : id; };

  var COL = [['#6e6e6e', '#ffffff'], ['#9a9a9a', '#101010'], ['#cbcbcb', '#1a1a1a'], ['#3584ab', '#ffffff'], ['#95c0d6', '#0f2a40'], ['#f6ebdf', '#2a2018']];

  // tiap tahap: [judul ID, judul EN, uraian ID, uraian EN]
  var BASE = [
    ['Persiapan Lahan', 'Site Preparation', 'Pembersihan, pengukuran, dan pematangan lahan sebelum pekerjaan konstruksi dimulai.', 'Clearing, surveying, and grading of the land before construction begins.'],
    ['Pondasi', 'Foundation', 'Galian dan pengecoran pondasi sebagai penopang seluruh struktur bangunan.', 'Excavation and casting of the foundation that supports the whole building structure.'],
    ['Fabrikasi', 'Fabrication', 'Pembuatan komponen struktur baja di workshop sesuai gambar kerja.', 'Fabrication of steel structural components in the workshop according to shop drawings.'],
    ['Pasang Atap', 'Roof Installation', 'Pemasangan rangka dan penutup atap bangunan.', 'Installation of the roof frame and roof covering.'],
    ['Pasang Lantai & Dinding', 'Floor & Wall Installation', 'Pemasangan lantai serta dinding atau cladding bangunan.', 'Installation of the floor and the walls or cladding.'],
    ['MEP', 'MEP', 'Instalasi mekanikal, elektrikal, dan plumbing.', 'Mechanical, electrical, and plumbing installation.']
  ];
  // urutan sama dengan arsip: Moveable Bridge, Konstruksi Bangunan, Rumah Hunian
  var DATA = [
    { t: ['Sistem Moveable Bridge & Pra Sarana Pendukung Pelabuhan', 'Moveable Bridge System & Port Support Facilities'], s: [
      ['Fabrikasi', 'Fabrication', 'Pembuatan struktur jembatan di workshop sesuai gambar kerja.', 'Fabrication of the bridge structure in the workshop according to shop drawings.'],
      ['Galvanis & Pengecatan', 'Galvanizing & Painting', 'Perlindungan baja dari korosi dengan galvanis dan pengecatan.', 'Corrosion protection of the steel through galvanizing and painting.'],
      ['Pemasangan di lapangan', 'On-site Installation', 'Perakitan dan pemasangan struktur di lokasi pelabuhan.', 'Assembly and installation of the structure at the port site.'],
      ['Test Beban', 'Load Test', 'Pengujian kemampuan struktur menahan beban rencana.', 'Testing the structure’s ability to carry the design load.'],
      ['MEP', 'MEP', 'Instalasi sistem mekanikal dan elektrikal pendukung.', 'Installation of the supporting mechanical and electrical systems.'],
      ['Commissioning Test', 'Commissioning Test', 'Pengujian akhir seluruh sistem sebelum serah terima.', 'Final testing of all systems before handover.']] },
    { t: ['Konstruksi Bangunan', 'Building Construction'], s: BASE },
    { t: ['Rumah Hunian dan Renovasi', 'Residential Houses & Renovation'], s: BASE }
  ];
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };

  function create(el) {
    var idx = +el.getAttribute('data-proc');
    var stages = DATA[idx].s;
    var title = DATA[idx].t;

    el.innerHTML =
      '<div class="pj-ph"><div><span class="pj-pk">' + L('Tahapan Pengerjaan', 'Work Stages') + '</span><strong class="pj-pt">' + esc(title[lang === 'en' ? 1 : 0]) + '</strong></div>' +
        '<div class="pj-ctrl">' +
          '<button type="button" class="pj-cb" data-a="prev" aria-label="' + L('Tahap sebelumnya', 'Previous stage') + '">&#8249;</button>' +
          '<button type="button" class="pj-cb" data-a="play" aria-label="' + L('Jeda otomatis', 'Pause autoplay') + '">&#10074;&#10074;</button>' +
          '<button type="button" class="pj-cb" data-a="next" aria-label="' + L('Tahap berikutnya', 'Next stage') + '">&#8250;</button>' +
        '</div></div>' +
      '<div class="pj-scroller"><div class="pj-track"><div class="pj-line"><i class="pj-fill"></i></div><ol class="pj-nodes"></ol></div></div>' +
      '<div class="pj-detail" aria-live="polite"><i class="pj-timer"></i><span class="pj-dt"></span><span class="pj-dd"></span></div>';

    var nodesEl = el.querySelector('.pj-nodes'), track = el.querySelector('.pj-track'),
        det = el.querySelector('.pj-detail'), dt = el.querySelector('.pj-dt'), dd = el.querySelector('.pj-dd'),
        timer = el.querySelector('.pj-timer'), playBtn = el.querySelector('[data-a="play"]');
    var folder = el.closest('.cb-folder, .hx-stages'), drawer = el.closest('.cb-drawer, .hx-cat');
    var s = 0, nodes = [], playing = !still.matches, active = false;

    function restartTimer() {
      timer.classList.remove('run'); void timer.offsetWidth;
      if (playing && active && !still.matches) timer.classList.add('run');
    }
    function setPlaying(v) {
      playing = v;
      playBtn.innerHTML = v ? '&#10074;&#10074;' : '&#9654;';
      playBtn.setAttribute('aria-label', v ? L('Jeda otomatis', 'Pause autoplay') : L('Putar otomatis', 'Play autoplay'));
      restartTimer();
    }
    function setStep(i, swap) {
      s = Math.max(0, Math.min(stages.length - 1, i));
      nodes.forEach(function (n, k) {
        n.classList.toggle('is-done', k < s); n.classList.toggle('is-cur', k === s);
        if (k === s) n.setAttribute('aria-current', 'step'); else n.removeAttribute('aria-current');
      });
      track.style.setProperty('--fill', (s / (stages.length - 1) * 100) + '%');
      det.style.setProperty('--c', COL[s % 6][0]);
      var o = lang === 'en' ? 1 : 0;
      dt.textContent = L('Tahap ', 'Stage ') + (s + 1) + L(' dari ', ' of ') + stages.length + ' \u00b7 ' + stages[s][o];
      dd.textContent = stages[s][2 + o];
      if (swap !== false) { det.classList.remove('swap'); void det.offsetWidth; det.classList.add('swap'); }
      restartTimer();
    }

    nodesEl.innerHTML = stages.map(function (x, k) {
      var name = x[lang === 'en' ? 1 : 0];
      return '<li class="pj-li"><button type="button" class="pj-node" data-i="' + k + '" style="--c:' + COL[k % 6][0] + ';--t:' + COL[k % 6][1] + ';--i:' + k + '" aria-label="' + L('Tahap ', 'Stage ') + (k + 1) + ': ' + esc(name) + '">' +
        '<span class="pj-dot">' + (k + 1) + '</span><span class="pj-nl">' + esc(name) + '</span></button></li>';
    }).join('');
    nodes = [].slice.call(nodesEl.querySelectorAll('.pj-node'));
    nodes.forEach(function (n, k) {
      n.addEventListener('click', function () { setPlaying(false); setStep(k); });
      n.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (d && nodes[k + d]) { nodes[k + d].focus(); setPlaying(false); setStep(k + d); e.preventDefault(); }
      });
    });
    el.addEventListener('click', function (e) {
      var b = e.target.closest('.pj-cb'); if (!b) return;
      var a = b.getAttribute('data-a'), n = stages.length;
      if (a === 'play') setPlaying(!playing);
      else { setPlaying(false); setStep(a === 'next' ? (s + 1) % n : (s - 1 + n) % n); }
    });
    // timer selesai -> maju ke tahap berikutnya (berulang)
    timer.addEventListener('animationend', function () { if (playing && active) setStep((s + 1) % stages.length); });

    // otomatis berjalan hanya saat folder tahapan di laci ini sedang terbuka
    function sync() {
      var on = !!(folder && drawer && folder.classList.contains('is-open') && drawer.classList.contains('is-open'));
      if (on === active) return;
      active = on;
      el.classList.toggle('is-off', !on);
      if (on) { setPlaying(!still.matches); setStep(0, false); } else restartTimer();
    }
    if (folder && drawer && 'MutationObserver' in window) {
      var mo = new MutationObserver(sync);
      mo.observe(folder, { attributes: true, attributeFilter: ['class'] });
      mo.observe(drawer, { attributes: true, attributeFilter: ['class'] });
    } else { active = true; }
    el.classList.toggle('is-off', !active);
    setStep(0, false);
    setPlaying(playing);
  }

  els.forEach(create);
})();
