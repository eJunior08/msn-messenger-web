import type { Contact, Message, MessengerState, Presence } from './models';
export function validateContact(email: string, contacts: Contact[]): string | null {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address.';
  if (contacts.some(contact => contact.email.toLowerCase() === email.toLowerCase())) {
    return 'This person is already in your contacts.';
  }
  return null;
}
export function filterContacts(contacts: Contact[], query: string): Contact[] {
  const search = query.trim().toLowerCase();
  return contacts.filter(contact => !contact.blocked &&
    `${contact.name} ${contact.email} ${contact.message}`.toLowerCase().includes(search));
}
export function canSend(contact: Contact | undefined, text: string): boolean {
  return Boolean(contact && !contact.blocked && text.trim() && text.length <= 2000);
}
export function createMessage(contactId: string, text: string, kind: Message['kind'] = 'text'): Message {
  return { id: crypto.randomUUID(), contactId, author: 'self', text: text.trim(), kind,
    createdAt: new Date().toISOString() };
}
const presences: Presence[] = ['online', 'away', 'busy', 'offline'];
function isProfile(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  const p = value as Record<string, unknown>;
  return ['name', 'email', 'message', 'avatar'].every(key => typeof p[key] === 'string') &&
    presences.includes(p.presence as Presence);
}
export function isMessengerState(value: unknown): value is MessengerState {
  if (!value || typeof value !== 'object') return false;
  const s = value as MessengerState;
  return s.version === 1 && isProfile(s.profile) && typeof s.signedIn === 'boolean' &&
    Array.isArray(s.contacts) && s.contacts.every(c => isProfile(c) && typeof c.id === 'string' &&
      typeof c.favorite === 'boolean' && typeof c.blocked === 'boolean' && ['Friends', 'Family'].includes(c.group)) &&
    Array.isArray(s.messages) && s.messages.every(m => typeof m.id === 'string' &&
      typeof m.contactId === 'string' && typeof m.text === 'string' &&
      ['self', 'contact'].includes(m.author) && ['text', 'nudge', 'wink', 'file'].includes(m.kind) &&
      typeof m.createdAt === 'string' && Number.isFinite(Date.parse(m.createdAt)) &&
      (m.attachment === undefined || (typeof m.attachment.name === 'string' &&
        typeof m.attachment.size === 'number' && /^data:[\w/+.-]+;base64,/.test(m.attachment.dataUrl)))) &&
    !!s.settings && typeof s.settings.sound === 'boolean' && ['sky', 'mint', 'rose'].includes(s.settings.theme);
}
