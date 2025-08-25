import { test, expect } from '@playwright/test'

test('Search → Company → Outreach CTA visible', async ({ page }) => {
  await page.goto('/app/search')
  await expect(page.getByText('Sample Importer 1')).toBeVisible()
  await page.getByText('Sample Importer 1').click()
  await expect(page.getByText('Start Outreach')).toBeVisible()
})