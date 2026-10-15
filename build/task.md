# PINTARA — Development Task Board

**Project:** PINTARA — Belajar, Bertumbuh, Berprestasi  
**Status:** Draft  
**Development approach:** Issue-driven development + AI-assisted coding  
**Frontend:** React + Vite + TypeScript  
**Backend:** Python + FastAPI  
**Database:** PostgreSQL  
**ORM:** SQLAlchemy  
**Migration:** Alembic

---

## Development Rules

1. Setiap issue harus memiliki tujuan, ruang lingkup, acceptance criteria, dan langkah pengujian.
2. Kerjakan issue yang menjadi dependensi terlebih dahulu.
3. Jangan mengimplementasikan fitur di luar ruang lingkup issue tanpa persetujuan.
4. Jangan menimpa kode yang sudah ada tanpa memeriksa struktur dan implementasi sebelumnya.
5. Gunakan environment variable untuk konfigurasi yang bersifat lokal atau sensitif.
6. Jangan menyimpan password, API key, token, atau kredensial di repository.
7. Semua perubahan harus diuji sebelum issue dinyatakan selesai.
8. Perbarui dokumentasi apabila perubahan memengaruhi setup, API, atau cara menjalankan aplikasi.
9. AI coding assistant harus menjelaskan file yang dibuat atau diubah, keputusan penting, serta hasil pengujian.
10. Hindari refactoring besar yang tidak diperlukan untuk menyelesaikan issue.

---

# PHASE 0 — Repository and Project Setup

## TASK-001 — Initialize Repository Structure

**Labels:** `setup`, `infrastructure`, `priority:high`

### Objective

Menyiapkan struktur awal repository PINTARA agar frontend, backend, dokumentasi, dan konfigurasi pengembangan terorganisasi.

### Scope

- Buat struktur repository.
- Siapkan folder frontend dan backend.
- Siapkan direktori dokumentasi.
- Tambahkan `.gitignore`.
- Tambahkan `.env.example` jika diperlukan.
- Siapkan `README.md`.
- Pastikan file konfigurasi sensitif tidak masuk ke Git.

Struktur awal yang disarankan:

```text
pintara/
├── frontend/
├── backend/
├── docs/
│   ├── spec.md
│   ├── task.md
│   └── design.md
├── .gitignore
├── .env.example
└── README.md
```

### Acceptance Criteria

- [ ] Struktur repository tersedia.
- [ ] Folder frontend dan backend terpisah.
- [ ] Dokumentasi proyek tersedia.
- [ ] `.gitignore` mencakup file environment, virtual environment, dependency hasil build, dan cache yang relevan.
- [ ] Tidak ada kredensial rahasia yang di-commit.
- [ ] README menjelaskan struktur proyek.

### Dependencies

Tidak ada.

---

## TASK-002 — Setup Frontend Framework

**Labels:** `frontend`, `setup`, `priority:high`

### Objective

Menyiapkan aplikasi frontend menggunakan React, Vite, dan TypeScript.

### Scope

- Buat proyek React dengan template TypeScript melalui Vite.
- Instal dependency yang diperlukan.
- Pastikan development server berjalan.
- Pastikan production build berhasil.
- Siapkan struktur dasar source code.
- Siapkan konfigurasi URL backend melalui environment variable.
- Jangan membangun seluruh halaman aplikasi dalam issue ini.

### Implementation Guide

Jalankan dari root repository:

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm run dev
```

Untuk menguji production build:

```bash
npm run build
```

Tambahkan file `frontend/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Pastikan `.env` lokal tidak di-commit.

### Acceptance Criteria

- [ ] Frontend dapat dijalankan menggunakan `npm run dev`.
- [ ] Halaman awal React dapat dibuka di browser.
- [ ] TypeScript terkonfigurasi dengan benar.
- [ ] `npm run build` berhasil.
- [ ] Environment variable untuk base URL API terdokumentasi.
- [ ] Struktur proyek mudah dikembangkan untuk penambahan halaman dan komponen.
- [ ] Tidak ada fitur bisnis PINTARA yang dibangun di issue ini.

