// Author: Irham Muhammad Hamzah
// Program: Arsitektur Komputasi Awan - Tugas 11

import React from 'react';

export default function Navbar({ activePage = 'dashboard', setActivePage }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'books', label: 'Books' },
    { id: 'members', label: 'Members' },
    { id: 'loans', label: 'Loans' }
  ];

  return (
    <div className="flex justify-between items-center bg-[#1E3A5F] p-4 rounded-xl shadow-lg border border-[#1E3A5F]/20 select-none mb-8">
      {/* Brand logo & portal context indicator */}
      <div className="flex items-center gap-3">
        <span className="font-extrabold text-lg tracking-wider text-[#F8FAFC]">LibShare</span>
        <span className="text-[9px] bg-[#F59E0B]/20 text-[#F59E0B] px-2 py-0.5 rounded font-black uppercase tracking-wider">
          {activePage} portal
        </span>
      </div>
      
      {/* Horizontal Nav tabs matching the rounded outlined buttons in your slide */}
      <div className="flex gap-3">
        {tabs.map((tab) => {
          const isActive = activePage === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePage && setActivePage(tab.id)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                isActive 
                  ? 'bg-[#0F172A]/80 border border-[#F8FAFC]/30 text-[#F8FAFC]' 
                  : 'bg-transparent border border-transparent text-[#F8FAFC]/70 hover:text-white hover:bg-[#0F172A]/30'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
