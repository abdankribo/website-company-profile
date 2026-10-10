"use client";

import { useEffect, useState } from "react";

const translations: Record<string, string> = {
  "Beranda": "Home", "Tentang Kami": "About Us", "Layanan": "Services", "Proyek": "Projects",
  "Tim Kami": "Our Team", "Keberlanjutan": "Sustainability", "Berita": "News", "Berita & Wawasan": "News & Insights",
  "Kontak": "Contact", "Hubungi Kami ↗": "Contact Us ↗", "Hubungi tim kami ↗": "Contact our team ↗",
  "Material baja berkualitas untuk masa depan Indonesia.": "Quality steel materials for Indonesia's future.",
  "Partner material baja dan solusi industri yang mengutamakan mutu, ketepatan, dan keberlanjutan.": "A steel materials and industrial solutions partner focused on quality, precision, and sustainability.",
  "Jelajahi": "Explore", "Mulai percakapan": "Start a Conversation",
  "Diskusikan kebutuhan material dan proyek Anda bersama tim NSI.": "Discuss your material and project needs with the NSI team.",
  "ENGINEERING STRENGTH · BUILDING TOMORROW": "ENGINEERING STRENGTH · BUILDING TOMORROW",
  "Nusantara Steel Industries menghadirkan solusi baja dan layanan pendukung untuk membangun industri, infrastruktur, dan masa depan yang lebih kuat.": "Nusantara Steel Industries delivers steel solutions and supporting services to build stronger industries, infrastructure, and a stronger future.",
  "Jelajahi Layanan ↗": "Explore Services ↗", "Kenali NSI": "Discover NSI",
  "Strength in every structure": "Strength in every structure",
  "MENGENAL NSI": "GET TO KNOW NSI", "MENGENAL NSI": "GET TO KNOW NSI",
  "Mitra solusi baja yang dapat diandalkan.": "Your reliable steel solutions partner.",
  "Kami menghubungkan kualitas material, layanan yang dapat diandalkan, dan kebutuhan nyata pelanggan.": "We connect material quality and reliable services with our customers' real-world needs.",
  "Visi": "Vision", "Menjadi mitra industri yang dipercaya untuk solusi material baja dan pertumbuhan berkelanjutan.": "To become a trusted industry partner for steel material solutions and sustainable growth.",
  "Misi": "Mission", "Mengutamakan mutu, membangun kemitraan terbuka, meningkatkan efisiensi, dan beradaptasi terhadap kebutuhan industri.": "To prioritize quality, build open partnerships, improve efficiency, and adapt to industry needs.",
  "Nilai Kami": "Our Values", "Integritas, keselamatan, kualitas, kolaborasi, dan tanggung jawab menjadi dasar pekerjaan.": "Integrity, safety, quality, collaboration, and accountability are the foundation of our work.",
  "LAYANAN KAMI": "OUR SERVICES", "Terintegrasi untuk kebutuhan baja.": "Integrated steel solutions for your needs.",
  "Dukungan dari pemilihan material hingga penyiapan kebutuhan proyek, dengan pendekatan fleksibel dan berorientasi pada mutu.": "Support from material selection to project preparation, with a flexible, quality-focused approach.",
  "Material Baja": "Steel Materials", "Dukungan pemilihan material untuk konstruksi, manufaktur, dan kebutuhan industri.": "Material selection support for construction, manufacturing, and industrial needs.",
  "Pemrosesan Material": "Material Processing", "Pemotongan dan penyiapan material sesuai spesifikasi proyek.": "Material cutting and preparation according to project specifications.",
  "Fabrikasi": "Fabrication", "Dukungan pengerjaan komponen dan struktur baja berdasarkan kebutuhan pelanggan.": "Fabrication support for steel components and structures based on customer requirements.",
  "Distribusi & Logistik": "Distribution & Logistics", "Koordinasi pemenuhan dan pengiriman material untuk mendukung proyek.": "Material fulfillment and delivery coordination to support projects.",
  "PORTOFOLIO & KAPABILITAS": "PORTFOLIO & CAPABILITIES", "Mendukung pekerjaan yang berdampak.": "Supporting projects that make an impact.",
  "Setiap proyek memiliki kebutuhan berbeda. Kami mengutamakan koordinasi yang jelas dan solusi material yang sesuai.": "Every project has different needs. We prioritize clear coordination and suitable material solutions.",
  "Infrastruktur": "Infrastructure", "Dukungan material untuk pengembangan infrastruktur dan fasilitas publik.": "Material support for infrastructure development and public facilities.",
  "Industri & Manufaktur": "Industry & Manufacturing", "Solusi material untuk fasilitas produksi, workshop, dan lingkungan industri.": "Material solutions for production facilities, workshops, and industrial environments.",
  "Bangunan Komersial": "Commercial Buildings", "Dukungan kebutuhan baja untuk bangunan dan fasilitas komersial.": "Steel support for commercial buildings and facilities.",
  "Tim Kami": "Our Team", "Kolaborasi adalah kekuatan.": "Collaboration is our strength.",
  "ORANG DI BALIK PROSES": "THE PEOPLE BEHIND THE PROCESS", "Hasil yang baik lahir dari koordinasi kuat antara pelanggan, tim operasional, dan mitra kerja.": "Great results come from strong coordination between customers, operations teams, and partners.",
  "Tim Konsultasi": "Consulting Team", "Membantu memahami kebutuhan material, ruang lingkup, dan prioritas pelanggan.": "Helping understand material needs, project scope, and customer priorities.",
  "Tim Operasional": "Operations Team", "Mendukung penyiapan pekerjaan dengan perhatian pada ketelitian dan keselamatan.": "Supporting work preparation with attention to precision and safety.",
  "Tim Kemitraan": "Partnership Team", "Menjaga komunikasi dan koordinasi agar proses kerja berjalan terarah.": "Maintaining communication and coordination for a smooth workflow.",
  "KOMITMEN KAMI": "OUR COMMITMENT", "Bertumbuh dengan tanggung jawab.": "Growing responsibly.",
  "Kemajuan industri perlu berjalan seiring keselamatan, efisiensi sumber daya, dan tanggung jawab lingkungan.": "Industrial progress must go hand in hand with safety, resource efficiency, and environmental responsibility.",
  "Keselamatan Kerja": "Workplace Safety", "Mendorong budaya kerja yang mengutamakan keselamatan dan prosedur bertanggung jawab.": "Promoting a work culture that prioritizes safety and responsible procedures.",
  "Efisiensi Material": "Material Efficiency", "Perencanaan dan penanganan material yang tertata untuk mengurangi pemborosan.": "Organized material planning and handling to reduce waste.",
  "Kemitraan Bertanggung Jawab": "Responsible Partnerships", "Membangun hubungan kerja yang terbuka dan berorientasi jangka panjang.": "Building open, long-term working relationships.",
  "INSIGHT NSI": "NSI INSIGHTS", "Cerita tentang industri yang terus bergerak.": "Stories from an ever-evolving industry.",
  "Informasi dan wawasan seputar material baja, konstruksi, serta perkembangan industri.": "Information and insights on steel materials, construction, and industrial developments.",
  "Memilih Material Baja": "Choosing Steel Materials", "Pertimbangkan fungsi, spesifikasi, lingkungan penggunaan, dan kebutuhan proyek.": "Consider function, specifications, operating environment, and project requirements.",
  "Perencanaan Material": "Material Planning", "Perencanaan matang membantu mendukung efisiensi dan mengurangi keterlambatan.": "Careful planning helps improve efficiency and reduce delays.",
  "Kualitas dalam Setiap Tahap": "Quality at Every Stage", "Pemeriksaan dan komunikasi konsisten mendukung hasil yang dapat diandalkan.": "Consistent inspections and communication help deliver reliable results.",
  "HUBUNGI NSI": "CONTACT NSI", "Mari mulai percakapan.": "Let's start a conversation.",
  "Ceritakan kebutuhan material atau proyek Anda. Tim kami siap membantu mengarahkan diskusi ke solusi yang tepat.": "Tell us about your material or project needs. Our team is ready to help you find the right solution.",
  "Diskusi Kebutuhan": "Discuss Your Needs", "Jelaskan jenis material, spesifikasi, jumlah, dan perkiraan waktu kebutuhan.": "Describe the material type, specifications, quantity, and expected timeline.",
  "Kemitraan Bisnis": "Business Partnerships", "Kami terbuka untuk berdiskusi dengan pelanggan, kontraktor, pemasok, dan mitra industri.": "We welcome discussions with customers, contractors, suppliers, and industry partners.",
  "Kirim Pertanyaan": "Send an Inquiry", "Gunakan tombol di bawah untuk mengirim pertanyaan melalui aplikasi email.": "Use the button below to send your inquiry by email.",
  "Beranda": "Home", "Bergerak dengan": "Moving with", "tujuan yang jelas.": "a clear purpose.",
  "Kami mengutamakan komunikasi, konsistensi, dan pemahaman kebutuhan pelanggan dalam setiap kemitraan.": "We prioritize communication, consistency, and understanding customer needs in every partnership.",
  "Siap berdiskusi?": "Ready to talk?", "Butuh solusi untuk proyek Anda?": "Need a solution for your project?",
  "Mari diskusikan kebutuhan material dan rencana pekerjaan Anda.": "Let's discuss your material needs and project plans.",
  "Kirim Email ↗": "Send Email ↗", "NUSANTARA STEEL INDUSTRIES": "NUSANTARA STEEL INDUSTRIES",
  "Built for strength. Designed for progress.": "Built for strength. Designed for progress.",
  "INDUSTRI · KONSTRUKSI · INFRASTRUKTUR": "INDUSTRY · CONSTRUCTION · INFRASTRUCTURE",
  "Halaman": "Page", "©": "©"
};

