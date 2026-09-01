/**
 * Demo framework - Page Object: pages/LoginPage.ts
 * 
 * A Page Object is a class that OWNS the locators for ONE page and exposes
 * readable methods. Tests never touch raw selectors.
 * 
 * A previous session lifted the login steps into utils/sauce.ts as plain
 * functions. This session gives them a proper home: a class whose fields are 
 * the locators and whose methods are the actions. Rename #user-name tomorrow 
 * and you fix it HERE, in ONE place - every test keeps working.
 * 
 * Locator-ownership rule: this class is the ONLY file allowed to name the
 * login selectors. A grep for '#login-button' in tests/ should find nothing.
 */
import {Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorBanner: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.locator('#user-name');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('#login-button');
        this.errorBanner = page.locator('[data-test="error"]');
    }

    /**Navigate to the login page. Relative '/' so the config baseURL picks host.*/
    async goto(): Promise<void> {
        await this.page.goto('/');
    }

    /** The whole login flow as ONE readable methos. */
    async login(username: string, password: string): Promise<void> {
        await this.goto();
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    /** Assertion that belongs to THIS page: the red error banner contains text. */
    async expectError(message: string): Promise<void> {
        await expect(this.errorBanner).toContainText(message);
    }
}
