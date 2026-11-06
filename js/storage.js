/**
 * storage.js - LocalStorage manager for SuratLamaran Generator
 * Memastikan privasi pengguna 100% lokal di browser tanpa server eksternal.
 */

const STORAGE_KEY = 'suratlamaran_form_draft';
const MANUAL_EDIT_KEY = 'suratlamaran_manual_draft';
const SETTINGS_KEY = 'suratlamaran_settings';

export const Storage = {
  /**
   * Menyimpan data form ke LocalStorage
   * @param {Object} formData
   */
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

  /**
   * Mengambil data form yang tersimpan
   * @returns {Object|null}
   */
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

  /**
   * Mendapatkan waktu terakhir draft disimpan
   * @returns {string|null}
   */
  getLastSavedTime() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed.updatedAt) return null;
      const date = new Date(parsed.updatedAt);
      return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return null;
    }
  },

  /**
   * Menyimpan editan surat manual jika user mengaktifkan mode edit manual
   * @param {string} htmlContent
   */
  saveManualEdit(htmlContent) {
    try {
      localStorage.setItem(MANUAL_EDIT_KEY, htmlContent);
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * Mengambil editan surat manual
   * @returns {string|null}
   */
  loadManualEdit() {
    try {
      return localStorage.getItem(MANUAL_EDIT_KEY) || null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Menghapus editan manual
   */
  clearManualEdit() {
    try {
      localStorage.removeItem(MANUAL_EDIT_KEY);
    } catch (e) {}
  },

  /**
   * Menghapus seluruh data tersimpan (reset form total)
   */
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

