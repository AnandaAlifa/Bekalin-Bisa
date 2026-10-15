
# PINTARA — Software Design Specification

**Versi:** 1.2-draft  
**Status:** Draft untuk hackathon  
**Produk:** PINTARA  
**Tagline:** Belajar, Bertumbuh, Berprestasi  
**Prioritas MVP:** Materi pembelajaran dan praktik/latihan soal  
**Referensi desain:** `Untitled.pdf`

## 1. Tujuan

Dokumen ini mendefinisikan ruang lingkup MVP PINTARA, kebutuhan fungsional, aturan bisnis, arsitektur, rancangan API, dan kriteria penerimaan sebagai acuan implementasi serta pengujian.

PDF yang diberikan digunakan sebagai referensi struktur halaman. Detail visual yang belum jelas akan dikonfirmasi bersama tim UI/UX dan tidak dianggap sebagai keputusan final.

## 2. Ringkasan Produk

PINTARA adalah platform pembelajaran yang menyediakan materi berdasarkan mata pelajaran, bab, dan subbab, serta fitur praktik/latihan. Wireframe juga menampilkan halaman profil, jadwal, konsultasi, dan ujian tulis.

### Tujuan MVP

1. Pengguna dapat membuka aplikasi dan mengakses area belajar.
2. Pengguna dapat melihat daftar mata pelajaran, bab, dan subbab.
3. Pengguna dapat membaca materi pembelajaran.
4. Pengguna dapat mengerjakan latihan soal.
5. Backend memeriksa jawaban dan menghitung skor.
6. Sistem menyimpan hasil latihan sehingga dapat ditampilkan kembali.
7. Halaman tambahan dapat disiapkan sebagai placeholder jika waktu hackathon tidak mencukupi.

## 3. Referensi Halaman dari Wireframe

Wireframe PDF menampilkan:

1. Welcome dengan identitas PINTARA serta pilihan Login dan Sign Up.
2. Form login dan pendaftaran.
3. Dashboard dengan menu Materi dan Praktik.
4. Profil pengguna, avatar, email, username, dan bio.
5. Tombol Tambah Ujian, Lihat Hasil, Edit Materi, dan Menu Admin.
6. Daftar materi/mata pelajaran.
7. Daftar bab dan subbab.
8. Detail materi dengan area konten dan NOTE.
9. Halaman Praktikum/Praktik.
10. Jadwal Senin sampai Jumat.
11. Konsultasi: MBTI, Tes Minat Bakat, Tes Gaya Belajar, dan Info Magang.
12. Ujian Tulis: Kimia, Fisika, Matematika, dan Valorant.

**Hal yang perlu dikonfirmasi:** apakah “Valorant” merupakan kategori ujian yang disengaja atau placeholder; serta apakah “Manuk Emprit Prodaction Grup” merupakan footer/branding final dan bagaimana ejaan resminya.

## 4. Ruang Lingkup

### 4.1 P0 — Wajib untuk demo

- Struktur navigasi utama.
- Daftar mata pelajaran.
- Daftar bab dan subbab.
- Detail materi.
- Latihan pilihan ganda.
- Submit jawaban dan penilaian di backend.
- Penyimpanan hasil latihan.
- Integrasi frontend, backend, dan PostgreSQL.
- Loading state, error state, dan empty state untuk halaman utama.

### 4.2 P1 — Jika waktu mencukupi

- Login dan pendaftaran.
- Profil pengguna.
- Riwayat hasil latihan.
- Pembatasan akses admin.
- Pengelolaan materi dan soal.
- Penyesuaian visual berdasarkan desain final.

### 4.3 P2 — Di luar prioritas dua hari

- Sistem pembayaran dan langganan.
- Multi-tenant sekolah dan pengelolaan kontrak.
- Proctoring atau aplikasi ujian khusus.
- Video call konsultasi.
- Tes psikologi dengan penilaian tervalidasi.
- Rekomendasi berbasis AI.
- Analitik lanjutan dan notifikasi kompleks.

## 5. Pengguna dan Hak Akses

