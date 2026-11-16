/* Detail proyek dalam modal (tanpa halaman baru): klik "Lihat Detail" -> modal interaktif */
(function(){
  var B=new URL('../images/proyek/',document.currentScript.src).href;
  var L={bw:'Pelabuhan Bawean, Gresik',jk:'Pelabuhan Jangkar, Situbondo',pb:'Pelabuhan Probolinggo',pc:'Pelabuhan Paciran, Lamongan',rk:'Rungkut City, Surabaya'};
  function P(n,s){return B+n+(s||'')+'.jpg'}
  function I(img,t,s,l,y,tags,d){return {img:img,t:t,s:s,l:l,y:y,tags:tags,d:d}}
  var D={
    'moveable-bridge':{no:'01',name:'Moveable Bridge',items:[
      I('mb-bawean-2022','Moveable Bridge','Steel Fabrication, Installation, MEP Hydraulic',L.bw,'2022',['Steel Fabrication','Installation','MEP Hydraulic'],'Fabrikasi dan instalasi struktur baja moveable bridge beserta sistem hidrolik MEP di Pelabuhan Bawean, Gresik.'),
      I('mb-bawean-2019','Moveable Bridge — Workshop','Steel and Hydraulic Fabrication at Workshop',L.bw,'2019',['Steel Fabrication','Hydraulic Fabrication','Workshop'],'Pekerjaan fabrikasi baja dan hidrolik moveable bridge di workshop: rangka baja, grating, hingga silinder hidrolik.'),
      I('mb-jangkar-2023','Moveable Bridge','Steel Fabrication, Installation, and MEP Hydraulic',L.jk,'2023',['Steel Fabrication','Installation','MEP Hydraulic'],'Fabrikasi, instalasi, dan MEP hidrolik moveable bridge di Pelabuhan Jangkar, Situbondo.'),
      I('catwalk-bawean-2022','Catwalk & Control Room','Steel Fabrication, Installation, and Control Room Renovation',L.bw,'2022',['Steel Fabrication','Installation','Control Room Renovation'],'Fabrikasi dan instalasi catwalk baja serta renovasi ruang kontrol di Pelabuhan Bawean, Gresik.'),
      I('ff-probolinggo-2023','Frontal Frame','Steel Fabrication and Installation',L.pb,'2023',['Steel Fabrication','Installation'],'Fabrikasi struktur baja frontal frame di workshop dan pemasangannya di dermaga Pelabuhan Probolinggo.'),
      I('ff-paciran-2022','Frontal Frame','Steel Fabrication and Installation',L.pc,'2022',['Steel Fabrication','Installation'],'Fabrikasi dan instalasi frontal frame baja di dermaga Pelabuhan Paciran, Lamongan.')]},
    'konstruksi-gudang':{no:'02',name:'Konstruksi Gudang',items:[
      I('wh-probolinggo-2023','Warehouse','Steel Structure & Roofing Installation',L.pb,'2023',['Steel Structure','Roofing Installation'],'Pekerjaan struktur baja dan pemasangan atap gudang di area Pelabuhan Probolinggo.'),
      I('wh-paciran-2024','Warehouse','Steel Structure & Roofing Installation',L.pc,'2024',['Steel Structure','Roofing Installation'],'Pekerjaan struktur baja dan pemasangan atap gudang di Pelabuhan Paciran, Lamongan.')]},
    'rumah-hunian':{no:'03',name:'Rumah Hunian',items:[
      I('rumah-rungkut-2025','Residential House','Civil & Architecture Work’s',L.rk,'2025',['Civil Work','Architecture Work'],'Pekerjaan sipil dan arsitektur pembangunan rumah hunian di Rungkut City, Surabaya.')]}
  };
  var m,dlg,stage,img,bg,info,cnt,cur,st={i:0,full:false,from:null};
  function el(h){var d=document.createElement('div');d.innerHTML=h;return d.firstElementChild}
  function build(){
    m=el('<div id="pd-modal" aria-hidden="true"><div class="pd-bd tw-animate-pd-fade" data-c></div>'+
      '<section class="pd-dlg tw-animate-pd-pop" role="dialog" aria-modal="true" aria-labelledby="pd-title">'+
        '<div class="pd-stage"><div class="pd-bg"></div><figure class="pd-fig"><img class="pd-img tw-animate-pd-swap" alt=""></figure>'+
          '<button type="button" class="pd-btn pd-x tw-transition-transform tw-duration-300 hover:tw-rotate-90" data-c aria-label="Tutup detail">&times;</button>'+
          '<button type="button" class="pd-btn pd-nav pd-prev" data-n="-1" aria-label="Foto sebelumnya">&#8249;</button>'+
          '<button type="button" class="pd-btn pd-nav pd-next" data-n="1" aria-label="Foto berikutnya">&#8250;</button>'+
          '<span class="pd-count"></span></div><aside class="pd-info"></aside></section></div>');
    document.documentElement.appendChild(m);
    dlg=m.querySelector('.pd-dlg');stage=m.querySelector('.pd-stage');img=m.querySelector('.pd-img');bg=m.querySelector('.pd-bg');
    info=m.querySelector('.pd-info');cnt=m.querySelector('.pd-count');
    m.addEventListener('click',function(e){
      var t=e.target;
      if(t.closest('[data-c]')) return close();
      var n=t.closest('[data-n]'); if(n) return go(+n.getAttribute('data-n'));
      var th=t.closest('.pd-th'); if(th) return show(+th.getAttribute('data-i'));
      if(t.closest('.pd-fig')) zoom();
    });
    stage.addEventListener('pointermove',function(e){
      if(!stage.classList.contains('is-zoom')) return;
      var r=img.getBoundingClientRect();
      img.style.setProperty('--ox',Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100))+'%');
      img.style.setProperty('--oy',Math.max(0,Math.min(100,(e.clientY-r.top)/r.height*100))+'%');
    });
  }
  function zoom(){stage.classList.toggle('is-zoom')}
  function setSrc(u){img.src=u;bg.style.backgroundImage='url("'+u+'")';img.classList.remove('tw-animate-pd-swap');void img.offsetWidth;img.classList.add('tw-animate-pd-swap')}
  function go(d){var n=cur.items.length;show((st.i+d+n)%n)}
  function show(i){
    var it=cur.items[i], n=cur.items.length; st.i=i; st.full=false; stage.classList.remove('is-zoom');
    setSrc(P(it.img)); img.alt='Dokumentasi '+it.t+', '+it.l+' '+it.y;
    cnt.textContent=(i+1)+' / '+n;
    [].forEach.call(m.querySelectorAll('.pd-nav'),function(b){b.style.display=n>1?'':'none'});
    var u=function(k,c,h){return '<'+h[0]+' class="'+c+' tw-animate-pd-up" style="animation-delay:'+(k*70)+'ms">'+h[1]+'</'+h[0]+'>'};
    info.innerHTML=
      u(0,'pd-kick',['span','Detail Proyek · '+cur.no+' '+cur.name])+
      u(1,'pd-title',['h3',it.t]).replace('<h3','<h3 id="pd-title"')+
      u(2,'pd-sub',['p',it.s])+
      u(3,'pd-chips',['div','<span class="pd-chip">⌖ '+it.l+'</span><span class="pd-chip">▦ '+it.y+'</span>'])+
      u(4,'pd-desc',['p',it.d])+
      u(5,'pd-h',['h4','Ruang Lingkup'])+
      u(6,'pd-tags',['ul',it.tags.map(function(t){return '<li class="pd-tag">'+t+'</li>'}).join('')])+
      (n>1?u(7,'pd-h',['h4','Dokumentasi Proyek ('+n+')'])+
        u(8,'pd-thumbs',['div',cur.items.map(function(x,k){return '<button type="button" class="pd-th'+(k===i?' on':'')+'" data-i="'+k+'" aria-label="'+(k+1)+'. '+x.t+', '+x.l+' '+x.y+'"><img src="'+P(x.img)+'" alt="" loading="lazy"><b>'+(k+1)+'</b></button>'}).join('')]):'');
    info.scrollTop=0;
    [(i+1)%n,(i-1+n)%n].forEach(function(k){(new Image()).src=P(cur.items[k].img)});
  }
  function open(key,i,from){
    if(!m) build(); cur=D[key]; st.from=from||null; show(i||0);
    m.classList.add('is-open'); m.setAttribute('aria-hidden','false');
    document.documentElement.style.overflow='hidden'; m.querySelector('.pd-x').focus({preventScroll:true});
  }
  function close(){
    if(!m||!m.classList.contains('is-open')) return;
    m.classList.remove('is-open'); m.setAttribute('aria-hidden','true'); document.documentElement.style.overflow='';
    if(st.from) st.from.focus({preventScroll:true});
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest('[data-detail]'); if(!a) return;
    var k=a.getAttribute('data-detail'); if(!D[k]) return;
    e.preventDefault(); var idx=parseInt(a.getAttribute('data-detail-index'),10); open(k,Number.isFinite(idx)?idx:0,a);
  });
  document.addEventListener('keydown',function(e){
    if(!m||!m.classList.contains('is-open')) return;
    if(e.key==='Escape') close();
    else if(e.key==='ArrowRight') go(1);
    else if(e.key==='ArrowLeft') go(-1);
    else if(e.key==='Tab'){
      var f=[].filter.call(dlg.querySelectorAll('button,a[href]'),function(x){return x.offsetParent!==null});
      if(!f.length) return;
      var a=f[0],z=f[f.length-1];
      if(e.shiftKey&&document.activeElement===a){z.focus();e.preventDefault()}
      else if(!e.shiftKey&&document.activeElement===z){a.focus();e.preventDefault()}
    }
  });
  window.ProyekDetail={open:open,close:close};
})();
