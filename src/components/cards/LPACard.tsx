/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts';
import { ClipboardCheck, Crown } from 'lucide-react';
import CardShell from '../shared/CardShell';
import MetricChip from '../shared/MetricChip';
import { useDashboard } from '../../context/DashboardContext';

export default function LPACard({ number }: { number?: number }) {
  const { productionData } = useDashboard();
  
  const data = productionData.lpa.map(item => ({
    name: item.line,
    actual: item.actual,
    objective: item.objective
  }));
  
  const maxScore = 1000;
  const avgActual = Math.round(productionData.lpa.reduce((acc, curr) => acc + curr.actual, 0) / productionData.lpa.length);
  const avgObjective = Math.round(productionData.lpa.reduce((acc, curr) => acc + curr.objective, 0) / productionData.lpa.length);

  return (
    <CardShell title="LPA Score" icon={<ClipboardCheck size={14} />} number={number}>
      <MetricChip 
        value={avgActual} 
        unit="avg pts" 
        delta={`${avgActual >= avgObjective ? '↑' : '↓'} ${Math.abs(avgActual - avgObjective)} vs Obj`} 
        deltaPositive={avgActual >= avgObjective} 
      />

      <div className="flex-1 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ top: 20, right: 10, left: -40, bottom: 0 }}
            barGap={8}
            barCategoryGap={20}
          >
            <defs>
              <linearGradient id="lpaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="lpaObjGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#eab308" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#eab308" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" stroke="var(--chart-grid)" vertical={false} strokeOpacity={0.1} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 500 }} 
            />
            <YAxis 
              domain={[0, maxScore]} 
              axisLine={false} 
              tickLine={false} 
              tick={false} 
            />
            <Tooltip 
              cursor={{ fill: 'rgba(0,0,0,0.02)' }}
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '16px',
                fontSize: '11px',
                color: '#0f172a',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}
              itemStyle={{ color: '#0f172a', fontWeight: 800 }}
            />
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle"
              wrapperStyle={{ fontSize: '10px', paddingBottom: '20px', opacity: 0.7 }}
            />
            <Bar name="Actual" dataKey="actual" fill="url(#lpaGradient)" radius={[6, 6, 0, 0]} barSize={12}>
              <LabelList dataKey="actual" position="top" style={{ fill: 'var(--text-primary)', fontSize: 10, fontWeight: 'bold' }} />
            </Bar>
            <Bar name="Objective" dataKey="objective" fill="url(#lpaObjGradient)" radius={[6, 6, 0, 0]} barSize={12}>
              <LabelList dataKey="objective" position="top" style={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 500 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crown size={12} className="text-[#E8B200]" />
          <span className="text-[11px] text-[var(--text-secondary)] font-medium">Avg Target:</span>
          <span className="text-[11px] font-bold text-[var(--text-primary)]">{avgObjective} pts</span>
        </div>
      </div>
    </CardShell>
  );
}
