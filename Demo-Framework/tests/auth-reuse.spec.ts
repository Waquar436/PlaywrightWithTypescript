/**
 * Demo framework - tests/auth-reuse.spec.ts
 * storageState in action: NO login UI at all.
 * 
 * This file loads the session saved by tests/auth.setup.ts, so every test here
 * opens ALREADY authenticated.test.use({ storageState })' applies it to the 
 * whole file. The setup project (a config 'dependency') guarantees the saved
 * file exists before this runs.
 */
import { test } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';
import { STANDARD_STATE } from '../utils/auth.paths';
import { PROBLEM_STATE } from '../utils/auth.paths';

test.use({ storageState: PROBLEM_STATE });

test('@smoke open inventory directly using the saved session',async ({ page }) => {
    await page.goto('/inventory.html');
    await new InventoryPage(page).expectLoaded();
});

test('@regression saved session can add to cart',async ({ page }) => {
    const inventory = new InventoryPage(page);
    await page.goto('/inventory.html');
    await inventory.addToCart('sauce-labs-backpack');
    await inventory.expectCartCount(1);
});