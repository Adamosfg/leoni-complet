/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { Package } from 'lucide-react';
import CardShell from '../shared/CardShell';
import MetricChip from '../shared/MetricChip';
import CustomTooltip from '../shared/CustomTooltip';
import { useDashboard } from '../../context/DashboardContext';
import { KPI_DATA } from '../../data/kpi';

export default function OutputCard() {
  const { filter } = useDashboard();
  const data = KPI_DATA.output[filter];
  const target = KPI_DATA.output.target[filter];

  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  const avg = Math.round(total / data.length);
  const displayValue = filter === 'Day' ? avg : total;
  const unit = filter === 'Day' ? 'avg units' : 'total units';

  const barColor = filter === 'Month' ? '#1B4299' : '#dc2626';

  return (
    <CardShell 
      title="Output (Harness)" 
      icon={<Package size={14} />}
      alert={data[data.length - 1].value < target}
    >
      <MetricChip 
        value={displayValue} 
        unit={unit} 
        delta="+8%" 
        deltaPositive={true} 
      />
      
      <div className="flex-1 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 5, left: -20, bottom: 0 }}>
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
            <Tooltip content={<CustomTooltip unit="units" />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
            <ReferenceLine 
              y={target} 
              stroke="#E8B200" 
              strokeDasharray="4 4" 
              label={{ position: 'right', value: 'Target', fill: '#E8B200', fontSize: 10, fontWeight: 800 }} 
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} fill={barColor}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.value === 0 ? 'transparent' : barColor}
                  className="transition-all duration-500"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardShell>
  );
}
