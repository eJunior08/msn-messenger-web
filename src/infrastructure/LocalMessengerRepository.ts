import type { MessengerRepository, MessengerState } from '../domain/models';
import { isMessengerState } from '../domain/rules';
import { createSeed } from './seed';
export const STORAGE_KEY = 'messenger-web:v1';
export class LocalMessengerRepository implements MessengerRepository {
  constructor(private readonly storage: Pick<Storage, 'getItem' | 'setItem'>) {}
  async load(): Promise<MessengerState> {
    try {
      const raw = this.storage.getItem(STORAGE_KEY);
      const saved: unknown = raw ? JSON.parse(raw) : null;
      return isMessengerState(saved) ? saved : createSeed();
    } catch { return createSeed(); }
  }
  async save(state: MessengerState): Promise<void> {
    try { this.storage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch { throw new Error('Your browser could not save this change. Free some storage and try again.'); }
  }
}
