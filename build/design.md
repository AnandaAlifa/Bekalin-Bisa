
# PINTARA — Design Document

**Tagline:** Belajar, Bertumbuh, Berprestasi  
**Versi:** 1.3-draft  
**Status:** Draft — menunggu validasi tim UI/UX  
**Referensi utama:** Wireframe PDF PINTARA dan desain Figma yang disediakan tim.

---

## 1. Tujuan Desain

PINTARA merupakan platform pembelajaran yang membantu pengguna mengakses materi, mempelajari subbab, mengerjakan latihan soal, serta melihat hasil pengerjaan.

Desain antarmuka harus mendukung kebutuhan berikut:

1. Memudahkan pengguna memahami navigasi dan fungsi setiap halaman.
2. Menyediakan alur pembelajaran dari pemilihan materi hingga pengerjaan latihan.
3. Menampilkan informasi secara jelas dan terstruktur.
4. Mendukung penggunaan pada perangkat mobile, tablet, dan desktop.
5. Menjaga konsistensi tampilan melalui komponen UI yang dapat digunakan kembali.
6. Memprioritaskan kemudahan penggunaan, keterbacaan, dan kecepatan interaksi.

Dokumen ini menggunakan wireframe sebagai referensi struktur dan alur halaman. Detail visual yang belum ditentukan masih dapat berubah setelah diskusi dengan tim UI/UX.

## 2. Prinsip Desain

### 2.1 Konsistensi

Komponen dengan fungsi yang sama harus memiliki tampilan dan perilaku yang konsisten di seluruh halaman.

### 2.2 Kemudahan penggunaan

Pengguna harus dapat menemukan materi, membuka latihan, dan memahami hasil pengerjaan tanpa melalui navigasi yang membingungkan.

### 2.3 Responsive design

Antarmuka harus menyesuaikan ukuran layar tanpa membuat pengguna kehilangan akses terhadap fungsi utama.

### 2.4 Keterbacaan

Teks materi, soal, tombol, dan informasi penting harus mudah dibaca pada layar kecil maupun besar.

### 2.5 Reusability

Komponen yang digunakan berulang kali harus dibuat sebagai komponen bersama agar perubahan desain dapat diterapkan secara konsisten.

### 2.6 Feedback interaksi

Setiap tindakan penting harus memberikan umpan balik yang sesuai, misalnya indikator loading, pesan kesalahan, konfirmasi hasil, atau tampilan kosong ketika belum ada data.

## 3. Struktur Halaman

Berdasarkan wireframe referensi, halaman PINTARA dikelompokkan menjadi beberapa bagian berikut.

### 3.1 Welcome Page

Halaman awal yang memperkenalkan PINTARA kepada pengguna.

Elemen:
- Logo atau nama PINTARA.
- Tagline "Belajar, Bertumbuh, Berprestasi".
- Tombol Login.
- Tombol Sign Up.

Tujuan:
- Memperkenalkan identitas platform.
- Mengarahkan pengguna untuk masuk atau membuat akun.

### 3.2 Login Page

Halaman autentikasi bagi pengguna yang sudah memiliki akun.

Elemen:
- Form email atau username sesuai keputusan implementasi.
- Form password.
- Tombol Login.
- Navigasi menuju Sign Up.

Perilaku:
- Validasi input.
- Menampilkan pesan kesalahan jika autentikasi gagal.
- Menampilkan indikator proses ketika permintaan sedang berlangsung.

### 3.3 Sign Up Page

Halaman pendaftaran pengguna baru.

Elemen:
- Form identitas akun yang dibutuhkan.
- Form password dan konfirmasi password jika disepakati.
- Tombol Sign Up.
- Navigasi kembali ke Login.

Perilaku:
- Validasi input.
- Menampilkan pesan kesalahan yang dapat dipahami.
- Memberikan feedback setelah pendaftaran berhasil atau gagal.

### 3.4 Dashboard

Halaman utama setelah pengguna masuk ke aplikasi.

Elemen utama:
- Navigasi aplikasi.
- Bagian Materi.
- Bagian Praktik atau latihan.
- Konten ringkasan yang relevan dengan fitur MVP.

Tujuan:
- Menjadi titik awal untuk mengakses pembelajaran.
- Mengarahkan pengguna menuju materi dan latihan soal.

Informasi tambahan seperti statistik belajar atau rekomendasi materi dapat ditambahkan setelah kebutuhan MVP terpenuhi.

