import {test,expect} from '@playwright/test';

const PARABANK_REG = 'https://parabank.parasoft.com/parabank/register.htm';

const PARABANK = 'https://parabank.parasoft.com/parabank/index.htm';

const HEROKUAPP = 'https://the-internet.herokuapp.com/login';

const GooglePage = 'https://www.google.com/';

const SAUCEDEMO = 'https://www.saucedemo.com/';

const UPLOAD = "https://demoqa.com/upload-download";

const TOOLTIPS = "https://demoqa.com/tool-tips";

//------------------------------
//Section 1 - Text entry: fill, type, press
//------------------------------    

test.describe('Section 1 -  Text entry: fill, type, press',() =>
{
   test.beforeEach(async ({ page }) => {
    await page.goto(PARABANK_REG)
   }); 

   test('fill - clears the field and set the vcalue in one step @smoke',async ({ page }) => {
    const firstName = page.locator('[name="customer.firstName"]');
    await firstName.fill('Aarav')
    await expect(firstName).toHaveValue('Aarav')

    await firstName.fill('Meera');
    await expect(firstName).toHaveValue('Meera');
   });

   test('pressSequentially - types character by character (fires key events)',async ({ page }) => {
    const lastName = page.locator('[name="customer.lastName"]');
    await lastName.pressSequentially('Sharma',{delay: 50});
    await expect(lastName).toHaveValue('Sharma');
   });

   test('press - single keys and chords (Tab, Enter, Control+A)',async ({ page }) => {
    const username = page.locator('[name="customer.username"]');
    await username.fill('aarav99');
    await username.press('Control+A');
    await username.press('Delete');
    await expect(username).toBeEmpty();
    await username.fill('aarav88');
    await username.press('Tab');
   });
});

//------------------------------
//Section 2 - Clicking
//------------------------------    

test.describe('Section 2 - Clicking',() =>{
    test('click - navigate vias the register link @smoke',async ({ page }) => {
        await page.goto(PARABANK);
        await page.getByRole('link',{ name: 'Register'}).click();
        await expect(page).toHaveURL(/register/);
    });

    test('click options - button, modifiers, clickcount, posiion',async ({ page }) => {
        await page.goto(PARABANK);
        const aboutLink = page.locator('#headerPanel').getByRole('link',{ name: 'About Us' });
        //These are OPTIONS most teams never need 
        //await aboutLink.click({ button: 'right' }); //right-click context menu
        //await aboutLink.click({ modifiers: ['Control']}); //ctrl+click opens in new tab
        //await aboutLink.click({ clickCount: 2 }); //same as double-click
        await aboutLink.click({ position: { x:4, y: 4 }}); //click a specific position within the element
        await page.waitForTimeout(10000);
        await aboutLink.click();
        await expect(page).toHaveURL(/about/);
    });
});

//------------------------------
//Section 3 - Dropdowns: SelectOptioons, SelectText, SelectValue
//------------------------------  
test.describe('Section 3 - Dropdowns: SelectOptioons, SelectText, SelectValue',() =>{
    test.beforeEach(async ({ page }) => {
        await page.goto(SAUCEDEMO);
        await page.getByPlaceholder('Username').fill('standard_user');
        await page.getByPlaceholder('Password').fill('secret_sauce');
        await page.getByRole('button',{ name: 'Login' }).click();   
        await expect(page).toHaveURL(/inventory/);
    });

    test('selectOption - by visible label @smoke',async ({ page }) => {
        const sort = page.locator('[data-test="product-sort-container"]');
        await sort.selectOption({ label: 'Name (Z to A)'});
        await expect(sort).toHaveValue('za');
    });

    test('selectOption - by value and by index (three equivalent ways)', async ({ page }) => {
        const sort = page.locator('[data-test="product-sort-container"]');
        await sort.selectOption('lohi');
        await expect(sort).toHaveValue('lohi');
        await sort.selectOption({ index: 0});
        await expect(sort).toHaveValue('az');
    });
});

