# BEKALIN

> **Belajar, Bertumbuh, Berprestasi** — platform pembelajaran digital dengan materi terstruktur, latihan soal berskor backend, lab simulasi, ujian ber-mode terkunci, jadwal, konsultasi, dan panel guru/admin.

[![Status](https://img.shields.io/badge/status-in%20development-orange)](https://github.com/AnandaAlifa/Pintara/issues)
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

BEKALIN (sebelumnya PINTARA) adalah aplikasi full-stack untuk alur belajar: membaca materi, mengerjakan latihan berskor backend, dan menjelajahi fitur pendukung (lab simulasi, ujian, jadwal, konsultasi, profil, panel guru/admin). Kunci jawaban tidak pernah dikirim ke klien sebelum submit — penilaian latihan sepenuhnya di backend.

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

### UI BEKALIN (design language cinematic neo-brutalist)

- **Design system** — palet Indigo/Pink/Slate, font Inter, `.bekalin-box` / `.bekalin-button`, animasi cinematic (fade-in, pop-in, slide) + dukungan `prefers-reduced-motion`.
- **Layout responsif** — desktop: sidebar + header sticky; mobile: bottom nav 5 item + bottom sheet **Lainnya**.
- **Auth screens (client-side demo)** — Login, Sign Up (validasi emoji), Lupa Kata Sandi. State disimpan di `localStorage`; **bukan** autentikasi backend.
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
   Auth demo (localStorage)                  Models (SQLAlchemy) /
   Semua tab UI                              Skor latihan dihitung di sini
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
| Styling | CSS modules per komponen + CSS variables (design language BEKALIN) |
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
git clone https://github.com/AnandaAlifa/Pintara.git
cd BELAJARIN
```

### 2. Environment

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env   # opsional; default sudah menunjuk localhost:8000
```

Isi `DATABASE_URL` di `.env` sesuai kredensial PostgreSQL lokal Anda. Detail di [Konfigurasi](#konfigurasi). File `.env` tidak boleh di-commit.

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

> Tabel `users` untuk autentikasi backend **belum ada** — sedang direncanakan di issue [#26](https://github.com/AnandaAlifa/Pintara/issues/26)–[#32](https://github.com/AnandaAlifa/Pintara/issues/32).

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

> **Penting:** autentikasi saat ini **hanya client-side demo** di `AuthContext` (React + `localStorage`). Belum ada endpoint backend `/auth/register` atau `/auth/login`, belum ada tabel `users`, dan belum ada sesi/token server-side. Autentikasi backend yang sesungguhnya masih berupa issue terbuka ([#26](https://github.com/AnandaAlifa/Pintara/issues/26)–[#32](https://github.com/AnandaAlifa/Pintara/issues/32)).

### Akun demo

| Role | Email | Password |
|---|---|---|
| Student | `budi@student.sch.id` | `siswa123` |
| Guru | `guru@school.sch.id` | `guru123` |
| Admin sekolah | `admin@school.sch.id` | `admin123` |

Anda juga dapat mendaftar akun baru melalui **Sign Up** — akun disimpan di `localStorage` browser masing-masing.

### Perilaku saat ini

- Login/signup/logout ditangani `frontend/src/contexts/AuthContext.tsx`.
- Route terlindungi diarahkan ke `/login` oleh guard di `App.tsx` (client-side saja).
- Role (`student` / `teacher` / `school_admin`) mempengaruhi menu sidebar & bottom sheet, **tetapi tidak diamankan di backend**.
- Menyembunyikan menu admin di frontend **bukan** pengganti otorisasi backend.

## Pengujian

**Backend** (butuh PostgreSQL aktif + `.env` terisi):

```bash
cd backend
python -m pytest tests -q
```

Cakupan: health check, koneksi DB, CORS, model & API materi, model & API latihan (validasi, penilaian, edge case), serta alur integrasi end-to-end materi → latihan → hasil.

**Frontend** (verifikasi statis):

```bash
cd frontend
npx tsc --noEmit   # type check
npm run build      # production build
```

## Struktur Proyek

```text
Pintara/
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
│   │   ├── styles/          # Global styles & design tokens BEKALIN
│   │   └── types/           # Tipe TypeScript
│   └── package.json
├── build/                   # Spesifikasi, desain, backlog (bukan build output)
├── AGENTS.md
├── .env.example
└── README.md
```

> Catatan: `build/` berisi dokumen proyek dan **harus ikut ter-track di git** — jangan menambahkannya ke `.gitignore`.

## Alur Pengembangan

Pekerjaan dikelola lewat [GitHub Issues](https://github.com/AnandaAlifa/Pintara/issues). Setiap issue mengikuti alur:

```text
Pilih issue → Implementasi → Verifikasi (test/build) → Review diff → Commit → Push → Update & tutup issue
```

- Commit menggunakan [Conventional Commits](https://www.conventionalcommits.org/): `feat(scope): deskripsi`.
- Issue hanya ditutup ketika acceptance criteria terverifikasi.

### Issue terbuka yang direkomendasikan berikutnya

Autentikasi backend (dependensi satu sama lain, kerjakan berurutan):

| Issue | Task | Judul |
|---|---|---|
| [#26](https://github.com/AnandaAlifa/Pintara/issues/26) | AUTH-001 | Define Authentication Architecture |
| [#27](https://github.com/AnandaAlifa/Pintara/issues/27) | AUTH-002 | Implement User Model and Database Migration |
| [#28](https://github.com/AnandaAlifa/Pintara/issues/28) | AUTH-003 | Implement Registration API |
| [#29](https://github.com/AnandaAlifa/Pintara/issues/29) | AUTH-004 | Implement Login and Session Management API |
| [#30](https://github.com/AnandaAlifa/Pintara/issues/30) | AUTH-005 | Build Login and Registration UI |
| [#31](https://github.com/AnandaAlifa/Pintara/issues/31) | AUTH-006 | Integrate Authentication State and Route Protection |
| [#32](https://github.com/AnandaAlifa/Pintara/issues/32) | AUTH-007 | Authentication Security and End-to-End Tests |

## Tim

BEKALIN dibangun oleh:

| Nama |
|---|
| Ananda Alifa |
| Gozali Gazza |
| Alifah |
| Muhammad Aryosa |