### 3.5 Profil

Halaman yang menampilkan informasi akun pengguna.

Elemen berdasarkan wireframe:
- Avatar atau foto profil.
- Email.
- Username.
- Bio.
- Tombol Tambah Ujian.
- Tombol Lihat Hasil.
- Tombol Edit Materi.
- Tombol Menu Admin.

Catatan:
- Fitur yang hanya ditujukan kepada admin harus ditampilkan berdasarkan hak akses pengguna.
- Tombol yang belum memiliki fungsi pada MVP tidak boleh memberikan kesan bahwa fungsinya sudah tersedia.
- Fungsi setiap tombol perlu dikonfirmasi kembali bersama tim.

### 3.6 Daftar Materi

Halaman yang menampilkan daftar mata pelajaran atau materi.

Elemen:
- Judul halaman.
- Daftar mata pelajaran.
- Kartu atau item materi.
- Navigasi menuju daftar bab.

Perilaku:
- Pengguna dapat memilih mata pelajaran.
- Sistem menampilkan kondisi loading, error, dan empty state sesuai kondisi data.

### 3.7 Daftar Bab dan Subbab

Halaman yang menampilkan struktur pembelajaran dalam suatu mata pelajaran.

Elemen:
- Nama mata pelajaran.
- Daftar bab.
- Daftar subbab atau materi yang tersedia.
- Navigasi kembali ke daftar materi.

Perilaku:
- Pengguna dapat memilih bab atau subbab.
- Struktur daftar tetap mudah digunakan pada layar kecil.

### 3.8 Detail Materi

Halaman untuk membaca isi pembelajaran.

Elemen:
- Judul materi.
- Isi materi.
- Navigasi bab atau subbab.
- Bagian NOTE jika relevan dengan konten.
- Navigasi menuju latihan soal jika tersedia.

Perilaku:
- Konten harus tetap terbaca pada layar mobile.
- Paragraf, gambar, tabel, dan elemen konten lain tidak boleh melampaui lebar layar.
- Navigasi ke latihan harus jelas.

### 3.9 Halaman Praktik atau Latihan Soal

Halaman untuk mengerjakan soal berdasarkan materi.

Elemen:
- Judul latihan.
- Pertanyaan.
- Pilihan jawaban.
- Navigasi soal jika diperlukan.
- Tombol untuk mengirim jawaban atau menyelesaikan latihan.

Perilaku:
- Pengguna dapat memilih jawaban.
- Jawaban yang dipilih terlihat jelas.
- Sistem memberikan feedback ketika latihan dikirim.
- Proses penilaian dilakukan oleh backend.
- Status pengiriman harus jelas agar pengguna tidak mengirim jawaban berulang kali tanpa sengaja.

### 3.10 Halaman Hasil

Halaman untuk menampilkan hasil latihan yang telah diselesaikan.

Elemen:
- Nilai atau skor.
- Ringkasan jumlah jawaban benar dan salah jika tersedia.
- Informasi hasil pengerjaan.
- Tombol untuk mengulang latihan atau kembali ke materi jika fitur tersebut tersedia.

Perilaku:
- Hasil yang ditampilkan harus berasal dari respons backend.
- Tampilan harus membedakan kondisi berhasil, gagal memuat hasil, dan belum adanya riwayat pengerjaan.

### 3.11 Halaman Jadwal

Wireframe menampilkan jadwal dari hari Senin sampai Jumat.

Elemen:
- Judul halaman.
- Pembagian jadwal berdasarkan hari.
- Daftar kegiatan pada setiap hari.

Catatan:
- Format waktu, mekanisme pengelolaan jadwal, dan fungsi penambahan kegiatan perlu dikonfirmasi.
- Jika fitur jadwal belum termasuk MVP, halaman ini dapat ditunda tanpa mengganggu alur pembelajaran utama.

### 3.12 Halaman Konsultasi

Wireframe menampilkan kategori:
- MBTI.
- Tes Minat Bakat.
- Tes Gaya Belajar.
- Info Magang.

Elemen:
- Judul halaman.
- Daftar kategori konsultasi.
- Deskripsi singkat setiap kategori jika diperlukan.
- Navigasi menuju detail kategori.

Catatan:
- Jenis tes, metode konsultasi, serta bentuk hasil yang diberikan perlu ditentukan.
- Fitur konsultasi bukan prioritas MVP apabila implementasinya berisiko mengganggu penyelesaian fitur materi dan latihan.

