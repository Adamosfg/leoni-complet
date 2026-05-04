/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Clock } from 'lucide-react';
import ProductionMetricsSection from './ProductionMetricsSection';
import { 
  HRS_TARGET, 
  HRS_DATA
} from '../constants/productionData';

export default function ProducedHoursPage() {
  return (
    <div className="flex-1 bg-slate-50/50 p-8 overflow-y-auto">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#3B6D11] rounded-lg shadow-lg shadow-[#3B6D11]/20">
            <Clock size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Produced Hours</h1>
        </div>
        <p className="text-slate-500 font-bold ml-11 uppercase tracking-widest text-xs">
          Capacity measurement and labor production tracking
        </p>
      </header>

      <div className="max-w-[1400px]">
        <ProductionMetricsSection 
          title="Capacity Output (H)"
          target={HRS_TARGET}
          data={HRS_DATA}
          baseColor="#3B6D11"
        />
      </div>
    </div>
  );
}