### Dependencies

`TASK-001`.

---

## TASK-003 — Setup Backend Framework

**Labels:** `backend`, `setup`, `priority:high`

### Objective

Menyiapkan backend menggunakan Python dan FastAPI dengan konfigurasi yang dapat dijalankan secara lokal.

### Scope

- Siapkan virtual environment Python.
- Instal dependency backend.
- Buat entry point FastAPI.
- Siapkan endpoint health check.
- Siapkan konfigurasi aplikasi.
- Pastikan dokumentasi API dapat dibuka.
- Jangan membangun seluruh endpoint bisnis dalam issue ini.

### Implementation Guide

Buat virtual environment dari root repository:

```bash
python -m venv .venv
```

Aktifkan environment sesuai terminal yang digunakan.

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Windows CMD:

```bat
.venv\Scripts\activate.bat
```

macOS atau Linux:

```bash
source .venv/bin/activate
```

Instal dependency awal:

```bash
pip install fastapi "uvicorn[standard]" sqlalchemy "psycopg[binary]" alembic pydantic-settings pytest httpx
```

Buat `backend/requirements.txt` yang berisi dependency yang digunakan proyek. Jangan memasukkan seluruh paket global komputer.

Struktur awal:

```text
backend/
├── app/
│   ├── __init__.py
│   └── main.py
├── tests/
├── requirements.txt
└── .env.example
```

Contoh minimal `backend/app/main.py`:

```python
from fastapi import FastAPI

app = FastAPI(title="PINTARA API", version="0.1.0")


@app.get("/api/v1/health")
def health_check():
    return {"status": "ok"}
```

Jalankan backend dari folder `backend` dengan virtual environment yang telah aktif:

```bash
uvicorn app.main:app --reload
```

Dokumentasi API tersedia secara otomatis pada:

```text
http://localhost:8000/docs
```

### Acceptance Criteria

- [ ] Backend dapat dijalankan secara lokal.
- [ ] Endpoint `GET /api/v1/health` memberikan respons sukses.
- [ ] Dokumentasi OpenAPI dapat dibuka.
- [ ] Dependency backend terdokumentasi.
- [ ] Konfigurasi aplikasi tidak bergantung pada kredensial yang di-hardcode.
- [ ] Struktur backend siap dikembangkan.
- [ ] Tidak ada endpoint bisnis yang dibangun di luar health check pada issue ini.

### Dependencies

`TASK-001`.

---

## TASK-004 — Setup PostgreSQL and Database Configuration

**Labels:** `backend`, `database`, `setup`, `priority:high`

### Objective

Menyiapkan koneksi PostgreSQL agar backend dapat berkomunikasi dengan database secara konsisten.

### Scope

- Siapkan database lokal bernama `pintara`.
- Siapkan konfigurasi `DATABASE_URL`.
- Buat modul konfigurasi environment.
- Siapkan SQLAlchemy engine dan session.
- Siapkan konfigurasi awal Alembic.
- Uji koneksi database.
- Jangan membuat seluruh tabel bisnis dalam issue ini.

Contoh konfigurasi environment:

```env
DATABASE_URL=postgresql+psycopg://USER:PASSWORD@localhost:5432/pintara
```

Gunakan username dan password sesuai konfigurasi PostgreSQL lokal. Nilai di atas merupakan contoh, bukan kredensial yang siap digunakan.

### Acceptance Criteria

- [ ] PostgreSQL dapat dijalankan secara lokal.
- [ ] Backend dapat membaca `DATABASE_URL` dari environment.
- [ ] Koneksi database dapat diuji.
- [ ] SQLAlchemy dikonfigurasi menggunakan pola session yang konsisten.
- [ ] Alembic tersedia untuk mengelola migrasi.
- [ ] Kredensial tidak ditulis langsung ke source code.
- [ ] Panduan setup database tercantum di README.

### Dependencies

`TASK-003`.

---

## TASK-005 — Add Initial Tests and Development Documentation