### 3.13 Halaman Ujian Tulis

Wireframe menampilkan kategori:
- Kimia.
- Fisika.
- Matematika.
- Valorant.

Elemen:
- Judul halaman.
- Daftar kategori ujian.
- Navigasi menuju latihan atau ujian terkait.

**Perlu konfirmasi:** Kategori Valorant perlu divalidasi bersama tim karena belum jelas apakah memang bagian dari kebutuhan produk atau hanya elemen sementara pada wireframe.

### 3.14 Footer

Wireframe mencantumkan teks "Manuk Emprit Prodaction Grup".

Catatan:
- Ejaan dan penggunaan nama tersebut perlu dikonfirmasi.
- Footer harus tetap proporsional pada mobile dan desktop.
- Informasi footer tidak boleh mengganggu akses terhadap konten utama.

## 4. Navigasi dan Alur Pengguna

### 4.1 Alur pengguna baru

Welcome Page → Sign Up → Login atau Dashboard setelah pendaftaran berhasil, sesuai mekanisme autentikasi yang dipilih.

### 4.2 Alur pengguna yang sudah memiliki akun

Welcome Page → Login → Dashboard.

### 4.3 Alur pembelajaran utama

Dashboard → Daftar Materi → Mata Pelajaran → Bab atau Subbab → Detail Materi → Praktik atau Latihan Soal → Hasil.

Alur ini merupakan prioritas desain karena berkaitan langsung dengan fungsi utama MVP.

### 4.4 Alur profil

Dashboard → Profil → Melihat informasi akun atau membuka fungsi profil yang tersedia sesuai hak akses.

### 4.5 Alur fitur tambahan

Dashboard → Jadwal, Konsultasi, atau Ujian Tulis jika fitur terkait sudah tersedia dan telah disetujui untuk dirilis.

### 4.6 Aturan navigasi

- Pengguna harus dapat memahami halaman yang sedang dibuka.
- Navigasi kembali harus tersedia ketika diperlukan.
- Navigasi utama harus menyesuaikan ukuran layar.
- Fitur yang belum tersedia tidak boleh diarahkan ke halaman kosong tanpa penjelasan.
- Hak akses admin harus diterapkan di backend, bukan hanya dengan menyembunyikan tombol di frontend.

## 5. Komponen UI yang Dapat Digunakan Kembali

Komponen berikut merupakan usulan struktur komponen frontend.

### 5.1 AppHeader

Digunakan sebagai header atau navigasi utama.

Tanggung jawab:
- Menampilkan identitas PINTARA.
- Menyediakan navigasi utama.
- Menyesuaikan bentuk navigasi berdasarkan ukuran layar.

### 5.2 PageTitle

Menampilkan judul dan, jika diperlukan, deskripsi singkat halaman.

### 5.3 PrimaryButton

Komponen tombol utama untuk tindakan seperti Login, Sign Up, dan mengirim latihan.

Ketentuan:
- Memiliki kondisi normal, hover, focus, disabled, dan loading jika relevan.
- Ukuran area interaksi memadai untuk sentuhan.

### 5.4 FormInput

Komponen input untuk autentikasi dan formulir lain.

Ketentuan:
- Label jelas.
- Mendukung pesan validasi.
- Memiliki indikator focus.
- Menggunakan tipe input yang sesuai.

### 5.5 ProfileAvatar

Menampilkan foto atau avatar pengguna.

### 5.6 SubjectCard

Menampilkan mata pelajaran atau materi yang dapat dipilih.

### 5.7 ChapterList

Menampilkan daftar bab dan subbab secara terstruktur.

### 5.8 ContentPanel

Menampilkan isi materi pembelajaran.

### 5.9 NotePanel

Menampilkan catatan, tips, atau informasi tambahan dalam materi.

### 5.10 PracticeQuestion

Menampilkan pertanyaan dan pilihan jawaban.

### 5.11 ResultSummary

Menampilkan ringkasan hasil latihan.

### 5.12 DaySection

Menampilkan daftar jadwal berdasarkan hari.

### 5.13 ConsultationItem

Menampilkan kategori konsultasi atau tes.

### 5.14 AppFooter

Menampilkan informasi footer.

### 5.15 Status Components

Komponen bersama untuk kondisi:
- Loading.
- Error.
- Empty state.
- Success atau confirmation message.

Penggunaan komponen bersama ini membantu menjaga konsistensi perilaku aplikasi.

