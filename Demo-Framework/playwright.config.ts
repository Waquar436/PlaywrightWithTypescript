/**
 * demo framework - playwright.config.ts
 * The single course of truth for shared settings.
 * 
 * Every value below answers ONE question: "is this shared by ALL tests?"
 * if yes, it lives HERE - never copy-pasted into a spec.
 * 
 * Self-contained: run from INSIDE this folder
 *     npm install
 *     npm playwright install chromium
 *     npm test
 */
import { defineConfig, devices } from '@playwright/test';
import * as path from 'path'

//--------------.env support(optional)----------------------
// Secrets and the target host belong in a .env file that is NOT committed.
// We load it if dotenv is installed; otherwise the defaults below keep this
// example running out of the box.(Copy .env.example to .env to try it.)
try{
  //eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config({ path: path.join(__dirname,'env') });
} catch {
  /* dotenv not installed - defaults below are used */
}

//One place decides the environment: set ENV=staging before the test command.
const ENV = process.env.ENV ?? 'prod';
const BASE_URLS: Record<string, string> = {
  prod: 'https://www.saucedemo.com',
  staging: 'https://www.saucedemo.com', // same demo site; real projects differ
};

export default defineConfig({
  // Where the tests live. testDir is relative to THIS config file
  testDir: './tests',
  // Timeouts: one per-test cap, one per-assertion cap. Shared by all.
  timeout: 30_000,
  expect: {timeout: 7_000},

  // CI hygine: block a committed test only; retry a flaky test ONCE on CI,
  // never locally, so flakiness can't hide on your own machine.
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  
  //Reporters: live list in the terminal + a browsable HTML report.
  reporter: [
    ['list'],
    ['html',{ open: 'never' }],
  ],

  //use{}: settings every test inherits unless it overrides them.
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: BASE_URLS[ENV],  // goto('/') resolves against THIS host
    trace: 'on',              // record a trace only when a test retries
    screenshot: 'only-on-failure',
    video: 'off',
    ignoreHTTPSErrors: true,    // tolerate a corporate proxy cert (e.g. TCS)
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !ci,
  // },
});
