# 🔍 Cara Verify Data di HeidiSQL

## Step 1: Buka HeidiSQL
- Jalankan aplikasi HeidiSQL
- Atau akses dari Laragon control panel

## Step 2: Connect ke Database

1. **Klik "New"** di bagian Sessions
2. **Library**: MySQL (or MariaDB)
3. **Hostname**: localhost
4. **User**: root
5. **Password**: (kosong)
6. **Port**: 3306 (default)
7. Klik **"Open"**

## Step 3: Expand Database

1. Di left panel, expand **Laragon.MySQL**
2. Klik folder icon atau double-click **lapor_kesehatan**
3. Sekarang Anda bisa lihat tabel-tabel:
   - `laporan_kesehatan`
   - `booking_puskesmas`

## Step 4: View Data dari Tabel

### Cara 1: Double-click Tabel
- Double-click `laporan_kesehatan`
- Data akan ditampilkan di main panel

### Cara 2: Right-click → Open/Edit
- Right-click tabel → **Edit table**
- Bisa lihat struktur & edit data

## Step 5: Run Query untuk Verify

1. **Buka Query Tab** (tombol "Query" di top)
2. **Copy-paste query dari file `database/verify_data.sql`**
3. **Press F9 atau klik tombol Execute** (icon ▶)

### Query yang Sering Digunakan:

```sql
-- Lihat semua laporan
SELECT * FROM laporan_kesehatan ORDER BY created_at DESC;

-- Hitung total
SELECT COUNT(*) as total FROM laporan_kesehatan;

-- Lihat laporan urgent
SELECT * FROM laporan_kesehatan WHERE tingkat_urgency='urgent';
```

## Step 6: Check Struktur Tabel

### Cara 1: Double-click tabel (lihat struktur)
- Di left panel, double-click `laporan_kesehatan`
- Di bottom, ada tab "Structure" untuk lihat kolom

### Cara 2: Query
```sql
DESCRIBE laporan_kesehatan;
SHOW COLUMNS FROM laporan_kesehatan;
```

## Step 7: Insert Test Data Manual

1. **Click tab di data view**
2. **Klik tombol "Insert"** (atau tekan Ctrl+Insert)
3. **Fill in the fields:**
   - lokasi: "Test Location"
   - deskripsi: "Test Description"
   - kategori: "lingkungan"
   - tingkat_urgency: "normal"
   - status: "pending"
4. **Click "Post"** atau tekan Ctrl+S

## Expected Output

Ketika Anda run query, Anda seharusnya melihat:

### Columns di Tabel `laporan_kesehatan`:
```
id              INT (Primary Key, Auto Increment)
lokasi          VARCHAR(255)
deskripsi       LONGTEXT
kategori        VARCHAR(50)
tingkat_urgency VARCHAR(20)
status          VARCHAR(20)
foto_url        VARCHAR(500)
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Data Example:
```
| id | lokasi              | deskripsi      | kategori    | status  | created_at          |
|----|---------------------|----------------|-------------|---------|---------------------|
| 1  | Jl. Ahmad Yani 45   | Genangan air   | lingkungan  | pending | 2026-04-17 10:30:00 |
| 2  | Taman Impian        | Sampah berserakan | sampah  | pending | 2026-04-17 10:25:00 |
```

## Troubleshooting

### 1. Tabel Tidak Terlihat
- **Solusi**: Klik refresh icon atau tekan F5
- Atau: Disconnect & reconnect

### 2. "Access denied for user 'root'"
- **Solusi**: 
  - Check password (di Laragon default kosong)
  - Verify MySQL running di Services

### 3. Database "lapor_kesehatan" tidak ada
- **Solusi**:
  - Jalankan backend (akan auto-create)
  - Atau buat manual: `CREATE DATABASE lapor_kesehatan;`

### 4. Melihat Data tetapi Kosong
- **Solusi**:
  - Buat laporan baru dari aplikasi web
  - Atau insert manual test data di HeidiSQL

## Tips & Tricks

### Keyboard Shortcuts
- **F9** = Execute query
- **Ctrl+A** = Select all
- **Ctrl+C** = Copy
- **Ctrl+V** = Paste
- **F5** = Refresh
- **Alt+O** = Open new query

### Advanced Queries

**Export Data to CSV:**
```sql
SELECT * FROM laporan_kesehatan 
INTO OUTFILE '/path/to/file.csv'
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n';
```

**Backup Entire Database:**
- Right-click database → **Dump database to SQL file**

**View Real-time Data:**
- Buka query tab
- Run: `SELECT * FROM laporan_kesehatan;`
- Tekan F9 berulang kali untuk refresh

## Verifikasi Setelah Kirim Laporan

1. **Kirim laporan dari aplikasi web**
   - Buka http://localhost:5173
   - Go to "Lapor Kesehatan"
   - Fill form & kirim

2. **Cek di HeidiSQL**
   - Tekan F9 untuk execute query
   - Lihat query result
   - Laporan baru seharusnya muncul di table

3. **Check Foto Upload**
   - Buka folder: `c:\laragon\www\lapor-sehat\backend\uploads`
   - Cek apakah file foto sudah tersimpan
   - Di HeidiSQL, kolom `foto_url` seharusnya ada path-nya

## Monitoring

### Real-time Monitoring
Buka 2 window:
1. **Window 1**: Aplikasi web untuk input laporan
2. **Window 2**: HeidiSQL untuk lihat data real-time

Setiap kali kirim laporan, data langsung muncul di HeidiSQL!

---

**Dokumentasi dibuat: April 17, 2026**
