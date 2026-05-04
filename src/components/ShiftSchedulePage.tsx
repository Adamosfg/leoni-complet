/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Calendar, Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

interface ShiftAssignment {
  id: string;
  name: string;
  role: string;
  line: string;
  shift: 'Shift 1' | 'Shift 2' | 'Shift 3';
}

export default function ShiftSchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const assignments: ShiftAssignment[] = [
    { id: '1', name: 'Adam S.', role: 'Supervisor', line: 'All', shift: 'Shift 1' },
    { id: '2', name: 'Sarah A.', role: 'Assistant', line: 'P1', shift: 'Shift 1' },
    { id: '3', name: 'Marc P.', role: 'Packaging', line: 'P1', shift: 'Shift 1' },
    { id: '4', name: 'Youssef B.', role: 'Assistant', line: 'P2', shift: 'Shift 1' },
    { id: '5', name: 'Fatima Z.', role: 'Packaging', line: 'P2', shift: 'Shift 1' },
    { id: '6', name: 'Karim L.', role: 'Supervisor', line: 'All', shift: 'Shift 2' },
    { id: '7', name: 'Imane K.', role: 'Assistant', line: 'P1', shift: 'Shift 2' },
  ];

  const shifts = ['Shift 1', 'Shift 2', 'Shift 3'] as const;

  return (
    <div className="p-6 max-w-6xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Users className="text-[#1B4299]" />
            Shift Schedule
          </h1>
          <p className="text-[var(--text-secondary)] text-sm">Affectations des équipes par poste et par ligne.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border)] p-1 rounded-xl">
          <button className="p-2 hover:bg-white/5 rounded-lg text-[var(--text-secondary)]"><ChevronLeft size={18} /></button>
          <div className="px-4 flex items-center gap-2">
            <Calendar size={16} className="text-[#1B4299]" />
            <span className="text-sm font-bold">{currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
          </div>
          <button className="p-2 hover:bg-white/5 rounded-lg text-[var(--text-secondary)]"><ChevronRight size={18} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {shifts.map(shift => (
          <div key={shift} className="flex flex-col gap-4">
            <div className="p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#1B4299]" />
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">{shift}</h3>
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                    {shift === 'Shift 1' ? '06:00 - 14:00' : shift === 'Shift 2' ? '14:00 - 22:00' : '22:00 - 06:00'}
                  </span>
                </div>
                <div className="w-10 h-10 bg-[#1B4299]/10 rounded-xl flex items-center justify-center text-[#1B4299]">
                  <Clock size={20} />
                </div>
              </div>

              <div className="space-y-3">
                {assignments.filter(a => a.shift === shift).map(person => (
                  <div key={person.id} className="flex items-center justify-between p-3 bg-[var(--bg-dark)] rounded-xl border border-[var(--border)] hover:border-[#1B4299]/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1B4299] flex items-center justify-center text-white text-[10px] font-bold">
                        {person.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[var(--text-primary)]">{person.name}</span>
                        <span className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider">{person.role}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-md">
                      <MapPin size={10} className="text-[#E8B200]" />
                      <span className="text-[10px] font-bold text-[var(--text-secondary)]">{person.line}</span>
                    </div>
                  </div>
                ))}
                {assignments.filter(a => a.shift === shift).length === 0 && (
                  <div className="py-8 text-center border border-dashed border-[var(--border)] rounded-xl">
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">No Assignments</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
