# 🔧 Troubleshooting: "Gagal Mengirim Laporan" Error

## Error yang Dialami
```
Gagal mengirim laporan: Terjadi kesalahan pada server saat memproses laporan.
```

## Debugging Steps

### Step 1: Buka Browser Console (F12)

1. **Press F12** untuk buka DevTools
2. **Click tab "Console"**
3. Refresh halaman (F5)
4. Coba submit form lagi
5. Lihat log messages

### Step 2: Cek Log Output

**Expected console logs dari frontend:**
```
📤 Mengirim laporan...
- Lokasi: [value]
- Deskripsi: [value]
- Kategori: [value]
- Urgency: [value]
- File: [filename] [size] bytes
✅ Response dari server: { message: '...', data: {...} }
```

**Expected backend logs:**
```
📨 Menerima request POST /api/kesehatan
Body: { lokasi: '...', deskripsi: '...', ... }
File: kesehatan-xxxx.jpg (xxxxx bytes)
✅ File uploaded: http://localhost:5000/uploads/kesehatan-xxxx.jpg
📝 Executing query: INSERT INTO laporan_kesehatan ...
✅ Laporan saved to database with ID: 1
```

### Step 3: Cek Backend Terminal

Terminal backend harus menampilkan detailed logs dari setiap step.

**Jika melihat error seperti:**
```
❌ Database error: ...
```
atau
```
❌ ERROR in POST /api/kesehatan: ...
```

Note down the exact error message.

## Common Issues & Solutions

### ❌ Issue 1: "No File Uploaded"
**Tanda:**
- Console menampilkan error saat di browser
- Backend shows: "No file uploaded, using placeholder"

**Penyebab:**
- File tidak dipilih sebelum submit
- File size terlalu besar (> 5MB)
- Browser tidak support file upload

**Solusi:**
1. ✅ Pastikan foto sudah di-upload (lihat preview)
2. ✅ Gunakan file < 5MB
3. ✅ Refresh browser dan coba lagi
4. ✅ Gunakan browser yang beda (Chrome/Firefox)

### ❌ Issue 2: "Network Error / CORS Error"
**Tanda:**
- Console error: "Failed to fetch" atau CORS error
- Backend tidak menerima request

**Penyebab:**
- Backend tidak running
- Port 5000 tidak accessible
- CORS not configured

**Solusi:**
```bash
# Check backend running
lsof -i :5000

# Check process
netstat -ano | findstr :5000

# Restart backend
cd c:\laragon\www\lapor-sehat\backend
node server.js
```

### ❌ Issue 3: "Database Error"
**Tanda:**
- Error mencantam "Database"
- Data tidak masuk ke HeidiSQL

**Penyebab:**
- MySQL tidak running
- Database connection failed
- Tabel tidak ada

**Solusi:**
1. **Check MySQL running:**
   ```bash
   # Windows Services
   services.msc → cari MySQL → check "Running"
   ```

2. **Check database exists:**
   ```bash
   mysql -u root -e "SHOW DATABASES;"
   ```

3. **Restart backend** (akan auto-create tabel):
   ```bash
   node server.js
   ```

### ❌ Issue 4: "Form Validation Error"
**Tanda:**
- Error: "Lokasi dan deskripsi harus diisi!"
- Form fields kosong

**Penyebab:**
- Tidak isi semua field
- Form tidak ter-submit dengan benar

**Solusi:**
- ✅ Isi semua field yang required (*)
- ✅ Upload foto
- ✅ Klik "Kirim Laporan"

## Manual Test (Menggunakan Terminal)

### Test dengan curl:
```bash
# Create multipart form
curl -X POST http://localhost:5000/api/kesehatan \
  -F "lokasi=Test Location" \
  -F "deskripsi=Test Description" \
  -F "kategori=lingkungan" \
  -F "tingkat_urgency=normal" \
  -F "foto_kondisi=@/path/to/image.jpg"
```

### Expected Response:
```json
{
  "message": "Laporan berhasil dikirim dan tersimpan di database!",
  "data": {
    "id": 1,
    "lokasi": "Test Location",
    "deskripsi": "Test Description",
    "kategori": "lingkungan",
    "tingkat_urgency": "normal",
    "status": "pending",
    "foto_url": "http://localhost:5000/uploads/kesehatan-xxxxx.jpg",
    "created_at": "2026-04-17T10:30:00.000Z"
  }
}
```

## Verify Data Saved

### Di HeidiSQL:
1. Connect ke database
2. Query: `SELECT * FROM laporan_kesehatan ORDER BY id DESC;`
3. Lihat apakah data ada

### Check File Upload:
1. Open folder: `c:\laragon\www\lapor-sehat\backend\uploads`
2. Lihat apakah file foto ada

## Advanced Debugging

### Enable SQL Logging
Edit backend server.js dan add logging untuk SQL queries:
```javascript
const query = 'INSERT INTO laporan_kesehatan ...';
console.log('SQL Query:', query);
console.log('Params:', [lokasi, deskripsi, ...]);
```

### Check Network in DevTools

1. Press F12
2. Go to **Network** tab
3. Submit form
4. Lihat request ke `/api/kesehatan`
5. Check response status dan body

### Check File Upload Details
```javascript
console.log('File info:');
console.log('- Name:', req.file.filename);
console.log('- Size:', req.file.size);
console.log('- Mimetype:', req.file.mimetype);
console.log('- Path:', req.file.path);
```

## Performance Tips

1. **Reduce File Size**
   - Compress image sebelum upload
   - Gunakan format: JPG (recommended), PNG

2. **Optimize Form**
   - Jangan overload field
   - Simple & clean validation

3. **Database**
   - Index sudah ada untuk performa
   - Queries sudah optimized

## Logs Location

### Frontend Logs
- Browser Console (F12 → Console tab)
- Check for `📤`, `✅`, `❌` messages

### Backend Logs
- Terminal window di `node server.js`
- Check for `📨`, `✅`, `❌` messages

### Database Logs (MySQL)
- Check MySQL error log
- Usually in: `C:\ProgramData\MySQL\MySQL Server\Data\error.log`

## Emergency Fixes

### Reset Database
```bash
# Stop backend
# In HeidiSQL:
DROP TABLE laporan_kesehatan;
DROP TABLE booking_puskesmas;

# Restart backend (akan auto-create)
node server.js
```

### Clear Uploads Folder
```bash
# Delete semua file di folder uploads
c:\laragon\www\lapor-sehat\backend\uploads
```

### Restart Everything
```bash
# 1. Kill backend
# 2. Kill frontend
# 3. Restart MySQL
# 4. Start backend
# 5. Start frontend
```

## Still Not Working?

### Gather Information:
1. Screenshot dari error message
2. Console log output (F12)
3. Backend terminal output
4. Error di HeidiSQL (jika ada)
5. Output dari curl test

### Check Compatibility:
- Node.js version: `node --version` (should be v16+)
- MySQL version: `mysql --version`
- npm version: `npm --version`

## Contact Support

Jika masih error setelah semua ini:
1. Screenshot error message
2. Console log (F12 screenshot)
3. Backend log (terminal screenshot)
4. Share di issue tracker

---

**Created:** April 17, 2026
**Last Updated:** April 17, 2026
