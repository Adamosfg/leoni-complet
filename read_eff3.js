import * as XLSX from 'xlsx';
import fs from 'fs';

const filePath = 'C:\\Users\\lenovo\\Desktop\\leoni-main\\Efficience _._E1_._E1+_._E2_.Avril 2026 6009.xlsx';
const dataBuffer = fs.readFileSync(filePath);
const workbook = XLSX.read(dataBuffer, {type: 'buffer'});

const sheet = workbook.Sheets['PSA+VOLVO'];
const data = XLSX.utils.sheet_to_json(sheet, { defval: "" });

const cleanData = data.map(row => {
    const cleanRow = {};
    for (const key in row) {
        if (!key.startsWith('__EMPTY') && row[key] !== "") {
            cleanRow[key] = row[key];
        } else if (row[key] !== "") {
            // Keep the value but use a generic key
            cleanRow[key] = row[key];
        }
    }
    return cleanRow;
}).filter(row => Object.keys(row).length > 0);

const relevantRows = cleanData.filter(row => {
    const rowStr = JSON.stringify(row).toLowerCase();
    return rowStr.includes('mp1') || rowStr.includes('cm2') ||
           rowStr.includes('cm3') || rowStr.includes('spa3') || 
           rowStr.includes('assemblage');
});

console.log(JSON.stringify(relevantRows, null, 2));
