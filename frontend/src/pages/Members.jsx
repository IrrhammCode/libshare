// Author: Irham Muhammad Hamzah
// Program: Arsitektur Komputasi Awan - Tugas 11

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { API_BASE_URL } from '../config';

export default function Members({ activePage = 'members', setActivePage }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [form, setForm] = useState({ id: '', name: '', email: '', phone: '', join_date: '' });
  const [isEdit, setIsEdit] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/members`);
      if (!res.ok) throw new Error('API server offline');
      const data = await res.json();
      setMembers(data);
    } catch (err) {
      console.error(err);
      showNotification('Using offline database fallback.', 'warning');
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

  const resetForm = () => {
    setForm({ id: '', name: '', email: '', phone: '', join_date: '' });
    setIsEdit(false);
  };

  const handleOpenEdit = (member) => {
    setIsEdit(true);
    setForm(member);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this member registry?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/members/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('API failed');
      showNotification('Member deleted successfully.');
      resetForm();
      fetchMembers();
    } catch (err) {
      console.error(err);
      setMembers(prev => prev.filter(m => m.id !== id));
      showNotification('Demo Mode: Deleted member locally.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.join_date) {
      showNotification('Please fill in all fields.', 'error');
      return;
    }

    const memberPayload = {
      ...form,
      id: form.id || `M00${members.length + 1}`
    };

    try {
      const url = isEdit ? `${API_BASE_URL}/api/members/${memberPayload.id}` : `${API_BASE_URL}/api/members`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberPayload)
      });

      if (!res.ok) throw new Error('API failed');
      showNotification(isEdit ? 'Member updated!' : 'Member registered successfully!');
      resetForm();
      fetchMembers();
    } catch (err) {
      console.error(err);
      if (isEdit) {
        setMembers(prev => prev.map(m => m.id === memberPayload.id ? memberPayload : m));
        showNotification('Demo Mode: Updated member locally.');
      } else {
        setMembers(prev => [...prev, memberPayload]);
        showNotification('Demo Mode: Added member locally.');
      }
      resetForm();
    }
  };

  const handleExport = () => {
    // Generate CSV export for fun
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID,Name,Email,Phone,Join Date"].concat(members.map(m => `${m.id},${m.name},${m.email},${m.phone},${m.join_date}`)).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "libshare_members.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('CSV Directory exported successfully.');
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
        
        {/* Left Column Panel: Form Container (Add Member) matching Screenshot 4 */}
        <div className="md:col-span-4 bg-[#1E1E1E] p-6 rounded-xl border border-gray-800 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-white uppercase tracking-widest mb-6 select-none">
              {isEdit ? 'Edit Member' : 'Add Member'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                <input 
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  placeholder="e.g. Irham"
                  className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-[#F8FAFC] focus:border-blue-500 outline-none text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Email</label>
                <input 
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  placeholder="e.g. irham@gmail.com"
                  className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-[#F8FAFC] focus:border-blue-500 outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Phone</label>
                  <input 
                    type="text"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                    placeholder="0812..."
                    className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-[#F8FAFC] focus:border-blue-500 outline-none text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Join Date</label>
                  <input 
                    type="text"
                    required
                    value={form.join_date}
                    onChange={(e) => setForm({...form, join_date: e.target.value})}
                    placeholder="e.g. 01 Mei 2024"
                    className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-[#F8FAFC] focus:border-blue-500 outline-none text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                {isEdit && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-400 uppercase tracking-wider transition-all"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg bg-[#2D2D2D] hover:bg-[#3D3D3D] border border-gray-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
                >
                  {isEdit ? 'Save Changes' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column Panel: Member List Container matching Screenshot 4 */}
        <div className="md:col-span-8 bg-[#1E1E1E] p-6 rounded-xl border border-gray-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-extrabold text-white uppercase tracking-widest select-none">Member List</h2>
              <button
                onClick={handleExport}
                className="px-4 py-1.5 bg-[#2D2D2D] hover:bg-[#3D3D3D] text-white border border-gray-700 rounded-lg text-xs font-bold transition-all uppercase tracking-wider"
              >
                Export
              </button>
            </div>

            {loading ? (
              <div className="text-center py-10 text-xs text-gray-500 uppercase tracking-widest animate-pulse">Loading Member Directories...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider font-bold">
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/40">
                    {members.map((member) => (
                      <tr key={member.id} className="text-sm hover:bg-[#252525]/30 transition-colors">
                        <td className="py-4 font-extrabold text-white">{member.name}</td>
                        <td className="py-4 text-gray-400 font-medium">{member.email}</td>
                        <td className="py-4 text-right flex gap-2 justify-end">
                          <button
                            onClick={() => handleOpenEdit(member)}
                            className="px-4 py-1.5 bg-[#2D2D2D] hover:bg-[#3D3D3D] text-white border border-gray-800 rounded-lg text-xs font-bold transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="px-4 py-1.5 bg-[#2D2D2D] hover:bg-rose-950/40 hover:text-rose-400 hover:border-rose-900 border border-gray-800 rounded-lg text-xs font-bold transition-all"
                          >
                            Del
                          </button>
                        </td>
                      </tr>
                    ))}
                    {members.length === 0 && (
                      <tr>
                        <td colSpan="3" className="text-center py-6 text-gray-500 text-xs">Belum ada data anggota.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
