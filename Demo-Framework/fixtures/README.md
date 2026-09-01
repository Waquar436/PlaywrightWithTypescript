# fixtures/ - Custom fixtures

`sauce-fixtures.ts` extends playwright's `test` so page objects are injected into the test arguments:

- `loginPage` - a ready-made `LoginPage`
- `inventoryPage` - a ready-made `InventoryPage`
- `loggedInPage` - an `InventoryPage` already past the login screen

Specs import `test` from here instead of from `@playwright/test`.
Session  reuse without the UI lives in `tests/auth.setup.ts` (storageState)