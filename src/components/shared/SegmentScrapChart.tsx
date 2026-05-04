/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart3, Calendar } from 'lucide-react';
import { MonthScrapData } from '../../context/DashboardContext';

interface SegmentScrapChartProps {
  title: string;
  data: MonthScrapData[];
  icon?: React.ReactNode;
}

export default function SegmentScrapChart({ title, data, icon }: SegmentScrapChartProps) {
  const currentMonthIdx = useMemo(() => {
    const today = new Date();
    const monthName = today.toLocaleString('default', { month: 'short' });
    const idx = data.findIndex(m => m.name === monthName);
    return idx !== -1 ? idx : data.length - 1;
  }, [data]);

  const [selectedMonthIdx, setSelectedMonthIdx] = useState(currentMonthIdx);
  const selectedMonth = data[selectedMonthIdx];

  const maxMonthly = useMemo(() => Math.max(...data.map(m => m.total || 0), 1), [data]);
  const maxDaily = useMemo(() => Math.max(...(selectedMonth?.days || []), 1), [selectedMonth]);

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl flex flex-col h-full group overflow-hidden transition-all duration-500 hover:border-[#1B4299]/20 hover:shadow-2xl hover:shadow-[#1B4299]/5">
      {/* Header */}
      <div className="px-6 pt-5 pb-2 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#1B4299]/10 rounded-xl text-[#1B4299]">
            {icon}
          </div>
          <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
          <Calendar size={12} className="text-[#1B4299]" />
          <span className="text-[10px] font-black text-slate-600">{selectedMonth.name}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-4 pb-4 gap-4 min-h-0">
        {/* Daily Detail Chart (Main View) */}
        <div className="flex-1 relative mt-4 flex flex-col min-h-0">
          <div className="flex-1 flex items-end gap-[1px] px-1 relative">
            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedMonth.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute inset-0 flex items-end gap-[1px]"
              >
                {selectedMonth.days.map((val, dIdx) => (
                  <div key={dIdx} className="group/bar relative flex-1 h-full flex items-end min-w-[2px]">
                    <div className="flex-1 h-[1px] bg-slate-100 absolute bottom-0 left-0 right-0" />
                    {/* Only show bar if val > 0 */}
                    {val > 0 && (
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${(val / maxDaily) * 100}%` }}
                        transition={{ duration: 0.5, delay: dIdx * 0.005 }}
                        className="w-full bg-gradient-to-t from-[#dc2626] to-[#ef4444] rounded-t-[1px] group-hover/bar:brightness-110 transition-all relative z-10"
                      />
                    )}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all duration-200 pointer-events-none z-50">
                      <div className="bg-[#1B4299] text-white text-[9px] font-black py-1 px-2 rounded-md shadow-xl border border-white/20">
                        {val.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="pt-2 flex justify-between px-1">
             <span className="text-[8px] font-black text-slate-300">DAY 1</span>
             <span className="text-[8px] font-black text-[#dc2626]/40 uppercase tracking-[2px]">Daily Scrap Performance</span>
             <span className="text-[8px] font-black text-slate-300">DAY {selectedMonth.days.length}</span>
          </div>
        </div>

        {/* Monthly Summary Strip (Navigation) */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <BarChart3 size={12} className="text-[#1B4299]" />
              <span className="text-[10px] font-black text-[#1B4299] uppercase tracking-widest">Yearly Trend</span>
            </div>
            <div className="flex items-center gap-3">
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Avg: {Math.round(maxMonthly/2).toLocaleString()}</span>
               <span className="text-[9px] font-black text-slate-500">Selected Total: <span className="text-[#1B4299]">{selectedMonth.total?.toLocaleString() || '0'}</span></span>
            </div>
          </div>
          <div className="flex h-12 gap-1.5 items-end">
            {data.map((m, i) => (
              <button
                key={m.name}
                onClick={() => setSelectedMonthIdx(i)}
                className={`group/month relative flex-1 h-full flex flex-col justify-end transition-all duration-500 ${
                  i === selectedMonthIdx ? 'opacity-100 scale-105' : 'opacity-30 hover:opacity-100'
                }`}
              >
                <div className="flex-1 w-full rounded-t-[3px] relative overflow-hidden">
                   {m.total && m.total > 0 ? (
                     <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${(m.total / maxMonthly) * 100}%` }}
                      className={`absolute bottom-0 left-0 right-0 transition-colors duration-300 relative z-10 ${i === selectedMonthIdx ? 'bg-[#1B4299] shadow-[0_0_10px_rgba(27,66,153,0.3)]' : 'bg-[#1B4299]/40 group-hover/month:bg-[#1B4299]/60'}`}
                     />
                   ) : (
                     <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-slate-200" />
                   )}
                </div>
                <div className={`mt-1.5 transition-colors duration-300 ${i === selectedMonthIdx ? 'text-[#1B4299]' : 'text-slate-400'}`}>
                  <span className="text-[8px] font-black leading-none block transform -rotate-45 sm:rotate-0">
                    {m.name.substring(0, 3)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
