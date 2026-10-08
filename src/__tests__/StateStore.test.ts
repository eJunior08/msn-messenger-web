import { StateStore } from '../application/StateStore';
import { MessengerService } from '../application/MessengerService';
import { createSeed } from '../infrastructure/seed';
it('waits for asynchronous loading before exposing a service', async () => {
  const state = createSeed();
  const service = await MessengerService.create({ load: async () => state, save: async () => undefined });
  expect(service.getSnapshot()).toBe(state);
});
it('serializes slow writes without dropping concurrent changes', async () => {
  const writes: string[] = [];
  const store = new StateStore({ load: async () => createSeed(), save: async state => {
    await new Promise(resolve => setTimeout(resolve, 5)); writes.push(state.profile.name);
  } }, createSeed());
  await Promise.all([
    store.update(state => ({ ...state, profile: { ...state.profile, name: 'First' } })),
    store.update(state => ({ ...state, profile: { ...state.profile, name: `${state.profile.name} Second` } })),
  ]);
  expect(writes).toEqual(['First', 'First Second']);
  expect(store.getSnapshot().profile.name).toBe('First Second');
});
it('keeps the last saved state after rejection and allows a later retry', async () => {
  const save = jest.fn().mockRejectedValueOnce(new Error('Offline')).mockResolvedValueOnce(undefined);
  const state = createSeed();
  const store = new StateStore({ load: async () => state, save }, state);
  await expect(store.update(value => ({ ...value, signedIn: false }))).rejects.toThrow('Offline');
  expect(store.getSnapshot()).toBe(state);
  await store.update(value => ({ ...value, signedIn: false }));
  expect(store.getSnapshot().signedIn).toBe(false);
});
