(() => {
  "use strict";

  const aboutSection = document.querySelector("main.page-main > section#tentang");
  if (!aboutSection) {
    throw new Error("DECHO motto could not find the About section.");
  }

  const stage = document.createElement("section");
  stage.id = "decho-motto-stage";
  stage.className = "relative grid place-items-center overflow-hidden px-5 sm:px-10";
  stage.setAttribute("aria-label", "Motto DECHO");
  stage.innerHTML = `
    <div id="decho-motto-blueprint" aria-hidden="true"></div>
    <div id="decho-motto-glow" aria-hidden="true"></div>
    <section id="decho-motto-card" class="relative w-full max-w-5xl">
      <div id="decho-motto-card-inner">
        <h2 id="decho-motto-title" aria-label="Motto"></h2>
        <p id="decho-motto-quote" aria-label="Ini Tentang Kami, Ini tentang Kepercayaan."></p>
        <svg id="decho-motto-underline" viewBox="0 0 520 24" fill="none" aria-hidden="true">
          <path d="M4 14 C 70 4, 130 22, 200 12 S 330 4, 400 14 S 480 18, 516 8" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
        </svg>
        <button id="decho-motto-replay" type="button" data-hover>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>
          Tulis ulang
        </button>
      </div>
    </section>
  `;
  aboutSection.insertAdjacentElement("afterend", stage);

  const card = stage.querySelector("#decho-motto-card");
  const title = stage.querySelector("#decho-motto-title");
  const quote = stage.querySelector("#decho-motto-quote");
  const replay = stage.querySelector("#decho-motto-replay");
  const finePointer = matchMedia("(pointer: fine)").matches;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const letters = [];
  let active = false;
  let animationRunning = false;
  let animationFrame = 0;
  const pointer = { x: innerWidth / 2, y: innerHeight / 2 };
  const tilt = { x: 0, y: 0 };

  for (const character of "Motto") {
    const letter = document.createElement("span");
    letter.className = "decho-motto-letter";
    letter.textContent = character;
    letter.setAttribute("aria-hidden", "true");
    letter.motion = { x: 0, y: 0, rotation: 0 };
    title.append(letter);
    letters.push(letter);
  }

  const mottoText = "\u201CIni Tentang Kami, Ini tentang Kepercayaan.\u201D";
  mottoText.split(/(?<= )/).forEach((word, index) => {
    const span = document.createElement("span");
    span.className = "decho-motto-word";
    span.textContent = word;
    span.style.setProperty("--word-delay", `${index * 0.22}s`);
    span.setAttribute("aria-hidden", "true");
    span.dataset.hover = "";
    quote.append(span);
  });

  function replayWriting() {
    card.classList.remove("is-written");
    void card.offsetWidth;
    window.setTimeout(() => card.classList.add("is-written"), 120);
  }

  function animate() {
    if (!reducedMotion.matches && finePointer) {
      const bounds = stage.getBoundingClientRect();
      const localX = pointer.x - bounds.left;
      const localY = pointer.y - bounds.top;
      const targetX = active ? (localY / bounds.height - 0.5) * -7 : 0;
      const targetY = active ? (localX / bounds.width - 0.5) * 9 : 0;
      tilt.x += (targetX - tilt.x) * 0.08;
      tilt.y += (targetY - tilt.y) * 0.08;
      card.style.transform = `rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg)`;

      letters.forEach((letter) => {
        const bounds = letter.getBoundingClientRect();
        const x = bounds.left + bounds.width / 2 - letter.motion.x;
        const y = bounds.top + bounds.height / 2 - letter.motion.y;
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const distance = Math.hypot(dx, dy);
        let targetLetterX = 0;
        let targetLetterY = 0;
        let targetRotation = 0;

        if (active && distance < 220) {
          const force = 1 - distance / 220;
          targetLetterX = (dx / (distance || 1)) * force * 34;
          targetLetterY = (dy / (distance || 1)) * force * 34;
          targetRotation = (dx / 220) * 10;
        }

        letter.motion.x += (targetLetterX - letter.motion.x) * 0.14;
        letter.motion.y += (targetLetterY - letter.motion.y) * 0.14;
        letter.motion.rotation += (targetRotation - letter.motion.rotation) * 0.14;
        letter.style.transform = `translate(${letter.motion.x.toFixed(1)}px, ${letter.motion.y.toFixed(1)}px) rotate(${letter.motion.rotation.toFixed(1)}deg)`;
      });
    }

    animationFrame = requestAnimationFrame(animate);
  }

  replay.addEventListener("click", replayWriting);
  window.setTimeout(() => card.classList.add("is-written"), 500);

  if (finePointer) {
    stage.addEventListener("pointermove", (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      active = true;
      const bounds = stage.getBoundingClientRect();
      stage.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
      stage.style.setProperty("--my", `${event.clientY - bounds.top}px`);
    });

    stage.addEventListener("pointerleave", () => {
      active = false;
    });

    if (!reducedMotion.matches) {
      animationFrame = requestAnimationFrame(animate);
      animationRunning = true;
    }
  }

  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) {
      cancelAnimationFrame(animationFrame);
      animationRunning = false;
      card.style.transform = "";
      letters.forEach((letter) => { letter.style.transform = ""; });
      return;
    }
    if (finePointer && !animationRunning) {
      animationFrame = requestAnimationFrame(animate);
      animationRunning = true;
    }
  });
})();
