-- ============================================================
-- LAPOR SEHAT - Database Verification & Query Script
-- ============================================================

-- 1. CHECK DATABASE CONNECTION & TABLES
-- ============================================================
USE lapor_kesehatan;

-- Show all tables
SHOW TABLES;

-- Check table structure
DESCRIBE laporan_kesehatan;
DESCRIBE booking_puskesmas;

-- ============================================================
-- 2. VIEW ALL DATA
-- ============================================================

-- Lihat semua laporan
SELECT * FROM laporan_kesehatan ORDER BY created_at DESC;

-- Lihat semua booking
SELECT * FROM booking_puskesmas ORDER BY created_at DESC;

-- ============================================================
-- 3. COUNT & STATISTICS
-- ============================================================

-- Total laporan
SELECT COUNT(*) as total_laporan FROM laporan_kesehatan;

-- Laporan per kategori
SELECT kategori, COUNT(*) as jumlah FROM laporan_kesehatan GROUP BY kategori;

-- Laporan per status
SELECT status, COUNT(*) as jumlah FROM laporan_kesehatan GROUP BY status;

-- Laporan urgent
SELECT COUNT(*) as laporan_urgent FROM laporan_kesehatan WHERE tingkat_urgency='urgent';

-- Total booking
SELECT COUNT(*) as total_booking FROM booking_puskesmas;

-- Booking per status
SELECT status, COUNT(*) as jumlah FROM booking_puskesmas GROUP BY status;

-- ============================================================
-- 4. RECENT DATA (Last 10)
-- ============================================================

-- 10 laporan terakhir
SELECT 
    id, lokasi, deskripsi, kategori, tingkat_urgency, 
    status, created_at
FROM laporan_kesehatan 
ORDER BY created_at DESC 
LIMIT 10;

-- 5 booking terakhir
SELECT 
    id, nama, no_telepon, tanggal, jam, layanan, status, created_at
FROM booking_puskesmas 
ORDER BY created_at DESC 
LIMIT 5;

-- ============================================================
-- 5. SEARCH QUERIES
-- ============================================================

-- Cari laporan berdasarkan lokasi
SELECT * FROM laporan_kesehatan 
WHERE lokasi LIKE '%cihampelas%' 
ORDER BY created_at DESC;

-- Cari urgent reports
SELECT * FROM laporan_kesehatan 
WHERE tingkat_urgency = 'urgent' 
ORDER BY created_at DESC;

-- Cari booking yang belum dikonfirmasi
SELECT * FROM booking_puskesmas 
WHERE status = 'pending' 
ORDER BY tanggal ASC;

-- ============================================================
-- 6. REPORTS BY DATE
-- ============================================================

-- Laporan hari ini
SELECT * FROM laporan_kesehatan 
WHERE DATE(created_at) = CURDATE();

-- Laporan minggu ini
SELECT * FROM laporan_kesehatan 
WHERE WEEK(created_at) = WEEK(CURDATE())
AND YEAR(created_at) = YEAR(CURDATE());

-- Laporan bulan ini
SELECT * FROM laporan_kesehatan 
WHERE MONTH(created_at) = MONTH(CURDATE())
AND YEAR(created_at) = YEAR(CURDATE());

-- ============================================================
-- 7. DELETE OPERATIONS (Hati-hati!)
-- ============================================================

-- Hapus semua laporan (BACKUP DULU!)
-- DELETE FROM laporan_kesehatan;

-- Hapus semua booking
-- DELETE FROM booking_puskesmas;

-- Hapus laporan tertentu
-- DELETE FROM laporan_kesehatan WHERE id = 1;

-- ============================================================
-- 8. UPDATE OPERATIONS
-- ============================================================

-- Update status laporan
-- UPDATE laporan_kesehatan 
-- SET status = 'diproses' 
-- WHERE id = 1;

-- Update multiple records
-- UPDATE laporan_kesehatan 
-- SET status = 'selesai' 
-- WHERE tingkat_urgency = 'normal' AND status = 'pending';

-- ============================================================
-- 9. BACKUP & MAINTENANCE
-- ============================================================

-- Check database size
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.TABLES 
WHERE table_schema = 'lapor_kesehatan'
ORDER BY (data_length + index_length) DESC;

-- ============================================================
-- END OF SCRIPT
-- ============================================================
