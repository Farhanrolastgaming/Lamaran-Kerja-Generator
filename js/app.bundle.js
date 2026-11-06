/**
 * app.bundle.js - SuratLamaran Generator Standalone Application Bundle
 * Berfungsi 100% baik dibuka langsung via double-click file:// maupun via web server http://
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. STORAGE MODULE
  // =========================================================================
  const STORAGE_KEY = 'suratlamaran_form_draft';
  const MANUAL_EDIT_KEY = 'suratlamaran_manual_draft';

  const Storage = {
    saveDraft(formData) {
      try {
        const payload = {
          updatedAt: new Date().toISOString(),
          data: formData
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        return true;
      } catch (e) {
        console.warn('Gagal menyimpan draft ke LocalStorage:', e);
        return false;
      }
    },

    loadDraft() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed.data || null;
      } catch (e) {
        console.warn('Gagal memuat draft dari LocalStorage:', e);
        return null;
      }
    },

    saveManualEdit(htmlContent) {
      try {
        localStorage.setItem(MANUAL_EDIT_KEY, htmlContent);
        return true;
      } catch (e) {
        return false;
      }
    },

    loadManualEdit() {
      try {
        return localStorage.getItem(MANUAL_EDIT_KEY) || null;
      } catch (e) {
        return null;
      }
    },

    clearManualEdit() {
      try {
        localStorage.removeItem(MANUAL_EDIT_KEY);
      } catch (e) {}
    },

    clearAll() {
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(MANUAL_EDIT_KEY);
        return true;
      } catch (e) {
        return false;
      }
    }
  };

  // =========================================================================
  // 2. SAMPLE PROFILES & DEFAULT ATTACHMENTS
  // =========================================================================
  const SAMPLE_PROFILES = {
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
        pengalaman: 'bekerja selama 2 tahun sebagai staf administrasi logistik di PT Mitra Sejahtera, dengan tanggung jawab mengelola arsip digital, laporan inventaris harian, dan koordinasi pengadaan barang operasional',
        keahlian: 'Microsoft Office tingkat lanjut (Excel, Word, PowerPoint), pengelolaan database ERP, korespondensi formal, serta manajemen waktu kerja',
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
        status_pendidikan: 'Fresh Graduate',
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
        keahlian: 'Analisis kebutuhan sistem, pemodelan proses bisnis (BPMN, Flowchart), SQL, dokumentasi teknis, serta komunikasi analitis',
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
        pengalaman: 'memiliki pengalaman kerja paruh waktu selama 1 tahun di bidang retail toko serba ada, terbiasa mengoperasikan mesin kasir POS, rekonsiliasi kas harian, dan pelayanan kasir prima',
        keahlian: 'Pengoperasian sistem POS kasir, ketelitian hitung uang tunai/digital, pelayanan pelanggan prima (service excellence), dan stock opname barang',
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

  const DEFAULT_ATTACHMENTS_LIST = [
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

  // =========================================================================
  // 3. LETTER ENGINE MODULE (PUEBI / EYD STANDARDS)
  // =========================================================================
  const LetterEngine = {
    numberToWords(num) {
      const words = [
        'nol', 'satu', 'dua', 'tiga', 'empat', 'lima',
        'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh',
        'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas',
        'enam belas', 'tujuh belas', 'delapan belas', 'sembilan belas', 'dua puluh'
      ];
      if (num >= 0 && num <= 20) return words[num];
      return num.toString();
    },

    formatIndonesianDate(dateStr) {
      if (!dateStr) return '';
      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];

      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr.trim())) {
        const parts = dateStr.trim().split('-');
        const year = parts[0];
        const monthIdx = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        if (monthIdx >= 0 && monthIdx < 12) {
          return `${day} ${months[monthIdx]} ${year}`;
        }
      }
      return dateStr;
    },

    escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    },

    formatSentence(str) {
      if (!str) return '';
      let s = str.trim();
      while (s.endsWith('.')) {
        s = s.slice(0, -1).trim();
      }
      return s.length > 0 ? s + '.' : '';
    },

    sanitizeFormData(raw) {
      const data = raw || {};
      return {
        nama: (data.nama || '').trim(),
        tempat_lahir: (data.tempat_lahir || '').trim(),
        tanggal_lahir: (data.tanggal_lahir || '').trim(),
        alamat: (data.alamat || '').trim(),
        telepon: (data.telepon || '').trim(),
        email: (data.email || '').trim(),
        pendidikan: (data.pendidikan || '').trim(),
        status_pendidikan: (data.status_pendidikan || '').trim(),

        nama_perusahaan: (data.nama_perusahaan || '').trim(),
        nama_penerima: (data.nama_penerima || '').trim(),
        jabatan_penerima: (data.jabatan_penerima || '').trim(),
        alamat_perusahaan: (data.alamat_perusahaan || '').trim(),
        kota_surat: (data.kota_surat || '').trim(),
        tanggal_surat: (data.tanggal_surat || '').trim(),
        sumber_lowongan: (data.sumber_lowongan || '').trim(),

        posisi: (data.posisi || '').trim(),
        jenis_pekerjaan: (data.jenis_pekerjaan || '').trim(),
        motivasi: (data.motivasi || '').trim(),
        pengalaman: (data.pengalaman || '').trim(),
        keahlian: (data.keahlian || '').trim(),
        deskripsi_diri: (data.deskripsi_diri || '').trim(),

        attachments: Array.isArray(data.attachments) ? data.attachments : []
      };
    },

    getActiveAttachments(attachments) {
      if (!Array.isArray(attachments)) return [];
      return attachments.filter(item => item && item.checked && (item.name || '').trim().length > 0);
    },

    buildCompetencyParagraph(data) {
      const hasPengalaman = Boolean(data.pengalaman);
      const hasKeahlian = Boolean(data.keahlian);
      const hasMotivasi = Boolean(data.motivasi);
      const hasDeskripsi = Boolean(data.deskripsi_diri);
      const namaPt = data.nama_perusahaan || 'perusahaan yang Bapak/Ibu pimpin';

      let sentences = [];

      if (hasPengalaman) {
        let expText = data.pengalaman.trim();
        while (expText.endsWith('.')) expText = expText.slice(0, -1).trim();
        if (!/^(saya\s+|bekerja\s+|memiliki\s+|pernah\s+)/i.test(expText)) {
          expText = `memiliki pengalaman dalam bidang ${expText}`;
        }
        sentences.push(this.formatSentence(`Sebelumnya, saya ${expText}`));

        if (hasKeahlian) {
          let skillText = data.keahlian.trim();
          while (skillText.endsWith('.')) skillText = skillText.slice(0, -1).trim();
          sentences.push(this.formatSentence(`Selama menjalani karir tersebut, saya senantiasa mengasah kompetensi teknis maupun interpersonal, khususnya di bidang ${skillText}`));
        }
      } else if (hasKeahlian) {
        let skillText = data.keahlian.trim();
        while (skillText.endsWith('.')) skillText = skillText.slice(0, -1).trim();
        sentences.push(this.formatSentence(`Sebagai pribadi yang berkomitmen tinggi, saya memiliki pemahaman serta keterampilan yang relevan pada bidang ${skillText}`));
        sentences.push(`Saya terbiasa beradaptasi secara cepat, memiliki etos kerja yang kuat, dan selalu siap mempelajari keterampilan baru.`);
      } else {
        sentences.push(`Saya merupakan pribadi yang jujur, disiplin, berdedikasi tinggi, dan senantiasa bertanggung jawab dalam menyelesaikan setiap tugas yang diamanahkan.`);
        sentences.push(`Saya memiliki kemampuan komunikasi yang baik serta dapat bekerja sama secara efektif dalam lingkungan tim maupun secara mandiri.`);
      }

      if (hasDeskripsi) {
        sentences.push(this.formatSentence(data.deskripsi_diri));
      }

      if (hasMotivasi) {
        sentences.push(this.formatSentence(data.motivasi));
      }

      sentences.push(`Dengan kualifikasi dan motivasi tersebut, saya yakin dapat memberikan kontribusi positif yang berkesinambungan bagi perkembangan ${namaPt}.`);

      return sentences.filter(Boolean).join(' ');
    },

    composeLetterData(raw) {
      const d = this.sanitizeFormData(raw);
      const activeAttachments = this.getActiveAttachments(d.attachments);
      const totalLampiran = activeAttachments.length;

      const kota = d.kota_surat || 'Jakarta';
      const tgl = d.tanggal_surat || this.formatIndonesianDate(new Date().toISOString().slice(0, 10));
      const headerDate = `${kota}, ${tgl}`;

      const perihal = `Lamaran Pekerjaan – ${d.posisi || 'Posisi Pekerjaan'}`;
      const lampiranText = totalLampiran > 0 
        ? `${totalLampiran} (${this.numberToWords(totalLampiran)}) Berkas`
        : '1 (satu) Berkas';

      let penerimaLine = d.jabatan_penerima || 'Pimpinan HRD / Bagian Personalia';
      if (d.nama_penerima) {
        penerimaLine = `${d.nama_penerima}\n${penerimaLine}`;
      }
      const namaPerusahaan = d.nama_perusahaan || 'Nama Perusahaan Tujuan';
      const alamatPerusahaan = d.alamat_perusahaan || 'Alamat Perusahaan';

      let pembuka = '';
      const pos = d.posisi ? `sebagai <strong>${this.escapeHtml(d.posisi)}</strong>` : 'pada posisi yang sesuai';
      const namaPt = d.nama_perusahaan ? `di <strong>${this.escapeHtml(d.nama_perusahaan)}</strong>` : 'di perusahaan yang Bapak/Ibu pimpin';

      if (d.sumber_lowongan) {
        pembuka = `Berdasarkan informasi lowongan pekerjaan yang saya peroleh melalui <em>${this.escapeHtml(d.sumber_lowongan)}</em>, dengan ini saya bermaksud mengajukan permohonan kerja untuk bergabung ${pos} ${namaPt}.`;
      } else {
        pembuka = `Sehubungan dengan informasi kesempatan berkarir yang tersedia di perusahaan yang Bapak/Ibu pimpin, bersama surat ini saya bermaksud mengajukan diri untuk bergabung ${pos} ${namaPt}.`;
      }

      const tglLahirFormatted = d.tanggal_lahir ? this.formatIndonesianDate(d.tanggal_lahir) : '-';
      const ttl = (d.tempat_lahir && d.tanggal_lahir)
        ? `${d.tempat_lahir}, ${tglLahirFormatted}`
        : (d.tempat_lahir || tglLahirFormatted);

      let eduText = d.pendidikan || '-';
      if (d.status_pendidikan) {
        eduText += ` (${d.status_pendidikan})`;
      }

      const kompetensiText = this.buildCompetencyParagraph(d);

      return {
        headerDate,
        perihal,
        lampiranText,
        penerimaLine,
        namaPerusahaan,
        alamatPerusahaan,
        salamPembuka: 'Dengan hormat,',
        pembuka,
        introIdentitas: 'Berikut ini adalah data pribadi singkat saya:',
        identitas: [
          { label: 'Nama Lengkap', value: d.nama || '-' },
          { label: 'Tempat, Tanggal Lahir', value: ttl },
          { label: 'Pendidikan Terakhir', value: eduText },
          { label: 'Alamat Lengkap', value: d.alamat || '-' },
          { label: 'Nomor Telepon / WA', value: d.telepon || '-' },
          { label: 'Alamat Email', value: d.email || '-' }
        ],
        paragrafKompetensi: kompetensiText,
        introLampiran: 'Sebagai bahan pertimbangan Bapak/Ibu, bersama ini saya lampirkan kelengkapan berkas dokumen pendukung sebagai berikut:',
        lampiranList: activeAttachments.map(a => a.name),
        paragrafHarapan: 'Besar harapan saya untuk memperoleh kesempatan wawancara atau tahap seleksi berikutnya, agar saya dapat menjelaskan kualifikasi, pengalaman, serta potensi diri saya secara lebih komprehensif.',
        paragrafPenutup: 'Demikian surat lamaran pekerjaan ini saya sampaikan. Atas perhatian, waktu, dan pertimbangan yang Bapak/Ibu berikan, saya mengucapkan terima kasih.',
        salamPenutup: 'Hormat saya,',
        namaPelamar: d.nama || 'Nama Lengkap Pelamar',
        raw: d
      };
    },

    generateHtml(rawFormData) {
      const data = this.composeLetterData(rawFormData);

      const lampiranItemsHtml = data.lampiranList.length > 0
        ? data.lampiranList.map((item) => `<li>${this.escapeHtml(item)}</li>`).join('\n')
        : '<li>Curriculum Vitae (CV) Terbaru</li>';

      const identityRowsHtml = data.identitas.map(row => `
        <tr>
          <td class="col-label">${this.escapeHtml(row.label)}</td>
          <td class="col-sep">:</td>
          <td class="col-value">${this.escapeHtml(row.value)}</td>
        </tr>
      `).join('');

      return `
<div class="letter-sheet" id="letter-content" role="document">
  <div class="letter-header-date">
    ${this.escapeHtml(data.headerDate)}
  </div>

  <div class="letter-meta-block">
    <table class="meta-table">
      <tr>
        <td class="meta-label">Hal</td>
        <td class="meta-sep">:</td>
        <td class="meta-val font-bold">${this.escapeHtml(data.perihal)}</td>
      </tr>
      <tr>
        <td class="meta-label">Lampiran</td>
        <td class="meta-sep">:</td>
        <td class="meta-val">${this.escapeHtml(data.lampiranText)}</td>
      </tr>
    </table>
  </div>

  <div class="letter-recipient-block">
    <div class="recipient-line">Kepada Yth.</div>
    <div class="recipient-name font-bold">${this.escapeHtml(data.penerimaLine).replace(/\n/g, '<br>')}</div>
    <div class="recipient-company font-bold">${this.escapeHtml(data.namaPerusahaan)}</div>
    <div class="recipient-address">${this.escapeHtml(data.alamatPerusahaan).replace(/\n/g, '<br>')}</div>
  </div>

  <div class="letter-salutation">
    ${this.escapeHtml(data.salamPembuka)}
  </div>

  <p class="letter-paragraph letter-opening">
    ${data.pembuka}
  </p>

  <p class="letter-paragraph">
    ${this.escapeHtml(data.introIdentitas)}
  </p>

  <div class="letter-identity-wrap">
    <table class="identity-table">
      <tbody>
        ${identityRowsHtml}
      </tbody>
    </table>
  </div>

  <p class="letter-paragraph letter-competency">
    ${this.escapeHtml(data.paragrafKompetensi)}
  </p>

  <p class="letter-paragraph">
    ${this.escapeHtml(data.introLampiran)}
  </p>

  <ol class="letter-attachment-list">
    ${lampiranItemsHtml}
  </ol>

  <p class="letter-paragraph">
    ${this.escapeHtml(data.paragrafHarapan)}
  </p>
  <p class="letter-paragraph">
    ${this.escapeHtml(data.paragrafPenutup)}
  </p>

  <div class="letter-signature-wrapper">
    <div class="letter-signature-block">
      <div class="signature-closing">${this.escapeHtml(data.salamPenutup)}</div>
      <div class="signature-space"></div>
      <div class="signature-name font-bold">${this.escapeHtml(data.namaPelamar)}</div>
    </div>
  </div>
</div>
      `.trim();
    }
  };

  // =========================================================================
  // 4. DOCX EXPORT MODULE (NATIVE MICROSOFT WORD VIA DOCX.JS)
  // =========================================================================
  const DocxExporter = {
    formatFileName(nama, posisi) {
      const cleanNama = (nama || 'Pelamar').replace(/[^a-zA-Z0-9_\-]/g, '_').replace(/_+/g, '_').trim();
      const cleanPosisi = (posisi || 'Semua_Posisi').replace(/[^a-zA-Z0-9_\-]/g, '_').replace(/_+/g, '_').trim();
      return `Surat_Lamaran_${cleanNama}_${cleanPosisi}.docx`;
    },

    triggerDownload(blob, fileName) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 2000);
    },

    async exportToDocx(rawFormData) {
      if (!window.docx) {
        throw new Error('Pustaka docx.js belum termuat di peramban.');
      }

      const {
        Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, BorderStyle, WidthType
      } = window.docx;

      const data = LetterEngine.composeLetterData(rawFormData);
      const borderNone = {
        top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
        bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
        left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
        right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
        insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'auto' },
        insideVertical: { style: BorderStyle.NONE, size: 0, color: 'auto' }
      };

      const cellBorderNone = {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE }
      };

      const docChildren = [];

      // 1. Tanggal & Lokasi (Rata Kanan)
      docChildren.push(
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { after: 240, line: 276 },
          children: [
            new TextRun({ text: data.headerDate, font: 'Times New Roman', size: 24 })
          ]
        })
      );

      // 2. Perihal & Lampiran
      const metaTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: borderNone,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 12, type: WidthType.PERCENTAGE },
                borders: cellBorderNone,
                children: [new Paragraph({ children: [new TextRun({ text: 'Hal', font: 'Times New Roman', size: 24 })] })]
              }),
              new TableCell({
                width: { size: 3, type: WidthType.PERCENTAGE },
                borders: cellBorderNone,
                children: [new Paragraph({ children: [new TextRun({ text: ':', font: 'Times New Roman', size: 24 })] })]
              }),
              new TableCell({
                width: { size: 85, type: WidthType.PERCENTAGE },
                borders: cellBorderNone,
                children: [new Paragraph({ children: [new TextRun({ text: data.perihal, bold: true, font: 'Times New Roman', size: 24 })] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                width: { size: 12, type: WidthType.PERCENTAGE },
                borders: cellBorderNone,
                children: [new Paragraph({ children: [new TextRun({ text: 'Lampiran', font: 'Times New Roman', size: 24 })] })]
              }),
              new TableCell({
                width: { size: 3, type: WidthType.PERCENTAGE },
                borders: cellBorderNone,
                children: [new Paragraph({ children: [new TextRun({ text: ':', font: 'Times New Roman', size: 24 })] })]
              }),
              new TableCell({
                width: { size: 85, type: WidthType.PERCENTAGE },
                borders: cellBorderNone,
                children: [new Paragraph({ children: [new TextRun({ text: data.lampiranText, font: 'Times New Roman', size: 24 })] })]
              })
            ]
          })
        ]
      });
      docChildren.push(metaTable);
      docChildren.push(new Paragraph({ spacing: { after: 200 } }));

      // 3. Penerima
      docChildren.push(new Paragraph({
        spacing: { line: 276, after: 40 },
        children: [new TextRun({ text: 'Kepada Yth.', font: 'Times New Roman', size: 24 })]
      }));

      data.penerimaLine.split('\n').forEach(line => {
        docChildren.push(new Paragraph({
          spacing: { line: 276, after: 40 },
          children: [new TextRun({ text: line, bold: true, font: 'Times New Roman', size: 24 })]
        }));
      });

      docChildren.push(new Paragraph({
        spacing: { line: 276, after: 40 },
        children: [new TextRun({ text: data.namaPerusahaan, bold: true, font: 'Times New Roman', size: 24 })]
      }));

      data.alamatPerusahaan.split('\n').forEach(line => {
        docChildren.push(new Paragraph({
          spacing: { line: 276, after: 40 },
          children: [new TextRun({ text: line, font: 'Times New Roman', size: 24 })]
        }));
      });

      docChildren.push(new Paragraph({ spacing: { after: 220 } }));

      // 4. Salam Pembuka
      docChildren.push(new Paragraph({
        spacing: { line: 276, after: 140 },
        children: [new TextRun({ text: data.salamPembuka, font: 'Times New Roman', size: 24 })]
      }));

      // 5. Paragraf Pembuka
      const openingRuns = [];
      if (data.raw.sumber_lowongan) {
        openingRuns.push(new TextRun({ text: 'Berdasarkan informasi lowongan pekerjaan yang saya peroleh melalui ', font: 'Times New Roman', size: 24 }));
        openingRuns.push(new TextRun({ text: data.raw.sumber_lowongan, italics: true, font: 'Times New Roman', size: 24 }));
        openingRuns.push(new TextRun({ text: ', saya bermaksud mengajukan permohonan kerja untuk bergabung sebagai ', font: 'Times New Roman', size: 24 }));
        openingRuns.push(new TextRun({ text: data.raw.posisi || 'Posisi Terkait', bold: true, font: 'Times New Roman', size: 24 }));
        openingRuns.push(new TextRun({ text: ` di ${data.namaPerusahaan}.`, font: 'Times New Roman', size: 24 }));
      } else {
        openingRuns.push(new TextRun({ text: 'Sehubungan dengan informasi lowongan pekerjaan di perusahaan yang Bapak/Ibu pimpin, bersama surat ini saya bermaksud mengajukan diri untuk bergabung di ', font: 'Times New Roman', size: 24 }));
        openingRuns.push(new TextRun({ text: data.namaPerusahaan, font: 'Times New Roman', size: 24 }));
        openingRuns.push(new TextRun({ text: ' sebagai ', font: 'Times New Roman', size: 24 }));
        openingRuns.push(new TextRun({ text: data.raw.posisi || 'posisi yang relevan', bold: true, font: 'Times New Roman', size: 24 }));
        openingRuns.push(new TextRun({ text: '.', font: 'Times New Roman', size: 24 }));
      }

      docChildren.push(new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { line: 276, after: 160 },
        children: openingRuns
      }));

      // 6. Pengantar Data Diri
      docChildren.push(new Paragraph({
        spacing: { line: 276, after: 120 },
        children: [new TextRun({ text: data.introIdentitas, font: 'Times New Roman', size: 24 })]
      }));

      // 7. Tabel Identitas 2 Kolom
      const idRows = data.identitas.map(item => new TableRow({
        children: [
          new TableCell({
            width: { size: 28, type: WidthType.PERCENTAGE },
            borders: cellBorderNone,
            children: [new Paragraph({
              spacing: { line: 260, after: 40 },
              children: [new TextRun({ text: item.label, font: 'Times New Roman', size: 24 })]
            })]
          }),
          new TableCell({
            width: { size: 3, type: WidthType.PERCENTAGE },
            borders: cellBorderNone,
            children: [new Paragraph({
              spacing: { line: 260, after: 40 },
              children: [new TextRun({ text: ':', font: 'Times New Roman', size: 24 })]
            })]
          }),
          new TableCell({
            width: { size: 69, type: WidthType.PERCENTAGE },
            borders: cellBorderNone,
            children: [new Paragraph({
              spacing: { line: 260, after: 40 },
              children: [new TextRun({ text: item.value, font: 'Times New Roman', size: 24 })]
            })]
          })
        ]
      }));

      docChildren.push(new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: borderNone,
        rows: idRows
      }));
      docChildren.push(new Paragraph({ spacing: { after: 140 } }));

      // 8. Paragraf Kompetensi
      docChildren.push(new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { line: 276, after: 160 },
        children: [new TextRun({ text: data.paragrafKompetensi, font: 'Times New Roman', size: 24 })]
      }));

      // 9. Pengantar Lampiran
      docChildren.push(new Paragraph({
        spacing: { line: 276, after: 100 },
        children: [new TextRun({ text: data.introLampiran, font: 'Times New Roman', size: 24 })]
      }));

      // 10. Daftar Lampiran
      if (data.lampiranList.length > 0) {
        data.lampiranList.forEach((att, idx) => {
          docChildren.push(new Paragraph({
            spacing: { line: 260, after: 40 },
            indent: { left: 450 },
            children: [
              new TextRun({ text: `${idx + 1}.  ${att}`, font: 'Times New Roman', size: 24 })
            ]
          }));
        });
      }
      docChildren.push(new Paragraph({ spacing: { after: 140 } }));

      // 11. Harapan & Penutup
      docChildren.push(new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { line: 276, after: 140 },
        children: [new TextRun({ text: data.paragrafHarapan, font: 'Times New Roman', size: 24 })]
      }));

      docChildren.push(new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { line: 276, after: 200 },
        children: [new TextRun({ text: data.paragrafPenutup, font: 'Times New Roman', size: 24 })]
      }));

      // 12. Tanda Tangan
      const signatureTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: borderNone,
        rows: [
          new TableRow({
            cantSplit: true,
            children: [
              new TableCell({
                width: { size: 55, type: WidthType.PERCENTAGE },
                borders: cellBorderNone,
                children: [new Paragraph({ children: [] })]
              }),
              new TableCell({
                width: { size: 45, type: WidthType.PERCENTAGE },
                borders: cellBorderNone,
                children: [
                  new Paragraph({
                    spacing: { line: 260, after: 600 },
                    children: [new TextRun({ text: data.salamPenutup, font: 'Times New Roman', size: 24 })]
                  }),
                  new Paragraph({
                    spacing: { line: 260, after: 0 },
                    children: [new TextRun({ text: data.namaPelamar, bold: true, underline: {}, font: 'Times New Roman', size: 24 })]
                  })
                ]
              })
            ]
          })
        ]
      });
      docChildren.push(signatureTable);

      const doc = new Document({
        sections: [{
          properties: {
            page: {
              size: { width: 11906, height: 16838 },
              margin: { top: 1418, right: 1418, bottom: 1418, left: 1418 }
            }
          },
          children: docChildren
        }]
      });

      const blob = await Packer.toBlob(doc);
      const fileName = this.formatFileName(data.raw.nama, data.raw.posisi);
      this.triggerDownload(blob, fileName);
      return fileName;
    }
  };

  // =========================================================================
  // 5. APPLICATION CONTROLLER
  // =========================================================================
  class SuratLamaranApp {
    constructor() {
      this.currentStep = 1;
      this.totalSteps = 4;
      this.attachments = JSON.parse(JSON.stringify(DEFAULT_ATTACHMENTS_LIST));
      this.isManualEdit = false;
      this.debounceTimer = null;

      this.initElements();
      this.initDateDefaults();
      this.loadSavedData();
      this.initEventListeners();
      this.refreshIcons();
      this.updatePreview();
    }

    initElements() {
      this.form = document.getElementById('job-letter-form');
      this.letterMount = document.getElementById('live-letter-mount');
      this.attachmentListContainer = document.getElementById('attachment-list-container');
      this.counterText = document.getElementById('counter-text');
      this.inputNewAttachment = document.getElementById('input-new-attachment');
      this.btnAddAttachment = document.getElementById('btn-add-attachment');

      this.stepIndicators = document.querySelectorAll('.step-indicator');
      this.stepPanels = document.querySelectorAll('.form-step');
      this.workspaceGrid = document.getElementById('workspace-grid');
      this.mobileTabButtons = document.querySelectorAll('.mobile-tab-btn');

      this.btnExportPdf = document.getElementById('btn-export-pdf');
      this.btnExportDocx = document.getElementById('btn-export-docx');
      this.btnCopyText = document.getElementById('btn-copy-text');
      this.btnToggleManualEdit = document.getElementById('btn-toggle-manual-edit');
      this.manualEditAlert = document.getElementById('manual-edit-alert');
      this.btnResetManualEdit = document.getElementById('btn-reset-manual-edit');
      this.btnSaveManualEdit = document.getElementById('btn-save-manual-edit');
      this.editBtnText = document.getElementById('edit-btn-text');

      this.modalSample = document.getElementById('modal-sample');
      this.modalReset = document.getElementById('modal-reset');
      this.btnOpenSample = document.getElementById('btn-open-sample-modal');
      this.btnHeroSample = document.getElementById('btn-hero-sample');
      this.btnOpenReset = document.getElementById('btn-open-reset-modal');
      this.btnConfirmReset = document.getElementById('btn-confirm-reset');

      this.toastContainer = document.getElementById('toast-container');
    }

    initDateDefaults() {
      const today = new Date();
      const isoDate = today.toISOString().slice(0, 10);
      const indonesianDate = LetterEngine.formatIndonesianDate(isoDate);

      const tanggalSuratInput = document.getElementById('tanggal_surat');
      if (tanggalSuratInput && !tanggalSuratInput.value) {
        tanggalSuratInput.value = indonesianDate;
      }

      const kotaSuratInput = document.getElementById('kota_surat');
      if (kotaSuratInput && !kotaSuratInput.value) {
        kotaSuratInput.value = 'Jakarta';
      }
    }

    loadSavedData() {
      const saved = Storage.loadDraft();
      if (saved) {
        this.populateForm(saved);
        if (Array.isArray(saved.attachments) && saved.attachments.length > 0) {
          this.attachments = saved.attachments;
        }
      }

      const savedManual = Storage.loadManualEdit();
      if (savedManual) {
        this.isManualEdit = true;
        this.letterMount.innerHTML = savedManual;
        this.updateManualEditUI();
      }

      this.renderAttachments();
    }

    initEventListeners() {
      // Stepper clicks
      this.stepIndicators.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetStep = parseInt(btn.dataset.step, 10);
          this.goToStep(targetStep);
        });
      });

      document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', () => {
          const nextStep = parseInt(btn.dataset.next, 10);
          if (this.validateStep(this.currentStep)) {
            this.goToStep(nextStep);
          }
        });
      });

      document.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', () => {
          const prevStep = parseInt(btn.dataset.prev, 10);
          this.goToStep(prevStep);
        });
      });

      const btnFinish = document.getElementById('btn-finish-and-preview');
      if (btnFinish) {
        btnFinish.addEventListener('click', () => {
          this.switchMobileTab('preview');
          const previewOuter = document.getElementById('preview-sheet-outer');
          if (previewOuter) {
            previewOuter.scrollIntoView({ behavior: 'smooth' });
          }
          this.showToast('Surat lamaran siap diunduh!', 'success');
        });
      }

      // Input changes
      if (this.form) {
        this.form.addEventListener('input', () => this.handleFormInput());
        this.form.addEventListener('change', () => this.handleFormInput());
      }

      // Add attachment
      if (this.btnAddAttachment) {
        this.btnAddAttachment.addEventListener('click', () => this.addNewAttachment());
      }
      if (this.inputNewAttachment) {
        this.inputNewAttachment.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.addNewAttachment();
          }
        });
      }

      // Export PDF & Print
      if (this.btnExportPdf) {
        this.btnExportPdf.addEventListener('click', () => this.handleExportPdf());
      }

      // Export DOCX
      if (this.btnExportDocx) {
        this.btnExportDocx.addEventListener('click', () => this.handleExportDocx());
      }

      // Copy Text
      if (this.btnCopyText) {
        this.btnCopyText.addEventListener('click', () => this.handleCopyText());
      }

      // Manual Edit
      if (this.btnToggleManualEdit) {
        this.btnToggleManualEdit.addEventListener('click', () => this.toggleManualEdit());
      }
      if (this.btnSaveManualEdit) {
        this.btnSaveManualEdit.addEventListener('click', () => this.saveManualEditContent());
      }
      if (this.btnResetManualEdit) {
        this.btnResetManualEdit.addEventListener('click', () => this.resetManualEdit());
      }

      // Mobile Tabs
      this.mobileTabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const tab = btn.dataset.tab;
          this.switchMobileTab(tab);
        });
      });

      // Modals: Open
      if (this.btnOpenSample) {
        this.btnOpenSample.addEventListener('click', () => this.openModal(this.modalSample));
      }
      if (this.btnHeroSample) {
        this.btnHeroSample.addEventListener('click', () => this.openModal(this.modalSample));
      }
      if (this.btnOpenReset) {
        this.btnOpenReset.addEventListener('click', () => this.openModal(this.modalReset));
      }

      // Modals: Close button
      document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
          const modalId = btn.dataset.modal;
          const modal = document.getElementById(modalId);
          if (modal) this.closeModal(modal);
        });
      });

      // Modals: Click on overlay backdrop to close
      document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            this.closeModal(modal);
          }
        });
      });

      // Preset sample selection
      document.querySelectorAll('.sample-select-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const presetKey = btn.dataset.preset;
          this.loadSampleProfile(presetKey);
          this.closeModal(this.modalSample);
        });
      });

      // Confirm Reset
      if (this.btnConfirmReset) {
        this.btnConfirmReset.addEventListener('click', () => {
          this.handleResetAll();
          this.closeModal(this.modalReset);
        });
      }

      // Escape key to close modal
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          document.querySelectorAll('.modal-overlay.active').forEach(m => this.closeModal(m));
        }
      });
    }

    goToStep(stepNumber) {
      if (stepNumber < 1 || stepNumber > this.totalSteps) return;
      this.currentStep = stepNumber;

      this.stepPanels.forEach(panel => {
        panel.classList.remove('active');
      });
      const activePanel = document.getElementById(`step-${stepNumber}`);
      if (activePanel) activePanel.classList.add('active');

      this.stepIndicators.forEach(ind => {
        const step = parseInt(ind.dataset.step, 10);
        ind.classList.remove('active');
        if (step === stepNumber) {
          ind.classList.add('active');
        }
        if (step < stepNumber) {
          ind.classList.add('completed');
        } else {
          ind.classList.remove('completed');
        }
      });

      this.refreshIcons();
    }

    validateStep(stepNumber) {
      const activePanel = document.getElementById(`step-${stepNumber}`);
      if (!activePanel) return true;

      const requiredFields = activePanel.querySelectorAll('[required]');
      let isValid = true;

      for (const field of requiredFields) {
        if (!field.value.trim()) {
          isValid = false;
          field.focus();
          field.style.borderColor = 'var(--danger-rose)';
          const label = field.labels?.[0]?.innerText?.replace('*', '').trim() || field.name;
          this.showToast(`Mohon isi field "${label}"`, 'warning');
          setTimeout(() => {
            field.style.borderColor = '';
          }, 3000);
          break;
        }
      }

      return isValid;
    }

    getFormData() {
      const raw = new FormData(this.form);
      const data = {};
      for (const [key, value] of raw.entries()) {
        data[key] = value;
      }
      data.attachments = this.attachments;
      return data;
    }

    handleFormInput() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        const data = this.getFormData();
        Storage.saveDraft(data);

        if (!this.isManualEdit) {
          this.updatePreview();
        }

        this.updateSyncStatus();
      }, 200);
    }

    updatePreview() {
      if (this.isManualEdit) return;
      const formData = this.getFormData();
      const html = LetterEngine.generateHtml(formData);
      if (this.letterMount) {
        this.letterMount.innerHTML = html;
      }
    }

    renderAttachments() {
      if (!this.attachmentListContainer) return;
      this.attachmentListContainer.innerHTML = '';

      this.attachments.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'attachment-item';
        row.innerHTML = `
          <input type="checkbox" class="attachment-checkbox" data-index="${index}" ${item.checked ? 'checked' : ''}>
          <input type="text" class="attachment-name-input" data-index="${index}" value="${LetterEngine.escapeHtml(item.name)}">
          <div class="attachment-tools">
            <button type="button" class="tool-btn btn-up" data-index="${index}" title="Naikkan urutan" ${index === 0 ? 'disabled style="opacity:0.3;"' : ''}>
              <i data-lucide="arrow-up"></i>
            </button>
            <button type="button" class="tool-btn btn-down" data-index="${index}" title="Turunkan urutan" ${index === this.attachments.length - 1 ? 'disabled style="opacity:0.3;"' : ''}>
              <i data-lucide="arrow-down"></i>
            </button>
            <button type="button" class="tool-btn btn-delete" data-index="${index}" title="Hapus lampiran">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        `;
        this.attachmentListContainer.appendChild(row);
      });

      this.updateAttachmentCounter();
      this.bindAttachmentEvents();
      this.refreshIcons();
    }

    bindAttachmentEvents() {
      this.attachmentListContainer.querySelectorAll('.attachment-checkbox').forEach(cb => {
        cb.addEventListener('change', (e) => {
          const idx = parseInt(e.target.dataset.index, 10);
          this.attachments[idx].checked = e.target.checked;
          this.onAttachmentsChanged();
        });
      });

      this.attachmentListContainer.querySelectorAll('.attachment-name-input').forEach(input => {
        input.addEventListener('input', (e) => {
          const idx = parseInt(e.target.dataset.index, 10);
          this.attachments[idx].name = e.target.value;
          this.onAttachmentsChanged();
        });
      });

      this.attachmentListContainer.querySelectorAll('.btn-up').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.index, 10);
          if (idx > 0) {
            const temp = this.attachments[idx];
            this.attachments[idx] = this.attachments[idx - 1];
            this.attachments[idx - 1] = temp;
            this.renderAttachments();
            this.onAttachmentsChanged();
          }
        });
      });

      this.attachmentListContainer.querySelectorAll('.btn-down').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.index, 10);
          if (idx < this.attachments.length - 1) {
            const temp = this.attachments[idx];
            this.attachments[idx] = this.attachments[idx + 1];
            this.attachments[idx + 1] = temp;
            this.renderAttachments();
            this.onAttachmentsChanged();
          }
        });
      });

      this.attachmentListContainer.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.index, 10);
          this.attachments.splice(idx, 1);
          this.renderAttachments();
          this.onAttachmentsChanged();
        });
      });
    }

    addNewAttachment() {
      const val = (this.inputNewAttachment.value || '').trim();
      if (!val) {
        this.inputNewAttachment.focus();
        return;
      }

      this.attachments.push({
        id: 'custom_' + Date.now(),
        name: val,
        checked: true
      });

      this.inputNewAttachment.value = '';
      this.renderAttachments();
      this.onAttachmentsChanged();
      this.showToast('Dokumen lampiran ditambahkan', 'success');
    }

    onAttachmentsChanged() {
      this.updateAttachmentCounter();
      this.handleFormInput();
    }

    updateAttachmentCounter() {
      const activeCount = this.attachments.filter(a => a.checked && a.name.trim()).length;
      if (this.counterText) {
        this.counterText.innerText = `${activeCount} Berkas Aktif`;
      }
    }

    toggleManualEdit() {
      const sheet = document.getElementById('letter-content');
      if (!sheet) return;

      this.isManualEdit = !this.isManualEdit;
      sheet.setAttribute('contenteditable', this.isManualEdit ? 'true' : 'false');

      if (this.isManualEdit) {
        sheet.focus();
        this.showToast('Mode Edit Manual aktif. Klik teks surat untuk mengubah.', 'info');
      } else {
        this.saveManualEditContent();
      }

      this.updateManualEditUI();
    }

    updateManualEditUI() {
      const sheet = document.getElementById('letter-content');
      if (sheet) {
        sheet.setAttribute('contenteditable', this.isManualEdit ? 'true' : 'false');
      }

      if (this.manualEditAlert) {
        this.manualEditAlert.classList.toggle('show', this.isManualEdit);
      }

      if (this.editBtnText) {
        this.editBtnText.innerText = this.isManualEdit ? 'Selesai Edit' : 'Edit Manual';
      }
    }

    saveManualEditContent() {
      const sheet = document.getElementById('letter-content');
      if (sheet) {
        Storage.saveManualEdit(this.letterMount.innerHTML);
      }
      this.isManualEdit = false;
      this.updateManualEditUI();
      this.showToast('Perubahan manual berhasil disimpan', 'success');
    }

    resetManualEdit() {
      Storage.clearManualEdit();
      this.isManualEdit = false;
      this.updateManualEditUI();
      this.updatePreview();
      this.showToast('Dokumen dikembalikan sesuai isi formulir', 'info');
    }

    switchMobileTab(tab) {
      this.mobileTabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
      });

      if (tab === 'form') {
        this.workspaceGrid.classList.add('show-form-only');
        this.workspaceGrid.classList.remove('show-preview-only');
      } else {
        this.workspaceGrid.classList.add('show-preview-only');
        this.workspaceGrid.classList.remove('show-form-only');
        const previewOuter = document.getElementById('preview-sheet-outer');
        if (previewOuter) {
          previewOuter.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }

    async handleCopyText() {
      const sheet = document.getElementById('letter-content');
      if (!sheet) return;
      try {
        const text = sheet.innerText;
        await navigator.clipboard.writeText(text);
        this.showToast('Teks surat berhasil disalin ke clipboard!', 'success');
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = sheet.innerText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        this.showToast('Teks surat berhasil disalin!', 'success');
      }
    }

    handleExportPdf() {
      if (!this.isManualEdit) {
        this.updatePreview();
      }

      // Pastikan tab preview aktif jika di layar mobile/tablet
      this.switchMobileTab('preview');

      const formData = this.getFormData();
      const cleanNama = (formData.nama || 'Pelamar').replace(/[^a-zA-Z0-9_\-]/g, '_').replace(/_+/g, '_').trim();
      const cleanPosisi = (formData.posisi || 'Semua_Posisi').replace(/[^a-zA-Z0-9_\-]/g, '_').replace(/_+/g, '_').trim();

      const originalTitle = document.title;
      document.title = `Surat_Lamaran_${cleanNama}_${cleanPosisi}`;

      this.showToast('Membuka dialog cetak / Simpan sebagai PDF...', 'info');

      setTimeout(() => {
        window.print();
        setTimeout(() => {
          document.title = originalTitle;
        }, 1200);
      }, 200);
    }

    async handleExportDocx() {
      const btn = this.btnExportDocx;
      const originalText = btn.innerHTML;
      try {
        btn.disabled = true;
        btn.innerHTML = `<i data-lucide="loader" class="animate-spin"></i><span>Membuat DOCX...</span>`;
        this.refreshIcons();

        const formData = this.getFormData();
        const fileName = await DocxExporter.exportToDocx(formData);

        this.showToast(`Berhasil mengunduh "${fileName}"!`, 'success');
      } catch (err) {
        console.error('Error saat membuat dokumen DOCX:', err);
        this.showToast('Gagal membuat DOCX: ' + (err.message || 'Error tidak terduga'), 'warning');
      } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
        this.refreshIcons();
      }
    }

    loadSampleProfile(key) {
      const profile = SAMPLE_PROFILES[key];
      if (!profile) return;

      this.populateForm(profile.data);
      if (Array.isArray(profile.data.attachments)) {
        this.attachments = JSON.parse(JSON.stringify(profile.data.attachments));
        this.renderAttachments();
      }

      Storage.clearManualEdit();
      this.isManualEdit = false;
      this.updateManualEditUI();
      this.updatePreview();

      // Autosave loaded sample
      Storage.saveDraft(this.getFormData());

      this.goToStep(1);

      const workspaceEl = document.getElementById('workspace');
      if (workspaceEl) {
        workspaceEl.scrollIntoView({ behavior: 'smooth' });
      }

      this.showToast(`Contoh data "${profile.title}" berhasil dimuat!`, 'success');
    }

    populateForm(data) {
      for (const [key, value] of Object.entries(data)) {
        const field = this.form.elements[key];
        if (field) {
          field.value = value;
        }
      }
    }

    handleResetAll() {
      Storage.clearAll();
      this.form.reset();

      // Clear all inputs/textareas explicitly
      const elements = this.form.elements;
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.value = '';
        } else if (el.tagName === 'SELECT') {
          el.selectedIndex = 0;
        }
      }

      this.attachments = JSON.parse(JSON.stringify(DEFAULT_ATTACHMENTS_LIST));
      this.isManualEdit = false;
      this.updateManualEditUI();
      this.initDateDefaults();
      this.renderAttachments();
      this.updatePreview();
      this.goToStep(1);
      this.showToast('Formulir berhasil dikosongkan.', 'info');
    }

    updateSyncStatus() {
      const textEl = document.getElementById('sync-status-text');
      if (textEl) {
        textEl.innerText = 'Draft Tersimpan';
        setTimeout(() => {
          textEl.innerText = 'Sinkronisasi Otomatis';
        }, 2000);
      }
    }

    openModal(modal) {
      if (modal) {
        modal.classList.add('active');
        this.refreshIcons();
      }
    }

    closeModal(modal) {
      if (modal) modal.classList.remove('active');
    }

    showToast(message, type = 'info') {
      if (!this.toastContainer) return;

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;

      let iconName = 'info';
      if (type === 'success') iconName = 'check-circle-2';
      if (type === 'warning') iconName = 'alert-triangle';

      toast.innerHTML = `
        <i data-lucide="${iconName}"></i>
        <span>${LetterEngine.escapeHtml(message)}</span>
      `;

      this.toastContainer.appendChild(toast);
      this.refreshIcons();

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(8px)';
        toast.style.transition = 'all 0.25s ease';
        setTimeout(() => toast.remove(), 250);
      }, 3500);
    }

    refreshIcons() {
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }
  }

  // Initialize immediately or on DOM ready
  function startApp() {
    if (!window.suratLamaranApp) {
      window.suratLamaranApp = new SuratLamaranApp();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
  } else {
    startApp();
  }
})();
