/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { 
  EFF_DATA, 
  HRS_DATA, 
  SCRAP_DATA,
  EFF_TARGET,
  HRS_TARGET,
  SCRAP_TARGET
} from '../constants/productionData';
import { api, getUserRole, getUsername, clearAuthData } from '../api';

export type UserRole = 'supervisor' | 'assistant' | 'hacker' | 'assistante';
export type Page =
  | 'dashboard'
  | 'data'
  | 'quality'
  | 'kaizen'
  | 'schedule'
  | 'satisfaction'
  | 'fives'
  | 'efficiency'
  | 'produced-hours'
  | 'scrap'
  | 'admin';

export type IncidentType = 
  | 'Cut/laceration' 
  | 'Bruise' 
  | 'Burn' 
  | 'Fracture' 
  | 'Strain/sprain' 
  | 'Electric shock' 
  | 'Chemical exposure' 
  | 'Other';

export type Severity = 'Minor' | 'Moderate' | 'Serious';

export interface Accident {
  id: string;
  date: string;
  time: string;
  bodyPart: string;
  type: IncidentType;
  severity: Severity;
  description?: string;
}

interface User {
  name: string;
  role: string;
  email: string;
}

export interface MetricPoint {
  line: string;
  actual: number;
  objective: number;
}

export interface WeeklyProducedHours {
  day: string;
  hours: number;
}

export interface SatisfactionMetrics {
  awardElement: number;
  semat: number;
  mmogle: number;
  ppm: number;
  qrIncidents: number;
  vcpa: number;
  launchIssues: number;
  logistics1: number;
  logistics2: number;
  escalation: number;
}

export interface MonthScrapData {
  name: string;
  days: number[];
  total: number | null;
}

export interface ProductionData {
  efficiency: MetricPoint[];
  scrap: MetricPoint[];
  scrapRolling: {
    mep1: MonthScrapData[];
    cm2: MonthScrapData[];
    cm3: MonthScrapData[];
    spa3: MonthScrapData[];
  };
  lpa: MetricPoint[];
  efficiencyBySegment: MetricPoint[];
  score5S: number;
  satisfaction: number;
  satisfactionMetrics: SatisfactionMetrics;
  producedHours: WeeklyProducedHours[];
  output: number;
  ncr: number;
  qualityStatus: 'OK' | 'NOK';
}

