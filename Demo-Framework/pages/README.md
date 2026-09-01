# pages/ - Page Objects

Each class here OWS the locators for ONE page and exposes readable methods.
Tests never touch raw selectors - they call 'loginPage.login(...)', not
'page.locator('#login-button')'.

- 'LoginPage.ts' - username/password/login-button locators + 'login()'+ 'expectError()'
- 'InventoryPage.ts' - the page after login: 'expectLoaded()','addToCart()', cart count

Rule: this folder is the ONLY place allowed to name a page's selector