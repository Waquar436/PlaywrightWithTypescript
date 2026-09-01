import { test,expect,Page } from '@playwright/test'
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

//=============================================
//1. Describe the shape of one data row
//=============================================
interface LoginRow{
    username: string;
    password: string;
    expected: 'pass' | 'fail';
    message: string;
    }
 
//=============================================
//2. Load the data
//=============================================
const dataDir = path.join(__dirname,'..','TestData');

const jsonRows: LoginRow[] = JSON.parse(
    fs.readFileSync(path.join(dataDir,'loginData.json'),'utf-8'),
);

const workbook = XLSX.readFile(path.join(dataDir,'loginData.xlsx'));
const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
const excelRows: LoginRow[] = XLSX.utils.sheet_to_json<LoginRow>(firstSheet,{
    raw: false,
    defval: "",
});

const csvBook = XLSX.readFile(path.join(dataDir,'loginData.csv'));
const csvRows: LoginRow[] = XLSX.utils.sheet_to_json<LoginRow>(
    csvBook.Sheets[csvBook.SheetNames[0]],
    { raw: false, defval: '',}
);

//=============================================
//3. The test LOGIC, written once. Both data source reuse it.
//=============================================
async function attemptLogin(page: Page, username: string, password: string){
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill(username);
    await page.locator('#password').fill(password);
    await page.locator('#login-button').click();
}

async function assertOutcome(page: Page, row: LoginRow) {
    if (row.expected === 'pass'){
        await expect(page).toHaveURL(/inventory/);
        await expect(page.locator('.inventory_list')).toBeVisible();
    } else {
        await expect(page.locator('[data-test="error"]')).toHaveText(row.message);
    }
}

const label = (r: LoginRow) => 
    `${r.username || '(empty)'} / ${r.password ? '***' : '(empty)'} -> ${r.expected}`;

//=============================================
//SECTION A - JSON-driven test
//=============================================
test.describe('A - Data-driven login from JSON',() => {
    for (const row of jsonRows) {
        test(`JSON: ${label(row)} @smoke`,async ({ page }) => {
            await attemptLogin(page,row.username, row.password);
            await assertOutcome(page, row);
        });
    }
});

//=============================================
//SECTION B - Excel-driven test
//=============================================
test.describe('SECTION B - Data-driven login from Excel (.xlsx)',() => {
    for (const row of excelRows) {
        test(`EXCEL: ${label(row)}`,async ({ page }) => {
            await attemptLogin(page, row.username, row.password);
            await assertOutcome(page, row);
        });
    }
});

//=============================================
//SECTION C - CSV-driven test
//=============================================
test.describe('SECTION C - Data-driven login from CSV',() => {
    for (const row of csvRows) {
        test(`CSV: ${label(row)}`,async ({ page }) => {
            await attemptLogin(page, row.username, row.password);
            await assertOutcome(page, row);
        });
    }
});

//=============================================
//SECTION D - Slicing the data: run only the negative/edge cases
//=============================================
test.describe('Section D - Negative & edge cases only (from excel)',() => {
    // for (const row of excelRows.filter((r) => r.expected === 'fail')) {
    for (const row of excelRows.filter((r) => r.username === 'standard_user')) {
        test(`Excel negative: ${label(row)}`,async ({ page }) => {
            await attemptLogin(page, row.username, row.password);
            await assertOutcome(page, row);
        });
    }
});

//=============================================
//SECTION E - The Excel data-types gotcha (no browser - pure data)
//=============================================
interface ProfileRow {
    name: string;
    userId: string;
    zip: string;
    salary: string;
    joinDate: string
}

test.describe('Section E - Excel data types: raw vs raw:false',() => {
    const profilePath = path.join(dataDir,'profileData.xlsx');

    test('DEFAULT read - dates become serial numbers, numbers stay numbers',async () => {
        const wb = XLSX.readFile(profilePath);
        const rows = XLSX.utils.sheet_to_json<any>(wb.Sheets[wb.SheetNames[0]]);

        expect(typeof rows[0].salary).toBe('number');
        console.log(rows[0].salary);
        console.log(typeof rows[0].salary);
        expect(typeof rows[0].joinDate).toBe('number');
        console.log(rows[0].joinDate);
        console.log(typeof rows[0].joinDate);
    });

    test('raw:false read - every cell is its DISPLAYED TEXT (the safe default)',async () => {
        const wb = XLSX.readFile(profilePath);
        const rows = XLSX.utils.sheet_to_json<ProfileRow>(wb.Sheets[wb.SheetNames[0]],{
            raw: false,
        });
        expect.soft(rows[0].salary).toBe('10000');
        expect.soft(rows[0].joinDate).toBe('1/15/24');
        expect.soft(rows[0].userId).toBe('7')
        expect.soft(rows[0].zip).toBe('8001');
    });
});

//=============================================
//SECTION F - Write to EXCEL
//=============================================
interface ResultRow {
    username: string;
    expected: 'pass' | 'fail';
    actual: string;
    status: 'PASS' | 'FAIL';
}

test.describe('SECTION F - Run the Excel data, then export pass/fail result to Excel',() => {
    const results: ResultRow[] = [];
    for (const row of excelRows) {
        test(`EXPORT: ${label(row)}`,async ({ page }) => {
            let status: 'PASS' | 'FAIL' = 'PASS';
            let actual = '';
            try {
                await attemptLogin(page,row.username,row.password);
                if (row.expected === 'pass') {
                    await expect(page).toHaveURL(/inventory/);
                    actual = 'logged in';
                } else {
                    actual = await page.locator('[data-test="error"]').innerText();
                    await expect(page.locator('[data-test="error"]')).toHaveText(row.message);
                }
            } catch (e) {
                status = 'FAIL';
                throw e;
            } finally {
                results.push({ username: row.username || '(empty)',expected: row.expected, actual, status })
            }
        });
    }
    test.afterAll(() => {
        const worksheet = XLSX.utils.json_to_sheet(results);
        const resultBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(resultBook,worksheet,'Results');

    // write to disk
    const outPath = path.join(dataDir,'loginResults.xlsx');
    XLSX.writeFile(resultBook,outPath);
    console.log(`wrote ${results.length} result rows to ${outPath}`);
    });
});