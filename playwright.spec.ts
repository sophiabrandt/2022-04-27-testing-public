import { expect, test } from '@playwright/test';

test(`holiday card visual regression`, async ({ page }) => {
  await page.goto(
    'http://localhost:4400/iframe.html?id=eternal-holidaycard--on-sale&viewMode=story'
  );
  const screenshot = await page.screenshot();
  expect(screenshot).toMatchSnapshot('sale-holiday.png');
});
