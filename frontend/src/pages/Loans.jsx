// Author: Irham Muhammad Hamzah
// Program: Arsitektur Komputasi Awan - Tugas 11

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { API_BASE_URL } from '../config';

export default function Loans({ activePage = 'loans', setActivePage }) {
  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Selection State
  const [selectedLoanId, setSelectedLoanId] = useState(null);

  // Form State
  const [form, setForm] = useState({ id: '', book_id: '', member_id: '', loan_date: '', due_date: '', status: 'On Loan' });
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [loansRes, booksRes, membersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/loans`),
        fetch(`${API_BASE_URL}/api/books`),
        fetch(`${API_BASE_URL}/api/members`)
      ]);

      if (loansRes.ok && booksRes.ok && membersRes.ok) {
        const loansData = await loansRes.json();
        const booksData = await booksRes.json();
        const membersData = await membersRes.json();

        setLoans(loansData);
        setBooks(booksData);
        setMembers(membersData);

        // Pre-populate dropdowns with first available choices
        const availBooks = booksData.filter(b => b.status === 'Available');
        setForm(prev => ({
          ...prev,
          id: `L00${loansData.length + 1}`,
          book_id: availBooks.length > 0 ? availBooks[0].id : '',
          member_id: membersData.length > 0 ? membersData[0].id : '',
          loan_date: new Date().toISOString().split('T')[0],
          due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }));
      }
    } catch (err) {
      console.error(err);
      showNotification('Using offline database fallback.', 'warning');
      setLoans([
        { id: "L001", book_id: "B001", member_id: "M001", loan_date: "01 Mei 2024", due_date: "18 Mei", status: "On Loan" },
        { id: "L002", book_id: "B003", member_id: "M002", loan_date: "28 Apr 2024", due_date: "12 Mei", status: "Returned" },
        { id: "L003", book_id: "B002", member_id: "M003", loan_date: "25 Apr 2024", due_date: "30 Apr", status: "Overdue" },
        { id: "L004", book_id: "B005", member_id: "M004", loan_date: "10 Mei 2024", due_date: "24 Mei", status: "On Loan" },
        { id: "L005", book_id: "B006", member_id: "M005", loan_date: "12 Mei 2024", due_date: "26 Mei", status: "On Loan" },
        { id: "L006", book_id: "B007", member_id: "M006", loan_date: "14 Mei 2024", due_date: "28 Mei", status: "On Loan" },
        { id: "L007", book_id: "B008", member_id: "M007", loan_date: "15 Mei 2024", due_date: "29 Mei", status: "On Loan" },
        { id: "L008", book_id: "B009", member_id: "M008", loan_date: "16 Mei 2024", due_date: "30 Mei", status: "Returned" },
        { id: "L009", book_id: "B010", member_id: "M009", loan_date: "17 Mei 2024", due_date: "31 Mei", status: "Returned" },
        { id: "L010", book_id: "B004", member_id: "M010", loan_date: "10 Mei 2024", due_date: "24 Mei", status: "Returned" }
      ]);
      setBooks([
        { id: "B001", title: "Clean Code", author: "Robert", status: "On Loan" },
        { id: "B002", title: "Design Patterns", author: "GoF", status: "On Loan" },
        { id: "B003", title: "The Pragmatic", author: "Hunt", status: "Available" },
        { id: "B004", title: "DDD", author: "Maria", status: "Available" },
        { id: "B005", title: "Refactoring", author: "Martin Fowler", status: "On Loan" },
        { id: "B006", title: "Introduction to Algorithms", author: "Cormen", status: "On Loan" },
        { id: "B007", title: "Clean Architecture", author: "Robert", status: "On Loan" },
        { id: "B008", title: "Compilers", author: "Aho", status: "On Loan" },
        { id: "B009", title: "Computer Networks", author: "Tanenbaum", status: "Available" },
        { id: "B010", title: "Operating Systems", author: "Silberschatz", status: "Available" }
      ]);
      setMembers([
        { id: "M001", name: "Irham", email: "irham@gmail.com", phone: "08123456789", join_date: "01 Mei 2024" },
        { id: "M002", name: "Naufal", email: "naufal@gmail.com", phone: "08129876543", join_date: "28 Apr 2024" },
        { id: "M003", name: "Samuel", email: "samuel@gmail.com", phone: "08134567890", join_date: "25 Apr 2024" },
        { id: "M004", name: "Andhika", email: "andhika@gmail.com", phone: "08145678901", join_date: "20 Apr 2024" },
        { id: "M005", name: "Budi Santoso", email: "budi.santoso@gmail.com", phone: "08156789012", join_date: "15 Feb 2024" },
        { id: "M006", name: "Siti Aminah", email: "siti.aminah@gmail.com", phone: "08167890123", join_date: "20 Mar 2024" },
        { id: "M007", name: "Joko Widodo", email: "joko.widodo@gmail.com", phone: "08178901234", join_date: "25 Apr 2024" },
        { id: "M008", name: "Dewi Lestari", email: "dewi.lestari@gmail.com", phone: "08189012345", join_date: "30 May 2024" },
        { id: "M009", name: "Wawan Setiawan", email: "wawan.setiawan@gmail.com", phone: "08190123456", join_date: "05 Jun 2024" },
        { id: "M010", name: "Rian Hidayat", email: "rian.hidayat@gmail.com", phone: "08201234567", join_date: "10 Jul 2024" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLoan = async (e) => {
    e.preventDefault();

    if (!form.book_id || !form.member_id || !form.loan_date || !form.due_date) {
      showNotification('Please fill in all transaction fields.', 'error');
      return;
    }

    const payload = {
      ...form,
      id: form.id || `L00${loans.length + 1}`
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/loans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('API request failed');
      showNotification('Loan authorized successfully!');
      fetchData();
    } catch (err) {
      console.error(err);
      setLoans(prev => [payload, ...prev]);
      setBooks(prev => prev.map(b => b.id === payload.book_id ? { ...b, status: 'On Loan' } : b));
      showNotification('Demo Mode: Borrow transaction generated locally.');
    }
  };

  const handleMarkReturned = async () => {
    if (!selectedLoanId) {
      showNotification('Please select a loan from the table first.', 'warning');
      return;
    }

    const targetLoan = loans.find(l => l.id === selectedLoanId);
    if (!targetLoan) return;

    if (targetLoan.status === 'Returned') {
      showNotification('This loan is already returned.', 'warning');
      return;
    }

    const updated = { ...targetLoan, status: 'Returned' };

    try {
      const res = await fetch(`${API_BASE_URL}/api/loans/${selectedLoanId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });

      if (!res.ok) throw new Error('API update failed');
      showNotification('Book marked returned successfully!');
      setSelectedLoanId(null);
      fetchData();
    } catch (err) {
      console.error(err);
      setLoans(prev => prev.map(l => l.id === selectedLoanId ? updated : l));
      setBooks(prev => prev.map(b => b.id === targetLoan.book_id ? { ...b, status: 'Available' } : b));
      showNotification('Demo Mode: Loan marked returned locally.');
      setSelectedLoanId(null);
    }
  };

  const handleDelete = async () => {
    if (!selectedLoanId) {
      showNotification('Please select a loan from the table first.', 'warning');
      return;
    }

    if (!window.confirm('Delete this loan from transaction registry?')) return;

    const targetLoan = loans.find(l => l.id === selectedLoanId);
    if (!targetLoan) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/loans/${selectedLoanId}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('API delete failed');
      showNotification('Loan entry deleted.');
      setSelectedLoanId(null);
      fetchData();
    } catch (err) {
      console.error(err);
      setLoans(prev => prev.filter(l => l.id !== selectedLoanId));
      if (targetLoan.status === 'On Loan') {
        setBooks(prev => prev.map(b => b.id === targetLoan.book_id ? { ...b, status: 'Available' } : b));
      }
      showNotification('Demo Mode: Loan deleted locally.');
      setSelectedLoanId(null);
    }
  };

  // Helper date formatter matching exactly your slides (e.g. 18 Mei, 12 Mei, 30 Apr)
  const formatSlideDate = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.includes('Mei') || dateStr.includes('Apr') || dateStr.includes('Jan')) return dateStr;
    
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const day = parseInt(parts[2], 10);
      const month = months[parseInt(parts[1], 10) - 1];
      return `${day} ${month}`;
    }
    return dateStr;
  };

  const getBookTitle = (bookId) => {
    const book = books.find(b => b.id === bookId);
    return book ? book.title : bookId;
  };

  const getMemberName = (memberId) => {
    const member = members.find(m => m.id === memberId);
    return member ? member.name : memberId;
  };

  return (
    <div className="min-h-screen bg-[#000000] p-8 text-[#F8FAFC]">
      {/* Top Navbar */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {notification && (
        <div className="p-4 rounded-xl bg-gray-800 text-xs font-bold flex items-center justify-between mb-6 shadow-md border border-gray-700 max-w-7xl mx-auto">
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="hover:underline text-amber-500 uppercase">Dismiss</button>
        </div>
      )}

      {/* Slide Layout containing Double Panels side-by-side */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column Panel: Form Container (Add Member) matching Screenshot 5 exactly */}
        <div className="md:col-span-4 bg-[#1E1E1E] p-6 rounded-xl border border-gray-800 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-white uppercase tracking-widest mb-6 select-none">
              Add Member
            </h2>
            
            <form onSubmit={handleCreateLoan} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Select Book</label>
                {books.filter(b => b.status === 'Available').length === 0 ? (
                  <div className="text-[10px] text-rose-400 font-bold p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                    No available books in catalog shelf.
                  </div>
                ) : (
                  <select 
                    value={form.book_id}
                    required
                    onChange={(e) => setForm({...form, book_id: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-[#F8FAFC] focus:border-blue-500 outline-none text-xs cursor-pointer"
                  >
                    {books.filter(b => b.status === 'Available').map((b) => (
                      <option key={b.id} value={b.id} className="bg-[#1E1E1E]">
                        {b.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Select Member</label>
                {members.length === 0 ? (
                  <div className="text-[10px] text-rose-400 font-bold p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                    No active members in directory database.
                  </div>
                ) : (
                  <select 
                    value={form.member_id}
                    required
                    onChange={(e) => setForm({...form, member_id: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-[#F8FAFC] focus:border-blue-500 outline-none text-xs cursor-pointer"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id} className="bg-[#1E1E1E]">
                        {m.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Loan Date</label>
                  <input 
                    type="date"
                    required
                    value={form.loan_date}
                    onChange={(e) => setForm({...form, loan_date: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-[#F8FAFC] focus:border-blue-500 outline-none text-xs cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Due Date</label>
                  <input 
                    type="date"
                    required
                    value={form.due_date}
                    onChange={(e) => setForm({...form, due_date: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-[#F8FAFC] focus:border-blue-500 outline-none text-xs cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={books.filter(b => b.status === 'Available').length === 0 || members.length === 0}
                  className="w-full py-3 rounded-lg bg-[#2D2D2D] hover:bg-[#3D3D3D] border border-gray-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Loan
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column Panel: Loan History & Active Actions matching Screenshot 5 exactly */}
        <div className="md:col-span-8 bg-[#1E1E1E] p-6 rounded-xl border border-gray-800 shadow-xl flex flex-col justify-between min-h-[450px]">
          <div>
            <h2 className="text-sm font-extrabold text-white uppercase tracking-widest mb-6 select-none">
              Loan History
            </h2>

            {loading ? (
              <div className="text-center py-10 text-xs text-gray-500 uppercase tracking-widest animate-pulse">Loading Loan Registry...</div>
            ) : (
              <div className="overflow-y-auto max-h-[300px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider font-bold">
                      <th className="pb-3">Book</th>
                      <th className="pb-3">Members</th>
                      <th className="pb-3">Due</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/40">
                    {loans.map((loan) => {
                      const isSelected = selectedLoanId === loan.id;
                      return (
                        <tr 
                          key={loan.id}
                          onClick={() => setSelectedLoanId(isSelected ? null : loan.id)}
                          className={`text-sm cursor-pointer transition-colors ${
                            isSelected 
                              ? 'bg-[#1E3A5F]/20 border-y border-[#1E3A5F]/50 text-white' 
                              : 'hover:bg-[#252525]/30 text-gray-300'
                          }`}
                        >
                          <td className="py-3.5 font-bold">{getBookTitle(loan.book_id)}</td>
                          <td className="py-3.5 font-bold">{getMemberName(loan.member_id)}</td>
                          <td className="py-3.5 font-medium">{formatSlideDate(loan.due_date)}</td>
                          <td className="py-3.5 text-right">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
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
                      );
                    })}
                    {loans.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center py-6 text-gray-500 text-xs">Belum ada data peminjaman.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Under-table Actions matching screenshot exactly */}
          <div className="pt-6 border-t border-gray-800/50 flex gap-4">
            <button
              onClick={handleMarkReturned}
              disabled={!selectedLoanId}
              className="px-6 py-2.5 bg-[#000000]/80 hover:bg-black border border-gray-700 hover:border-gray-500 disabled:opacity-30 disabled:hover:border-gray-700 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all active:scale-95"
            >
              Mark Returned
            </button>
            <button
              onClick={handleDelete}
              disabled={!selectedLoanId}
              className="px-6 py-2.5 bg-[#000000]/80 hover:bg-rose-950/20 hover:text-rose-400 hover:border-rose-900 border border-gray-700 disabled:opacity-30 disabled:hover:border-gray-700 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all active:scale-95"
            >
              Delete
            </button>
            {!selectedLoanId && (
              <span className="text-[10px] text-gray-500 self-center font-bold tracking-wider italic">
                * Click a loan row to authorize check-in / delete actions.
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
