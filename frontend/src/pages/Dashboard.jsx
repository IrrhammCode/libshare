// Author: Irham Muhammad Hamzah
// Program: Arsitektur Komputasi Awan - Tugas 11

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { BookOpen, Users, Clock, Users2 } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function Dashboard({ activePage = 'dashboard', setActivePage }) {
  const [stats, setStats] = useState({ books: 24, members: 12, activeLoans: 5 });
  const [recentLoans, setRecentLoans] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [booksRes, membersRes, loansRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/books`),
        fetch(`${API_BASE_URL}/api/members`),
        fetch(`${API_BASE_URL}/api/loans`)
      ]);

      if (booksRes.ok && membersRes.ok && loansRes.ok) {
        const booksData = await booksRes.json();
        const membersData = await membersRes.json();
        const loansData = await loansRes.json();

        // Calculate dynamic stats
        const active = loansData.filter(loan => loan.status === 'On Loan').length;
        setStats({
          books: booksData.length,
          members: membersData.length,
          activeLoans: active
        });

        // Match loan book/member IDs to display Titles and Names like the slide
        const formattedLoans = loansData.slice(0, 3).map(loan => {
          const book = booksData.find(b => b.id === loan.book_id);
          const member = membersData.find(m => m.id === loan.member_id);
          return {
            ...loan,
            bookTitle: book ? book.title : loan.book_id,
            memberName: member ? member.name : loan.member_id
          };
        });

        setRecentLoans(formattedLoans);
      }
    } catch (err) {
      console.error("API error, falling back to exact slide mock data:", err);
      // Hardcoded slide fallback if Go server isn't running yet
      setStats({ books: 24, members: 12, activeLoans: 5 });
      setRecentLoans([
        { id: "L001", bookTitle: "Clean Code", memberName: "Irham", loan_date: "01 Mei 2024", status: "On Loan" },
        { id: "L002", bookTitle: "The Pragmatic", memberName: "Naufal", loan_date: "28 Apr 2024", status: "Returned" },
        { id: "L003", bookTitle: "Design Patterns", memberName: "Samuel", loan_date: "25 Apr 2024", status: "Overdue" }
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] p-8 text-[#F8FAFC]">
      {/* Top Navbar */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Slide Stat Cards Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Total Books Card */}
        <div 
          onClick={() => setActivePage && setActivePage('books')}
          className="bg-[#1E1E1E] p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-all flex items-center gap-6 cursor-pointer"
        >
          <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-md">
            <BookOpen className="w-7 h-7 text-[#1E3A5F]" />
          </div>
          <div>
            <span className="text-4xl font-extrabold tracking-tight text-white">{stats.books}</span>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Total Books</p>
          </div>
        </div>

        {/* Members Card */}
        <div 
          onClick={() => setActivePage && setActivePage('members')}
          className="bg-[#1E1E1E] p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-all flex items-center gap-6 cursor-pointer"
        >
          <div className="w-14 h-14 rounded-xl bg-[#FDF4E7] flex items-center justify-center shadow-md">
            <Users className="w-7 h-7 text-[#D97706]" />
          </div>
          <div>
            <span className="text-4xl font-extrabold tracking-tight text-white">{stats.members}</span>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Members</p>
          </div>
        </div>

        {/* Active Loans Card */}
        <div 
          onClick={() => setActivePage && setActivePage('loans')}
          className="bg-[#1E1E1E] p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-all flex items-center gap-6 cursor-pointer"
        >
          <div className="w-14 h-14 rounded-xl bg-[#EEFDF5] flex items-center justify-center shadow-md">
            <Clock className="w-7 h-7 text-[#10B981]" />
          </div>
          <div>
            <span className="text-4xl font-extrabold tracking-tight text-white">{stats.activeLoans}</span>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Active Loans</p>
          </div>
        </div>

      </div>

      {/* Profile Kelompok Banner */}
      <div
        onClick={() => setActivePage && setActivePage('profile')}
        className="mb-8 bg-[#1E3A5F] hover:bg-[#1E3A5F]/80 border border-[#1E3A5F]/60 hover:border-[#F59E0B]/40 rounded-xl p-5 flex items-center gap-5 cursor-pointer transition-all duration-300 group shadow-lg"
      >
        <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/20 border border-[#F59E0B]/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Users2 className="w-6 h-6 text-[#F59E0B]" />
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-white tracking-tight">Profil Kelompok</h3>
          <p className="text-xs text-[#F8FAFC]/50 font-medium mt-0.5">4 anggota &mdash; Arsitektur Komputasi Awan, Tugas 11</p>
        </div>
        <div className="ml-auto">
          <span className="text-[10px] font-black uppercase tracking-widest bg-[#F59E0B]/20 border border-[#F59E0B]/30 text-[#F59E0B] px-3 py-1 rounded-full group-hover:bg-[#F59E0B]/30 transition-colors">
            Lihat →
          </span>
        </div>
      </div>
      <div className="bg-[#1E1E1E] p-6 rounded-xl border border-gray-800 shadow-xl">
        <h2 className="text-lg font-extrabold mb-5 tracking-tight text-white">Recent Loans</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-xs font-bold uppercase tracking-wider">
                <th className="pb-4">Book</th>
                <th className="pb-4">Members</th>
                <th className="pb-4">Date</th>
                <th className="pb-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {recentLoans.map((loan) => (
                <tr key={loan.id} className="text-sm hover:bg-[#252525]/30 transition-colors">
                  <td className="py-4 font-bold text-white">{loan.bookTitle}</td>
                  <td className="py-4 text-gray-300 font-bold">{loan.memberName}</td>
                  <td className="py-4 text-gray-400 font-medium">{loan.loan_date}</td>
                  <td className="py-4">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                      loan.status === 'On Loan' 
                        ? 'bg-[#EBF5FF] text-[#1E3A5F] border border-blue-200' 
                        : loan.status === 'Returned'
                        ? 'bg-[#E6F4EA] text-[#137333] border border-green-200'
                        : 'bg-[#FCE8E6] text-[#C5221F] border border-rose-200'
                    }`}>
                      {loan.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentLoans.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500 text-xs">Belum ada data peminjaman.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
