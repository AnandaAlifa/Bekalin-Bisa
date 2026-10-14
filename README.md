# PINTARA

**Belajar, Bertumbuh, Berprestasi**

Platform pembelajaran: materi berdasarkan mata pelajaran, bab, dan subbab, serta latihan soal dengan penilaian di backend.

## Status

Proyek dalam pengembangan. Backlog dan urutan pengerjaan ada di [`build/task.md`](build/task.md); spesifikasi produk di [`build/spec.md`](build/spec.md); desain UI di [`build/design.md`](build/design.md).

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
│   ├── spec.md        # Kebutuhan produk dan acceptance criteria
│   ├── design.md      # Spesifikasi UI/UX dan responsive design
│   ├── task.md        # Backlog, dependensi, urutan implementasi
│   └── issues/        # Draft isi setiap GitHub issue
├── AGENTS.md          # Aturan engineering dan workflow proyek
├── .env.example       # Contoh konfigurasi environment
├── .gitignore
└── README.md
```

## Konfigurasi Environment

- Salin `.env.example` menjadi `.env` lalu isi nilai sesuai lingkungan lokal.
- File `.env` tidak pernah di-commit (lihat `.gitignore`).
- Frontend memakai `frontend/.env.example` (dibuat pada TASK-002).
- Panduan menjalankan aplikasi, database, dan test lengkap akan didokumentasikan pada TASK-005.

## Pengembangan

Pekerjaan dikelola lewat [GitHub Issues](https://github.com/AnandaAlifa/Pintara/issues). Setiap issue mengikuti alur: implementasi → verifikasi → commit → push → update issue.

## Owner

owner kontol and jemboat