| Peran | Hak akses MVP |
|---|---|
| Guest | Membuka halaman awal dan autentikasi |
| Student | Melihat materi, mengerjakan latihan, melihat hasil sendiri, mengakses profil sendiri |
| Admin | Mengelola materi dan soal dasar serta melihat hasil sesuai cakupan demo |

Aturan:
- Role default pendaftaran adalah `student`.
- Pengguna tidak dapat menaikkan role sendiri melalui endpoint profil.
- Student hanya dapat mengakses hasil miliknya sendiri.
- Endpoint admin harus memeriksa role di backend.
- Menyembunyikan tombol admin di frontend bukan pengganti otorisasi backend.
- Jika autentikasi belum siap, batasan mode demo harus dijelaskan dan aplikasi tidak boleh diklaim siap produksi.

## 6. Arsitektur yang Diusulkan

### 6.1 Stack

| Lapisan | Teknologi | Fungsi |
|---|---|---|
| Frontend | React + Vite + TypeScript | UI web |
| Backend | Python + FastAPI | REST API |
| Database | PostgreSQL | Penyimpanan data |
| ORM | SQLAlchemy | Akses database |
| Migrasi | Alembic | Pengelolaan perubahan skema |
| Validasi | Pydantic | Validasi request/response |
| Testing | pytest | Pengujian backend |
| Dokumentasi API | OpenAPI/Swagger | Dokumentasi dan uji endpoint |

Stack ini merupakan rekomendasi teknis untuk MVP, bukan keputusan yang tertulis di PDF. Perubahan stack harus disepakati sebelum implementasi.

### 6.2 Diagram Arsitektur

React frontend → FastAPI REST API → PostgreSQL

Backend menggunakan pendekatan modular monolith: satu aplikasi dengan modul autentikasi, profil, materi, latihan, dan hasil. Microservices tidak diperlukan untuk MVP dua hari.

### 6.3 Struktur Direktori

    pintara/
    ├── frontend/
    │   └── src/
    │       ├── components/
    │       ├── pages/
    │       ├── services/
    │       └── types/
    ├── backend/
    │   ├── app/
    │   │   ├── main.py
    │   │   ├── api/
    │   │   ├── core/
    │   │   ├── db/
    │   │   ├── models/
    │   │   ├── schemas/
    │   │   └── services/
    │   ├── tests/
    │   └── requirements.txt
    ├── spec.md
    ├── task.md
    └── design.md

## 7. Model Data Awal

### 7.1 `users`

- `id`: primary key.
- `email`: unik dan wajib.
- `password_hash`: hash password, bukan password mentah.
- `username`: nama tampilan.
- `bio`: opsional.
- `role`: `student` atau `admin`.
- `created_at`, `updated_at`.

### 7.2 `subjects`

- `id`: primary key.
- `name`: nama mata pelajaran.
- `description`: opsional.
- `is_published`: status publikasi.

### 7.3 `chapters`

- `id`: primary key.
- `subject_id`: foreign key ke `subjects`.
- `title`: nama bab.
- `sort_order`: urutan bab.
- `is_published`: status publikasi.

### 7.4 `lessons`

- `id`: primary key.
- `chapter_id`: foreign key ke `chapters`.
- `title`: nama subbab/materi.
- `content`: isi materi.
- `note`: catatan opsional.
- `sort_order`: urutan.
- `is_published`: status publikasi.

### 7.5 `questions`

- `id`: primary key.
- `lesson_id`: foreign key ke `lessons` atau set latihan.
- `question_text`: pertanyaan.
- `options`: pilihan jawaban.
- `correct_option`: kunci jawaban untuk penggunaan backend.
- `explanation`: penjelasan opsional.
- `is_published`: status publikasi.

### 7.6 `practice_attempts`

- `id`: primary key.
- `user_id`: foreign key ke `users` jika autentikasi digunakan.
- `lesson_id` atau `practice_set_id`: referensi latihan.
- `score`: skor.
- `total_questions`: jumlah soal.
- `correct_answers`: jumlah benar.
- `submitted_at`: waktu submit.

### 7.7 `practice_answers` — Opsional

- `id`: primary key.
- `attempt_id`: foreign key ke `practice_attempts`.
- `question_id`: foreign key ke `questions`.
- `selected_option`: jawaban pengguna.
- `is_correct`: hasil pemeriksaan backend.

