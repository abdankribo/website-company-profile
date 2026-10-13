/* DECHO UX layer — accessible navigation, scroll utilities and photo viewer */
(function(){
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const path=location.pathname.replace(/\/$/,'').split('/').pop()||'index.html';
  const nested=location.pathname.includes('/proyek/');
  const assetPrefix=nested?'../':'';
  if(!$('main')){const first=$('header')||$('.hero')||$('body').firstElementChild;if(first&&first.parentNode){first.id=first.id||'main-content';}}
  const main=$('main')||$('#main-content')||$('body');
  if(main&&!$('#decho-skip')){const skip=document.createElement('a');skip.id='decho-skip';skip.className='skip-link';skip.href='#'+(main.id||'main-content');if(!main.id)main.id='main-content';skip.textContent='Lewati ke konten utama';document.body.prepend(skip);}
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
  // Live search and category filters for every project card.
  const projectSearch=$('#projectSearch');
  if(projectSearch){
    const projectGrid=$$('.project-grid').slice(-1)[0];
    const cards=projectGrid?$$('.project-card',projectGrid):[];
    const filters=$$('[data-project-filter]');
    const resultLabel=$('#projectResults');
    let activeFilter='all';
    function applyProjectFilters(){
      const query=projectSearch.value.trim().toLocaleLowerCase('id');
      let shown=0;
      cards.forEach(card=>{
        const heading=$('h3',card)?.textContent.toLocaleLowerCase('id')||'';
        const text=card.textContent.toLocaleLowerCase('id');
        const category=heading.includes('warehouse')||heading.includes('gudang')?'gudang':heading.includes('residential')||heading.includes('rumah')||heading.includes('hunian')?'hunian':'pelabuhan';
        const matchesCategory=activeFilter==='all'||category===activeFilter;
        const matchesQuery=!query||text.includes(query);
        card.hidden=!(matchesCategory&&matchesQuery);
        if(!card.hidden)shown++;
      });
      if(resultLabel)resultLabel.textContent='Menampilkan '+shown+' dari '+cards.length+' proyek.';
    }
    projectSearch.addEventListener('input',applyProjectFilters);
    filters.forEach(button=>button.addEventListener('click',()=>{
      activeFilter=button.dataset.projectFilter||'all';
      filters.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
      applyProjectFilters();
    }));
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
    event.preventDefault();
    document.body.classList.add('decho-page-leaving');
    window.setTimeout(()=>{location.href=destination.href},160);
  });
})();
