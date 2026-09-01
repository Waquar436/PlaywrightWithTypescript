Demo Framework – Playwright + TypeScript

A small but complete, enterprise-style Playwright framework: Page Object
Model, custom fixtures, and storageState authentication. It is self-contained
– install and run it from inside this folder. Everything points at the public
practice site https://www.saucedemo.com.

Quick start (Windows / macOS / Linux)

Open a terminal inside this folder and run:

npm install                         # installs Playwright + xlsx + dotenv
npx playwright install chromium     # downloads the browser (one time)
npm test                            # runs the whole suite

On Windows, the same three commands work in PowerShell or Command Prompt.
That's it – no other setup. The login session is created automatically before the
tests run (see "How auth works" below).

Behind the TCS corporate proxy? The config already sets
ignoreHTTPSErrors: true, so the self-signed proxy certificate won't block
tests. If npm install or npx playwright install is blocked, point npm at
your approved registry/proxy first (npm config set proxy ...).

The folder layout – every file has ONE home

demo-framework/
├── tests/                         # WHAT we verify – the .spec.ts files
│   ├── login.spec.ts              # login behaviour, via the LoginPage object
│   ├── inventory.spec.ts          # add-to-cart, via the loggedInPage fixture
│   └── data-driven.spec.ts        # one test per row from EXCEL + JSON
│   └── auth-reuse.spec.ts         # storageState - opens already logged in
|   └── auth-setup.ts              # logs in once, saves the session (runs first)
├── pages/                         # Page Object Model classes
│   ├── LoginPage.ts               
│   ├── InventoryPage.ts           
│                                  
│
├── fixtures/                       # custom fixtures that inject the page
│   └── sauce-fixtures.ts           
│
├── utils/
│   └── sauce.ts              
|   └── auth.path.ts
│
├── data/                           #test data, kept out of the tests
│   ├── loginData.xlsx              # Excel test data
│   └── loginData.json              # JSON test data
|    └── loginData.csv
│
├── playwright.config.ts            # Playwright configuration
├── package.json                    # dependencies and npm scripts
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # this document
└── .env.example                    # copy to .env (git-ignored) for secrets+host

The rule: each kind of file has exactly one home, and test only call **down**
into `pages` / `fixtures` / `utils` / 'data' - never sideways into eachother

## The three ideas in this framework

1. **Page Object Model** - `pages/LoginPage.ts` and `inventoryPage.ts` OWN the selectors. No test contains a `#` selector. Rename a locator once, in the page class, and every test keeps working.
2. **Custom fixtures** - `fixtures/sauce-fixture.ts' injects ready-made page objects, so test never write 'new LoginPage(page)`.`loggedInPage` even starts you past the login screen.
3. **Authentication via storageState** - `tests/auth.setup.ts` logs in once and saves the session to `.auth/*.json`. Test that opt in ('auth-reuse.spec.ts`) open alreaady authenticated - no login UI.

## How auth works(you don't run anything extra)

The config defines a **`setup` project** and list it as as **dependency** of the `chromium` project:

```
projects: [
  { name: `setup`,testMatch: /auth\.setup\.ts/},
  { name: `chromium`, use: {...}, dependencies: [`setup`]},
]
```

so `npm test` automatically runs `auth.setup.ts` first (saving the `standard_user` and `problem_user` sessions), then the real tests. The login tests still start logged out - only `auth-reuse.spec.ts` loads a saved session.

##useful commands

```bash
npm test                # everything (setup runs first automatically)
npm run test:smoke      # only @smoke tests (what CI runs on every commit)
npm run test:regression # only @regression tests
npm run test:data       # the Excel + JSON data-driven suite
npm run test:auth       # the storageState reuse suite
npm run test:headed     # what it run in a visible browser
npm run test:ui         # playwright's time travel UI mode
npm run report          # open the HTM report after a run

## Switching environment (.env)

```bash
cp .env.example .env #Windows: copy .env.example .env
# then set ENV before the test command. e.g.
# PowerShell: $env:ENV="staging";npm test
# CMD:        set ENV=staging && npm test
# bash:       ENV=staging npm test

`dotenv` is installed, so values in `.env` are picked up automatically.
