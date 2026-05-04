import React, { useState } from 'react';
import { motion } from 'motion/react';
import { api, setAuthData } from '../api';
import { ShieldAlert, User, Lock, ArrowRight, Activity } from 'lucide-react';

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.post('/auth/login', { username, password });
      setAuthData(data.token, data.role, data.username);
      onLogin();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      try {
        const parsed = JSON.parse(msg) as { error?: string };
        setError(parsed.error || msg);
      } catch {
        setError(msg || 'Login failed. Ensure the API is running on port 5000.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-[var(--leoni-blue)] p-8 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Activity size={100} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter mb-2 relative z-10">LEONI</h1>
            <p className="text-white/80 text-sm font-bold tracking-widest uppercase relative z-10">Line Manager Portal</p>
          </div>

          <div className="p-8">
            <h2 className="text-2xl font-black text-slate-800 mb-6">Sign In</h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm font-bold border border-red-100">
                <ShieldAlert size={18} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Username</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <User size={18} />
                  </div>
                  <input 
                    type="text" 
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[var(--leoni-blue)] focus:border-transparent transition-all"
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[var(--leoni-blue)] focus:border-transparent transition-all"
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[var(--leoni-blue)] hover:bg-[#124982] text-white font-black py-4 rounded-xl shadow-lg shadow-[var(--leoni-blue)]/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {loading ? 'Authenticating...' : 'Secure Login'}
                {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          </div>
        </div>
        
        <p className="text-center text-xs font-bold text-slate-400 mt-6 uppercase tracking-widest">
          Secure Internal Access Only
        </p>
      </motion.div>
    </div>
  );
}
