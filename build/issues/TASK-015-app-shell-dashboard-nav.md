# TASK-015 — Implement App Shell: Dashboard, Header, Footer Navigation

**Phase:** PHASE 1 — Frontend and Backend Integration
**Labels:** `frontend`, `ui`, `priority:high`
**Dependencies:** `TASK-002`, `TASK-006`.

## Objective

Menyediakan app shell berupa Dashboard, AppHeader, dan AppFooter agar struktur navigasi utama sesuai `spec.md` §4.1 (P0) dan alur pengguna di `design.md` §4 tersedia sebagai dasar halaman lain.

## Scope

- Komponen `AppHeader` dengan identitas PINTARA dan navigasi utama (Materi, Praktik).
- Komponen `AppFooter` dengan teks branding sesuai konfirmasi tim (lihat keputusan terbuka di `spec.md`).
- Halaman `DashboardPage` berisi bagian Materi dan Praktik sebagai titik awal alur pembelajaran.
- Route/wiring navigasi antarhalaman yang sudah ada (Welcome/Dashboard/materi).
- Navigasi responsif: ringkas di mobile, horizontal di desktop (`design.md` §7.13).
- Loading/error/empty state tidak wajib di halaman statis ini, tetapi tombol/menu tidak boleh menampilkan fungsi yang belum ada tanpa penjelasan.

## Out of Scope

- Autentikasi (Welcome/Login/SignUp) — di luar issue ini.
- Data dinamis dari backend untuk ringkasan dashboard.
- Profil, jadwal, konsultasi, ujian tulis.

## Acceptance Criteria

- [ ] Dashboard dapat dibuka sebagai halaman utama setelah aplikasi berjalan.
- [ ] AppHeader menampilkan identitas PINTARA dan navigasi ke Materi serta Praktik.
- [ ] AppFooter ditampilkan konsisten di halaman utama.
- [ ] Navigasi berfungsi pada viewport 375 px, 768 px, dan 1440 px tanpa overflow horizontal.
- [ ] Menu yang ditampilkan hanya menunjuk fungsi yang benar-benar ada; fitur yang belum tersedia diberi label jelas.
- [ ] Komponen mengikuti `design.md` (AppHeader §5.1, AppFooter §5.14) dan pola CSS responsif §9.2.

## Langkah Pengujian

1. Jalankan frontend (`npm run dev`) lalu buka aplikasi — Dashboard tampil sebagai halaman utama.
2. Klik navigasi Materi dan Praktik — pindah halaman tanpa error.
3. Uji viewport 375 px, 768 px, 1440 px — navigasi berubah sesuai breakpoint, tidak ada horizontal overflow.
4. Cek console browser — tidak ada error React/route.
5. Pastikan tidak ada tombol yang berpura-pura berfungsi (mis. tanpa handler tanpa keterangan).

## Definition of Done

- [ ] Semua acceptance criteria terpenuhi.
- [ ] Pengujian yang relevan telah dijalankan.
- [ ] Tidak ada secret atau kredensial yang di-commit.
- [ ] Dokumentasi diperbarui jika diperlukan.
