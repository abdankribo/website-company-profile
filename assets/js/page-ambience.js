(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const layer = document.createElement("div");

  layer.id = "page-ambience";
  layer.className = "pointer-events-none fixed inset-0 overflow-hidden motion-safe:animate-[dechoAuraDrift_28s_ease-in-out_infinite_alternate]";
  layer.setAttribute("aria-hidden", "true");
  document.body.prepend(layer);

  let framePending = false;

  const updateHue = () => {
    framePending = false;
    if (!reducedMotion.matches) {
      const hue = Math.min(window.scrollY / 120, 20);
      layer.style.setProperty("--page-ambience-hue", `${hue}deg`);
    }
  };

  const requestHueUpdate = () => {
    if (!framePending) {
      framePending = true;
      window.requestAnimationFrame(updateHue);
    }
  };

  window.addEventListener("scroll", requestHueUpdate, { passive: true });
  document.addEventListener("visibilitychange", () => {
    layer.style.animationPlayState = document.hidden || reducedMotion.matches ? "paused" : "running";
  });
  reducedMotion.addEventListener("change", () => {
    layer.style.animationPlayState = reducedMotion.matches || document.hidden ? "paused" : "running";
  });
})();
