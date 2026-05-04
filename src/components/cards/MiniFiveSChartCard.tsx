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
  Tooltip
} from 'recharts';
import { ClipboardCheck, ChevronRight } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { useFiveSData, COLORS, TARGET } from '../FiveSPage';

export default function MiniFiveSChartCard() {
  const { setActivePage } = useDashboard();
  const pageData = useFiveSData();
  
  // Get latest month data
  const monthNames = Object.keys(pageData);
  const latestMonth = monthNames[monthNames.length - 1];
  const monthData = pageData[latestMonth];

  const chartData = useMemo(() => {
    return monthData.weeks.map((week, idx) => {
      const point: any = { name: week };
      Object.keys(monthData.segments).forEach(seg => {
        point[seg] = monthData.segments[seg as keyof typeof monthData.segments][idx];
      });
      return point;
    });
  }, [monthData]);

  return (
    <motion.div 
      onClick={() => setActivePage('fives')}
      whileHover={{ y: -4, shadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
      className="h-full bg-white rounded-3xl border border-slate-200 p-5 flex flex-col shadow-sm cursor-pointer group transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#1B4299]/10 rounded-lg group-hover:bg-[#1B4299] group-hover:text-white transition-colors">
            <ClipboardCheck size={16} />
          </div>
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">5S Performance</h3>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black text-[#1B4299] uppercase tracking-widest bg-[#1B4299]/5 px-2 py-0.5 rounded-full">
          {latestMonth}
          <ChevronRight size={12} />
        </div>
      </div>

      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
            <XAxis 
              dataKey="name" 
              hide 
            />
            <YAxis 
              domain={[13, 17]} 
              hide 
            />
            <ReferenceLine 
              y={TARGET} 
              stroke="#E24B4A" 
              strokeDasharray="3 3" 
              strokeWidth={1}
            />
            {Object.keys(COLORS).map((seg) => (
              <Bar 
                key={seg} 
                dataKey={seg} 
                fill={COLORS[seg as keyof typeof COLORS]} 
                radius={[2, 2, 0, 0]}
                isAnimationActive={false}
              />
            ))}
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white border border-slate-100 p-2 rounded-lg shadow-xl text-[10px] font-bold">
                      <p className="text-slate-400 mb-1">Week {payload[0].payload.name}</p>
                      {payload.map((p: any) => (
                        <div key={p.name} className="flex justify-between gap-4">
                          <span style={{ color: p.color }}>{p.name}:</span>
                          <span>{p.value.toFixed(2)}</span>
                        </div>
                      ))}
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
        <div className="flex gap-2">
          {Object.entries(COLORS).map(([name, color]) => (
            <div key={name} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
          ))}
        </div>
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-[#1B4299] transition-colors">
          View Detailed Audit
        </span>
      </div>
    </motion.div>
  );
}