## 6. Sistem Visual

Wireframe referensi menunjukkan penggunaan beberapa warna, termasuk biru, magenta, ungu, dan biru muda. Warna tersebut merupakan referensi awal, bukan palet final yang sudah disetujui.

### 6.1 Warna

Tim UI/UX perlu menentukan:
- Warna primer.
- Warna sekunder.
- Warna latar belakang.
- Warna teks utama dan sekunder.
- Warna border.
- Warna status berhasil, peringatan, dan error.

Kontras teks dan latar belakang harus memadai agar informasi dapat dibaca.

### 6.2 Tipografi

Gunakan hierarki tipografi yang konsisten untuk:
- Judul halaman.
- Judul bagian.
- Judul kartu.
- Isi materi.
- Label input.
- Teks bantuan.
- Pesan error.

Ukuran teks perlu disesuaikan dengan konteks dan ukuran layar tanpa membuat konten sulit dibaca.

### 6.3 Spacing dan layout

- Gunakan sistem spacing yang konsisten.
- Berikan jarak yang cukup antarbagian.
- Hindari tampilan terlalu padat.
- Gunakan container dengan lebar yang sesuai.
- Hindari lebar tetap yang membuat konten terpotong pada layar kecil.

### 6.4 Bentuk komponen

Radius sudut, border, bayangan, ikon, dan gaya kartu harus konsisten. Nilai final ditentukan bersama tim UI/UX berdasarkan desain Figma.

## 7. Responsive Design: Mobile, Tablet, dan Desktop

### 7.1 Tujuan

PINTARA harus menggunakan satu implementasi frontend yang dapat menyesuaikan diri dengan ukuran layar berbeda. Desain tidak boleh sekadar mengecilkan tampilan desktop; susunan komponen dan navigasi dapat berubah sesuai kebutuhan perangkat.

Pendekatan yang digunakan adalah **mobile-first responsive design**.

### 7.2 Breakpoint awal

Breakpoint berikut merupakan titik awal implementasi dan dapat disesuaikan setelah pengujian.

| Perangkat | Lebar viewport | Pendekatan layout |
|---|---|---|
| Mobile | Di bawah 640 px | Satu kolom, navigasi ringkas, fokus pada konten utama |
| Tablet | 640–1023 px | Layout fleksibel, dua kolom jika ruang mencukupi |
| Desktop | 1024 px ke atas | Layout lebih luas, grid dan navigasi desktop |

Breakpoint harus diterapkan berdasarkan kebutuhan konten, bukan hanya berdasarkan nama perangkat.

### 7.3 Aturan responsive umum

1. Gunakan CSS Flexbox dan Grid untuk layout fleksibel.
2. Hindari lebar tetap pada container utama.
3. Gunakan `width: 100%` dan `max-width` ketika sesuai.
4. Gunakan `box-sizing: border-box`.
5. Pastikan elemen fleksibel dapat menyusut, termasuk dengan `min-width: 0` jika diperlukan.
6. Gambar dan media tidak boleh melebihi container.
7. Hindari horizontal scrolling pada halaman utama.
8. Formulir harus menyesuaikan lebar layar.
9. Tombol dan kontrol harus mudah digunakan dengan mouse maupun sentuhan.
10. Jangan menjadikan hover sebagai satu-satunya cara untuk mengakses fungsi.
11. Konten panjang, tabel, dan kode jika ada harus memiliki strategi tampilan yang sesuai pada mobile.
12. Uji ukuran teks, jarak, dan keterbacaan pada layar kecil.

### 7.4 Welcome, Login, dan Sign Up

**Mobile:**
- Form ditampilkan dalam satu kolom.
- Lebar form menyesuaikan viewport dengan padding yang cukup.
- Tombol utama mudah dijangkau dan ditekan.
- Tidak ada elemen dekoratif yang menghalangi formulir.

**Tablet dan desktop:**
- Form dapat ditempatkan di tengah halaman atau dalam layout dua bagian jika sesuai desain visual.
- Lebar form dibatasi agar tidak terlalu lebar.
- Elemen identitas PINTARA dapat ditampilkan lebih luas tanpa mengganggu fokus pada autentikasi.

### 7.5 Dashboard

**Mobile:**
- Navigasi dibuat ringkas.
- Konten utama ditampilkan satu kolom.
- Kartu materi atau praktik tersusun vertikal.
- Informasi yang paling penting ditampilkan terlebih dahulu.

