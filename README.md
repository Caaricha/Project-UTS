# 🏥 Lapor Sehat - Sistem Kesehatan Masyarakat

Aplikasi web berbasis React + Node.js untuk pelaporan kesehatan lingkungan masyarakat.

## 📋 Fitur Utama

1. **Dashboard** 📊
   - Overview statistik laporan
   - Laporan terbaru
   - Status kesehatan lingkungan

2. **Lapor Kesehatan** 📝
   - Form pengisian laporan dengan foto
   - Kategorisasi masalah kesehatan
   - Tingkat urgency
   - Upload bukti foto

3. **Booking Puskesmas** 🏥
   - Jadwalkan kunjungan ke puskesmas
   - Pilih layanan kesehatan
   - Kelola booking Anda

4. **Daftar Laporan** 📋
   - Lihat semua laporan yang telah dibuat
   - Filter berdasarkan kategori
   - Search dan sorting
   - Status tracking

## 🚀 Cara Menjalankan

### Prerequisites
- Node.js (v16+)
- npm atau yarn

### Setup Backend

```bash
cd backend
npm install
# Pastikan .env sudah terkonfigurasi
node server.js
```

Backend akan berjalan di: `http://localhost:5000`

### Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend akan berjalan di: `http://localhost:5173`

## 📁 Struktur Project

```
lapor-sehat/
├── backend/
│   ├── server.js          # Main server file
│   ├── package.json       # Dependencies backend
│   ├── .env              # Environment variables
│   └── uploads/          # Upload files destination
│
└── frontend/
    ├── src/
    │   ├── components/    # React components
    │   │   └── Sidebar.jsx
    │   ├── pages/        # Page components
    │   │   ├── Dashboard.jsx
    │   │   ├── LaporanKesehatan.jsx
    │   │   ├── BookingPuskesmas.jsx
    │   │   └── DaftarLaporan.jsx
    │   ├── styles/       # CSS files
    │   │   ├── Sidebar.css
    │   │   ├── Dashboard.css
    │   │   ├── LaporanKesehatan.css
    │   │   ├── BookingPuskesmas.css
    │   │   └── DaftarLaporan.css
    │   ├── App.jsx       # Main app component
    │   ├── App.css
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── vite.config.js
    └── index.html
```

## 🔧 Konfigurasi

### Backend (.env)

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=lapor_kesehatan

# AWS (optional, untuk production)
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
S3_BUCKET_NAME=your_bucket
```

### API Endpoints

#### Laporan Kesehatan
- `GET /api/kesehatan` - Ambil semua laporan
- `GET /api/kesehatan/:id` - Ambil laporan tertentu
- `POST /api/kesehatan` - Buat laporan baru
- `PUT /api/kesehatan/:id` - Update status laporan
- `DELETE /api/kesehatan/:id` - Hapus laporan

#### Stats
- `GET /api/stats` - Dapatkan statistik dashboard

## 💻 Tech Stack

**Frontend:**
- React 18
- Vite
- Axios (HTTP client)
- CSS3

**Backend:**
- Express.js
- Node.js
- Multer (File upload)
- MySQL2 (Database)
- CORS

## 🎨 Design Features

- Modern gradient UI dengan warna biru-ungu
- Sidebar navigation yang dapat di-collapse
- Responsive design (mobile-friendly)
- Status badges dan icons
- Smooth animations dan transitions
- Dark/Light theme ready

## 📝 Development Mode

Aplikasi berjalan dalam mode **development** dengan:
- Mock data untuk testing
- Local file uploads (folder `/backend/uploads`)
- Database connection optional (fallback ke mock data)
- Placeholder images dari placeholder.com

## 🔄 Transisi ke Production (AWS)

Ketika siap deploy ke AWS:

1. Setup EC2 instance
2. Configure RDS database
3. Create S3 bucket
4. Setup GitHub Actions CI/CD workflow
5. Containerize dengan Docker
6. Update environment variables
7. Deploy melalui GitHub Actions

## 📊 Database Schema (Ketika menggunakan MySQL)

```sql
CREATE TABLE laporan_kesehatan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lokasi VARCHAR(255) NOT NULL,
  deskripsi TEXT NOT NULL,
  kategori VARCHAR(50),
  tingkat_urgency VARCHAR(20),
  status VARCHAR(20) DEFAULT 'pending',
  foto_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🚀 Next Steps

1. ✅ Dashboard UI
2. ✅ Laporan form dengan file upload
3. ✅ Booking puskesmas
4. ✅ Daftar laporan dengan filter
5. ⏳ Integrasi MySQL (production)
6. ⏳ Upload ke S3 (production)
7. ⏳ Docker containerization
8. ⏳ GitHub Actions CI/CD
9. ⏳ Deploy ke AWS EC2
10. ⏳ Domain & SSL

## 📞 Support

Untuk pertanyaan atau issues, silakan buat issue di repository ini.

---

**Last Updated:** April 17, 2026