**Labels:** `testing`, `documentation`, `setup`, `priority:high`

### Objective

Menyiapkan pengujian dasar dan dokumentasi agar developer maupun AI coding assistant dapat memverifikasi setup.

### Scope

- Tambahkan pengujian health check backend.
- Dokumentasikan cara menjalankan frontend.
- Dokumentasikan cara menjalankan backend.
- Dokumentasikan setup PostgreSQL.
- Dokumentasikan cara menjalankan test.
- Dokumentasikan environment variable yang diperlukan.

### Acceptance Criteria

- [ ] Pengujian health check berhasil.
- [ ] Perintah menjalankan frontend terdokumentasi.
- [ ] Perintah menjalankan backend terdokumentasi.
- [ ] Perintah menjalankan test terdokumentasi.
- [ ] Konfigurasi environment dijelaskan.
- [ ] Developer baru dapat mengikuti README untuk menyiapkan proyek lokal.

### Dependencies

`TASK-002`, `TASK-003`, dan `TASK-004`.

---

# PHASE 1 — Frontend and Backend Integration

## TASK-006 — Implement API Client and CORS Configuration

**Labels:** `frontend`, `backend`, `integration`, `priority:high`

### Objective

Menghubungkan frontend dengan backend menggunakan konfigurasi API yang konsisten.

### Scope

- Gunakan base URL dari environment variable frontend.
- Buat modul API client.
- Konfigurasikan CORS pada FastAPI untuk origin frontend lokal yang diperlukan.
- Tangani respons error secara konsisten.
- Jangan menambahkan endpoint bisnis di luar kebutuhan integrasi awal.

### Acceptance Criteria

- [ ] Frontend dapat mengirim request ke backend.
- [ ] CORS hanya mengizinkan origin yang diperlukan.
- [ ] Base URL tidak tersebar sebagai hardcode di banyak komponen.
- [ ] Kegagalan request dapat ditangani.
- [ ] Frontend dapat memanggil health check backend.

### Dependencies

`TASK-002`, `TASK-003`.

---

## TASK-015 — Implement App Shell: Dashboard, Header, Footer Navigation

**Labels:** `frontend`, `ui`, `priority:high`

> Ditambahkan setelah audit backlog: `spec.md` §4.1 (P0) mewajibkan struktur navigasi utama dan `design.md` menempatkan Dashboard pada alur utama, tetapi belum ada issue yang menutupinya.

### Objective

Menyediakan app shell berupa Dashboard, AppHeader, dan AppFooter agar struktur navigasi utama sesuai `spec.md` dan alur pengguna di `design.md` tersedia sebagai dasar halaman lain.

### Scope

- Komponen `AppHeader` dengan identitas PINTARA dan navigasi utama (Materi, Praktik).
- Komponen `AppFooter` dengan teks branding sesuai konfirmasi tim.
- Halaman `DashboardPage` berisi bagian Materi dan Praktik.
- Route/wiring navigasi antarhalaman yang sudah ada.
- Navigasi responsif: ringkas di mobile, horizontal di desktop.
- Menu hanya menunjuk fungsi yang benar-benar ada; fitur yang belum tersedia diberi label jelas.

### Acceptance Criteria

- [ ] Dashboard dapat dibuka sebagai halaman utama setelah aplikasi berjalan.
- [ ] AppHeader menampilkan identitas PINTARA dan navigasi ke Materi serta Praktik.
- [ ] AppFooter ditampilkan konsisten di halaman utama.
- [ ] Navigasi berfungsi pada viewport 375 px, 768 px, dan 1440 px tanpa overflow horizontal.
- [ ] Menu yang ditampilkan hanya menunjuk fungsi yang benar-benar ada.
- [ ] Komponen mengikuti `design.md` (§5.1, §5.14) dan pola CSS responsif §9.2.

### Dependencies

`TASK-002`, `TASK-006`.

---

# PHASE 2 — Learning Content

## TASK-007 — Design and Implement Learning Content Models

