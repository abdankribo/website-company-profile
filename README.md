# Nusantara Steel Industries (NSI) — Company Profile

Website company profile Nusantara Steel Industries dengan **Next.js App Router, React, TypeScript, dan CSS responsif**. Desain menggunakan identitas korporat biru navy dengan aksen biru, video hero, navigasi lintas halaman, dan layout untuk desktop maupun mobile.

## Halaman Next.js
- `/` — Beranda, video hero, profil singkat, layanan, dan ajakan kontak.
- `/tentang` — Profil, visi, misi, dan nilai perusahaan.
- `/layanan` — Material baja, pemrosesan, fabrikasi, serta distribusi.
- `/proyek` — Area kapabilitas proyek.
- `/tim` — Tim dan pola kolaborasi.
- `/keberlanjutan` — Keselamatan, efisiensi material, dan kemitraan bertanggung jawab.
- `/berita` — Wawasan industri dan material.
- `/kontak` — Informasi untuk memulai diskusi melalui email.

## Menjalankan aplikasi
Gunakan Node.js 20.9 atau lebih baru:

1. Jalankan `npm install`.
2. Jalankan `npm run dev`.
3. Buka `http://localhost:3000`.

Build produksi: `npm run build`, lalu jalankan `npm start`.

## Deploy ke Vercel
Hubungkan repository ini ke Vercel dan pilih framework **Next.js**. Build command default adalah `next build`; tidak diperlukan database untuk versi company profile ini. Deployment tidak dilakukan sebagai bagian dari perubahan kode ini.

## Catatan
- Halaman Next.js berada di folder `app/`.
- File HTML statis lama masih dipertahankan sebagai referensi dan fallback GitHub Pages. Vercel akan menggunakan aplikasi Next.js setelah mendeteksi `package.json` dan folder `app/`.
- Video dan foto hero memakai URL eksternal.
- Email kontak pada halaman kontak saat ini adalah alamat contoh `info@nusantarasteel.example`; ganti dengan alamat resmi perusahaan sebelum dipublikasikan.
