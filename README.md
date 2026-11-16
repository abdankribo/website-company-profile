# DECHO — Company Profile

Situs profil PT. Dermawan Charisma Olahkarya (DECHO), disajikan sebagai situs HTML statis responsif.

## Struktur proyek

- Halaman publik di root: Beranda, Tentang, Layanan, Proyek, dan Kontak.
- `proyek/` — halaman detail proyek yang ditautkan dari katalog proyek.
- `assets/css/`, `assets/js/`, dan `assets/images/` — stylesheet, skrip, dan gambar yang digunakan situs.
- `assets/css/decho-wave-background.css` dan `assets/js/decho-wave-background.js` — animasi gelombang latar di seluruh section; merespons kursor/klik dan menghormati preferensi reduced-motion.
- `assets/css/decho-home-hero.css` dan `assets/js/decho-home-hero.js` — hero beranda berupa kolase proyek bergerak (panggung 1920×1080 yang diskalakan), motto dwibahasa ID/EN, tanpa Tailwind CDN. Foto kolase: `assets/images/decho-hero-collage.jpg`. Hero memuat tombol MENU dan overlay navigasi sendiri; navbar situs di beranda baru muncul setelah hero terlewati (kelas `dh-home` dan `dh-nav-on` pada `<html>`).
- `assets/css/layanan-konstruksi.css` dan `assets/js/layanan-konstruksi.js` — infografis "Layanan Konstruksi Kami" pada halaman Layanan; isi layanan diedit pada data di dalam file JS.
- `assets/css/proyek-horizontal.css` dan `assets/js/proyek-horizontal.js` — halaman Proyek berupa arsip horizontal interaktif: tiga logo arsip (Moveable Bridge, Konstruksi Bangunan, Rumah Hunian) berjajar; klik satu logo membuka panel proyek memanjang ke kanan logo itu (`#hxArchive > #hxRail > .hx-cat > .hx-logo + .hx-panel > .hx-card`). Data proyek ditulis langsung di markup `proyek.html` (tautan `proyek/*.html` tidak berubah); `data-detail*` pada tombol Galeri tetap membuka dialog `proyek-detail.js`; tombol "Tahapan Pengerjaan" per kategori dirender `proyek-tabs.js`. Tautan langsung: `proyek.html#moveable-bridge`, `#konstruksi-bangunan`, `#rumah-hunian`. Frontal Frame tampil di dua kategori (Moveable Bridge dan Konstruksi Bangunan). `proyek-arsip.css` tetap dipakai untuk header halaman; `proyek-arsip.js` (lemari laci lama) tidak lagi dimuat.
- `assets/css/decho-sync.css` — penyelarasan kecil lintas halaman, dimuat paling akhir di `<head>`.
- `assets/css/decho-motion.css` dan `assets/js/decho-motion.js` — sistem motion & interaksi global (dimuat paling akhir di `<head>` semua halaman, termasuk `proyek/*.html`): token durasi/easing/jarak/stagger (`--dm-*`), reveal berkelompok sekali jalan (Intersection Observer), kursor kustom dot+ring, hover standar, dorongan magnetis tombol, state navbar saat scroll, dan fade transisi halaman. Menghormati `prefers-reduced-motion` dan nonaktif di perangkat sentuh. Elemen yang ingin dikecualikan: beri `data-dm="off"`. Menggantikan `decho-cursor.*` dan sistem reveal lama di `ux-optimization.*`.
- **Entrance hero Beranda** diatur token `--dh-*` di `assets/css/decho-home-hero.css` (durasi, jarak, jeda, awal kelompok). Dua kelompok: visual (fade) lalu konten (naik, satu arah). Aktif hanya bila JS menandai `.dh-init`; tanpa JS hero tampil penuh.
- **Infografis Layanan**: diputar sekali lalu stabil. Sorotan otomatis dimatikan (`CONFIG.autoplay` di `layanan-konstruksi.js`; ubah ke `true` untuk menyalakan lagi).
- **Kartu baru**: beri kelas `dm-card` agar otomatis memakai standar hover dan reveal global.
- `scripts/build-static.mjs` — menyalin halaman publik dan aset yang diterbitkan ke `dist/`.

## Build statis

Build membutuhkan Node.js dan dependensi yang tercantum di `package.json`.

```bash
npm install
npm run build:static
```

Hasil situs statis berada di `dist/`. Build menerbitkan halaman HTML root, katalog proyek dan halaman detailnya, serta folder `assets/`. Konfigurasi dan alat build tidak disalin ke situs.

## Deploy Cloudflare Workers

Konfigurasi `wrangler.jsonc` menggunakan `dist/` sebagai static assets. Jalankan build sebelum deploy:

```bash
npm run build:static
npx wrangler deploy
```

Build CI menjalankan `npm run build:static` dan memverifikasi jumlah halaman publik serta aset hero beranda, infografis layanan, dan latar gelombang.
