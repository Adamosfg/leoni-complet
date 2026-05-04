import React, { useState } from 'react';
import { api, getUserRole } from '../api';
import { ShieldCheck, UserPlus, AlertCircle } from 'lucide-react';

export default function HackerAdminPage() {
  const role = getUserRole();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newRole, setNewRole] = useState('supervisor');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (role !== 'hacker') {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-red-500 font-bold p-8 bg-red-50 rounded-xl border border-red-200">
          <AlertCircle size={40} className="mx-auto mb-4" />
          <h2 className="text-xl">ACCESS DENIED</h2>
          <p>You do not have administrative privileges to view this page.</p>
        </div>
      </div>
    );
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await api.post('/auth/register', { username, password, role: newRole });
      setMessage(res.message);
      setUsername('');
      setPassword('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create user';
      try {
        const parsed = JSON.parse(msg) as { error?: string };
        setError(parsed.error || msg);
      } catch {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 p-8">
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-900 rounded-lg text-green-400">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase">Hacker Admin Control</h1>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">System Administration</p>
          </div>
        </div>
      </header>

      <div className="max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
          <UserPlus size={20} className="text-[var(--leoni-blue)]" />
          Create New User
        </h2>

        {message && <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm font-bold rounded-lg border border-green-200">{message}</div>}
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-bold rounded-lg border border-red-200">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[var(--leoni-blue)]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[var(--leoni-blue)]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Role</label>
            <select 
              value={newRole}
              onChange={e => setNewRole(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[var(--leoni-blue)]"
            >
              <option value="supervisor">Supervisor</option>
              <option value="assistante">Assistante</option>
              <option value="hacker">Hacker (Admin)</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-black text-green-400 font-black py-3 rounded-lg shadow-lg transition-all mt-4 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