**Labels:** `backend`, `database`, `priority:high`

### Objective

Menyiapkan model dan migrasi database untuk mata pelajaran, bab, subbab, dan materi.

### Scope

- Tentukan model sesuai spesifikasi.
- Implementasikan relasi antarmodel.
- Buat migrasi Alembic.
- Siapkan seed data untuk pengembangan.
- Hindari menambahkan tabel yang belum diperlukan oleh MVP.

### Acceptance Criteria

- [ ] Model materi mengikuti spesifikasi yang disepakati.
- [ ] Relasi database benar.
- [ ] Migrasi dapat diterapkan pada database baru.
- [ ] Seed data dapat digunakan untuk pengujian.
- [ ] Skema tidak memuat data rahasia atau contoh kredensial nyata.

### Dependencies

`TASK-004`.

---

## TASK-008 — Implement Learning Content API

**Labels:** `backend`, `api`, `priority:high`

### Objective

Menyediakan API untuk mengambil daftar mata pelajaran, bab, dan materi.

### Scope

- Endpoint daftar mata pelajaran.
- Endpoint daftar bab berdasarkan mata pelajaran.
- Endpoint detail materi.
- Validasi parameter dan respons error.
- Pengujian endpoint.

### Acceptance Criteria

- [ ] API mengembalikan data sesuai struktur respons yang didokumentasikan.
- [ ] ID yang tidak ditemukan ditangani dengan benar.
- [ ] Respons dapat digunakan oleh frontend.
- [ ] Endpoint diuji.
- [ ] API tidak mengembalikan informasi internal database yang tidak diperlukan.

### Dependencies

`TASK-007`.

---

## TASK-009 — Implement Responsive Learning Pages

**Labels:** `frontend`, `ui`, `priority:high`

### Objective

Membangun halaman materi yang terhubung dengan API dan mengikuti `design.md`.

### Scope

- Halaman daftar mata pelajaran.
- Halaman daftar bab atau subbab.
- Halaman detail materi.
- Komponen kartu materi.
- Loading, error, dan empty state.
- Layout responsif untuk mobile, tablet, dan desktop.

### Acceptance Criteria

- [ ] Pengguna dapat membuka daftar mata pelajaran.
- [ ] Pengguna dapat memilih bab atau subbab.
- [ ] Pengguna dapat membaca detail materi.
- [ ] Data berasal dari backend.
- [ ] Layout berfungsi pada viewport 375 px, 768 px, dan 1440 px.
- [ ] Tidak ada horizontal overflow yang tidak diperlukan.
- [ ] Komponen mengikuti sistem desain yang disepakati.

### Dependencies

`TASK-006`, `TASK-008`.

---

# PHASE 3 — Practice and Scoring

## TASK-010 — Implement Question and Attempt Models

**Labels:** `backend`, `database`, `priority:high`

### Objective

Menyiapkan model soal pilihan ganda dan riwayat pengerjaan latihan.

### Scope

- Model soal.
- Relasi soal dengan materi atau latihan.
- Model percobaan pengerjaan.
- Penyimpanan jawaban pengguna.
- Migrasi database dan seed data.

### Acceptance Criteria

- [ ] Struktur soal mendukung pilihan ganda.
- [ ] Percobaan pengerjaan dapat disimpan.
- [ ] Jawaban dan hasil terhubung dengan percobaan yang benar.
- [ ] Migrasi dapat dijalankan.
- [ ] Kunci jawaban tidak dikirim secara tidak sengaja ke endpoint soal untuk peserta.

### Dependencies

`TASK-007`.

---

## TASK-011 — Implement Practice and Scoring API

**Labels:** `backend`, `api`, `priority:high`

### Objective

Menyediakan API untuk mengambil soal, menerima jawaban, menghitung nilai, dan menyimpan hasil.

### Scope

- Endpoint mengambil soal.
- Endpoint mengirim jawaban.
- Validasi jawaban.
- Penilaian dilakukan di backend.
- Penyimpanan hasil pengerjaan.
- Pengujian scoring.