interface DashboardContextType {
  filter: 'Day' | 'Month';
  setFilter: (filter: 'Day' | 'Month') => void;
  user: User | null;
  login: (role: UserRole) => void; // legacy mock login (JWT login sets user from localStorage)
  logout: () => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activePage: Page;
  setActivePage: (page: Page) => void;
  accidents: Accident[];
  addAccident: (accident: Omit<Accident, 'id'>) => void;
  removeAccident: (id: string) => void;
  lastResetDate: string | null;
  resetAccidentCounter: () => void;
  carImageUrl: string;
  setCarImageUrl: (url: string) => void;
  teamPhotoUrl: string;
  setTeamPhotoUrl: (url: string) => void;
  productionData: ProductionData;
  updateProductionData: (data: Partial<ProductionData>) => void;
  importScrapData: (payload: { segment: string; value: number; day: number }) => void;
  importedData: Record<string, any>;
  updateImportedData: (filename: string, data: any) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const generateMockMonths = (baseTotal: number): MonthScrapData[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((name, i) => {
    const daysCount = i === 1 ? 28 : [3, 5, 8, 10].includes(i) ? 30 : 31;
    const days = Array.from({ length: daysCount }, () => Math.floor(Math.random() * 500) + 100);
    const isPending = i === 11; // December is pending
    return {
      name,
      days,
      total: isPending ? null : baseTotal + Math.floor(Math.random() * 2000) - 1000
    };
  });
};

const DEFAULT_PRODUCTION_DATA: ProductionData = {
  efficiency: [
    { line: 'CMA2', actual: 82, objective: 85 },
    { line: 'CMA3', actual: 78, objective: 85 },
    { line: 'MEP1', actual: 84, objective: 85 },
    { line: 'SPA3', actual: 81, objective: 85 },
  ],
  scrap: [
    { line: 'CMA2', actual: 2.4, objective: 1.5 },
    { line: 'CMA3', actual: 1.8, objective: 1.5 },
    { line: 'MEP1', actual: 2.1, objective: 1.5 },
    { line: 'SPA3', actual: 1.6, objective: 1.5 },
  ],
  scrapRolling: {
    mep1: generateMockMonths(8500),
    cm2: generateMockMonths(7200),
    cm3: generateMockMonths(9100),
    spa3: generateMockMonths(6800),
  },
  lpa: [
    { line: 'CMA2', actual: 940, objective: 950 },
    { line: 'CMA3', actual: 930, objective: 950 },
    { line: 'MEP1', actual: 960, objective: 950 },
    { line: 'SPA3', actual: 945, objective: 950 },
  ],
  efficiencyBySegment: [
    { line: 'CMA2', actual: 78, objective: 85 },
    { line: 'CMA3', actual: 84, objective: 85 },
    { line: 'MEP1', actual: 81, objective: 85 },
    { line: 'SPA3', actual: 88, objective: 85 },
  ],
  score5S: 92,
  satisfaction: 88,
  satisfactionMetrics: {
    awardElement: 60,
    semat: 60,
    mmogle: 30,
    ppm: 60,
    qrIncidents: 10,
    vcpa: 10,
    launchIssues: 10,
    logistics1: 10,
    logistics2: 10,
    escalation: 10
  },
  producedHours: [
    { day: 'Mon', hours: 180 },
    { day: 'Tue', hours: 210 },
    { day: 'Wed', hours: 195 },
    { day: 'Thu', hours: 220 },
    { day: 'Fri', hours: 205 },
    { day: 'Sat', hours: 150 },
    { day: 'Sun', hours: 80 },
  ],
  output: 450,
  ncr: 12,
  qualityStatus: 'OK'
};

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState<'Day' | 'Month'>('Day');
  const [user, setUser] = useState<User | null>(() => {
    const role = getUserRole();
    const name = getUsername();
    return role ? { name: name || 'User', role, email: 'user@leoni.com' } : null;
  });
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [importedData, setImportedData] = useState<Record<string, any>>({});
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const [carImageUrl, setCarImageUrl] = useState(() => {
    return localStorage.getItem('car_image_url') || "https://www.volvocarspoole.co.uk/media/images/52102584/EX30newsstory.jpg";
  });

  const [teamPhotoUrl, setTeamPhotoUrl] = useState(() => {
    return localStorage.getItem('team_photo_url') || "https://picsum.photos/seed/team/800/600";
  });

  const [productionData, setProductionData] = useState<ProductionData>(DEFAULT_PRODUCTION_DATA);
  const [accidents, setAccidents] = useState<Accident[]>([]);
  const [lastResetDate, setLastResetDate] = useState<string | null>(null);
  /** Skip first persist pass right after hydration so we do not POST before state is settled. */
  const skipNextPersist = useRef(true);

  useEffect(() => {
    const init = async () => {
      try {
        const data = await api.get('/dashboard') as Record<string, unknown>;
        if (data.productionData && typeof data.productionData === 'object') {
          setProductionData(data.productionData as ProductionData);
        }
        if (data.importedData && typeof data.importedData === 'object') {
          setImportedData(data.importedData as Record<string, any>);
        }
        const safety = data.safetyState as
          | { accidents?: Accident[]; lastResetDate?: string | null; carImageUrl?: string; teamPhotoUrl?: string }
          | undefined;
        if (safety && typeof safety === 'object') {
          if (Array.isArray(safety.accidents)) setAccidents(safety.accidents);
          if (safety.lastResetDate !== undefined) setLastResetDate(safety.lastResetDate ?? null);
          if (typeof safety.carImageUrl === 'string' && safety.carImageUrl.length > 0) {
            setCarImageUrl(safety.carImageUrl);
            localStorage.setItem('car_image_url', safety.carImageUrl);
          }
          if (typeof safety.teamPhotoUrl === 'string' && safety.teamPhotoUrl.length > 0) {
            setTeamPhotoUrl(safety.teamPhotoUrl);
            localStorage.setItem('team_photo_url', safety.teamPhotoUrl);
          }
        }
      } catch (e) {
        console.error("Failed to load initial data", e);
      } finally {
        setIsDataLoaded(true);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!isDataLoaded) return;
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }
    const t = window.setTimeout(() => {
      const safetyState = {
        accidents,
        lastResetDate,
        carImageUrl,
        teamPhotoUrl,
      };
      api
        .post('/sync', { productionData, importedData, safetyState })
        .catch((e) => console.error('Sync failed', e));
    }, 600);
    return () => window.clearTimeout(t);
  }, [
    isDataLoaded,
    productionData,
    importedData,
    accidents,
    lastResetDate,
    carImageUrl,
    teamPhotoUrl,
  ]);

