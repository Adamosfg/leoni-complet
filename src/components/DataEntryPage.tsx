/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { 
  ArrowLeft, 
  Save, 
  CheckCircle2, 
  Activity, 
  ShieldAlert, 
  Trash2, 
  Sparkles,
  AlertCircle,
  Calendar,
  Clock,
  User as UserIcon,
  ChevronRight,
  FileSpreadsheet,
  Upload,
  Info
} from 'lucide-react';
import { useDashboard, SatisfactionMetrics } from '../context/DashboardContext';
import { motion, AnimatePresence } from 'motion/react';

export default function DataEntryPage() {
  const { 
    user, 
    setActivePage, 
    addAccident, 
    resetAccidentCounter, 
    removeAccident, 
    productionData, 
    updateProductionData,
    importScrapData,
    carImageUrl,
    setCarImageUrl,
    teamPhotoUrl,
    setTeamPhotoUrl
  } = useDashboard();
  
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [selectedImportDay, setSelectedImportDay] = useState(new Date().getDate());
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    // Supervisor fields (2, 3, 8, 9, 11, 12)
    efficiency: productionData.efficiency.map(p => ({ ...p })),
    lpa: productionData.lpa.map(p => ({ ...p })),
    producedHours: productionData.producedHours.map(p => ({ ...p, hours: p.hours.toString() })),
    teamPhotoUrl: teamPhotoUrl,
    
    // Assistant fields (4, 5, 6, 7, 10 + Car Picture)
    scrap: productionData.scrap.map(p => ({ ...p })),
    efficiencyBySegment: productionData.efficiencyBySegment.map(p => ({ ...p })),
    score5S: productionData.score5S.toString(),
    satisfaction: productionData.satisfaction.toString(),
    satisfactionMetrics: Object.entries(productionData.satisfactionMetrics).reduce((acc, [key, val]) => ({
      ...acc,
      [key]: val === 0 ? '' : val.toString()
    }), {} as Record<string, string>),
    qualityStatus: productionData.qualityStatus,
    carImageUrl: carImageUrl,
    
    // Shared
    date: new Date().toLocaleDateString(),
    shift: '',
    
    // Accident (Supervisor handles 2)
    hasAccident: false,
    accidentDate: new Date().toISOString().split('T')[0],
    accidentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    bodyPart: '',
    incidentType: '',
    severity: 'Minor' as 'Minor' | 'Moderate' | 'Serious',
    accidentDescription: ''
  });

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  if (!user) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const isNumeric = (val: string | number) => /^\d+(\.\d+)?$/.test(val.toString());
    
    // Validate all fields since the form is now unified
    formData.efficiency.forEach((p, i) => {
      if (!isNumeric(p.actual)) newErrors[`efficiency_${i}_actual`] = "Required";
      if (!isNumeric(p.objective)) newErrors[`efficiency_${i}_objective`] = "Required";
    });
    formData.lpa.forEach((p, i) => {
      if (!isNumeric(p.actual)) newErrors[`lpa_${i}_actual`] = "Required";
      if (!isNumeric(p.objective)) newErrors[`lpa_${i}_objective`] = "Required";
    });
    formData.producedHours.forEach((p, i) => {
      if (!isNumeric(p.hours)) newErrors[`producedHours_${i}`] = "Required";
    });
    formData.scrap.forEach((p, i) => {
      if (!isNumeric(p.actual)) newErrors[`scrap_${i}_actual`] = "Required";
      if (!isNumeric(p.objective)) newErrors[`scrap_${i}_objective`] = "Required";
    });
    formData.efficiencyBySegment.forEach((p, i) => {
      if (!isNumeric(p.actual)) newErrors[`efficiencyBySegment_${i}_actual`] = "Required";
      if (!isNumeric(p.objective)) newErrors[`efficiencyBySegment_${i}_objective`] = "Required";
    });
    
    if (!isNumeric(formData.score5S)) newErrors.score5S = "Must be a number.";
    if (!isNumeric(formData.satisfaction)) newErrors.satisfaction = "Must be a number.";

    if (formData.hasAccident) {
      if (!formData.bodyPart) newErrors.bodyPart = "Required.";
      if (!formData.incidentType) newErrors.incidentType = "Required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    setIsSaving(true);
    
    updateProductionData({
      efficiency: formData.efficiency.map(p => ({ ...p, actual: Number(p.actual), objective: Number(p.objective) })),
      lpa: formData.lpa.map(p => ({ ...p, actual: Number(p.actual), objective: Number(p.objective) })),
      producedHours: formData.producedHours.map(p => ({ ...p, hours: Number(p.hours) })),
      scrap: formData.scrap.map(p => ({ ...p, actual: Number(p.actual), objective: Number(p.objective) })),
      efficiencyBySegment: formData.efficiencyBySegment.map(p => ({ ...p, actual: Number(p.actual), objective: Number(p.objective) })),
      score5S: Number(formData.score5S),
      satisfaction: Number(formData.satisfaction),
      satisfactionMetrics: Object.entries(formData.satisfactionMetrics).reduce((acc, [key, val]) => ({
        ...acc,
        [key]: val === '' ? 0 : Number(val)
      }), {} as any),
      qualityStatus: formData.qualityStatus as 'OK' | 'NOK'
    });

    setTeamPhotoUrl(formData.teamPhotoUrl);
    setCarImageUrl(formData.carImageUrl);

    if (formData.hasAccident) {
      addAccident({
        date: formData.accidentDate,
        time: formData.accidentTime,
        bodyPart: formData.bodyPart,
        type: formData.incidentType as any,
        severity: formData.severity,
        description: formData.accidentDescription
      });
    }

    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    }, 1500);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus({ message: "Importing data..." });

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const dataArr = evt.target?.result;
        if (!dataArr) return;
        const wb = XLSX.read(dataArr, { type: 'array' });
        
        // Find sheet named "rebut" (case insensitive)
        const sheetName = wb.SheetNames.find(n => n.toLowerCase() === 'rebut');
        if (!sheetName) {
          throw new Error("Sheet 'rebut' not found. Please ensure your Excel has a sheet named 'rebut'.");
        }

        const ws = wb.Sheets[sheetName];
        // Convert to JSON using column letters as keys
        const rows = XLSX.utils.sheet_to_json(ws, { header: 'A', defval: '' }) as any[];
        
        let count = 0;
        rows.forEach((row: any) => {
          const segment = row['G'];
          const val = row['H'];
          
          if (segment && (typeof val === 'number' || (typeof val === 'string' && val.trim() !== '' && !isNaN(Number(val))))) {
            const numericValue = typeof val === 'number' ? val : Number(val);
            
            const targets = [
              'assemblage mp1 fx', 
              'assemblage cma2', 
              'assemblage cma3', 
              'assemblage spa3'
            ];
            
            const trimmedSegment = segment.toString().trim().toLowerCase();
            if (targets.includes(trimmedSegment)) {
              importScrapData({
                segment: trimmedSegment,
                value: numericValue,
                day: selectedImportDay
              });
              count++;
            }
          }
        });

        if (count > 0) {
          setImportStatus({ success: true, message: `Successfully imported ${count} records for Day ${selectedImportDay}.` });
          setTimeout(() => setImportStatus(null), 5000);
        } else {
          setImportStatus({ success: false, message: "No matching segment data found in 'rebut' sheet (Columns G & H)." });
        }
      } catch (err: any) {
        setImportStatus({ success: false, message: err.message || "Error parsing file." });
      }
      
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsArrayBuffer(file);
  };

  const handleMetricChange = (metric: 'efficiency' | 'lpa' | 'scrap' | 'efficiencyBySegment', index: number, field: 'actual' | 'objective', value: string) => {
    setFormData(prev => {
      const newData = [...prev[metric]];
      newData[index] = { ...newData[index], [field]: value };
      return { ...prev, [metric]: newData };
    });
    const errorKey = `${metric}_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
    }
  };

  const handleProducedHoursChange = (index: number, value: string) => {
    setFormData(prev => {
      const newData = [...prev.producedHours];
      newData[index] = { ...newData[index], hours: value };
      return { ...prev, producedHours: newData };
    });
    const errorKey = `producedHours_${index}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
    }
  };

  const handleSatisfactionMetricChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      satisfactionMetrics: {
        ...prev.satisfactionMetrics,
        [key]: value
      }
    }));
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button 
              onClick={() => setActivePage('dashboard')}
              className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-2 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </button>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Formulaire de Saisie</h1>
            <p className="text-[var(--text-secondary)] mt-1">
              Remplissez les informations de production pour le secteur <span className="text-[#1B4299] font-bold">MEP1</span>.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3 p-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
            <div className="w-10 h-10 rounded-full bg-[#1B4299]/20 border border-[#1B4299]/30 flex items-center justify-center text-[#1B4299] font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-[var(--text-primary)] text-sm font-bold">{user.name}</span>
              <span className="text-[var(--text-secondary)] text-[10px] uppercase font-bold tracking-widest">{user.role}</span>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-xl flex items-center gap-3 text-[#22c55e]"
          >
            <CheckCircle2 size={20} />
            <span className="text-sm font-bold">Everything is saved and the charts will be updated!</span>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="space-y-12">
            {/* Efficiency Section */}
            <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-8 flex items-center gap-3">
                <div className="p-2 bg-[#1B4299]/10 rounded-lg">
                  <Activity size={20} className="text-[#1B4299]" />
                </div>
                Efficiency Chart Data (8)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                {formData.efficiency.map((p, i) => (
                  <div key={`efficiency-${p.line}-${i}`} className="space-y-4 p-4 bg-[var(--bg-dark)] rounded-xl border border-[var(--border)]">
                    <h4 className="text-sm font-black text-[#1B4299] uppercase tracking-widest border-b border-[var(--border)] pb-2">{p.line} Line</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <FormGroup label="Actual (%)" error={errors[`efficiency_${i}_actual`]}>
                        <input type="text" value={p.actual} onChange={(e) => handleMetricChange('efficiency', i, 'actual', e.target.value)} className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" />
                      </FormGroup>
                      <FormGroup label="Objective (%)" error={errors[`efficiency_${i}_objective`]}>
                        <input type="text" value={p.objective} onChange={(e) => handleMetricChange('efficiency', i, 'objective', e.target.value)} className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" />
                      </FormGroup>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Efficiency by Line Section */}
            <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-8 flex items-center gap-3">
                <div className="p-2 bg-[#1B4299]/10 rounded-lg">
                  <Activity size={20} className="text-[#1B4299]" />
                </div>
                Efficiency by Line Chart Data (5)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                {formData.efficiencyBySegment.map((p, i) => (
                  <div key={`eff-seg-${p.line}-${i}`} className="space-y-4 p-4 bg-[var(--bg-dark)] rounded-xl border border-[var(--border)]">
                    <h4 className="text-sm font-black text-[#1B4299] uppercase tracking-widest border-b border-[var(--border)] pb-2">{p.line} Line</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <FormGroup label="Actual (%)" error={errors[`efficiencyBySegment_${i}_actual`]}>
                        <input type="text" value={p.actual} onChange={(e) => handleMetricChange('efficiencyBySegment', i, 'actual', e.target.value)} className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" />
                      </FormGroup>
                      <FormGroup label="Objective (%)" error={errors[`efficiencyBySegment_${i}_objective`]}>
                        <input type="text" value={p.objective} onChange={(e) => handleMetricChange('efficiencyBySegment', i, 'objective', e.target.value)} className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" />
                      </FormGroup>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Scrap Section */}
            <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-8 flex items-center gap-3">
                <div className="p-2 bg-[#ef4444]/10 rounded-lg">
                  <Trash2 size={20} className="text-[#ef4444]" />
                </div>
                Scrap Chart Data (6)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                {formData.scrap.map((p, i) => (
                  <div key={`scrap-${p.line}-${i}`} className="space-y-4 p-4 bg-[var(--bg-dark)] rounded-xl border border-[var(--border)]">
                    <h4 className="text-sm font-black text-[#ef4444] uppercase tracking-widest border-b border-[var(--border)] pb-2">{p.line} Line</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <FormGroup label="Actual (%)" error={errors[`scrap_${i}_actual`]}>
                        <input type="text" value={p.actual} onChange={(e) => handleMetricChange('scrap', i, 'actual', e.target.value)} className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" />
                      </FormGroup>
                      <FormGroup label="Objective (%)" error={errors[`scrap_${i}_objective`]}>
                        <input type="text" value={p.objective} onChange={(e) => handleMetricChange('scrap', i, 'objective', e.target.value)} className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" />
                      </FormGroup>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Excel Scrap Import Section */}
            <section className="bg-white border-2 border-dashed border-[#1B4299]/30 rounded-2xl p-8 shadow-sm hover:border-[#1B4299] transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#1B4299]/10 rounded-xl">
                    <FileSpreadsheet size={28} className="text-[#1B4299]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Excel Scrap Import</h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-md">
                      Upload your <b>"rebut"</b> Excel folder. The system will automatically map <b>Columns G & H</b> to the 4 scrap charts.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Day</label>
                    <select 
                      value={selectedImportDay}
                      onChange={(e) => setSelectedImportDay(Number(e.target.value))}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#1B4299]/20"
                    >
                      {Array.from({ length: 31 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>Day {i + 1}</option>
                      ))}
                    </select>
                  </div>
                  
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleExcelImport}
                    accept=".xlsx, .xls"
                    className="hidden"
                  />
                  
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-8 py-3 bg-[#1B4299] hover:bg-[#112d6b] text-white font-black rounded-xl transition-all shadow-lg flex items-center gap-2 group"
                  >
                    <Upload size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                    Import Folder
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {importStatus && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`mt-6 p-4 rounded-xl flex items-center gap-3 border ${
                      importStatus.success === undefined 
                        ? 'bg-blue-50 border-blue-100 text-blue-700' 
                        : importStatus.success 
                        ? 'bg-green-50 border-green-100 text-green-700' 
                        : 'bg-red-50 border-red-100 text-red-700'
                    }`}
                  >
                    {importStatus.success === undefined ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-blue-400 border-t-white rounded-full" />
                    ) : importStatus.success ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <AlertCircle size={18} />
                    )}
                    <span className="text-sm font-bold">{importStatus.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-6 flex items-center gap-2 text-[#1B4299] text-[10px] font-black uppercase tracking-widest bg-[#1B4299]/5 px-4 py-2 rounded-lg w-fit">
                <Info size={12} />
                Requirements: Sheet "rebut" • Col G: Segment • Col H: Waste Value
              </div>
            </section>

            {/* LPA Section */}
            <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-8 flex items-center gap-3">
                <div className="p-2 bg-[#22c55e]/10 rounded-lg">
                  <CheckCircle2 size={20} className="text-[#22c55e]" />
                </div>
                LPA Score Chart Data (9)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                {formData.lpa.map((p, i) => (
                  <div key={`lpa-${p.line}-${i}`} className="space-y-4 p-4 bg-[var(--bg-dark)] rounded-xl border border-[var(--border)]">
                    <h4 className="text-sm font-black text-[#22c55e] uppercase tracking-widest border-b border-[var(--border)] pb-2">{p.line} Line</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <FormGroup label="Actual (pts)" error={errors[`lpa_${i}_actual`]}>
                        <input type="text" value={p.actual} onChange={(e) => handleMetricChange('lpa', i, 'actual', e.target.value)} className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" />
                      </FormGroup>
                      <FormGroup label="Objective (pts)" error={errors[`lpa_${i}_objective`]}>
                        <input type="text" value={p.objective} onChange={(e) => handleMetricChange('lpa', i, 'objective', e.target.value)} className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" />
                      </FormGroup>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5S Score Section */}
            <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-8 flex items-center gap-3">
                <div className="p-2 bg-[#E8B200]/10 rounded-lg">
                  <Sparkles size={20} className="text-[#E8B200]" />
                </div>
                5S Score Chart Data (10)
              </h3>
              <FormGroup label="5S Score" error={errors.score5S}>
                <input type="text" value={formData.score5S} onChange={(e) => handleChange('score5S', e.target.value)} className="w-full bg-[var(--bg-dark)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)]" />
              </FormGroup>
            </section>

            {/* Satisfaction Section */}
            <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-8 flex items-center gap-3">
                <div className="p-2 bg-[#1B4299]/10 rounded-lg">
                  <UserIcon size={20} className="text-[#1B4299]" />
                </div>
                Satisfaction Detailed Metrics (7)
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                <FormGroup 
                  label="Award Element Score (0 or 60)" 
                  error={errors.awardElement}
                >
                  <input 
                    type="number" 
                    value={formData.satisfactionMetrics.awardElement} 
                    onChange={(e) => handleSatisfactionMetricChange('awardElement', e.target.value)} 
                    className="w-full bg-[var(--bg-dark)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)]" 
                  />
                </FormGroup>

                <FormGroup 
                  label="Enter SEMAT Score (0, 30, or 60)" 
                  error={errors.semat}
                >
                  <input 
                    type="number" 
                    value={formData.satisfactionMetrics.semat} 
                    onChange={(e) => handleSatisfactionMetricChange('semat', e.target.value)} 
                    className="w-full bg-[var(--bg-dark)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)]" 
                  />
                </FormGroup>

                <FormGroup 
                  label="MMOG/LE Score (0 or 30)" 
                  error={errors.mmogle}
                >
                  <input 
                    type="number" 
                    value={formData.satisfactionMetrics.mmogle} 
                    onChange={(e) => handleSatisfactionMetricChange('mmogle', e.target.value)} 
                    className="w-full bg-[var(--bg-dark)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)]" 
                  />
                </FormGroup>

                <FormGroup 
                  label="PPM Score (0, 10, 20-60)" 
                  error={errors.ppm}
                >
                  <input 
                    type="number" 
                    value={formData.satisfactionMetrics.ppm} 
                    onChange={(e) => handleSatisfactionMetricChange('ppm', e.target.value)} 
                    className="w-full bg-[var(--bg-dark)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)]" 
                  />
                </FormGroup>

                <FormGroup 
                  label="QR Incidents Score (0, 5, or 10)" 
                  error={errors.qrIncidents}
                >
                  <input 
                    type="number" 
                    value={formData.satisfactionMetrics.qrIncidents} 
                    onChange={(e) => handleSatisfactionMetricChange('qrIncidents', e.target.value)} 
                    className="w-full bg-[var(--bg-dark)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)]" 
                  />
                </FormGroup>

                <FormGroup 
                  label="VCPA Score (0, 5, or 10)" 
                  error={errors.vcpa}
                >
                  <input 
                    type="number" 
                    value={formData.satisfactionMetrics.vcpa} 
                    onChange={(e) => handleSatisfactionMetricChange('vcpa', e.target.value)} 
                    className="w-full bg-[var(--bg-dark)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)]" 
                  />
                </FormGroup>

                <FormGroup 
                  label="Launch Issues Score (0, 5, or 10)" 
                  error={errors.launchIssues}
                >
                  <input 
                    type="number" 
                    value={formData.satisfactionMetrics.launchIssues} 
                    onChange={(e) => handleSatisfactionMetricChange('launchIssues', e.target.value)} 
                    className="w-full bg-[var(--bg-dark)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)]" 
                  />
                </FormGroup>

                <FormGroup 
                  label="Logistics 1 Score (0, 5, or 10)" 
                  error={errors.logistics1}
                >
                  <input 
                    type="number" 
                    value={formData.satisfactionMetrics.logistics1} 
                    onChange={(e) => handleSatisfactionMetricChange('logistics1', e.target.value)} 
                    className="w-full bg-[var(--bg-dark)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)]" 
                  />
                </FormGroup>

                <FormGroup 
                  label="Logistics 2 Score (0, 5, or 10)" 
                  error={errors.logistics2}
                >
                  <input 
                    type="number" 
                    value={formData.satisfactionMetrics.logistics2} 
                    onChange={(e) => handleSatisfactionMetricChange('logistics2', e.target.value)} 
                    className="w-full bg-[var(--bg-dark)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)]" 
                  />
                </FormGroup>

                <FormGroup 
                  label="Escalation Score (0, 5-7.5, or 10)" 
                  error={errors.escalation}
                >
                  <input 
                    type="number" 
                    value={formData.satisfactionMetrics.escalation} 
                    onChange={(e) => handleSatisfactionMetricChange('escalation', e.target.value)} 
                    className="w-full bg-[var(--bg-dark)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)]" 
                  />
                </FormGroup>
              </div>
              
              <div className="mt-8 p-4 bg-[#1B4299]/5 rounded-xl border border-[#1B4299]/10 flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--text-secondary)]">Calculated Total Satisfaction:</span>
                <span className="text-2xl font-black text-[#1B4299]">
                  {(Object.values(formData.satisfactionMetrics) as string[]).reduce((acc: number, curr: string) => acc + (Number(curr) || 0), 0)} / 300
                </span>
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#1B4299] hover:bg-[#1B4299]/90 text-white font-bold rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-[#1B4299]/10 disabled:opacity-50 text-xs"
                >
                  <Save size={14} />
                  Update Satisfaction Chart
                </button>
              </div>
            </section>

            {/* Produced Hours Section */}
            <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-8 flex items-center gap-3">
                <div className="p-2 bg-[#22c55e]/10 rounded-lg">
                  <Clock size={20} className="text-[#22c55e]" />
                </div>
                Produced Hours Weekly (11)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
                {formData.producedHours.map((p, i) => (
                  <div key={p.day}>
                    <FormGroup label={p.day} error={errors[`producedHours_${i}`]}>
                      <input 
                        type="text" 
                        value={p.hours} 
                        onChange={(e) => handleProducedHoursChange(i, e.target.value)} 
                        className="w-full bg-[var(--bg-dark)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] text-center font-bold" 
                      />
                    </FormGroup>
                  </div>
                ))}
              </div>
            </section>

            {/* Quality Calendar Section */}
            <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-8 flex items-center gap-3">
                <div className="p-2 bg-[#22c55e]/10 rounded-lg">
                  <Calendar size={20} className="text-[#22c55e]" />
                </div>
                Quality Calendar Status (4)
              </h3>
              <FormGroup label="Quality Status" description="Select today's quality status.">
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleChange('qualityStatus', 'OK')}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${formData.qualityStatus === 'OK' ? 'bg-[#22c55e] text-white shadow-lg shadow-[#22c55e]/30' : 'bg-[var(--bg-dark)] text-[var(--text-secondary)] border border-[var(--border)]'}`}
                  >
                    <CheckCircle2 size={18} />
                    OK
                  </button>
                  <button 
                    onClick={() => handleChange('qualityStatus', 'NOK')}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${formData.qualityStatus === 'NOK' ? 'bg-[#ef4444] text-white shadow-lg shadow-[#ef4444]/30' : 'bg-[var(--bg-dark)] text-[var(--text-secondary)] border border-[var(--border)]'}`}
                  >
                    <AlertCircle size={18} />
                    NOK
                  </button>
                </div>
              </FormGroup>
            </section>

            {/* Team Photo Section */}
            <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-8 flex items-center gap-3">
                <div className="p-2 bg-[var(--bg-hover)] rounded-lg">
                  <UserIcon size={20} className="text-[var(--text-secondary)]" />
                </div>
                Team Photo (12)
              </h3>
              <FormGroup label="Team Photo URL">
                <input type="text" value={formData.teamPhotoUrl} onChange={(e) => handleChange('teamPhotoUrl', e.target.value)} className="w-full bg-[var(--bg-dark)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)]" />
              </FormGroup>
            </section>

            {/* Customization Section */}
            <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-8 flex items-center gap-3">
                <div className="p-2 bg-[#E8B200]/10 rounded-lg">
                  <Sparkles size={20} className="text-[#E8B200]" />
                </div>
                Dashboard Customization (1)
              </h3>
              <FormGroup label="Car Image URL" description="Change the main car picture on the dashboard.">
                <input type="text" value={formData.carImageUrl} onChange={(e) => handleChange('carImageUrl', e.target.value)} className="w-full bg-[var(--bg-dark)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)]" />
              </FormGroup>
            </section>

            {/* Safety Section */}
            <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-8 flex items-center gap-3">
                <div className="p-2 bg-[#ef4444]/10 rounded-lg">
                  <ShieldAlert size={20} className="text-[#ef4444]" />
                </div>
                Safety Monitor (2, 3)
              </h3>
              <AssistantAccidentForm formData={formData} onChange={handleChange} errors={errors} />
              <div className="mt-8 pt-8 border-t border-[var(--border)] flex justify-start">
                {showResetConfirm ? (
                  <div className="flex items-center gap-4 p-4 bg-[#ef4444]/5 rounded-xl border border-[#ef4444]/20">
                    <span className="text-xs font-bold text-[#ef4444] uppercase tracking-widest">Confirm Counter Reset?</span>
                    <div className="flex gap-2">
                      <button onClick={() => { resetAccidentCounter(); setShowResetConfirm(false); }} className="px-4 py-2 bg-[#ef4444] text-white rounded-lg text-xs font-bold shadow-lg shadow-[#ef4444]/20">Yes, Reset</button>
                      <button onClick={() => setShowResetConfirm(false)} className="px-4 py-2 border border-[var(--border)] text-[var(--text-secondary)] rounded-lg text-xs font-bold">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowResetConfirm(true)} className="px-6 py-3 rounded-xl border border-[#ef4444]/30 text-[#ef4444] hover:bg-[#ef4444]/10 transition-all font-bold text-sm flex items-center gap-3">
                    <Trash2 size={18} />
                    Réinitialiser Compteur Sécurité (3)
                  </button>
                )}
              </div>
              <IncidentHistoryLog />
            </section>
          </div>

            <div className="pt-10 border-t border-[var(--border)] flex justify-end gap-4 mt-10">
              <button type="button" onClick={() => setActivePage('dashboard')} className="px-6 py-3 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] transition-all font-bold text-sm">Annuler</button>
              <button onClick={handleSave} disabled={isSaving} className="px-10 py-3 bg-[#1B4299] hover:bg-[#1B4299]/90 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[#1B4299]/20 disabled:opacity-50">
                {isSaving ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : <Save size={18} />}
                Enregistrer les modifications
              </button>
            </div>
          </motion.div>
      </div>
    </div>
  );
}

function FormGroup({ label, children, error, description, icon }: { label: string; children: React.ReactNode; error?: string; description?: string; icon?: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          {icon && <span className="text-[var(--text-secondary)]">{icon}</span>}
          {label}
        </label>
        {error && (
          <span className="text-[10px] font-bold text-[#ef4444] uppercase tracking-wider flex items-center gap-1">
            <AlertCircle size={10} />
            {error}
          </span>
        )}
      </div>
      {children}
      {description && <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">{description}</p>}
    </div>
  );
}

function AssistantAccidentForm({ formData, onChange, errors }: { formData: any; onChange: any; errors: any }) {
  const bodyParts = [
    'Head', 'Neck', 'Torso', 
    'Left arm', 'Right arm', 
    'Left hand', 'Right hand', 
    'Left leg', 'Right leg', 
    'Left foot', 'Right foot',
    'Other'
  ];

  const incidentTypes = [
    'Cut/laceration', 
    'Bruise', 
    'Burn', 
    'Fracture', 
    'Strain/sprain', 
    'Electric shock', 
    'Chemical exposure', 
    'Other'
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="space-y-1">
          <p className="text-sm text-[var(--text-secondary)]">Activez le bouton pour remplir les détails de l'incident.</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer"
            checked={formData.hasAccident}
            onChange={(e) => onChange('hasAccident', e.target.checked)}
          />
          <div className="w-11 h-6 bg-[var(--bg-dark)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ef4444]"></div>
          <span className="ml-3 text-sm font-bold text-[var(--text-secondary)]">Signaler un incident</span>
        </label>
      </div>

      {formData.hasAccident && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden pt-4"
        >
          <FormGroup label="Date de l'accident">
            <input 
              type="date" 
              value={formData.accidentDate}
              onChange={(e) => onChange('accidentDate', e.target.value)}
              className="w-full bg-[var(--bg-dark)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#ef4444]/50"
            />
          </FormGroup>
          <FormGroup label="Heure de l'accident">
            <input 
              type="time" 
              value={formData.accidentTime}
              onChange={(e) => onChange('accidentTime', e.target.value)}
              className="w-full bg-[var(--bg-dark)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#ef4444]/50"
            />
          </FormGroup>
          <FormGroup label="Partie du corps affectée" error={errors.bodyPart}>
            <select 
              value={formData.bodyPart}
              onChange={(e) => onChange('bodyPart', e.target.value)}
              className={`w-full bg-[var(--bg-dark)] border ${errors.bodyPart ? 'border-[#ef4444]' : 'border-[var(--border)]'} rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#ef4444]/50`}
            >
              <option value="">Sélectionnez une zone...</option>
              {bodyParts.map(part => <option key={part} value={part}>{part}</option>)}
            </select>
          </FormGroup>
          <FormGroup label="Type d'incident" error={errors.incidentType}>
            <select 
              value={formData.incidentType}
              onChange={(e) => onChange('incidentType', e.target.value)}
              className={`w-full bg-[var(--bg-dark)] border ${errors.incidentType ? 'border-[#ef4444]' : 'border-[var(--border)]'} rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#ef4444]/50`}
            >
              <option value="">Sélectionnez un type...</option>
              {incidentTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </FormGroup>
          <FormGroup label="Gravité">
            <select 
              value={formData.severity}
              onChange={(e) => onChange('severity', e.target.value)}
              className="w-full bg-[var(--bg-dark)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#ef4444]/50"
            >
              <option value="Minor">Minor — first aid only</option>
              <option value="Moderate">Moderate — medical attention</option>
              <option value="Serious">Serious — lost work time</option>
            </select>
          </FormGroup>
          <FormGroup label="Description (Optionnel)">
            <textarea 
              rows={2}
              value={formData.accidentDescription}
              onChange={(e) => onChange('accidentDescription', e.target.value)}
              placeholder="Détails de l'incident..."
              className="w-full bg-[var(--bg-dark)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#ef4444]/50"
            />
          </FormGroup>
        </motion.div>
      )}
    </div>
  );
}

function IncidentHistoryLog() {
  const { accidents, removeAccident } = useDashboard();

  if (accidents.length === 0) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Minor': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'Moderate': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Serious': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="mt-12 space-y-6">
      <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
        <Activity size={24} className="text-[var(--text-secondary)]" />
        Historique des Incidents
      </h3>
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {accidents.map((acc) => (
            <motion.div 
              key={acc.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className={`px-2 py-1 rounded text-[10px] font-bold border uppercase tracking-wider ${getSeverityColor(acc.severity)}`}>
                  {acc.severity}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[var(--text-primary)]">{acc.bodyPart}</span>
                    <span className="text-[var(--text-secondary)] text-xs">•</span>
                    <span className="text-[var(--text-secondary)] text-xs">{acc.type}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-[var(--text-secondary)]">
                    <div className="flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(acc.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={10} />
                      {acc.time}
                    </div>
                  </div>
                  {acc.description && (
                    <p className="mt-2 text-xs text-[var(--text-secondary)] italic">"{acc.description}"</p>
                  )}
                </div>
              </div>
              <button 
                onClick={() => removeAccident(acc.id)}
                className="p-2 text-[var(--text-secondary)] hover:text-[#ef4444] hover:bg-[#ef4444]/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
