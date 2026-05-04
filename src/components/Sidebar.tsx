/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useDashboard, Page } from '../context/DashboardContext';
import { getUserRole } from '../api';
import ExcelUploader from './shared/ExcelUploader';
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Database,
  ShieldAlert,
  Lightbulb,
  Users,
  LogOut,
  Sparkles,
  ClipboardCheck,
  ChevronRight,
  Zap,
  Clock,
  Recycle,
  UserCog,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Sidebar() {
  const { user, logout, isSidebarOpen, setSidebarOpen, activePage, setActivePage } = useDashboard();

  if (!user) return null;

  const menuItems: { id: Page; label: string; icon: LucideIcon }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'data', label: 'Data Entry', icon: Database },
    { id: 'quality', label: 'Quality Log', icon: ShieldAlert },
    { id: 'kaizen', label: 'Kaizen Board', icon: Lightbulb },
    { id: 'schedule', label: 'Shift Schedule', icon: Users },
    { id: 'satisfaction', label: 'Satisfaction', icon: Sparkles },
    { id: 'fives', label: '5S Dashboard', icon: ClipboardCheck },
    { id: 'efficiency', label: 'Efficiency', icon: Zap },
    { id: 'produced-hours', label: 'Produced Hours', icon: Clock },
    { id: 'scrap', label: 'Scrap Analysis', icon: Recycle },
    ...(getUserRole() === 'hacker' ? [{ id: 'admin' as const, label: 'User admin', icon: UserCog }] : []),
  ];

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          exit={{ x: -280 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="fixed top-0 left-0 h-full w-[280px] bg-white border-r border-slate-200 z-[60] flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="h-[64px] flex items-center px-6 border-b border-[var(--border)] bg-white/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[var(--volvo-blue)] to-blue-700 rounded-lg flex items-center justify-center shadow-md shadow-blue-900/20">
                <LayoutDashboard size={16} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[var(--text-primary)] font-black text-sm tracking-tight uppercase leading-none">Leoni</span>
                <span className="text-[var(--volvo-blue)] font-bold text-[10px] tracking-widest uppercase leading-tight mt-0.5">Volvo MEP1</span>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-6 border-b border-[var(--border)] bg-white/30">
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-100 to-slate-200 border border-[var(--border)] flex items-center justify-center text-[var(--volvo-blue)] font-bold shadow-inner">
                {user.name.charAt(0)}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-[var(--text-primary)] text-sm font-bold truncate">{user.name}</span>
                <span className="text-[var(--volvo-blue)] text-[10px] uppercase font-black tracking-wider">{user.role}</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center justify-between px-3 py-3.5 rounded-xl transition-all duration-300 group ${
                  activePage === item.id 
                    ? 'bg-[#1B4299] text-white shadow-xl shadow-[#1B4299]/30 ring-2 ring-[#1B4299]/20' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-[#1B4299]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <item.icon size={20} className={activePage === item.id ? 'text-white' : 'text-slate-400 group-hover:text-[#1B4299]'} />
                  <span className="text-[15px] font-black tracking-tight">{item.label}</span>
                </div>
                {activePage === item.id && <ChevronRight size={16} />}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-[var(--border)] flex flex-col gap-2 bg-white/30">
            <ExcelUploader />
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#ef4444] hover:bg-[#ef4444]/10 transition-all duration-200"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
