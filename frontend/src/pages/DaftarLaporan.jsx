import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/DaftarLaporan.css';

export default function DaftarLaporan() {
  const [laporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('semua');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLaporan();
  }, []);

  const fetchLaporan = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/kesehatan');
      setLaporan(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching laporan:', error);
      setLoading(false);
    }
  };

  const getFilteredLaporan = () => {
    let filtered = [...laporan];

    // Filter berdasarkan kategori
    if (filter !== 'semua') {
      filtered = filtered.filter(item => item.kategori === filter);
    }

    // Filter berdasarkan search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.lokasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.reverse();
  };

  const filteredLaporan = getFilteredLaporan();

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': '⏳ Pending',
      'diproses': '🔄 Diproses',
      'selesai': '✅ Selesai',
      'urgent': '🔴 Urgent',
      'normal': '🟢 Normal',
    };
    return statusMap[status] || status;
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'lingkungan': '🌍',
      'air': '💧',
      'udara': '💨',
      'sampah': '🗑️',
      'kesehatan': '💊',
    };
    return iconMap[category] || '📝';
  };

  return (
    <div className="daftar-container">
      <div className="daftar-header">
        <h1>📋 Daftar Laporan Kesehatan</h1>
        <p>Lihat semua laporan yang telah dibuat</p>
      </div>

      <div className="daftar-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Cari lokasi atau deskripsi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'semua' ? 'active' : ''}`}
            onClick={() => setFilter('semua')}
          >
            Semua
          </button>
          <button
            className={`filter-btn ${filter === 'lingkungan' ? 'active' : ''}`}
            onClick={() => setFilter('lingkungan')}
          >
            🌍 Lingkungan
          </button>
          <button
            className={`filter-btn ${filter === 'air' ? 'active' : ''}`}
            onClick={() => setFilter('air')}
          >
            💧 Air
          </button>
          <button
            className={`filter-btn ${filter === 'udara' ? 'active' : ''}`}
            onClick={() => setFilter('udara')}
          >
            💨 Udara
          </button>
          <button
            className={`filter-btn ${filter === 'sampah' ? 'active' : ''}`}
            onClick={() => setFilter('sampah')}
          >
            🗑️ Sampah
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Memuat laporan...</div>
      ) : filteredLaporan.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">📭</p>
          <p>Tidak ada laporan yang sesuai dengan filter</p>
        </div>
      ) : (
        <div className="laporan-grid">
          {filteredLaporan.map((item, index) => (
            <div key={item.id || index} className="laporan-card">
              <div className="card-header">
                <div className="card-title-section">
                  <span className="category-icon">
                    {getCategoryIcon(item.kategori)}
                  </span>
                  <h3>{item.lokasi}</h3>
                </div>
                <span className="status-badge">
                  {getStatusBadge(item.status)}
                </span>
              </div>

              <div className="card-body">
                <p className="deskripsi">{item.deskripsi}</p>
              </div>

              <div className="card-meta">
                <span className="meta-item">
                  📅 {new Date(item.created_at).toLocaleDateString('id-ID')}
                </span>
                {item.kategori && (
                  <span className="meta-item kategori-tag">
                    {item.kategori.charAt(0).toUpperCase() + item.kategori.slice(1)}
                  </span>
                )}
                {item.tingkat_urgency && (
                  <span className={`meta-item urgency urgency-${item.tingkat_urgency}`}>
                    {item.tingkat_urgency}
                  </span>
                )}
              </div>

              {item.foto_url && (
                <div className="card-image">
                  <img src={item.foto_url} alt="Bukti foto" />
                </div>
              )}

              <div className="card-footer">
                {item.foto_url && (
                  <a href={item.foto_url} target="_blank" rel="noopener noreferrer" className="btn-view-foto">
                    📷 Lihat Foto
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="summary">
        <p>Total laporan: <strong>{laporan.length}</strong> | Ditampilkan: <strong>{filteredLaporan.length}</strong></p>
      </div>
    </div>
  );
}
