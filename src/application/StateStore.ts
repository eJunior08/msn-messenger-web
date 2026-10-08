import type { MessengerRepository, MessengerState } from '../domain/models';
/** Serializes persistence so slow adapters cannot overwrite newer changes. */
export class StateStore {
  private pending: Promise<void> = Promise.resolve();
  private readonly listeners = new Set<() => void>();
  constructor(private readonly repository: MessengerRepository, private state: MessengerState) {}
  getSnapshot = (): MessengerState => this.state;
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };
  update(transform: (state: MessengerState) => MessengerState): Promise<void> {
    const operation = this.pending.then(async () => {
      const next = transform(this.state);
      await this.repository.save(next);
      this.state = next;
      this.listeners.forEach(listener => listener());
    });
    this.pending = operation.catch(() => undefined);
    return operation;
  }
}
