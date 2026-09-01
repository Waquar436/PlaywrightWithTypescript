/**
 * Demo framework - tests/inventory.spec.ts
 * Inventory behaviour. The 'loggedInPage' fixture starts us ALREADY on the 
 * inventory page, so each test body begins where the real  work starts - no
 * login boilerplate repeated here
 */
import { test,expect } from '../fixtures/sauce-fixtures';

test.describe('SauceDemo inventory',() => {
    test('@smoke adding an item updates the cart badge',async ({ loggedInPage }) => {
        await loggedInPage.addToCart('sauce-labs-backpack');
        await loggedInPage.expectCartCount(1);
    });

    test('@regression adding two items shows a count of 2',async ({ loggedInPage }) => {
        await loggedInPage.addToCart('sauce-labs-backpack');
        await loggedInPage.addToCart('sauce-labs-bike-light');
        expect(await loggedInPage.cartCount()).toBe(2);
    });
});