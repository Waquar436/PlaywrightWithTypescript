import {test,expect} from '@playwright/test' 

const PARABANK = 'https://parabank.parasoft.com/parabank/index.htm';

const HEROKUAPP = 'https://the-internet.herokuapp.com/login';

const GooglePage = 'https://www.google.com/';

const SAUCEDEMO = 'https://www.saucedemo.com/';

test.describe('Day3_session',() => {
    test.beforeEach(async ({ page }) => {
        await page.goto(PARABANK);
    });

    test('1 - getByRole - gold standard (survives every DevTools change)',async ({ page }) => {
        //DevTools -> Accesibility tab -> Role: button,Accessible Name: "Log In"
        const loginButton = page.getByRole('button',{name: 'Log In'});
        await expect(loginButton).toBeVisible();
    });

    test('2 - getByText - matches element by its visible text content',async ({ page }) => {
        //useful for headings, links, labels, and button text
        await expect(page.getByText('Customer Login')).toBeVisible();
        await expect(page.getByRole('link',{ name: 'Register' })).toBeVisible();
    });

    test('3 - CSS id - acceptable when IDs are meaningful and stable', async ({ page }) => {
        const loginPanel = page.locator('#loginPanel');
        await expect(loginPanel).toBeVisible();
    });

    test('4 - CSS attribute - good for stable HTML attributes like name or type', async ({ page }) => {
        const usernameInput = page.locator('input[name="username"]');
        await expect(usernameInput).toBeVisible();
    });

    test('5 -  CSS class -  FRAGILE (rename class in DevTools to break this)', async ({ page }) => {
        // DEMO: In DevTools, rename class="button" to class="btn" on the submit input.
        //This test breaks. Revert and it passes. The getByRole test above is unaffected.
        //
        //Extra: .button matches all form buttons so .first() is used to narrow to the first one. This is fragile because the order of buttons can change.
        const submitByClass = page.locator('.button').first();
        await expect(submitByClass).toBeVisible();
    });

    test('6 - Positional XPath - very FRAGILE (ad a wrapper div to break this)', async ({ page }) => {
        //DEMO: In DevTools, wrap the submit input in an extra <div>.
        //The position [1] now points to the wrong element.getByRole still works fine.
        const submitByXPath = page.locator('(//form//input[@type="submit"])');
        await expect(submitByXPath).toBeVisible();
    });

    test('getByRole - full login sequence @smoke',async ({ page }) => {
        await page.locator('input[name="username"]').fill('john');
        await page.locator('input[name="password"]').fill('demo');
        await page.getByRole('button',{ name: 'LOG IN' }).click();
        await expect(page).toHaveURL(/overview/);
    });

    test('getByRole - heading with level option @locator',async ({ page }) => {
        const heading = page.getByRole('heading',{ name: 'Customer Login',level:2 });
        await expect(heading).toBeVisible();
    });

    test('getByRole - navigation links scoped to header panel @locator', async ({ page }) => {
        const header = page.locator('#headerPanel');
        await expect(header.getByRole('link',{ name: 'About Us' })).toBeVisible();
        await expect(header.getByRole('link',{ name: 'Services' })).toBeVisible();
        await expect(header.getByRole('link',{ name: 'Locations' })).toBeVisible();
    });

    test('getByLabel - fill form fields linked by <label> @smoke @locator',async ({ page }) => {
        await page.goto(HEROKUAPP);
        await page.getByLabel('Username').fill('tomsmith');
        await page.getByLabel('Password').fill('SuperSecretPassword!');
        await page.getByRole('button',{ name: 'Login' }).click();

        await expect(page).toHaveURL(/secure/);
    });

    test('getByPlaceHolder - fill fields that use placeholder text @smoke @locator',async ({ page }) => {
        await page.goto(SAUCEDEMO);
        await page.getByPlaceholder('Username').fill('standard_user');
        await page.getByPlaceholder('Password').fill('secret_sauce');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page).toHaveURL(/inventory/)
    });
});