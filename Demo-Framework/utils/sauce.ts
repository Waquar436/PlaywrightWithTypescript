/**
 * Demo framework - reusable steps live HERE, written once.
 * utils/sauce.ts
 * 
 * These are plain helper functions, Not Page Objects yet - that is Day 9,
 * where login() and the assertions become a LoginPage class.Today the win 
 * is simply: no copy-paaste, and a relative goto('/') driven by baseURL
 * 
 * Note: The relative paths ('/','/inventory.html'). They only work because
 * the config sets 'baseURL: https://www.saucedemo.com'. The host lives in ONE 
 * place (config), never scattered across every goto().
 */

import { Page,expect } from '@playwright/test';

/** One login row - the same shape the data file uses. */
export interface LoginRow { 
    username: string;
    password: string;
    expected: 'pass' | 'fail';
    message: string;
}

/** Reusable step: log in to SauceDemo. Uses baseUrRL via goto('/').  */
export async function login(page:Page, username: string, password: string): Promise<void> {
    await page.goto('/');
    await page.locator('#user-name').fill(username);
    await page.locator('#password').fill(password);
    await page.locator('#login-button').click();
}

/** Reusable assertion: a good login lands on the inventory page. */
export async function expectLoggedIn(page:Page): Promise<void> {
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.title')).toHaveText('Products');
}

/** Reusable assertion: a bad login shows SauceDemo's red error banner */
export async function expectLoginError(page:Page,message: string): Promise<void> {
    await expect(page.locator('[datda-test="error"]')).toContainText(message);
}

/** Reusable step: add a named product to the cart from the inventory page */
export async function addToCart(page: Page, productSlug: string): Promise<void> {
    await page.locator('[data-test="add-to-cart-${productSlug}"]').click();
}

/** Reusable assertion: the cart badge shows the expected item count. */
export async function expectCartCount(page: Page, count: number): Promise<void> {
    await expect(page.locator('.shopping_cart_badge')).toHaveText(String(count));
}