/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  Cell
} from 'recharts';
import { 
  ClipboardCheck, 
  TrendingUp, 
  Target, 
  Calendar, 
  Award,
  ChevronRight,
  Info
} from 'lucide-react';

export const TARGET = 15;
export const MAX_SCORE = 20;

export const COLORS = {
  'MEP1': '#185FA5',
  'CMA2': '#3B6D11',
  'CMA3': '#BA7517',
  'SPA3': '#A32D2D',
};

export interface MonthData {
  weeks: string[];
  segments: {
    'MEP1': number[];
    'CMA2': number[];
    'CMA3': number[];
    'SPA3': number[];
  };
}

export const DATA: Record<string, MonthData> = {
  'Janvier': {
    weeks: ['S1','S2','S3','S4'],
    segments: {
      'MEP1': [15.75, 15.75, 15.75, 15.75],
      'CMA2': [16, 16, 16, 16],
      'CMA3': [16, 16, 16, 16],
      'SPA3': [15, 15, 15, 15]
    }
  },
  'Février': {
    weeks: ['S5','S6','S7','S8'],
    segments: {
      'MEP1': [15.75, 15.75, 15.75, 15.75],
      'CMA2': [16, 16, 16, 16],
      'CMA3': [16, 16, 16, 16],
      'SPA3': [15, 15, 15, 15]
    }
  },
  'Mars': {
    weeks: ['S9','S10','S11','S12'],
    segments: {
      'MEP1': [15.75, 15.75, 15.75, 15.75],
      'CMA2': [16, 16, 16, 16],
      'CMA3': [16, 16, 16, 16],
      'SPA3': [15, 15, 15, 15]
    }
  },
  'Mars 2': {
    weeks: ['S9','S10','S11','S12'],
    segments: {
      'MEP1': [14.5, 15.2, 16.1, 15.8],
      'CMA2': [16, 14.8, 15.5, 16.2],
      'CMA3': [15, 15.5, 16, 16.5],
      'SPA3': [13.5, 14, 15, 15.5]
    }
  },
  'Avril': {
    weeks: ['S13','S14','S15','S16'],
    segments: {
      'MEP1': [15.75, 15.75, 15.75, 15.75],
      'CMA2': [16, 16, 16, 16],
      'CMA3': [16, 16, 16, 16],
      'SPA3': [15, 15, 15, 15]
    }
  },
  'Mai': {
    weeks: ['S17'],
    segments: {
      'MEP1': [15.75],
      'CMA2': [16],
      'CMA3': [16],
      'SPA3': [15]
    }
  }
};

import { useDashboard } from '../context/DashboardContext';

export type MonthName = string;

export function useFiveSData() {
  const { importedData } = useDashboard();

  // Try to parse imported data, fallback to constants
  return useMemo(() => {
    const rawImport = importedData['5S RESULTS V2'];
    if (!rawImport) return DATA;

    try {
      const sheet = rawImport[Object.keys(rawImport)[0]];
      const result: Record<string, MonthData> = {};
      
      // Group by chunks of 4 weeks to simulate months if no month column exists
      let currentMonthIndex = 1;
      let currentWeeks: string[] = [];
      let currentSegments: any = { 'MEP1': [], 'CMA2': [], 'CMA3': [], 'SPA3': [] };

      sheet.forEach((row: any, idx: number) => {
        // Find week key
        const weekKey = Object.keys(row).find(k => k.toLowerCase().includes('week') || k.toLowerCase().includes('sem') || k.toLowerCase() === 's') || Object.keys(row)[0];
        currentWeeks.push(String(row[weekKey] || `S${idx+1}`));

        Object.keys(currentSegments).forEach(seg => {
          const segKey = Object.keys(row).find(k => k.replace(/\s/g, '').toLowerCase().includes(seg.toLowerCase()));
          currentSegments[seg].push(segKey && row[segKey] ? Number(row[segKey]) : 15); // Default to 15 if missing to avoid breaking chart
        });

        if (currentWeeks.length === 4 || idx === sheet.length - 1) {
          result[`Mois ${currentMonthIndex}`] = { weeks: currentWeeks, segments: currentSegments };
          currentMonthIndex++;
          currentWeeks = [];
          currentSegments = { 'MEP1': [], 'CMA2': [], 'CMA3': [], 'SPA3': [] };
        }
      });

      return Object.keys(result).length > 0 ? result : DATA;
    } catch (e) {
      console.error("Failed to parse 5S data", e);
      return DATA;
    }
  }, [importedData]);
}

