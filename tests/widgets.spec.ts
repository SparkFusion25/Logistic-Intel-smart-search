import { test, expect } from '@playwright/test'

test('Tariff + Quote pages render actions', async ({ page }) => {
  await page.goto('/app/widgets/tariff')
  await expect(page.getByText('Tariff Calculator')).toBeVisible()
  await page.goto('/app/widgets/quote')
  await expect(page.getByText('Build RFP / Quote')).toBeVisible()
})