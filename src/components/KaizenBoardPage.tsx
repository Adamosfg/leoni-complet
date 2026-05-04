/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, Reorder } from 'motion/react';
import { Lightbulb, Plus, Trash2, CheckCircle2, Circle, Clock } from 'lucide-react';

interface KaizenIdea {
  id: string;
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Done';
  author: string;
}

export default function KaizenBoardPage() {
  const [ideas, setIdeas] = useState<KaizenIdea[]>([
    { id: '1', title: 'Optimisation du flux P1', description: 'Réorganiser les bacs de composants pour réduire les déplacements.', status: 'In Progress', author: 'Adam S.' },
    { id: '2', title: 'Nouveau support de test', description: 'Créer un gabarit pour faciliter le test d\'étanchéité.', status: 'To Do', author: 'Sarah A.' },
    { id: '3', title: 'Amélioration éclairage P3', description: 'Ajouter des LED sur les postes de sertissage.', status: 'Done', author: 'Marc P.' },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newIdea, setNewIdea] = useState({ title: '', description: '', author: '' });

  const addIdea = () => {
    if (!newIdea.title || !newIdea.description) return;
    const idea: KaizenIdea = {
      id: Math.random().toString(36).substr(2, 9),
      title: newIdea.title,
      description: newIdea.description,
      status: 'To Do',
      author: newIdea.author || 'Anonyme'
    };
    setIdeas([idea, ...ideas]);
    setIsAdding(false);
    setNewIdea({ title: '', description: '', author: '' });
  };

  const deleteIdea = (id: string) => {
    setIdeas(ideas.filter(i => i.id !== id));
  };

  const updateStatus = (id: string, status: KaizenIdea['status']) => {
    setIdeas(ideas.map(i => i.id === id ? { ...i, status } : i));
  };

  const columns: KaizenIdea['status'][] = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Lightbulb className="text-[#E8B200]" />
            Kaizen Board
          </h1>
          <p className="text-[var(--text-secondary)] text-sm">Continuous Improvement — MEP1 Section Ideas.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#E8B200] text-black rounded-xl font-bold hover:bg-[#E8B200]/90 transition-all shadow-lg shadow-[#E8B200]/20"
        >
          <Plus size={18} />
          Suggérer une Idée
        </button>
      </div>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-6 bg-white border border-slate-200 rounded-2xl shadow-xl"
        >
          <h2 className="text-lg font-black mb-4 text-slate-900 uppercase tracking-tight">Nouvelle Idée d'Amélioration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Titre de l'idée</label>
              <input 
                type="text" 
                value={newIdea.title}
                onChange={(e) => setNewIdea({...newIdea, title: e.target.value})}
                placeholder="Ex: Optimisation du poste 4..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#1B4299]/20 transition-all outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Votre Nom</label>
              <input 
                type="text" 
                value={newIdea.author}
                onChange={(e) => setNewIdea({...newIdea, author: e.target.value})}
                placeholder="Optionnel..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#1B4299]/20 transition-all outline-none"
              />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description du bénéfice</label>
              <textarea 
                value={newIdea.description}
                onChange={(e) => setNewIdea({...newIdea, description: e.target.value})}
                placeholder="Comment cela va-t-il aider l'équipe ?"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold h-24 focus:ring-2 focus:ring-[#1B4299]/20 transition-all outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-500 font-black uppercase tracking-widest text-[11px]">Annuler</button>
            <button onClick={addIdea} className="px-8 py-3 bg-[#1B4299] text-white rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-[#1B4299]/20">Soumettre</button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(col => (
          <div key={col} className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  col === 'To Do' ? 'bg-[#dc2626]' :
                  col === 'In Progress' ? 'bg-[#d97706]' :
                  'bg-[#16a34a]'
                }`} />
                {col}
              </h3>
              <span className="text-[10px] font-black bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-400">
                {ideas.filter(i => i.status === col).length}
              </span>
            </div>

            <div className="flex flex-col gap-4 min-h-[500px] bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2rem] p-4">
              {ideas.filter(i => i.status === col).map(idea => (
                <motion.div 
                  layout
                  key={idea.id}
                  className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-xl hover:border-[#1B4299]/20 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h4 className="text-sm font-black text-slate-900 leading-tight tracking-tight">{idea.title}</h4>
                    <button 
                      onClick={() => deleteIdea(idea.id)}
                      className="text-slate-300 hover:text-[#dc2626] transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="text-[11px] font-bold text-slate-500 mb-6 leading-relaxed line-clamp-3">{idea.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">By {idea.author}</span>
                    <div className="flex gap-1">
                      {columns.map(c => (
                        <button
                          key={c}
                          onClick={() => updateStatus(idea.id, c)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                            idea.status === c ? 'bg-[#1B4299] text-white shadow-lg shadow-[#1B4299]/20' : 'bg-slate-50 text-slate-400 hover:text-[#1B4299]'
                          }`}
                        >
                          {c === 'To Do' ? <Circle size={14} /> :
                           c === 'In Progress' ? <Clock size={14} /> :
                           <CheckCircle2 size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
