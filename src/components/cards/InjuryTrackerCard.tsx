/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useDashboard } from '../../context/DashboardContext';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, AlertCircle, Activity } from 'lucide-react';
import { differenceInDays, parseISO, startOfDay, subDays } from 'date-fns';
import CardShell from '../shared/CardShell';

export default function InjuryTrackerCard({ number }: { number?: number }) {
  const { accidents, lastResetDate } = useDashboard();
  const [testOffset, setTestOffset] = useState(0);

  // Calculate counts per body part
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    accidents.forEach(acc => {
      c[acc.bodyPart] = (c[acc.bodyPart] || 0) + 1;
    });
    return c;
  }, [accidents]);

  const totalAccidents = accidents.length;

  // Calculate days without accident
  const daysWithout = useMemo(() => {
    const today = startOfDay(new Date());
    let latestBasis: Date | null = null;
    
    if (accidents.length > 0) {
      latestBasis = accidents.reduce((latest, acc) => {
        const accDate = parseISO(acc.date);
        return accDate > latest ? accDate : latest;
      }, parseISO(accidents[0].date));
    }
    
    if (lastResetDate) {
      const resetDate = parseISO(lastResetDate);
      if (!latestBasis || resetDate > latestBasis) {
        latestBasis = resetDate;
      }
    }
    
    if (!latestBasis) return 0 + testOffset;
    
    const lastEvent = startOfDay(latestBasis);
    return Math.max(0, differenceInDays(today, lastEvent)) + testOffset;
  }, [accidents, lastResetDate, testOffset]);

  const isIncidentToday = daysWithout === 0 && accidents.length > 0;

  // Risk Level Logic
  const riskLevel = useMemo(() => {
    const recentIncidents = accidents.filter(acc => {
      const accDate = parseISO(acc.date);
      return accDate > subDays(new Date(), 7);
    }).length;

    if (recentIncidents === 0) return { label: 'Low', color: '#22c55e' };
    if (recentIncidents < 3) return { label: 'Medium', color: '#f59e0b' };
    return { label: 'High', color: '#ef4444' };
  }, [accidents]);

  const getPartColor = (part: string) => {
    const count = counts[part] || 0;
    if (count === 0) return 'var(--success)';
    if (count < 3) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <CardShell 
      title="Live Safety Monitor" 
      icon={<Shield size={14} />}
      className="relative overflow-hidden"
      number={number}
    >
      <div className="flex flex-row gap-4 items-center h-full">
        {/* Left: Body Visualization */}
        <div className="relative flex-1 flex items-center justify-center h-[160px]">
          <svg viewBox="0 0 100 200" className="h-full w-auto drop-shadow-sm brightness-110">
            {/* Head */}
            <circle 
              id="head" 
              className={`${(counts['Head'] || 0) > 0 ? 'fill-[#dc2626]' : 'fill-[#16a34a]'} transition-colors duration-500`} 
              cx="50" 
              cy="20" 
              r="15" 
            />
            {/* Torso */}
            <rect 
              id="torso" 
              className={`${(counts['Torso'] || 0) > 0 ? 'fill-[#dc2626]' : 'fill-[#16a34a]'} transition-colors duration-500`} 
              x="30" 
              y="40" 
              width="40" 
              height="70" 
              rx="8" 
            />
            {/* Left Arm */}
            <rect 
              id="left-arm" 
              className={`${((counts['Left arm'] || 0) > 0 || (counts['Left hand'] || 0) > 0) ? 'fill-[#dc2626]' : 'fill-[#16a34a]'} transition-colors duration-500`} 
              x="10" 
              y="42" 
              width="15" 
              height="65" 
              rx="7.5" 
            />
            {/* Right Arm */}
            <rect 
              id="right-arm" 
              className={`${((counts['Right arm'] || 0) > 0 || (counts['Right hand'] || 0) > 0) ? 'fill-[#dc2626]' : 'fill-[#16a34a]'} transition-colors duration-500`} 
              x="75" 
              y="42" 
              width="15" 
              height="65" 
              rx="7.5" 
            />
            {/* Left Leg */}
            <rect 
              id="left-leg" 
              className={`${((counts['Left leg'] || 0) > 0 || (counts['Left foot'] || 0) > 0) ? 'fill-[#dc2626]' : 'fill-[#16a34a]'} transition-colors duration-500`} 
              x="31" 
              y="115" 
              width="18" 
              height="80" 
              rx="9" 
            />
            {/* Right Leg */}
            <rect 
              id="right-leg" 
              className={`${((counts['Right leg'] || 0) > 0 || (counts['Right foot'] || 0) > 0) ? 'fill-[#dc2626]' : 'fill-[#16a34a]'} transition-colors duration-500`} 
              x="51" 
              y="115" 
              width="18" 
              height="80" 
              rx="9" 
            />
          </svg>
        </div>

        {/* Right: Stats */}
        <div className="flex-1 flex flex-col gap-2">
          <div 
            onClick={() => setTestOffset(prev => prev + 1)}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 shadow-sm border ${isIncidentToday ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}
          >
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Safe Days</span>
            <span className={`text-3xl font-black ${isIncidentToday ? 'text-[#dc2626]' : 'text-[#16a34a]'}`}>{daysWithout}</span>
          </div>
          
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Total</span>
            <span className="text-xl font-black text-slate-900">{totalAccidents}</span>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Risk</span>
            <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: riskLevel.color === '#22c55e' ? '#16a34a' : riskLevel.color === '#f59e0b' ? '#d97706' : '#dc2626' }}>{riskLevel.label}</span>
          </div>
        </div>
      </div>
    </CardShell>
  );
}
