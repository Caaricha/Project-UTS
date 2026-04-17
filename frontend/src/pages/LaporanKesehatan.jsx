import { useState } from 'react';
import axios from 'axios';
import '../styles/LaporanKesehatan.css';

export default function LaporanKesehatan({ onLaporanAdded }) {
  const [formData, setFormData] = useState({
    lokasi: '',
    deskripsi: '',
    kategori: 'lingkungan',
    tingkatUrgency: 'normal',
  });
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
      const reader = new FileReader();
      reader.onload = (e) => setFotoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.lokasi || !formData.deskripsi) {
      setMessageType('error');
      setMessage('Lokasi dan deskripsi harus diisi!');
      return;
    }

    if (!foto) {
      setMessageType('error');
      setMessage('Foto harus diupload!');
      return;
    }

    setLoading(true);
    const form = new FormData();
    form.append('lokasi', formData.lokasi);
    form.append('deskripsi', formData.deskripsi);
    form.append('kategori', formData.kategori);
    form.append('tingkat_urgency', formData.tingkatUrgency);
    form.append('foto_kondisi', foto);

    console.log('📤 Mengirim laporan...');
    console.log('- Lokasi:', formData.lokasi);
    console.log('- Deskripsi:', formData.deskripsi);
    console.log('- Kategori:', formData.kategori);
    console.log('- Urgency:', formData.tingkatUrgency);
    console.log('- File:', foto.name, foto.size, 'bytes');
    console.log('- Form data entries:', Array.from(form.entries()));

    try {
      console.log('🔌 Connecting to backend: http://localhost:5000/api/kesehatan');
      const response = await axios.post('http://localhost:5000/api/kesehatan', form);

      console.log('✅ Response dari server:', response.data);

      setMessageType('success');
      setMessage('✅ ' + response.data.message);
      
      // Reset form
      setFormData({
        lokasi: '',
        deskripsi: '',
        kategori: 'lingkungan',
        tingkatUrgency: 'normal',
      });
      setFoto(null);
      setFotoPreview(null);

      // Callback untuk refresh data di parent
      if (onLaporanAdded) onLaporanAdded();

      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      console.error('❌ Error saat submit:', error);
      console.error('Error type:', error.code || error.name);
      console.error('Error message:', error.message);
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
      console.error('Request:', error.config?.url, error.config?.method);
      
      const errorMsg = error.response?.data?.error || error.message || 'Terjadi kesalahan saat mengirim laporan';
      setMessageType('error');
      setMessage('❌ Gagal mengirim laporan: ' + errorMsg);
      console.error('Full error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="laporan-container">
      <div className="laporan-header">
        <h1>📝 Lapor Kesehatan Lingkungan</h1>
        <p>Laporkan kondisi kesehatan lingkungan di sekitar Anda</p>
      </div>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="laporan-form">
        <div className="form-section">
          <h2>Informasi Lokasi</h2>
          
          <div className="form-group">
            <label htmlFor="lokasi">📍 Lokasi *</label>
            <input
              type="text"
              id="lokasi"
              name="lokasi"
              value={formData.lokasi}
              onChange={handleChange}
              placeholder="Contoh: Jl. Merdeka No. 123, Kelurahan Cihampelas"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="deskripsi">📄 Deskripsi Masalah *</label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              placeholder="Jelaskan kondisi kesehatan lingkungan yang Anda temukan..."
              rows="5"
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Klasifikasi</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="kategori">🏷️ Kategori</label>
              <select
                id="kategori"
                name="kategori"
                value={formData.kategori}
                onChange={handleChange}
              >
                <option value="lingkungan">Lingkungan</option>
                <option value="air">Kualitas Air</option>
                <option value="udara">Kualitas Udara</option>
                <option value="sampah">Pengelolaan Sampah</option>
                <option value="kesehatan">Kesehatan Publik</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tingkatUrgency">⚠️ Tingkat Urgency</label>
              <select
                id="tingkatUrgency"
                name="tingkatUrgency"
                value={formData.tingkatUrgency}
                onChange={handleChange}
              >
                <option value="normal">Normal</option>
                <option value="medium">Medium</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>📷 Bukti Foto</h2>
          
          <div className="foto-upload">
            <input
              type="file"
              id="foto"
              name="foto"
              accept="image/*"
              onChange={handleFotoChange}
              required
              style={{ display: 'none' }}
            />
            <label htmlFor="foto" className="upload-label">
              {fotoPreview ? (
                <div className="foto-preview">
                  <img src={fotoPreview} alt="preview" />
                  <p>Klik untuk ubah foto</p>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <span className="upload-icon">📸</span>
                  <p>Klik atau drag foto di sini</p>
                  <small>Format: JPG, PNG, Max 5MB</small>
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
            className="btn-submit"
          >
            {loading ? 'Mengirim...' : 'Kirim Laporan'}
          </button>
          <button
            type="reset"
            className="btn-reset"
            onClick={() => {
              setFoto(null);
              setFotoPreview(null);
            }}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
