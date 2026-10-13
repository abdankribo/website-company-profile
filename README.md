# DECHO — Company Profile

Website profil PT. Dermawan Charisma Olahkarya (DECHO), dibuat sebagai situs HTML statis responsif dengan identitas visual biru, ungu, dan putih.

## Struktur proyek

- `pages/` — halaman HTML utama: Beranda, Tentang, Layanan, Proyek, Kontak, Berita, Keberlanjutan, dan Tim.
- `assets/css/` — stylesheet eksternal.
- `assets/js/` — JavaScript, termasuk `language.js` dan `ux-optimization.js`.
- `assets/images/` — logo dan gambar website.
- `proyek/` — halaman detail tiap proyek.
- `scripts/build-static.mjs` — menyiapkan keluaran statis untuk Cloudflare Workers.
- `app/` — dipertahankan apa adanya dan tidak diubah dalam reorganisasi ini.

File HTML lama di root dipertahankan sebagai halaman pengarah ke `pages/`, sehingga URL lama seperti `/tentang.html` dan `/layanan.html` tetap bisa digunakan.

## Build statis

Build membutuhkan Node.js:

```bash
npm run build:static
```

Hasil build berada di `dist/`. Script menyalin halaman pengarah root, folder `pages/`, `assets/`, dan `proyek/`.

## Deploy Cloudflare Workers

Konfigurasi `wrangler.jsonc` menggunakan folder `dist/` sebagai static assets. Di Cloudflare Workers Builds gunakan:

- Production branch: `main`
- Build command: `npm run build:static`
- Deploy command: `npx wrangler deploy`
- Root directory: `/`

## GitHub Pages

Atur GitHub Pages agar menerbitkan branch `main` dari root repository. Halaman utama tersimpan di `pages/`; file HTML di root menjaga kompatibilitas URL lama dan mengarahkan pengunjung ke halaman yang tersusun di folder tersebut.

## Catatan

Perubahan struktur di GitHub tidak otomatis berarti website Cloudflare sudah di-deploy ulang. Deployment tetap mengikuti pengaturan platform yang digunakan.
