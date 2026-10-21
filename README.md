# DECHO — Company Profile

Situs profil PT. Dermawan Charisma Olahkarya (DECHO), disajikan sebagai situs HTML statis responsif.

## Struktur proyek

- Halaman publik di root: Beranda, Tentang, Layanan, Proyek, dan Kontak.
- `proyek/` — halaman detail proyek yang ditautkan dari katalog proyek.
- `assets/css/`, `assets/js/`, dan `assets/images/` — stylesheet, skrip, dan gambar yang digunakan situs.
- `assets/css/decho-wave-background.css` dan `assets/js/decho-wave-background.js` — animasi gelombang latar di seluruh section; merespons kursor/klik dan menghormati preferensi reduced-motion.
- `assets/css/decho-logo-animation.css` dan `assets/js/decho-logo-animation.js` — animasi logo SVG yang markup-nya ditanam langsung di HTML beranda, tanpa iframe.
- `scripts/build-static.mjs` — menyalin halaman publik dan aset yang diterbitkan ke `dist/`.
- `app/` — sumber aplikasi Next.js terpisah; tidak disertakan dalam build situs statis.

## Build statis

Build membutuhkan Node.js dan dependensi yang tercantum di `package.json`.

```bash
npm install
npm run build:static
```

Hasil situs statis berada di `dist/`. Build menerbitkan halaman HTML root, katalog proyek dan halaman detailnya, serta folder `assets/`. Folder arsip, sumber aplikasi `app/`, konfigurasi, dan alat build tidak disalin ke situs.

## Deploy Cloudflare Workers

Konfigurasi `wrangler.jsonc` menggunakan `dist/` sebagai static assets. Jalankan build sebelum deploy:

```bash
npm run build:static
npx wrangler deploy
```

Build CI menjalankan `npm run build:static` dan memverifikasi jumlah halaman publik serta aset animasi logo dan latar gelombang.
