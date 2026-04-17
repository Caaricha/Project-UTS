# 📊 Database Setup Guide

## Status
✅ **Database Terkoneksi**
✅ **Tabel Sudah Dibuat Otomatis**

## Database Configuration

### File: `.env`
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=          # (kosong untuk default Laragon)
DB_NAME=lapor_kesehatan
```

## Tabel Database

### 1. `laporan_kesehatan`
Menyimpan semua laporan kesehatan lingkungan

```sql
CREATE TABLE laporan_kesehatan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lokasi VARCHAR(255) NOT NULL,
    deskripsi LONGTEXT NOT NULL,
    kategori VARCHAR(50) DEFAULT 'lingkungan',
    tingkat_urgency VARCHAR(20) DEFAULT 'normal',
    status VARCHAR(20) DEFAULT 'pending',
    foto_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Fields:**
- `id` - Primary key (auto increment)
- `lokasi` - Lokasi laporan
- `deskripsi` - Deskripsi masalah
- `kategori` - Kategori (lingkungan, air, udara, sampah, kesehatan)
- `tingkat_urgency` - Tingkat urgensi (normal, medium, urgent)
- `status` - Status laporan (pending, diproses, selesai)
- `foto_url` - URL foto laporan
- `created_at` - Waktu dibuat
- `updated_at` - Waktu diupdate terakhir

### 2. `booking_puskesmas`
Menyimpan semua booking layanan puskesmas

```sql
CREATE TABLE booking_puskesmas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    no_telepon VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    tanggal DATE NOT NULL,
    jam TIME NOT NULL,
    layanan VARCHAR(100) NOT NULL,
    keluhan LONGTEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Fields:**
- `id` - Primary key
- `nama` - Nama pasien
- `no_telepon` - Nomor telepon
- `email` - Email pasien
- `tanggal` - Tanggal booking
- `jam` - Jam booking
- `layanan` - Jenis layanan
- `keluhan` - Keluhan/catatan
- `status` - Status booking
- `created_at` - Waktu dibuat
- `updated_at` - Waktu diupdate

## Backend Connection Flow

1. **Server Start** → `initDatabase()` dipanggil
2. **Connection Test** → Check koneksi ke MySQL
3. **Create Tables** → Buat tabel jika belum ada
4. **Ready for API** → Server siap menerima request

## Data Flow

### POST /api/kesehatan (Kirim Laporan)
```
Frontend (React)
    ↓
Backend (Express)
    ↓ (validasi + upload file)
Database (MySQL)
    ↓
Response: { success, id, data }
```

### GET /api/kesehatan (Ambil Laporan)
```
Frontend Request
    ↓
Backend
    ↓ (query database)
Database (SELECT * FROM laporan_kesehatan)
    ↓
Response: [laporan_array]
    ↓
Frontend Display
```

## Troubleshooting

### 1. Database Connection Error
```
❌ Database connection error: ...
⚠️  Running in mock data mode...
```
**Solusi:**
- Check MySQL running: `services.msc` → cari MySQL
- Check .env configuration
- Verify database exists: `mysql -u root -e "SHOW DATABASES"`

### 2. Table Not Created
```
mysql> USE lapor_kesehatan;
mysql> SHOW TABLES;
```
**Solusi:**
- Jalankan query di `database/schema.sql`
- Atau restart backend (auto-create akan berjalan)

### 3. Data Not Showing Up
- Check browser console untuk error
- Refresh page (F5)
- Check backend logs untuk SQL errors
- Verify foto upload berhasil

## Database Admin Tools

### HeidiSQL
- Program: HeidiSQL
- Host: localhost
- User: root
- Password: (kosong)
- Database: lapor_kesehatan

### MySQL Command Line
```bash
# Connect to MySQL
mysql -u root

# Select database
USE lapor_kesehatan;

# View tables
SHOW TABLES;

# View laporan
SELECT * FROM laporan_kesehatan;

# View stats
SELECT COUNT(*) as total FROM laporan_kesehatan;
SELECT COUNT(*) as urgent FROM laporan_kesehatan WHERE tingkat_urgency='urgent';
```

## API Test Examples

### Create Report (POST)
```bash
curl -X POST http://localhost:5000/api/kesehatan \
  -F "lokasi=Jl. Test" \
  -F "deskripsi=Test Description" \
  -F "kategori=lingkungan" \
  -F "tingkat_urgency=normal" \
  -F "foto_kondisi=@/path/to/image.jpg"
```

### Get All Reports (GET)
```bash
curl http://localhost:5000/api/kesehatan
```

### Get Dashboard Stats (GET)
```bash
curl http://localhost:5000/api/stats
```

## Performance Optimization

### Indexes Created
- `idx_status` - Query berdasarkan status
- `idx_kategori` - Query berdasarkan kategori  
- `idx_created_at` - Query berdasarkan tanggal

Indexes membantu query menjadi lebih cepat!

## Backup & Restore

### Backup Database
```bash
mysqldump -u root lapor_kesehatan > backup.sql
```

### Restore Database
```bash
mysql -u root lapor_kesehatan < backup.sql
```

## Next Steps

1. ✅ Database Connection & Table Creation
2. ✅ Data Insert & Retrieve
3. ⏳ Add Authentication (User Login)
4. ⏳ Add Admin Panel untuk view semua reports
5. ⏳ Export Report to PDF
6. ⏳ Analytics & Dashboard Stats
7. ⏳ Production DB Setup (AWS RDS)

---

**Last Updated:** April 17, 2026