**Tablet:**
- Kartu dapat disusun dalam dua kolom jika ukuran masing-masing masih memadai.

**Desktop:**
- Kartu dapat menggunakan grid beberapa kolom.
- Konten dapat menggunakan ruang layar secara lebih optimal tanpa menjadi terlalu lebar.

### 7.6 Daftar Materi dan Bab

**Mobile:**
- Kartu atau item materi menggunakan satu kolom.
- Judul panjang dapat membungkus ke baris berikutnya.
- Tombol atau area item mudah disentuh.

**Tablet dan desktop:**
- Daftar materi dapat menggunakan grid.
- Jumlah kolom mengikuti lebar container dan kebutuhan konten.

Daftar bab dan subbab tetap harus memiliki hierarki visual yang jelas pada semua ukuran layar.

### 7.7 Detail Materi

**Mobile:**
- Konten menggunakan satu kolom.
- Ukuran teks nyaman dibaca.
- Gambar menyesuaikan lebar container.
- NOTE atau catatan tambahan ditampilkan tanpa menutupi materi utama.
- Navigasi bab dan subbab tidak boleh memaksa halaman melebar.

**Desktop:**
- Konten dapat menggunakan lebar baca yang dibatasi.
- Jika diperlukan, navigasi materi dapat ditempatkan di samping konten.
- Ruang tambahan tidak boleh membuat baris teks terlalu panjang sehingga sulit dibaca.

### 7.8 Praktik dan Latihan Soal

**Mobile:**
- Pertanyaan ditampilkan dalam satu kolom.
- Pilihan jawaban tersusun vertikal.
- Area pemilihan jawaban mudah disentuh.
- Tombol submit atau lanjut mudah ditemukan.
- Status pengerjaan dan feedback tetap terlihat.

**Tablet dan desktop:**
- Pertanyaan dapat ditampilkan dalam container yang lebih luas.
- Panel informasi tambahan dapat ditempatkan di samping jika bermanfaat.
- Pilihan jawaban tetap memiliki jarak dan keterbacaan yang memadai.

Fungsi pengerjaan dan penilaian harus tetap sama pada seluruh ukuran layar.

### 7.9 Hasil Latihan

**Mobile:**
- Nilai dan ringkasan ditampilkan vertikal.
- Informasi penting muncul terlebih dahulu.
- Tombol kembali ke materi atau mengulang latihan disusun agar mudah digunakan.

**Desktop:**
- Ringkasan dapat menggunakan beberapa kartu atau kolom jika membantu pemahaman.

### 7.10 Profil

**Mobile:**
- Informasi pengguna ditampilkan vertikal.
- Aksi profil disusun sebagai daftar tombol atau kartu.
- Fungsi admin hanya muncul untuk pengguna yang berhak.

**Desktop:**
- Informasi profil dan aksi dapat ditempatkan dalam dua kolom jika sesuai desain.

### 7.11 Jadwal

**Mobile:**
- Jadwal ditampilkan per hari dalam susunan vertikal.
- Hindari tabel lebar yang memerlukan scrolling horizontal tanpa kebutuhan.
- Informasi waktu dan kegiatan harus mudah dipindai.

**Desktop:**
- Jadwal dapat menggunakan susunan kolom atau grid apabila sesuai dengan kebutuhan.

### 7.12 Konsultasi dan Ujian Tulis

**Mobile:**
- Kategori ditampilkan sebagai daftar atau kartu satu kolom.
- Judul kategori dan tindakan utama harus terlihat jelas.

**Tablet dan desktop:**
- Kategori dapat menggunakan grid beberapa kolom.

### 7.13 Header dan Footer

**Mobile:**
- Header menggunakan navigasi ringkas.
- Jika navigasi menggunakan menu yang dapat dibuka, menu harus bisa diakses melalui keyboard dan sentuhan.
- Footer disusun vertikal bila ruang tidak mencukupi.

**Desktop:**
- Navigasi utama dapat ditampilkan secara horizontal.
- Footer dapat menggunakan beberapa kolom jika dibutuhkan.

## 8. Aksesibilitas dan Feedback UI

### 8.1 Aksesibilitas dasar

- Gunakan label yang jelas untuk setiap input.
- Gunakan elemen HTML semantik.
- Pastikan navigasi dapat digunakan dengan keyboard.
- Tampilkan indikator focus yang terlihat.
- Jangan mengandalkan warna saja untuk menyampaikan status.
- Pastikan kontras teks memadai.
- Berikan nama atau label yang dapat dipahami untuk kontrol interaktif.

