import { useState } from 'react';
import '../styles/BookingPuskesmas.css';

export default function BookingPuskesmas() {
  const [formData, setFormData] = useState({
    nama: '',
    noTelepon: '',
    email: '',
    tanggal: '',
    jam: '',
    layanan: '',
    keluhan: '',
  });

  const [bookingList, setBookingList] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.nama || !formData.noTelepon || !formData.tanggal || !formData.jam || !formData.layanan) {
      alert('Semua field harus diisi!');
      return;
    }

    const newBooking = {
      id: Date.now(),
      ...formData,
      status: 'pending',
      createdAt: new Date().toLocaleString('id-ID'),
    };

    setBookingList(prev => [newBooking, ...prev]);
    setFormData({
      nama: '',
      noTelepon: '',
      email: '',
      tanggal: '',
      jam: '',
      layanan: '',
      keluhan: '',
    });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleCancel = (id) => {
    setBookingList(prev => prev.filter(booking => booking.id !== id));
  };

  const getPuskesmasOptions = () => {
    return [
      'Puskesmas Cihampelas',
      'Puskesmas Merdeka',
      'Puskesmas Gatot Subroto',
      'Puskesmas Kampung Rawa',
    ];
  };

  const getLayananOptions = () => {
    return [
      'Konsultasi Umum',
      'Imunisasi',
      'Periksa Kesehatan',
      'Gigi',
      'KIA (Kesehatan Ibu & Anak)',
      'Gawat Darurat',
    ];
  };

  return (
    <div className="booking-container">
      <div className="booking-header">
        <h1>🏥 Booking Layanan Puskesmas</h1>
        <p>Jadwalkan kunjungan Anda ke puskesmas</p>
      </div>

      {submitted && (
        <div className="success-message">
          ✅ Booking berhasil! Kami akan menghubungi Anda untuk konfirmasi.
        </div>
      )}

      <div className="booking-content">
        <div className="booking-form-section">
          <h2>📋 Form Booking</h2>
          
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
              <label htmlFor="nama">Nama Lengkap *</label>
              <input
                type="text"
                id="nama"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Masukkan nama Anda"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="noTelepon">No. Telepon *</label>
                <input
                  type="tel"
                  id="noTelepon"
                  name="noTelepon"
                  value={formData.noTelepon}
                  onChange={handleChange}
                  placeholder="08xx-xxxx-xxxx"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tanggal">Tanggal Kunjungan *</label>
                <input
                  type="date"
                  id="tanggal"
                  name="tanggal"
                  value={formData.tanggal}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="jam">Jam Kunjungan *</label>
                <input
                  type="time"
                  id="jam"
                  name="jam"
                  value={formData.jam}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="layanan">Layanan *</label>
              <select
                id="layanan"
                name="layanan"
                value={formData.layanan}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Layanan</option>
                {getLayananOptions().map(layanan => (
                  <option key={layanan} value={layanan}>{layanan}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="keluhan">Keluhan / Catatan</label>
              <textarea
                id="keluhan"
                name="keluhan"
                value={formData.keluhan}
                onChange={handleChange}
                placeholder="Jelaskan keluhan atau pertanyaan Anda..."
                rows="4"
              />
            </div>

            <button type="submit" className="btn-submit">
              Kirim Booking
            </button>
          </form>
        </div>

        <div className="booking-list-section">
          <h2>📅 Daftar Booking Saya</h2>
          
          {bookingList.length === 0 ? (
            <p className="empty-message">Belum ada booking</p>
          ) : (
            <div className="booking-list">
              {bookingList.map(booking => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-card-header">
                    <h3>{booking.nama}</h3>
                    <span className={`status status-${booking.status}`}>
                      {booking.status === 'pending' ? '⏳ Pending' : '✅ Confirmed'}
                    </span>
                  </div>
                  <div className="booking-card-body">
                    <p>📞 {booking.noTelepon}</p>
                    <p>📧 {booking.email || '-'}</p>
                    <p>📅 {booking.tanggal} - {booking.jam}</p>
                    <p>🏥 {booking.layanan}</p>
                    {booking.keluhan && <p>💬 {booking.keluhan}</p>}
                    <small>Dibuat: {booking.createdAt}</small>
                  </div>
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="btn-cancel"
                  >
                    Batalkan
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
