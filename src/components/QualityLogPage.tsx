/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Plus, Search, Filter, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface NCR {
  id: string;
  date: string;
  line: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Closed';
}

export default function QualityLogPage() {
  const [ncrs, setNcrs] = useState<NCR[]>([
    { id: '1', date: '04/07/2026', line: 'Ligne P1', description: 'Défaut d\'isolation sur connecteur principal.', severity: 'High', status: 'In Progress' },
    { id: '2', date: '04/07/2026', line: 'Ligne P3', description: 'Étiquetage manquant sur faisceau batterie.', severity: 'Medium', status: 'Open' },
    { id: '3', date: '04/06/2026', line: 'Ligne P2', description: 'Légère rayure sur le boîtier de protection.', severity: 'Low', status: 'Closed' },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newNcr, setNewNcr] = useState({ line: 'Ligne P1', description: '', severity: 'Medium' as const });

  const addNcr = () => {
    if (!newNcr.description) return;
    const ncr: NCR = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString('en-US'),
      line: newNcr.line,
      description: newNcr.description,
      severity: newNcr.severity,
      status: 'Open'
    };
    setNcrs([ncr, ...ncrs]);
    setIsAdding(false);
    setNewNcr({ line: 'Ligne P1', description: '', severity: 'Medium' });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <ShieldAlert className="text-[#ef4444]" />
            Quality Log (NCR Tracking)
          </h1>
          <p className="text-[var(--text-secondary)] text-sm">Suivi des non-conformités et actions correctives.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1B4299] text-white rounded-xl font-bold hover:bg-[#1B4299]/90 transition-all shadow-lg shadow-[#1B4299]/20"
        >
          <Plus size={18} />
          Nouvelle NCR
        </button>
      </div>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl"
        >
          <h2 className="text-lg font-bold mb-4">Enregistrer une Non-Conformité</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Ligne</label>
              <select 
                value={newNcr.line}
                onChange={(e) => setNewNcr({...newNcr, line: e.target.value})}
                className="w-full bg-[var(--bg-dark)] border border-[var(--border)] rounded-xl px-4 py-2 text-sm"
              >
                <option>Ligne P1</option>
                <option>Ligne P2</option>
                <option>Ligne P3</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Gravité</label>
              <select 
                value={newNcr.severity}
                onChange={(e) => setNewNcr({...newNcr, severity: e.target.value as any})}
                className="w-full bg-[var(--bg-dark)] border border-[var(--border)] rounded-xl px-4 py-2 text-sm"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div className="md:col-span-3 space-y-1">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Description du défaut</label>
              <textarea 
                value={newNcr.description}
                onChange={(e) => setNewNcr({...newNcr, description: e.target.value})}
                placeholder="Décrivez le problème constaté..."
                className="w-full bg-[var(--bg-dark)] border border-[var(--border)] rounded-xl px-4 py-2 text-sm h-24"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-[var(--text-secondary)] font-bold">Annuler</button>
            <button onClick={addNcr} className="px-6 py-2 bg-[#1B4299] text-white rounded-xl font-bold">Enregistrer</button>
          </div>
        </motion.div>
      )}

      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[var(--bg-dark)] border-b border-[var(--border)]">
                <th className="px-6 py-4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Ligne</th>
                <th className="px-6 py-4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Gravité</th>
                <th className="px-6 py-4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {ncrs.map((ncr) => (
                <tr key={ncr.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{ncr.date}</td>
                  <td className="px-6 py-4 text-sm font-bold">{ncr.line}</td>
                  <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{ncr.description}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      ncr.severity === 'High' ? 'bg-[#ef4444]/10 text-[#ef4444]' :
                      ncr.severity === 'Medium' ? 'bg-[#E8B200]/10 text-[#E8B200]' :
                      'bg-[#22c55e]/10 text-[#22c55e]'
                    }`}>
                      {ncr.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {ncr.status === 'Closed' ? <CheckCircle2 size={14} className="text-[#22c55e]" /> :
                       ncr.status === 'In Progress' ? <Clock size={14} className="text-[#E8B200]" /> :
                       <AlertCircle size={14} className="text-[#ef4444]" />}
                      <span className="text-xs font-medium">{ncr.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