**Aturan penting:** endpoint daftar soal tidak boleh mengirim `correct_option`. Backend harus menghitung skor dari kunci jawaban yang tersimpan di database.

## 8. Kebutuhan Fungsional dan Acceptance Criteria

### AUTH-001 — Login

- Email dan password wajib diisi.
- Kredensial tidak valid menghasilkan pesan kesalahan yang jelas.
- Password disimpan dalam bentuk hash.
- Endpoint terlindungi menolak request tanpa autentikasi jika autentikasi telah diaktifkan.

### AUTH-002 — Pendaftaran

- Email harus valid dan unik.
- Role default adalah `student`.
- Pengguna tidak dapat memilih role `admin` melalui form pendaftaran.
- Password tidak disimpan dalam teks biasa.

### PROF-001 — Profil

- Profil menampilkan email dan username.
- Bio boleh kosong.
- Pengguna hanya dapat mengubah profil miliknya sendiri.

### CNT-001 — Daftar Mata Pelajaran

- API mengembalikan mata pelajaran yang boleh ditampilkan.
- Data kosong ditangani dengan empty state.
- Setiap mata pelajaran memiliki ID dan nama yang stabil.

### CNT-002 — Bab dan Subbab

- Bab terhubung ke mata pelajaran yang benar.
- Subbab terhubung ke bab yang benar.
- Urutan mengikuti `sort_order`.
- ID tidak ditemukan menghasilkan `404`, bukan server crash.

### CNT-003 — Detail Materi

- Detail berisi judul dan isi materi.
- NOTE ditampilkan jika tersedia.
- Materi yang belum dipublikasikan tidak ditampilkan pada endpoint pengguna biasa.
- Error dan konten kosong ditangani dengan baik.

### PRC-001 — Daftar Latihan

- Pengguna dapat melihat pertanyaan dan pilihan jawaban.
- Kunci jawaban tidak dikirim sebelum submit.
- Latihan kosong ditangani dengan empty state.

### PRC-002 — Penilaian Latihan

- Backend memvalidasi ID soal dan pilihan jawaban.
- Skor dihitung di backend, bukan dipercaya dari frontend.
- Input tidak valid menghasilkan error yang sesuai.
- Hasil mencakup jumlah benar, jumlah soal, skor, dan penjelasan jika tersedia.

### PRC-003 — Penyimpanan Hasil

- Hasil tersimpan setelah submit berhasil.
- Riwayat diurutkan dari terbaru.
- Jika autentikasi digunakan, student hanya dapat melihat riwayatnya sendiri.

### ADM-001 — Pengelolaan Konten

- Endpoint admin memeriksa role di backend.
- Field wajib divalidasi.
- Jika pengelolaan melalui UI terlalu memakan waktu, seed data dapat digunakan untuk demo dengan batasan yang dinyatakan secara terbuka.

### SCH-001 — Jadwal (opsional)

- Item dikelompokkan berdasarkan Senin sampai Jumat.
- Data kosong ditampilkan dengan jelas.
- Notifikasi/pengingat tidak termasuk MVP.

### CNS-001 — Konsultasi (opsional)

- Katalog menampilkan MBTI, Tes Minat Bakat, Tes Gaya Belajar, dan Info Magang sesuai wireframe.
- Booking, video call, dan konsultasi langsung tidak termasuk MVP.
- Jangan menyatakan hasil tes psikologis valid tanpa instrumen dan metode yang tervalidasi.

### EXM-001 — Ujian Tulis (opsional)

- Kategori ujian harus berasal dari data/configuration yang jelas.
- Nama “Valorant” perlu dikonfirmasi.
- Jika belum berfungsi, fitur diberi label belum tersedia atau diarahkan ke latihan yang benar-benar berjalan.

## 9. Rancangan API

Prefix: `/api/v1`

