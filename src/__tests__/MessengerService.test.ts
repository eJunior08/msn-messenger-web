import { MessengerService } from '../application/MessengerService';
import { createSeed } from '../infrastructure/seed';
import type { MessengerRepository } from '../domain/models';
async function setup() {
  const repository: MessengerRepository = { load: async () => createSeed(), save: jest.fn() };
  return { service: await MessengerService.create(repository), repository };
}
describe('Messenger use cases', () => {
  it('persists a trimmed message before notifying subscribers', async () => {
    const { service, repository } = await setup();
    const listener = jest.fn(); service.subscribe(listener);
    const message = await service.send('jamie', '  Hello again!  ');
    expect(message.text).toBe('Hello again!');
    expect(service.getSnapshot().messages.at(-1)).toEqual(message);
    expect(repository.save).toHaveBeenCalledWith(service.getSnapshot());
    expect(listener).toHaveBeenCalledTimes(1);
  });
  it('rejects blank, oversized, missing-contact and blocked-contact messages', async () => {
    const { service } = await setup();
    await expect(service.send('jamie', '  ')).rejects.toThrow();
    await expect(service.send('jamie', 'a'.repeat(2001))).rejects.toThrow();
    await expect(service.send('missing', 'Hello')).rejects.toThrow();
    await service.updateContact('jamie', { blocked: true });
    await expect(service.send('jamie', 'Hello')).rejects.toThrow();
    const count = service.getSnapshot().messages.length;
    await service.receive('jamie', 'Ignored');
    expect(service.getSnapshot().messages).toHaveLength(count);
  });
  it('does not mutate state or notify when storage fails', async () => {
    const { service, repository } = await setup();
    const before = service.getSnapshot(); const listener = jest.fn(); service.subscribe(listener);
    repository.save = () => { throw new Error('Storage full'); };
    await expect(service.send('jamie', 'Hello')).rejects.toThrow('Storage full');
    expect(service.getSnapshot()).toBe(before);
    expect(listener).not.toHaveBeenCalled();
  });
  it('normalizes emails and prevents duplicate contacts', async () => {
    const { service } = await setup();
    await service.addContact('  Chris  ', ' CHRIS@EXAMPLE.COM ', 'Family');
    expect(service.getSnapshot().contacts.at(-1)).toMatchObject({ name: 'Chris', email: 'chris@example.com', group: 'Family' });
    await expect(service.addContact('Chris', 'chris@example.com', 'Friends')).rejects.toThrow('already');
    await expect(service.addContact('Chris', 'invalid', 'Friends')).rejects.toThrow('valid');
    await expect(service.addContact('  ', 'another@example.com', 'Friends')).rejects.toThrow('display name');
  });
  it('removes associated messages and ignores replies for deleted contacts', async () => {
    const { service } = await setup(); await service.removeContact('jamie'); await service.receive('jamie', 'Late reply');
    expect(service.getSnapshot().messages).toHaveLength(0);
    expect(service.getSnapshot().contacts.some(c => c.id === 'jamie')).toBe(false);
  });
  it('saves profile, preferences, favorite and sign-in state', async () => {
    const { service } = await setup();
    await service.updateProfile({ name: 'Alex', presence: 'away' });
    await service.updateSettings({ theme: 'mint', sound: false });
    await service.updateContact('jamie', { favorite: false });
    await service.signOut(); await service.receive('jamie', 'Ignored');
    await expect(service.send('jamie', 'Hello')).rejects.toThrow();
    await expect(service.signIn('', 'bad')).rejects.toThrow();
    await service.signIn('  Robin  ', 'robin@example.com');
    expect(service.getSnapshot()).toMatchObject({ signedIn: true, profile: { name: 'Robin', presence: 'away' }, settings: { theme: 'mint', sound: false } });
    expect(service.getSnapshot().contacts[0].favorite).toBe(false);
  });
  it('receives simulated messages and unsubscribes cleanly', async () => {
    const { service } = await setup(); const listener = jest.fn();
    const unsubscribe = service.subscribe(listener); unsubscribe();
    await service.receive('jamie', 'Hello');
    expect(service.getSnapshot().messages.at(-1)).toMatchObject({ author: 'contact', text: 'Hello' });
    expect(listener).not.toHaveBeenCalled();
  });
  it('keeps attachment and formatting metadata', async () => {
    const { service } = await setup();
    const attachment = { name: 'note.txt', size: 2, dataUrl: 'data:text/plain;base64,aGk=' };
    expect(await service.send('jamie', 'File', 'file', { attachment, bold: true })).toMatchObject({ kind: 'file', attachment, bold: true });
  });
});