### Acceptance Criteria

- [ ] Soal dapat diambil melalui API.
- [ ] Jawaban yang diterima divalidasi.
- [ ] Nilai dihitung di backend, bukan dipercaya dari frontend.
- [ ] Hasil pengerjaan tersimpan di database.
- [ ] Request tidak valid ditangani.
- [ ] Pengujian mencakup jawaban benar, salah, dan input tidak valid.

### Dependencies

`TASK-010`.

---

## TASK-012 — Implement Responsive Practice and Result Pages

**Labels:** `frontend`, `ui`, `priority:high`

### Objective

Membangun alur latihan soal hingga hasil dengan tampilan responsif.

### Scope

- Tampilan pertanyaan dan pilihan jawaban.
- State pilihan jawaban.
- Tombol submit.
- Indikator proses pengiriman.
- Halaman hasil.
- Penanganan error.
- Integrasi dengan API scoring.

### Acceptance Criteria

- [ ] Pengguna dapat memilih jawaban.
- [ ] Jawaban dapat dikirim ke backend.
- [ ] Pengguna mendapat feedback ketika pengiriman selesai.
- [ ] Hasil ditampilkan berdasarkan respons backend.
- [ ] Tampilan dapat digunakan pada mobile dan desktop.
- [ ] Pengguna tidak dapat mengirim jawaban berulang kali tanpa penanganan yang jelas.

### Dependencies

`TASK-006`, `TASK-011`.

---

# PHASE 4 — Integration and Delivery

## TASK-013 — End-to-End Learning Flow

**Labels:** `integration`, `testing`, `priority:high`

### Objective

Memastikan alur materi hingga hasil latihan berjalan secara menyeluruh.

### Scope

- Integrasikan halaman materi dengan latihan.
- Uji pengambilan data dari PostgreSQL melalui backend.
- Uji pengiriman jawaban.
- Uji penyimpanan hasil.
- Perbaiki masalah integrasi yang ditemukan.

### Acceptance Criteria

- [ ] Pengguna dapat memilih materi.
- [ ] Pengguna dapat membuka latihan terkait.
- [ ] Pengguna dapat mengirim jawaban.
- [ ] Backend menghitung nilai.
- [ ] Hasil dapat ditampilkan.
- [ ] Tidak ada error kritis yang menghambat alur utama.

### Dependencies

`TASK-009`, `TASK-012`, `TASK-015`.

---

## TASK-014 — Responsive, Regression, and Demo Testing

**Labels:** `testing`, `ui`, `priority:high`

### Objective

Melakukan pengujian akhir dan memastikan aplikasi siap didemonstrasikan.

### Scope

- Uji viewport 375 px, 768 px, 1024 px, dan 1440 px.
- Uji alur materi hingga hasil.
- Uji loading, error, dan empty state.
- Periksa console error.
- Periksa konfigurasi environment.
- Dokumentasikan langkah demo.

### Acceptance Criteria

- [ ] Alur utama berjalan.
- [ ] Layout responsif.
- [ ] Tidak ada masalah kritis yang belum diketahui.
- [ ] Langkah demo terdokumentasi.
- [ ] Setup lokal dapat diikuti oleh anggota tim lain.
- [ ] Build frontend dan test backend yang relevan berhasil.

### Dependencies

`TASK-013`.

---

# PHASE 5 — Optional Features

Fitur berikut baru dikerjakan setelah alur utama stabil dan ruang lingkupnya dikonfirmasi.

- Profil dan pengelolaan akun.
- Autentikasi dan otorisasi.
- Riwayat hasil latihan.
- Dashboard admin.
- Pengelolaan materi.
- Jadwal.
- Konsultasi.
- Tes minat bakat dan gaya belajar.
- Fitur tambahan dari wireframe yang telah disetujui.

Setiap fitur tambahan harus dibuat sebagai issue terpisah dengan acceptance criteria dan dependensi yang jelas.

---

# PHASE 6 — Authentication

