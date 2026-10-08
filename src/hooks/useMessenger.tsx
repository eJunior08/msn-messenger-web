import { createContext, useContext, useSyncExternalStore } from 'react';
import type { MessengerService } from '../application/MessengerService';
export const MessengerContext = createContext<MessengerService | null>(null);
export function useMessenger() {
  const service = useContext(MessengerContext);
  if (!service) throw new Error('MessengerProvider is missing.');
  const state = useSyncExternalStore(service.subscribe, service.getSnapshot);
  return { state, service };
}
