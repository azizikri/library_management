# Library Management (Laravel + Inertia.js + React)

Aplikasi manajemen perpustakaan dengan autentikasi berbasis sesi Laravel, Inertia.js (SPA feel), dan React. Menyediakan fitur CRUD Buku (admin), peminjaman buku (user), laporan + ekspor (Excel/PDF), kalkulasi biaya via External Service, serta RBAC (admin/user).

## Prasyarat (Minimal Install)

- PHP 8.2+ (disarankan via Homebrew/apt/choco)
- Composer 2+
- Node.js 18+ dan npm (untuk Vite dev server)
- SQLite3 (default DB)
- Ekstensi PHP:
  - pdo_sqlite, mbstring, tokenizer, ctype, openssl, json, fileinfo
  - soap (untuk integrasi kalkulator biaya) — opsional tapi direkomendasikan

## Jalur Cepat Menjalankan Aplikasi

1. Clone repo ini, lalu masuk ke folder aplikasi:
   ```bash
   git clone <url-repo>
   cd library_management
   ```
2. Install dependensi backend & frontend:
   ```bash
   composer install
   npm install
   ```
3. Siapkan environment & database SQLite:

   ```bash
   # jika file .env belum ada
   cp .env.example .env

   # generate key jika belum
   php artisan key:generate

   # buat file database SQLite
   mkdir -p database
   touch database/database.sqlite
   ```

4. Migrasi & seed data contoh (termasuk akun & buku & peminjaman acak):
   ```bash
   php artisan migrate --force --seed
   ```
5. Jalankan pengembangan (paling nyaman):

   - Opsi A (semua sekaligus) — butuh Node & npx:
     ```bash
     composer dev
     ```
     Perintah ini menjalankan: PHP server, queue listener, pail (log), dan Vite dev server secara paralel.
   - Opsi B (dua terminal terpisah):

     ```bash
     # Terminal 1
     php artisan serve

     # Terminal 2
     npm run dev
     ```

Setelah jalan, buka `http://127.0.0.1:8000`.

## Akun Uji (Seeder)

- Admin: `admin@gmail.com` / `password`
- User: `user@gmail.com` / `password`
- User 2: `user2@gmail.com` / `password`

RBAC secara otomatis mengarahkan:

- Admin → Dashboard (`/dashboard`)
- User → Borrowings (`/borrowings`)

## Fitur Utama

- Autentikasi (login/register) + verifikasi email
- RBAC: Admin (Books, Users, Dashboard), User (Borrowings), Bersama (Reports)
- CRUD Buku (Admin) — `/books`
- Peminjaman Buku (User) — `/borrowings`
- Laporan + Ekspor — `/reports`
  - Filter tanggal dan, untuk admin, filter User via dropdown
  - Ekspor Excel (Laravel Excel) & PDF (Dompdf)
  - Admin dapat “Return” peminjaman dari tabel (mengubah status jadi returned dan menambah stok tersedia)
- Kalkulasi biaya via SOAP calculator (WSDL: `http://www.dneonline.com/calculator.asmx?WSDL`)

## Alur Return (Pengembalian Buku)

- Admin buka halaman `Reports` → pilih User (opsional) → klik tombol `Return` pada baris peminjaman → konfirmasi pada popup → status berubah menjadi `returned` dan `available_quantity` buku bertambah.

## Pengaturan Database & SP (MySQL Opsional)

Secara default aplikasi menggunakan SQLite agar setup minimal. Jika ingin MySQL:

1. Atur `.env` ke `DB_CONNECTION=mysql` dan kredensial MySQL Anda.
2. Jalankan migrasi: `php artisan migrate --force --seed`.
3. Stored procedure laporan akan dibuat (migrasi akan mendefinisikan `sp_borrowings_report(start_date, end_date, user_id)`), dan digunakan pada laporan admin.

> Catatan: bila tetap di SQLite, controller otomatis fallback ke query Eloquent dengan hasil yang sama.

## Catatan Integrasi SOAP

- PHP extension `soap` diperlukan untuk memanggil kalkulator biaya. Jika belum aktif:
  - Ubuntu: `sudo apt-get install php-soap && sudo service php8.2-fpm restart` (versi PHP menyesuaikan)
  - macOS (Homebrew PHP): aktifkan/instal soap sesuai paket yang digunakan
- Aplikasi akan fallback ke perkalian lokal jika SOAP gagal, sehingga fitur tetap berjalan untuk dev.

## Troubleshooting Cepat

- 419 Page Expired saat fetch `/calculate-cost`:
  - Pastikan sudah login (route di-protect), refresh halaman untuk refresh CSRF token.
  - Kami sudah menambahkan header `X-CSRF-TOKEN` & `X-XSRF-TOKEN` pada fetch — pastikan cookie `XSRF-TOKEN` ada.
- Asset frontend tidak muncul:
  - Pastikan `npm run dev` berjalan (atau gunakan `composer dev`).
- SOAP gagal:
  - Aktifkan ekstensi `soap` atau gunakan fallback lokal (otomatis).

## Script Penting

- `composer dev` — jalankan PHP server, queue, pail (log), dan Vite secara paralel
- `composer dev:ssr` — mode SSR (opsional)
- `php artisan migrate --seed` — migrasi + seed data
- `npm run dev` — jalankan Vite dev server

## Struktur Route Utama

- `/login`, `/register`
- `/dashboard` (admin)
- `/books` (admin)
- `/users` (admin)
- `/borrowings` (user)
- `/reports` (admin & user)