export default function FiveSPage() {
  const pageData = useFiveSData();

  const monthNames = Object.keys(pageData);
  const [selectedMonth, setSelectedMonth] = useState<MonthName>(monthNames[monthNames.length - 1]);
  
  // Safety check if selectedMonth no longer exists in newly imported data
  const monthData = pageData[selectedMonth] || pageData[monthNames[monthNames.length - 1]];

  // Transform data for Recharts
  const chartData = useMemo(() => {
    return monthData.weeks.map((week, idx) => {
      const point: any = { name: week };
      Object.keys(monthData.segments).forEach(seg => {
        point[seg] = monthData.segments[seg as keyof typeof monthData.segments][idx];
      });
      return point;
    });
  }, [monthData]);

  // Calculate Summary metrics
  const metrics = useMemo(() => {
    let totalScore = 0;
    let count = 0;
    const segmentAverages: Record<string, number> = {};

    Object.entries(monthData.segments).forEach(([seg, scores]) => {
      const numScores = scores as number[];
      const avg = numScores.reduce((a, b) => a + b, 0) / numScores.length;
      segmentAverages[seg] = avg;
      totalScore += avg;
      count++;
    });


    const overallAvg = totalScore / count;
    const bestSegment = Object.entries(segmentAverages).reduce((a, b) => a[1] > b[1] ? a : b);
    const weekRange = monthData.weeks.length > 1 
      ? `${monthData.weeks[0]} → ${monthData.weeks[monthData.weeks.length - 1]}`
      : monthData.weeks[0];

    return {
      overallAvg: overallAvg.toFixed(2),
      segmentCount: count,
      weekRange,
      bestSegment: { name: bestSegment[0], avg: bestSegment[1].toFixed(2) }
    };
  }, [selectedMonth]);

  return (
    <div className="flex-1 bg-slate-50/50 p-8 overflow-y-auto">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#1B4299] rounded-lg shadow-lg shadow-[#1B4299]/20">
            <ClipboardCheck size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">5S Audit Results</h1>
        </div>
        <p className="text-slate-500 font-bold ml-11">
          {selectedMonth} — Weekly segment scores tracking against target {TARGET}
        </p>
      </header>

      {/* Month Tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {monthNames.map(month => (
          <button
            key={month}
            onClick={() => setSelectedMonth(month)}
            className={`px-8 py-3 rounded-xl font-black text-sm tracking-tight transition-all duration-300 ${
              selectedMonth === month || (!pageData[selectedMonth] && month === monthNames[monthNames.length - 1])
                ? 'bg-[#1B4299] text-white shadow-xl shadow-[#1B4299]/30 scale-105' 
                : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {month}
          </button>
        ))}
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <SummaryCard 
          label="Monthly Average" 
          value={metrics.overallAvg} 
          subValue="Points"
          icon={TrendingUp} 
          color="#1B4299"
        />
        <SummaryCard 
          label="Segments Audited" 
          value={metrics.segmentCount} 
          subValue="Active Lines"
          icon={Target} 
          color="#3B6D11"
        />
        <SummaryCard 
          label="Week Range" 
          value={metrics.weekRange} 
          subValue="Period"
          icon={Calendar} 
          color="#BA7517"
        />
        <SummaryCard 
          label="Elite Performer" 
          value={metrics.bestSegment.avg} 
          subValue={metrics.bestSegment.name}
          icon={Award} 
          color="#A32D2D"
        />
      </div>

      {/* Chart Section */}
      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm mb-10"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Segment Performance</h3>
            <p className="text-sm text-slate-500 font-bold mt-1 uppercase tracking-widest">Weekly score distribution</p>
          </div>
          
          {/* Custom Legend */}
          <div className="flex flex-wrap gap-4">
            {Object.entries(COLORS).map(([name, color]) => (
              <div key={name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              barGap={8}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 900 }}
              />
              <YAxis 
                domain={[13, 17]} 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 900 }}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ fill: '#f8fafc' }}
              />
              <ReferenceLine 
                y={TARGET} 
                stroke="#E24B4A" 
                strokeDasharray="5 5" 
                strokeWidth={2}
                label={{ 
                  value: 'TARGET 15', 
                  position: 'right', 
                  fill: '#E24B4A', 
                  fontSize: 10, 
                  fontWeight: 900 
                }} 
              />
              {Object.keys(COLORS).map((seg) => (
                <Bar 
                  key={seg} 
                  dataKey={seg} 
                  fill={COLORS[seg as keyof typeof COLORS]} 
                  radius={[4, 4, 0, 0]}
                  animationDuration={1500}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Segment Cards Grid */}
      <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase mb-6 flex items-center gap-2">
        <div className="w-1.5 h-6 bg-[#1B4299] rounded-full" />
        Detailed Segment Audit
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {(Object.entries(monthData.segments) as [string, number[]][]).map(([name, scores]) => (
          <SegmentCard 
            key={name}
            name={name}
            scores={scores}
            color={COLORS[name as keyof typeof COLORS]}
          />
        ))}
      </div>
    </div>
  );
}

