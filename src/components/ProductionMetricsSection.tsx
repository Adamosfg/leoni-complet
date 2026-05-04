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
  ChevronRight, 
  TrendingUp, 
  Target, 
  Calendar, 
  Award,
  ArrowLeft,
  LayoutDashboard
} from 'lucide-react';

// Deterministic random for daily data
function getSeededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return function() {
    h = Math.imul(h ^ h >>> 16, 2246522507);
    h = Math.imul(h ^ h >>> 13, 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

interface ProductionMonthData {
  weeks: string[];
  segments: {
    [key: string]: number[];
  };
  avg: number;
}

interface PerformanceMetricProps {
  title: string;
  target: number;
  data: Record<string, ProductionMonthData>;
  baseColor: string;
  lowerIsBetter?: boolean;
}

type Granularity = 'Monthly' | 'Weekly' | 'Daily';

const SEGMENTS = ['MEP1', 'CMA2', 'CMA3', 'SPA3'];
const SEGMENT_COLORS = {
  'MEP1': '#185FA5',
  'CMA2': '#3B6D11',
  'CMA3': '#BA7517',
  'SPA3': '#A32D2D',
};

export default function ProductionMetricsSection({ 
  title, 
  target, 
  data, 
  baseColor,
  lowerIsBetter = false
}: PerformanceMetricProps) {
  const [granularity, setGranularity] = useState<Granularity>('Monthly');
  const [drillContext, setDrillContext] = useState<{ month?: string; weekIdx?: number }>({});

  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  // Data processing based on granularity
  const processedData = useMemo(() => {
    if (granularity === 'Monthly') {
      return Object.entries(data).map(([name, monthData]) => {
        const item: any = { name };
        SEGMENTS.forEach(segment => {
          const values = monthData.segments[segment] || [];
          item[segment] = values.reduce((a, b) => a + b, 0) / (values.length || 1);
        });
        item.avg = monthData.avg;
        return item;
      });
    } else if (granularity === 'Weekly') {
      const monthKey = drillContext.month || Object.keys(data)[0];
      const monthData = data[monthKey];
      return monthData.weeks.map((week, idx) => {
        const item: any = { name: week, weekIdx: idx };
        SEGMENTS.forEach(segment => {
          item[segment] = monthData.segments[segment]?.[idx] || 0;
        });
        return item;
      });
    } else {
      // Daily (Simulated per segment)
      const monthKey = drillContext.month || Object.keys(data)[0];
      const monthData = data[monthKey];
      const weekIdx = drillContext.weekIdx ?? 0;
      const weekName = monthData.weeks[weekIdx];
      
      const rng = getSeededRandom(weekName);
      return DAYS.map(day => {
        const item: any = { name: day };
        SEGMENTS.forEach(segment => {
          const baseVal = monthData.segments[segment]?.[weekIdx] || 0;
          const offset = (rng() * 0.3) - 0.15;
          item[segment] = baseVal * (1 + offset);
        });
        return item;
      });
    }
  }, [granularity, drillContext, data]);

  // KPI calculations (Overall Avg)
  const kpis = useMemo(() => {
    let avg = 0;
    let best = { name: 'N/A', val: lowerIsBetter ? Infinity : 0 };
    let worst = { name: 'N/A', val: lowerIsBetter ? 0 : Infinity };

    processedData.forEach(d => {
      const vals = SEGMENTS.map(s => d[s]).filter(v => v > 0);
      const periodAvg = vals.reduce((a, b) => a + b, 0) / (vals.length || 1);
      
      const isBetter = lowerIsBetter ? periodAvg < best.val : periodAvg > best.val;
      const isWorse = lowerIsBetter ? periodAvg > worst.val : periodAvg < worst.val;

      if (isBetter) best = { name: d.name, val: periodAvg };
      if (isWorse) worst = { name: d.name, val: periodAvg };
      avg += periodAvg;
    });

    avg = avg / (processedData.length || 1);

    return {
      avg: avg.toFixed(1),
      target: target.toString(),
      best: { name: best.name, val: (best.val === Infinity ? 0 : best.val).toFixed(1) },
      worst: { name: worst.name, val: (worst.val === Infinity || worst.val === 0 ? 0 : worst.val).toFixed(1) }
    };
  }, [processedData, target, lowerIsBetter]);

  const handleBarClick = (payload: any) => {
    if (granularity === 'Monthly') {
      setDrillContext({ month: payload.name });
      setGranularity('Weekly');
    } else if (granularity === 'Weekly') {
      setDrillContext(prev => ({ ...prev, weekIdx: payload.weekIdx }));
      setGranularity('Daily');
    }
  };

  const handleBreadcrumbClick = (level: Granularity) => {
    if (level === 'Monthly') {
      setDrillContext({});
      setGranularity('Monthly');
    } else if (level === 'Weekly') {
      setDrillContext(prev => ({ month: prev.month }));
      setGranularity('Weekly');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: baseColor }} />
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{title}</h2>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <button 
              onClick={() => handleBreadcrumbClick('Monthly')}
              className={`text-[10px] font-black uppercase tracking-widest ${granularity === 'Monthly' ? 'text-slate-400' : 'text-[#1B4299]'}`}
            >
              Overall
            </button>
            {drillContext.month && (
              <>
                <ChevronRight size={10} className="text-slate-300" />
                <button 
                  onClick={() => handleBreadcrumbClick('Weekly')}
                  className={`text-[10px] font-black uppercase tracking-widest ${granularity === 'Weekly' ? 'text-slate-400' : 'text-[#1B4299]'}`}
                >
                  {drillContext.month}
                </button>
              </>
            )}
            {drillContext.weekIdx !== undefined && (
              <>
                <ChevronRight size={10} className="text-slate-300" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {data[drillContext.month!]?.weeks[drillContext.weekIdx]}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl">
          {(['Monthly', 'Weekly', 'Daily'] as Granularity[]).map(g => (
            <button
              key={g}
              onClick={() => {
                setGranularity(g);
                if (g === 'Monthly') setDrillContext({});
              }}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                granularity === g 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <KPICard label={`AVG ${granularity}`} value={kpis.avg} color={baseColor} icon={TrendingUp} />
        <KPICard label="TARGET" value={kpis.target} color="#BA7517" icon={Target} />
        <KPICard label="BEST" value={kpis.best.val} subValue={kpis.best.name} color="#3B6D11" icon={Award} />
        <KPICard label="LOWEST" value={kpis.worst.val} subValue={kpis.worst.name} color="#E24B4A" icon={ArrowLeft} />
      </div>

      {/* Chart */}
      <div className="h-[350px] w-full mb-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={processedData}
            barGap={2}
            onClick={(state: any) => {
              if (state && state.activePayload) {
                handleBarClick(state.activePayload[0].payload);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
              domain={[0, (dataMax: number) => Math.max(dataMax * 1.1, target * 1.1)]}
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              content={<CustomTooltip target={target} lowerIsBetter={lowerIsBetter} />}
            />
            <ReferenceLine 
              y={target} 
              stroke="#BA7517" 
              strokeDasharray="5 5" 
              strokeWidth={2}
              label={{ 
                value: `TARGET ${target}`, 
                position: 'right', 
                fill: '#BA7517', 
                fontSize: 10, 
                fontWeight: 900 
              }} 
            />
            {SEGMENTS.map(segment => (
              <Bar 
                key={segment}
                dataKey={segment} 
                fill={SEGMENT_COLORS[segment as keyof typeof SEGMENT_COLORS]}
                radius={[4, 4, 0, 0]} 
                className="cursor-pointer"
              >
                {processedData.map((entry, index) => {
                  const val = entry[segment];
                  const isGood = lowerIsBetter ? val <= target : val >= target;
                  return (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={isGood ? SEGMENT_COLORS[segment as keyof typeof SEGMENT_COLORS] : '#E24B4A'} 
                    />
                  );
                })}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 mb-10 pt-4 border-t border-slate-50">
        {SEGMENTS.map(segment => (
          <LegendItem key={segment} color={SEGMENT_COLORS[segment as keyof typeof SEGMENT_COLORS]} label={segment} />
        ))}
        <LegendItem color="#BA7517" label="Production Goal Line" dashed />
      </div>

      {/* Monthly Breakdown (Only at Monthly level) */}
      <AnimatePresence>
        {granularity === 'Monthly' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-4"
          >
            {Object.entries(data).map(([name, monthData]) => {
              const status = monthData.avg >= target ? 'above' : 'below';
              return (
                <button
                  key={name}
                  onClick={() => {
                    setDrillContext({ month: name });
                    setGranularity('Weekly');
                  }}
                  className="flex flex-col p-4 rounded-2xl border border-slate-100 hover:border-slate-300 hover:shadow-lg transition-all text-left group"
                >
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-slate-900">{name}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900 tracking-tighter">{monthData.avg.toFixed(1)}</span>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{title.includes('%') ? '%' : 'h'}</span>
                  </div>
                  <div className={`mt-3 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md w-fit ${
                    status === 'above' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {status === 'above' ? 'MET' : 'BELOW'}
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function KPICard({ label, value, subValue, color, icon: Icon }: any) {
  return (
    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={12} style={{ color }} />
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black text-slate-900 tracking-tighter">{value}</span>
        {subValue && <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{subValue}</span>}
      </div>
    </div>
  );
}

function LegendItem({ color, label, dashed }: any) {
  return (
    <div className="flex items-center gap-2">
      {dashed ? (
        <div className="w-6 h-0.5 border-t-2 border-dashed" style={{ borderColor: color }} />
      ) : (
        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
      )}
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
    </div>
  );
}

function CustomTooltip({ active, payload, label, target, lowerIsBetter }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xl min-w-[160px]">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-50 pb-2">{label}</p>
        <div className="space-y-2">
          {payload.map((item: any) => {
            const val = item.value;
            const isGood = lowerIsBetter ? val <= target : val >= target;
            return (
              <div key={item.name} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-bold text-slate-600 tracking-tight">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-900">{val.toFixed(1)}</span>
                  <div className={`w-1 h-1 rounded-full ${isGood ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 pt-2 border-t border-slate-50 flex items-center justify-between">
          <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Target</span>
          <span className="text-[10px] font-black text-[#BA7517]">{target}</span>
        </div>
      </div>
    );
  }
  return null;
}
