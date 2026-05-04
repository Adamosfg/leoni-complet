/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { useDashboard } from '../context/DashboardContext';
import { motion } from 'motion/react';
import { Menu, LogOut } from 'lucide-react';

export default function TopBar() {
  const { filter, setFilter, user, logout, setSidebarOpen, isSidebarOpen } = useDashboard();
  const [time, setTime] = useState(new Date());
  const [syncSeconds, setSyncSeconds] = useState(0);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const syncTimer = setInterval(() => {
      setSyncSeconds((prev) => (prev >= 30 ? 0 : prev + 1));
    }, 1000);
    return () => {
      clearInterval(timer);
      clearInterval(syncTimer);
    };
  }, []);

  useEffect(() => {
    if (!isUserMenuOpen) return;
    const close = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [isUserMenuOpen]);

  const getShift = () => {
    const hour = time.getHours();
    if (hour >= 6 && hour < 14) return 'Shift 1 / 06:00–14:00';
    if (hour >= 14 && hour < 22) return 'Shift 2 / 14:00–22:00';
    return 'Shift 3 / 22:00–06:00';
  };

  return (
    <header
      className={`fixed top-0 right-0 h-[64px] z-50 flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-card)]/85 px-6 shadow-sm backdrop-blur-md transition-all duration-300 ${
        isSidebarOpen ? 'left-[280px]' : 'left-0'
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className={`rounded-lg p-2 transition-colors ${
            isSidebarOpen ? 'bg-slate-100 text-[var(--volvo-blue)]' : 'text-slate-500 hover:bg-slate-50'
          }`}
          aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Open sidebar'}
        >
          <Menu size={20} />
        </button>
        <div className="ml-2 flex items-center gap-1.5">
          <span className="text-xl font-black tracking-tighter text-[var(--volvo-blue)]">LEONI</span>
          <div className="h-1.5 w-1.5 rounded-full bg-[var(--leoni-amber)]" />
          <span className="text-xl font-black tracking-tighter text-[var(--text-primary)]">VOLVO</span>
        </div>
      </div>

      <div className="hidden items-center gap-6 md:flex">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[13px] text-slate-500">{format(time, 'HH:mm:ss')}</span>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--volvo-blue)]">
              {getShift()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 border-l border-[var(--border)] pl-6">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-1.5 w-1.5 rounded-full bg-emerald-500"
          />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Live</span>
          <span className="text-[10px] text-[var(--text-muted)] tabular-nums">
            · {syncSeconds}s
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
          {(['Day', 'Month'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setFilter(mode)}
              className={`rounded-md px-3 py-1 text-[11px] font-bold transition-all duration-200 ${
                filter === mode
                  ? 'bg-[var(--volvo-blue)] text-white shadow-md'
                  : 'text-slate-500 hover:text-[var(--volvo-blue)]'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 rounded-lg border border-transparent p-1.5 transition-colors hover:border-[var(--border)] hover:bg-[var(--bg-hover)]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--volvo-blue)] text-[11px] font-bold text-white">
              {user?.name.charAt(0)}
            </div>
            <div className="hidden flex-col items-start leading-none lg:flex">
              <span className="text-[11px] font-bold text-[var(--text-primary)]">{user?.name}</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                {user?.role}
              </span>
            </div>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 top-full z-[100] mt-2 w-48 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-1 shadow-2xl">
              <div className="mb-1 border-b border-[var(--border)] px-3 py-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Account</p>
                <p className="truncate text-xs text-[var(--text-primary)]">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsUserMenuOpen(false);
                  logout();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
