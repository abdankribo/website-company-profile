# Nusantara Steel Industries (NSI) — Company Profile

Website company profile Nusantara Steel Industries dengan identitas visual korporat biru navy, aksen biru-ungu, video hero, navigasi lintas halaman, dan layout responsif desktop maupun mobile.

## Sumber website

File HTML statis di root repository adalah sumber tampilan utama:
- `index.html` — Beranda.
- `tentang.html` — Profil, visi, misi, dan nilai perusahaan.
- `layanan.html` — Material baja, pemrosesan, fabrikasi, serta distribusi.
- `proyek.html` — Area kapabilitas proyek.
- `tim.html` — Tim dan pola kolaborasi.
- `keberlanjutan.html` — Keselamatan, efisiensi material, dan kemitraan bertanggung jawab.
- `berita.html` — Wawasan industri dan material.
- `kontak.html` — Informasi untuk memulai diskusi melalui email.
- `language.js` — Fitur bahasa yang digunakan oleh halaman HTML.

## Menyamakan Cloudflare dengan GitHub Pages

Cloudflare Worker `decho` sekarang dikonfigurasi untuk menerbitkan versi HTML statis yang sama dengan GitHub Pages, bukan halaman Next.js yang berbeda.

Di Cloudflare Dashboard → Worker `decho` → Settings / Builds (Workers Builds), gunakan:

- **Production branch:** `main`
- **Build command:** `npm run build:static`
- **Deploy command:** `npx wrangler deploy`
- **Root directory:** `/` jika repository dipakai langsung dari root.

Build statis menyalin seluruh file `.html` di root dan `language.js` ke folder `dist/`. Wrangler menerbitkan folder tersebut sebagai static assets. Konfigurasi deployment ada di `wrangler.jsonc`.

Setelah perubahan konfigurasi disimpan, jalankan ulang deployment dari `main`. Halaman Cloudflare menggunakan jalur file HTML seperti `/tentang.html`, sama seperti GitHub Pages. Perubahan konten pada file HTML sumber akan ikut diterbitkan pada deployment berikutnya.

## Menjalankan aplikasi

Untuk pratinjau website statis, gunakan Node.js dan jalankan:

1. `npm install`
2. `npm run build:static`

Folder `dist/` berisi file yang akan diterbitkan. File sumber HTML tetap berada di root repository.

Aplikasi Next.js di folder `app/` tetap ada sebagai versi aplikasi alternatif, tetapi tidak digunakan oleh deployment Cloudflare statis yang disetel agar sama dengan GitHub Pages.

## Catatan

- Halaman menggunakan beberapa gambar/video dan Google Fonts dari URL eksternal, sehingga aset eksternal tetap membutuhkan koneksi internet.
- Email kontak pada halaman kontak saat ini adalah alamat contoh `info@nusantarasteel.example`; ganti dengan alamat resmi perusahaan sebelum dipublikasikan.