| Method | Endpoint | Fungsi | Prioritas |
|---|---|---|---|
| POST | `/auth/register` | Pendaftaran | P1 |
| POST | `/auth/login` | Login | P1 |
| GET | `/users/me` | Profil pengguna aktif | P1 |
| PATCH | `/users/me` | Ubah profil | P2 |
| GET | `/subjects` | Daftar mata pelajaran | P0 |
| GET | `/subjects/{subject_id}/chapters` | Daftar bab | P0 |
| GET | `/chapters/{chapter_id}/lessons` | Daftar subbab | P0 |
| GET | `/lessons/{lesson_id}` | Detail materi | P0 |
| GET | `/lessons/{lesson_id}/questions` | Daftar soal tanpa kunci | P0 |
| POST | `/lessons/{lesson_id}/attempts` | Submit jawaban dan hitung skor | P0 |
| GET | `/attempts/me` | Riwayat hasil | P1 |
| POST/PATCH | `/admin/lessons` | Pengelolaan materi | P1 |
| POST/PATCH | `/admin/questions` | Pengelolaan soal | P1 |
| GET | `/schedule` | Jadwal | P2 |
| GET | `/consultations` | Katalog konsultasi | P2 |
| GET | `/exams` | Daftar ujian | P2 |

`P0` wajib untuk alur demo; `P1` dikerjakan jika waktu mencukupi; `P2` boleh berupa placeholder.

### 9.1 Format Error

Contoh:

    {
      "detail": "Materi tidak ditemukan"
    }

Gunakan status HTTP yang sesuai: `400` untuk input tidak valid, `401` untuk belum login, `403` untuk tidak memiliki izin, `404` untuk resource tidak ditemukan, dan `500` untuk error server tak terduga. Jangan kirim stack trace atau rahasia ke frontend.

## 10. Kebutuhan Nonfungsional

### NFR-001 — Keamanan dasar
- Password di-hash menggunakan library yang sesuai.
- Rahasia disimpan melalui environment variable.
- `.env` tidak di-commit.
- Endpoint admin memeriksa role di backend.
- Request divalidasi di backend.

### NFR-002 — Integritas data
- Gunakan primary key, foreign key, dan constraint.
- Simpan hasil hanya setelah submit tervalidasi.
- Kegagalan request tidak boleh membuat hasil parsial yang tidak konsisten.

### NFR-003 — Kegunaan
- Tombol memiliki label yang jelas.
- Loading, error, dan empty state tersedia.
- Halaman detail menyediakan navigasi kembali.
- Form memberi pesan validasi yang mudah dipahami.

### NFR-004 — Maintainability
- Pisahkan router, model, schema, dan logika layanan.
- Gunakan nama fungsi dan variabel yang jelas.
- README harus menjelaskan cara menjalankan aplikasi.

## 11. Seed Data Demo

Siapkan setidaknya:
- 2 mata pelajaran.
- 2 bab per mata pelajaran.
- 2 subbab per bab.
- Materi singkat untuk setiap subbab.
- 3–5 soal pilihan ganda untuk satu latihan.
- Akun demo student dan admin jika autentikasi digunakan.

Jangan gunakan password pribadi untuk akun demo.

## 12. Definition of Done

MVP siap didemonstrasikan jika:

- [ ] Frontend dan backend dapat dijalankan.
- [ ] Backend terhubung ke PostgreSQL.
- [ ] Daftar mata pelajaran tampil dari API.
- [ ] Pengguna dapat membuka bab, subbab, dan materi.
- [ ] Pengguna dapat mengerjakan latihan.
- [ ] Skor dihitung oleh backend.
- [ ] Hasil disimpan dan dapat ditampilkan.
- [ ] Kunci jawaban tidak bocor sebelum submit.
- [ ] Error dan data kosong ditangani.
- [ ] Tidak ada credential di repository.
- [ ] Demo alur utama dapat dilakukan tanpa mengubah kode.

## 13. Risiko

| Risiko | Mitigasi |
|---|---|
| Waktu hanya dua hari | Prioritaskan materi → latihan → hasil |
| Desain final belum ada | Bangun struktur dahulu; styling disesuaikan kemudian |
| Integrasi terlambat | Sepakati kontrak API sejak awal |
| Database belum siap | Buat skema dan seed sedini mungkin |
| Autentikasi menyita waktu | Jadikan prioritas setelah alur belajar berjalan |
| Elemen wireframe ambigu | Konfirmasi item “Valorant”, footer, dan fungsi konsultasi |

## 14. Keputusan Terbuka

