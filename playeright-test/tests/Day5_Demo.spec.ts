import {test,expect} from '@playwright/test';

//=============================================
//Section 1 - Frames / iframes
//=============================================
test.describe('Section 1 - Frames / iframes', () => {
    test('reach an element inside an iframe with framelocator @smoke',async ({ page }) => {
        await page.goto('https://demoqa.com/frames');
        const frame = page.frameLocator('#frame1');
        await expect(frame.locator('#sampleHeading')).toHaveText('This is a sample page');
    });

    test('nested frames - chain frameLocator to reach the child',async ({ page }) => {
        await page.goto('https://demoqa.com/nestedframes');

        const parent = page.frameLocator('#frame1');
        await expect(parent.locator('body')).toContainText('Parent frame');

        const child= parent.frameLocator('iframe');
        await expect(child.locator('body')).toContainText('Child Iframe');
    });
});

//=============================================
//Section 2 - Alerts and dialogs
//=============================================
test.describe('Section 2 - Alerts and dialogs',() => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://demoqa.com/alerts');
    });

    test('alert - read the message and accept it @smoke',async ({ page }) => {
        page.once('dialog',async (dialog) => {
            expect(dialog.type()).toBe('alert');
            await page.waitForTimeout(2000);
            expect(dialog.message()).toBe('You clicked a button');
            await dialog.accept();
        });
        await page.locator('#alertButton').click();
    });

    test('confirm - accept vs dismiss change the result text',async ({ page }) => {
        //page.once('dialog',(dialog) => dialog.accept());
        // page.once('dialog',async (dialog) => {
        //     expect(dialog.type()).toBe('confirm');
        //     await page.waitForTimeout(2000);
        //     await dialog.accept();
        // });
        //await page.locator('#confirmButton').click();
        //await expect(page.locator('#confirmResult')).toHaveText('You selected Ok');

        //page.once('dialog',(dialog) => dialog.dismiss());
        page.once('dialog',async (dialog) => {
            expect(dialog.type()).toBe('confirm');
            await page.waitForTimeout(2000);
            await dialog.dismiss();
        });
        await page.locator('#confirmButton').click();
        await expect(page.locator('#confirmResult')).toHaveText('You selected Cancel');
    });

    test('prompt - type a value with accept(text)',async ({ page }) => {
        page.once('dialog',(dialog) => dialog.accept('Aarav'));
        await page.locator('#promtButton').click();
        await expect(page.locator('#promptResult')).toHaveText('You entered Aarav');
    });
});

//=============================================
//Section 3 - Custom Dropdowns
//=============================================
test.describe('Section 3 - Custom dropdowns',() => {
    test('open a react-select dropdown and pick an option @smoke',async ({ page }) => {
        await page.goto('http://demoqa.com/select-menu');
        await page.locator('#selectOne').click();
        await page.getByText('Prof.',{ exact: true }).click();
        await expect(page.locator('#selectOne')).toContainText('Prof.');
    });
});


//=============================================
//Section 4 - Checkboxes
//=============================================
test.describe('Section 4 - Checkboxes',() => {
    test('checking a parent node cascades to its children @smoke',async ({ page }) => {
        await page.goto('http://demoqa.com/checkbox');
        await page.locator('.rc-tree-checkbox').first().click();
        await expect(page.locator('#result')).toBeVisible();
        await expect(page.locator('#result')).toContainText('home');
        await expect(page.locator('#result')).toContainText('downloads');
    });

    test('extend the tree, then check a single branch',async ({ page }) => {
        await page.goto('http://demoqa.com/checkbox');
        await page.locator('.rc-tree-switcher').first().click();
        await page.locator('.rc-tree-treenode')
                    .filter({ hasText: 'Desktop' })
                    .locator('.rc-tree-checkbox')
                    .click();

        await expect(page.locator('#result')).toContainText('desktop');
        await expect(page.locator('#result')).toContainText('notes');
        await expect(page.locator('#result')).toContainText('commands');
    });
});

