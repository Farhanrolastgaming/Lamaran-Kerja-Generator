/**
 * letterEngine.js - Engine penyusun surat lamaran kerja resmi Bahasa Indonesia
 * Menerapkan kaidah PUEBI/EYD, logika kondisional anti-placeholder, dan struktur baku dokumen A4.
 */

export const LetterEngine = {
  /**
   * Konversi angka ke teks terbilang Bahasa Indonesia (1-20)
   */
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

  /**
   * Format tanggal ISO (YYYY-MM-DD) atau string tanggal ke format formal Indonesia
   * Contoh: "1998-05-14" -> "14 Mei 1998"
   */
  formatIndonesianDate(dateStr) {
    if (!dateStr) return '';
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    // Jika format ISO YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr.trim())) {
      const parts = dateStr.trim().split('-');
      const year = parts[0];
      const monthIdx = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (monthIdx >= 0 && monthIdx < 12) {
        return `${day} ${months[monthIdx]} ${year}`;
      }
    }

    // Jika sudah berupa teks bebas yang valid, kembalikan apa adanya
    return dateStr;
  },

  /**
   * Escape karakter HTML untuk mencegah injeksi script yang tidak diinginkan
   */
  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  /**
   * Normalisasi data formulir agar aman dan memiliki nilai default yang rapi
   */
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

      attachments: Array.isArray(data.attachments) ? data.attachments : [],
      signature_image: data.signature_image || null
    };
  },

  /**
   * Dapatkan daftar lampiran yang aktif
   */
  getActiveAttachments(attachments) {
    if (!Array.isArray(attachments)) return [];
    return attachments.filter(item => item && item.checked && (item.name || '').trim().length > 0);
  },

  /**
   * Helper untuk memastikan kalimat berakhiran tepat satu tanda titik
   */
  formatSentence(str) {
    if (!str) return '';
    let s = str.trim();
    while (s.endsWith('.')) {
      s = s.slice(0, -1).trim();
    }
    return s.length > 0 ? s + '.' : '';
  },

  /**
   * Susun paragraf kompetensi dan pengalaman dengan logika kondisional alami
   */
  buildCompetencyParagraph(data) {
    const hasPengalaman = Boolean(data.pengalaman);
    const hasKeahlian = Boolean(data.keahlian);
    const hasMotivasi = Boolean(data.motivasi);
    const hasDeskripsi = Boolean(data.deskripsi_diri);
    const namaPt = data.nama_perusahaan || 'perusahaan yang Bapak/Ibu pimpin';

    let sentences = [];

    if (hasPengalaman) {
      let expText = data.pengalaman.trim();
      while (expText.endsWith('.')) {
        expText = expText.slice(0, -1).trim();
      }
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
      // Kasus tanpa pengalaman kerja (Fresh graduate/pemula) namun memiliki keahlian
      let skillText = data.keahlian.trim();
      while (skillText.endsWith('.')) skillText = skillText.slice(0, -1).trim();
      sentences.push(this.formatSentence(`Sebagai pribadi yang berkomitmen tinggi, saya memiliki pemahaman serta keterampilan yang relevan pada bidang ${skillText}`));
      sentences.push(`Saya terbiasa beradaptasi secara cepat, memiliki etos kerja yang kuat, dan selalu siap mempelajari keterampilan baru.`);
    } else {
      // Kasus pengalaman dan keahlian tidak diisi
      sentences.push(`Saya merupakan pribadi yang jujur, disiplin, berdedikasi tinggi, dan senantiasa bertanggung jawab dalam menyelesaikan setiap tugas yang diamanahkan.`);
      sentences.push(`Saya memiliki kemampuan komunikasi yang baik serta dapat bekerja sama secara efektif dalam lingkungan tim maupun secara mandiri.`);
    }

    if (hasDeskripsi) {
      sentences.push(this.formatSentence(data.deskripsi_diri));
    }

    if (hasMotivasi) {
      sentences.push(this.formatSentence(data.motivasi));
    }

    // Kalimat penegas kontribusi
    sentences.push(`Dengan kualifikasi dan motivasi tersebut, saya yakin dapat memberikan kontribusi positif yang berkesinambungan bagi perkembangan ${namaPt}.`);

    return sentences.filter(Boolean).join(' ');
  },

  /**
   * Menghasilkan struktur objek data terorganisir untuk generator DOCX dan HTML
   */
  composeLetterData(raw) {
    const d = this.sanitizeFormData(raw);
    const activeAttachments = this.getActiveAttachments(d.attachments);
    const totalLampiran = activeAttachments.length;

    // Header Kota & Tanggal
    const kota = d.kota_surat || 'Kota Anda';
    const tgl = d.tanggal_surat || this.formatIndonesianDate(new Date().toISOString().slice(0, 10));
    const headerDate = `${kota}, ${tgl}`;

    // Perihal & Lampiran
    const perihal = `Lamaran Pekerjaan – ${d.posisi || 'Posisi Pekerjaan'}`;
    const lampiranText = totalLampiran > 0 
      ? `${totalLampiran} (${this.numberToWords(totalLampiran)}) Berkas`
      : '1 (satu) Berkas';

    // Penerima
    let penerimaLine = d.jabatan_penerima || 'Pimpinan HRD / Bagian Personalia';
    if (d.nama_penerima) {
      penerimaLine = `${d.nama_penerima}\n${penerimaLine}`;
    }
    const namaPerusahaan = d.nama_perusahaan || 'Nama Perusahaan Tujuan';
    const alamatPerusahaan = d.alamat_perusahaan || 'Alamat Perusahaan';

    // Pembuka
    let pembuka = '';
    const pos = d.posisi ? `sebagai <strong>${this.escapeHtml(d.posisi)}</strong>` : 'pada posisi yang sesuai';
    const namaPt = d.nama_perusahaan ? `di <strong>${this.escapeHtml(d.nama_perusahaan)}</strong>` : 'di perusahaan yang Bapak/Ibu pimpin';

    if (d.sumber_lowongan) {
      pembuka = `Berdasarkan informasi lowongan pekerjaan yang saya peroleh melalui <em>${this.escapeHtml(d.sumber_lowongan)}</em>, dengan ini saya bermaksud mengajukan permohonan kerja untuk bergabung ${pos} ${namaPt}.`;
    } else {
      pembuka = `Sehubungan dengan informasi kesempatan berkarir yang tersedia di perusahaan yang Bapak/Ibu pimpin, bersama surat ini saya bermaksud mengajukan diri untuk bergabung ${pos} ${namaPt}.`;
    }

    // Tgl lahir formatted
    const tglLahirFormatted = d.tanggal_lahir ? this.formatIndonesianDate(d.tanggal_lahir) : '-';
    const ttl = (d.tempat_lahir && d.tanggal_lahir)
      ? `${d.tempat_lahir}, ${tglLahirFormatted}`
      : (d.tempat_lahir || tglLahirFormatted);

    // Pendidikan
    let eduText = d.pendidikan || '-';
    if (d.status_pendidikan) {
      eduText += ` (${d.status_pendidikan})`;
    }

    // Paragraf Kompetensi
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

  /**
   * Menghasilkan markup HTML surat formal A4 yang siap dirender di Live Preview dan di-print
   */
  generateHtml(rawFormData) {
    const data = this.composeLetterData(rawFormData);

    const lampiranItemsHtml = data.lampiranList.length > 0
      ? data.lampiranList.map((item, idx) => `<li>${this.escapeHtml(item)}</li>`).join('\n')
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
  <!-- Tanggal & Lokasi (Rata Kanan) -->
  <div class="letter-header-date">
    ${this.escapeHtml(data.headerDate)}
  </div>

  <!-- Perihal & Lampiran -->
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

  <!-- Tujuan Perusahaan -->
  <div class="letter-recipient-block">
    <div class="recipient-line">Kepada Yth.</div>
    <div class="recipient-name font-bold">${this.escapeHtml(data.penerimaLine).replace(/\n/g, '<br>')}</div>
    <div class="recipient-company font-bold">${this.escapeHtml(data.namaPerusahaan)}</div>
    <div class="recipient-address">${this.escapeHtml(data.alamatPerusahaan).replace(/\n/g, '<br>')}</div>
  </div>

  <!-- Salam Pembuka -->
  <div class="letter-salutation">
    ${this.escapeHtml(data.salamPembuka)}
  </div>

  <!-- Paragraf Pembuka -->
  <p class="letter-paragraph letter-opening">
    ${data.pembuka}
  </p>

  <!-- Pengantar Identitas -->
  <p class="letter-paragraph">
    ${this.escapeHtml(data.introIdentitas)}
  </p>

  <!-- Tabel Identitas Diri -->
  <div class="letter-identity-wrap">
    <table class="identity-table">
      <tbody>
        ${identityRowsHtml}
      </tbody>
    </table>
  </div>

  <!-- Paragraf Kualifikasi / Pengalaman -->
  <p class="letter-paragraph letter-competency">
    ${this.escapeHtml(data.paragrafKompetensi)}
  </p>

  <!-- Pengantar Lampiran -->
  <p class="letter-paragraph">
    ${this.escapeHtml(data.introLampiran)}
  </p>

  <!-- Daftar Lampiran -->
  <ol class="letter-attachment-list">
    ${lampiranItemsHtml}
  </ol>

  <!-- Harapan & Penutup -->
  <p class="letter-paragraph">
    ${this.escapeHtml(data.paragrafHarapan)}
  </p>
  <p class="letter-paragraph">
    ${this.escapeHtml(data.paragrafPenutup)}
  </p>

  <!-- Blok Tanda Tangan (page-break-inside: avoid) -->
  <div class="letter-signature-wrapper">
    <div class="letter-signature-block">
      <div class="signature-closing">${this.escapeHtml(data.salamPenutup)}</div>
      <div class="signature-space">
        ${data.raw.signature_image ? `<img src="${data.raw.signature_image}" alt="Tanda Tangan" class="signature-img-rendered">` : ''}
      </div>
      <div class="signature-name font-bold">${this.escapeHtml(data.namaPelamar)}</div>
    </div>
  </div>
</div>
    `.trim();
  }
};
