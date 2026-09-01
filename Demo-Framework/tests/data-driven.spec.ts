/**
 * Demo framework - tests/data-driven.spec.ts
 * Data-driven login: write the logic ONCE, run it per data row.
 * 
 * The data lives OUTSIDE the test logic - primary source is EXCEL (read with SheetJS),
 * withJSON kept as the simple secondary example. The steps run through the 
 * LoginPage object, injected by our fixture, so the test body owns no selectors.
 * 
 * path.join keeps the data paths working on windows and macOS/Linux alike.
 */

import { test } from '../fixtures/sauce-fixtures';
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';

interface LoginRow {
    username: string;
    password: string;
    expected: 'pass' | 'fail';
    message: string;
}

const dataDir = path.join(__dirname,'..','data');

//EXCEL - primary data source. raw:false => cells come back as displayed text;
//defval:'' => empty cells stay empty strings (so blank username/password work).
const workbook = XLSX.readFile(path.join(dataDir,'loginData.xlsx'));
const excelRows: LoginRow[] = XLSX.utils.sheet_to_json<LoginRow>(
    workbook.Sheets[workbook.SheetNames[0]],
    { raw: false, defval: '' },
);

//JSON - simple secondary example.
const jsonRows: LoginRow[] = JSON.parse(
    fs.readFileSync(path.join(dataDir,'loginData.json'),'utf-8'),
);

function runSuite(label: string, rows: LoginRow[]) {
    test.describe(`SauceDemo login - data-driven via POM (${label})`,() => {
        rows.forEach((row, i) => {
            test(`@regression ${label} row ${i + 1}: ${row.username || '(empty)'} -> ${row.expected}`,
                async ({ loginPage, inventoryPage }) => {
                    await loginPage.login(row.username, row.password);
                    if (row.expected === 'pass') {
                        await inventoryPage.expectLoaded();
                    } else {
                        await loginPage.expectError(row.message);
                    }
                });
        });
    });
}

runSuite('EXCEL',excelRows); //primary source
runSuite('JSON',jsonRows);   //secondary, for contrast