//------------------------------
//Section 4 - File Upload
//------------------------------  
test.describe('Section 4 - File upload',() => {
    test('setInputFiles - Upload a file to a real page @smoke',async ({ page }) => {
        test.slow();
            await page.goto(UPLOAD);
        // await page.locator('#uploadFile').setInputFiles({
        //     name: 'day4-upload.txt',
        //     mimeType: 'text/plain',
        //     buffer: Buffer.from('Hello from the Day 4 upload demo'),
        // });
        await page.locator('#uploadFile').setInputFiles('./testUploadFile.txt');
        await expect(page.locator('#uploadedFilePath')).toContainText('testUploadFile.txt');
    });
});

//------------------------------
//Section 5 - Keyboard and Mopuse
//------------------------------  

test.describe('Section 5 - keyboard and mmouse',() => {
    test('keyboard - type into the focused field via page.keyboard',async ({ page }) => {
        await page.goto(PARABANK);
        await page.locator('input[name="username"]').focus();
        await page.keyboard.type('trainee');
        //await page.keyboard.insertText('trainee'); //To insert text in any  language
        //await page.keyboard.down('shift'); //Hold shift key
        //await page.keyboard.up('shift'); //Release shift key
        await expect(page.locator('input[name="username"]')).toHaveValue('trainee');
    });

    test('mouse - hover reveals a hidden caption @smoke',async ({ page }) => {
        await page.goto(TOOLTIPS);
        await page.locator('#toolTipButton').hover();
        await expect(page.getByText('You hovered over the bUTTON')).toBeVisible();
    });
});

//------------------------------
//Section 6 - Web-first assertions and Generic assertions
//------------------------------  
test.describe('Section 6 - Web-first assertions',() => {
    test('a tour of auto-retrying matchers @smoke',async ({ page }) => {
        await page.goto(PARABANK_REG);
        await expect(page).toHaveTitle(/ParaBank/);
        await expect(page.getByRole('button',{ name: 'Register' })).toBeVisible();
        await expect(page.getByRole('button',{ name: 'Register' })).toBeEnabled();
        
        const firstName = page.locator('[name="customer.firstName"]');
        await firstName.fill('Aarav');
        await expect(firstName).toHaveValue('Aarav');
        await expect(firstName).not.toBeEmpty();

        await expect(page.getByText('Signing up is easy')).toBeVisible();
        await expect(page.locator('#leftPanel a')).toHaveCount(2);
    });

    test('web-first assertions remove manual waits',async ({ page }) => {
        await page.goto(PARABANK);
        await expect(page.getByRole('button',{ name: 'Log In' })).toBeVisible();
        const count = await page.locator('#leftPanel a').count();
        expect(count).toBeGreaterThan(0);
    });
});

//------------------------------
//Section 7 - Soft and Hard assersions
//------------------------------  
test.describe('Section 7 - Soft and Hard assersions',() => {
    test('soft - check every registartion field, report all failure at once',async ({ page }) => {
        await page.goto(PARABANK_REG);
        await expect.soft(page.locator('[name="customer.firstName"]')).toBeVisible(); //By default asssert is hard means if it gets any issue, execution stops then and there
        await expect.soft(page.locator('[name="customer.lastName"]')).toBeVisible();
        await expect.soft(page.locator('[name="customer.address.street"]')).toBeVisible();
        await expect.soft(page.locator('[name="customer.address.city"]')).toBeVisible();
        await expect.soft(page.locator('[name="customer.address.state"]')).toBeVisible();
        await expect.soft(page.locator('[name="customer.phoneNumber"]')).toBeVisible();
        await expect.soft(page.locator('[name="customer.ssn"]')).toBeVisible();
        await expect.soft(page.locator('[name="customer.username"]')).toBeVisible();
        await expect.soft(page.locator('[name="customer.password"]')).toBeVisible();
        await expect.soft(page.locator('[name="repeatedPassword"]')).toBeVisible();
        expect(test.info().errors).toHaveLength(0);
    });
});