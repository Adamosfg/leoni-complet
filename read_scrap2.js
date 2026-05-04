import * as XLSX from 'xlsx';
import fs from 'fs';

const filePath = 'C:\\Users\\lenovo\\Desktop\\leoni-main\\suivi scrap.xlsx';
const dataBuffer = fs.readFileSync(filePath);
const workbook = XLSX.read(dataBuffer, {type: 'buffer'});

console.log("Sheet Names:", workbook.SheetNames);

workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    
    const relevantRows = data.filter(row => {
        const rowStr = JSON.stringify(row).toLowerCase();
        return rowStr.includes('mp1') || rowStr.includes('cm2') ||
               rowStr.includes('cm3') || rowStr.includes('spa3') || 
               rowStr.includes('assemblage') || rowStr.includes('mep1');
    });

    if (relevantRows.length > 0) {
        console.log(`\nFound ${relevantRows.length} relevant rows in sheet: ${sheetName}`);
        
        // Print the first row that matches just to see structure
        const sampleRow = relevantRows[0];
        const cleanRow = {};
        for (const key in sampleRow) {
            if (!key.startsWith('__EMPTY') && sampleRow[key] !== "") {
                cleanRow[key] = sampleRow[key];
            } else if (sampleRow[key] !== "") {
                cleanRow[key] = sampleRow[key];
            }
        }
        console.log(JSON.stringify(cleanRow, null, 2));
    }
});
