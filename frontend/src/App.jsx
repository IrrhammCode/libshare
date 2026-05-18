// Author: Irham Muhammad Hamzah
// Program: Arsitektur Komputasi Awan - Tugas 11

import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Members from './pages/Members';
import Loans from './pages/Loans';
import GroupProfile from './pages/GroupProfile';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard activePage={activePage} setActivePage={setActivePage} />;
      case 'books':
        return <Books activePage={activePage} setActivePage={setActivePage} />;
      case 'members':
        return <Members activePage={activePage} setActivePage={setActivePage} />;
      case 'loans':
        return <Loans activePage={activePage} setActivePage={setActivePage} />;
      case 'profile':
        return <GroupProfile activePage={activePage} setActivePage={setActivePage} />;
      default:
        return <Dashboard activePage={activePage} setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] selection:bg-[#F59E0B] selection:text-[#0F172A] font-sans antialiased">
      {renderActivePage()}
    </div>
  );
}
