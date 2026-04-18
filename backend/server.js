require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

// --- TAMBAHAN AWS S3 ---
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
// -----------------------

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- KONFIGURASI AWS S3 CLIENT ---
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Setup multer untuk file upload langsung ke S3
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME,
        // acl: 'public-read', // Opsional: Buka komentar ini jika bucket kamu sudah disetting Public
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            // Nama file saat disimpan di S3
            cb(null, 'kesehatan-' + uniqueSuffix + path.extname(file.originalname));
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Database connection
let db = null;
const initDatabase = async () => {
    try {
        db = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'lapor_kesehatan',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        // Test connection
        const connection = await db.getConnection();
        console.log('✅ Database connection successful!');
        connection.release();

        // Create tables if not exist
        const createTablesQuery = `
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
        `;

        const conn = await db.getConnection();
        const queries = createTablesQuery.split(';').filter(q => q.trim());
        for (const query of queries) {
            if (query.trim()) {
                await conn.query(query);
            }
        }
        console.log('✅ Tables created/verified successfully!');
        conn.release();

    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        console.log('⚠️  Running in mock data mode...');
        db = null; // Fallback to mock data
    }
};

let laporan = []; // Kosongkan mock data untuk fokus ke database asli

// GET: Health check
app.get('/', (req, res) => {
    res.json({ 
        message: 'Backend LaporSehat Berjalan Lancar!',
        version: '1.0.0',
        mode: process.env.NODE_ENV || 'development'
    });
});

// Wrapper untuk error handling multer
const handleMulterError = (req, res, next) => {
    upload.single('foto_kondisi')(req, res, (err) => {
        if (err) {
            console.error('❌ Multer error:', err.message);
            return res.status(400).json({ error: 'Error uploading file: ' + err.message });
        }
        next();
    });
};

// POST: Buat laporan kesehatan  
app.post('/api/kesehatan', handleMulterError, async (req, res) => {
    try {
        process.stderr.write('\n📨 POST /api/kesehatan received\n');
        console.log('\n📨 Menerima request POST /api/kesehatan');
        console.log('Body:', req.body);
        console.log('File:', req.file ? `Terkirim ke S3: ${req.file.location}` : 'No file');

        const { lokasi, deskripsi, kategori = 'lingkungan', tingkat_urgency = 'normal' } = req.body;

        if (!lokasi || !deskripsi) {
            console.error('❌ Validasi gagal: lokasi atau deskripsi kosong');
            return res.status(400).json({ error: 'Lokasi dan deskripsi harus diisi!' });
        }

        // Determine foto URL dari AWS S3
        let fotoUrl = null;
        if (req.file) {
            // Di multer-s3, URL file tersimpan di properti .location
            fotoUrl = req.file.location; 
            console.log('✅ File successfully uploaded to S3:', fotoUrl);
        } else {
            fotoUrl = `https://via.placeholder.com/400x300?text=${encodeURIComponent(lokasi)}`;
            console.log('⚠️  No file uploaded, using placeholder');
        }

        const newLaporan = {
            lokasi,
            deskripsi,
            kategori,
            tingkat_urgency,
            status: 'pending',
            foto_url: fotoUrl
        };

        // Simpan ke database jika connected
        if (db) {
            try {
                const query = 'INSERT INTO laporan_kesehatan (lokasi, deskripsi, kategori, tingkat_urgency, status, foto_url) VALUES (?, ?, ?, ?, ?, ?)';
                
                const [result] = await db.execute(query, [
                    lokasi, deskripsi, kategori, tingkat_urgency, 'pending', fotoUrl
                ]);

                console.log(`✅ Laporan saved to database with ID: ${result.insertId}`);
                
                return res.status(201).json({ 
                    message: 'Laporan berhasil dikirim dan tersimpan di database!', 
                    data: {
                        id: result.insertId,
                        ...newLaporan,
                        created_at: new Date().toISOString()
                    }
                });
            } catch (dbError) {
                console.error('❌ Database error:', dbError.message);
                return res.status(500).json({ error: 'Gagal menyimpan ke database.' });
            }
        } 
    } catch (error) {
        console.error('\n❌ ERROR in POST /api/kesehatan:');
        console.error('Message:', error.message);
        res.status(500).json({ error: 'Gagal memproses laporan: ' + error.message });
    }
});

// GET: Ambil semua laporan kesehatan
app.get('/api/kesehatan', async (req, res) => {
    try {
        if (db) {
            const query = 'SELECT * FROM laporan_kesehatan ORDER BY created_at DESC LIMIT 100';
            const [rows] = await db.execute(query);
            return res.status(200).json(rows);
        }
        res.status(500).json({ error: 'Database tidak terkoneksi.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal mengambil data laporan.' });
    }
});

// Error handler untuk multer dan general errors 
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'FILE_TOO_LARGE') {
            return res.status(400).json({ error: 'File terlalu besar (max 5MB)' });
        }
        return res.status(400).json({ error: 'Error uploading file: ' + error.message });
    } else if (error) {
        return res.status(500).json({ error: 'Terjadi kesalahan pada server saat memproses laporan.' });
    }
    next();
});

const PORT = process.env.PORT || 5000;

// Initialize database and start server
(async () => {
    await initDatabase();
    
    app.listen(PORT, () => {
        console.log(`🚀 Backend LaporSehat berjalan di http://localhost:${PORT}`);
        console.log(`☁️  AWS S3 Mode Aktif - Target Bucket: ${process.env.S3_BUCKET_NAME}`);
    });
})();