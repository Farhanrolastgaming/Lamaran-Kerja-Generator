/**
 * app.js - Main Application Controller for SuratLamaran Generator
 * Mengatur alur stepper, data binding, live preview, manual editing, dan ekspor.
 */

import { Storage } from './storage.js';
import { SAMPLE_PROFILES, DEFAULT_ATTACHMENTS_LIST } from './sampleData.js';
import { LetterEngine } from './letterEngine.js';
import { DocxExporter } from './docxExport.js';

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

  /**
   * Tangkap elemen-elemen DOM utama
   */
  initElements() {
    this.form = document.getElementById('job-letter-form');
    this.letterMount = document.getElementById('live-letter-mount');
    this.attachmentListContainer = document.getElementById('attachment-list-container');
    this.counterText = document.getElementById('counter-text');
    this.inputNewAttachment = document.getElementById('input-new-attachment');
    this.btnAddAttachment = document.getElementById('btn-add-attachment');

    // Stepper & Workspace
    this.stepIndicators = document.querySelectorAll('.step-indicator');
    this.stepPanels = document.querySelectorAll('.form-step');
    this.workspaceGrid = document.getElementById('workspace-grid');
    this.mobileTabButtons = document.querySelectorAll('.mobile-tab-btn');

    // Action buttons & Toolbar
    this.btnExportPdf = document.getElementById('btn-export-pdf');
    this.btnExportDocx = document.getElementById('btn-export-docx');
    this.btnCopyText = document.getElementById('btn-copy-text');
    this.btnToggleManualEdit = document.getElementById('btn-toggle-manual-edit');
    this.manualEditAlert = document.getElementById('manual-edit-alert');
    this.btnResetManualEdit = document.getElementById('btn-reset-manual-edit');
    this.btnSaveManualEdit = document.getElementById('btn-save-manual-edit');
    this.editBtnText = document.getElementById('edit-btn-text');

    // Modals
    this.modalSample = document.getElementById('modal-sample');
    this.modalReset = document.getElementById('modal-reset');
    this.btnOpenSample = document.getElementById('btn-open-sample-modal');
    this.btnHeroSample = document.getElementById('btn-hero-sample');
    this.btnOpenReset = document.getElementById('btn-open-reset-modal');
    this.btnConfirmReset = document.getElementById('btn-confirm-reset');

    this.toastContainer = document.getElementById('toast-container');
  }

  /**
   * Set tanggal default ke hari ini dalam format Bahasa Indonesia
   */
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

  /**
   * Muat data tersimpan dari LocalStorage jika ada
   */
  loadSavedData() {
    const saved = Storage.loadDraft();
    if (saved) {
      this.populateForm(saved);
      if (Array.isArray(saved.attachments) && saved.attachments.length > 0) {
        this.attachments = saved.attachments;
      }
      this.showToast('Draft tersimpan berhasil dimuat', 'info');
    }

    // Cek editan manual yang pernah disimpan
    const savedManual = Storage.loadManualEdit();
    if (savedManual) {
      this.isManualEdit = true;
      this.letterMount.innerHTML = savedManual;
      this.updateManualEditUI();
    }

    this.renderAttachments();
  }

  /**
   * Daftarkan event listener
   */
  initEventListeners() {
    // Navigasi Stepper
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

    // Tombol Selesai & Tinjau di Step 4
    const btnFinish = document.getElementById('btn-finish-and-preview');
    if (btnFinish) {
      btnFinish.addEventListener('click', () => {
        this.switchMobileTab('preview');
        this.showToast('Surat lamaran siap diunduh!', 'success');
      });
    }

    // Input form change & autosave
    this.form.addEventListener('input', () => this.handleFormInput());
    this.form.addEventListener('change', () => this.handleFormInput());

    // Tambah Lampiran Baru
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

    // Ekspor PDF & Cetak
    if (this.btnExportPdf) {
      this.btnExportPdf.addEventListener('click', () => this.handleExportPdf());
    }

    // Ekspor DOCX
    if (this.btnExportDocx) {
      this.btnExportDocx.addEventListener('click', () => this.handleExportDocx());
    }

    // Salin Teks Surat
    if (this.btnCopyText) {
      this.btnCopyText.addEventListener('click', () => this.handleCopyText());
    }

    // Mode Edit Manual
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

    // Modals
    if (this.btnOpenSample) {
      this.btnOpenSample.addEventListener('click', () => this.openModal(this.modalSample));
    }
    if (this.btnHeroSample) {
      this.btnHeroSample.addEventListener('click', () => this.openModal(this.modalSample));
    }
    if (this.btnOpenReset) {
      this.btnOpenReset.addEventListener('click', () => this.openModal(this.modalReset));
    }

    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.dataset.modal;
        const modal = document.getElementById(modalId);
        if (modal) this.closeModal(modal);
      });
    });

    // Pilihan Preset Contoh Data
    document.querySelectorAll('.sample-select-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const presetKey = btn.dataset.preset;
        this.loadSampleProfile(presetKey);
        this.closeModal(this.modalSample);
      });
    });

    // Konfirmasi Reset
    if (this.btnConfirmReset) {
      this.btnConfirmReset.addEventListener('click', () => {
        this.handleResetAll();
        this.closeModal(this.modalReset);
      });
    }

    // Keyboard shortcut Escape untuk modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => this.closeModal(m));
      }
    });
  }

  /**
   * Pindah antar step form
   */
  goToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > this.totalSteps) return;

    this.currentStep = stepNumber;

    // Update panel visibility
    this.stepPanels.forEach(panel => {
      panel.classList.remove('active');
    });
    const activePanel = document.getElementById(`step-${stepNumber}`);
    if (activePanel) activePanel.classList.add('active');

    // Update stepper bullets
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
    // Scroll smoothly to top of form
    activePanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Validasi field wajib pada step tertentu
   */
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
        this.showToast(`Mohon isi field "${field.labels?.[0]?.innerText || field.name}"`, 'warning');
        setTimeout(() => {
          field.style.borderColor = '';
        }, 3000);
        break;
      }
    }

    return isValid;
  }

  /**
   * Ekstraksi seluruh nilai formulir menjadi objek
   */
  getFormData() {
    const raw = new FormData(this.form);
    const data = {};
    for (const [key, value] of raw.entries()) {
      data[key] = value;
    }
    data.attachments = this.attachments;
    return data;
  }

  /**
   * Tangani input pada form (autosave & update preview)
   */
  handleFormInput() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      const data = this.getFormData();
      Storage.saveDraft(data);

      if (!this.isManualEdit) {
        this.updatePreview();
      }

      this.updateSyncStatus();
    }, 250);
  }

  /**
   * Perbarui tampilan preview surat A4
   */
  updatePreview() {
    if (this.isManualEdit) return;
    const formData = this.getFormData();
    const html = LetterEngine.generateHtml(formData);
    this.letterMount.innerHTML = html;
  }

  /**
   * Render ulang daftar lampiran dokumen (Step 4)
   */
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

  /**
   * Hubungkan event checkbox, edit nama, reorder, dan delete pada lampiran
   */
  bindAttachmentEvents() {
    // Checkbox toggle
    this.attachmentListContainer.querySelectorAll('.attachment-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const idx = parseInt(e.target.dataset.index, 10);
        this.attachments[idx].checked = e.target.checked;
        this.onAttachmentsChanged();
      });
    });

    // Edit nama lampiran
    this.attachmentListContainer.querySelectorAll('.attachment-name-input').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = parseInt(e.target.dataset.index, 10);
        this.attachments[idx].name = e.target.value;
        this.onAttachmentsChanged();
      });
    });

    // Reorder Naik
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

    // Reorder Turun
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

    // Hapus lampiran
    this.attachmentListContainer.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        this.attachments.splice(idx, 1);
        this.renderAttachments();
        this.onAttachmentsChanged();
      });
    });
  }

  /**
   * Tambah item lampiran baru
   */
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

  /**
   * Panggil saat data lampiran berubah
   */
  onAttachmentsChanged() {
    this.updateAttachmentCounter();
    this.handleFormInput();
  }

  /**
   * Perbarui jumlah berkas aktif pada badge counter
   */
  updateAttachmentCounter() {
    const activeCount = this.attachments.filter(a => a.checked && a.name.trim()).length;
    if (this.counterText) {
      this.counterText.innerText = `${activeCount} Berkas Aktif`;
    }
  }

  /**
   * Toggle mode edit manual
   */
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

  /**
   * Simpan hasil editan manual ke LocalStorage
   */
  saveManualEditContent() {
    const sheet = document.getElementById('letter-content');
    if (sheet) {
      Storage.saveManualEdit(this.letterMount.innerHTML);
    }
    this.isManualEdit = false;
    this.updateManualEditUI();
    this.showToast('Perubahan manual berhasil disimpan', 'success');
  }

  /**
   * Reset editan manual dan kembali sinkron dengan formulir
   */
  resetManualEdit() {
    Storage.clearManualEdit();
    this.isManualEdit = false;
    this.updateManualEditUI();
    this.updatePreview();
    this.showToast('Dokumen dikembalikan sesuai isi formulir', 'info');
  }

  /**
   * Switch tab pada smartphone / tablet
   */
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
      // Scroll ke lembar surat
      const previewOuter = document.getElementById('preview-sheet-outer');
      if (previewOuter) {
        previewOuter.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  /**
   * Salin seluruh teks surat ke clipboard
   */
  async handleCopyText() {
    const sheet = document.getElementById('letter-content');
    if (!sheet) return;
    try {
      const text = sheet.innerText;
      await navigator.clipboard.writeText(text);
      this.showToast('Teks surat berhasil disalin ke clipboard!', 'success');
    } catch (err) {
      // Fallback untuk browser yang membatasi clipboard API
      const textarea = document.createElement('textarea');
      textarea.value = sheet.innerText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.showToast('Teks surat berhasil disalin!', 'success');
    }
  }

  /**
   * Ekspor PDF via Browser Print API
   */
  handleExportPdf() {
    const formData = this.getFormData();
    const cleanNama = (formData.nama || 'Pelamar').replace(/[^a-zA-Z0-9_\-]/g, '_').replace(/_+/g, '_').trim();
    const cleanPosisi = (formData.posisi || 'Semua_Posisi').replace(/[^a-zA-Z0-9_\-]/g, '_').replace(/_+/g, '_').trim();
    
    // Set judul halaman agar default nama file saat "Save as PDF" rapi
    const originalTitle = document.title;
    document.title = `Surat_Lamaran_${cleanNama}_${cleanPosisi}`;

    this.showToast('Membuka dialog cetak... Tips: Pastikan opsi "Header dan footer" tidak dicentang.', 'info');

    // Trigger print
    window.print();

    // Kembalikan judul halaman semula
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  }

  /**
   * Ekspor Word (.docx) native menggunakan docx.js
   */
  async handleExportDocx() {
    const btn = this.btnExportDocx;
    const originalText = btn.innerHTML;
    try {
      btn.disabled = true;
      btn.innerHTML = `<i data-lucide="loader" class="animate-spin"></i><span>Membuat DOCX...</span>`;
      this.refreshIcons();

      const formData = this.getFormData();
      const sheet = document.getElementById('letter-content');
      const fileName = await DocxExporter.exportToDocx(formData, sheet, this.isManualEdit);

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

  /**
   * Muat salah satu profil contoh data
   */
  loadSampleProfile(key) {
    const profile = SAMPLE_PROFILES[key];
    if (!profile) return;

    this.populateForm(profile.data);
    if (Array.isArray(profile.data.attachments)) {
      this.attachments = JSON.parse(JSON.stringify(profile.data.attachments));
      this.renderAttachments();
    }

    // Reset manual edit agar preview otomatis terisi
    Storage.clearManualEdit();
    this.isManualEdit = false;
    this.updateManualEditUI();
    this.updatePreview();

    this.showToast(`Contoh data "${profile.title}" berhasil dimuat!`, 'success');
  }

  /**
   * Isi input formulir dari objek data
   */
  populateForm(data) {
    for (const [key, value] of Object.entries(data)) {
      const field = this.form.elements[key];
      if (field) {
        field.value = value;
      }
    }
  }

  /**
   * Reset formulir total
   */
  handleResetAll() {
    Storage.clearAll();
    this.form.reset();
    this.attachments = JSON.parse(JSON.stringify(DEFAULT_ATTACHMENTS_LIST));
    this.isManualEdit = false;
    this.updateManualEditUI();
    this.initDateDefaults();
    this.renderAttachments();
    this.updatePreview();
    this.goToStep(1);
    this.showToast('Formulir berhasil dikosongkan.', 'info');
  }

  /**
   * Perbarui status sync di toolbar
   */
  updateSyncStatus() {
    const textEl = document.getElementById('sync-status-text');
    if (textEl) {
      textEl.innerText = 'Draft Tersimpan';
      setTimeout(() => {
        textEl.innerText = 'Sinkronisasi Otomatis';
      }, 2000);
    }
  }

  /**
   * Helper buka modal
   */
  openModal(modal) {
    if (modal) modal.classList.add('active');
  }

  /**
   * Helper tutup modal
   */
  closeModal(modal) {
    if (modal) modal.classList.remove('active');
  }

  /**
   * Sistem Toast Notification
   */
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

  /**
   * Inisialisasi ikon Lucide
   */
  refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
}

// Jalankan aplikasi saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
  window.app = new SuratLamaranApp();
});
