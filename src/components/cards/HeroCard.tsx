/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useDashboard } from '../../context/DashboardContext';

export default function HeroCard({ number }: { number?: number }) {
  const { carImageUrl } = useDashboard();
  
  return (
    <div className="glass overflow-hidden h-full relative group">
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--text-primary)] via-transparent to-transparent opacity-80 z-10 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-90"></div>
      
      <motion.img
        key={carImageUrl}
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        src={carImageUrl}
        alt="volvo ex30"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20 flex justify-between items-end">
        <div>
          <span className="inline-block px-2 py-0.5 bg-[var(--volvo-blue)] text-white text-[9px] font-black uppercase tracking-widest rounded-sm mb-1.5 shadow-md">Active Line</span>
          <h2 className="text-white text-lg font-black uppercase tracking-tight drop-shadow-md leading-none">volvo ex30</h2>
        </div>
        <div className="text-right">
          <div className="text-white/80 text-[10px] font-bold uppercase tracking-widest mb-0.5">Current Build</div>
          <div className="text-white text-xl font-black drop-shadow-md leading-none">142<span className="text-[10px] text-white/60 ml-1">/150</span></div>
        </div>
      </div>
    </div>
  );
}
