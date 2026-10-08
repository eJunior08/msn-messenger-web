import { test, expect } from '@playwright/test';
test('retains separate drafts when switching conversations and closing tabs', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Chat with Jamie Parker', exact: true }).click();
  await page.getByRole('textbox', { name: 'Message', exact: true }).fill('A draft for Jamie');
  const back = page.getByRole('button', { name: 'Back to contacts' });
  if (await back.isVisible()) await back.click();
  await page.getByRole('button', { name: 'Chat with Sarah Chen', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Message', exact: true })).toHaveValue('');
  await page.getByRole('textbox', { name: 'Message', exact: true }).fill('A draft for Sarah');
  await page.getByRole('button', { name: 'Jamie', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Message', exact: true })).toHaveValue('A draft for Jamie');
  await page.getByRole('button', { name: 'Close chat with Jamie Parker', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Message', exact: true })).toHaveValue('A draft for Sarah');
});
test('removes a local contact after confirmation', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Chat with Jamie Parker', exact: true }).click();
  await page.getByRole('button', { name: 'Contact options' }).click();
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Remove contact', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Chat with Jamie Parker', exact: true })).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Chat with Jamie Parker', exact: true })).toHaveCount(0);
});