function SummaryCard({ label, value, subValue, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
        <Icon size={80} style={{ color }} />
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl" style={{ backgroundColor: `${color}10` }}>
          <Icon size={18} style={{ color }} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-black text-slate-900 tracking-tighter">{value}</span>
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{subValue}</span>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-2xl backdrop-blur-xl bg-white/90">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">
          Week {label}
        </p>
        <div className="space-y-2">
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-xs font-bold text-slate-600 uppercase">{entry.name}</span>
              </div>
              <span className="text-xs font-black text-slate-900">{entry.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

const SegmentCard: React.FC<{ name: string; scores: number[]; color: string }> = ({ name, scores, color }) => {
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const progressPercent = Math.min((avg / MAX_SCORE) * 100, 100);
  
  const status = avg > TARGET ? 'above' : avg === TARGET ? 'on' : 'below';
  
  const statusConfig = {
    above: { bg: '#EAF3DE', text: '#3B6D11', label: 'EXCEEDS TARGET' },
    on: { bg: '#E6F1FB', text: '#185FA5', label: 'ON TARGET' },
    below: { bg: '#FCEBEB', text: '#A32D2D', label: 'BELOW TARGET' }
  }[status];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-5 group-hover:scale-125 transition-transform duration-700" style={{ backgroundColor: color }} />
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h4 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{name}</h4>
          <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: statusConfig.text, backgroundColor: statusConfig.bg, padding: '2px 8px', borderRadius: '4px' }}>
            {statusConfig.label}
          </span>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-slate-900 leading-none">{avg.toFixed(2)}</div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">AVERAGE</div>
        </div>
      </div>

      <div className="mb-6 relative z-10">
        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
          <span>PROGRESS</span>
          <span>{avg.toFixed(1)} / {MAX_SCORE}</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>

      <div className="space-y-2 relative z-10">
        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
          <span>WEEKLY LOG</span>
          <span>SCORE</span>
        </div>
        {scores.map((s, i) => (
          <div key={i} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Week {i + 1}</span>
            <span className={`text-xs font-black ${s < TARGET ? 'text-red-600' : 'text-slate-900'}`}>{s.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between text-[10px] font-black text-slate-300 uppercase tracking-widest">
        <div className="flex items-center gap-1">
          <Target size={10} />
          TARGET: {TARGET}
        </div>
        <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}
