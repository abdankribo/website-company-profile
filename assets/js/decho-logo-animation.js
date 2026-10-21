(function () {
  'use strict';

  var stage = document.getElementById('decho-logo-stage');
  if (!stage) return;

  var viewport = stage.parentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fit() {
    var width = viewport.clientWidth;
    var height = viewport.clientHeight;
    var portrait = width < height;
    var scale = portrait
      ? Math.min(width / 900, height / 1080)
      : Math.max(width / 1920, height / 1080);

    stage.style.left = (portrait ? width / 2 - 1400 * scale : (width - 1920 * scale) / 2) + 'px';
    stage.style.top = (height - 1080 * scale) / 2 + 'px';
    stage.style.margin = '0';
    stage.style.transformOrigin = 'top left';
    stage.style.transform = 'scale(' + scale + ')';
  }

  function play() {
    window.clearTimeout(stage.animationTimer);
    stage.classList.remove('go', 'done');
    void stage.offsetWidth;
    stage.classList.add('go');
    stage.animationTimer = window.setTimeout(function () {
      stage.classList.add('done');
    }, reduce ? 0 : 3000);
  }

  fit();
  window.addEventListener('resize', fit);
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(viewport);
  stage.addEventListener('pointerdown', function (event) {
    var bar = event.target.closest('.bar');
    if (bar && typeof bar.animate === 'function') {
      bar.animate(
        [{ transform: 'translateY(0)' }, { transform: 'translateY(-26px)' }, { transform: 'translateY(0)' }],
        { duration: 550, easing: 'cubic-bezier(.3,1.5,.5,1)' }
      );
    }
  });
  window.addEventListener('keydown', function (event) {
    if ((event.key === 'r' || event.key === 'R') && !event.target.closest('input,textarea,select,[contenteditable="true"]')) {
      play();
    }
  });
  window.requestAnimationFrame(function () {
    window.requestAnimationFrame(play);
  });
})();
