import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Every public route, checked on whichever viewport the project defines
 * (desktop + mobile). Guards against the exact regressions the manual
 * audits caught: console/hydration errors, a11y violations, and
 * horizontal overflow.
 */
const routes = [
  "/",
  "/pricing",
  "/login",
  "/signup",
  "/dashboard",
  "/roadmap",
  "/transactions",
  "/budget",
  "/cashflow",
  "/goals",
  "/giving",
  "/accounts",
  "/assistant",
  "/settings",
];

for (const route of routes) {
  test(`no console/hydration errors on ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(`[pageerror] ${e.message}`));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(`[console.error] ${m.text()}`);
    });
    await page.goto(route, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    expect(errors, errors.join("\n")).toEqual([]);
  });

  test(`no WCAG A/AA a11y violations on ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const summary = violations.map(
      (v) => `${v.id} (${v.impact}) ×${v.nodes.length} — ${v.help}`
    );
    expect(summary, summary.join("\n")).toEqual([]);
  });

  test(`no horizontal overflow on ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
}
