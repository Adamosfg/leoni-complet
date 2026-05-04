/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Recycle } from 'lucide-react';
import ProductionMetricsSection from './ProductionMetricsSection';
import { 
  SCRAP_TARGET
} from '../constants/productionData';
import { useScrapData } from '../hooks/useScrapData';

export default function ScrapPage() {
  const scrapData = useScrapData();
  return (
    <div className="flex-1 bg-slate-50/50 p-8 overflow-y-auto">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-orange-600 rounded-lg shadow-lg shadow-orange-600/20">
            <Recycle size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Scrap Analysis</h1>
        </div>
        <p className="text-slate-500 font-bold ml-11 uppercase tracking-widest text-xs">
          Material waste tracking & segment yield performance
        </p>
      </header>

      <div className="max-w-[1400px]">
        <ProductionMetricsSection 
          title="Scrap Rate (%)"
          target={SCRAP_TARGET}
          data={scrapData}
          baseColor="#EA580C"
          lowerIsBetter={true}
        />
      </div>
    </div>
  );
}
