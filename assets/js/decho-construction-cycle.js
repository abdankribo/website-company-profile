(() => {
  "use strict";

  const section = document.getElementById("decho-construction-cycle");
  if (!section) return;

  const orbit = section.querySelector("#decho-cycle-orbit");
  const nodes = Array.from(section.querySelectorAll(".decho-cycle-node"));
  const buttons = nodes.map((node) => node.querySelector(".decho-cycle-disc"));
  const segments = section.querySelector("#decho-cycle-segments");
  const hub = section.querySelector("#decho-cycle-hub");
  const heading = section.querySelector("#decho-cycle-current-title");
  const description = section.querySelector("#decho-cycle-current-description");
  const number = section.querySelector("#decho-cycle-current-number");
  const hubNumber = section.querySelector("#decho-cycle-hub-number");
  const hubTitle = section.querySelector("#decho-cycle-hub-title");
  const progressArc = section.querySelector("#decho-cycle-progress-arc");
  const ellipseOne = section.querySelector("#decho-cycle-ellipse-one");
  const ellipseTwo = section.querySelector("#decho-cycle-ellipse-two");
  const rotatingGroup = section.querySelector("#decho-cycle-rotating");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const arcQuarter = Math.PI * 230 / 2;
  const baseAngles = [-135, -45, 45, 135];
  const nodeSides = ["top", "top", "bottom", "bottom"];
  let activeIndex = -1;
  let rotation = 0;
  let rotationSpeed = 10;
  let lastFrame = performance.now();
  let isHot = false;
  let isVisible = false;
  let userInteracted = false;
  let autoTimer = 0;
  let resumeTimer = 0;
  let frame = 0;

  const segmentButtons = buttons.map((button, index) => {
    const segment = document.createElement("button");
    segment.type = "button";
    segment.setAttribute("role", "tab");
    segment.setAttribute("aria-selected", "false");
    segment.setAttribute("aria-controls", "decho-cycle-current-title");
    segment.setAttribute("aria-label", `${document.documentElement.lang === "en" ? "Show stage" : "Tampilkan tahap"} ${String(index + 1).padStart(2, "0")}`);
    segment.addEventListener("click", () => {
      interact();
      setActive(index);
    });
    segments.append(segment);
    return segment;
  });

  function stageText(button, language) {
    return {
      title: button.getAttribute(`data-title-${language}`) || button.getAttribute("data-title-id"),
      description: button.getAttribute(`data-description-${language}`) || button.getAttribute("data-description-id")
    };
  }

  function animateText(element, text) {
    element.textContent = text;
    element.classList.remove("decho-cycle-swap");
    void element.offsetWidth;
    element.classList.add("decho-cycle-swap");
  }

  function setActive(index) {
    if (index < 0 || index >= buttons.length || index === activeIndex) return;
    activeIndex = index;
    const button = buttons[index];
    const color = nodes[index].style.getPropertyValue("--cycle-color").trim();
    const language = document.documentElement.lang === "en" ? "en" : "id";
    const copy = stageText(button, language);

    section.style.setProperty("--cycle-accent", color);
    number.textContent = String(index + 1).padStart(2, "0");
    hubNumber.textContent = String(index + 1).padStart(2, "0");
    animateText(heading, copy.title);
    animateText(description, copy.description);
    animateText(hubTitle, copy.title);

    nodes.forEach((node, nodeIndex) => {
      node.classList.toggle("is-active", nodeIndex === index);
    });
    buttons.forEach((item, buttonIndex) => {
      segmentButtons[buttonIndex].setAttribute("aria-selected", String(buttonIndex === index));
      segmentButtons[buttonIndex].style.backgroundColor = buttonIndex <= index
        ? nodes[buttonIndex].style.getPropertyValue("--cycle-color").trim()
        : "";
    });

    progressArc.setAttribute("stroke-dasharray", `${index * arcQuarter} 5000`);
    ellipseOne.style.opacity = index % 2 === 0 ? "1" : ".28";
    ellipseTwo.style.opacity = index % 2 === 1 ? "1" : ".28";
    ellipseOne.style.strokeWidth = index % 2 === 0 ? "3.5" : "2";
    ellipseTwo.style.strokeWidth = index % 2 === 1 ? "3.5" : "2";
  }

  function syncLanguage() {
    const language = document.documentElement.lang === "en" ? "en" : "id";
    segments.setAttribute(
      "aria-label",
      language === "en" ? "Choose a construction stage" : "Pilih tahap siklus konstruksi"
    );
    buttons.forEach((button, index) => {
      const title = stageText(button, language).title;
      button.setAttribute(
        "aria-label",
        `${language === "en" ? "Stage" : "Tahap"} ${String(index + 1).padStart(2, "0")}: ${title}`
      );
      segmentButtons[index].setAttribute(
        "aria-label",
        `${language === "en" ? "Show stage" : "Tampilkan tahap"} ${String(index + 1).padStart(2, "0")}`
      );
    });

    if (activeIndex >= 0) {
      const copy = stageText(buttons[activeIndex], language);
      heading.textContent = copy.title;
      description.textContent = copy.description;
      hubTitle.textContent = copy.title;
    }
  }

  function interact() {
    userInteracted = true;
    window.clearTimeout(autoTimer);
    window.clearTimeout(resumeTimer);
    if (!reducedMotion) resumeTimer = window.setTimeout(schedule, 9000);
  }

  function schedule() {
    window.clearTimeout(autoTimer);
    if (reducedMotion || !isVisible) return;
    autoTimer = window.setTimeout(() => {
      if (!userInteracted) setActive((activeIndex + 1) % buttons.length);
      userInteracted = false;
      schedule();
    }, 3800);
  }

  function positionNodes() {
    nodes.forEach((node, index) => {
      const angle = (baseAngles[index] + rotation) * Math.PI / 180;
      const x = 50 + 38.33 * Math.cos(angle);
      const y = 50 + 38.33 * Math.sin(angle);
      node.style.setProperty("--cycle-x", x.toFixed(2));
      node.style.setProperty("--cycle-y", y.toFixed(2));

      const side = y < 47 ? "top" : y > 53 ? "bottom" : nodeSides[index];
      node.classList.toggle("decho-cycle-node-top", side === "top");
      node.classList.toggle("decho-cycle-node-bottom", side === "bottom");
    });
    rotatingGroup.setAttribute("transform", `rotate(${rotation.toFixed(2)} 300 300)`);
  }

  function animate(time) {
    if (!isVisible) {
      frame = 0;
      return;
    }
    const delta = Math.min((time - lastFrame) / 1000, .05);
    lastFrame = time;
    if (!reducedMotion) {
      // Keep the orbit visibly moving while hovered; pinning a stage pauses it.
      const targetSpeed = section.classList.contains("is-popover-pinned") ? 0 : isHot ? 2.4 : 10;
      rotationSpeed += (targetSpeed - rotationSpeed) * Math.min(delta * 3, 1);
      rotation = (rotation + rotationSpeed * delta) % 360;
      positionNodes();
    }
    frame = window.requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (frame || !isVisible) return;
    lastFrame = performance.now();
    frame = window.requestAnimationFrame(animate);
  }

  function setHot(value) {
    isHot = value;
    if (value) interact();
  }

  buttons.forEach((button, index) => {
    const node = nodes[index];
    node.addEventListener("pointerenter", () => {
      setHot(true);
      setActive(index);
    });
    node.addEventListener("pointerleave", () => setHot(false));
    button.addEventListener("focus", () => {
      interact();
      setActive(index);
    });
    button.addEventListener("click", () => {
      interact();
      setActive(index);
    });
    button.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowDown" &&
          event.key !== "ArrowLeft" && event.key !== "ArrowUp") return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
      const nextIndex = (index + direction + buttons.length) % buttons.length;
      buttons[nextIndex].focus();
    });
    node.addEventListener("pointermove", (event) => {
      if (reducedMotion || !finePointer) return;
      const bounds = button.getBoundingClientRect();
      const dx = event.clientX - (bounds.left + bounds.width / 2);
      const dy = event.clientY - (bounds.top + bounds.height / 2);
      button.style.transform = `translate(${dx * .22}px, ${dy * .22}px)`;
    });
    node.addEventListener("pointerleave", () => {
      button.style.transform = "";
    });
  });

  hub.addEventListener("click", () => {
    interact();
    setActive((activeIndex + 1) % buttons.length);
  });
  hub.addEventListener("pointerenter", () => setHot(true));
  hub.addEventListener("pointerleave", () => setHot(false));
  orbit.addEventListener("pointermove", (event) => {
    section.style.setProperty("--cycle-x", `${event.clientX}px`);
    section.style.setProperty("--cycle-y", `${event.clientY}px`);
    if (reducedMotion || !finePointer) return;
    const bounds = orbit.getBoundingClientRect();
    orbit.style.setProperty("--cycle-ry", `${((event.clientX - bounds.left) / bounds.width - .5) * 10}deg`);
    orbit.style.setProperty("--cycle-rx", `${((event.clientY - bounds.top) / bounds.height - .5) * -10}deg`);
  });
  orbit.addEventListener("pointerleave", () => {
    orbit.style.setProperty("--cycle-rx", "0deg");
    orbit.style.setProperty("--cycle-ry", "0deg");
  });

  setActive(0);
  syncLanguage();
  new MutationObserver(syncLanguage).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"]
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries.some((entry) => entry.isIntersecting);
      if (isVisible) {
        startAnimation();
        if (!autoTimer && !userInteracted) schedule();
      } else {
        window.clearTimeout(autoTimer);
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
      }
    }, { threshold: .05 });
    observer.observe(section);
  } else {
    isVisible = true;
    startAnimation();
    schedule();
  }
})();
