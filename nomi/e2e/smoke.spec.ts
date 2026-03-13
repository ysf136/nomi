import { test, expect } from "@playwright/test";

test("landing page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/NOVA/i);
});

test("login page reachable", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByText(/Login/i)).toBeVisible();
});
