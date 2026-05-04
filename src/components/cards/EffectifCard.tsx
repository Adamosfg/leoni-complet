/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Users } from 'lucide-react';
import CardShell from '../shared/CardShell';
import CustomTooltip from '../shared/CustomTooltip';
import { useDashboard } from '../../context/DashboardContext';
import { KPI_DATA } from '../../data/kpi';

export default function EffectifCard() {
  const { filter } = useDashboard();
  const data = KPI_DATA.effectif[filter];
  const absenteeism = KPI_DATA.effectif.absenteeism[filter];

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <CardShell title="Effectif" icon={<Users size={14} />}>
      <div className="flex flex-col h-full">
        <div className="h-[140px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={60}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip unit="%" />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-black text-slate-900 leading-none">{total}</span>
            <span className="text-[9px] text-slate-300 font-black uppercase tracking-[0.2em] mt-1">Personnel</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-tight">{item.name}</span>
                </div>
                <span className="text-[11px] font-black text-slate-900">{item.value}%</span>
              </div>
              <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                <div 
                  className="h-full rounded-full transition-all duration-1000" 
                  style={{ backgroundColor: item.color, width: `${item.value}%` }} 
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Absenteeism</span>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
              absenteeism < 5 ? 'bg-[#16a34a]' : absenteeism < 8 ? 'bg-[#d97706]' : 'bg-[#dc2626]'
            }`} />
            <span className="text-[12px] font-black text-slate-900">{absenteeism}%</span>
          </div>
        </div>
      </div>
    </CardShell>
  );
}
