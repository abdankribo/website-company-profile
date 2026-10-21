(function(){
  var root=document.getElementById('pj'); if(!root) return;
  var tabs=[].slice.call(root.querySelectorAll('.pj-tab')), slides=[].slice.call(root.querySelectorAll('.pj-slide'));
  var proc=document.getElementById('pj-proc'), hero=root.querySelector('.pj-hero');
  var still=matchMedia('(prefers-reduced-motion: reduce)');
  var COL=[['#6e6e6e','#ffffff'],['#9a9a9a','#101010'],['#cbcbcb','#1a1a1a'],['#3584ab','#ffffff'],['#95c0d6','#0f2a40'],['#f6ebdf','#2a2018']];
  var base=[
    ['Persiapan Lahan','Pembersihan, pengukuran, dan pematangan lahan sebelum pekerjaan konstruksi dimulai.'],
    ['Pondasi','Galian dan pengecoran pondasi sebagai penopang seluruh struktur bangunan.'],
    ['Fabrikasi','Pembuatan komponen struktur baja di workshop sesuai gambar kerja.'],
    ['Pasang Atap','Pemasangan rangka dan penutup atap bangunan.'],
    ['Pasang Lantai & Dinding','Pemasangan lantai serta dinding atau cladding bangunan.'],
    ['MEP','Instalasi mekanikal, elektrikal, dan plumbing.']
  ];
  /* urutan mengikuti tab proyek: 01 Moveable Bridge, 02 Gudang, 03 Rumah Hunian */
  var data=[
    {t:'Sistem Moveable Bridge & Pra Sarana Pendukung Pelabuhan',s:[
      ['Fabrikasi','Pembuatan struktur jembatan di workshop sesuai gambar kerja.'],
      ['Galvanis & Pengecatan','Perlindungan baja dari korosi dengan galvanis dan pengecatan.'],
      ['Pemasangan di lapangan','Perakitan dan pemasangan struktur di lokasi pelabuhan.'],
      ['Test Beban','Pengujian kemampuan struktur menahan beban rencana.'],
      ['MEP','Instalasi sistem mekanikal dan elektrikal pendukung.'],
      ['Commissioning Test','Pengujian akhir seluruh sistem sebelum serah terima.']]},
    {t:'Konstruksi Gudang',s:base},
    {t:'Rumah Hunian dan Renovasi',s:base}
  ];
  var esc=function(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')};

  proc.innerHTML=
    '<div class="pj-ph"><div><span class="pj-pk">Tahapan Pengerjaan</span><strong class="pj-pt"></strong></div>'+
      '<div class="pj-ctrl">'+
        '<button type="button" class="pj-cb" data-a="prev" aria-label="Tahap sebelumnya">&#8249;</button>'+
        '<button type="button" class="pj-cb" data-a="play" aria-label="Jeda otomatis">&#10074;&#10074;</button>'+
        '<button type="button" class="pj-cb" data-a="next" aria-label="Tahap berikutnya">&#8250;</button>'+
      '</div></div>'+
    '<div class="pj-scroller"><div class="pj-track"><div class="pj-line"><i class="pj-fill"></i></div><ol class="pj-nodes"></ol></div></div>'+
    '<div class="pj-detail" aria-live="polite"><i class="pj-timer"></i><span class="pj-dt"></span><span class="pj-dd"></span></div>';

  var pt=proc.querySelector('.pj-pt'), nodesEl=proc.querySelector('.pj-nodes'), fill=proc.querySelector('.pj-fill'),
      track=proc.querySelector('.pj-track'), det=proc.querySelector('.pj-detail'), dt=proc.querySelector('.pj-dt'),
      dd=proc.querySelector('.pj-dd'), timer=proc.querySelector('.pj-timer'), playBtn=proc.querySelector('[data-a="play"]');
  var p=0, s=0, nodes=[], playing=!still.matches;

  function restartTimer(){
    timer.classList.remove('run'); void timer.offsetWidth;
    if(playing&&!still.matches) timer.classList.add('run');
  }
  function setPlaying(v){
    playing=v;
    playBtn.innerHTML=v?'&#10074;&#10074;':'&#9654;';
    playBtn.setAttribute('aria-label',v?'Jeda otomatis':'Putar otomatis');
    restartTimer();
  }
  function setStep(i,swap){
    var st=data[p].s; s=Math.max(0,Math.min(st.length-1,i));
    nodes.forEach(function(n,k){
      n.classList.toggle('is-done',k<s); n.classList.toggle('is-cur',k===s);
      if(k===s) n.setAttribute('aria-current','step'); else n.removeAttribute('aria-current');
    });
    track.style.setProperty('--fill',(s/(st.length-1)*100)+'%');
    det.style.setProperty('--c',COL[s%6][0]);
    dt.textContent='Tahap '+(s+1)+' dari '+st.length+' \u00b7 '+st[s][0];
    dd.textContent=st[s][1];
    if(swap!==false){det.classList.remove('swap');void det.offsetWidth;det.classList.add('swap')}
    restartTimer();
  }
  function renderProject(){
    var st=data[p].s; pt.textContent=data[p].t;
    nodesEl.innerHTML=st.map(function(x,k){
      return '<li class="pj-li"><button type="button" class="pj-node" data-i="'+k+'" style="--c:'+COL[k%6][0]+';--t:'+COL[k%6][1]+';--i:'+k+'" aria-label="Tahap '+(k+1)+': '+esc(x[0])+'">'+
        '<span class="pj-dot">'+(k+1)+'</span><span class="pj-nl">'+esc(x[0])+'</span></button></li>';
    }).join('');
    nodes=[].slice.call(nodesEl.querySelectorAll('.pj-node'));
    nodes.forEach(function(n,k){
      n.addEventListener('click',function(){setPlaying(false);setStep(k)});
      n.addEventListener('keydown',function(e){
        var d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;
        if(d&&nodes[k+d]){nodes[k+d].focus();setPlaying(false);setStep(k+d);e.preventDefault()}
      });
    });
  }
  function setProject(k,focus){
    if(k===p&&nodes.length) return; p=k;
    tabs.forEach(function(t,j){var on=j===k;t.classList.toggle('is-on',on);t.setAttribute('aria-selected',on);t.tabIndex=on?0:-1});
    slides.forEach(function(sl,j){sl.classList.toggle('is-on',j===k)});
    renderProject(); setStep(0);
    if(focus) tabs[k].focus();
  }

  tabs.forEach(function(t,k){
    t.addEventListener('click',function(){setProject(k)});
    t.addEventListener('keydown',function(e){
      var d=(e.key==='ArrowDown'||e.key==='ArrowRight')?1:(e.key==='ArrowUp'||e.key==='ArrowLeft')?-1:0;
      if(e.key==='Home') d=-k; if(e.key==='End') d=tabs.length-1-k;
      if(d&&tabs[k+d]){setProject(k+d,true);e.preventDefault()}
    });
  });
  proc.addEventListener('click',function(e){
    var b=e.target.closest('.pj-cb'); if(!b) return;
    var a=b.getAttribute('data-a'), n=data[p].s.length;
    if(a==='play') setPlaying(!playing);
    else{setPlaying(false);setStep(a==='next'?(s+1)%n:(s-1+n)%n)}
  });
  /* timer selesai -> maju ke tahap berikutnya (berulang) */
  timer.addEventListener('animationend',function(){ if(playing) setStep((s+1)%data[p].s.length); });

  /* parallax halus pada foto */
  hero.addEventListener('pointermove',function(e){
    if(e.pointerType!=='mouse'||still.matches) return;
    var r=hero.getBoundingClientRect(), par=hero.querySelector('.pj-slide.is-on .pj-par'); if(!par) return;
    par.style.setProperty('--px',(((e.clientX-r.left)/r.width-.5)*-24)+'px');
    par.style.setProperty('--py',(((e.clientY-r.top)/r.height-.5)*-16)+'px');
  });
  hero.addEventListener('pointerleave',function(){
    [].forEach.call(hero.querySelectorAll('.pj-par'),function(x){x.style.setProperty('--px','0px');x.style.setProperty('--py','0px')});
  });

  /* jeda otomatis saat section tidak terlihat */
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){root.classList.toggle('is-off',!es[0].isIntersecting)},{threshold:.15}).observe(root);
  }

  p=-1; setProject(0); setPlaying(playing);
})();

