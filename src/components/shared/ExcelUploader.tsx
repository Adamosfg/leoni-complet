import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { useDashboard } from '../../context/DashboardContext';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ExcelUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateImportedData } = useDashboard();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('loading');
    setFileName(file.name);

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          const fileData: Record<string, any[]> = {};
          
          workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);
            fileData[sheetName] = json;
          });

          // Store the parsed data in the context using the filename as the key
          // We remove the extension for cleaner keys
          const key = file.name.replace(/\.[^/.]+$/, "");
          updateImportedData(key, fileData);
          
          setStatus('success');
          setTimeout(() => setStatus('idle'), 3000);
        } catch (err) {
          console.error("Error parsing Excel:", err);
          setStatus('error');
          setTimeout(() => setStatus('idle'), 3000);
        }
      };
      
      reader.onerror = () => {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input 
        type="file" 
        accept=".xlsx, .xls, .csv" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileUpload}
      />
      
      <button 
        onClick={() => fileInputRef.current?.click()}
        disabled={status === 'loading'}
        className="w-full relative overflow-hidden flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-300 group bg-[var(--bg-hover)] text-[var(--volvo-blue)] border border-[var(--volvo-blue)]/20 hover:border-[var(--volvo-blue)]/50 hover:bg-[var(--volvo-blue)]/10"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-white rounded-lg shadow-sm">
            <AnimatePresence mode="wait">
              {status === 'idle' && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <FileSpreadsheet size={16} className="text-[var(--volvo-blue)]" />
                </motion.div>
              )}
              {status === 'loading' && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Loader2 size={16} className="animate-spin text-[var(--leoni-amber)]" />
                </motion.div>
              )}
              {status === 'success' && (
                <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <CheckCircle2 size={16} className="text-[var(--success)]" />
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <AlertCircle size={16} className="text-[var(--danger)]" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[13px] font-bold tracking-tight">Import Data</span>
            <span className="text-[9px] font-black uppercase tracking-wider text-[var(--text-muted)]">
              {status === 'success' ? 'Loaded!' : status === 'loading' ? 'Parsing...' : 'Excel / CSV'}
            </span>
          </div>
        </div>
        <Upload size={16} className="text-[var(--text-muted)] group-hover:text-[var(--volvo-blue)] transition-colors" />
      </button>
    </div>
  );
}
