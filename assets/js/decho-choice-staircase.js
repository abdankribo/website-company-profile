(() => {
  const stage = document.querySelector('.decho-choice-stairs');
  if (!stage) return;
  const $ = selector => [...stage.querySelectorAll(selector)];
  const paths = $('.decho-choice-route .decho-snake-flow path');
  const cuts = $('#decho-choice-cuts line');
  const items = $('.decho-choice-item');
  const arrow = stage.querySelector('#decho-choice-arrow');
  const head = stage.querySelector('#decho-choice-head');
  const hint = stage.querySelector('.decho-choice-hint');
  const colors = ['#7b68f2', '#0a84ff', '#07c9ac', '#10dc86', '#5be12b'];
  const cardToNode = [4, 2, 3, 0, 1];
  const lengths = paths.map(path => path.getTotalLength());
  const starts = [];
  let totalLength = 0;
  lengths.forEach((length, index) => { starts[index] = totalLength; totalLength += length; });
  paths.forEach((path, index) => {
    path.style.strokeDasharray = lengths[index] + ' ' + lengths[index];
    path.style.strokeDashoffset = lengths[index];
  });
  const thresholds = [.8, .55, .6, .55, .5].map((fraction, index) => starts[index] + lengths[index] * fraction);

  function render(progress) {
    const distance = progress * totalLength;
    paths.forEach((path, index) => {
      path.style.strokeDashoffset = lengths[index] - Math.min(lengths[index], Math.max(0, distance - starts[index]));
    });
    cuts.forEach((cut, index) => { cut.style.opacity = distance > starts[index] ? '1' : '0'; });
    items.forEach((item, index) => item.classList.toggle('on', distance >= thresholds[cardToNode[index]]));
    let pathIndex = 0;
    while (pathIndex < paths.length - 1 && distance > starts[pathIndex] + lengths[pathIndex]) pathIndex++;
    const point = paths[pathIndex].getPointAtLength(Math.min(lengths[pathIndex], Math.max(0, distance - starts[pathIndex])));
    head.setAttribute('cx', point.x);
    head.setAttribute('cy', point.y);
    head.setAttribute('fill', colors[pathIndex]);
    head.style.opacity = distance > 0 && progress < .97 ? '1' : '0';
    arrow.classList.toggle('on', progress >= .97);
    if (hint) hint.style.opacity = progress > .02 ? '0' : '1';
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth <= 650) {
    render(1);
    return;
  }

  const ease = t => -(Math.cos(Math.PI * t) - 1) / 2;
  const duration = 3600;
  let raf = 0;
  let played = false;
  function play() {
    cancelAnimationFrame(raf);
    const startTime = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - startTime) / duration);
      render(ease(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
  }

  render(0);
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.intersectionRatio >= .35 && !played) {
        played = true;
        play();
      } else if (entry.intersectionRatio === 0 && played) {
        played = false;
        cancelAnimationFrame(raf);
        render(0);
      }
    });
  }, { threshold: [0, .35] });
  observer.observe(stage);
})();
