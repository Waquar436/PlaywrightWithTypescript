/**
 * Demo framework - tests/login.spec.ts
 * Login behavious, driven entirely the LoginPage object.
 * 
 * Notice: not a single '#' selector in the file. The page object owns them.
 * we import 'test' from our fixtures so loginPage/inventoryPage are injected.
 */
import { test } from '../fixtures/sauce-fixtures';

test.describe('SauceDemo login',() => {
    test('@smoke valid login lands on the inventory page',async ({ loginPage, inventoryPage }) => {
        await loginPage.login('standard_user','secret_sauce');
        await inventoryPage.expectLoaded();
    });

    test('@regression locked-out user is rejected',async ({ loginPage }) => {
        await loginPage.login('locked_out_user','secret_sauce');
        await loginPage.expectError('locked out');
    });

    test('@regression wrong password is rejected',async ({ loginPage }) => {
        await loginPage.login('standard_user','wrong_password');
        await loginPage.expectError('Username and password do not match');
    });

    test('@regression empty credentials show a required-field error',async ({ loginPage }) => {
        await loginPage.login('','');
        await loginPage.expectError('Username is required');
    });
});

test.describe('SauceDemo login - already authenticated (beforeEach)',() => {
    test.beforeEach(async ({ loginPage }) => {
        await loginPage.login('standard_user','secret_sauce');
    });

    //after Each runs regardless of pass/fail - useful for logging, not just cleanup.
    test.afterEach(async ({},testInfo) => {
        console.log(`[${testInfo.title}] finished with status: ${testInfo.status}`);
    });

    test('@smoke beforeEach logged us in; the test starts on inventory', async ({ inventoryPage }) => {
        await inventoryPage.expectLoaded();
    });
});