  useEffect(() => {
    if (!isDataLoaded) return;
    localStorage.setItem('car_image_url', carImageUrl);
  }, [carImageUrl, isDataLoaded]);

  useEffect(() => {
    if (!isDataLoaded) return;
    localStorage.setItem('team_photo_url', teamPhotoUrl);
  }, [teamPhotoUrl, isDataLoaded]);

  const login = (role: UserRole) => {
    setUser({
      name: role === 'supervisor' ? 'Adam Supervisor' : role === 'hacker' ? 'Admin' : 'User',
      role,
      email: 'user@leoni.com',
    });
    setActivePage('dashboard');
  };

  const logout = () => {
    clearAuthData();
    setUser(null);
    window.location.reload();
  };

  const addAccident = (accident: Omit<Accident, 'id'>) => {
    const newAccident = { ...accident, id: Math.random().toString(36).substr(2, 9) };
    setAccidents(prev => [newAccident, ...prev]);
  };

  const removeAccident = (id: string) => {
    setAccidents(prev => prev.filter(acc => acc.id !== id));
  };

  const resetAccidentCounter = () => {
    setLastResetDate(new Date().toISOString().split('T')[0]);
    setAccidents([]);
  };

  const updateProductionData = (data: Partial<ProductionData>) => {
    setProductionData((prev) => ({ ...prev, ...data }));
  };

  const updateImportedData = (filename: string, data: any) => {
    setImportedData((prev) => ({ ...prev, [filename]: data }));
  };

  const importScrapData = ({ segment, value, day }: { segment: string; value: number; day: number }) => {
    setProductionData((prev) => {
      const newData = { ...prev };
      const rolling = { ...newData.scrapRolling };
      const mapping: Record<string, keyof ProductionData['scrapRolling']> = {
        'assemblage mp1 fx': 'mep1',
        'assemblage cma2': 'cm2',
        'assemblage cma3': 'cm3',
        'assemblage spa3': 'spa3',
      };
      const key = mapping[segment.toLowerCase()];
      if (!key) return prev;
      const series = [...rolling[key]];
      const currentMonthIndex = series.length - 1;
      if (currentMonthIndex < 0) return prev;
      const monthData = { ...series[currentMonthIndex] };
      const days = [...monthData.days];
      if (day > 0 && day <= days.length) days[day - 1] = value;
      monthData.days = days;
      monthData.total = days.reduce((a, b) => a + b, 0);
      series[currentMonthIndex] = monthData;
      rolling[key] = series;
      return { ...newData, scrapRolling: rolling };
    });
  };

  if (!isDataLoaded) {
    return (
      <div className="min-h-screen bg-[var(--bg-dark)] flex flex-col items-center justify-center gap-6 p-8">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full border-2 border-[var(--border)]" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--volvo-blue)] animate-spin" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-[var(--text-primary)] text-sm font-bold tracking-tight">LEONI · Volvo MEP1</p>
          <p className="text-[var(--text-muted)] text-xs font-medium">Loading dashboard data…</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardContext.Provider value={{ 
      filter, 
      setFilter, 
      user, 
      login, 
      logout,
      isSidebarOpen,
      setSidebarOpen,
      activePage,
      setActivePage,
      accidents,
      addAccident,
      removeAccident,
      lastResetDate,
      resetAccidentCounter,
      carImageUrl,
      setCarImageUrl,
      teamPhotoUrl,
      setTeamPhotoUrl,
      productionData,
      updateProductionData,
      importScrapData,
      importedData,
      updateImportedData
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
