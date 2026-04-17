import { useState } from 'react';
import '../styles/Sidebar.css';

export default function Sidebar({ active, setActive }) {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'laporan', label: 'Lapor Kesehatan', icon: '📝' },
    { id: 'booking', label: 'Booking Puskesmas', icon: '🏥' },
    { id: 'daftar-laporan', label: 'Daftar Laporan', icon: '📋' },
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h2 className="logo">🏥 Lapor Sehat</h2>
        <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? '◀' : '▶'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${active === item.id ? 'active' : ''}`}
            onClick={() => setActive(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {isOpen && <span className="nav-label">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        {isOpen && <p>© 2026 Lapor Sehat</p>}
      </div>
    </div>
  );
}
