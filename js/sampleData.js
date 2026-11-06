/**
 * sampleData.js - Preset data realistis untuk pengujian cepat & demo
 */

export const SAMPLE_PROFILES = {
  admin: {
    title: 'Staf Administrasi & Operasional (Berpengalaman)',
    data: {
      nama: 'Muhammad Farhan Pratama',
      tempat_lahir: 'Jakarta',
      tanggal_lahir: '1998-05-14',
      alamat: 'Jl. Melati Indah No. 18, Kebayoran Baru, Jakarta Selatan',
      telepon: '081289102934',
      email: 'm.farhan.pratama@gmail.com',
      pendidikan: 'S1 Manajemen Bisnis - Universitas Indonesia',
      status_pendidikan: 'Lulus',
      nama_perusahaan: 'PT Nusantara Citra Mandiri',
      nama_penerima: 'Bapak Rian Hidayat, S.Psi.',
      jabatan_penerima: 'HRD & Recruitment Manager',
      alamat_perusahaan: 'Gedung Menara Mulia Lt. 12, Jl. Gatot Subroto No. 42, Jakarta Pusat',
      kota_surat: 'Jakarta',
      tanggal_surat: '6 November 2026',
      sumber_lowongan: 'portal karir LinkedIn PT Nusantara Citra Mandiri',
      posisi: 'Staff Administrasi Operasional',
      jenis_pekerjaan: 'Penuh Waktu (Full-time)',
      motivasi: 'Saya berkeinginan kuat untuk turut berkontribusi dalam menjaga efisiensi dan tata kelola administrasi operasional perusahaan melalui dedikasi kerja yang terstruktur dan berorientasi hasil.',
      pengalaman: 'bekerja selama 2 tahun sebagai staf administrasi logistik di PT Mitra Sejahtera, dengan tanggung jawab mengelola arsip digital, laporan inventaris harian, dan koordinasi pengadaan barang operasional.',
      keahlian: 'Microsoft Office tingkat lanjut (Excel, Word, PowerPoint), pengelolaan database ERP, korespondensi formal, serta manajemen waktu kerja.',
      deskripsi_diri: 'Saya adalah individu yang teliti, adaptif, terbiasa bekerja di bawah tenggat waktu, dan memiliki komunikasi yang baik dalam tim.',
      attachments: [
        { id: 'cv', name: 'Curriculum Vitae (CV) Terbaru', checked: true },
        { id: 'ktp', name: 'Fotokopi Kartu Tanda Penduduk (KTP)', checked: true },
        { id: 'ijazah', name: 'Fotokopi Ijazah Sarjana (S1)', checked: true },
        { id: 'transkrip', name: 'Fotokopi Transkrip Nilai Akademik', checked: true },
        { id: 'pas_foto', name: 'Pas Foto Terbaru Ukuran 4x6 (2 lembar)', checked: true },
        { id: 'paklaring', name: 'Surat Pengalaman Kerja (Paklaring)', checked: true },
        { id: 'skck', name: 'Fotokopi SKCK dari Kepolisian yang Masih Berlaku', checked: true },
        { id: 'sertifikat', name: 'Sertifikat Pelatihan Microsoft Office Specialist', checked: true }
      ]
    }
  },

  fresh_graduate: {
    title: 'Fresh Graduate (Tanpa Pengalaman Kerja)',
    data: {
      nama: 'Aisyah Putri Rahmawati',
      tempat_lahir: 'Surabaya',
      tanggal_lahir: '2003-08-22',
      alamat: 'Jl. Gubeng Kertajaya IXB No. 14, Tambaksari, Surabaya',
      telepon: '085732148765',
      email: 'aisyah.rahmawati@outlook.com',
      pendidikan: 'S1 Sistem Informasi - Institut Teknologi Sepuluh Nopember',
      status_pendidikan: 'Lulus (Fresh Graduate)',
      nama_perusahaan: 'PT Digital Solusindo Pratama',
      nama_penerima: '',
      jabatan_penerima: 'Manajer Sumber Daya Manusia (HRD)',
      alamat_perusahaan: 'Jl. Mayjen Sungkono No. 88, Dukuh Pakis, Surabaya',
      kota_surat: 'Surabaya',
      tanggal_surat: '6 November 2026',
      sumber_lowongan: 'portal lowongan kerja JobStreet',
      posisi: 'Junior Business Analyst',
      jenis_pekerjaan: 'Penuh Waktu (Full-time)',
      motivasi: 'Sebagai lulusan baru dengan latar belakang analisis sistem informasi, saya sangat termotivasi untuk memulai langkah karir profesional serta mendedikasikan ilmu yang saya miliki demi pengembangan produk digital perusahaan.',
      pengalaman: '',
      keahlian: 'Analisis kebutuhan sistem, pemodelan proses bisnis (BPMN, Flowchart), SQL, dokumentasi teknis, serta komunikasi analitis.',
      deskripsi_diri: 'Saya memiliki antusiasme belajar yang tinggi, berpikir logis, cepat menguasai piranti lunak baru, dan mampu bekerjasama secara dinamis.',
      attachments: [
        { id: 'cv', name: 'Curriculum Vitae (CV) Terbaru', checked: true },
        { id: 'ktp', name: 'Fotokopi KTP', checked: true },
        { id: 'ijazah', name: 'Fotokopi Ijazah Terakhir', checked: true },
        { id: 'transkrip', name: 'Fotokopi Transkrip Nilai Akademik', checked: true },
        { id: 'portofolio', name: 'Portofolio Proyek Tugas Akhir & Magang Kampus', checked: true },
        { id: 'pas_foto', name: 'Pas Foto Berwarna Terbaru 3x4', checked: true },
        { id: 'sertifikat', name: 'Sertifikat Kompetensi Analisis Data Google', checked: true }
      ]
    }
  },

  retail_kasir: {
    title: 'Staf Kasir & Pelayanan Pelanggan (Retail)',
    data: {
      nama: 'Bagus Setiawan',
      tempat_lahir: 'Bandung',
      tanggal_lahir: '2001-11-03',
      alamat: 'Jl. Cikutra Barat No. 55, Coblong, Bandung',
      telepon: '089612345678',
      email: 'bagus.setiawan99@gmail.com',
      pendidikan: 'SMK Negeri 1 Bandung (Jurusan Akuntansi)',
      status_pendidikan: 'Lulus',
      nama_perusahaan: 'PT Retailindo Nusantara Jaya',
      nama_penerima: 'Ibu Ratna Dewi',
      jabatan_penerima: 'Store Manager / Pimpinan Toko',
      alamat_perusahaan: 'Jl. R.E. Martadinata No. 102, Bandung',
      kota_surat: 'Bandung',
      tanggal_surat: '6 November 2026',
      sumber_lowongan: '',
      posisi: 'Kasir & Frontliner',
      jenis_pekerjaan: 'Penuh Waktu (Full-time)',
      motivasi: 'Saya berkeinginan untuk memberikan layanan transaksi yang cepat, akurat, dan ramah guna meningkatkan kepuasan dan kenyamanan setiap pelanggan.',
      pengalaman: 'memiliki pengalaman kerja paruh waktu selama 1 tahun di bidang retail toko serba ada, terbiasa mengoperasikan mesin kasir POS, rekonsiliasi kas harian, dan pelayanan kasir prima.',
      keahlian: 'Pengoperasian sistem POS kasir, ketelitian hitung uang tunai/digital, pelayanan pelanggan prima (service excellence), dan stock opname barang.',
      deskripsi_diri: 'Saya adalah pribadi yang ramah, jujur, teliti dalam perhitungan uang, serta berpenampilan rapi dan sopan.',
      attachments: [
        { id: 'cv', name: 'Curriculum Vitae (CV)', checked: true },
        { id: 'ktp', name: 'Fotokopi Kartu Tanda Penduduk (KTP)', checked: true },
        { id: 'ijazah', name: 'Fotokopi Ijazah SMK', checked: true },
        { id: 'skck', name: 'Fotokopi SKCK dari Kepolisian', checked: true },
        { id: 'pas_foto', name: 'Pas Foto 3x4 (2 Lembar)', checked: true },
        { id: 'sehat', name: 'Surat Keterangan Sehat dari Dokter', checked: true }
      ]
    }
  }
};

export const DEFAULT_ATTACHMENTS_LIST = [
  { id: 'cv', name: 'Curriculum Vitae (CV) Terbaru', checked: true },
  { id: 'ktp', name: 'Fotokopi Kartu Tanda Penduduk (KTP)', checked: true },
  { id: 'ijazah', name: 'Fotokopi Ijazah Terakhir', checked: true },
  { id: 'transkrip', name: 'Fotokopi Transkrip Nilai Akademik', checked: true },
  { id: 'pas_foto', name: 'Pas Foto Berwarna Terbaru', checked: true },
  { id: 'sertifikat', name: 'Fotokopi Sertifikat Keahlian / Pelatihan', checked: false },
  { id: 'portofolio', name: 'Portofolio Hasil Kerja / Proyek', checked: false },
  { id: 'paklaring', name: 'Surat Keterangan Pengalaman Kerja (Paklaring)', checked: false },
  { id: 'skck', name: 'Fotokopi Surat Keterangan Catatan Kepolisian (SKCK)', checked: false },
  { id: 'sehat', name: 'Surat Keterangan Bebas Narkoba / Sehat Dokter', checked: false }
];

