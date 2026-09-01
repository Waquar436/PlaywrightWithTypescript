/**
 * Demo framework - Custom fixtures: fixtures/sauce-fixtures.ts
 * 
 * A fixture is named test setup that playwright builds and passes into the test
 * through its arguments (the built-in `page` is the famous example). Here we
 * add our own tests. So stop writting `new LoginPage(page)` by hand:
 * 
 * loginPage     -> a ready-made LoginPage(page)
 * inventoryPage -> a ready-made InventoryPage(page)
 * loggedInPage  -> an InventiryPage already past the login screen
 * 
 * Specs that want these import `test` from THIS file instead of `@playwright/test`
 */
import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

type SauceFixtures = {
    loginPage: LoginPage;
    inventoryPage: InventoryPage;
    loggedInPage: InventoryPage;
};

export const test = base.extend<SauceFixtures>({
    loginPage: async ({ page },use)=> {
        await use(new LoginPage(page));
    },
    inventoryPage: async ({ page },use) => {
        await use(new InventoryPage(page));
    },

    //Logs in once as the standard user and hands back an InventoryPage that is
    //already on the inventory screen.
    loggedInPage: async ({ page },use) => {
        const login = new LoginPage(page);
        await login.login('standard_user','secret_sauce');
        const inventory = new InventoryPage(page);
        await inventory.expectLoaded();
        await use(inventory)
    },
});
export { expect };