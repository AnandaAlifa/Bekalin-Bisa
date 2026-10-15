# PINTARA

> **Belajar, Bertumbuh, Berprestasi** — platform pembelajaran yang menyajikan materi terstruktur (mata pelajaran → bab → subbab → materi) dilengkapi latihan soal pilihan ganda dengan penilaian yang dihitung dan disimpan di backend.

[![Status](https://img.shields.io/badge/status-in%20development-orange)](https://github.com/AnandaAlifa/Pintara/issues)
[![Backend](https://img.shields.io/badge/backend-FastAPI-009688?logo=fastapi&logoColor=white)](backend/)
[![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20Vite-61DAFB?logo=vite&logoColor=white)](frontend/)
[![License](https://img.shields.io/badge/license-unspecified-lightgrey)](#)

---

## Daftar Isi

- [Tentang](#tentang)
- [Fitur Utama](#fitur-utama)
- [Arsitektur & Alur](#arsitektur--alur)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Konfigurasi](#konfigurasi)
- [Database](#database)
- [API Reference](#api-reference)
- [Pengujian](#pengujian)
- [Struktur Proyek](#struktur-proyek)
- [Alur Pengembangan](#alur-pengembangan)
- [Tim](#tim)

## Tentang

PINTARA dibangun sebagai aplikasi full-stack untuk alur belajar inti: membaca materi, mengerjakan latihan, dan melihat hasil yang divalidasi server. Kunci jawaban tidak pernah dikirim ke klien sebelum submit — penilaian sepenuhnya berada di backend.

Proyek saat ini berstatus **pengembangan MVP**. Dokumen acuan:

| Dokumen | Peran |
|---|---|
| [`build/spec.md`](build/spec.md) | Kebutuhan produk, business rule, acceptance criteria |
| [`build/design.md`](build/design.md) | Spesifikasi UI/UX dan responsive design |
| [`build/task.md`](build/task.md) | Backlog, dependensi, urutan implementasi |
| [`AGENTS.md`](AGENTS.md) | Aturan engineering dan workflow proyek |

## Fitur Utama

- **Dashboard** — titik masuk aplikasi dengan pintasan ke Materi dan Praktik.
- **Materi terstruktur** — daftar mata pelajaran → bab/subbab → detail materi (isi + catatan NOTE), seluruhnya dari PostgreSQL melalui REST API.
- **Latihan pilihan ganda** — soal diambil tanpa kunci jawaban; pengguna memilih jawaban lalu mengirim satu kali per attempt.
- **Penilaian di backend** — skor `benar / total × 100` dihitung server; attempt dan jawaban per soal tersimpan di database.
- **Hasil transparan** — status benar/salah per soal, kunci jawaban, dan penjelasan ditampilkan setelah submit; tersedia aksi **Kerjakan ulang**.
- **UI responsif** — mobile-first, mengikuti breakpoint 640px / 768px / 1024px dengan header dan footer konsisten di semua halaman.
- **Loading, error, dan empty state** — konsisten lewat komponen `StatusView`, termasuk aksi coba lagi.

## Arsitektur & Alur

```text
┌──────────────────┐      HTTP JSON       ┌──────────────────┐      SQL      ┌────────────┐
│  React (Vite)    │ ───────────────────► │  FastAPI         │ ────────────► │ PostgreSQL │
│  :5173           │ ◄─────────────────── │  :8000 /api/v1   │ ◄──────────── │ :5432      │
└──────────────────┘                      └──────────────────┘               └────────────┘
   SPA + Router                              Routers → Services →
   State & tampilan                          Models (SQLAlchemy) /
                                            Skor dihitung di sini
```

Alur pengguna utama:

```text
Dashboard (/)
 └─► Materi (/subjects)
      └─► Mata Pelajaran (/subjects/{id})
           └─► Bab & Subbab → Detail Materi (/lessons/{id})
                └─► Mulai Latihan (/lessons/{id}/practice)
                     └─► Pilih jawaban → Kirim
                          └─► Hasil: skor, benar/salah, penjelasan
```

| Route | Halaman |
|---|---|
| `/` | Dashboard |
| `/subjects` | Daftar mata pelajaran |
| `/subjects/{id}` | Daftar bab & subbab |
| `/lessons/{id}` | Detail materi + tombol **Mulai Latihan** |
| `/lessons/{id}/practice` | Latihan soal → halaman hasil |

## Tech Stack

| Lapisan | Teknologi |
|---|---|
| Frontend | React 19, Vite, TypeScript, React Router |
| Styling | CSS modules per komponen + CSS variables (desain dari `build/design.md`) |
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
cd Pintara
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

Buka [`http://localhost:5173`](http://localhost:5173) — Dashboard tampil sebagai halaman utama.

### 6. Coba alurnya

1. Dashboard → **Buka Materi** → *Matematika* → bab → materi **Pengenalan Bilangan Bulat**.
2. Klik **Mulai Latihan**, kerjakan 5 soal, lalu **Kirim jawaban**.
3. Periksa hasil: skor dari backend, penjelasan per soal, dan tombol **Kerjakan ulang**.

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
│   │   ├── components/      # StatusView, SubjectCard, layout (header/footer)
│   │   ├── pages/           # Dashboard, Subjects, Chapters, Lesson, Practice
│   │   ├── services/        # API client (api.ts, content.ts, practice.ts)
│   │   ├── styles/          # Global styles & design tokens
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

## Tim

PINTARA dibangun oleh:

| Nama |
|---|
| Ananda Alifa |
| Gozali Gazza |
| Alifah |
| Muhammad Aryosa |
