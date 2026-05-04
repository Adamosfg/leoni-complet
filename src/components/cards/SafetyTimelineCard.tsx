import { useDashboard } from '../../context/DashboardContext';
import { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import { parseISO, subDays, format, isSameDay } from 'date-fns';
import { ResponsiveContainer, XAxis, Tooltip, CartesianGrid, Area, AreaChart } from 'recharts';
import CardShell from '../shared/CardShell';
import CustomTooltip from '../shared/CustomTooltip';

export default function SafetyTimelineCard({ number }: { number?: number }) {
  const { accidents } = useDashboard();

  // Timeline Data (Last 7 days)
  const timelineData = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), 6 - i);
      const count = accidents.filter(acc => isSameDay(parseISO(acc.date), date)).length;
      return {
        name: format(date, 'MMM dd'),
        value: count
      };
    });
  }, [accidents]);

  return (
    <CardShell 
      title="Incident History" 
      icon={<TrendingUp size={14} />}
      number={number}
    >
      <div className="flex-1 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#dc2626" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" vertical={false} stroke="var(--chart-grid)" strokeOpacity={0.1} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--chart-text)', fontSize: 10, fontWeight: 700 }} 
            />
            <Tooltip content={<CustomTooltip unit="incidents" />} cursor={{ stroke: 'rgba(0,0,0,0.05)', strokeWidth: 1 }} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#dc2626" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorIncidents)" 
              animationDuration={1500}
              dot={{ r: 3, fill: '#dc2626' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CardShell>
  );
}
