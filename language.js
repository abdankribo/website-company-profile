/* Shared site-wide language support for all legacy HTML pages. */
(() => {
  const translations = {
    "Solusi Baja · Kekuatan untuk membangun masa depan":"Steel Solutions · Strength to build the future",
    "Beranda":"Home","Tentang Kami":"About Us","Layanan":"Services","Proyek Kami":"Projects","Proyek":"Projects","Tim Kami":"Our Team","Keberlanjutan":"Sustainability","Berita":"News","Kontak":"Contact",
    "Solusi baja untuk pembangunan":"Steel solutions for development","Membentuk baja,":"Shaping steel,","membangun masa depan.":"building the future.",
    "Menyediakan solusi baja terintegrasi melalui material berkualitas, pemrosesan presisi, fabrikasi, dan distribusi untuk mendukung pembangunan Indonesia.":"Providing integrated steel solutions through quality materials, precision processing, fabrication, and distribution to support Indonesia's development.",
    "Lihat Produk Baja":"Explore Steel Products","Kenali Kami":"About Us","GULIR UNTUK MENJELAJAH ↓":"SCROLL TO EXPLORE ↓",
    "Jelajahi NSI":"Explore NSI","Kenali perusahaan kami":"Get to know our company","Pilih informasi yang ingin Anda ketahui.":"Choose the information you would like to explore.",
    "Tentang Kami ↗":"About Us ↗","Profil dan nilai perusahaan.":"Company profile and values.","Proyek Kami ↗":"Our Projects ↗","Solusi baja untuk berbagai kebutuhan.":"Steel solutions for a variety of needs.","Layanan ↗":"Services ↗","Material, pemrosesan, dan fabrikasi.":"Materials, processing, and fabrication.",
    "Solusi baja terintegrasi untuk konstruksi, manufaktur, dan infrastruktur Indonesia.":"Integrated steel solutions for construction, manufacturing, and infrastructure in Indonesia.",
    "Jelajahi":"Explore","Informasi":"Information","Formulir konsultasi":"Consultation form","Dalam angka":"By the numbers","Kapasitas untuk membangun.":"Capacity to build.",
    "Sekilas gambaran perusahaan. Angka di bawah merupakan placeholder desain dan wajib diganti dengan data resmi sebelum publikasi.":"An overview of the company. The figures below are design placeholders and must be replaced with official data before publication.",
    "Tahun pengalaman":"Years of experience","Kategori produk baja":"Steel product categories","Solusi dan layanan":"Solutions and services","Fokus pada mutu":"Commitment to quality",
    "Profil Perusahaan":"Company Profile","Tentang Nusantara Steel Industries":"About Nusantara Steel Industries","Mitra solusi baja untuk konstruksi, manufaktur, dan infrastruktur.":"Your steel solutions partner for construction, manufacturing, and infrastructure.",
    "Tentang NSI":"About NSI","Lebih dari material.":"More than materials.","Mitra pembangunan Anda.":"Your building partner.",
    "Nusantara Steel Industries menyediakan material dan layanan baja untuk kebutuhan konstruksi, manufaktur, infrastruktur, serta berbagai proyek industri.":"Nusantara Steel Industries provides steel materials and services for construction, manufacturing, infrastructure, and a wide range of industrial projects.",
    "Dengan fokus pada mutu material, ketepatan proses, dan layanan yang responsif, kami berupaya menjadi mitra yang dapat diandalkan sejak pemilihan material hingga produk siap digunakan.":"With a focus on material quality, process precision, and responsive service, we strive to be a reliable partner from material selection through to the finished product.",
    "Mitra solusi baja":"Steel solutions partner","Material · Presisi · Keandalan":"Materials · Precision · Reliability",
    "Pilihan material baja untuk beragam kebutuhan":"Steel material options for a wide range of needs","Pemrosesan dan fabrikasi dengan fokus pada presisi":"Processing and fabrication focused on precision","Dukungan teknis dan distribusi yang dapat diandalkan":"Reliable technical support and distribution","Kenali Perusahaan Kami ↗":"Get to Know Our Company ↗",
    "Mitra Baja untuk Kebutuhan Industri":"Steel Partner for Industrial Needs","Layanan Kami":"Our Services","Solusi material baja":"Steel material solutions","Material Baja":"Steel Materials","Pemrosesan Material":"Material Processing","Fabrikasi":"Fabrication","Distribusi & Logistik":"Distribution & Logistics",
    "Infrastruktur":"Infrastructure","Industri & Manufaktur":"Industry & Manufacturing","Bangunan Komersial":"Commercial Buildings","Tim Konsultasi":"Consulting Team","Tim Operasional":"Operations Team","Tim Kemitraan":"Partnership Team",
    "Keselamatan Kerja":"Workplace Safety","Efisiensi Material":"Material Efficiency","Kemitraan Bertanggung Jawab":"Responsible Partnerships",
    "Memilih Material Baja":"Choosing Steel Materials","Perencanaan Material":"Material Planning","Kualitas dalam Setiap Tahap":"Quality at Every Stage",
    "Mari mulai percakapan.":"Let's start a conversation.","Siap berdiskusi?":"Ready to talk?","Butuh solusi untuk proyek Anda?":"Need a solution for your project?","Hubungi Kami":"Contact Us","Hubungi tim kami":"Contact our team","Kirim Email":"Send Email",
    "Solusi Baja":"Steel Solutions","Kekuatan untuk membangun masa depan":"Strength to build the future","Profil dan nilai perusahaan":"Company profile and values",
    "INDUSTRI · KONSTRUKSI · INFRASTRUKTUR":"INDUSTRY · CONSTRUCTION · INFRASTRUCTURE","Built for strength. Designed for progress.":"Built for strength. Designed for progress."
  };
  const reverse = new Map();
  Object.entries(translations).forEach(([id,en]) => { if (!reverse.has(en)) reverse.set(en,id); });
  const originalText = new WeakMap();
  function apply(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-id][data-en]").forEach(el => {
      const value = el.getAttribute("data-" + lang);
      if (value !== null) el.textContent = value;
    });
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent || parent.closest("script,style,noscript,textarea,input,select,option,button#langToggle,.lang-toggle")) continue;
      if (!originalText.has(node)) originalText.set(node, node.nodeValue || "");
      const base = originalText.get(node) || "";
      const trimmed = base.trim();
      if (!trimmed) continue;
      const value = lang === "en" ? (translations[trimmed] || trimmed) : (reverse.get(trimmed) || trimmed);
      if (value !== trimmed) node.nodeValue = base.replace(trimmed, value);
    }
    document.querySelectorAll("[title],[aria-label],[placeholder]").forEach(el => {
      ["title","aria-label","placeholder"].forEach(attr => {
        const val = el.getAttribute(attr); if (!val) return;
        const next = lang === "en" ? (translations[val] || val) : (reverse.get(val) || val);
        if (next !== val) el.setAttribute(attr,next);
      });
    });
    const btn = document.getElementById("langToggle");
    if (btn) { btn.textContent = lang === "id" ? "EN" : "ID"; btn.setAttribute("aria-label", lang === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"); }
    localStorage.setItem("nsi-language",lang);
  }
  window.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("nsi-language") === "en" ? "en" : "id";
    apply(saved);
    const btn = document.getElementById("langToggle");
    if (btn) btn.addEventListener("click", () => apply((document.documentElement.lang || "id") === "id" ? "en" : "id"));
    document.addEventListener("click", event => {
      const target = event.target.closest("[data-language]");
      if (target) apply(target.getAttribute("data-language") === "en" ? "en" : "id");
    });
  });
})();