Fitur autentikasi berikut dikerjakan sesuai `spec.md` §15. Setiap task harus diselesaikan berdasarkan dependensinya.

## AUTH-001 — Define Authentication Architecture

**Labels:** `auth`, `architecture`, `priority:high`
**Priority:** P0
**Dependencies:** Repository and specification audit

### Objective

Define a secure authentication flow that fits the existing PINTARA architecture.

### Scope

- Inspect the existing frontend, backend, database models, and routing.
- Decide the authentication strategy and document its lifecycle.
- Define registration and login request/response contracts.
- Define authentication error handling and protected-route behavior.
- Identify required environment variables and database changes.

### Acceptance Criteria

- [ ] The authentication strategy is documented.
- [ ] API contracts and authentication states are defined.
- [ ] Security considerations and environment configuration are documented.
- [ ] Existing architecture is reused where appropriate.
- [ ] No conflicting authentication implementation is introduced.

### Dependencies

Repository and specification audit.

### Decision Record

Hasil audit dan keputusan terdokumentasi di [`build/auth-architecture.md`](auth-architecture.md) (ADR-001): strategi JWT Bearer (HS256), lifecycle autentikasi, kontrak API register/login/logout/users-me, model user, asesmen penyimpanan token di frontend, env vars (`SECRET_KEY`, `ACCESS_TOKEN_EXPIRE_MINUTES`), dan keterbatasan MVP.

---

## AUTH-002 — Implement User Model and Database Migration

**Labels:** `auth`, `backend`, `database`, `priority:high`
**Priority:** P0
**Dependencies:** AUTH-001

### Objective

Provide persistent user records for authentication.

### Scope

- Implement or adapt the user model.
- Define the unique account identifier.
- Store password hashes, never plaintext passwords.
- Add database constraints and required indexes.
- Create an Alembic migration.

### Acceptance Criteria

- [ ] The user model follows existing SQLAlchemy conventions.
- [ ] Duplicate identifiers are prevented by database constraints.
- [ ] The migration can be applied successfully.
- [ ] Existing data and unrelated schema are preserved.
- [ ] Model and migration tests pass.

### Dependencies

`AUTH-001`.

---

## AUTH-003 — Implement Registration API

**Labels:** `auth`, `backend`, `api`, `priority:high`
**Priority:** P0
**Dependencies:** AUTH-001, AUTH-002

### Objective

Allow users to create accounts securely.

### Scope

- Implement the registration endpoint using FastAPI.
- Validate request data with the existing Pydantic conventions.
- Hash passwords securely.
- Handle duplicate accounts and invalid input.
- Return safe, documented responses.

### Acceptance Criteria

- [ ] Valid registration creates a user.
- [ ] Invalid data is rejected.
- [ ] Duplicate accounts are rejected.
- [ ] Plaintext passwords are never persisted.
- [ ] Error responses do not expose secrets or stack traces.
- [ ] Automated endpoint tests pass.

### Dependencies

`AUTH-001`, `AUTH-002`.

---

## AUTH-004 — Implement Login and Session Management API

**Labels:** `auth`, `backend`, `api`, `priority:high`
**Priority:** P0
**Dependencies:** AUTH-001, AUTH-002

### Objective

Authenticate registered users and maintain authentication state securely.

### Scope

- Implement credential verification.
- Apply the selected session or token strategy.
- Define credential expiration and renewal behavior where applicable.
- Implement logout or session invalidation.
- Protect a representative authenticated endpoint.
- Apply appropriate abuse protection where supported.

### Acceptance Criteria

- [ ] Valid credentials authenticate the user.
- [ ] Invalid credentials are rejected with a generic error.
- [ ] Protected endpoints reject unauthenticated requests.
- [ ] Logout invalidates the relevant session or refresh credentials where applicable.
- [ ] Authentication behavior follows the documented strategy.
- [ ] Automated tests pass.

### Dependencies

`AUTH-001`, `AUTH-002`.

---

## AUTH-005 — Build Login and Registration UI

**Labels:** `auth`, `frontend`, `ui`, `priority:high`
**Priority:** P0
**Dependencies:** AUTH-001

