/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShieldCheck } from 'lucide-react';
import CardShell from '../shared/CardShell';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { motion } from 'motion/react';
import { useDashboard } from '../../context/DashboardContext';

export default function QualityCalendarCard({ number }: { number?: number }) {
  const { productionData } = useDashboard();
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Mock data for previous days, real data for today
  const statusData = days.map(day => {
    if (isSameDay(day, today)) {
      return { date: day, status: productionData.qualityStatus === 'OK' ? 'green' : 'red' };
    }
    // Deterministic mock data based on date to avoid flickering
    const seed = day.getDate() + day.getMonth();
    return {
      date: day,
      status: (seed % 7 === 0) ? 'red' : 'green'
    };
  });

  return (
    <CardShell title="Quality Calendar" icon={<ShieldCheck size={14} />} number={number}>
      <div className="flex flex-col md:flex-row items-center gap-4 flex-1 overflow-hidden">
        {/* Huge Q */}
        <div className="relative flex-shrink-0 scale-90 md:scale-100">
          <span className="text-[100px] md:text-[120px] font-black text-[#1B4299]/5 leading-none select-none">Q</span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-xl md:text-2xl font-black text-slate-900">{format(today, 'MMM')}</p>
              <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">{format(today, 'yyyy')}</p>
            </div>
          </div>
        </div>

        {/* Calendar Grid Container */}
        <div className="flex-1 w-full h-full overflow-hidden relative cursor-ns-resize group">
          <motion.div 
            drag="y"
            dragConstraints={{ top: -120, bottom: 0 }}
            className="grid grid-cols-7 gap-1.5 p-1"
          >
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div key={index} className="text-[8px] font-black text-center text-slate-300 pb-1 sticky top-0 bg-white z-20">{day}</div>
            ))}
            {days.map((day, i) => {
              const status = statusData[i].status;
              const isToday = isSameDay(day, today);
              
              return (
                <div 
                  key={i} 
                  className={`aspect-square rounded-[8px] flex items-center justify-center text-[10px] font-black transition-all
                    ${status === 'green' ? 'bg-[#16a34a]/10 text-[#16a34a] border border-[#16a34a]/5' : 'bg-[#dc2626]/10 text-[#dc2626] border border-[#dc2626]/5'}
                    ${isToday ? 'ring-2 ring-[#1B4299] ring-offset-2 ring-offset-white scale-110 z-10' : ''}
                  `}
                >
                  {format(day, 'd')}
                </div>
              );
            })}
          </motion.div>
          
          {/* Legend - Fixed at bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-6 pb-1 flex items-center gap-4 z-30">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#16a34a] shadow-sm" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">OK</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#dc2626] shadow-sm" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Defect</span>
            </div>
          </div>
        </div>
      </div>
    </CardShell>
  );
}
