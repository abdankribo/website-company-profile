/* DECHO UX layer — accessible navigation, scroll utilities and photo viewer */
(function(){
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const path=location.pathname.replace(/\/$/,'').split('/').pop()||'index.html';
  const nested=location.pathname.includes('/proyek/');
  const assetPrefix=nested?'../':'';
  if(!$('main')){const first=$('header')||$('.hero')||$('body').firstElementChild;if(first&&first.parentNode){first.id=first.id||'main-content';}}
  const main=$('main')||$('#main-content')||$('body');
  if(!$('#decho-progress')){const p=document.createElement('div');p.id='decho-progress';p.setAttribute('aria-hidden','true');document.body.append(p);}
  if(!$('#decho-top')){const b=document.createElement('button');b.id='decho-top';b.type='button';b.setAttribute('aria-label','Kembali ke atas');b.title='Kembali ke atas';b.innerHTML='↑';document.body.append(b);b.addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));}
  const topBtn=$('#decho-top'), progress=$('#decho-progress');
  let ticking=false;
  function scrollUpdate(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?Math.min(100,scrollY/max*100):0)+'%';topBtn.classList.toggle('is-visible',scrollY>480);ticking=false;}
  addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(scrollUpdate);ticking=true;}},{passive:true});scrollUpdate();
  $$('a[href]').forEach(a=>{
    const href=a.getAttribute('href')||'';
    if(!a.hasAttribute('aria-current') && (href===path || (path==='index.html'&&href==='./')) && (a.closest('.navlinks')||a.closest('nav')))a.setAttribute('aria-current','page');
    if(a.target==='_blank'&&!a.rel)a.rel='noopener noreferrer';
  });
  const menu=$('#menuToggle'),nav=$('#navlinks');
  if(menu&&nav){menu.setAttribute('aria-controls','navlinks');menu.setAttribute('aria-expanded',String(nav.classList.contains('open')));menu.addEventListener('click',()=>menu.setAttribute('aria-expanded',String(nav.classList.contains('open'))));nav.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.focus();}});}
  $$('img').forEach(img=>{
    if(!img.hasAttribute('decoding'))img.decoding='async';
    if(!img.closest('.hero')&&!img.hasAttribute('loading'))img.loading='lazy';
    img.addEventListener('error',()=>{img.classList.add('decho-image-error');img.setAttribute('aria-label','Gambar tidak dapat dimuat: '+(img.alt||'foto'));},{once:true});
  });

  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
    const hero=$('.hero,.page-hero');
    if(hero){
      const targets=$('.eyebrow,.section-kicker,h1,.hero p,.hero-actions,.page-hero p',hero);
      targets.forEach((el,i)=>{el.classList.add('decho-hero-enter');el.style.animationDelay=Math.min(i*.09,.36)+'s';});
      const heroImage=$('.hero img,.hero .hero-image,.page-hero img',hero);
      if(heroImage)heroImage.classList.add('decho-image-enter');
      hero.classList.add('decho-gradient-motion');
    }
  }
  // Project search/filter: use the grid adjacent to the search panel and enforce hidden state.
  const projectSearch=$('#projectSearch');
  if(projectSearch){
    const section=projectSearch.closest('.section')||document;
    const projectGrid=$('.project-grid',section);
    const cards=projectGrid?$$('.project-card',projectGrid):[];
    const filters=$$('[data-project-filter]',section);
    const resultLabel=$('#projectResults',section);
    let activeFilter='all';
    const normalize=s=>(s||'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLocaleLowerCase('id').replace(/&amp;/g,'&');
    function categoryFor(card){
      // Honor explicit category metadata first so each category button maps
      // deterministically to its intended project cards.
      const explicit=(card.dataset.projectCategory||card.dataset.category||'').trim().toLowerCase();
      if(['pelabuhan','gudang','hunian'].includes(explicit)) return explicit;
      const title=normalize($('h3',card)?.textContent||'');
      if(/warehouse|gudang/.test(title)) return 'gudang';
      if(/residential|rumah hunian|rumah tinggal|rungkut city/.test(title)) return 'hunian';
      if(/moveable bridge|catwalk|control room|frontal frame|marine steel|pelabuhan|port/.test(title)) return 'pelabuhan';
      return 'pelabuhan';
    }
    function applyProjectFilters(){
      const query=normalize(projectSearch.value.trim());
      let shown=0;
      cards.forEach(card=>{
        const searchable=normalize(card.textContent+' '+Array.from(card.querySelectorAll('img')).map(img=>img.alt).join(' '));
        const matchesCategory=activeFilter==='all'||categoryFor(card)===activeFilter;
        const matchesQuery=!query||searchable.includes(query);
        const visible=matchesCategory&&matchesQuery;
        card.hidden=!visible;
        card.style.display=visible?'':'none';
        card.setAttribute('aria-hidden',String(!visible));
        if(visible)shown++;
      });
      if(resultLabel)resultLabel.textContent='Menampilkan '+shown+' dari '+cards.length+' proyek.';
      const empty=$('#projectNoResults',section);
      if(shown===0){
        if(!empty){const msg=document.createElement('p');msg.id='projectNoResults';msg.className='project-no-results';msg.setAttribute('role','status');msg.textContent='Tidak ada proyek yang cocok. Coba kata kunci atau kategori lain.';projectGrid?.after(msg);}
      }else if(empty)empty.remove();
    }
    projectSearch.addEventListener('input',applyProjectFilters);
    filters.forEach(button=>button.addEventListener('click',()=>{
      activeFilter=button.dataset.projectFilter||'all';
      filters.forEach(item=>{
        const active=item===button;
        item.setAttribute('aria-pressed',String(active));
        item.classList.toggle('is-active',active);
      });
      applyProjectFilters();
    }));
    const initiallyActive=filters.find(button=>button.getAttribute('aria-pressed')==='true');
    if(initiallyActive){activeFilter=initiallyActive.dataset.projectFilter||'all';filters.forEach(button=>button.classList.toggle('is-active',button===initiallyActive));}
    applyProjectFilters();
  }
  // Accessible lightbox for project and service photos.
  const photoLinks=$$('.gallery img, .project-card img, .project-gallery img');
  if(photoLinks.length){
    const box=document.createElement('div');box.className='decho-lightbox';box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','Pratinjau foto proyek');box.innerHTML='<span class="counter" aria-live="polite"></span><button class="close" type="button" aria-label="Tutup foto">×</button><button class="prev" type="button" aria-label="Foto sebelumnya">‹</button><figure><img alt=""><figcaption></figcaption></figure><button class="next" type="button" aria-label="Foto berikutnya">›</button>';document.body.append(box);
    const shown=$('img',box),caption=$('figcaption',box),counter=$('.counter',box),close=$('.close',box),prev=$('.prev',box),next=$('.next',box);
    let current=0,opener=null;
    function show(i){current=(i+photoLinks.length)%photoLinks.length;const src=photoLinks[current];shown.src=src.currentSrc||src.src;shown.alt=src.alt||'Foto proyek DECHO';caption.textContent=src.closest('figure')?.querySelector('figcaption')?.textContent||src.alt||'Dokumentasi proyek DECHO';counter.textContent=(current+1)+' / '+photoLinks.length;prev.hidden=photoLinks.length<2;next.hidden=photoLinks.length<2;}
    function open(i){opener=document.activeElement;show(i);box.classList.add('is-open');document.body.style.overflow='hidden';close.focus();}
    function shut(){box.classList.remove('is-open');document.body.style.overflow='';shown.removeAttribute('src');if(opener&&opener.focus)opener.focus();}
    photoLinks.forEach((img,i)=>{img.style.cursor='zoom-in';img.setAttribute('tabindex','0');img.setAttribute('role','button');img.setAttribute('aria-label','Perbesar foto: '+(img.alt||'dokumentasi proyek'));img.addEventListener('click',e=>{e.preventDefault();open(i);});img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(i);}});});
    close.addEventListener('click',shut);prev.addEventListener('click',()=>show(current-1));next.addEventListener('click',()=>show(current+1));
    box.addEventListener('click',e=>{if(e.target===box)shut();});
    document.addEventListener('keydown',e=>{if(!box.classList.contains('is-open'))return;if(e.key==='Escape')shut();if(e.key==='ArrowLeft')show(current-1);if(e.key==='ArrowRight')show(current+1);});
  }
  const year=$('#year');if(year&&!year.textContent.trim())year.textContent=new Date().getFullYear();
})();

