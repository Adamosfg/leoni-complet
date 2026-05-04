import { useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';

export function useSatisfactionData() {
  const { importedData, productionData } = useDashboard();

  return useMemo(() => {
    const fileKey = Object.keys(importedData).find(k => k.toLowerCase().includes('indicators'));
    
    // Fallback to the default context data if no file is uploaded
    if (!fileKey) return productionData.satisfactionMetrics;

    const rawImport = importedData[fileKey];
    const sheetName = Object.keys(rawImport)[0]; // Just take the first sheet
    const sheet = rawImport[sheetName];

    if (!sheet) return productionData.satisfactionMetrics;

    const metrics = { ...productionData.satisfactionMetrics }; // start with default

    // Mapping from expected interface keys to possible row names in the Excel file
    const mappings: Record<string, string[]> = {
      awardElement: ['award element', 'awardelement', 'certificates'],
      semat: ['semat'],
      mmogle: ['mmog / le', 'mmogle', 'mmog'],
      ppm: ['ppm / target', 'ppm'],
      qrIncidents: ['qr incidents', 'qrincidents', 'ocs', 'fass'],
      vcpa: ['vcpa', 'saq'],
      launchIssues: ['launch issues', 'launchissues', 'trust'],
      logistics1: ['logistics 1', 'logistics1', 'logistics'],
      logistics2: ['logistics 2', 'logistics2', 'cpi'],
      escalation: ['escalation']
    };

    try {
      // Find the most recent column that has data
      // We look at the SEMAT row to find the latest month with a non-zero, non-string number
      const sematRow = sheet.find((row: any) => {
        const firstCol = String(Object.values(row)[0] || '').toLowerCase();
        return firstCol.includes('semat');
      });

      let targetColumn = '';

      if (sematRow) {
        const keys = Object.keys(sematRow);
        // Start from the end, skip "Target"
        for (let i = keys.length - 1; i >= 0; i--) {
          const key = keys[i];
          if (key.toLowerCase().includes('target')) continue;
          
          const val = sematRow[key];
          if (typeof val === 'number' && val > 0) {
            targetColumn = key;
            break;
          }
        }
      }

      // Process each row
      sheet.forEach((row: any) => {
        const firstCol = String(Object.values(row)[0] || '').toLowerCase().trim();
        if (!firstCol) return;

        // Determine which metric this row belongs to
        let matchedMetric = '';
        for (const [key, aliases] of Object.entries(mappings)) {
          if (aliases.some(alias => firstCol === alias)) {
            matchedMetric = key;
            break;
          }
        }

        if (matchedMetric) {
          // Get the value for the target column, or fallback to the last valid number in the row
          let val = row[targetColumn];
          
          if (typeof val !== 'number') {
             // Fallback: find the last valid number in this row
             const vals = Object.entries(row)
                .filter(([k]) => !k.toLowerCase().includes('target'))
                .map(([, v]) => v)
                .filter(v => typeof v === 'number') as number[];
             if (vals.length > 0) {
               val = vals[vals.length - 1];
             }
          }

          if (typeof val === 'number') {
            (metrics as any)[matchedMetric] = val;
          }
        }
      });

      return metrics;
    } catch (e) {
      console.error("Failed to parse Indicators data", e);
      return productionData.satisfactionMetrics;
    }
  }, [importedData, productionData.satisfactionMetrics]);
}
