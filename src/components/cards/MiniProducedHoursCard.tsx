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
import { Clock, ChevronRight } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { HRS_DATA, HRS_TARGET } from '../../constants/productionData';

export default function MiniProducedHoursCard() {
  const { setActivePage } = useDashboard();
  
  const monthNames = Object.keys(HRS_DATA);
  const latestMonth = monthNames[monthNames.length - 1];
  const monthData = HRS_DATA[latestMonth];
  const weeks = monthData.weeks;

  const chartData = useMemo(() => {
    return weeks.map((week, idx) => {
      // Average across segments for that week
      const segments = Object.values(monthData.segments);
      const weekAvg = segments.reduce((sum, segVals) => sum + (segVals[idx] || 0), 0) / (segments.length || 1);
      return {
        name: week,
        value: weekAvg
      };
    });
  }, [weeks, monthData]);

  return (
    <motion.div 
      onClick={() => setActivePage('produced-hours')}
      whileHover={{ y: -4, shadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
      className="h-full bg-white rounded-3xl border border-slate-200 p-5 flex flex-col shadow-sm cursor-pointer group transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#3B6D11]/10 rounded-lg group-hover:bg-[#3B6D11] group-hover:text-white transition-colors text-[#3B6D11]">
            <Clock size={16} />
          </div>
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">Produced Hours</h3>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black text-[#3B6D11] uppercase tracking-widest bg-[#3B6D11]/5 px-2 py-0.5 rounded-full">
          {latestMonth}
          <ChevronRight size={12} />
        </div>
      </div>

      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
            <XAxis dataKey="name" hide />
            <YAxis domain={[0, 200]} hide />
            <ReferenceLine y={HRS_TARGET} stroke="#BA7517" strokeDasharray="3 3" strokeWidth={1} />
            <Bar dataKey="value" radius={[2, 2, 0, 0]} isAnimationActive={false}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.value < HRS_TARGET ? '#E24B4A' : '#3B6D11'} />
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
                        <span className="text-[#3B6D11]">Value:</span>
                        <span>{payload[0].value?.toFixed(1)}h</span>
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
          <div className="w-1.5 h-1.5 rounded-full bg-[#3B6D11]" />
          <span className="text-[10px] font-black text-slate-900">{monthData.avg}h</span>
          <span className="text-[8px] font-black text-slate-400 uppercase">AVG</span>
        </div>
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-[#3B6D11] transition-colors">
          View Trends
        </span>
      </div>
    </motion.div>
  );
}
