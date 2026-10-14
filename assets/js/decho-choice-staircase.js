(()=> {
  const section=document.querySelector('.decho-choice-section');
  const stage=document.querySelector('.decho-choice-stairs');
  if(!section||!stage)return;
  const paths=[...stage.querySelectorAll('.decho-choice-route .decho-snake-flow path')];
  const cuts=[...stage.querySelectorAll('#decho-choice-cuts line')];
  const items=[...stage.querySelectorAll('.decho-choice-item')];
  const arrow=stage.querySelector('#decho-choice-arrow');
  const head=stage.querySelector('#decho-choice-head');
  const hint=stage.querySelector('.decho-choice-hint');
  const colors=['#7b68f2','#0a84ff','#07c9ac','#10dc86','#5be12b'];
  const cardToNode=[4,2,3,0,1];
  const lengths=paths.map(p=>p.getTotalLength()),starts=[];
  let total=0;
  lengths.forEach((len,i)=>{starts[i]=total;total+=len;});
  paths.forEach((p,i)=>{p.style.strokeDasharray=lengths[i]+' '+lengths[i];p.style.strokeDashoffset=lengths[i];});
  const thresholds=[.8,.55,.6,.55,.5].map((v,i)=>starts[i]+lengths[i]*v);
  function render(progress){
    const distance=progress*total;
    paths.forEach((path,i)=>{path.style.strokeDashoffset=lengths[i]-Math.min(lengths[i],Math.max(0,distance-starts[i]));});
    cuts.forEach((line,i)=>{line.style.opacity=distance>starts[i]?1:0;});
    items.forEach((item,i)=>{
      const visible=distance>=thresholds[i];
      item.classList.toggle('on',visible);
    });
    let index=0;while(index<4&&distance>starts[index]+lengths[index])index++;
    const point=paths[index].getPointAtLength(Math.min(lengths[index],Math.max(0,distance-starts[index])));
    head.setAttribute('cx',point.x);head.setAttribute('cy',point.y);head.setAttribute('fill',colors[index]);
    head.style.opacity=(distance>0&&progress<.97)?1:0;
    arrow.classList.toggle('on',progress>=.97);
    hint.style.opacity=progress>.02?0:1;
  }
  function progress(){
    if(innerWidth<=650)return 1;
    const rect=section.getBoundingClientRect();
    const travel=Math.max(1,rect.height-innerHeight);
    return Math.min(1,Math.max(0,-rect.top/travel));
  }
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){render(1);return;}
  let current=0,frame=0;
  function tick(){
    const target=progress();
    current+=(target-current)*.09;
    if(Math.abs(target-current)<.0005)current=target;
    render(current);
    frame=requestAnimationFrame(tick);
  }
  tick();
  addEventListener('resize',()=>{cancelAnimationFrame(frame);tick();},{passive:true});
})();
