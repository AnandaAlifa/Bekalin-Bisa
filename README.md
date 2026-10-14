# PINTARA

**Belajar, Bertumbuh, Berprestasi**

Platform pembelajaran: materi berdasarkan mata pelajaran, bab, dan subbab, serta latihan soal dengan penilaian di backend.

## Status

Proyek dalam pengembangan. Backlog dan urutan pengerjaan ada di `build/task.md` (lokal saja, tidak di-upload ke GitHub); spesifikasi di `build/spec.md`; desain UI di `build/design.md`.

## Tech Stack

| Lapisan | Teknologi |
|---|---|
| Frontend | React + Vite + TypeScript |
| Backend | Python + FastAPI |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Migrasi | Alembic |
| Testing | pytest |

## Struktur Proyek

```text
Manuk_Emprit/
├── frontend/          # Aplikasi React (TASK-002)
├── backend/           # Aplikasi FastAPI (TASK-003)
├── build/
│   ├── spec.md        # Kebutuhan produk dan acceptance criteria (lokal saja)
│   ├── design.md      # Spesifikasi UI/UX dan responsive design (lokal saja)
│   ├── task.md        # Backlog, dependensi, urutan implementasi (lokal saja)
│   └── issues/        # Draft isi setiap GitHub issue (lokal saja)
├── .env.example       # Contoh konfigurasi environment
├── .gitignore
└── README.md
```

Catatan: `build/` dan `AGENTS.md` sengaja tidak di-upload ke GitHub (dokumentasi kerja lokal).

## Konfigurasi Environment

- Salin `.env.example` menjadi `.env` (root repo atau `backend/`) lalu isi nilai sesuai lingkungan lokal.
- File `.env` tidak pernah di-commit (lihat `.gitignore`).
- Frontend memakai `frontend/.env.example` (dibuat pada TASK-002).

## Setup Database (PostgreSQL)

Prasyarat: PostgreSQL berjalan lokal (port default 5432).

1. Buat role dan database (via pgAdmin/Query Tool atau `psql`), ganti password sesuai kebutuhan lokal:

   ```sql
   CREATE ROLE pintara LOGIN PASSWORD '<password-lokal-anda>';
   CREATE DATABASE pintara OWNER pintara;
   ```

2. Isi `.env` (bukan `.env.example`):

   ```
   DATABASE_URL=postgresql+psycopg://pintara:<password-lokal-anda>@localhost:5432/pintara
   ```

3. Backend membaca `DATABASE_URL` melalui `backend/app/core/config.py` (pydantic-settings); SQLAlchemy session ada di `backend/app/db/session.py`.

4. Migrasi database memakai Alembic dari folder `backend/`:

   ```bash
   .venv/Scripts/python.exe -m alembic revision --autogenerate -m "deskripsi"
   .venv/Scripts/python.exe -m alembic upgrade head
   ```

5. Uji koneksi database: jalankan `python -m pytest tests -q` dari `backend/` — test `test_db_connection` memverifikasi koneksi.

## Menjalankan Aplikasi

- **Backend** (dari `backend/`, venv aktif): `python -m uvicorn app.main:app --reload` — docs di `http://localhost:8000/docs`.
- **Frontend** (dari `frontend/`): `npm run dev` — buka `http://localhost:5173`.
- Panduan lengkap termasuk test akan diperluas pada TASK-005.

## Pengembangan

Pekerjaan dikelola lewat [GitHub Issues](https://github.com/AnandaAlifa/Pintara/issues). Setiap issue mengikuti alur: implementasi → verifikasi → commit → push → update issue.

## Owner
Ananda Alifa,
Gozali Gazza,
Alifah,
Muhammad Aryosa.
