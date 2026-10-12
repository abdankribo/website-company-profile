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

Build Next.js biasa: `npm run build`, lalu jalankan `npm start`.

## Deploy ke Cloudflare Workers (OpenNext)

Project ini memakai adapter `@opennextjs/cloudflare`. **Jangan gunakan `npm run build` sebagai satu-satunya Build command Cloudflare**, karena perintah tersebut hanya menjalankan `next build` dan belum menghasilkan worker di folder `.open-next/`.

Di Cloudflare Dashboard, buka Workers & Pages → Worker `decho` → Settings / Builds (Workers Builds), lalu atur:

- **Build command:** `npx @opennextjs/cloudflare build`
- **Deploy command:** `npx @opennextjs/cloudflare deploy`
- **Production branch:** `main`
- **Root directory:** kosongkan jika project berada di root repository.

Jika konfigurasi Cloudflare menggunakan command yang sudah tersedia di `package.json`, alternatifnya:
- Build command: `npm run cf:build`
- Deploy command: `npx @opennextjs/cloudflare deploy`

Build OpenNext akan menjalankan script `build` (`next build`) lalu mengonversi hasilnya agar dapat dijalankan di Cloudflare Workers. Deploy command OpenNext kemudian menerbitkan hasil tersebut. Konfigurasi Worker dan service binding berada di `wrangler.jsonc`; nama Worker dan `WORKER_SELF_REFERENCE` harus tetap cocok dengan `decho`.

Untuk menjalankan workflow melalui CLI, gunakan `npm run deploy`. Untuk pratinjau Cloudflare Workers, gunakan `npm run preview`.

## Deploy ke Vercel
Hubungkan repository ini ke Vercel dan pilih framework **Next.js**. Build command default `next build` sesuai untuk Vercel; tidak diperlukan database untuk versi company profile ini.

## Catatan
- Halaman Next.js berada di folder `app/`.
- File HTML statis lama masih dipertahankan sebagai referensi dan fallback GitHub Pages. Vercel akan menggunakan aplikasi Next.js setelah mendeteksi `package.json` dan folder `app/`.
- Video dan foto hero memakai URL eksternal.
- Email kontak pada halaman kontak saat ini adalah alamat contoh `info@nusantarasteel.example`; ganti dengan alamat resmi perusahaan sebelum dipublikasikan.
