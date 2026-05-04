/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Lightbulb } from 'lucide-react';
import CardShell from '../shared/CardShell';
import MetricChip from '../shared/MetricChip';
import CustomTooltip from '../shared/CustomTooltip';
import { useDashboard } from '../../context/DashboardContext';
import { KPI_DATA } from '../../data/kpi';

export default function KaizenCard() {
  const { filter } = useDashboard();
  const data = KPI_DATA.kaizen[filter];
  const status = KPI_DATA.kaizen.status;

  const latest = data[data.length - 1].count;

  const mainColor = filter === 'Month' ? '#1B4299' : '#dc2626';

  return (
    <CardShell 
      title="Amélioration Continue" 
      icon={<Lightbulb size={14} />}
    >
      <MetricChip 
        value={`${latest}`} 
        unit="Total Ideas" 
        delta="+12%" 
        deltaPositive={true} 
      />

      <div className="flex-1 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="kaizenGradient" x1="0" y1="0" x2="0" y2="1">
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
            <Tooltip content={<CustomTooltip unit="ideas" />} />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke={mainColor} 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#kaizenGradient)" 
              dot={{ r: 3, fill: mainColor }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
        {[
          { label: 'Open', value: status.open, color: '#1B4299' },
          { label: 'Progress', value: status.inProgress, color: '#d97706' },
          { label: 'Done', value: status.closed, color: '#16a34a' }
        ].map(item => (
          <div key={item.label} className="flex flex-col items-center gap-1 px-3 py-2 bg-slate-50/50 rounded-xl border border-slate-100 flex-1 mx-1">
            <span className="text-[12px] font-black text-slate-900 leading-none">{item.value}</span>
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{item.label}</span>
          </div>
        ))}
      </div>
    </CardShell>
  );
}
