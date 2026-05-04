import * as XLSX from 'xlsx';
import fs from 'fs';

const filePath = 'C:\\Users\\lenovo\\Desktop\\leoni-main\\Efficience _._E1_._E1+_._E2_.Avril 2026 6009.xlsx';
const dataBuffer = fs.readFileSync(filePath);
const workbook = XLSX.read(dataBuffer, {type: 'buffer'});

console.log("Sheet Names:", workbook.SheetNames);

const sheet1 = workbook.Sheets['PSA+VOLVO'];
const data1 = XLSX.utils.sheet_to_json(sheet1, { defval: "" });
console.log("PSA+VOLVO First 3 rows:", JSON.stringify(data1.slice(0, 3), null, 2));

const sheet2 = workbook.Sheets['Efficience par projet'];
const data2 = XLSX.utils.sheet_to_json(sheet2, { defval: "" });
console.log("Efficience par projet First 3 rows:", JSON.stringify(data2.slice(0, 3), null, 2));