//=============================================
//Section 5 - Radio Buttons
//=============================================
test.describe('Section 5 - Radio Buttons',() => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://demoqa.com/radio-button');
    });

    test('select a radio by clicking its label @smoke',async ({ page }) => {
        await page.locator('label[for="yesRadio"]').click();
        await expect(page.locator('#yesRadio')).toBeChecked();
        await expect(page.locator('.text-success')).toHaveText('Yes');
    });

    test('selecting another radio clears the previous one; a disabled one cannt be picked',async ({ page }) => {
        await page.locator('label[for="yesRadio"]').click();
        await page.locator('label[for="impressiveRadio]').click();

        await expect(page.locator('label[for="impressiveRadio]')).toBeChecked();
        await expect(page.locator('label[for="yesRadio"]')).not.toBeChecked();
    });
});

//=============================================
//Section 6 - Tabes
//=============================================
test.describe('Section 6 - Tables',() => {
    const ROWS = '.web-tables-wrapper table tbody tr';

        test('count rows and read a cell by position @smoke',async ({ page }) => {
            await page.goto('https://demoqa.com/webtables');

            const rows = page.locator(ROWS)
            await expect(rows).toHaveCount(3);
            //Row 1(index 0): First name | Last name | Age | Email | Salary | Dept | Action
            await expect(rows.nth(0).locator('td').nth(0)).toHaveText('Cierra');
            await expect(rows.nth(0).locator('td').nth(3)).toHaveText('cierra@example.com');
        });

        test('search to find a row, then act inside that row',async ({ page }) => {
            await page.goto('https://demoqa.com/webtables');
            await page.locator('#searchBox').fill('Kierra');
            const row = page.locator(ROWS).filter({ hasText: 'Kierra' });
            await expect(row.locator('td').nth(1)).toHaveText('Gentry'); //check last name of searched row
            
            await row.locator('[title="Edit"]').click();
            await expect(page.locator('#firstName')).toHaveValue('Kierra');
        });
});

//=============================================
//Section 7 - Date Picker
//=============================================
test.describe("Section 7 - Date Picker",() => {
    test('type an exact date into the input @smoke',async ({ page }) => {
        await page.goto('https://demoqa.com/date-picker');
        const input = page.locator('#datePickerMonthYearInput');
        await input.click();
        await input.fill('17/08/2026');
        await input.press('Enter');
        await expect(input).toHaveValue('17/08/2026');
    });

    test('open the calendar and pick month, year,, and day',async ({ page }) => {
        await page.goto('https://demoqa.com/date-picker');
        await page.locator('#datePickerMonthYearInput').click();
        await page.locator('.react-datepicker__month-select').selectOption('7');
        await page.locator('.react-datepicker__year-select').selectOption('2026');
        await page.locator('.react-datepicker__day--017:not(.react-datepicker__day--outside-month)').click();
        await expect(page.locator('#datePickerMonthYearInput')).toHaveValue('08/17/2026');
    });
});

//=============================================
//Section 8 - File Download
//=============================================
test.describe('Section 8 - File Download', () => {
    test('capture a download and check its filename @smoke',async ({ page }) => {
        await page.goto('https://demoqa.com/upload-download');
        const [download] = await Promise.all([
            page.waitForEvent('download'),
            page.locator('#downloadButton').click(),
        ]);
        expect(download.suggestedFilename()).toBe('sampleFile.jpeg');
        //await download.saveAs('./downloads/' + download.suggestedFilename());
        await download.saveAs('./downloads/testfile.jpeg');
    });
});

//=============================================
//Section 9 - Dynamic UI
//=============================================
test.describe('Section 9 - Dynamic UI',() => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://demoqa.com/dynamic-properties');
    });

    //9a - Timing: a button that is disabled, then enables ~5s later.
    test('dynamic timing - wait for a button to enable, with no sleep @smoke',async ({ page }) => {
        const enableAfter = page.locator('#enableAfter');
        await enableAfter.click();
    });

    //9a - Timing: an element that does not exist at first and appears ~5s later.
    test('dynamic timing - wait for an element to appear',async ({ page }) => {
        await expect(page.locator('#visibleAfter')).toBeVisible();
    });
});