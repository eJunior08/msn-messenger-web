export type Presence = 'online' | 'away' | 'busy' | 'offline';
export type Theme = 'sky' | 'mint' | 'rose';
export interface Profile {
  name: string; email: string; message: string; avatar: string; presence: Presence;
}
export interface Contact extends Profile {
  id: string; favorite: boolean; blocked: boolean; group: 'Friends' | 'Family';
}
export interface Attachment { name: string; dataUrl: string; size: number }
export interface Message {
  id: string; contactId: string; author: 'self' | 'contact'; text: string;
  kind: 'text' | 'nudge' | 'wink' | 'file'; createdAt: string; bold?: boolean;
  attachment?: Attachment;
}
export interface Settings { sound: boolean; theme: Theme }
export interface MessengerState {
  version: 1; profile: Profile; contacts: Contact[]; messages: Message[];
  settings: Settings; signedIn: boolean;
}
export interface MessengerRepository {
  load(): Promise<MessengerState>;
  save(state: MessengerState): Promise<void>;
}
export const presenceLabels: Record<Presence, string> = {
  online: 'Available', away: 'Away', busy: 'Busy', offline: 'Appear offline',
};