### 8.2 Loading state

Tampilkan indikator ketika aplikasi sedang mengambil materi, memproses login, mengirim jawaban, atau mengambil hasil.

### 8.3 Error state

Pesan error harus menjelaskan masalah dengan bahasa yang mudah dipahami dan, jika memungkinkan, memberikan langkah berikutnya.

### 8.4 Empty state

Jika materi, jadwal, atau riwayat belum tersedia, tampilkan informasi yang menjelaskan kondisi tersebut alih-alih membiarkan halaman kosong.

### 8.5 Disabled state

Tombol yang belum dapat digunakan harus memiliki tampilan berbeda dan tidak boleh memberi kesan bahwa tindakan berhasil dilakukan.

## 9. Implementasi Frontend

Implementasi frontend yang direncanakan menggunakan:
- React.
- Vite.
- TypeScript.
- CSS responsif.

Detail framework CSS atau component library belum ditetapkan dan perlu dipilih berdasarkan waktu pengerjaan, kemampuan tim, serta kebutuhan desain.

### 9.1 Struktur komponen yang disarankan

```text
src/
├── components/
│   ├── layout/
│   │   ├── AppHeader.tsx
│   │   └── AppFooter.tsx
│   ├── common/
│   │   ├── PrimaryButton.tsx
│   │   ├── FormInput.tsx
│   │   └── StatusMessage.tsx
│   ├── materials/
│   │   ├── SubjectCard.tsx
│   │   ├── ChapterList.tsx
│   │   └── ContentPanel.tsx
│   └── practice/
│       ├── PracticeQuestion.tsx
│       └── ResultSummary.tsx
├── pages/
│   ├── WelcomePage.tsx
│   ├── LoginPage.tsx
│   ├── SignUpPage.tsx
│   ├── DashboardPage.tsx
│   ├── ProfilePage.tsx
│   ├── SubjectsPage.tsx
│   ├── LessonPage.tsx
│   ├── PracticePage.tsx
│   └── ResultPage.tsx
├── services/
├── hooks/
├── styles/
│   ├── global.css
│   ├── variables.css
│   └── responsive.css
├── App.tsx
└── main.tsx
```

Struktur ini merupakan rekomendasi awal, bukan ketentuan yang tidak boleh diubah. Struktur final harus mengikuti pembagian tanggung jawab dan kesepakatan tim.

### 9.2 Aturan CSS

- Gunakan CSS variables untuk warna, spacing, dan nilai visual yang digunakan berulang.
- Gunakan media queries untuk perubahan layout yang diperlukan.
- Hindari duplikasi aturan CSS.
- Hindari penggunaan ukuran tetap yang merusak layout.
- Pisahkan style global dan style spesifik komponen jika membantu pemeliharaan.
- Pastikan komponen tetap berfungsi ketika teks lebih panjang dari perkiraan.

Contoh pendekatan:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

img,
video {
  max-width: 100%;
  height: auto;
}

.page-container {
  width: min(100% - 2rem, 1200px);
  margin-inline: auto;
}

