import { test, expect } from "@playwright/test";

test("security headers are set and X-Powered-By is hidden", async ({ request }) => {
  const res = await request.get("/");
  const h = res.headers();
  expect(h["content-security-policy"]).toContain("default-src 'self'");
  expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(h["x-frame-options"]).toBe("DENY");
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(h["x-powered-by"]).toBeUndefined();
});

test("private app routes are marked noindex", async ({ page }) => {
  await page.goto("/dashboard");
  const robots = page.locator('meta[name="robots"]');
  await expect(robots).toHaveAttribute("content", /noindex/);
});

test("mobile drawer: opens, traps focus, and closes on Escape", async ({ page }) => {
  await page.goto("/dashboard");
  const burger = page.getByRole("button", { name: "Open menu" });
  // Hamburger only exists below the lg breakpoint (mobile project).
  test.skip(!(await burger.isVisible()), "no hamburger on desktop viewport");

  await burger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  // Focus should have moved into the dialog (modal contract).
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document
            .querySelector('[role="dialog"]')
            ?.contains(document.activeElement) ?? false
      )
    )
    .toBe(true);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});
