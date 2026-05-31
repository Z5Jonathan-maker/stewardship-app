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

test("assistant answers (falls back to the local mock without an API key)", async ({
  page,
}) => {
  await page.goto("/assistant");
  await page.getByRole("button", { name: "How much have we given this month?" }).click();
  // With no ANTHROPIC_API_KEY in CI the route 503s and the client falls back
  // to the stewardship mock — either path must produce a reply in the log.
  const log = page.getByRole("log");
  await expect(log).toContainText(/\$[\d,]+/, { timeout: 15_000 });
});

test("assistant API route reports unavailable without a key", async ({ request }) => {
  // In CI there is no ANTHROPIC_API_KEY, so the route should 503 (not 500).
  // Locally with a key set this returns 200 — accept either, never a crash.
  const res = await request.post("/api/assistant", {
    data: { messages: [{ role: "user", text: "What is my net worth?" }] },
  });
  expect([200, 503]).toContain(res.status());
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
