/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import SatisfactionGraphic from './SatisfactionGraphic';
import { useDashboard } from '../context/DashboardContext';

export default function SatisfactionPage() {
  const { productionData } = useDashboard();

  return (
    <div className="flex-1 w-full flex items-center justify-center p-4 min-h-0 bg-slate-50 shadow-[inset_0_0_100px_rgba(0,0,0,0.02)]">
      <div className="bg-white w-full max-w-[min(90vw,90vh)] aspect-square rounded-[40px] border border-slate-200 shadow-2xl relative overflow-hidden group flex items-center justify-center">
        {/* Decorative elements */}
        <div className="absolute top-[-200px] right-[-200px] w-[500px] h-[500px] bg-[#1B4299]/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-150px] left-[-150px] w-96 h-96 bg-[#1B4299]/2 blur-[100px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="w-full h-full flex items-center justify-center p-8"
        >
          <div className="w-full h-full relative flex items-center justify-center">
            <SatisfactionGraphic size="large" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
