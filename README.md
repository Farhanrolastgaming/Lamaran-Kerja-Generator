# 📄 SuratLamaran Generator – All Job Edition

> Website aplikasi pembuat surat lamaran kerja formal dan profesional berbasis frontend murni (HTML5, CSS3, Vanilla JavaScript). Mendukung segala jenis posisi pekerjaan, pratinjau real-time standar dokumen A4, serta ekspor dokumen resmi **PDF** dan **Microsoft Word (.docx)** asli.

---

## 🌟 Fitur Utama

1. **All-Job Support (Bebas untuk Semua Posisi Pekerjaan)**
   - Input posisi bebas tanpa batasan dropdown profesi.
   - Cocok untuk *fresh graduate*, pelajar/mahasiswa, pelamar berpengalaman, kasir, staf administrasi, pengajar, tenaga IT, hingga level manajerial.

2. **Penyusun Kalimat Formal Standar EYD / PUEBI**
   - Menghasilkan narasi surat yang mengalir, sopan, dan formal.
   - **Anti-Placeholder:** Tidak menghasilkan teks kosong seperti `[Nama Perusahaan]` atau `[Posisi]`.
   - **Logika Kondisional Berbobot:** Jika pengalaman kerja tidak diisi, sistem tidak membuat klaim bohong dan menyesuaikan narasi pada kompetensi serta antusiasme kerja secara profesional.

3. **Dokumen Lampiran Dinamis**
   - Checklist berkas umum (CV, KTP, Ijazah, Transkrip, Portofolio, SKCK, dll.).
   - Tambah lampiran kustom, ubah nama, hapus, dan atur urutan (naik/turun).
   - Jumlah berkas dihitung otomatis pada bagian perihal surat (misal: *8 (delapan) Berkas*).

4. **Live Document Preview A4**
   - Pratinjau virtual menyerupai kertas A4 fisik dengan margin 2,5 cm, font resmi Times New Roman 12 pt, dan tabel identitas 2 kolom sejajar.
   - Sinkronisasi realtime saat pengguna mengisi formulir.
   - **Mode Edit Manual Langsung:** Pengguna dapat mengklik dan mengubah kalimat langsung pada lembar surat sebelum ekspor, dengan opsi reset ke formulir kapan saja.

5. **Ekspor Microsoft Word (.docx) Asli**
   - Menggunakan pustaka native `docx.js` (bukan sekadar file HTML yang di-rename).
   - Menghasilkan file `.docx` valid berukuran A4, margin 2,5 cm, tabel identitas 2 kolom tanpa border, dan nomor berkas rapi yang dapat diedit langsung di Microsoft Word.
   - Penamaan file otomatis: `Surat_Lamaran_[Nama]_[Posisi].docx`.

6. **Ekspor & Cetak PDF Presisi A4**
   - Menggunakan CSS khusus `@page` dan `@media print`.
   - Menyembunyikan seluruh navigasi dan elemen website.
   - Blok penutup dan tanda tangan dilindungi dari pemotongan halaman secara canggung (`page-break-inside: avoid`).
   - Penamaan file otomatis mengikuti nama pelamar dan posisi saat memilih *Save as PDF*.

7. **100% Client-Side & Privasi Terjamin**
   - Seluruh data diproses secara lokal di browser pengguna.
   - Tidak ada pengiriman data pribadi ke server luar.
   - Dilengkapi *Autosave* ke LocalStorage dan tombol *Reset Formulir* total.

8. **Tersedia Contoh Data Siap Pakai (1-Click Demo)**
   - Staf Administrasi & Logistik (Berpengalaman)
   - Junior Business Analyst / IT (Fresh Graduate)
   - Kasir & Frontliner Retail (Lulusan SMK)

---

## 📁 Struktur Direktori

