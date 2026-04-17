# ✅ Lapor Sehat - Status Setup & Panduan Penggunaan

## 🎉 Status Saat Ini

### ✅ SELESAI
- [x] Frontend React + Vite dengan 4 halaman utama
- [x] Sidebar navigation yang responsive
- [x] Dashboard dengan statistik real-time
- [x] Form laporan kesehatan dengan file upload
- [x] Form booking puskesmas
- [x] Halaman daftar laporan dengan filter & search
- [x] Backend Express.js dengan RESTful API
- [x] Database MySQL auto-setup (create tables otomatis)
- [x] File upload ke folder lokal (development)
- [x] Mock data untuk testing
- [x] Error handling & validasi
- [x] Modern UI dengan gradient color scheme
- [x] Responsive design (mobile-friendly)

## 🚀 Cara Menjalankan Aplikasi

### Prerequisites
- Laragon installed (atau MySQL + Node.js)
- Frontend & Backend sudah ter-setup

### Terminal 1: Start Backend
```bash
cd c:\laragon\www\lapor-sehat\backend
node server.js
```

**Output yang diharapkan:**
```
✅ Database connection successful!
✅ Tables created/verified successfully!
🚀 Backend LaporSehat berjalan di http://localhost:5000
💾 Database: Connected
```

### Terminal 2: Start Frontend
```bash
cd c:\laragon\www\lapor-sehat\frontend
npm run dev
```

**Output yang diharapkan:**
```
VITE v4.5.14  ready in 1375 ms
  ➜  Local:   http://localhost:5173/
```

### Akses Aplikasi
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📱 Fitur-Fitur

### 1. Dashboard 📊
- Statistik total laporan, laporan hari ini, booking, dan urgent reports
- Laporan terbaru yang masuk
- Real-time update dari database

### 2. Lapor Kesehatan 📝
- Form lengkap: Lokasi, Deskripsi, Kategori, Tingkat Urgency
- Upload bukti foto
- Preview foto sebelum submit
- Success/error messages
- Data tersimpan di database

### 3. Booking Puskesmas 🏥
- Form booking: Nama, Telepon, Email, Tanggal, Jam, Layanan
- Dropdown pilihan layanan
- Daftar booking dengan status
- Bisa batalkan booking

### 4. Daftar Laporan 📋
- Tampil semua laporan dalam grid view
- Filter berdasarkan kategori
- Search berdasarkan lokasi/deskripsi
- Status badge dan urgency level
- Preview foto inline

## 💾 Database

### Auto-Setup
- Tabel dibuat otomatis saat backend start
- Tidak perlu manual setup
- Connection ke MySQL localhost:3306

### Tabel yang Dibuat
1. **laporan_kesehatan** - Menyimpan semua laporan
2. **booking_puskesmas** - Menyimpan semua booking

### Verify Data di HeidiSQL

1. **Connect ke Database**
   - Host: localhost
   - User: root
   - Database: lapor_kesehatan

2. **Lihat Data**
   - Double-click tabel untuk lihat data
   - Atau run query di Query tab

3. **Check Tabel Structure**
   ```sql
   DESCRIBE laporan_kesehatan;
   ```

## 📁 File Upload

### Lokasi Upload
```
c:\laragon\www\lapor-sehat\backend\uploads\
```

### Akses File Upload
```
http://localhost:5000/uploads/nama-file.jpg
```

### Contoh URL di Database
```
foto_url = "http://localhost:5000/uploads/kesehatan-1713350400000-example.jpg"
```

## 🔧 Konfigurasi

### Backend (.env)
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=lapor_kesehatan
```

Semua sudah ter-default untuk Laragon!

### Frontend
- Base URL: `http://localhost:5000`
- Configure di dashboard.jsx, laporankesehatan.jsx, dll

## 📊 API Endpoints

### Kesehatan Reports
```
GET  /api/kesehatan              - Get all reports
POST /api/kesehatan              - Create new report
GET  /api/kesehatan/:id          - Get report by ID
PUT  /api/kesehatan/:id          - Update report status
DELETE /api/kesehatan/:id        - Delete report
```

### Statistics
```
GET  /api/stats                  - Get dashboard statistics
```

### Health Check
```
GET  /                           - Health check
```

## 🧪 Testing Manual

### 1. Test Lapor Kesehatan
1. Open http://localhost:5173
2. Click "Lapor Kesehatan"
3. Fill form:
   - Lokasi: "Jl. Test"
   - Deskripsi: "Test Description"
   - Kategori: "lingkungan"
   - Tingkat Urgency: "normal"
   - Upload foto: Any image
4. Click "Kirim Laporan"
5. Expected: Success message
6. Check di HeidiSQL → laporan_kesehatan table