### Objective

Implement authentication screens consistent with PINTARA's design system.

### Scope

- Implement registration and login forms.
- Reuse existing form components and visual conventions.
- Add frontend validation that complements backend validation.
- Add loading, success, validation-error, and authentication-error states.
- Support password visibility controls.
- Ensure responsive and accessible form behavior.

### Acceptance Criteria

- [ ] Both forms follow the existing design specification.
- [ ] Forms submit to the correct backend endpoints.
- [ ] Users receive understandable feedback.
- [ ] Repeated submission is handled appropriately while a request is pending.
- [ ] Layout works on mobile, tablet, and desktop.
- [ ] Relevant frontend tests pass.

### Dependencies

`AUTH-001`.

---

## AUTH-006 — Integrate Authentication State and Route Protection

**Labels:** `auth`, `frontend`, `integration`, `priority:high`
**Priority:** P0
**Dependencies:** AUTH-004, AUTH-005

### Objective

Integrate authentication into application navigation and protected features.

### Scope

- Implement a shared authentication-state mechanism consistent with the chosen strategy.
- Handle page refresh and authentication initialization.
- Protect frontend routes that require an account.
- Provide login navigation or redirects for unauthenticated users.
- Integrate logout into the existing navigation.
- Verify backend authorization independently of frontend route guards.

### Acceptance Criteria

- [ ] Authentication state is consistent across relevant pages.
- [ ] Unauthenticated users cannot use protected backend resources.
- [ ] Authenticated users can access permitted protected pages.
- [ ] Logout updates the UI and relevant backend credentials.
- [ ] Client-side route protection is not treated as the sole security control.
- [ ] Relevant integration tests pass.

### Dependencies

`AUTH-004`, `AUTH-005`.

---

## AUTH-007 — Authentication Security and End-to-End Tests

**Labels:** `auth`, `testing`, `security`, `priority:high`
**Priority:** P0
**Dependencies:** AUTH-003, AUTH-004, AUTH-006

### Objective

Verify the complete authentication lifecycle.

### Scope

- Test registration, duplicate accounts, login, invalid credentials, protected access, and logout.
- Test validation and error states.
- Verify password-hashing behavior.
- Verify authentication behavior after page refresh.
- Review secret handling, logs, and configuration.
- Update documentation and `.env.example` if required.

### Acceptance Criteria

- [ ] Required backend and frontend tests pass.
- [ ] Critical authentication flows are tested end to end.
- [ ] Secrets are not hardcoded or logged.
- [ ] Setup instructions explain the required environment variables.
- [ ] Known limitations are documented.
- [ ] The implementation is reviewed against `build/spec.md`, `build/design.md`, and `AGENTS.md`.

### Dependencies

`AUTH-003`, `AUTH-004`, `AUTH-006`.

---

### Recommended Execution Order (Authentication)

1. AUTH-001 — Define architecture.
2. AUTH-002 — User model and migration.
3. AUTH-003 — Registration API.
4. AUTH-004 — Login and session management.
5. AUTH-005 — Login and registration UI.
6. AUTH-006 — Authentication state and route protection.
7. AUTH-007 — Security and end-to-end tests.

**Implementation rule:** Inspect the current repository and backlog before starting. Reuse existing authentication components if present, preserve existing task IDs, and do not mark a task complete until its acceptance criteria and tests have been verified.

---

# Global Definition of Done

Sebuah issue dapat ditutup jika:

- [ ] Semua acceptance criteria terpenuhi.
- [ ] Implementasi sesuai ruang lingkup issue.
- [ ] Pengujian yang relevan telah dijalankan.
- [ ] Tidak ada secret atau kredensial yang di-commit.
- [ ] Dokumentasi diperbarui jika diperlukan.
- [ ] Perubahan telah direview.
- [ ] Tidak ada regresi kritis pada alur utama.
- [ ] Ringkasan perubahan dan hasil pengujian tersedia pada pull request atau laporan penyelesaian issue.