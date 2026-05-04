/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import CardShell from '../shared/CardShell';
import MetricChip from '../shared/MetricChip';
import CustomTooltip from '../shared/CustomTooltip';
import AlertBanner from '../shared/AlertBanner';
import { useDashboard } from '../../context/DashboardContext';
import { KPI_DATA } from '../../data/kpi';

export default function NCRCard() {
  const { filter } = useDashboard();
  const data = KPI_DATA.ncr[filter];
  const threshold = KPI_DATA.ncr.threshold[filter];

  const latest = data[data.length - 1];
  const peak = Math.max(...data.map(d => d.ncr));
  const avg = (data.reduce((acc, curr) => acc + curr.ncr, 0) / data.length).toFixed(1);
  const total = data.reduce((acc, curr) => acc + curr.ncr, 0);

  const hasAlert = data.some(d => d.ncr > threshold);

  const mainColor = filter === 'Month' ? '#1B4299' : '#dc2626';

  return (
    <CardShell 
      title="NCR / Defects" 
      icon={<ShieldAlert size={14} />}
      alert={hasAlert}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-[#dc2626] leading-none">{peak}</span>
            <span className="text-[10px] uppercase tracking-widest font-black text-slate-300 mt-1">Peak</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-slate-900 leading-none">{avg}</span>
            <span className="text-[10px] uppercase tracking-widest font-black text-slate-300 mt-1">Average</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-black text-[#1B4299] leading-none">{total}</span>
            <span className="text-[10px] uppercase tracking-widest font-black text-slate-300 mt-1">Total</span>
          </div>
        </div>

        {hasAlert && (
          <div className="mb-4">
            <AlertBanner 
              message={`Threshold exceeded on ${data.find(d => d.ncr > threshold)?.name}`} 
              type="danger" 
            />
          </div>
        )}

        <div className="flex-1 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="ncrGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={mainColor} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={mainColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="0" stroke="var(--chart-grid)" vertical={false} strokeOpacity={0.1} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--chart-text)', fontSize: 10, fontWeight: 700 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--chart-text)', fontSize: 10 }} 
              />
              <Tooltip content={<CustomTooltip unit="NCR" />} cursor={{ stroke: 'rgba(0,0,0,0.05)', strokeWidth: 1 }} />
              <ReferenceLine 
                y={threshold} 
                stroke="#d97706" 
                strokeDasharray="4 4" 
                label={{ position: 'right', value: 'Limit', fill: '#d97706', fontSize: 9, fontWeight: 800 }} 
              />
              <Area 
                type="monotone" 
                dataKey="ncr" 
                stroke={mainColor} 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#ncrGradient)" 
                dot={{ r: 3, fill: mainColor, strokeWidth: 0 }} 
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </CardShell>
  );
}
