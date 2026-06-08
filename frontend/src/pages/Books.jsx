// Author: Irham Muhammad Hamzah
// Program: Arsitektur Komputasi Awan - Tugas 11

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Book, LayoutGrid, List, Plus } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function Books({ activePage = 'books', setActivePage }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Form/Modal States
  const [form, setForm] = useState({ id: '', title: '', author: '', status: 'Available' });
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/books`);
      if (!res.ok) throw new Error('API server offline');
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error(err);
      showNotification('Using offline database fallback.', 'warning');
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
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setForm({ id: `B00${books.length + 1}`, title: '', author: '', status: 'Available' });
    setShowModal(true);
  };

  const handleOpenEdit = (book) => {
    setIsEdit(true);
    setForm(book);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book from shelf catalog?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/books/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete book');
      showNotification('Book entry deleted.');
      fetchBooks();
    } catch (err) {
      console.error(err);
      setBooks(prev => prev.filter(b => b.id !== id));
      showNotification('Demo Mode: Deleted book locally.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.id || !form.title || !form.author) {
      showNotification('Please fill all fields', 'error');
      return;
    }

    try {
      const url = isEdit ? `${API_BASE_URL}/api/books/${form.id}` : `${API_BASE_URL}/api/books`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error('API failed');
      showNotification(isEdit ? 'Book updated!' : 'Book cataloged successfully!');
      setShowModal(false);
      fetchBooks();
    } catch (err) {
      console.error(err);
      if (isEdit) {
        setBooks(prev => prev.map(b => b.id === form.id ? form : b));
        showNotification('Demo Mode: Book updated locally.');
      } else {
        setBooks(prev => [...prev, form]);
        showNotification('Demo Mode: Book added locally.');
      }
      setShowModal(false);
    }
  };

  // Helper to match colors exactly like your slide
  const getCoverStyles = (title) => {
    const t = title.toLowerCase();
    if (t.includes('clean code')) return { bg: 'bg-[#BFDBFE]', icon: 'text-[#1E3A5F]' }; // light blue
    if (t.includes('patterns')) return { bg: 'bg-[#BBF7D0]', icon: 'text-[#14532D]' }; // light green
    if (t.includes('pragmatic')) return { bg: 'bg-[#FDE68A]', icon: 'text-[#78350F]' }; // light yellow
    if (t.includes('ddd') || t.includes('domain')) return { bg: 'bg-[#FBCFE8]', icon: 'text-[#831843]' }; // light pink
    return { bg: 'bg-[#E9D5FF]', icon: 'text-[#581C87]' }; // default purple
  };

  return (
    <div className="min-h-screen bg-[#000000] p-8 text-[#F8FAFC]">
      {/* Top Navbar */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {notification && (
        <div className="p-4 rounded-xl bg-gray-800 text-xs font-bold flex items-center justify-between mb-6 shadow-md border border-gray-700 max-w-4xl mx-auto">
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="hover:underline text-amber-500 uppercase">Dismiss</button>
        </div>
      )}

      {/* Main Layout containing vertical Switcher + Content Panel */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        
        {/* Left Vertical View Switcher Panel matching your slide */}
        <div className="flex md:flex-col gap-3 justify-center md:justify-start">
          <button
            onClick={() => setViewMode('grid')}
            className={`w-20 h-20 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all font-bold text-[10px] uppercase select-none ${
              viewMode === 'grid'
                ? 'bg-[#EBF5FF] text-[#1E3A5F] border border-blue-200'
                : 'bg-[#1E1E1E] text-gray-400 border border-gray-800 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-6 h-6" />
            <span>Grid</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`w-20 h-20 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all font-bold text-[10px] uppercase select-none ${
              viewMode === 'list'
                ? 'bg-[#EBF5FF] text-[#1E3A5F] border border-blue-200'
                : 'bg-[#1E1E1E] text-gray-400 border border-gray-800 hover:text-white'
            }`}
          >
            <List className="w-6 h-6" />
            <span>List</span>
          </button>
        </div>

        {/* Right Content Panel */}
        <div className="flex-1">
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-black tracking-wider uppercase text-white select-none">All Books</h2>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-[#1E1E1E] hover:bg-gray-800 text-white font-bold text-xs uppercase rounded-lg border border-gray-700 tracking-wider flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Book
            </button>
          </div>

          {loading ? (
            <div className="text-center py-10 text-xs text-gray-500 uppercase tracking-widest animate-pulse">Loading Inventory...</div>
          ) : viewMode === 'grid' ? (
            
            /* --- GRID VIEW matching Screenshot 2 --- */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {books.map((book) => {
                const colors = getCoverStyles(book.title);
                return (
                  <div key={book.id} className="bg-[#1E1E1E] p-4 rounded-2xl border border-gray-800 flex flex-col justify-between shadow-md relative group hover:border-gray-700 transition-all">
                    
                    {/* Square Cover Cover */}
                    <div className={`w-full aspect-square rounded-xl ${colors.bg} flex items-center justify-center mb-4 relative shadow-inner`}>
                      <Book className={`w-12 h-12 ${colors.icon}`} />
                    </div>

                    <div className="text-center space-y-1 mb-4">
                      <h3 className="font-extrabold text-sm text-white line-clamp-1">{book.title}</h3>
                      <p className="text-xs text-gray-400 font-bold">{book.author}</p>
                      
                      <div className="pt-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          book.status === 'Available'
                            ? 'bg-[#E6F4EA] text-[#137333] border border-green-200'
                            : 'bg-[#EBF5FF] text-[#1E3A5F] border border-blue-200'
                        }`}>
                          {book.status}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons matching edit and del slides */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenEdit(book)}
                        className="flex-1 py-1.5 text-center bg-[#2D2D2D] hover:bg-[#3D3D3D] text-white border border-gray-800 rounded-lg text-xs font-bold transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="flex-1 py-1.5 text-center bg-[#2D2D2D] hover:bg-rose-950/40 hover:text-rose-400 hover:border-rose-900 border border-gray-800 rounded-lg text-xs font-bold transition-all"
                      >
                        Del
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          ) : (

            /* --- LIST VIEW matching Screenshot 3 --- */
            <div className="space-y-3">
              {books.map((book) => {
                const colors = getCoverStyles(book.title);
                return (
                  <div key={book.id} className="bg-[#1E1E1E] p-4 rounded-xl border border-gray-800 flex items-center justify-between shadow-md hover:border-gray-700 transition-all gap-4">
                    
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Mini cover square */}
                      <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
                        <Book className={`w-5 h-5 ${colors.icon}`} />
                      </div>
                      
                      {/* Title & Author */}
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-sm text-white truncate">{book.title}</h4>
                        <p className="text-xs text-gray-400 font-bold truncate">{book.author}</p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        book.status === 'Available'
                          ? 'bg-[#E6F4EA] text-[#137333] border border-green-200'
                          : 'bg-[#EBF5FF] text-[#1E3A5F] border border-blue-200'
                      }`}>
                        {book.status}
                      </span>
                    </div>

                    {/* Edit/Delete Actions */}
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleOpenEdit(book)}
                        className="px-4 py-1.5 bg-[#2D2D2D] hover:bg-[#3D3D3D] text-white border border-gray-800 rounded-lg text-xs font-bold transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="px-4 py-1.5 bg-[#2D2D2D] hover:bg-rose-950/40 hover:text-rose-400 hover:border-rose-900 border border-gray-800 rounded-lg text-xs font-bold transition-all"
                      >
                        Del
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          )}
        </div>

      </div>

      {/* Reusable modal for catalog add / edits */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#1E1E1E] rounded-xl border border-gray-800 shadow-2xl relative overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#1E3A5F]">
              <h3 className="font-extrabold text-[#F8FAFC] text-xs uppercase tracking-widest">
                {isEdit ? 'Update Shelf Book' : 'Catalog New Book'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white font-bold text-lg">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Book ID Code</label>
                <input 
                  type="text"
                  required
                  disabled={isEdit}
                  value={form.id}
                  onChange={(e) => setForm({...form, id: e.target.value})}
                  placeholder="e.g. B025"
                  className="w-full px-4 py-2 bg-black border border-gray-800 text-[#F8FAFC] focus:border-blue-500 outline-none text-xs rounded-lg disabled:opacity-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Book Title</label>
                <input 
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  placeholder="e.g. Clean Architecture"
                  className="w-full px-4 py-2 bg-black border border-gray-800 text-[#F8FAFC] focus:border-blue-500 outline-none text-xs rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Author</label>
                <input 
                  type="text"
                  required
                  value={form.author}
                  onChange={(e) => setForm({...form, author: e.target.value})}
                  placeholder="e.g. Robert"
                  className="w-full px-4 py-2 bg-black border border-gray-800 text-[#F8FAFC] focus:border-blue-500 outline-none text-xs rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Shelving Status</label>
                <select 
                  value={form.status}
                  onChange={(e) => setForm({...form, status: e.target.value})}
                  className="w-full px-4 py-2 bg-black border border-gray-800 text-[#F8FAFC] focus:border-blue-500 outline-none text-xs rounded-lg cursor-pointer"
                >
                  <option value="Available" className="bg-[#1E1E1E]">Available</option>
                  <option value="On Loan" className="bg-[#1E1E1E]">On Loan</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-800 flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 bg-[#2D2D2D] hover:bg-gray-800 rounded-lg text-xs font-bold text-gray-400 uppercase tracking-wider transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#1E3A5F] hover:bg-blue-800 rounded-lg text-xs font-bold text-white uppercase tracking-wider transition-all shadow-md active:scale-95"
                >
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
