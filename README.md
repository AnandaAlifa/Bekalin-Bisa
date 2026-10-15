# BEKALIN BISA by Manuk Emprit Team

> **Belajar, Bertumbuh, Berprestasi** — platform pembelajaran digital dengan materi terstruktur, latihan soal berskor backend, lab simulasi, ujian ber-mode terkunci, jadwal, konsultasi, dan panel guru/admin.

[![Status](https://img.shields.io/badge/status-in%20development-orange)](https://github.com/AnandaAlifa/Bekalin-Bisa/issues)
[![Backend](https://img.shields.io/badge/backend-FastAPI-009688?logo=fastapi&logoColor=white)](backend/)
[![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20Vite-61DAFB?logo=vite&logoColor=white)](frontend/)
[![License](https://img.shields.io/badge/license-unspecified-lightgrey)](#)

---

## Daftar Isi

- [Tentang](#tentang)
- [Fitur yang Sudah Diimplementasikan](#fitur-yang-sudah-diimplementasikan)
- [Arsitektur & Alur](#arsitektur--alur)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Konfigurasi](#konfigurasi)
- [Database](#database)
- [API Reference](#api-reference)
- [Autentikasi (Saat Ini)](#autentikasi-saat-ini)
- [Pengujian](#pengujian)
- [Struktur Proyek](#struktur-proyek)
- [Alur Pengembangan](#alur-pengembangan)
- [Tim](#tim)

## Tentang

BEKALIN BISA (sebelumnya PINTARA) adalah aplikasi full-stack untuk alur belajar: membaca materi, mengerjakan latihan berskor backend, dan menjelajahi fitur pendukung (lab simulasi, ujian, jadwal, konsultasi, profil, panel guru/admin). Kunci jawaban tidak pernah dikirim ke klien sebelum submit — penilaian latihan sepenuhnya di backend.

Proyek berstatus **pengembangan MVP**. Dokumen acuan:

| Dokumen | Peran |
|---|---|
| [`build/spec.md`](build/spec.md) | Kebutuhan produk, business rule, acceptance criteria |
| [`build/design.md`](build/design.md) | Spesifikasi UI/UX dan responsive design |
| [`build/task.md`](build/task.md) | Backlog, dependensi, urutan implementasi |
| [`AGENTS.md`](AGENTS.md) | Aturan engineering dan workflow proyek |

## Fitur yang Sudah Diimplementasikan

Berikut fitur yang **sudah berjalan** di kode saat ini:

### Alur Belajar Inti (terhubung backend)

- **Materi terstruktur** — daftar mata pelajaran → bab/subbab → detail materi (isi + NOTE), dari PostgreSQL melalui REST API.
- **Latihan pilihan ganda** — soal diambil tanpa kunci jawaban; pengguna memilih jawaban lalu mengirim satu kali per attempt.
- **Penilaian di backend** — skor `benar / total × 100` dihitung server; attempt dan jawaban per soal tersimpan di database.
- **Hasil transparan** — status benar/salah per soal, kunci jawaban, dan penjelasan ditampilkan setelah submit; tersedia aksi **Kerjakan ulang**.

### UI BEKALIN BISA (design language cinematic neo-brutalist)

- **Design system** — palet Indigo/Pink/Slate, font Inter, `.bekalin-box` / `.bekalin-button`, animasi cinematic (fade-in, pop-in, slide) + dukungan `prefers-reduced-motion`.
- **Layout responsif** — desktop: sidebar + header sticky; mobile: bottom nav 5 item + bottom sheet **Lainnya**.
- **Auth screens** — Login & Sign Up terhubung backend (`/auth/login`, `/auth/register`) dengan state loading, error validasi/authentikasi, dan toggle tampil sandi; sesi token-based terintegrasi penuh (hydrasi `/users/me`, proteksi route, logout); Lupa Kata Sandi masih placeholder.
- **Materi** — grid mata pelajaran dengan icon & kategori, selector kelas, integrasi backend API; halaman detail bab + catatan pribadi (localStorage).
- **Lab (Praktikin)** — 4 tab simulasi (Fisika, Biologi, Kimia, Astronomi) dengan panel gelap, slider parameter, dan tombol simpan.
- **Ujian** — daftar ujian, mode ujian aktif (timer + radio jawaban), dan **exam lockdown** (deteksi blur/visibilitychange → overlay blokir).
- **Jadwal** — jadwal mingguan Senin–Jumat.
- **Konsultasi** — kartu Tes Minat Bakat + Info Magang Vokasi (notifikasi modal).
- **Profil** — form edit nama, username, bio (via AuthContext).
- **Panel Guru** — kartu Tambah Ujian, Lihat Hasil, Edit Materi (role `teacher` / `school_admin`).
- **Panel Admin** — status sumber materi + badge Aktif Resmi (role `school_admin`).
- **Notifikasi** — modal info/success/error terpusat (NotificationContext).

## Arsitektur & Alur

```text
┌──────────────────┐      HTTP JSON       ┌──────────────────┐      SQL      ┌────────────┐
│  React (Vite)    │ ───────────────────► │  FastAPI         │ ──────────────────► │ PostgreSQL │
│  :5173           │ ◄─────────────────── │  :8000 /api/v1   │ ◄──────────── │ :5432      │
└──────────────────┘                      └──────────────────┘               └────────────┘
   SPA + Router                              Routers → Services →
   Auth JWT (sessionStorage + /users/me)     Models (SQLAlchemy) /
   Semua tab UI                              Auth backend: JWT HS256 + bcrypt
                                             Skor latihan dihitung di sini
```

Alur pengguna utama (materi → latihan → hasil):

```text
Login (demo) → Materi (/subjects)
 └─► Mata Pelajaran (/subjects/{id})
      └─► Bab & Subbab → Detail Materi (/lessons/{id})
           └─► Mulai Latihan (/lessons/{id}/practice)
                └─► Pilih jawaban → Kirim
                     └─► Hasil: skor, benar/salah, penjelasan (dari backend)
```

| Route | Halaman |
|---|---|
| `/login` | Login (demo client-side) |
| `/signup` | Sign Up (demo client-side) |
| `/forgot` | Lupa Kata Sandi |
| `/subjects` | Materi — daftar mata pelajaran |
| `/subjects/{id}` | Daftar bab & subbab + NOTE |
| `/lessons/{id}` | Detail materi + tombol **Mulai Latihan** |
| `/lessons/{id}/practice` | Latihan soal → halaman hasil |
| `/lab` | Lab simulasi (Praktikin) |
| `/ujian` | Ujian tulis + exam lockdown |
| `/jadwal` | Jadwal belajar |
| `/konsul` | Konsultasi & karier |
| `/profil` | Profil pengguna |
| `/teacher` | Panel guru (role teacher/admin) |
| `/admin` | Menu admin sekolah (role school_admin) |

## Tech Stack

| Lapisan | Teknologi |
|---|---|
| Frontend | React 19, Vite, TypeScript, React Router |
| Styling | CSS modules per komponen + CSS variables (design language BEKALIN BISA) |
| Icons | FontAwesome 6.4 (CDN) |
| Backend | Python, FastAPI, Pydantic |
| Database | PostgreSQL |
| ORM & migrasi | SQLAlchemy 2, Alembic |
| Testing | pytest + FastAPI TestClient |

## Quick Start

### Prasyarat

- Node.js 18+ dan npm
- Python 3.11+
- PostgreSQL 14+ berjalan lokal (port default `5432`)

### 1. Clone

```bash
git clone https://github.com/AnandaAlifa/Bekalin-Bisa.git
cd Bekalin-Bisa
```

### 2. Environment

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env   # opsional; default sudah menunjuk localhost:8000
```

Isi `DATABASE_URL` dan `SECRET_KEY` di `.env` sesuai lingkungan lokal Anda (lihat [Konfigurasi](#konfigurasi)). File `.env` tidak boleh di-commit.

### 3. Database

Buat role dan database sekali saja (via `psql` atau pgAdmin):

```sql
CREATE ROLE pintara LOGIN PASSWORD '<password-lokal-anda>';
CREATE DATABASE pintara OWNER pintara;
```

### 4. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate              # Windows — Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt
python -m alembic upgrade head
python -m app.db.seed               # data contoh: 2 mata pelajaran, 4 bab, 8 materi, 5 soal
python -m uvicorn app.main:app --reload
```

Verifikasi: buka [`http://localhost:8000/api/v1/health`](http://localhost:8000/api/v1/health) — harus `{"status":"ok"}`. Swagger UI: [`http://localhost:8000/docs`](http://localhost:8000/docs).

### 5. Frontend (terminal terpisah)

```bash
cd frontend
npm install
npm run dev
```

Buka [`http://localhost:5173`](http://localhost:5173) — halaman Login tampil sebagai gerbang awal.

### 6. Coba alurnya

1. Login dengan akun demo (lihat [Autentikasi](#autentikasi-saat-ini)) atau melakukan sign up.
2. Setelah masuk: **Materi** → *Matematika* → bab → materi **Pengenalan Bilangan Bulat**.
3. Klik **Mulai Latihan**, kerjakan 5 soal, lalu **Kirim jawaban**.
4. Periksa hasil: skor dari backend, penjelasan per soal, dan tombol **Kerjakan ulang**.
5. Jelajahi tab lain: **Praktik & Lab**, **Ujian**, **Jadwal**, **Konsultasi**, **Profil**.

## Konfigurasi

| Variable | Lokasi | Default / Contoh | Keterangan |
|---|---|---|---|
| `DATABASE_URL` | `.env` (root atau `backend/`) | `postgresql+psycopg://pintara:***@localhost:5432/pintara` | Koneksi PostgreSQL; dibaca `backend/app/core/config.py` (pydantic-settings) |
| `CORS_ORIGINS` | `.env` (opsional) | `http://localhost:5173,http://127.0.0.1:5173` | Origin yang diizinkan CORS |
| `SECRET_KEY` | `.env` (wajib) | 64 karakter hex acak | Kunci HMAC JWT HS256 (AUTH-004); buat dengan `python -c "import secrets; print(secrets.token_hex(32))"` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `.env` (opsional) | `60` | Masa berlaku access token dalam menit |
| `VITE_API_BASE_URL` | `frontend/.env` | `http://localhost:8000/api/v1` | Base URL API untuk frontend |

Backend membaca `.env` dari folder `backend/` atau root repo. Jangan pernah menaruh kredensial nyata di `.env.example`.

## Database

Skema dikelola penuh dengan Alembic (folder [`backend/alembic/`](backend/alembic/)):

| Tabel | Fungsi |
|---|---|
| `subjects`, `chapters`, `lessons` | Hirarki materi (`is_published`, `sort_order`, relasi CASCADE) |
| `questions` | Soal pilihan ganda: `options` (JSON), `correct_option` (hanya backend), `explanation` |
| `practice_attempts` | Ringkasan hasil: skor, jumlah benar/total, waktu submit |
| `practice_answers` | Jawaban per soal pada satu attempt |
| `users` | Akun autentikasi: email unik lowercase, `password_hash`, `role` CHECK (`student`/`admin`), timestamps |

> Tabel `users` sudah ada (migrasi `0bfcf7c5549f`, AUTH-002 / issue [#27](https://github.com/AnandaAlifa/Bekalin-Bisa/issues/27)); `POST /auth/register` sudah aktif (AUTH-003 / issue [#28](https://github.com/AnandaAlifa/Bekalin-Bisa/issues/28)). Endpoint login dan proteksi sesi server-side masih dikerjakan di issue [#29](https://github.com/AnandaAlifa/Bekalin-Bisa/issues/29)–[#32](https://github.com/AnandaAlifa/Bekalin-Bisa/issues/32).

Perintah berguna (dari `backend/`):

```bash
python -m alembic upgrade head          # terapkan migrasi terbaru
python -m alembic revision --autogenerate -m "deskripsi"   # buat migrasi baru
python -m app.db.seed                   # isi data contoh (idempoten)
```

## API Reference

Base URL: `http://localhost:8000/api/v1` — Swagger UI lengkap di [`/docs`](http://localhost:8000/docs).

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/auth/register` | Pendaftaran akun (201; role selalu `student`; duplikat email → 409) |
| POST | `/auth/login` | Login (200 `{access_token, token_type, expires_in, user}`; kredensial salah → 401 generik) |
| POST | `/auth/logout` | Logout kompatibilitas (stateless; FE menghapus token) |
| GET | `/users/me` | Profil pengguna aktif — terlindungi `Authorization: Bearer <token>` |
| GET | `/subjects` | Daftar mata pelajaran terpublikasi |
| GET | `/subjects/{subject_id}/chapters` | Daftar bab per mata pelajaran |
| GET | `/chapters/{chapter_id}/lessons` | Daftar subbab per bab |
| GET | `/lessons/{lesson_id}` | Detail materi (judul, isi, NOTE) |
| GET | `/lessons/{lesson_id}/questions` | Daftar soal **tanpa kunci jawaban** |
| POST | `/lessons/{lesson_id}/attempts` | Submit jawaban — backend memvalidasi, menghitung skor, dan menyimpan hasil |

Aturan penilaian:

- Skor dihitung di backend: `round(benar / total × 100)`. Nilai dari klien tidak pernah dipercaya.
- Kunci jawaban (`correct_option`) dan `explanation` hanya dikirim pada respons **submit**, tidak pada daftar soal.
- Format error konsisten: `{ "detail": "pesan" }` dengan status `400` / `404` / `422`.

Contoh submit:

```http
POST /api/v1/lessons/1/attempts
Content-Type: application/json

{
  "answers": [
    { "question_id": 1, "selected_option": "B" },
    { "question_id": 2, "selected_option": "A" }
  ]
}
```

## Autentikasi (Saat Ini)

> **Status:** autentikasi **sudah terintegrasi penuh** untuk MVP — backend lengkap (`/auth/register`, `/auth/login`, `/auth/logout`, `/users/me`, JWT HS256 + bcrypt) dan frontend menyimpan token di `sessionStorage`, menghydrasi sesi via `GET /users/me` saat refresh, melindungi route (`RequireAuth`), dan melakukan logout bersih (hapus token + panggil `/auth/logout`). Akun demo lama tetap didukung sebagai fallback client-side. Sisa pekerjaan: issue [#32](https://github.com/AnandaAlifa/Bekalin-Bisa/issues/32) (AUTH-007, test keamanan & E2E).
>
> Rincian keputusan arsitektur: [`build/auth-architecture.md`](build/auth-architecture.md) (ADR-001).

### Akun demo (frontend, localStorage)

| Role | Email | Password |
|---|---|---|
| Student | `budi@student.sch.id` | `siswa123` |
| Guru | `guru@school.sch.id` | `guru123` |
| Admin sekolah | `admin@school.sch.id` | `admin123` |

Anda juga dapat mendaftar akun baru melalui **Sign Up** — untuk sementara akun disimpan di `localStorage` browser masing-masing sampai integrasi AUTH-005/006 selesai. Registrasi backend (email apa pun, role `student`) dapat dicoba langsung via `POST /api/v1/auth/register`.

### Perilaku saat ini

- Form login mengirim ke `POST /auth/login`; form signup mengirim ke `POST /auth/register` (role selalu `student` di backend).
- Sesi disimpan sebagai JWT di `sessionStorage`; saat bootstrap/refresh, `AuthContext` memverifikasi token lewat `GET /users/me` (401 → bersihkan sesi).
- Route terlindungi diarahkan ke `/login` oleh guard `RequireAuth` di `App.tsx` (client-side saja) dan kembali ke halaman awal setelah login.
- Logout (sidebar & menu mobile) menghapus token, memanggil `POST /auth/logout`, dan mereset state UI.
- Akun demo lama (localStorage) tetap didukung sebagai fallback sampai dihapus pada iterasi berikutnya.
- Backend memverifikasi kredensial dan token secara independen (`GET /users/me` menolak tanpa Bearer token yang valid) — guard frontend bukan satu-satunya kontrol.
- Role frontend (`student` / `teacher` / `school_admin`) mempengaruhi menu sidebar & bottom sheet; role backend saat ini `student` / `admin` dan **otorisasi per-role belum diterapkan** di endpoint (lihat ADR §8).
- Menyembunyikan menu admin di frontend **bukan** pengganti otorisasi backend.

### Limitasi Autentikasi (terdokumentasi)

- **Logout stateless** — tidak ada invalidasi token server-side pada MVP; token yang sudah terbit tetap berlaku sampai kedaluarsa (lihat ADR §8). Logout FE menghapus token + memanggil `/auth/logout` untuk kompatibilitas.
- **Tanpa refresh token** — access token 60 menit (`ACCESS_TOKEN_EXPIRE_MINUTES`); setelah kedaluarsa, pengguna harus login ulang.
- **Rate limiting belum diterapkan** pada endpoint login (opsional, dapat ditambahkan bila diperlukan).
- **Role backend** baru `student` / `admin` (input klien dipaksa `student` saat registrasi); otorisasi per-role pada endpoint & role `teacher`/`school_admin` menyusul.
- **Akun demo lama** masih didukung fallback `localStorage` (tanpa token) — akan dibersihkan pada iterasi berikutnya.
- **Profil** yang diedit via halaman Profil disimpan lokal; `PATCH /users/me` (P2) belum diimplementasikan.
- **Lupa Kata Sandi** masih placeholder (tidak ada alur reset password di backend).

## Pengujian

**Backend** (butuh PostgreSQL aktif + `.env` terisi):

```bash
cd backend
python -m pytest tests -q
```

Cakupan: health check, koneksi DB, CORS, model & API materi, model & API latihan (validasi, penilaian, edge case), alur integrasi end-to-end materi → latihan → hasil, serta autentikasi penuh: model user, registrasi, login & sesi JWT, proteksi `/users/me`, dan lifecycle E2E (register → login → akses terlindungi → logout; hashing bcrypt dengan salt unik; klaim token; state error; tanpa kebocoran secret di respons).

**Frontend** (verifikasi statis):

```bash
cd frontend
npx tsc --noEmit   # type check
npm run build      # production build
```

## Struktur Proyek

```text
Bekalin-Bisa/
├── backend/
│   ├── app/
│   │   ├── api/routers/     # Endpoint REST (content, practice)
│   │   ├── core/            # Settings & konfigurasi
│   │   ├── db/              # Session, Base, seed
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Skema Pydantic
│   │   └── services/        # Logika bisnis & penilaian
│   ├── alembic/             # Migrasi database
│   ├── tests/               # Test pytest
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # common (Avatar, NotificationModal, StatusView), layout (header/sidebar/bottom nav/mobile more), materials
│   │   ├── contexts/        # AuthContext (demo client-side), NotificationContext
│   │   ├── pages/           # auth (Login/Signup/Forgot), Subjects, Chapters, Lesson, Practice, Lab, Ujian, Jadwal, Konsul, Profil, Teacher, Admin
│   │   ├── services/        # API client (api.ts, content.ts, practice.ts)
│   │   ├── styles/          # Global styles & design tokens BEKALIN BISA
│   │   └── types/           # Tipe TypeScript
│   └── package.json
├── build/                   # Spesifikasi, desain, backlog (bukan build output)
├── AGENTS.md
├── .env.example
└── README.md
```

> Catatan: `build/` berisi dokumen proyek dan **harus ikut ter-track di git** — jangan menambahkannya ke `.gitignore`.

## Alur Pengembangan

Pekerjaan dikelola lewat [GitHub Issues](https://github.com/AnandaAlifa/Bekalin-Bisa/issues). Setiap issue mengikuti alur:

```text
Pilih issue → Implementasi → Verifikasi (test/build) → Review diff → Commit → Push → Update & tutup issue
```

- Commit menggunakan [Conventional Commits](https://www.conventionalcommits.org/): `feat(scope): deskripsi`.
- Issue hanya ditutup ketika acceptance criteria terverifikasi.

### Issue terbuka yang direkomendasikan berikutnya

Fase autentikasi (**AUTH-001–007**, issue [#26](https://github.com/AnandaAlifa/Bekalin-Bisa/issues/26)–[#32](https://github.com/AnandaAlifa/Bekalin-Bisa/issues/32)) **selesai seluruhnya** — lihat [`build/auth-architecture.md`](build/auth-architecture.md) (ADR-001) dan bagian [Limitasi Autentikasi](#limitasi-autentikasi-terdokumentasi). Backlog berikutnya mengikuti [`build/task.md`](build/task.md) dan issue terbuka di repositori.

## Tim

BEKALIN BISA dibangun oleh:

| Nama |
|---|
| Ananda Alifa |
| Gozali Gazza |
| Alifah |
| Muhammad Aryosa |
