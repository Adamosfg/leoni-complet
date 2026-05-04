/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sparkles, Info } from 'lucide-react';
import CardShell from '../shared/CardShell';
import { useDashboard } from '../../context/DashboardContext';
import SatisfactionGraphic from '../SatisfactionGraphic';

export default function SatisfactionCard({ number }: { number?: number }) {
  const { setActivePage } = useDashboard();

  return (
    <div 
      onClick={() => setActivePage('satisfaction')}
      className="h-full cursor-pointer group active:scale-95 transition-transform"
    >
      <CardShell 
        title="Satisfaction" 
        icon={<Sparkles size={14} />} 
        number={number} 
        className="group-hover:border-[#1B4299]/50 group-hover:shadow-[0_0_20px_rgba(27,66,153,0.1)]"
      >
        <div className="flex-1 flex flex-col items-center justify-center relative w-full h-full min-h-[200px]">
           {/* Info Overlay */}
          <div className="absolute top-0 right-0 p-1 bg-[#1B4299]/10 rounded-bl-xl opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[7px] font-black uppercase tracking-widest px-2 text-[#1B4299]">Click for Details</span>
          </div>

          <SatisfactionGraphic size="small" />
        </div>
      </CardShell>
    </div>
  );
}
