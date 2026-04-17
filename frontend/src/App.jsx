import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import LaporanKesehatan from './pages/LaporanKesehatan';
import BookingPuskesmas from './pages/BookingPuskesmas';
import DaftarLaporan from './pages/DaftarLaporan';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'laporan':
        return <LaporanKesehatan />;
      case 'booking':
        return <BookingPuskesmas />;
      case 'daftar-laporan':
        return <DaftarLaporan />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar active={activePage} setActive={setActivePage} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;