(() => {
  "use strict";

  const finePointer = matchMedia("(pointer: fine)");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  if (!finePointer.matches) return;

  const ring = document.createElement("span");
  ring.id = "decho-cursor-ring";
  ring.setAttribute("aria-hidden", "true");
  const dot = document.createElement("span");
  dot.id = "decho-cursor-dot";
  dot.setAttribute("aria-hidden", "true");
  document.documentElement.append(ring, dot);
  document.documentElement.classList.add("decho-custom-cursor");

  document.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    const transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    ring.style.transform = transform;
    dot.style.transform = transform;
    document.documentElement.classList.add("decho-cursor-visible");
  });

  document.addEventListener("pointerout", (event) => {
    if (event.relatedTarget === null) {
      document.documentElement.classList.remove("decho-cursor-visible");
      ring.classList.remove("is-large", "is-down");
    }
  });

  document.addEventListener("pointerover", (event) => {
    if (!(event.target instanceof Element)) return;
    ring.classList.toggle("is-large", Boolean(event.target.closest(
      "a, button, input, select, textarea, label, summary, [role='button'], [data-hover]"
    )));
  });

  document.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    ring.classList.add("is-down");
    if (reducedMotion.matches) return;

    const ripple = document.createElement("span");
    ripple.className = "decho-cursor-ripple";
    ripple.style.left = `${event.clientX}px`;
    ripple.style.top = `${event.clientY}px`;
    document.documentElement.append(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
  });

  window.addEventListener("pointerup", () => ring.classList.remove("is-down"));
  window.addEventListener("pointercancel", () => ring.classList.remove("is-down"));
})();