- [ ] Apakah “Valorant” benar kategori ujian?
- [ ] Apakah “Manuk Emprit Prodaction Grup” merupakan branding final?
- [ ] Apakah konsultasi harus interaktif atau cukup katalog?
- [ ] Apakah login dan sign up wajib berfungsi penuh saat demo?
- [ ] Apakah styling menggunakan CSS biasa atau framework CSS tertentu?
- [ ] Apakah avatar dapat diunggah atau cukup avatar default?
- [ ] Apakah admin perlu mengelola materi melalui UI atau cukup menggunakan seed data?

## 15. Autentikasi dan Manajemen Akun Pengguna

Bagian ini mendefinisikan kebutuhan autentikasi yang harus dipenuhi backend dan frontend. Autentikasi wajib ditangani oleh backend, bukan sekadar state frontend.

> Keputusan arsitektur autentikasi (strategi JWT Bearer, lifecycle, kontrak API, asesmen keamanan) terdokumentasi di [`build/auth-architecture.md`](auth-architecture.md) (ADR-001).

### 15.1 Gambaran Fitur

PINTARA harus menyediakan sistem autentikasi yang memungkinkan pengguna mendaftar, masuk, keluar, dan mengakses fitur sesuai status autentikasi. Autentikasi harus terintegrasi dengan pengalaman belajar yang ada: materi pembelajaran, video interaktif, lab interaktif, kuis, dan progres belajar bila fitur tersebut memerlukan akun pengguna.

### 15.2 Kebutuhan Fungsional

#### 15.2.1 Pendaftaran

- Pengguna dapat membuat akun melalui formulir pendaftaran.
- Field wajib mengikuti desain produk dan kebutuhan data pengguna yang ada.
- Backend harus memvalidasi seluruh field yang dikirim.
- Sistem harus menolak input tidak valid dan akun ganda sesuai identifier unik yang dipilih (misalnya email).
- Password tidak boleh disimpan dalam bentuk plaintext.
- Frontend harus menampilkan error validasi yang dapat dipahami.
- Setelah pendaftaran berhasil, sistem mengikuti alur autentikasi yang didefinisikan desain produk. Login otomatis setelah pendaftaran tidak boleh diasumsikan kecuali dinyatakan secara eksplisit.

#### 15.2.2 Login

- Pengguna terdaftar dapat masuk menggunakan identifier dan password sesuai desain produk.
- Backend harus memverifikasi kredensial secara aman.
- Kredensial tidak valid harus menghasilkan error autentikasi generik yang tidak mengungkapkan apakah akun ada.
- Form login harus menyediakan state loading, sukses, error validasi, dan error autentikasi.
- Field password harus mendukung show/hide password tanpa mengeksposnya di log atau pesan error.
- Percobaan login berulang harus tindakan proteksi penyalahgunaan yang wajar, seperti rate limiting bila didukung lingkungan deployment.

#### 15.2.3 Sesi dan Status Autentikasi

- Aplikasi harus membedakan pengguna terautentikasi dan tidak terautentikasi.
- Endpoint backend yang terlindungi harus memverifikasi autentikasi secara independen.
- Halaman frontend yang terlindungi harus mengarahkan pengguna tidak terautentikasi ke halaman login.
- Memuat ulang halaman tidak boleh menciptakan status autentikasi yang tidak konsisten.
- Strategi sesi atau token yang dipilih harus terdokumentasi.
- Jika autentikasi berbasis cookie digunakan, pengaturan keamanan cookie dan proteksi CSRF harus ditangani secara tepat.
- Jika bearer token digunakan, masa berlaku token, penyimpanan, pembaruan, dan perilaku logout harus didefinisikan. Token autentikasi jangka panjang tidak boleh disimpan di browser storage yang tidak aman tanpa asesmen keamanan eksplisit.

#### 15.2.4 Logout

- Pengguna terautentikasi dapat keluar.
- Setelah logout, frontend harus menghapus status autentikasi.
- Backend harus membatalkan sesi atau mekanisme refresh-token yang berlaku.
- Pengguna tidak lagi dapat mengakses resource terlindungi menggunakan kredensial yang dibatalkan.
- Aplikasi harus menyediakan navigasi yang jelas setelah logout.

