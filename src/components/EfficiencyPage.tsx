/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';
import ProductionMetricsSection from './ProductionMetricsSection';
import { 
  EFF_TARGET, 
  EFF_DATA
} from '../constants/productionData';

export default function EfficiencyPage() {
  return (
    <div className="flex-1 bg-slate-50/50 p-8 overflow-y-auto">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#185FA5] rounded-lg shadow-lg shadow-[#185FA5]/20">
            <Zap size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Efficiency Analysis</h1>
        </div>
        <p className="text-slate-500 font-bold ml-11 uppercase tracking-widest text-xs">
          Production line performance tracking & trend analysis
        </p>
      </header>

      <div className="max-w-[1400px]">
        <ProductionMetricsSection 
          title="Line Efficiency (%)"
          target={EFF_TARGET}
          data={EFF_DATA}
          baseColor="#185FA5"
        />
      </div>
    </div>
  );
}
