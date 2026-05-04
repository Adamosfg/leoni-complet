/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  ReferenceLine,
  Tooltip,
  Cell
} from 'recharts';
import { Recycle, ChevronRight } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { SCRAP_TARGET } from '../../constants/productionData';
import { useScrapData } from '../../hooks/useScrapData';

export default function MiniScrapCard() {
  const { setActivePage } = useDashboard();
  const scrapData = useScrapData();
  
  const monthNames = Object.keys(scrapData);
  const latestMonth = monthNames[monthNames.length - 1];
  const monthData = scrapData[latestMonth];
  const weeks = monthData.weeks;

  const chartData = useMemo(() => {
    return weeks.map((week, idx) => {
      // Average across segments for that week
      const segments = Object.values(monthData.segments) as number[][];
      const weekAvg = segments.reduce((sum: number, segVals: number[]) => sum + (segVals[idx] || 0), 0) / (segments.length || 1);
      return {
        name: week,
        value: weekAvg
      };
    });
  }, [weeks, monthData]);

  return (
    <motion.div 
      onClick={() => setActivePage('scrap')}
      className="glass p-5 flex flex-col cursor-pointer group h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[var(--leoni-amber)]/10 rounded-lg group-hover:bg-[var(--leoni-amber)] group-hover:text-white transition-colors text-[var(--leoni-amber)]">
            <Recycle size={16} />
          </div>
          <h3 className="text-xs font-black text-[var(--text-primary)] uppercase tracking-tight">Scrap Rate (%)</h3>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black text-[var(--leoni-amber)] uppercase tracking-widest bg-[var(--leoni-amber)]/10 px-2 py-0.5 rounded-full">
          {latestMonth}
          <ChevronRight size={12} />
        </div>
      </div>

      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
            <XAxis dataKey="name" hide />
            <YAxis domain={[0, 5]} hide />
            <ReferenceLine y={SCRAP_TARGET} stroke="var(--warning)" strokeDasharray="3 3" strokeWidth={1.5} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={1000}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.value > SCRAP_TARGET ? 'var(--danger)' : 'var(--success)'} />
              ))}
            </Bar>
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white border border-slate-100 p-2 rounded-lg shadow-xl text-[10px] font-bold">
                      <p className="text-slate-400 mb-1">{payload[0].payload.name}</p>
                      <div className="flex justify-between gap-4">
                        <span className="text-orange-600">Value:</span>
                        <span>{payload[0].value?.toFixed(2)}%</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-600" />
          <span className="text-[10px] font-black text-slate-900">{monthData.avg.toFixed(1)}%</span>
          <span className="text-[8px] font-black text-slate-400 uppercase">AVG</span>
        </div>
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-orange-600 transition-colors">
          View Trends
        </span>
      </div>
    </motion.div>
  );
}
