(() => {
  "use strict";

  const section = document.getElementById("decho-process");
  if (!section) return;

  const flow = document.getElementById("decho-process-flow");
  const list = document.getElementById("decho-process-steps");
  const steps = Array.from(list.querySelectorAll(".decho-process-step"));
  const wireBackground = section.querySelector(".decho-process-wire-bg");
  const wireProgress = section.querySelector(".decho-process-wire-progress");
  const gradient = section.querySelector("#decho-process-gradient");
  const currentNumber = section.querySelector("#decho-process-current-number");
  const currentTitle = section.querySelector("#decho-process-current-title");
  const segments = section.querySelector("#decho-process-segments");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeIndex = -1;
  let userInteracted = false;
  let distances = [0];

  const segmentButtons = steps.map((step, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", `${document.documentElement.lang === "en" ? "Show stage" : "Tampilkan tahap"} ${String(index + 1).padStart(2, "0")}`);
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => {
      userInteracted = true;
      setActive(index);
    });
    segments.append(button);
    return button;
  });

  function updateWire() {
    const bounds = flow.getBoundingClientRect();
    const points = steps.map((step) => {
      const icon = step.querySelector(".decho-process-icon").getBoundingClientRect();
      return {
        x: icon.left - bounds.left + icon.width / 2,
        y: icon.top - bounds.top + icon.height / 2
      };
    });

    if (!points.length) return;

    flow.querySelector(".decho-process-wire").setAttribute(
      "viewBox",
      `0 0 ${Math.max(1, bounds.width)} ${Math.max(1, bounds.height)}`
    );
    const path = `M${points.map((point) => `${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" L")}`;
    wireBackground.setAttribute("d", path);
    wireProgress.setAttribute("d", path);

    distances = [0];
    for (let index = 1; index < points.length; index++) {
      distances.push(
        distances[index - 1] +
        Math.hypot(points[index].x - points[index - 1].x, points[index].y - points[index - 1].y)
      );
    }
    gradient.setAttribute("x1", "0");
    gradient.setAttribute("x2", "0");
    gradient.setAttribute("y1", String(points[0].y));
    gradient.setAttribute("y2", String(points[points.length - 1].y));
    if (activeIndex >= 0) updateProgress();
  }

  function updateProgress() {
    wireProgress.setAttribute(
      "stroke-dasharray",
      `${distances[activeIndex] || 0} 99999`
    );
  }

  function syncLanguage() {
    const language = document.documentElement.lang === "en" ? "en" : "id";
    segments.setAttribute(
      "aria-label",
      language === "en" ? "Choose a project stage" : "Pilih tahap proses"
    );
    list.setAttribute(
      "aria-label",
      language === "en" ? "Project stages" : "Tahapan pelaksanaan proyek"
    );
    segmentButtons.forEach((button, index) => {
      button.setAttribute(
        "aria-label",
        `${language === "en" ? "Show stage" : "Tampilkan tahap"} ${String(index + 1).padStart(2, "0")}`
      );
    });

    const localizedTitle = currentTitle.getAttribute(`data-${language}`);
    if (localizedTitle) currentTitle.textContent = localizedTitle;
  }

  function setActive(index) {
    if (index < 0 || index >= steps.length || index === activeIndex) return;
    activeIndex = index;
    const step = steps[index];
    const accent = step.style.getPropertyValue("--process-accent").trim();
    const title = step.querySelector("h3");
    const titleId = title.getAttribute("data-id") || title.textContent;
    const titleEn = title.getAttribute("data-en") || title.textContent;

    steps.forEach((item, stepIndex) => {
      const selected = stepIndex === index;
      item.setAttribute("aria-pressed", String(selected));
      if (selected) item.setAttribute("aria-current", "step");
      else item.removeAttribute("aria-current");
    });

    section.style.setProperty("--process-accent", accent);
    currentNumber.textContent = String(index + 1).padStart(2, "0");
    currentTitle.setAttribute("data-id", titleId);
    currentTitle.setAttribute("data-en", titleEn);
    currentTitle.textContent = document.documentElement.lang === "en" ? titleEn : titleId;
    segmentButtons.forEach((button, buttonIndex) => {
      const color = steps[buttonIndex].style.getPropertyValue("--process-accent").trim();
      button.style.backgroundColor = buttonIndex <= index ? color : "";
      button.setAttribute("aria-pressed", String(buttonIndex === index));
    });
    updateProgress();
  }

  steps.forEach((step, index) => {
    const card = step.querySelector(".decho-process-card");
    const icon = step.querySelector(".decho-process-icon");

    step.addEventListener("pointerenter", () => {
      userInteracted = true;
      setActive(index);
    });

    step.addEventListener("focus", () => {
      userInteracted = true;
      setActive(index);
    });

    step.addEventListener("click", () => {
      userInteracted = true;
      setActive(index);
    });

    step.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty("--process-cx", `${event.clientX - bounds.left}px`);
      card.style.setProperty("--process-cy", `${event.clientY - bounds.top}px`);

      if (reducedMotion || event.pointerType === "touch") return;
      card.style.setProperty(
        "--process-ry",
        `${((event.clientX - bounds.left) / bounds.width - 0.5) * 9}deg`
      );
      card.style.setProperty(
        "--process-rx",
        `${((event.clientY - bounds.top) / bounds.height - 0.5) * -9}deg`
      );

      const iconBounds = icon.getBoundingClientRect();
      const dx = event.clientX - (iconBounds.left + iconBounds.width / 2);
      const dy = event.clientY - (iconBounds.top + iconBounds.height / 2);
      icon.style.transform = Math.hypot(dx, dy) < 150
        ? `translate(${dx * 0.18}px, ${dy * 0.18}px)`
        : "";
    });

    step.addEventListener("pointerleave", () => {
      card.style.setProperty("--process-rx", "0deg");
      card.style.setProperty("--process-ry", "0deg");
      icon.style.transform = "";
    });

    step.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        userInteracted = true;
        setActive(index);
      } else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        steps[Math.min(index + 1, steps.length - 1)].focus();
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        steps[Math.max(index - 1, 0)].focus();
      }
    });
  });

  section.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    section.style.setProperty("--process-x", `${event.clientX}px`);
    section.style.setProperty("--process-y", `${event.clientY}px`);
  });

  setActive(0);
  syncLanguage();
  new MutationObserver(syncLanguage).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"]
  });
  updateWire();
  if ("ResizeObserver" in window) new ResizeObserver(updateWire).observe(flow);
  else window.addEventListener("resize", updateWire);
  if (document.fonts?.ready) document.fonts.ready.then(updateWire);

  if (!reducedMotion) {
    const startDemo = () => {
      let index = 0;
      const advance = () => {
        if (userInteracted || index >= steps.length - 1) return;
        index++;
        setActive(index);
        window.setTimeout(advance, 1100);
      };
      window.setTimeout(advance, 1900);
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        startDemo();
      }, { threshold: 0.15 });
      observer.observe(section);
    } else {
      startDemo();
    }
  }
})();
