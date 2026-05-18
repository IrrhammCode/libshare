// Author: Irham Muhammad Hamzah
// Program: Arsitektur Komputasi Awan - Tugas 11

import React from 'react';
import Navbar from '../components/Navbar';
import { User, Hash, Users, GraduationCap, BookOpen } from 'lucide-react';

const members = [
  {
    id: 1,
    name: 'Muhamad Andhika Mefiandi',
    nim: '103012300016',
    initials: 'MA',
    color: '#F59E0B',
    bgColor: '#FDF4E7',
  },
  {
    id: 2,
    name: 'Irham Muhammad Hamzah',
    nim: '103012330077',
    initials: 'IH',
    color: '#3B82F6',
    bgColor: '#EBF5FF',
  },
  {
    id: 3,
    name: 'Samuel Y.M. Kaunang',
    nim: '103012300247',
    initials: 'SK',
    color: '#10B981',
    bgColor: '#EEFDF5',
  },
  {
    id: 4,
    name: 'Ahmad Naufal Ramadhan',
    nim: '103012300239',
    initials: 'AN',
    color: '#A855F7',
    bgColor: '#F3E8FF',
  },
];

export default function GroupProfile({ activePage = 'profile', setActivePage }) {
  return (
    <div className="min-h-screen bg-[#000000] p-8 text-[#F8FAFC]">
      {/* Top Navbar */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Page Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-full px-4 py-1.5 mb-4">
          <Users className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[#F59E0B]">
            Profil Kelompok
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
          Kelompok LibShare
        </h1>
        <p className="text-gray-400 text-sm font-medium">
          Arsitektur Komputasi Awan &mdash; Tugas 11
        </p>
      </div>

      {/* Project Info Banner */}
      <div className="bg-[#1E3A5F] rounded-xl border border-[#1E3A5F]/60 p-5 mb-8 flex flex-col md:flex-row items-center gap-4 shadow-lg">
        <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
          <BookOpen className="w-7 h-7 text-white" />
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-lg font-extrabold text-white tracking-tight">LibShare — Library Management System</h2>
          <p className="text-[#F8FAFC]/60 text-xs font-medium mt-0.5">
            Sistem manajemen perpustakaan berbasis cloud dengan microservice architecture
          </p>
        </div>
        <div className="md:ml-auto flex items-center gap-2 bg-[#F59E0B]/20 border border-[#F59E0B]/40 rounded-lg px-4 py-2">
          <GraduationCap className="w-4 h-4 text-[#F59E0B]" />
          <span className="text-[#F59E0B] text-xs font-black uppercase tracking-wide">Telkom University</span>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {members.map((member, index) => (
          <div
            key={member.id}
            className="bg-[#1E1E1E] rounded-xl border border-gray-800 hover:border-gray-600 transition-all duration-300 overflow-hidden group hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Top accent bar */}
            <div
              className="h-1.5 w-full"
              style={{ backgroundColor: member.color }}
            />

            <div className="p-6 flex flex-col items-center text-center gap-4">
              {/* Avatar */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-black shadow-md group-hover:scale-105 transition-transform duration-300"
                style={{ backgroundColor: member.bgColor, color: member.color }}
              >
                {member.initials}
              </div>

              {/* Member number badge */}
              <div
                className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${member.color}20`,
                  color: member.color,
                  border: `1px solid ${member.color}40`,
                }}
              >
                Anggota {index + 1}
              </div>

              {/* Name */}
              <h3 className="text-sm font-extrabold text-white tracking-tight leading-tight">
                {member.name}
              </h3>

              {/* NIM */}
              <div className="flex items-center gap-1.5 bg-[#0F172A] rounded-lg px-3 py-2 w-full justify-center">
                <Hash className="w-3 h-3 text-gray-500" />
                <span className="text-gray-300 text-xs font-mono font-bold tracking-wider">
                  {member.nim}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Members Table (alternate view) */}
      <div className="bg-[#1E1E1E] rounded-xl border border-gray-800 shadow-xl overflow-hidden">
        <div className="flex items-center gap-3 p-5 border-b border-gray-800">
          <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
            <Users className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <h2 className="text-sm font-extrabold text-white tracking-tight uppercase">
            Daftar Anggota
          </h2>
          <span className="ml-auto text-[10px] font-black bg-[#1E3A5F] text-[#F8FAFC]/70 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {members.length} Anggota
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-xs font-bold uppercase tracking-wider">
                <th className="pb-4 pt-5 px-6">#</th>
                <th className="pb-4 pt-5 px-6">Nama</th>
                <th className="pb-4 pt-5 px-6">NIM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {members.map((member, index) => (
                <tr
                  key={member.id}
                  className="text-sm hover:bg-[#252525]/40 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                      style={{
                        backgroundColor: `${member.color}20`,
                        color: member.color,
                        border: `1px solid ${member.color}30`,
                      }}
                    >
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                        style={{ backgroundColor: member.bgColor, color: member.color }}
                      >
                        {member.initials}
                      </div>
                      <span className="font-bold text-white">{member.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-mono text-gray-300 font-bold text-xs bg-[#0F172A] px-3 py-1.5 rounded-lg">
                      {member.nim}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
