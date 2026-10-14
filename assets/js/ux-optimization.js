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
  // Reveal cards only after JS has loaded; without JS content remains visible.
  const revealItems=$$('.service-card,.news-card,.gallery figure,.project-card,.process-card');
  if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    revealItems.forEach(el=>el.classList.add('decho-reveal'));
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('decho-in');io.unobserve(entry.target);}}),{threshold:.08,rootMargin:'0px 0px -28px 0px'});
    revealItems.forEach(el=>io.observe(el));
  }
  // Smooth, restrained entrance motion for headings and hero content.
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


/* DECHO interaction layer: reveal sections progressively, elevate sticky nav on scroll */
(function(){
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav = document.querySelector('.navbar, .nav, header.site-header');
  let scheduled = false;
  function updateScrollState(){
    if(nav) nav.classList.toggle('is-scrolled', window.scrollY > 18);
    scheduled = false;
  }
  updateScrollState();
  window.addEventListener('scroll', function(){
    if(!scheduled){ scheduled = true; window.requestAnimationFrame(updateScrollState); }
  }, {passive:true});

  if(reduce || !('IntersectionObserver' in window)) return;
  const selectors = [
    '.section-head',
    '.about-grid',
    '.sustain-grid',
    '.feature-banner',
    '.contact-strip',
    '.stats',
    '.footer-grid',
    '.project-intro',
    '.project-search-panel',
    '.contact-layout',
    '.contact-form',
    '.contact-info',
    '.process-grid',
    '.process-row'
  ];
  const targets = [];
  selectors.forEach(selector => document.querySelectorAll(selector).forEach(el => {
    if(el.dataset.dechoMotionInit === '1' || el.classList.contains('decho-reveal')) return;
    if(el.closest('.decho-lightbox,[hidden]')) return;
    el.dataset.dechoMotionInit = '1';
    el.classList.add('decho-scroll-reveal');
    targets.push(el);
  }));
  if(!targets.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      entry.target.classList.add('decho-scroll-in');
      observer.unobserve(entry.target);
    });
  }, {threshold:0.08, rootMargin:'0px 0px -36px 0px'});
  targets.forEach((el,index) => {
    el.style.transitionDelay = Math.min((index % 4) * 70, 210) + 'ms';
    observer.observe(el);
  });
})();


/* DECHO scroll storytelling: animate content entering the viewport */
(function(){
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced) return;

  const selectors = [
    'main section',
    'main .service-card',
    'main .project-card',
    'main .news-card',
    'main .team-card',
    'main .quick-card',
    'main .process-row',
    'main .stat',
    'main .gallery figure'
  ];
  const elements = [];
  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      if(el.dataset.dechoScrollStory === '1' || el.closest('.decho-lightbox')) return;
      // Do not hide the first screen: animate only content lower in the document.
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      if(top < window.innerHeight * 0.72) return;
      el.dataset.dechoScrollStory = '1';
      el.classList.add('decho-story-reveal');
      elements.push(el);
    });
  });
  if(!elements.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      entry.target.classList.add('decho-story-visible');
      observer.unobserve(entry.target);
    });
  }, {threshold:0.12, rootMargin:'0px 0px -7% 0px'});

  elements.forEach((el,index) => {
    if(el.matches('.service-card,.project-card,.news-card,.team-card,.quick-card,.gallery figure')) {
      el.style.setProperty('--decho-story-delay', (index % 4) * 65 + 'ms');
    }
    observer.observe(el);
  });

  // Gentle scroll-linked progress for the reading journey.
  let ticking=false;
  function progress(){
    const max=document.documentElement.scrollHeight-window.innerHeight;
    const amount=max>0 ? Math.min(1,Math.max(0,window.scrollY/max)) : 0;
    document.documentElement.style.setProperty('--decho-scroll-progress', amount.toFixed(4));
    ticking=false;
  }
  window.addEventListener('scroll',function(){
    if(!ticking){ticking=true;window.requestAnimationFrame(progress);}
  },{passive:true});
  progress();
})();


/* DECHO scroll UX fallback: one dependable reveal observer for every page. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var candidates = document.querySelectorAll('main > section, main .section-head, main .about-grid, main .sustain-grid, main .feature-banner, main .contact-strip, main .stats, main .service-card, main .project-card, main .news-card, main .team-card, main .quick-card, main .process-row, main .gallery figure, main .stat');
  if (reduce || !('IntersectionObserver' in window)) {
    candidates.forEach(function (el) { el.style.opacity = '1'; el.style.transform = 'none'; });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      el.style.opacity = '1';
      el.style.transform = 'translate3d(0,0,0)';
      observer.unobserve(el);
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -36px 0px' });
  candidates.forEach(function (el, index) {
    if (el.dataset.dechoReliableReveal === '1') return;
    el.dataset.dechoReliableReveal = '1';
    var rect = el.getBoundingClientRect();
    var initiallyVisible = rect.top < window.innerHeight * 0.88 && rect.bottom > 0;
    el.style.transition = 'opacity 560ms cubic-bezier(.22,1,.36,1), transform 560ms cubic-bezier(.22,1,.36,1)';
    el.style.transitionDelay = (index % 4) * 55 + 'ms';
    if (initiallyVisible) {
      el.style.opacity = '1';
      el.style.transform = 'translate3d(0,0,0)';
    } else {
      el.style.opacity = '0';
      el.style.transform = 'translate3d(0,24px,0)';
      observer.observe(el);
    }
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
      var offset = Math.max(-28, Math.min(28, centerDistance * -34));
      el.style.setProperty('--decho-parallax-y', offset.toFixed(2) + 'px');
    });
    foregroundLayers.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.bottom < -80 || rect.top > viewportHeight + 80) return;
      var centerDistance = (rect.top + rect.height / 2 - viewportHeight / 2) / Math.max(viewportHeight, 1);
      var offset = Math.max(-22, Math.min(22, centerDistance * -26));
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
