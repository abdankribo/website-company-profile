(function () {
  'use strict';

  var surfaces = Array.prototype.slice.call(document.querySelectorAll('main > section, body > footer'));
  if (!surfaces.length) return;

  var motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  var states = [];
  var stateBySurface = new WeakMap();
  var observer = 'IntersectionObserver' in window
    ? new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var state = stateBySurface.get(entry.target);
        if (!state) return;
        state.visible = entry.isIntersecting;
        if (state.visible && motionPreference.matches) draw(state, performance.now(), 0);
      });
      start();
    }, { rootMargin: '80px 0px', threshold: 0 })
    : null;
  var resizeObserver = 'ResizeObserver' in window
    ? new ResizeObserver(function (entries) {
      entries.forEach(function (entry) {
        var state = stateBySurface.get(entry.target);
        if (state) resize(state);
      });
      if (motionPreference.matches) drawVisibleStatic();
      else start();
    })
    : null;
  var animationFrame = 0;
  var pointerState = null;
  var pageVisible = !document.hidden;

  surfaces.forEach(function (surface) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    if (!context) {
      console.error('DECHO wave background could not create a 2D canvas context.');
      return;
    }

    canvas.className = 'decho-wave-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    surface.classList.add('decho-wave-surface');
    surface.prepend(canvas);

    var state = {
      surface: surface,
      canvas: canvas,
      context: context,
      width: 0,
      height: 0,
      time: 0,
      lastTime: 0,
      color: getComputedStyle(surface).getPropertyValue('--decho-wave-color').trim() || '#6aa3bd',
      visible: !observer,
      mouseX: 0,
      mouseY: 0,
      targetX: 0,
      targetY: 0,
      mouseStrength: 0,
      mouseActive: false,
      ripples: []
    };

    states.push(state);
    stateBySurface.set(surface, state);
    resize(state);
    if (observer) observer.observe(surface);
    if (resizeObserver) resizeObserver.observe(surface);
  });

  function resize(state) {
    var bounds = state.surface.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    state.width = Math.max(1, bounds.width);
    state.height = Math.max(1, bounds.height);
    state.canvas.width = Math.max(1, Math.round(state.width * dpr));
    state.canvas.height = Math.max(1, Math.round(state.height * dpr));
    state.context.setTransform(dpr, 0, 0, dpr, 0, 0);
    state.color = getComputedStyle(state.surface).getPropertyValue('--decho-wave-color').trim() || '#6aa3bd';
  }

  function draw(state, now, delta) {
    var context = state.context;
    var width = state.width;
    var height = state.height;
    if (!width || !height) return;

    var elapsed = delta === undefined
      ? Math.min(0.05, (now - (state.lastTime || now)) / 1000)
      : delta;
    state.lastTime = now;
    state.time += elapsed * 0.72;
    if (motionPreference.matches) {
      state.mouseStrength = 0;
      state.ripples.length = 0;
    } else {
      state.mouseX += (state.targetX - state.mouseX) * 0.12;
      state.mouseY += (state.targetY - state.mouseY) * 0.12;
      state.mouseStrength += (state.mouseActive ? 1 - state.mouseStrength : -state.mouseStrength) * 0.06;

      for (var rippleIndex = state.ripples.length - 1; rippleIndex >= 0; rippleIndex--) {
        state.ripples[rippleIndex].age += elapsed;
        if (state.ripples[rippleIndex].age > 3) state.ripples.splice(rippleIndex, 1);
      }
    }

    context.clearRect(0, 0, width, height);
    context.strokeStyle = state.color;
    context.lineWidth = 1.15;

    var base = Math.min(height, width * 0.6);
    var amplitude = base * 0.2;
    var thickness = base * 0.34;
    var centerY = height * 0.46;
    var lineCount = Math.min(28, Math.max(18, Math.round(width / 44)));
    var step = Math.max(8, Math.round(width / 150));

    for (var lineIndex = 0; lineIndex < lineCount; lineIndex++) {
      var fraction = lineIndex / (lineCount - 1);
      context.globalAlpha = 0.55 + 0.4 * fraction;
      context.beginPath();

      for (var x = 0; x <= width + step; x += step) {
        var u = x / width;
        var v = u + (fraction - 0.5) * 0.07;
        var curve = Math.sin(v * 5.2 + state.time * 0.6) * 0.55
          + Math.sin(v * 9.1 - state.time * 0.45 + 1.3) * 0.25
          + Math.sin(v * 2.3 + state.time * 0.3 + 0.7) * 0.7;
        var spread = 0.12 + 0.88 * Math.abs(Math.sin(u * 3.4 + state.time * 0.35 + 0.4));
        var y = centerY + curve * amplitude + (fraction - 0.5) * thickness * spread;

        if (state.mouseStrength > 0.01) {
          var dx = x - state.mouseX;
          var dy = state.mouseY - y;
          y += dy * 0.45 * state.mouseStrength
            * Math.exp(-(dx * dx) / (2 * 150 * 150) - (dy * dy) / (2 * 170 * 170));
        }

        for (var i = 0; i < state.ripples.length; i++) {
          var ripple = state.ripples[i];
          var ring = Math.hypot(x - ripple.x, y - ripple.y) - ripple.age * 420;
          y += Math.sin(ring / 26) * 14
            * Math.exp(-(ring * ring) / (2 * 70 * 70))
            * Math.exp(-ripple.age * 1.1);
        }

        if (x === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }

      context.stroke();
    }

    context.globalAlpha = 1;
  }

  function drawVisibleStatic() {
    var now = performance.now();
    states.forEach(function (state) {
      if (state.visible) draw(state, now, 0);
    });
  }

  function tick(now) {
    animationFrame = 0;
    if (!pageVisible || motionPreference.matches) return;

    var hasVisibleSurface = false;
    states.forEach(function (state) {
      if (!state.visible) return;
      hasVisibleSurface = true;
      draw(state, now);
    });

    if (hasVisibleSurface) animationFrame = requestAnimationFrame(tick);
  }

  function start() {
    if (animationFrame || !pageVisible || motionPreference.matches) return;
    if (states.some(function (state) { return state.visible; })) {
      animationFrame = requestAnimationFrame(tick);
    }
  }

  function surfaceForEvent(event) {
    var target = event.target;
    if (!target || typeof target.closest !== 'function') return null;
    return stateBySurface.get(target.closest('.decho-wave-surface')) || null;
  }

  function updatePointer(event) {
    var nextState = surfaceForEvent(event);
    if (pointerState && pointerState !== nextState) pointerState.mouseActive = false;
    pointerState = nextState;
    if (!nextState) return;

    var bounds = nextState.surface.getBoundingClientRect();
    nextState.targetX = event.clientX - bounds.left;
    nextState.targetY = event.clientY - bounds.top;
    if (!nextState.mouseActive) {
      nextState.mouseX = nextState.targetX;
      nextState.mouseY = nextState.targetY;
    }
    nextState.mouseActive = true;
  }

  function addRipple(event) {
    var state = surfaceForEvent(event);
    var target = event.target;
    if (!state || (target.closest && target.closest('a,button,input,textarea,select,label'))) return;

    var bounds = state.surface.getBoundingClientRect();
    state.ripples.push({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
      age: 0
    });
    if (state.ripples.length > 6) state.ripples.shift();
  }

  window.addEventListener('pointermove', updatePointer, { passive: true });
  window.addEventListener('pointerdown', addRipple, { passive: true });
  window.addEventListener('pointerup', function (event) {
    if (event.pointerType !== 'mouse' && pointerState) pointerState.mouseActive = false;
  }, { passive: true });
  window.addEventListener('blur', function () {
    if (pointerState) pointerState.mouseActive = false;
    pointerState = null;
  });
  document.addEventListener('visibilitychange', function () {
    pageVisible = !document.hidden;
    if (pageVisible) start();
    else if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }
  });

  function updateMotionPreference() {
    if (motionPreference.matches) {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      states.forEach(function (state) {
        state.mouseActive = false;
        state.ripples.length = 0;
      });
      drawVisibleStatic();
    } else {
      start();
    }
  }

  if (motionPreference.addEventListener) motionPreference.addEventListener('change', updateMotionPreference);
  else motionPreference.addListener(updateMotionPreference);

  if (!resizeObserver) {
    window.addEventListener('resize', function () {
      states.forEach(resize);
      if (motionPreference.matches) drawVisibleStatic();
      else start();
    });
  }

  if (motionPreference.matches) drawVisibleStatic();
  else start();
})();