/* Site-wide image resilience: ensure local photos remain visible if a source path fails */
(function(){
  'use strict';
  const nested = location.pathname.includes('/proyek/');
  const prefix = nested ? '../' : '';
  const fallbackCandidates = [
    prefix + 'assets/images/foto-Steel%20Fabrication%20and%20Installation_03%20(1).jpg',
    prefix + 'assets/images/foto-Steel%20and%20Hydraulic%20Fabrication%20at%20Workshop_05%20(1).jpg',
    prefix + 'assets/images/foto-Civil%20%26%20Architecture%20Work%E2%80%99s-rungkut%20city_01%20(1).jpg'
  ];
  let fallbackIndex = 0;
  function setFallback(img){
    if(!img || img.dataset.dechoFallbackDone === '1') return;
    img.dataset.dechoFallbackDone = '1';
    img.src = fallbackCandidates[fallbackIndex % fallbackCandidates.length];
    fallbackIndex++;
  }
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => setFallback(img), { once: true });
    if(img.complete && img.naturalWidth === 0 && img.getAttribute('src')) setFallback(img);
  });

  // CSS background images do not emit an error event, so verify them explicitly.
  const checked = new Set();
  document.querySelectorAll('*').forEach(el => {
    const bg = getComputedStyle(el).backgroundImage;
    if(!bg || bg === 'none') return;
    const matches = [...bg.matchAll(/url\(["']?(.*?)["']?\)/g)];
    matches.forEach(match => {
      const url = match[1];
      if(!url || url.startsWith('data:') || checked.has(url)) return;
      checked.add(url);
      const probe = new Image();
      probe.onerror = () => {
        if(el.dataset.dechoBgFallback === '1') return;
        el.dataset.dechoBgFallback = '1';
        el.style.backgroundImage = 'linear-gradient(135deg, rgba(17,23,71,.12), rgba(49,88,232,.08)), url("' + fallbackCandidates[0] + '")';
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center';
      };
      probe.src = url;
    });
  });
})();


/* Gentle transition for same-site page navigation; preserve browser and accessibility behavior */
(function(){
  'use strict';
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.addEventListener('click',function(event){
    if(event.defaultPrevented || event.button!==0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link=event.target.closest('a[href]');
    if(!link || link.target==='_blank' || link.hasAttribute('download')) return;
    let destination;
    try{destination=new URL(link.href,location.href)}catch(_){return}
    if(destination.origin!==location.origin || destination.pathname===location.pathname && destination.hash) return;
    if(destination.pathname===location.pathname && !destination.hash) return;
    if(!document.body || link.closest('.decho-lightbox')) return;
    if(/\.(?:pdf|zip|png|jpe?g|webp|gif|svg|mp4|webm|docx?|xlsx?)$/i.test(destination.pathname)) return;
    event.preventDefault();
    document.body.classList.add('decho-page-leaving');
    window.setTimeout(()=>{location.href=destination.href},220);
  });
})();


/* DECHO scroll reveal: repeat on enter/exit with a single observer. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav = document.querySelector('.navbar, .nav, header.site-header');
  var scrollPending = false;
  function updateNav() {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 18);
    scrollPending = false;
  }
  updateNav();
  window.addEventListener('scroll', function () {
    if (!scrollPending) {
      scrollPending = true;
      window.requestAnimationFrame(updateNav);
    }
  }, { passive: true });

  var selector = [
    'main .section-head', 'main .about-grid', 'main .sustain-grid',
    'main .feature-banner', 'main .contact-strip', 'main .stats',
    'main .project-intro', 'main .project-search-panel', 'main .contact-layout',
    'main .contact-form', 'main .contact-info', 'main .process-grid',
    'main .process-row', 'main .service-card', 'main .project-card',
    'main .news-card', 'main .team-card', 'main .quick-card',
    'main .gallery figure', 'main .stat', 'main > section'
  ].join(',');
  var all = Array.prototype.slice.call(document.querySelectorAll(selector)).filter(function (el) {
    return !el.closest('.decho-lightbox,[hidden]') && !el.matches('.hero,.page-hero');
  });
  // Avoid animating a section and its children at the same time.
  var targets = all.filter(function (el) {
    return !all.some(function (other) { return other !== el && el.contains(other); });
  });

  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) {
      el.classList.remove('decho-reveal');
      el.classList.add('decho-in');
      el.style.removeProperty('opacity');
      el.style.removeProperty('transform');
      el.style.removeProperty('filter');
      el.style.removeProperty('transition-delay');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      entry.target.classList.toggle('decho-in', entry.isIntersecting);
    });
  }, { threshold: 0.01, rootMargin: '0px 0px -4% 0px' });

  var delayIndex = 0;
  targets.forEach(function (el) {
    if (el.dataset.dechoRevealInit === '1') return;
    el.dataset.dechoRevealInit = '1';
    var rect = el.getBoundingClientRect();
    var visibleAtStart = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
    el.classList.add('decho-reveal');
    el.style.setProperty('--decho-reveal-delay', visibleAtStart ? '0ms' : ((delayIndex++ % 4) * 55) + 'ms');
    el.classList.toggle('decho-in', visibleAtStart);
    observer.observe(el);
  });
})();

/* DECHO parallax-only layer: apply depth to real visual layers, including CSS-background artwork. */
(function(){
  'use strict';
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(motion.matches) return;
  const sections = Array.from(document.querySelectorAll('main section, main > .hero, main > .page-hero, body > .hero'));
  if(!sections.length) return;
  const visuals = [];
  const selector = '.decho-scene, .about-image, .about-background-art, .sustain-image, .sustain-visual, .feature-visual, .news-image, .project-gallery img, .gallery img, .project-card img, .service-card > img, video.hero-video, .page-hero .hero-image, .hero > img';
  sections.forEach((section) => {
    section.classList.add('decho-parallax-section');
    const candidates = section.matches(selector) ? [section] : Array.from(section.querySelectorAll(selector));
    candidates.forEach((el) => {
      if(el.dataset.dechoParallax === '1') return;
      el.dataset.dechoParallax = '1';
      el.classList.add('decho-parallax-visual');
      visuals.push({el, section});
    });
  });
  if(!visuals.length) return;
  let frame = 0;
  function update(){
    const vh = window.innerHeight || 1;
    visuals.forEach(({el, section}) => {
      const rect = section.getBoundingClientRect();
      if(rect.bottom < -100 || rect.top > vh + 100) return;
      const progress = (vh - rect.top) / (vh + rect.height);
      const travel = Math.max(-26, Math.min(26, (progress - .5) * 52));
      el.style.setProperty('--decho-parallax-offset', travel.toFixed(2) + 'px');
    });
    frame = 0;
  }
  function schedule(){ if(!frame) frame = window.requestAnimationFrame(update); }
  window.addEventListener('scroll', schedule, {passive:true});
  window.addEventListener('resize', schedule, {passive:true});
  motion.addEventListener && motion.addEventListener('change', e => { if(e.matches) visuals.forEach(({el}) => {el.style.transform='none';}); });
  update();
})();


/* DECHO parallax fix: scroll-linked movement for the actual hero and background-image layers */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  var backgroundLayers = Array.prototype.slice.call(document.querySelectorAll(
    '.hero, .page-hero, .about-image, .feature-visual, .sustain-image, .news-image, .project-hero, .project-cover, .decho-scene'
  )).filter(function (el) {
    return getComputedStyle(el).backgroundImage !== 'none' || el.classList.contains('decho-scene');
  });
  var foregroundLayers = Array.prototype.slice.call(document.querySelectorAll(
    '.hero-video, .decho-scene-art, .hero-image, .page-hero img'
  ));

  if (!backgroundLayers.length && !foregroundLayers.length) return;

  var ticking = false;
  function updateParallax() {
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    backgroundLayers.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.bottom < -80 || rect.top > viewportHeight + 80) return;
      var centerDistance = (rect.top + rect.height / 2 - viewportHeight / 2) / Math.max(viewportHeight, 1);
      var offset = Math.max(-78, Math.min(78, centerDistance * -96));
      el.style.setProperty('--decho-parallax-y', offset.toFixed(2) + 'px');
    });
    foregroundLayers.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.bottom < -80 || rect.top > viewportHeight + 80) return;
      var centerDistance = (rect.top + rect.height / 2 - viewportHeight / 2) / Math.max(viewportHeight, 1);
      var offset = Math.max(-48, Math.min(48, centerDistance * -58));
      el.style.setProperty('--decho-parallax-y', offset.toFixed(2) + 'px');
    });
    ticking = false;
  }
  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateParallax);
    }
  }
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  updateParallax();
})();
