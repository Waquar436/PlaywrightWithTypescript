/**
* Demo framework - Page Object: pages/InventoryPage.ts
*
* one page = one class. After login we land here, so the assertions that prove
* "we are logged in" belong to THIS page, not to LoginPage.It also exposes a
* little behaviour (add to cart, read the cart count) to show a Page Object
* holds ACTIONS, not just assertions.
*/
import { Page,Locator, expect } from '@playwright/test';

export class InventoryPage {
    readonly page: Page;
    readonly title: Locator;
    readonly cartBadge: Locator;
    readonly menuButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('.title');
        this.cartBadge = page.locator('.shopping_cart_badge');
        this.menuButton = page.locator('#react-burger-menu-btn');
    }

    /**Proof we reached the inventory page after a good login. */
    async expectLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(/inventory\.html/);
        await expect(this.title).toHaveText('Products');
    }

    /** Add a product to the cart by its data-test slug, e.g 'sauce-labs-backpack'.*/
    async addToCart(productSlug: string): Promise<void> {
        await this.page.locator(`[data-test="add-to-cart-${productSlug}"]`).click();
    }

    /** Read the number on the cart badge (0 when the badge is absent).*/
    async cartCount(): Promise<number> {
        if (await this.cartBadge.count() === 0) return 0;
        return Number(await this.cartBadge.innerText());
    }

    /** Assertion: the cart badge shows the expected count.*/
    async expectCartCount(count: number): Promise<void> {
        await expect(this.cartBadge).toHaveText(String(count));
    }
}