export default function LanguageToggle() {
  const [language, setLanguage] = useState<"id" | "en">("id");

  useEffect(() => {
    const saved = window.localStorage.getItem("nsi-language");
    const initial = saved === "en" ? "en" : "id";
    setLanguage(initial);
    document.documentElement.lang = initial;

    const applyTranslations = () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const parent = node.parentElement;
        if (!parent || parent.closest("script,style,noscript,textarea,input,select,option")) continue;
        const raw = node.nodeValue ?? "";
        const trimmed = raw.trim();
        if (!trimmed) continue;
        const translated = initialLanguageText(trimmed, document.documentElement.lang);
        if (translated !== trimmed) node.nodeValue = raw.replace(trimmed, translated);
      }
    };

    function initialLanguageText(value: string, lang: string) {
      if (lang === "en") return translations[value] ?? value;
      const original = Object.entries(translations).find(([, english]) => english === value)?.[0];
      return original ?? value;
    }

    applyTranslations();
    const observer = new MutationObserver(() => applyTranslations());
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, []);

  function changeLanguage(next: "id" | "en") {
    window.localStorage.setItem("nsi-language", next);
    document.documentElement.lang = next;
    setLanguage(next);
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node: Node | null;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent || parent.closest("script,style,noscript,textarea,input,select,option")) continue;
      const raw = node.nodeValue ?? "";
      const trimmed = raw.trim();
      if (!trimmed) continue;
      let replacement = trimmed;
      if (next === "en") replacement = translations[trimmed] ?? trimmed;
      else replacement = Object.entries(translations).find(([, english]) => english === trimmed)?.[0] ?? trimmed;
      if (replacement !== trimmed) node.nodeValue = raw.replace(trimmed, replacement);
    }
  }

  return (
    <div className="languageSwitch" aria-label="Choose language">
      <button type="button" onClick={() => changeLanguage("id")} aria-pressed={language === "id"}>ID</button>
      <span aria-hidden="true">/</span>
      <button type="button" onClick={() => changeLanguage("en")} aria-pressed={language === "en"}>EN</button>
    </div>
  );
}
