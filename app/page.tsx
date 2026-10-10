import Link from "next/link";

export default function Home() {
  return (
    <section className="hero homeOnly">
      <video className="heroVideo" autoPlay muted loop playsInline poster="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1800&q=80">
        <source src="https://videos.pexels.com/video-files/11887094/11887094-hd_1920_1080_25fps.mp4" type="video/mp4" />
      </video>
      <div className="heroShade" />
      <div className="container heroContent">
        <div className="eyebrow light"><span /> ENGINEERING STRENGTH · BUILDING TOMORROW</div>
        <h1>Steel solutions.<br /><em>Stronger future.</em></h1>
        <p>Nusantara Steel Industries menghadirkan solusi baja dan layanan pendukung untuk membangun industri, infrastruktur, dan masa depan yang lebih kuat.</p>
        <div className="actions">
          <Link href="/layanan" className="button primary">Jelajahi Layanan ↗</Link>
          <Link href="/tentang" className="button ghost">Kenali NSI</Link>
        </div>
        <div className="heroNote">— SOLID MATERIAL. RELIABLE PARTNERSHIP.</div>
      </div>
      <div className="heroBadge"><b>NSI</b><span>Strength in every structure</span></div>
    </section>
  );
}
