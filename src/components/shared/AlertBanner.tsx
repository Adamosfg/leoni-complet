/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AlertBannerProps {
  message: string;
  type?: 'warning' | 'danger';
}

export default function AlertBanner({ message, type = 'warning' }: AlertBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className={`flex items-center gap-2 p-2 rounded-[6px] mb-3 ${
          type === 'warning' ? 'bg-[#f59e0b]/10 text-[#f59e0b]' : 'bg-[#ef4444]/10 text-[#ef4444]'
        }`}
      >
        <AlertTriangle size={14} className="shrink-0" />
        <span className="text-[11px] font-medium flex-1">{message}</span>
        <button 
          onClick={() => setIsVisible(false)}
          className="p-0.5 hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={12} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
