/**
 * Demo framework - Auth setup project: tests/auth.setup.ts
 * 
 * THE PROBLEM: logging in through the UI before every test is slow.
 * THE FIX: log in ONCE, save the browser's cookies+localStorage to a JSON
 * file (the "storageState"), then start other tests from that file - they open
 * already authenticated, with no login screen at all
 * 
 * HOW IT RUNS: This is a "setup" project (see playwright.config.ts). The main
 * project lists it under 'dependencies', so playwright runs it FIRST and only 
 * then runs the real tests. Each setup(...) below is a test that saves state
 * instead of asserting business logic.
 * 
 * NOTE: The filename ends in '.setup.ts', not '.spec.ts', so the normal test
 * project does NOT pick it up - only the setyup project (via testMatch) does.
 */

import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { STANDARD_STATE, PROBLEM_STATE  } from '../utils/auth.paths';   

/** Log in as standard_user and SAVE the session to disk. */
setup('authenticate as standard_user',async ({ page }) => {
    const login = new LoginPage(page);
    await login.login('standard_user','secret_sauce');
    await new InventoryPage(page).expectLoaded();
    await page.context().storageState({ path: STANDARD_STATE });
});

/** Log in as problem_user and save a SECOND session (a different role).*/
setup('authenticate as problem_user',async ({ page }) => {
    const login = new LoginPage(page);
    await login.login('problem_user','secret_sauce');
    await new InventoryPage(page).expectLoaded();
    await page.context().storageState({ path: PROBLEM_STATE });
});