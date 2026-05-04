import * as XLSX from 'xlsx';
import fs from 'fs';

const filePath = 'C:\\Users\\lenovo\\Desktop\\leoni-main\\suivi scrap.xlsx';
const dataBuffer = fs.readFileSync(filePath);
const workbook = XLSX.read(dataBuffer, {type: 'buffer'});

console.log("Sheet Names:", workbook.SheetNames);

const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet, { defval: "" });

const cleanData = data.slice(0, 20).map(row => {
    const cleanRow = {};
    for (const key in row) {
        if (!key.startsWith('__EMPTY') && row[key] !== "") {
            cleanRow[key] = row[key];
        } else if (row[key] !== "") {
            cleanRow[key] = row[key];
        }
    }
    return cleanRow;
}).filter(row => Object.keys(row).length > 0);

console.log(JSON.stringify(cleanData, null, 2));
