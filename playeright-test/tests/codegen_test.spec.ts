import { test, expect } from '@playwright/test';

test('TC01_Bill check', async ({ page }) => {
  await page.goto('https://parabank.parasoft.com/parabank/index.htm');
  await page.locator('input[name="username"]').fill('wronguser');
  await page.locator('input[name="password"]').click();
  await page.locator('input[name="password"]').fill('wrongpass');
});