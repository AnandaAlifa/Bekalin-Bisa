# ADR-001 — Authentication Architecture

**Status:** Accepted  
**Date:** 2026-10-15  
**Task:** AUTH-001 (issue #26)  
**Supersedes:** —  
**Related:** `build/spec.md` §15, `build/task.md` AUTH-001..007

---

## 1. Context

PINTARA/BEKALIN BISA saat ini berjalan tanpa autentikasi backend:

- Frontend memiliki `AuthContext` client-side (demo) yang menyimpan user di `localStorage` — **bukan** mekanisme keamanan.
- Backend (FastAPI) hanya memiliki endpoint publik: content (`/subjects`, `/chapters`, `/lessons`) dan practice (`/questions`, `/attempts`). Tidak ada tabel `users`, tidak ada endpoint `/auth/*`, tidak ada proteksi endpoint.
- `practice_attempts` saat ini **tidak memiliki** kolom `user_id` (spec §7.6 mendefinisikannya "jika autentikasi digunakan"). Integrasi auth → riwayat latihan per-user memerlukan penambahan kolom `user_id` nullable (FK ke `users`) agar data lama tetap valid.

Spesifikasi (`build/spec.md` §15) mewajibkan autentikasi ditangani backend, bukan sekadar state frontend. Issue AUTH-001 (ini) mendefinisikan arsitektur; implementasi dilakukan di AUTH-002..007.

---

## 2. Decision Summary

| Aspek | Keputusan |
|---|---|
| Strategi | **JWT Bearer token (stateless, HS256)** |
| Library backend | `PyJWT` untuk signing/verifikasi; `bcrypt` untuk hashing password |
| Library frontend | Tidak ada library tambahan — `fetch` + penyimpanan token di `sessionStorage` |
| Token lifetime | Access token tunggal, **60 menit** (konfigurasi `ACCESS_TOKEN_EXPIRE_MINUTES`) |
| Refresh token | **Tidak untuk MVP** — di-*defer*; lihat §8 Limitations |
| Penyimpanan token (FE) | `sessionStorage` (lihat asesmen keamanan §6.3) |
| Otorisasi | Dependency FastAPI `get_current_user` / `require_role` di backend; guard route di frontend sekadar UX |
| Password hashing | `bcrypt` (cost factor 12) |
| Identifikasi unik | `email` (case-insensitive, disimpan lowercase) |

---

## 3. Authentication Lifecycle

```text
Register:
  POST /auth/register  →  201 { user }  →  redirect ke /login (tanpa auto-login)

Login:
  POST /auth/login  →  200 { access_token, token_type, expires_in, user }
                    →  FE simpan token di sessionStorage  →  redirect ke halaman awal per-role

Authenticated request:
  FE: header  Authorization: Bearer <token>
  BE: dependency get_current_user  →  decode JWT  →  load user dari DB  →  set request.user

Token expiry:
  BE menolak dengan 401 { detail: "Sesi telah berakhir" }
  FE menangkap 401 → hapus sessionStorage → redirect /login

Logout (client-initiated):
  FE hapus token dari sessionStorage → redirect /login
  (Stateless: tidak ada invalidasi server-side pada MVP — lihat §8)

Page refresh:
  FE membaca token dari sessionStorage saat bootstrap AuthContext
  → tampilkan loading singkat → panggil GET /users/me untuk verifikasi & hydrate user
  → jika 401: anggap logout, redirect /login
```

---

## 4. User Model (rencana — diimplementasikan AUTH-002)

Mengikuti `build/spec.md` §7.1 dan konvensi SQLAlchemy yang ada (`Mapped` / `mapped_column`):

| Kolom | Tipe | Constraint |
|---|---|---|
| `id` | `Integer` | primary key |
| `email` | `String(320)` | **unique, not null, indexed**; disimpan lowercase |
| `password_hash` | `String(128)` | not null; bcrypt hash, **bukan** plaintext |
| `username` | `String(100)` | not null |
| `bio` | `Text` | nullable |
| `role` | `String(20)` | not null, default `'student'`; constraint CHECK IN (`student`,`teacher`,`school_admin`) — diperluas di AUTH-008; data `admin` lama dimigrasikan ke `school_admin` |
| `created_at` | `DateTime(timezone=True)` | server default `now()` |
| `updated_at` | `DateTime(timezone=True)` | onupdate `now()` |

Tabel baru: `users`. Migrasi Alembic dibuat di AUTH-002. Penambahan `practice_attempts.user_id` (nullable, FK ke `users.id`) menjadi opsi pada migrasi yang sama atau migrasi terpisah saat fitur riwayat per-user diaktifkan — tidak menghalangi AUTH-002..004.

---

## 5. API Contracts (rencana)

Base prefix: `/api/v1` (mengikuti konvensi yang ada).

### 5.1 `POST /auth/register`

**Request**

```json
{
  "email": "budi@student.sch.id",
  "password": "siswa123",
  "username": "budisantoso"
}
```

| Field | Validasi |
|---|---|
| `email` | format email valid (`EmailStr`); unik (case-insensitive) |
| `password` | min 8, maks 72 karakter (batas bcrypt agar tidak terpotong diam-diam); tanpa validasi emoji di backend (validasi FE bersifat pelengkap) |
| `username` | min 3, max 100 karakter |

**Response `201`**

```json
{
  "id": 1,
  "email": "budi@student.sch.id",
  "username": "budisantoso",
  "role": "student",
  "bio": null
}
```

- Role selalu `student` — klien **tidak** dapat mengirim field `role`.
- **Tidak ada auto-login** (spec §15.2.1) — FE mengarahkan ke `/login`.

**Error**

| Status | Kondisi | Body |
|---|---|---|
| `422` | validasi skema gagal (Pydantic, default FastAPI — konsisten dengan endpoint content/practice yang ada) | `{ "detail": [...] }` |
| `409` | email sudah terdaftar | `{ "detail": "Email sudah terdaftar" }` |

### 5.2 `POST /auth/login`

**Request**

```json
{
  "email": "budi@student.sch.id",
  "password": "siswa123"
}
```

> Identifier: email (spec §15.2.2 "identifier dan password sesuai desain produk"). username-only login **tidak** untuk MVP.

**Response `200`**

```json
{
  "access_token": "<jwt>",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": 1,
    "email": "budi@student.sch.id",
    "username": "budisantoso",
    "role": "student",
    "bio": null
  }
}
```

**Error**

| Status | Kondisi | Body |
|---|---|---|
| `400` | validasi gagal | `{ "detail": "..." }` |
| `401` | kredensial tidak valid | `{ "detail": "Email atau password salah" }` |

> **Penting:** pesan `401` selalu generik — tidak membedakan "email tidak ditemukan" vs "password salah" (spec §15.2.2).

### 5.3 `POST /auth/logout`

**Response `200`**

```json
{ "detail": "Berhasil keluar" }
```

Stateless: endpoint ini bersifat **opsional/kompatibilitas** — logout sesungguhnya dilakukan FE dengan menghapus `sessionStorage`. Tidak ada invalidasi token server-side pada MVP (lihat §8).

### 5.4 `GET /users/me` (endpoint terwakili yang terlindungi)

**Request:** header `Authorization: Bearer <token>`

**Response `200`**

```json
{
  "id": 1,
  "email": "budi@student.sch.id",
  "username": "budisantoso",
  "role": "student",
  "bio": null
}
```

**Error:** `401 { "detail": "Belum terautentikasi" }` (tanpa token) atau `401 { "detail": "Sesi telah berakhir" }` (token tidak valid/kadaluarsa).

### 5.5 `PATCH /users/me` (opsional, P2 — dapat di-AUTH-006/007)

Body parsial: `{ "username"?, "bio"? }`. **Tidak** menerima `role` atau `email` (email dianggap immutable untuk MVP).

---

## 6. Security Considerations

### 6.1 Password hashing

- `bcrypt` via library `bcrypt` Python (bukan `passlib` — tidak terawat & bermasalah dengan bcrypt ≥ 4.1).
- Cost factor **12** (default aman; dapat dinaikkan via env bila perlu).
- Password plaintext **tidak pernah** disimpan, di-log, atau dikirim balik di response.

### 6.2 JWT

- Algoritma **HS256** dengan `SECRET_KEY` dari environment variable (≥ 32 byte acak).
- Claims: `sub` (user id sebagai string), `iat`, `exp`.
- `SECRET_KEY` **tidak** boleh di-commit; contoh nilai placeholder di `.env.example` diganti saat AUTH-004 diimplementasikan.

### 6.3 Penyapan token di frontend — asesmen keamanan (spec §15.2.3)

| Opsi | Dipilih? | Alasan |
|---|---|---|
| `localStorage` | **Tidak** | Persisten lintas sesi & tab; paparan XSS paling luas; spec melarang token jangka panjang di storage tidak aman tanpa asesmen eksplisit |
| `sessionStorage` | **Ya (MVP)** | Persisten saat refresh halaman (dibutuhkan spec §15.2.3), hilang saat tab ditutup → jendela paparan lebih kecil; cukup untuk access token 60 menit |
| httpOnly cookie | Tidak untuk MVP | Butuh HTTPS + SameSite=None untuk cross-origin (FE :5173, BE :8000); rumit di dev lokal HTTP; butuh proteksi CSRF tambahan |

**Asesmen:** access token berumur pendek (60 menit) + `sessionStorage` (terbatas per-tab, terhapus saat tab ditutup) dinilai **cukup aman untuk MVP hackathon**, dengan pemahaman bahwa XSS pada origin FE tetap berbahaya. Migrasi ke httpOnly cookie direkomendasikan sebelum produksi (lihat §8).

### 6.4 Proteksi endpoint

- Setiap endpoint terlindungi menggunakan dependency FastAPI `get_current_user` yang:
  1. Mengekstrak token dari header `Authorization: Bearer …`.
  2. Memverifikasi signature & expiry via PyJWT.
  3. Memuat user dari DB (menolak token yang user-nya sudah dihapus).
- Otorisasi role (`require_role("admin")`) diterapkan di endpoint admin bila ada.
- **Frontend guard bukan kontrol keamanan** — backend selalu memverifikasi secara independen (spec §15.2.3).

### 6.5 Input & error handling

- Validasi request dengan Pydantic (konvensi yang ada).
- Pesan error autentikasi generik (§5.2).
- Tidak ada stack trace / detail internal di response produksi.
- Rate limiting: **tidak wajib untuk MVP**, direkomendasikan `slowapi` (dependency-based) di AUTH-004 bila waktu memungkinkan; jika tidak, didokumentasikan sebagai limitation.

### 6.6 Secret handling

- `SECRET_KEY` dan `DATABASE_URL` hanya via environment variable.
- `.env` tidak di-commit (sudah di `.gitignore`).
- `.env.example` berisi placeholder, bukan nilai rahasia nyata.

---

## 7. Environment Variables (rencana — diimplementasikan AUTH-002/004)

| Variable | Wajib? | Default | Digunakan oleh |
|---|---|---|---|
| `SECRET_KEY` | **Ya** (saat auth aktif) | — (placeholder di `.env.example`) | JWT signing/verifikasi (`app/core/config.py`) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Tidak | `60` | Masa berlaku access token |

> `DATABASE_URL` dan `CORS_ORIGINS` sudah ada — tidak berubah. CORS tidak perlu penyesuaian khusus untuk Bearer header (bukan cookie).

---

## 8. Limitations & Future Work (di luar MVP AUTH)

| Item | Status | Catatan |
|---|---|---|
| Refresh token / rotasi | Di-defer | Access token tunggal 60 menit; user login ulang setelah expiry |
| Invalidasi token server-side (logout paksa) | Di-defer | Stateless JWT; token lama masih valid sampai expiry meski user sudah "logout" di FE. Untuk produksi: token blocklist (Redis/DB) atau singkatkan expiry |
| Rate limiting login | Opsional (AUTH-004 bila sempat) | `slowapi` atau middleware sederhana |
| Migrasi ke httpOnly cookie + CSRF | Direkomendasikan sebelum produksi | Butuh HTTPS; mengurangi risiko XSS pencurian token |
| Email verification & password reset | Di luar MVP | Spec §15.4 |
| Role `teacher` / `school_admin` | **Selesai (AUTH-008)** | Role backend diperluas ke `student`/`teacher`/`school_admin`; `require_role` diterapkan di `POST /admin/users` & `PATCH /admin/lessons/{id}`; data `admin` lama dimigrasikan ke `school_admin` |
| Profil update (`PATCH /users/me`) | **Selesai (AUTH-009)** | Body parsial `{username?, bio?}`; `role`/`email` immutable (diabaikan bila dikirim) |

---

## 9. Reuse Existing Architecture

Keputusan ini **memanfaatkan** pola yang sudah ada, tanpa memperkenalkan strategi yang bersaing:

- **SQLAlchemy 2 `Mapped` style** — model `User` mengikuti pola `Subject`/`Chapter`/`Lesson`.
- **Alembic** — migrasi `users` dibuat dengan `alembic revision --autogenerate` seperti tabel lain.
- **Pydantic schemas** — skema request/response mengikuti pola `schemas/content.py` & `schemas/practice.py`.
- **FastAPI routers** — router `auth` & `users` baru di `app/api/routers/`, di-include di `main.py` dengan prefix `/api/v1` seperti router yang ada.
- **Dependency injection** — `get_current_user` ditambahkan ke `app/api/deps.py` bersama `get_db`.
- **Frontend services** — `services/auth.ts` mengikuti pola `services/api.ts` (fetch wrapper + `ApiError`).
- **Frontend AuthContext** — `contexts/AuthContext.tsx` di-refactor dari demo localStorage ke backend call; API publik komponen (`useAuth`) dipertahankan agar halaman tidak banyak berubah.

Tidak ada mekanisme autentikasi lain (OAuth, session cookie server-side, library auth eksternal) yang diperkenalkan — hanya JWT Bearer ini.

---

## 10. Acceptance Criteria AUTH-001

- [x] The authentication strategy is documented. (§2, §3)
- [x] API contracts and authentication states are defined. (§3, §5)
- [x] Security considerations and environment configuration are documented. (§6, §7)
- [x] Existing architecture is reused where appropriate. (§9)
- [x] No conflicting authentication implementation is introduced. (§9 — tidak ada kode auth baru di issue ini; hanya dokumentasi)
