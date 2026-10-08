import { LocalMessengerRepository, STORAGE_KEY } from '../infrastructure/LocalMessengerRepository';
import { createSeed } from '../infrastructure/seed';
import { filterContacts, isMessengerState } from '../domain/rules';
import { MAX_FILE_SIZE, readAttachment } from '../infrastructure/attachments';
beforeEach(() => localStorage.clear());
it('round trips conversations and settings', async () => {
  const repository = new LocalMessengerRepository(localStorage);
  const state = createSeed(); state.settings.theme = 'rose'; await repository.save(state);
  expect(await repository.load()).toEqual(state);
});
it.each(['{broken', '{"version":2}', '{"version":1,"profile":{}}'])('recovers from invalid saved data: %s', async raw => {
  localStorage.setItem(STORAGE_KEY, raw);
  expect((await new LocalMessengerRepository(localStorage).load()).profile.name).toBe('Alex Morgan');
});
it('handles denied reads and reports denied writes', async () => {
  const repository = new LocalMessengerRepository({ getItem: () => { throw new Error(); }, setItem: () => { throw new Error(); } });
  expect((await repository.load()).contacts.length).toBeGreaterThan(0);
  await expect(repository.save(createSeed())).rejects.toThrow('could not save');
});
it('rejects malformed contacts, timestamps and unsafe saved attachments', async () => {
  const state = createSeed();
  expect(isMessengerState(null)).toBe(false);
  expect(isMessengerState({ ...state, contacts: [{}] })).toBe(false);
  expect(isMessengerState({ ...state, profile: null })).toBe(false);
  expect(isMessengerState({ ...state, messages: [{ ...state.messages[0], createdAt: 'invalid' }] })).toBe(false);
  state.messages[0].attachment = { name: 'x', size: 1, dataUrl: 'javascript:alert(1)' };
  expect(isMessengerState(state)).toBe(false);
});
it('finds names, emails and personal messages without including blocked contacts', async () => {
  const contacts = createSeed().contacts;
  expect(filterContacts(contacts, ' JAMIE ')).toHaveLength(1);
  expect(filterContacts(contacts, 'sarah@hotmail')).toHaveLength(1);
  expect(filterContacts(contacts, 'Mr. Brightside')).toHaveLength(1);
  contacts[0].blocked = true;
  expect(filterContacts(contacts, 'jamie')).toHaveLength(0);
});
it('reads small files and rejects oversized files', async () => {
  const attachment = await readAttachment(new File(['hello'], 'hello.txt', { type: 'text/plain' }));
  expect(attachment).toMatchObject({ name: 'hello.txt', size: 5 });
  expect(attachment.dataUrl).toContain('data:text/plain;base64,');
  const large = new File([new Uint8Array(MAX_FILE_SIZE + 1)], 'large.bin');
  await expect(readAttachment(large)).rejects.toThrow('smaller than 2 MB');
});