.subject-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .subject-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .subject-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
```

Contoh di atas hanya menggambarkan pola implementasi responsif. Nilai final dan nama kelas dapat disesuaikan dengan desain aktual.

## 10. Prioritas Implementasi Desain

### P0 — Wajib untuk MVP

- Layout responsif untuk alur pembelajaran utama.
- Welcome, Login, dan Sign Up jika autentikasi termasuk MVP.
- Dashboard.
- Daftar materi.
- Detail materi.
- Praktik atau latihan soal.
- Halaman hasil.
- Loading, error, dan empty state.
- Integrasi frontend dengan backend untuk mengambil materi dan mengirim jawaban.
- Pengujian pada mobile dan desktop.

### P1 — Setelah alur utama stabil

- Profil lengkap.
- Riwayat hasil.
- Halaman admin dan pengelolaan materi.
- Jadwal.
- Penyempurnaan navigasi dan sistem visual.

### P2 — Fitur lanjutan

- Konsultasi.
- Tes minat bakat atau gaya belajar.
- Rekomendasi pembelajaran.
- Analitik lanjutan dan fitur lain yang belum menjadi kebutuhan MVP.

Prioritas di atas merupakan usulan implementasi untuk menjaga fokus pengerjaan. Tim harus menyelaraskannya dengan `spec.md` dan keputusan final hackathon.

## 11. Acceptance Criteria Desain

Desain dianggap memenuhi kebutuhan dasar jika:

1. Pengguna dapat membuka halaman utama tanpa layout rusak.
2. Pengguna dapat mengikuti alur materi → latihan → hasil pada mobile dan desktop.
3. Tidak ada horizontal overflow yang tidak diperlukan pada viewport yang diuji.
4. Kartu dan container menyesuaikan lebar layar.
5. Formulir tetap terbaca dan dapat digunakan pada mobile.
6. Pertanyaan dan pilihan jawaban tetap mudah dibaca serta dipilih.
7. Tombol utama mudah digunakan melalui mouse maupun sentuhan.
8. Navigasi tetap dapat diakses pada seluruh ukuran layar.
9. Loading, error, empty, dan disabled state ditampilkan sesuai kondisi.
10. Teks panjang, gambar, dan konten materi tidak merusak layout.
11. Elemen interaktif memiliki label yang jelas dan indikator focus.
12. Kontrol admin tidak ditampilkan sebagai fungsi yang tersedia bagi pengguna tanpa hak akses.
13. Implementasi frontend sesuai dengan desain yang telah disepakati tim.
14. Perubahan ukuran viewport tidak menyebabkan fungsi utama hilang.

## 12. Pengujian Responsive

Pengujian awal dilakukan pada viewport berikut:

| Viewport | Tujuan |
|---|---|
| 375 px | Memastikan tampilan mobile kecil tetap berfungsi |
| 390 px | Memeriksa tampilan mobile umum |
| 768 px | Memeriksa layout tablet |
| 1024 px | Memeriksa transisi ke layout desktop |
| 1440 px | Memastikan penggunaan ruang desktop tetap proporsional |

Daftar tersebut merupakan ukuran viewport untuk pengujian, bukan jaminan kompatibilitas dengan seluruh perangkat.

Pada setiap ukuran, periksa:
- Navigasi.
- Formulir.
- Grid dan kartu.
- Konten materi.
- Pilihan jawaban.
- Tombol submit.
- Halaman hasil.
- Loading dan error state.
- Horizontal overflow.
- Penggunaan dengan mouse, keyboard, dan sentuhan jika tersedia.

## 13. Hal yang Perlu Dikonfirmasi

Sebelum desain dianggap final, tim perlu memastikan:

1. Apakah seluruh halaman dalam wireframe harus dibuat pada versi MVP?
2. Apakah kategori Valorant pada Ujian Tulis memang disengaja?
3. Apakah teks footer "Manuk Emprit Prodaction Grup" sudah benar?
4. Apa fungsi pasti tombol Tambah Ujian, Lihat Hasil, Edit Materi, dan Menu Admin?
5. Apakah Jadwal dan Konsultasi benar-benar termasuk ruang lingkup produk?
6. Apa palet warna, tipografi, ikon, radius, dan sistem spacing final?
7. Bagaimana navigasi mobile akan ditampilkan?
8. Apakah desain desktop memerlukan sidebar atau cukup menggunakan header?
9. Apakah halaman latihan mendukung satu soal per halaman atau beberapa soal sekaligus?
10. Apakah ada desain Figma final yang sudah mencakup tampilan mobile dan desktop?

## 14. Definition of Done

Desain dan implementasi UI dapat dianggap selesai untuk suatu fitur apabila:

- Struktur halaman sesuai kebutuhan yang disepakati.
- Tampilan mengikuti sistem visual yang disetujui.
- Layout berfungsi pada mobile, tablet, dan desktop.
- Seluruh tombol dan kontrol yang ditampilkan memiliki perilaku yang jelas.
- Loading, error, empty, dan success state yang relevan telah ditangani.
- Tidak terdapat masalah layout yang menghambat alur utama.
- Fitur telah diuji pada viewport yang ditentukan.
- Implementasi telah diintegrasikan dengan backend jika fitur memerlukan data.
- Tim telah memeriksa hasil implementasi sebelum fitur dinyatakan selesai.

---

**Catatan akhir:** Dokumen ini merupakan gabungan rancangan halaman berdasarkan wireframe, rekomendasi komponen UI, dan persyaratan responsive design. Wireframe menjadi referensi struktur awal, sedangkan detail visual final tetap mengikuti hasil validasi tim UI/UX dan desain Figma yang disepakati.
