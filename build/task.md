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