#### 15.2.5 Integrasi Profil Pengguna

- Aplikasi harus menyediakan identitas pengguna terautentikasi yang stabil.
- Data khusus pengguna harus terkait dengan identitas backend pengguna terautentikasi.
- Pengguna tidak boleh dapat membaca atau mengubah data privat pengguna lain dengan mengubah identifier di sisi klien.
- Field profil tambahan harus mengikuti spesifikasi produk yang ada dan tidak boleh mengarang requirement wajib baru.

### 15.3 Kebutuhan Keamanan

- Password di-hash menggunakan algoritma password-hashing yang sesuai dan parameter yang aman.
- Autentikasi dan otorisasi harus diterapkan di backend.
- Secrets, password, dan token tidak boleh di-commit ke repository atau ditulis ke log aplikasi.
- Konfigurasi dan secrets harus disediakan melalui environment variable atau mekanisme secrets-management yang disetujui.
- Error autentikasi tidak boleh mengekspos detail implementasi sensitif.
- Validasi input harus dilakukan di backend, bahkan jika validasi frontend yang ekuisten sudah ada.
- Operasi database harus menggunakan parameterized query yang aman atau ORM yang ada.
- Endpoint autentikasi dan endpoint terlindungi harus memiliki automated tests.
- Implementasi harus mengikuti konvensi keamanan dan coding proyek yang ada.

### 15.4 Minimum Viable Product (MVP)

MVP autentikasi mencakup:

1. Pendaftaran dengan validasi backend.
2. Login dengan verifikasi kredensial.
3. Hashing password yang aman.
4. Strategi sesi atau token yang terdokumentasi.
5. Penanganan status autentikasi di frontend.
6. Perlindungan setidaknya satu route atau API endpoint terwakili yang terautentikasi.
7. Logout dan invalidasi kredensial yang sesuai.
8. Automated tests untuk alur autentikasi berhasil dan tidak berhasil.

Password reset, verifikasi email, social login, multi-factor authentication, dan manajemen role administratif berada di luar MVP kecuali diperlukan di tempat lain dalam spesifikasi yang ada.

### 15.5 Acceptance Criteria

- Seorang pengguna dapat mendaftar dengan data yang valid.
- Data pendaftaran tidak valid ditolak dengan error yang dapat dipahami.
- Akun ganda ditolak sesuai identifier unik yang didefinisikan.
- Password tidak disimpan dalam plaintext.
- Seorang pengguna dapat masuk dengan kredensial yang valid.
- Kredensial tidak valid tidak mengungkapkan apakah akun ada.
- Request tidak terautentikasi ke endpoint backend terlindungi ditolak.
- Request terautentikasi dapat mengakses resource terlindungi yang diizinkan.
- Logout menghapus status autentikasi klien dan membatalkan sesi atau kredensial refresh yang relevan jika berlaku.
- Status autentikasi berperilaku konsisten setelah refresh halaman sesuai strategi yang dipilih.
- Automated tests mencakup pendaftaran dan login berhasil, kredensial tidak valid, pendaftaran ganda, akses terlindungi, dan logout.
- Secrets autentikasi tidak di-hardcode di source code.

### 15.6 Batasan Teknis

- Frontend: React, Vite, dan TypeScript.
- Backend: Python dan FastAPI.
- Database: PostgreSQL dengan setup SQLAlchemy dan Alembic yang ada.
- Testing: gunakan pytest dan konvensi testing frontend yang ada.
- Perubahan skema database harus dikelola melalui migrasi Alembic.
- Implementasi harus memanfaatkan arsitektur dan UI design yang ada.
- Strategi autentikasi yang tepat harus dipilih setelah menginspeksi codebase dan kebutuhan deployment yang ada. Jangan mengimplementasikan lebih dari satu strategi autentikasi yang saling bersaing.

## 16. Riwayat Versi

| Versi | Perubahan |
|---|---|
| 1.3-draft | Menambahkan spesifikasi autentikasi dan manajemen akun pengguna (§15) |
| 1.2-draft | Menyesuaikan kebutuhan dengan wireframe PDF dan memprioritaskan materi serta praktik |
