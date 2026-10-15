# BEKALIN BISA by Manuk Emprit Team

> **Belajar, Bertumbuh, Berprestasi** — platform pembelajaran digital full-stack: materi terstruktur, latihan soal berskor backend, lab simulasi, ujian ber-mode terkunci, jadwal, konsultasi, dan panel guru/admin.

[![Status](https://img.shields.io/badge/status-MVP%20in%20development-orange)](https://github.com/AnandaAlifa/Bekalin-Bisa/issues)
[![Backend](https://img.shields.io/badge/backend-FastAPI-009688?logo=fastapi&logoColor=white)](backend/)
[![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20Vite-61DAFB?logo=vite&logoColor=white)](frontend/)
[![Tests](https://img.shields.io/badge/backend%20tests-59%20passed-brightgreen)](#pengujian)
[![License](https://img.shields.io/badge/license-unspecified-lightgrey)](#)

---

## Daftar Isi

- [Tentang](#tentang)
- [Fitur](#fitur)
- [Arsitektur](#arsitektur)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Konfigurasi](#konfigurasi)
- [Database](#database)
- [API Reference](#api-reference)
- [Autentikasi](#autentikasi)
- [Pengujian](#pengujian)
- [Struktur Proyek](#struktur-proyek)
- [Alur Pengembangan](#alur-pengembangan)
- [Tim](#tim)

## Tentang

BEKALIN BISA (sebelumnya PINTARA) adalah aplikasi full-stack untuk alur belajar sekolah: siswa membaca materi, mengerjakan latihan berskor backend, dan menjelajahi fitur pendukung. Prinsip keamanan inti: **kunci jawaban tidak pernah dikirim ke klien sebelum submit** — seluruh penilaian latihan dihitung di backend.

Proyek berstatus **MVP in development**. Dokumen acuan wajib:

| Dokumen | Peran |
|---|---|
| [`build/spec.md`](build/spec.md) | Kebutuhan produk, business rule, acceptance criteria |
| [`build/design.md`](build/design.md) | Spesifikasi UI/UX dan responsive design |
| [`build/task.md`](build/task.md) | Backlog, dependensi, urutan implementasi |
| [`AGENTS.md`](AGENTS.md) | Aturan engineering dan workflow proyek |

## Fitur

Semua fitur di bawah **sudah berjalan** pada kode saat ini.

### Alur Belajar Inti (terhubung backend)

- **Materi terstruktur** — mata pelajaran → bab/subbab → detail materi (isi + NOTE), dari PostgreSQL melalui REST API.
- **Latihan pilihan ganda** — soal diambil tanpa kunci jawaban; jawaban dikirim satu kali per attempt.
- **Penilaian di backend** — skor `round(benar / total × 100)` dihitung server; attempt dan jawaban per soal tersimpan di database.
- **Hasil transparan** — status benar/salah per soal, kunci jawaban, dan penjelasan ditampilkan setelah submit; tersedia aksi **Kerjakan ulang**.

### Autentikasi (terintegrasi penuh)

- **Registrasi & login** — form terhubung `POST /auth/register` dan `POST /auth/login` (JWT HS256, bcrypt), dengan state loading, error validasi/authentikasi, dan toggle tampil sandi.
- **Sesi token-based** — token di `sessionStorage`, diverifikasi ulang via `GET /users/me` saat refresh; route terlindungi oleh guard `RequireAuth`; logout bersih (hapus token + `POST /auth/logout`).

### Antarmuka (design language cinematic neo-brutalist)

- **Design system** — palet Indigo/Pink/Slate, font Inter, kelas `.bekalin-box` / `.bekalin-button`, animasi cinematic + dukungan `prefers-reduced-motion`.
- **Layout responsif** — desktop: sidebar + header sticky; mobile: bottom nav 5 item + bottom sheet **Lainnya**.
- **Materi** — grid mata pelajaran dengan icon & kategori, selector kelas; halaman detail bab + catatan pribadi.
- **Lab (Praktikin)** — 4 tab simulasi (Fisika, Biologi, Kimia, Astronomi) dengan panel gelap dan slider parameter.
- **Ujian** — mode ujian aktif (timer + radio jawaban) dan **exam lockdown** (deteksi blur/visibilitychange → overlay blokir).
- **Jadwal, Konsultasi, Profil** — jadwal mingguan, kartu Tes Minat Bakat & Magang Vokasi, form edit profil.
- **Panel Guru & Admin** — kartu aksi khusus per role (frontend); otorisasi per-role backend menyusul (lihat [Limitasi](#limitasi)).
- **Notifikasi** — modal info/success/error terpusat (NotificationContext).

> **Lupa Kata Sandi** masih placeholder — belum ada alur reset password di backend.

## Arsitektur

```text
┌──────────────────┐      HTTP JSON       ┌──────────────────┐      SQL       ┌────────────┐
│  React (Vite)    │ ───────────────────► │  FastAPI         │ ──────────────► │ PostgreSQL │
│  :5173           │ ◄─────────────────── │  :8000 /api/v1   │ ◄───────────── │ :5432      │
└──────────────────┘                      └──────────────────┘                └────────────┘
   SPA + Router                              Routers → Services →
   Auth JWT (sessionStorage)                 Models (SQLAlchemy) /
   Semua halaman terproteksi                 Auth: JWT HS256 + bcrypt
                                             Skor latihan dihitung di sini
```

Alur pengguna utama (materi → latihan → hasil):

```text
Login → Materi (/subjects)
 └─► Mata Pelajaran (/subjects/{id})
      └─► Bab & Subbab → Detail Materi (/lessons/{id})
           └─► Mulai Latihan (/lessons/{id}/practice)
                └─► Pilih jawaban → Kirim
                     └─► Hasil: skor, benar/salah, penjelasan (dari backend)
```

| Route | Halaman | Akses |
|---|---|---|
| `/login`, `/signup`, `/forgot` | Auth (lupa sandi = placeholder) | Publik |
| `/subjects` | Daftar mata pelajaran | Terlindungi |
| `/subjects/{id}` | Daftar bab & subbab + NOTE | Terlindungi |
| `/lessons/{id}` | Detail materi + **Mulai Latihan** | Terlindungi |
| `/lessons/{id}/practice` | Latihan soal → halaman hasil | Terlindungi |
| `/lab` | Lab simulasi (Praktikin) | Terlindungi |
| `/ujian` | Ujian tulis + exam lockdown | Terlindungi |
| `/jadwal`, `/konsul`, `/profil` | Jadwal, konsultasi, profil | Terlindungi |
| `/teacher`, `/admin` | Panel guru & admin sekolah | Terlindungi (role frontend) |

## Tech Stack

| Lapisan | Teknologi |
|---|---|
| Frontend | React 19, Vite, TypeScript, React Router 7 |
| Styling | CSS per komponen + CSS variables (design language BEKALIN BISA) |
| Icons | FontAwesome 6.4 (CDN) |
| Backend | Python 3.11+, FastAPI, Pydantic v2 |
| Database | PostgreSQL 14+ |
| ORM & migrasi | SQLAlchemy 2, Alembic |
| Autentikasi | JWT HS256 (PyJWT), bcrypt |
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

Isi `DATABASE_URL` (kredensial PostgreSQL) dan `SECRET_KEY` (wajib, ≥32 byte acak) di `.env` — detail di [Konfigurasi](#konfigurasi). File `.env` sudah masuk `.gitignore` dan **tidak boleh di-commit**.

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

Verifikasi: [`http://localhost:8000/api/v1/health`](http://localhost:8000/api/v1/health) → `{"status":"ok"}`. Swagger UI: [`http://localhost:8000/docs`](http://localhost:8000/docs).

### 5. Frontend (terminal terpisah)

```bash
cd frontend
npm install
npm run dev
```

Buka [`http://localhost:5173`](http://localhost:5173) — halaman Login tampil sebagai gerbang awal.

### 6. Coba alurnya

1. **Sign Up** akun baru (atau login — lihat [Autentikasi](#autentikasi)).
2. Setelah masuk: **Materi** → *Matematika* → bab → materi **Pengenalan Bilangan Bulat**.
3. Klik **Mulai Latihan**, kerjakan 5 soal, lalu **Kirim jawaban**.
4. Periksa hasil: skor dari backend, penjelasan per soal, dan tombol **Kerjakan ulang**.
5. Jelajahi tab lain: **Praktik & Lab**, **Ujian**, **Jadwal**, **Konsultasi**, **Profil**.

## Konfigurasi

Backend membaca `.env` dari folder `backend/` atau root repo (pydantic-settings).

| Variable | Lokasi | Default / Contoh | Keterangan |
|---|---|---|---|
| `DATABASE_URL` | `.env` (wajib) | `postgresql+psycopg://pintara:***@localhost:5432/pintara` | Koneksi PostgreSQL |
| `SECRET_KEY` | `.env` (wajib) | 64 karakter hex acak | Kunci HMAC JWT HS256 — buat dengan `python -c "import secrets; print(secrets.token_hex(32))"` |
| `CORS_ORIGINS` | `.env` (opsional) | `http://localhost:5173,http://127.0.0.1:5173` | Origin yang diizinkan CORS, dipisah koma |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `.env` (opsional) | `60` | Masa berlaku access token (menit) |
| `VITE_API_BASE_URL` | `frontend/.env` (opsional) | `http://localhost:8000/api/v1` | Base URL API untuk frontend |

> Jangan pernah menaruh kredensial nyata di `.env.example` — file contoh itu yang di-commit.

## Database

Skema dikelola penuh dengan Alembic ([`backend/alembic/`](backend/alembic/)):

| Tabel | Fungsi |
|---|---|
| `subjects`, `chapters`, `lessons` | Hirarki materi (`is_published`, `sort_order`, relasi CASCADE) |
| `questions` | Soal pilihan ganda: `options` (JSON), `correct_option` (hanya backend), `explanation` |
| `practice_attempts` | Ringkasan hasil: skor, jumlah benar/total, waktu submit |
| `practice_answers` | Jawaban per soal pada satu attempt |
| `users` | Akun autentikasi: email unik lowercase, `password_hash` (bcrypt), `role` CHECK (`student`/`admin`), timestamps |

Perintah berguna (dari `backend/`):

```bash
python -m alembic upgrade head                          # terapkan migrasi terbaru
python -m alembic revision --autogenerate -m "deskripsi" # buat migrasi baru
python -m app.db.seed                                    # isi data contoh (idempoten)
```

## API Reference

Base URL: `http://localhost:8000/api/v1` — Swagger UI lengkap di [`/docs`](http://localhost:8000/docs).

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/auth/register` | Pendaftaran akun — 201; role selalu `student`; duplikat email → 409 |
| POST | `/auth/login` | Login — 200 `{access_token, token_type, expires_in, user}`; kredensial salah → 401 generik |
| POST | `/auth/logout` | Logout kompatibilitas (stateless) |
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
- Format error konsisten: `{ "detail": "pesan" }` (`400` / `401` / `404` / `409` / `422`).

Contoh submit latihan:

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

Contoh login:

```http
POST /api/v1/auth/login
Content-Type: application/json

{ "email": "budi@student.sch.id", "password": "siswa123" }
```

## Autentikasi

Strategi: **JWT Bearer (HS256)** + **bcrypt**, stateless, access token 60 menit. Keputusan arsitektur lengkap: [`build/auth-architecture.md`](build/auth-architecture.md) (ADR-001).

### Cara kerja

1. **Registrasi** — `POST /auth/register` membuat akun (`role` dipaksa `student`, email dinormalisasi lowercase, duplikat → 409).
2. **Login** — `POST /auth/login` memverifikasi bcrypt dan mengembalikan access token + profil user. Kredensial salah selalu membalas **401 generik** `"Email atau password salah"` (tidak membedakan email tak dikenal vs password salah).
3. **Sesi** — frontend menyimpan token di `sessionStorage`; saat bootstrap/refresh, `AuthContext` memverifikasi via `GET /users/me` (401 → sesi dibersihkan).
4. **Route terlindungi** — guard `RequireAuth` mengarahkan unautentikasi ke `/login` dan kembali ke halaman asal setelah login. **Backend tetap memverifikasi token secara independen** — guard frontend bukan kontrol keamanan tunggal.
5. **Logout** — menghapus token, memanggil `POST /auth/logout`, dan mereset state UI.

### Akun demo (fallback client-side)

Untuk keperluan demo UI tanpa backend, tiga akun berikut tetap didukung lewat fallback `localStorage`:

| Role | Email | Password |
|---|---|---|
| Student | `budi@student.sch.id` | `siswa123` |
| Guru | `guru@school.sch.id` | `guru123` |
| Admin sekolah | `admin@school.sch.id` | `admin123` |

Akun backend yang didaftarkan melalui Sign Up atau `POST /auth/register` memakai JWT sungguhan dan tidak terikat fallback ini.

### Limitasi

Dokumentasi batasan MVP (sengaja, lihat ADR §8):

- **Logout stateless** — token yang sudah terbit tetap berlaku sampai kedaluarsa; tidak ada daftar blokir di server.
- **Tanpa refresh token** — setelah token kedaluarsa (60 menit), pengguna login ulang.
- **Tanpa rate limiting** pada endpoint login.
- **Role backend** baru `student` / `admin`; otorisasi per-role pada endpoint dan role `teacher`/`school_admin` menyusul.
- **Fallback demo** `localStorage` masih aktif — rencananya dihapus setelah data demo dimigrasikan ke backend.
- **Profil** yang diedit tersimpan lokal; `PATCH /users/me` (prioritas P2) belum diimplementasikan.
- **Lupa Kata Sandi** masih placeholder.

## Pengujian

**Backend** (butuh PostgreSQL aktif + `.env` terisi):

```bash
cd backend
python -m pytest tests -q
```

**59 test** mencakup: health, koneksi DB, CORS, model & API materi, model & API latihan (validasi, penilaian, edge case), alur E2E materi → latihan → hasil, serta autentikasi penuh — model user, registrasi, login & sesi JWT, proteksi `/users/me`, lifecycle E2E (register → login → akses terlindungi → logout), hashing bcrypt dengan salt unik, klaim token, state error, dan verifikasi tanpa kebocoran secret di respons.

**Frontend** (verifikasi statis — belum ada framework test FE):

```bash
cd frontend
npx tsc --noEmit   # type check
npm run lint       # oxlint
npm run build      # production build
```

## Struktur Proyek

```text
Bekalin-Bisa/
├── backend/
│   ├── app/
│   │   ├── api/routers/     # Endpoint REST (auth, users, content, practice)
│   │   ├── core/            # Settings & security (JWT, bcrypt)
│   │   ├── db/              # Session, Base, seed
│   │   ├── models/          # SQLAlchemy models (User, content, practice)
│   │   ├── schemas/         # Skema Pydantic
│   │   └── services/        # Logika bisnis: auth, content, penilaian
│   ├── alembic/             # Migrasi database
│   ├── tests/               # pytest (unit, API, E2E)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # common, layout (header/sidebar/bottom nav), materials
│   │   ├── contexts/        # AuthContext (JWT + fallback demo), NotificationContext
│   │   ├── pages/           # auth, Subjects, Chapters, Lesson, Practice, Lab, Ujian, Jadwal, Konsul, Profil, Teacher, Admin
│   │   ├── services/        # API client (api, auth, content, practice)
│   │   ├── styles/          # Global styles & design tokens BEKALIN BISA
│   │   └── types/           # Tipe TypeScript
│   └── package.json
├── build/                   # Spesifikasi, desain, backlog, ADR (bukan build output)
├── AGENTS.md
├── .env.example
└── README.md
```

> `build/` berisi dokumen proyek dan **harus ikut ter-track di git** — jangan menambahkannya ke `.gitignore`.

## Alur Pengembangan

Pekerjaan dikelola lewat [GitHub Issues](https://github.com/AnandaAlifa/Bekalin-Bisa/issues). Setiap issue mengikuti alur:

```text
Pilih issue → Implementasi → Verifikasi (test/build) → Review diff → Commit → Push → Update & tutup issue
```

- Commit menggunakan [Conventional Commits](https://www.conventionalcommits.org/): `feat(scope): deskripsi`.
- Issue hanya ditutup ketika acceptance criteria terverifikasi.

### Status pengembangan

- ✅ **TASK-001–015** — infrastruktur, content API, frontend materi/latihan, E2E alur belajar.
- ✅ **AUTH-001–007** (issue #26–#32) — autentikasi backend & frontend penuh: arsitektur (ADR-001), model user + migrasi, API registrasi/login/sesi, UI auth, integrasi sesi & proteksi route, test keamanan & E2E.
- ⏳ Backlog berikutnya mengikuti [`build/task.md`](build/task.md) — mis. otorisasi per-role, `PATCH /users/me`, rate limiting, migrasi akun demo ke backend.

## Tim

BEKALIN BISA dibangun oleh:

| Nama |
|---|
| Ananda Alifa |
| Gozali Gazza |
| Alifah |
| Muhammad Aryosa |
