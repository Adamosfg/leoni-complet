import { useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { SCRAP_DATA } from '../constants/productionData';

export function useScrapData() {
  const { importedData } = useDashboard();

  return useMemo(() => {
    const fileKey = Object.keys(importedData).find(k => k.toLowerCase().includes('suivi scrap'));
    if (!fileKey) return SCRAP_DATA;

    const rawImport = importedData[fileKey];
    // We try to find ECOPARC sheet
    const sheetName = Object.keys(rawImport).find(k => k.toLowerCase().includes('ecoparc')) || Object.keys(rawImport)[0];
    const sheet = rawImport[sheetName];

    if (!sheet) return SCRAP_DATA;

    try {
      // Find the row index for "Rebuts G/H"
      const sectionIndex = sheet.findIndex((row: any) => {
        const firstCol = Object.values(row)[0];
        return typeof firstCol === 'string' && firstCol.toLowerCase().includes('rebuts g/h');
      });

      // If we can't find it, we'll just scan the whole sheet
      const searchArea = sectionIndex >= 0 ? sheet.slice(sectionIndex) : sheet;

      const segmentsToFind = [
        { id: 'mep1', keywords: ['mp1', 'mep1'] },
        { id: 'cma2', keywords: ['cm2', 'cma2'] },
        { id: 'cma3', keywords: ['cm3', 'cma3'] },
        { id: 'spa3', keywords: ['spa3'] }
      ];

      const extractedSegments: Record<string, number[]> = {
        'MEP1': [],
        'CMA2': [],
        'CMA3': [],
        'SPA3': []
      };

      segmentsToFind.forEach(seg => {
        // Look for rows that match "assemblage" and the segment ID
        const matchedRows = searchArea.filter((row: any) => {
          const rowStr = JSON.stringify(row).toLowerCase();
          const hasSeg = seg.keywords.some(kw => rowStr.includes(kw));
          const hasAsm = rowStr.includes('assemblage');
          return hasSeg && hasAsm;
        });

        // The user said: "if assemblage is zero than look for fx assemblage"
        // This implies there might be multiple rows for the same segment, or some might be empty.
        // We'll take the row that has the most non-zero valid numbers < 100 (scrap is a %).
        let bestRow: number[] = [];
        
        matchedRows.forEach((row: any) => {
          // Extract valid numbers (scrap rate should be reasonable, say < 100, though target is 2.5)
          const vals = Object.values(row)
            .filter(v => typeof v === 'number' && v > 0 && v < 50) as number[];
          
          if (vals.length > bestRow.length) {
            bestRow = vals;
          }
        });

        extractedSegments[seg.id.toUpperCase()] = bestRow.length > 0 ? bestRow : [0];
      });

      // Now we group the numbers into chunks of 4 to represent months
      const result: Record<string, any> = {};
      
      // Find the maximum length to iterate over
      const maxLen = Math.max(...Object.values(extractedSegments).map(arr => arr.length));
      
      if (maxLen === 0 || maxLen === 1 && extractedSegments['MEP1'][0] === 0) {
        return SCRAP_DATA; // Fallback if parsing completely fails
      }

      let currentMonthIndex = 1;
      for (let i = 0; i < maxLen; i += 4) {
        const weeks = [`S${i+1}`, `S${i+2}`, `S${i+3}`, `S${i+4}`];
        const monthSegments: Record<string, number[]> = {};
        let totalAvg = 0;
        let count = 0;

        Object.keys(extractedSegments).forEach(segKey => {
          const chunk = extractedSegments[segKey].slice(i, i + 4);
          // Pad with 0 if necessary
          while (chunk.length < 4) chunk.push(0);
          monthSegments[segKey] = chunk;

          const segAvg = chunk.reduce((a, b) => a + b, 0) / chunk.filter(v => v > 0).length || 0;
          if (segAvg > 0) {
            totalAvg += segAvg;
            count++;
          }
        });

        const monthAvg = count > 0 ? totalAvg / count : 0;

        result[`Mois ${currentMonthIndex}`] = {
          avg: Number(monthAvg.toFixed(2)),
          weeks,
          segments: monthSegments
        };
        currentMonthIndex++;
      }

      return Object.keys(result).length > 0 ? result : SCRAP_DATA;

    } catch (e) {
      console.error("Failed to parse Scrap data", e);
      return SCRAP_DATA;
    }
  }, [importedData]);
}
