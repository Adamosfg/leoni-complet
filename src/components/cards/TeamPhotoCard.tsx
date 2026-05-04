/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Users } from 'lucide-react';
import CardShell from '../shared/CardShell';
import { useDashboard } from '../../context/DashboardContext';

export default function TeamPhotoCard({ number }: { number?: number }) {
  const { teamPhotoUrl } = useDashboard();
  
  return (
    <CardShell title="Team MEP1" icon={<Users size={14} />} number={number}>
      <div className="flex-1 relative rounded-xl overflow-hidden group">
        <img 
          src={teamPhotoUrl} 
          alt="MEP1 Team" 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4">
          <p className="text-white text-[11px] font-black uppercase tracking-[0.2em]">MEP1 Squad</p>
          <p className="text-white/70 text-[9px] font-black uppercase tracking-widest mt-1">Shift A • LEONI Berrechid</p>
        </div>
      </div>
    </CardShell>
  );
}
