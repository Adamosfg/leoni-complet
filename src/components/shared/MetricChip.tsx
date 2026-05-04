/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MetricChipProps {
  value: string | number;
  unit?: string;
  delta?: string;
  deltaPositive?: boolean;
  className?: string;
}

export default function MetricChip({ value, unit, delta, deltaPositive, className }: MetricChipProps) {
  return (
    <div className={cn('flex items-baseline gap-2 mb-4', className)}>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl md:text-3xl font-medium text-[var(--text-primary)] font-mono leading-none">
          {value}
        </span>
        {unit && (
          <span className="text-[12px] text-[var(--text-secondary)] font-medium">
            {unit}
          </span>
        )}
      </div>
      {delta && (
        <div className={cn(
          'px-1.5 py-0.5 rounded-[6px] text-[10px] font-medium leading-none',
          deltaPositive ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-[#ef4444]/10 text-[#ef4444]'
        )}>
          {delta}
        </div>
      )}
    </div>
  );
}
