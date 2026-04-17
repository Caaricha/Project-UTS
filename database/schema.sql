-- Hapus tabel jika sudah ada (opsional, untuk reset)
-- DROP TABLE IF EXISTS laporan_kesehatan;

-- Buat tabel laporan_kesehatan
CREATE TABLE IF NOT EXISTS laporan_kesehatan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lokasi VARCHAR(255) NOT NULL,
    deskripsi LONGTEXT NOT NULL,
    kategori VARCHAR(50) DEFAULT 'lingkungan',
    tingkat_urgency VARCHAR(20) DEFAULT 'normal',
    status VARCHAR(20) DEFAULT 'pending',
    foto_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_kategori (kategori),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Buat tabel booking_puskesmas
CREATE TABLE IF NOT EXISTS booking_puskesmas (
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_tanggal (tanggal)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert data sample jika diperlukan
INSERT INTO laporan_kesehatan (lokasi, deskripsi, kategori, tingkat_urgency, status, foto_url)
VALUES 
('Jl. Ahmad Yani No. 45, Kelurahan Cihampelas', 'Genangan air kotor di depan toko sembako, kemungkinan dari saluran yang tersumbat.', 'lingkungan', 'urgent', 'diproses', 'http://localhost:5000/uploads/sample-1.jpg'),
('Taman Impian, Jl. Gatot Subroto', 'Limbah plastik dan sampah berserak, mencemari ruang publik.', 'sampah', 'medium', 'pending', 'http://localhost:5000/uploads/sample-2.jpg'),
('Sungai Cikapundung, Komplek Perumahan Merdeka', 'Air sungai berubah warna coklat, ada bau tidak sedap.', 'air', 'urgent', 'urgent', 'http://localhost:5000/uploads/sample-3.jpg');

-- Verifikasi
SELECT * FROM laporan_kesehatan;