### 2. Test Dashboard
1. Click "Dashboard"
2. Should show stats updated with new report
3. "Laporan Terbaru" section shows latest report

### 3. Test Daftar Laporan
1. Click "Daftar Laporan"
2. Should show all reports
3. Try filter by kategori
4. Try search by lokasi

### 4. Test Booking Puskesmas
1. Click "Booking Puskesmas"
2. Fill form with your data
3. Click "Kirim Booking"
4. Expected: Success message
5. Booking muncul di "Daftar Booking Saya"

## 🐛 Troubleshooting

### Backend tidak bisa connect ke database
**Error:** 
```
❌ Database connection error
⚠️  Running in mock data mode
```

**Solusi:**
1. Check MySQL running: `services.msc`
2. Check .env configuration
3. Verify database exists: 
   ```sql
   SHOW DATABASES;
   ```

### Frontend tidak bisa connect ke backend
**Error:** 
```
Network error / Failed to fetch
```

**Solusi:**
1. Check backend running di http://localhost:5000
2. Check CORS enabled
3. Check port tidak conflict

### Foto tidak tersimpan
**Solusi:**
1. Check folder uploads exists: `backend/uploads`
2. Check file size < 5MB
3. Check browser console untuk error

### Data tidak muncul di database
**Solusi:**
1. Refresh page (F5)
2. Check backend logs
3. Verify tabel structure di HeidiSQL
4. Check data di: `SELECT * FROM laporan_kesehatan;`

## 📚 Dokumentasi Files

1. **README.md** - Overview aplikasi
2. **SETUP_DATABASE.md** - Database configuration & troubleshooting
3. **HEIDISQL_GUIDE.md** - Cara verify data di HeidiSQL
4. **database/schema.sql** - SQL script untuk setup
5. **database/verify_data.sql** - SQL queries untuk verify

## 🔐 Security Notes (Development)

Fitur keamanan untuk production:
- [ ] User authentication (Login/Register)
- [ ] Password hashing (bcrypt)
- [ ] JWT tokens
- [ ] Rate limiting
- [ ] Input sanitization
- [ ] HTTPS/SSL
- [ ] CORS whitelist
- [ ] Admin panel

## 📈 Performance

### Indexes Created
- `idx_status` - Filter by status
- `idx_kategori` - Filter by category
- `idx_created_at` - Sort by date

Queries akan lebih cepat dengan indexes!

## 🚀 Next Steps (Production Ready)

1. **AWS Deployment**
   - [ ] Setup EC2 instance
   - [ ] Configure RDS database
   - [ ] Create S3 bucket for uploads
   - [ ] Setup GitHub Actions CI/CD
   - [ ] Containerize dengan Docker
   - [ ] Deploy ke production

2. **Features to Add**
   - [ ] User authentication
   - [ ] Admin dashboard
   - [ ] Email notifications
   - [ ] Export reports to PDF
   - [ ] Analytics & charts
   - [ ] Multi-language support
   - [ ] Dark theme

3. **Optimization**
   - [ ] Implement caching
   - [ ] Add pagination
   - [ ] Optimize images
   - [ ] Minify CSS/JS
   - [ ] Add service workers

## 📞 Support

### Common Issues

**Q: Bagaimana cara reset database?**
A: 
```sql
DROP TABLE laporan_kesehatan;
DROP TABLE booking_puskesmas;
```
Kemudian restart backend (akan auto-create).

**Q: Bagaimana cara backup data?**
A: Di HeidiSQL → Right-click database → "Dump database to SQL file"

**Q: Apakah bisa pakai database lain?**
A: Ya, edit .env dan ganti DB_NAME/DB_HOST

## 🎨 UI Customization

### Colors (gradient)
- Primary: `#667eea` (purple)
- Secondary: `#764ba2` (dark purple)

Edit file:
- `frontend/src/styles/*.css`
- `frontend/src/App.css`

## 📝 License

Development project untuk Cloud Computing UTS

---

## Checklist Sebelum Submit

- [x] Frontend berjalan di http://localhost:5173
- [x] Backend berjalan di http://localhost:5000
- [x] Database connected & tables created
- [x] Lapor kesehatan form working
- [x] File upload working
- [x] Data tersimpan di database
- [x] Dashboard showing real-time data
- [x] Filter & search working
- [x] Booking puskesmas working
- [x] Responsive design working
- [x] Error handling implemented
- [x] Documentation complete

## 🎉 READY FOR TESTING!

Aplikasi web sudah siap untuk ditest dan digunakan!

---

**Created:** April 17, 2026
**Status:** ✅ Production Development Phase Complete
