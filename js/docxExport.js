/**
 * docxExport.js - Generator dokumen Microsoft Word (.docx) native
 * Menggunakan library docx.js untuk menghasilkan file Word asli berstandar formal A4.
 */

import { LetterEngine } from './letterEngine.js';

export const DocxExporter = {
  /**
   * Helper untuk membuat TextRun standar Times New Roman 12pt
   */
  createRun(text, options = {}) {
    return new window.docx.TextRun({
      text: text || '',
      font: 'Times New Roman',
      size: options.size || 24, // 24 half-points = 12pt
      bold: Boolean(options.bold),
      italics: Boolean(options.italics),
      color: options.color || '000000'
    });
  },

  /**
   * Helper untuk membuat Paragraph formal dengan Times New Roman 12pt
   */
  createParagraph(runs, options = {}) {
    const defaultSpacing = {
      line: 276, // ~1.15 line spacing
      after: options.spaceAfter !== undefined ? options.spaceAfter : 140 // ~7pt
    };

    return new window.docx.Paragraph({
      children: Array.isArray(runs) ? runs : [runs],
      alignment: options.alignment || window.docx.AlignmentType.LEFT,
      spacing: options.spacing || defaultSpacing,
      cantSplit: options.cantSplit || false
    });
  },

  /**
   * Bersihkan nama file agar valid untuk sistem operasi Windows/Linux/Mac
   */
  formatFileName(nama, posisi) {
    const cleanNama = (nama || 'Pelamar').replace(/[^a-zA-Z0-9_\-]/g, '_').replace(/_+/g, '_').trim();
    const cleanPosisi = (posisi || 'Semua_Posisi').replace(/[^a-zA-Z0-9_\-]/g, '_').replace(/_+/g, '_').trim();
    return `Surat_Lamaran_${cleanNama}_${cleanPosisi}.docx`;
  },

  /**
   * Download blob sebagai file di browser
   */
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

  /**
   * Ekspor surat ke dokumen .docx asli
   * @param {Object} rawFormData
   * @param {HTMLElement|null} previewElement - Elemen DOM preview jika ada manual edit
   */
  async exportToDocx(rawFormData, previewElement = null, isManualEdit = false) {
    if (!window.docx) {
      throw new Error('Library docx.js belum termuat di peramban.');
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

    // 2. Perihal & Lampiran (Tabel kecil atau baris teratur)
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

    // Spasi setelah perihal
    docChildren.push(new Paragraph({ spacing: { after: 200 } }));

    // 3. Penerima Surat
    const recipientParagraphs = [
      new TextRun({ text: 'Kepada Yth.', font: 'Times New Roman', size: 24 })
    ];
    docChildren.push(new Paragraph({ spacing: { line: 276, after: 40 }, children: recipientParagraphs }));

    const penerimaLines = data.penerimaLine.split('\n');
    penerimaLines.forEach(line => {
      docChildren.push(new Paragraph({
        spacing: { line: 276, after: 40 },
        children: [new TextRun({ text: line, bold: true, font: 'Times New Roman', size: 24 })]
      }));
    });

    docChildren.push(new Paragraph({
      spacing: { line: 276, after: 40 },
      children: [new TextRun({ text: data.namaPerusahaan, bold: true, font: 'Times New Roman', size: 24 })]
    }));

    const alamatLines = data.alamatPerusahaan.split('\n');
    alamatLines.forEach(line => {
      docChildren.push(new Paragraph({
        spacing: { line: 276, after: 40 },
        children: [new TextRun({ text: line, font: 'Times New Roman', size: 24 })]
      }));
    });

    // Spasi setelah alamat
    docChildren.push(new Paragraph({ spacing: { after: 220 } }));

    // 4. Salam Pembuka
    docChildren.push(new Paragraph({
      spacing: { line: 276, after: 140 },
      children: [new TextRun({ text: data.salamPembuka, font: 'Times New Roman', size: 24 })]
    }));

    // 5. Paragraf Pembuka
    // Jika manual edit, ambil teks paragraf dari preview jika diinginkan, namun jika standar:
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

    // 8. Paragraf Kompetensi & Pengalaman
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

    // 10. Daftar Lampiran (Numbered)
    if (data.lampiranList.length > 0) {
      data.lampiranList.forEach((att, idx) => {
        docChildren.push(new Paragraph({
          spacing: { line: 260, after: 40 },
          indent: { left: 450 }, // ~0.8cm tab indent
          children: [
            new TextRun({ text: `${idx + 1}.  ${att}`, font: 'Times New Roman', size: 24 })
          ]
        }));
      });
    }

    docChildren.push(new Paragraph({ spacing: { after: 140 } }));

    // 11. Paragraf Harapan & Penutup
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

    // 12. Tanda Tangan & Nama Terang (cantSplit untuk mencegah halaman terpotong)
    // Buat tabel tanda tangan di sebelah kanan atau paragraf rata kanan
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
                  spacing: { line: 260, after: 600 }, // Ruang tanda tangan ~4 baris
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

    // Konfigurasi dokumen A4 dengan margin 2.5 cm (1418 dxa)
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            size: {
              width: 11906,  // A4 width in dxa (210mm)
              height: 16838  // A4 height in dxa (297mm)
            },
            margin: {
              top: 1418,     // 2.5 cm
              right: 1418,   // 2.5 cm
              bottom: 1418,  // 2.5 cm
              left: 1418     // 2.5 cm
            }
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

