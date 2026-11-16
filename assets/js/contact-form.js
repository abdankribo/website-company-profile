(() => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const $ = (id) => document.getElementById(id);
  const isEnglish = () => localStorage.getItem("decho-language") === "en";
  const text = (id, en) => isEnglish() ? en : id;
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
  const icon = (paths) => `<svg viewBox="0 0 24 24" class="tw-w-6 tw-h-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

  const projects = {
    "konstruksi-gudang": {
      number: "01",
      title: "Konstruksi Gudang",
      titleEn: "Warehouse Construction",
      description: "Dari persiapan lahan hingga MEP.",
      descriptionEn: "From site preparation through MEP.",
      icon: icon('<path d="M3 21V9l9-5 9 5v12"/><path d="M7 21v-8h10v8"/><path d="M7 17h10"/>'),
      services: ["Persiapan Lahan", "Pondasi", "Fabrikasi", "Pasang Atap", "Pasang Lantai & Dinding", "MEP"],
    },
    pelabuhan: {
      number: "02",
      title: "Sistem Moveable Bridge & Pra Sarana Pendukung Pelabuhan",
      titleEn: "Moveable Bridge System & Supporting Port Infrastructure",
      description: "Fabrikasi baja hingga commissioning test.",
      descriptionEn: "From steel fabrication through commissioning.",
      icon: icon('<path d="M3 20h18"/><path d="M5 20V8l7-4 7 4v12"/><path d="M5 12h14"/><path d="M9 20v-8M15 20v-8"/>'),
      services: ["Fabrikasi", "Galvanis & Pengecatan", "Pemasangan di Lapangan", "Test Beban", "MEP", "Commissioning Test"],
    },
    "rumah-hunian": {
      number: "03",
      title: "Rumah Hunian dan Renovasi",
      titleEn: "Residential Construction and Renovation",
      description: "Bangun baru atau renovasi hunian.",
      descriptionEn: "New home construction or renovation.",
      icon: icon('<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>'),
      services: ["Persiapan Lahan", "Pondasi", "Fabrikasi", "Pasang Atap", "Pasang Lantai & Dinding", "MEP"],
    },
  };

  const serviceTranslations = {
    "Persiapan Lahan": "Site Preparation",
    "Pondasi": "Foundation",
    "Fabrikasi": "Fabrication",
    "Pasang Atap": "Roof Installation",
    "Pasang Lantai & Dinding": "Floor & Wall Installation",
    "Galvanis & Pengecatan": "Galvanizing & Painting",
    "Pemasangan di Lapangan": "On-site Installation",
    "Test Beban": "Load Testing",
    "Commissioning Test": "Commissioning Test",
    "MEP": "MEP",
  };

  const projectList = $("projectList");
  const serviceSection = $("serviceSection");
  const serviceList = $("serviceList");
  const summary = $("summary");
  const error = $("formError");
  const toggleAll = $("toggleAll");
  let selectedProject = null;

  const checkboxes = () => Array.from(serviceList.querySelectorAll('input[type="checkbox"]'));
  const selectedServices = () => checkboxes().filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value);
  const projectTitle = (project) => text(project.title, project.titleEn);
  const serviceTitle = (service) => text(service, serviceTranslations[service] || service);

  const projectCardClasses = "tw-group tw-relative tw-flex tw-cursor-pointer tw-items-center tw-gap-4 tw-rounded-2xl tw-border tw-border-line tw-bg-white tw-p-4 tw-transition hover:-tw-translate-y-0.5 hover:tw-border-brand/50 hover:tw-shadow-lg has-[:checked]:tw-border-brand has-[:checked]:tw-bg-pale has-[:checked]:tw-ring-4 has-[:checked]:tw-ring-brand/10";
  projectList.innerHTML = Object.entries(projects).map(([key, project]) => `
    <label class="${projectCardClasses}">
      <input type="radio" name="project" value="${key}" class="tw-sr-only">
      <span class="tw-grid tw-h-12 tw-w-12 tw-shrink-0 tw-place-items-center tw-rounded-xl tw-bg-pale tw-text-brand tw-transition group-has-[:checked]:tw-bg-gradient-to-br group-has-[:checked]:tw-from-brand group-has-[:checked]:tw-to-violet group-has-[:checked]:tw-text-white">${project.icon}</span>
      <span class="tw-min-w-0 tw-flex-1"><span class="tw-block tw-text-[.7rem] tw-font-extrabold tw-tracking-widest tw-text-brand">${text("PROYEK", "PROJECT")} ${project.number}</span><span class="tw-block tw-font-bold tw-leading-snug tw-text-navy">${escapeHtml(projectTitle(project))}</span><span class="tw-block tw-mt-0.5 tw-text-xs tw-text-muted">${escapeHtml(text(project.description, project.descriptionEn))}</span></span>
      <span class="tw-grid tw-h-6 tw-w-6 tw-shrink-0 tw-place-items-center tw-rounded-full tw-border-2 tw-border-line tw-text-transparent tw-transition group-has-[:checked]:tw-border-brand group-has-[:checked]:tw-bg-brand group-has-[:checked]:tw-text-white"><svg viewBox="0 0 24 24" class="tw-h-3.5 tw-w-3.5" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg></span>
    </label>`).join("");

  const setStepState = (element, active) => {
    const activeClasses = ["tw-bg-gradient-to-r", "tw-from-brand", "tw-to-violet", "tw-text-white", "tw-border-transparent"];
    const idleClasses = ["tw-bg-white", "tw-text-muted", "tw-border-line"];
    element.classList.remove(...(active ? idleClasses : activeClasses));
    element.classList.add(...(active ? activeClasses : idleClasses));
  };

  function updateProgress() {
    const count = selectedServices().length;
    const hasContactInfo = $("name").value.trim() && /\S+@\S+\.\S+/.test($("email").value);
    const complete = {
      1: Boolean(selectedProject),
      2: Boolean(selectedProject && count),
      3: Boolean(selectedProject && count && hasContactInfo),
    };
    [1, 2, 3].forEach((step) => {
      setStepState(form.querySelector(`[data-dot="${step}"]`), complete[step]);
      const bar = form.querySelector(`[data-bar="${step}"]`);
      if (bar) {
        bar.classList.toggle("tw-bg-brand", Boolean(complete[step + 1]));
        bar.classList.toggle("tw-bg-line", !complete[step + 1]);
      }
    });
  }

  function renderSummary() {
    if (!selectedProject) return;
    const project = projects[selectedProject];
    const selected = selectedServices();
    const total = project.services.length;
    $("sumTitle").textContent = projectTitle(project);
    $("sumCount").textContent = `${selected.length} / ${total} ${text("bagian", "parts")}`;
    $("sumBar").style.width = `${(selected.length / total) * 100}%`;
    $("sumChips").innerHTML = selected.length
      ? selected.map((service) => `<span class="tw-animate-pop tw-rounded-full tw-bg-white/15 tw-px-3 tw-py-1 tw-text-xs tw-font-semibold">${escapeHtml(serviceTitle(service))}</span>`).join("")
      : `<span class="tw-text-xs tw-text-white/60">${text("Belum ada bagian yang dipilih", "No work items selected yet")}</span>`;
    toggleAll.textContent = selected.length === total ? text("Hapus semua", "Clear all") : text("Pilih semua", "Select all");
    updateProgress();
  }

  projectList.addEventListener("change", (event) => {
    if (event.target.name !== "project") return;
    selectedProject = event.target.value;
    const project = projects[selectedProject];
    serviceList.innerHTML = project.services.map((service, index) => `
      <label class="tw-group tw-animate-rise tw-flex tw-cursor-pointer tw-items-center tw-gap-3 tw-rounded-xl tw-border tw-border-line tw-bg-white tw-p-3 tw-text-sm tw-font-semibold tw-text-navy tw-transition hover:tw-border-brand/50 hover:tw-shadow-md has-[:checked]:tw-border-transparent has-[:checked]:tw-bg-gradient-to-r has-[:checked]:tw-from-brand has-[:checked]:tw-to-violet has-[:checked]:tw-text-white has-[:focus-visible]:tw-ring-4 has-[:focus-visible]:tw-ring-brand/30" style="animation-delay:${index * 45}ms">
        <input type="checkbox" value="${escapeHtml(service)}" checked class="tw-sr-only">
        <span class="tw-grid tw-h-7 tw-w-7 tw-shrink-0 tw-place-items-center tw-rounded-lg tw-bg-pale tw-text-xs tw-font-extrabold tw-text-brand group-has-[:checked]:tw-bg-white/25 group-has-[:checked]:tw-text-white">${index + 1}</span>
        <span class="tw-flex-1 tw-leading-tight">${escapeHtml(serviceTitle(service))}</span>
        <svg viewBox="0 0 24 24" class="tw-h-4 tw-w-4 tw-scale-0 tw-transition group-has-[:checked]:tw-scale-100" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>
      </label>`).join("");
    serviceSection.classList.remove("tw-hidden");
    summary.classList.remove("tw-hidden");
    error.classList.add("tw-hidden");
    renderSummary();
  });

  serviceList.addEventListener("change", () => {
    error.classList.add("tw-hidden");
    renderSummary();
  });

  toggleAll.addEventListener("click", () => {
    const select = !checkboxes().every((checkbox) => checkbox.checked);
    checkboxes().forEach((checkbox) => { checkbox.checked = select; });
    renderSummary();
  });

  ["name", "email"].forEach((id) => $(id).addEventListener("input", updateProgress));
  updateProgress();

  function showError(message) {
    error.textContent = message;
    error.classList.remove("tw-hidden", "tw-animate-shake");
    void error.offsetWidth;
    error.classList.add("tw-animate-shake");
    error.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!selectedProject) return showError(text("Silakan pilih jenis proyek terlebih dahulu.", "Please select a project type first."));
    const selected = selectedServices();
    if (!selected.length) return showError(text("Pilih minimal satu bagian pekerjaan.", "Select at least one work item."));
    if (!form.reportValidity()) return;

    const english = isEnglish();
    const name = $("name").value.trim();
    const email = $("email").value.trim();
    const note = $("message").value.trim();
    const project = projects[selectedProject];
    const parts = selected.map(serviceTitle);
    const body = english
      ? `Hello DECHO team,\n\nI would like to discuss the following project.\n\nName: ${name}\nEmail: ${email}\n\nProject type: ${projectTitle(project)}\nRequired work items:\n${parts.map((part, index) => `${index + 1}. ${part}`).join("\n")}${note ? `\n\nAdditional notes:\n${note}` : ""}\n\nThank you.`
      : `Halo tim DECHO,\n\nSaya ingin berdiskusi mengenai proyek berikut.\n\nNama: ${name}\nEmail: ${email}\n\nJenis proyek: ${projectTitle(project)}\nBagian pekerjaan yang dibutuhkan:\n${parts.map((part, index) => `${index + 1}. ${part}`).join("\n")}${note ? `\n\nCatatan tambahan:\n${note}` : ""}\n\nTerima kasih.`;
    const subject = text("Permintaan Proyek", "Project Inquiry");
    window.location.href = `mailto:constructiondecho@gmail.com?subject=${encodeURIComponent(`${subject}: ${projectTitle(project)} - ${name}`)}&body=${encodeURIComponent(body)}`;
  });
})();
