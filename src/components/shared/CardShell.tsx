/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardShellProps {
  title: string;
  icon?: ReactNode;
  alert?: boolean;
  className?: string;
  children: ReactNode;
  number?: number;
}

export default function CardShell({ title, icon, alert, className, children }: CardShellProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'glass p-5 h-full flex flex-col relative',
        'hover:-translate-y-1',
        alert && 'ring-2 ring-[var(--warning)]/50 shadow-[var(--warning)]/20',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          {icon && <div className="p-1.5 bg-[var(--volvo-blue)]/10 rounded-lg text-[var(--volvo-blue)]">{icon}</div>}
          <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[var(--text-secondary)]">
            {title}
          </span>
        </div>
        {alert && (
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <AlertTriangle size={14} className="text-[#f59e0b]" />
          </motion.div>
        )}
      </div>
      <div className="flex-1 overflow-hidden flex flex-col">
        {children}
      </div>
    </motion.div>
  );
}
