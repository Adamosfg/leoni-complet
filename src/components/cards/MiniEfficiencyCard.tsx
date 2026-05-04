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
import { Zap, ChevronRight } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

// Target efficiency is always 85%
const EFF_TARGET = 85;
// Default fallback data
const DEFAULT_EFF_DATA = [
  { line: 'CMA2', actual: 82, objective: 85 },
  { line: 'CMA3', actual: 78, objective: 85 },
  { line: 'MEP1', actual: 84, objective: 85 },
  { line: 'SPA3', actual: 81, objective: 85 },
];

export default function MiniEfficiencyCard() {
  const { setActivePage, importedData } = useDashboard();

  const chartData = useMemo(() => {
    // Find the imported efficiency file
    // Keys are filenames, e.g., "Efficience _._E1_._E1+_._E2_.Avril 2026 6009"
    const fileKey = Object.keys(importedData).find(k => k.toLowerCase().includes('efficience'));
    if (!fileKey) return DEFAULT_EFF_DATA;

    const rawImport = importedData[fileKey];
    // Find the PSA+VOLVO sheet
    const sheetName = Object.keys(rawImport).find(k => k.toLowerCase().includes('psa+volvo')) || Object.keys(rawImport)[0];
    const sheet = rawImport[sheetName];

    if (!sheet) return DEFAULT_EFF_DATA;

    const segments = [
      { id: 'cma2', label: 'CMA2' },
      { id: 'cma3', label: 'CMA3' },
      { id: 'mp1', label: 'MEP1' },
      { id: 'spa3', label: 'SPA3' }
    ];

    try {
      const parsedData = segments.map(seg => {
        // Find the row that belongs to the segment and represents efficiency
        const targetRow = sheet.find((row: any) => {
          const rowStr = JSON.stringify(row).toLowerCase();
          return rowStr.includes(`assemblage`) && 
                 (rowStr.includes(seg.id) || (seg.id === 'mp1' && rowStr.includes('mep1'))) &&
                 rowStr.includes('efficience');
        });

        let actual = 80; // default
        if (targetRow) {
          // Find the last valid number in the row that represents a percentage (between 0 and 2)
          const values = Object.values(targetRow)
            .filter((v: any) => typeof v === 'number' && v > 0 && v < 2) as number[];
          
          if (values.length > 0) {
            // Get the last day's efficiency
            actual = Math.round(values[values.length - 1] * 100);
          }
        }

        return { name: seg.label, value: actual };
      });

      // If we completely failed to find any data, return default
      if (parsedData.every(d => d.value === 80)) return DEFAULT_EFF_DATA.map(d => ({ name: d.line, value: d.actual }));
      return parsedData;

    } catch (e) {
      console.error("Failed to parse efficiency data", e);
      return DEFAULT_EFF_DATA.map(d => ({ name: d.line, value: d.actual }));
    }
  }, [importedData]);

  return (
    <motion.div 
      onClick={() => setActivePage('efficiency')}
      className="glass p-5 flex flex-col cursor-pointer group h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[var(--volvo-blue)]/10 rounded-lg group-hover:bg-[var(--volvo-blue)] group-hover:text-white transition-colors text-[var(--volvo-blue)]">
            <Zap size={16} />
          </div>
          <h3 className="text-xs font-black text-[var(--text-primary)] uppercase tracking-tight">Efficiency (%)</h3>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black text-[var(--volvo-blue)] uppercase tracking-widest bg-[var(--volvo-blue)]/10 px-2 py-0.5 rounded-full">
          Live
          <ChevronRight size={12} />
        </div>
      </div>

      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 0, left: -25, bottom: 0 }} barGap={2} barCategoryGap="20%">
            <XAxis dataKey="name" hide />
            <YAxis domain={[0, 120]} hide />
            <ReferenceLine y={EFF_TARGET} stroke="var(--warning)" strokeDasharray="3 3" strokeWidth={1.5} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={1000}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.value < EFF_TARGET ? 'var(--warning)' : 'var(--success)'} />
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
                        <span className="text-[#185FA5]">Value:</span>
                        <span>{payload[0].value?.toFixed(1)}%</span>
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
          <div className="w-1.5 h-1.5 rounded-full bg-[#185FA5]" />
          <span className="text-[10px] font-black text-slate-900">
            {Math.round(chartData.reduce((acc, curr) => acc + curr.value, 0) / chartData.length)}%
          </span>
          <span className="text-[8px] font-black text-slate-400 uppercase">AVG</span>
        </div>
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-[#185FA5] transition-colors">
          View Trends
        </span>
      </div>
    </motion.div>
  );
}