```text
Lamaran Kerja Generator/
├── index.html          # Struktur UI utama, stepper formulir, dan kontainer A4 preview
├── server.js           # Server statis lokal ringan tanpa dependensi luar
├── package.json        # Konfigurasi npm script (npm start)
├── README.md           # Panduan lengkap dokumentasi proyek
├── css/
│   ├── style.css       # Desain antarmuka SaaS modern (Deep Navy, responsif)
│   └── print.css       # Styling presisi A4 untuk cetak / ekspor PDF
├── js/
│   ├── app.js          # Controller utama (stepper, event listener, binding UI)
│   ├── letterEngine.js # Engine penyusun tata bahasa surat formal PUEBI
│   ├── docxExport.js   # Generator file Microsoft Word (.docx) native
│   ├── storage.js      # Pengelola penyimpanan lokal LocalStorage
│   └── sampleData.js   # Profil contoh data untuk pengujian cepat
└── vendor/
    ├── docx.umd.js     # Library docx.js (versi 9.15.2, offline-ready)
    └── lucide.min.js   # Library Lucide Icons (offline-ready)
```

---

## 🚀 Cara Menjalankan Website

Aplikasi ini dirancang **Universal** dan dapat dibuka dengan dua cara mudah:

### Cara 1: Langsung Double-Click (Tanpa Instalasi Apapun)
Cukup buka folder proyek di Windows Explorer dan **klik dua kali file `index.html`**. Website akan langsung terbuka di browser favorit Anda (Google Chrome, Microsoft Edge, Firefox, dll.) dan seluruh fitur (Contoh Data, Reset, Ekspor Word, Cetak PDF) langsung aktif 100%!

### Cara 2: Menggunakan Web Server Lokal (Node.js)
Jika ingin menjalankan melalui server lokal:
```powershell
node server.js
```
atau
```powershell
npm start
```
Buka browser pada alamat: **`http://localhost:8080/`**

---

## 🛠️ Panduan Penggunaan Fitur

### 1. Mengisi Formulir
- **Langkah 1 (Data Diri):** Isi nama lengkap, tempat/tanggal lahir, alamat, nomor WhatsApp, email, dan pendidikan terakhir.
- **Langkah 2 (Perusahaan):** Isi nama instansi, nama/jabatan penerima, alamat perusahaan, kota surat, tanggal, serta sumber lowongan (jika ada).
- **Langkah 3 (Pekerjaan):** Ketik posisi yang dilamar (teks bebas). Opsional: pengalaman, keahlian, motivasi, dan deskripsi diri.
- **Langkah 4 (Lampiran):** Centang dokumen yang disertakan atau tambah lampiran kustom.

### 2. Live Preview & Edit Manual
- Di layar komputer/laptop, formulir dan lembar surat tampil berdampingan secara *split-screen*.
- Pada smartphone/tablet, gunakan tombol tab **"Formulir"** dan **"Pratinjau Dokumen A4"** di bagian atas.
- Klik tombol **"Edit Manual"** pada toolbar preview jika ingin mengetik atau mengubah kalimat langsung di lembar dokumen A4. Klik **"Selesai Edit"** untuk menyimpan atau **"Reset ke Form"** untuk kembali ke sinkronisasi otomatis.
- Klik **"Salin Teks"** untuk menyalin seluruh isi surat ke clipboard (berguna untuk body email lamaran).

### 3. Mengunduh Dokumen Word (.docx)
1. Klik tombol biru **"Word (.docx)"** di toolbar preview.
2. File asli `.docx` akan langsung diunduh ke folder Downloads komputer Anda dengan nama otomatis (misal: `Surat_Lamaran_Muhammad_Farhan_Admin.docx`).
3. Dokumen dapat langsung dibuka dan diedit menggunakan Microsoft Word, WPS Office, atau Google Docs.

### 4. Mengunduh Dokumen PDF / Cetak
1. Klik tombol merah **"Cetak / PDF"** di toolbar preview.
2. Jendela dialog cetak peramban (*Print Dialog*) akan muncul.
3. Pada opsi **Destination / Tujuan**, pilih **"Save as PDF"** (Simpan sebagai PDF) atau pilih printer fisik Anda.
4. Pastikan opsi:
   - **Paper size / Ukuran kertas:** A4.
   - **Margins:** Default.
5. Klik **Save / Simpan**.

