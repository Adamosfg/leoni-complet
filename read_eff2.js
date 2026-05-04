import * as XLSX from 'xlsx';
import fs from 'fs';

const filePath = 'C:\\Users\\lenovo\\Desktop\\leoni-main\\Efficience _._E1_._E1+_._E2_.Avril 2026 6009.xlsx';
const dataBuffer = fs.readFileSync(filePath);
const workbook = XLSX.read(dataBuffer, {type: 'buffer'});

const sheet = workbook.Sheets['PSA+VOLVO'];
const data = XLSX.utils.sheet_to_json(sheet, { defval: "" });

// Let's find rows that mention mp1, cm2, cm3, spa3, or assemblage
const relevantRows = data.filter(row => {
    const rowStr = JSON.stringify(row).toLowerCase();
    return rowStr.includes('assemblage') || 
           rowStr.includes('mp1') || rowStr.includes('mep1') ||
           rowStr.includes('cm2') || rowStr.includes('cma2') ||
           rowStr.includes('cm3') || rowStr.includes('cma3') ||
           rowStr.includes('spa3') || rowStr.includes('e1');
});

console.log(`Found ${relevantRows.length} relevant rows.`);
// Print the first 10 relevant rows to understand the structure
console.log(JSON.stringify(relevantRows.slice(0, 10), null, 2));
