import * as XLSX from 'xlsx';
import fs from 'fs';

const filePath = 'C:\\Users\\lenovo\\Desktop\\leoni-main\\suivi scrap.xlsx';
const dataBuffer = fs.readFileSync(filePath);
const workbook = XLSX.read(dataBuffer, {type: 'buffer'});

const sheet = workbook.Sheets['ECOPARC'];
const data = XLSX.utils.sheet_to_json(sheet, { defval: "" });

const relevantRows = data.filter(row => {
    const rowStr = JSON.stringify(row).toLowerCase();
    return rowStr.includes('taux') || rowStr.includes('rebut') || 
           rowStr.includes('scrap') || rowStr.includes('%');
});

console.log(`Found ${relevantRows.length} relevant rows.`);
if (relevantRows.length > 0) {
    const cleanRows = relevantRows.map(sampleRow => {
        const cleanRow = {};
        for (const key in sampleRow) {
            if (!key.startsWith('__EMPTY') && sampleRow[key] !== "") {
                cleanRow[key] = sampleRow[key];
            } else if (sampleRow[key] !== "") {
                cleanRow[key] = sampleRow[key];
            }
        }
        return cleanRow;
    });
    console.log(JSON.stringify(cleanRows.slice(0, 5), null, 2));
}
