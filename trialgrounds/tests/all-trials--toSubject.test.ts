import { expect, test } from '@playwright/test';
import { trialNames } from '../src/lib/trials/trialNames';

test.describe.configure({ mode: 'parallel' });

trialNames.forEach((trialName) => {
  test(`test trial ${trialName}`, async ({ page }, testInfo) => {
    await page.goto(`http://localhost:4173/${trialName}?forPlaywright`);
    await expect(page).toHaveScreenshot([trialName, testInfo.project.name + '.png']);
  });
});
