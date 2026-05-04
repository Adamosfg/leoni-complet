/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import LoginPage from './components/LoginPage';
import DataEntryPage from './components/DataEntryPage';
import QualityLogPage from './components/QualityLogPage';
import KaizenBoardPage from './components/KaizenBoardPage';
import ShiftSchedulePage from './components/ShiftSchedulePage';
import SatisfactionPage from './components/SatisfactionPage';
import FiveSPage from './components/FiveSPage';
import EfficiencyPage from './components/EfficiencyPage';
import ProducedHoursPage from './components/ProducedHoursPage';
import ScrapPage from './components/ScrapPage';
import HeroCard from './components/cards/HeroCard';
import MiniScrapCard from './components/cards/MiniScrapCard';
import LPACard from './components/cards/LPACard';
import TeamPhotoCard from './components/cards/TeamPhotoCard';
import SatisfactionCard from './components/cards/SatisfactionCard';
import InjuryTrackerCard from './components/cards/InjuryTrackerCard';
import MiniFiveSChartCard from './components/cards/MiniFiveSChartCard';
import MiniEfficiencyCard from './components/cards/MiniEfficiencyCard';
import MiniProducedHoursCard from './components/cards/MiniProducedHoursCard';
import SafetyTimelineCard from './components/cards/SafetyTimelineCard';
import QualityCalendarCard from './components/cards/QualityCalendarCard';
import HackerAdminPage from './components/HackerAdminPage';
import { getAuthToken } from './api';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard } from 'lucide-react';

function DashboardApp() {
  const { isSidebarOpen, activePage } = useDashboard();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-[var(--text-primary)] font-sans selection:bg-[var(--volvo-blue)]/20 flex transition-colors duration-300">
      <Sidebar />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'pl-[280px]' : 'pl-0'}`}>
        <TopBar />
        
        <main className="pt-[64px] w-full flex flex-col flex-1">
          <AnimatePresence mode="wait">
            {activePage === 'dashboard' ? (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="mx-auto w-full max-w-[1600px] space-y-5 p-4 md:p-6"
              >
                <header className="flex flex-col gap-1 border-b border-[var(--border)] pb-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h1 className="text-lg font-black tracking-tight text-[var(--text-primary)] md:text-xl">
                      Operations dashboard
                    </h1>
                    <p className="text-xs font-medium text-[var(--text-muted)]">
                      MEP1 · KPIs, quality, safety, and team metrics
                    </p>
                  </div>
                </header>
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                >
                  {/* Row 1 */}
                  <div className="h-[240px]"><HeroCard /></div>
                  <div className="h-[240px]"><InjuryTrackerCard /></div>
                  <div className="h-[240px]"><SafetyTimelineCard /></div>
                  
                  {/* Row 2 */}
                  <div className="h-[280px]"><QualityCalendarCard /></div>
                  <div className="h-[280px]"><MiniEfficiencyCard /></div>
                  <div className="h-[280px]"><MiniScrapCard /></div>
                  
                  {/* Row 3 */}
                  <div className="h-[280px]"><SatisfactionCard /></div>
                  <div className="h-[280px]"><MiniProducedHoursCard /></div>
                  <div className="h-[280px]"><LPACard /></div>
                  
                  {/* Row 4 */}
                  <div className="h-[280px]"><MiniFiveSChartCard /></div>
                  <div className="h-[280px]"><TeamPhotoCard /></div>
                </motion.div>
              </motion.div>
            ) : activePage === 'data' ? (
              <motion.div
                key="data"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <DataEntryPage />
              </motion.div>
            ) : activePage === 'quality' ? (
              <motion.div
                key="quality"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 flex flex-col"
              >
                <QualityLogPage />
              </motion.div>
            ) : activePage === 'kaizen' ? (
              <motion.div
                key="kaizen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex-1 flex flex-col"
              >
                <KaizenBoardPage />
              </motion.div>
            ) : activePage === 'schedule' ? (
              <motion.div
                key="schedule"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex-1 flex flex-col"
              >
                <ShiftSchedulePage />
              </motion.div>
            ) : activePage === 'satisfaction' ? (
              <motion.div
                key="satisfaction"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex-1 flex flex-col"
              >
                <SatisfactionPage />
              </motion.div>
            ) : activePage === 'fives' ? (
              <motion.div
                key="fives"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 flex flex-col"
              >
                <FiveSPage />
              </motion.div>
            ) : activePage === 'efficiency' ? (
              <motion.div
                key="efficiency"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <EfficiencyPage />
              </motion.div>
            ) : activePage === 'produced-hours' ? (
              <motion.div
                key="produced-hours"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <ProducedHoursPage />
              </motion.div>
            ) : activePage === 'scrap' ? (
              <motion.div
                key="scrap"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <ScrapPage />
              </motion.div>
            ) : activePage === 'admin' ? (
              <motion.div
                key="admin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col"
              >
                <HackerAdminPage />
              </motion.div>
            ) : (
              <motion.div
                key={activePage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex-1 flex items-center justify-center p-8"
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-[#1B4299]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <LayoutDashboard size={40} className="text-[#1B4299]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2 uppercase tracking-tight">
                    {activePage.replace('_', ' ')}
                  </h2>
                  <p className="text-[var(--text-secondary)] max-w-md mx-auto">
                    This section is currently being optimized for the MEP1 Volvo production line. 
                    Real-time data integration for {activePage} will be available in the next update.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="flex flex-col items-center justify-center gap-2 border-t border-[var(--border)]/60 p-8 opacity-50">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#1B4299]">LEONI Berrechid</span>
            <div className="w-1 h-1 rounded-full bg-[var(--text-secondary)]" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Volvo</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAuthToken());

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <DashboardProvider>
      <DashboardApp />
    </DashboardProvider>
  );
}
