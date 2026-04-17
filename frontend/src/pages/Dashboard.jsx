import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalLaporan: 0,
    laporanHariIni: 0,
    totalBooking: 0,
    statusUrgent: 0,
  });
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch laporan kesehatan
        const response = await axios.get('http://localhost:5000/api/kesehatan');
        const laporan = response.data;

        // Hitung statistik
        const today = new Date().toISOString().split('T')[0];
        const laporanHariIni = laporan.filter(item => 
          item.created_at?.split(' ')[0] === today
        ).length;

        setStats({
          totalLaporan: laporan.length,
          laporanHariIni: laporanHariIni,
          totalBooking: 0, // akan diupdate nanti
          statusUrgent: laporan.filter(item => item.status === 'urgent').length || 0,
        });

        // Ambil 5 laporan terbaru
        setRecentReports(laporan.slice(-5).reverse());
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Kesehatan Masyarakat</h1>
        <p>Selamat datang di sistem pelaporan kesehatan lingkungan</p>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{stats.totalLaporan}</h3>
            <p>Total Laporan</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{stats.laporanHariIni}</h3>
            <p>Laporan Hari Ini</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏥</div>
          <div className="stat-content">
            <h3>{stats.totalBooking}</h3>
            <p>Total Booking</p>
          </div>
        </div>

        <div className="stat-card urgent">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>{stats.statusUrgent}</h3>
            <p>Status Urgent</p>
          </div>
        </div>
      </div>

      <div className="recent-section">
        <h2>Laporan Terbaru</h2>
        {loading ? (
          <p>Memuat...</p>
        ) : recentReports.length === 0 ? (
          <p className="empty-message">Belum ada laporan</p>
        ) : (
          <div className="recent-reports">
            {recentReports.map((report) => (
              <div key={report.id} className="report-item">
                <div className="report-header">
                  <h4>{report.lokasi}</h4>
                  <span className="report-date">{report.created_at}</span>
                </div>
                <p className="report-desc">{report.deskripsi}</p>
                <div className="report-footer">
                  {report.foto_url && (
                    <a href={report.foto_url} target="_blank" rel="noopener noreferrer" className="report-foto">
                      📷 Lihat Foto
                    </a>
                  )}
                  <span className={`status status-${report.status || 'pending'}`}>
                    {report.status || 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
