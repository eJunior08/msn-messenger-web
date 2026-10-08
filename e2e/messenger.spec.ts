import { test, expect, type Page } from '@playwright/test';
async function openChat(page: Page, name = 'Jamie Parker') {
  await page.getByRole('button', { name: `Chat with ${name}`, exact: true }).click();
}
async function backToContacts(page: Page) {
  const back = page.getByRole('button', { name: 'Back to contacts' });
  if (await back.isVisible()) await back.click();
}
test.beforeEach(async ({ page }) => { await page.goto('/'); });
test('sends, receives a demo reply and preserves the conversation after reload', async ({ page }) => {
  await openChat(page);
  await page.getByRole('textbox', { name: 'Message', exact: true }).fill('Hello from the future');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await expect(page.getByText('Hello from the future', { exact: true })).toBeVisible();
  await expect(page.getByText('Jamie is typing…')).toBeVisible();
  await expect(page.getByText('Ahh, I missed chatting like this! 😊')).toBeVisible();
  await page.reload(); await openChat(page);
  await expect(page.getByText('Hello from the future', { exact: true })).toBeVisible();
});
test('uses emoticons, nudges, winks and file attachments', async ({ page }) => {
  await openChat(page);
  await page.getByRole('button', { name: 'Choose an emoticon' }).click();
  await page.getByRole('button', { name: 'Insert ❤️' }).click();
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await expect(page.getByText('❤️', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Send a nudge' }).click();
  await expect(page.getByText('You sent a nudge!')).toBeVisible();
  await page.getByRole('button', { name: 'Send a wink' }).click();
  await expect(page.getByText('😉', { exact: true })).toBeVisible();
  await page.getByLabel('Choose file').setInputFiles({ name: 'hello.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') });
  await expect(page.getByRole('link', { name: /hello.txt/ })).toHaveAttribute('download', 'hello.txt');
});
test('searches contacts and adds a new local contact with duplicate validation', async ({ page }) => {
  await page.getByLabel('Find a contact').fill('sarah');
  await expect(page.getByRole('button', { name: 'Chat with Sarah Chen' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Chat with Jamie Parker', exact: true })).toBeHidden();
  await page.getByLabel('Find a contact').fill('');
  await page.getByRole('button', { name: 'Add a contact', exact: true }).click();
  await page.getByLabel('Display name', { exact: true }).fill('New Friend');
  await page.getByLabel('Email address', { exact: true }).fill('jamie@hotmail.com');
  await page.getByRole('button', { name: 'Add contact', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('already');
  await page.getByLabel('Email address', { exact: true }).fill('friend@example.com');
  await page.getByRole('button', { name: 'Add contact', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Chat with New Friend' })).toBeVisible();
});
test('edits the profile and persists status, theme and sound preferences', async ({ page }) => {
  await page.getByLabel('Your status').selectOption('away');
  await page.getByRole('button', { name: 'Edit profile' }).click();
  await page.getByLabel('Display name', { exact: true }).fill('Robin');
  await page.getByLabel('Personal message', { exact: true }).fill('Back in 2006');
  await page.getByRole('button', { name: 'Use 🚀 avatar' }).click();
  await page.getByRole('button', { name: 'Save changes' }).click();
  await page.getByRole('button', { name: 'Preferences' }).click();
  await page.getByRole('button', { name: 'mint', exact: true }).click();
  await page.getByRole('checkbox', { name: /Messenger sounds/ }).uncheck();
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Robin', exact: true })).toBeVisible();
  await expect(page.getByLabel('Your status')).toHaveValue('away');
  await expect(page.locator('.app')).toHaveClass(/theme-mint/);
  await expect(page.getByRole('button', { name: 'Enable sounds' })).toBeVisible();
});
test('blocks and unblocks a contact, switches chats and plays a game', async ({ page }) => {
  await openChat(page);
  await page.getByRole('button', { name: 'Contact options' }).click();
  await page.getByRole('button', { name: 'Block contact', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Message', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Contact options' }).click();
  await page.getByRole('button', { name: 'Unblock contact', exact: true }).click();
  await backToContacts(page); await openChat(page, 'Sarah Chen');
  await page.getByRole('button', { name: 'Jamie', exact: true }).click();
  await expect(page.getByRole('heading', { name: /Jamie Parker/ })).toBeVisible();
  await page.getByRole('button', { name: 'Play a game' }).click();
  await page.getByRole('button', { name: 'Square 1', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Square 1: X' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Square 5: O' })).toBeVisible();
});
test('signs out and returns to a local session without a password', async ({ page }) => {
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page.getByRole('heading', { name: 'Good to see you again.' })).toBeVisible();
  await page.getByLabel('Display name', { exact: true }).fill('Taylor');
  await page.getByRole('button', { name: 'Sign in to the demo' }).click();
  await expect(page.getByRole('button', { name: 'Taylor', exact: true })).toBeVisible();
});
test('fits the viewport and supports keyboard dismissal of dialogs', async ({ page }) => {
  const fits = await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
  expect(fits).toBe(true);
  await page.getByRole('button', { name: 'Edit profile' }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await openChat(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
