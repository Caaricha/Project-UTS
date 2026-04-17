require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup multer untuk file upload lokal (development mode)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'kesehatan-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Serve uploads folder sebagai static files
app.use('/uploads', express.static(uploadsDir));

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

// Mock data untuk development
let mockLaporan = [
    {
        id: 1,
        lokasi: 'Jl. Ahmad Yani No. 45, Kelurahan Cihampelas',
        deskripsi: 'Genangan air kotor di depan toko sembako, kemungkinan dari saluran yang tersumbat.',
        kategori: 'lingkungan',
        tingkat_urgency: 'urgent',
        status: 'diproses',
        foto_url: 'https://via.placeholder.com/400x300?text=Genangan+Air',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 2,
        lokasi: 'Taman Impian, Jl. Gatot Subroto',
        deskripsi: 'Limbah plastik dan sampah berserak, mencemari ruang publik.',
        kategori: 'sampah',
        tingkat_urgency: 'medium',
        status: 'pending',
        foto_url: 'https://via.placeholder.com/400x300?text=Sampah+Plastik',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 3,
        lokasi: 'Sungai Cikapundung, Komplek Perumahan Merdeka',
        deskripsi: 'Air sungai berubah warna coklat, ada bau tidak sedap.',
        kategori: 'air',
        tingkat_urgency: 'urgent',
        status: 'urgent',
        foto_url: 'https://via.placeholder.com/400x300?text=Air+Tercemar',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
];

let laporan = [...mockLaporan];

// GET: Health check
app.get('/', (req, res) => {
    res.json({ 
        message: 'Backend LaporSehat Berjalan Lancar!',
        version: '1.0.0',
        mode: process.env.NODE_ENV || 'development'
    });
});

// TEST ENDPOINT - Simple POST untuk debug
app.post('/test', (req, res) => {
    res.json({ message: 'TEST endpoint works!' });
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
        console.log('File:', req.file ? `${req.file.filename} (${req.file.size} bytes)` : 'No file');

        const { lokasi, deskripsi, kategori = 'lingkungan', tingkat_urgency = 'normal' } = req.body;

        if (!lokasi || !deskripsi) {
            console.error('❌ Validasi gagal: lokasi atau deskripsi kosong');
            return res.status(400).json({ error: 'Lokasi dan deskripsi harus diisi!' });
        }

        // Determine foto URL
        let fotoUrl = null;
        if (req.file) {
            fotoUrl = `http://localhost:5000/uploads/${req.file.filename}`;
            console.log('✅ File uploaded:', fotoUrl);
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
                console.log('📝 Executing query:', query);
                console.log('📋 Data:', [lokasi, deskripsi, kategori, tingkat_urgency, 'pending', fotoUrl]);

                const [result] = await db.execute(query, [
                    lokasi, 
                    deskripsi, 
                    kategori, 
                    tingkat_urgency,
                    'pending',
                    fotoUrl
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
                console.error('Stack:', dbError.stack);
                // Fallback to mock data response
                const mockId = Math.floor(Math.random() * 10000);
                laporan.push({
                    id: mockId,
                    ...newLaporan,
                    created_at: new Date().toISOString()
                });
                
                return res.status(201).json({ 
                    message: 'Laporan berhasil dikirim! (Disimpan dalam memory)', 
                    data: {
                        id: mockId,
                        ...newLaporan,
                        created_at: new Date().toISOString()
                    }
                });
            }
        } else {
            // No database, use mock data
            console.log('⚠️  Database not connected, saving to mock data');
            const mockId = Math.floor(Math.random() * 10000);
            laporan.push({
                id: mockId,
                ...newLaporan,
                created_at: new Date().toISOString()
            });

            return res.status(201).json({ 
                message: 'Laporan berhasil dikirim! (Mode development)', 
                data: {
                    id: mockId,
                    ...newLaporan,
                    created_at: new Date().toISOString()
                }
            });
        }

    } catch (error) {
        console.error('\n❌ ERROR in POST /api/kesehatan:');
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        res.status(500).json({ error: 'Gagal memproses laporan: ' + error.message });
    }
});

// GET: Ambil semua laporan kesehatan
app.get('/api/kesehatan', async (req, res) => {
    try {
        // Try to fetch from database first
        if (db) {
            try {
                const query = 'SELECT * FROM laporan_kesehatan ORDER BY created_at DESC LIMIT 100';
                const [rows] = await db.execute(query);
                console.log(`✅ Fetched ${rows.length} laporan from database`);
                return res.status(200).json(rows);
            } catch (dbError) {
                console.log('⚠️  Database query failed, using mock data:', dbError.message);
            }
        }

        // Return mock data
        console.log(`ℹ️  Returning ${laporan.length} mock laporan`);
        res.status(200).json(laporan.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal mengambil data laporan.' });
    }
});

// GET: Ambil satu laporan berdasarkan ID
app.get('/api/kesehatan/:id', (req, res) => {
    const { id } = req.params;
    const item = laporan.find(l => l.id === parseInt(id));
    
    if (!item) {
        return res.status(404).json({ error: 'Laporan tidak ditemukan.' });
    }
    
    res.status(200).json(item);
});

// PUT: Update status laporan
app.put('/api/kesehatan/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const item = laporan.find(l => l.id === parseInt(id));
    if (!item) {
        return res.status(404).json({ error: 'Laporan tidak ditemukan.' });
    }
    
    if (status) {
        item.status = status;
    }
    
    res.status(200).json({ message: 'Laporan berhasil diperbarui!', data: item });
});

// DELETE: Hapus laporan
app.delete('/api/kesehatan/:id', (req, res) => {
    const { id } = req.params;
    const index = laporan.findIndex(l => l.id === parseInt(id));
    
    if (index === -1) {
        return res.status(404).json({ error: 'Laporan tidak ditemukan.' });
    }
    
    const deleted = laporan.splice(index, 1);
    res.status(200).json({ message: 'Laporan berhasil dihapus!', data: deleted[0] });
});

// GET: Stats dashboard
app.get('/api/stats', (req, res) => {
    const stats = {
        totalLaporan: laporan.length,
        laporanUrgent: laporan.filter(l => l.tingkat_urgency === 'urgent').length,
        laporanPending: laporan.filter(l => l.status === 'pending').length,
        laporanDiproses: laporan.filter(l => l.status === 'diproses').length,
        laporanSelesai: laporan.filter(l => l.status === 'selesai').length,
    };
    res.status(200).json(stats);
});

// Error handler untuk multer dan general errors (HARUS DI AKHIR, SETELAH SEMUA ROUTES)
app.use((error, req, res, next) => {
    process.stderr.write(`\n❌ ERROR HANDLER: ${error.message}\n`);
    console.error('\n❌ ERROR HANDLER TRIGGERED:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    
    if (error instanceof multer.MulterError) {
        console.error('❌ Multer error detected:', error.message);
        if (error.code === 'FILE_TOO_LARGE') {
            return res.status(400).json({ error: 'File terlalu besar (max 5MB)' });
        }
        return res.status(400).json({ error: 'Error uploading file: ' + error.message });
    } else if (error) {
        console.error('❌ General server error:', error.message);
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
        console.log(`📁 Uploads folder: ${uploadsDir}`);
        console.log(`📊 Mode: ${process.env.NODE_ENV || 'development'}`);
        console.log(`💾 Database: ${db ? 'Connected' : 'Not connected (using mock data)'}`);
        console.log('\n✨ API Endpoints:');
        console.log('   GET  /api/kesehatan          - Get all reports');
        console.log('   POST /api/kesehatan          - Create new report');
        console.log('   GET  /api/kesehatan/:id      - Get report by ID');
        console.log('   PUT  /api/kesehatan/:id      - Update report status');
        console.log('   GET  /api/stats              - Get dashboard stats');
    });
})();