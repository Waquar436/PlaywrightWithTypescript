import { test, expect } from '@playwright/test';

const PARABANK = 'https://parabank.parasoft.com/parabank/index.htm';

const HEROKUAPP = 'https://the-internet.herokuapp.com/login';

const GooglePage = 'https://www.google.com/';

const SAUCEDEMO = 'https://www.saucedemo.com/';

test.describe('Day2_Session',() => {
    test('getByLabel - fill form details linked by <label> @smoke',async ({ page }) => {
    await page.goto('https://practice.expandtesting.com/login');
    await page.getByLabel('username').fill('practice')
    await page.getByLabel('password').fill('SuperSecretPassword!')
    await page.getByRole('button',{ name: 'Login'}).click()
    });

    test('getByPlaceHolder - fill fields that uses placeholder text @smoke @locator',async ({ page }) => {
    await page.goto(SAUCEDEMO);
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button',{ name: 'Login'}).click()
    await expect(page).toHaveURL(/inventory/)
    });

    test('getByText - asserts visible text on the page @locator',async({ page }) => {
    await page.goto(PARABANK);
    await expect(page.getByText('Customer Login')).toBeVisible();
    await expect(page.getByText('Forgot login info?')).toBeVisible();
    });

    test('getByText - error message after wrong credentials @regression',async ({ page }) => {
    await page.goto(PARABANK);
    await page.locator('input[name="username"]').fill('wronguser');
    await page.locator('input[name="password"]').fill('wrongpass');
    await page.getByRole('button',{ name: 'LOG IN'}).click();
    await expect(
        page.getByText('The username and password could not be verified.')
    ).toBeVisible();
    });

    test('getByText - partial match and regex @locator',async ({ page }) => {
    await page.goto(PARABANK);
    await expect(page.getByText('Customer',{exact: false})).toBeVisible();
    await expect(page.getByText(/Customer.*/)).toBeVisible();    
    });

    test('chaining - scope the register link to the left panel @locator',async ({ page }) => {
    await page.goto(PARABANK);
    const leftpanel = page.locator('#leftPanel');
    const registerLink = leftpanel.getByRole('link',{ name: 'Register' });
    await expect(registerLink).toBeVisible();
    await registerLink.click();
    await expect(page).toHaveURL(/register/);
    });

    test('chaining - scope login from fields inside the login panel @locator',async ({ page }) => {
    await page.goto(PARABANK);
    const loginPanel = page.locator('#loginPanel');
    await loginPanel.locator('input[name="username"]').fill('john');
    await loginPanel.getByRole('button',{ name: 'LOG IN'}).click()
    });

    test('filtering - narrow a set of links by text content @locator',async ({ page }) => {
    await page.goto(PARABANK);
    // const navLinks = page.locator('#leftPanel a');
    // const registerLink = navLinks.filter({ hasText: 'Register'});
    // await expect(registerLink).toBeVisible();

    // const count = await navLinks.count();
    // console.log(`Left panel has ${count} navigation links`);
    // expect(count).toBeGreaterThan(0);

    const onlineServicesMenu = page.locator('ul.servicestwo').filter({has: page.locator('li',{hasText:'Online Services'})});
    await expect(onlineServicesMenu).toBeVisible();

    await onlineServicesMenu.getByRole('link',{name: 'Transfer Funds'}).click();
    });

    test('first() and nth() - positional selector as absolute last report @locator',async ({ page }) => {
    await page.goto(PARABANK);
    const navLinks = page.locator('#leftPanel a');
    await expect(navLinks.first()).toBeVisible();
    await expect(navLinks.last()).toBeVisible();
    await expect(navLinks.nth(0)).toBeVisible(); //zero-indexed
    });
});