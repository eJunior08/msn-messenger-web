import type { Contact, Message, MessengerRepository, MessengerState, Profile, Settings } from '../domain/models';
import { canSend, createMessage, validateContact } from '../domain/rules';
import { StateStore } from './StateStore';
export class MessengerService {
  private readonly store: StateStore;
  private constructor(repository: MessengerRepository, state: MessengerState) {
    this.store = new StateStore(repository, state);
  }
  static async create(repository: MessengerRepository): Promise<MessengerService> {
    return new MessengerService(repository, await repository.load());
  }
  getSnapshot = (): MessengerState => this.store.getSnapshot();
  subscribe = (listener: () => void): (() => void) => this.store.subscribe(listener);
  updateProfile(profile: Partial<Profile>): Promise<void> {
    return this.store.update(state => ({ ...state, profile: { ...state.profile, ...profile } }));
  }
  updateSettings(settings: Partial<Settings>): Promise<void> {
    return this.store.update(state => ({ ...state, settings: { ...state.settings, ...settings } }));
  }
  async signIn(name: string, email: string): Promise<void> {
    if (!name.trim() || validateContact(email, [])) throw new Error('Enter your name and a valid email.');
    await this.store.update(state => ({ ...state, signedIn: true,
      profile: { ...state.profile, name: name.trim(), email } }));
  }
  signOut(): Promise<void> { return this.store.update(state => ({ ...state, signedIn: false })); }
  addContact(name: string, email: string, group: Contact['group']): Promise<void> {
    return this.store.update(state => {
      const normalized = email.trim().toLowerCase();
      const error = validateContact(normalized, state.contacts);
      if (error) throw new Error(error);
      if (!name.trim()) throw new Error('Enter a display name.');
      const contact: Contact = { id: crypto.randomUUID(), name: name.trim(), email: normalized,
        group, message: 'New to your contacts', avatar: '👤', presence: 'offline', favorite: false, blocked: false };
      return { ...state, contacts: [...state.contacts, contact] };
    });
  }
  updateContact(id: string, changes: Partial<Pick<Contact, 'favorite' | 'blocked'>>): Promise<void> {
    return this.store.update(state => ({ ...state,
      contacts: state.contacts.map(c => c.id === id ? { ...c, ...changes } : c) }));
  }
  removeContact(id: string): Promise<void> {
    return this.store.update(state => ({ ...state, contacts: state.contacts.filter(c => c.id !== id),
      messages: state.messages.filter(m => m.contactId !== id) }));
  }
  async send(contactId: string, text: string, kind: Message['kind'] = 'text', extras: Partial<Pick<Message, 'attachment' | 'bold'>> = {}): Promise<Message> {
    const message = { ...createMessage(contactId, text, kind), ...extras };
    await this.store.update(state => {
      const contact = state.contacts.find(c => c.id === contactId);
      if (!state.signedIn || !canSend(contact, text)) throw new Error('This message cannot be sent.');
      return { ...state, messages: [...state.messages, message] };
    });
    return message;
  }
  receive(contactId: string, text: string): Promise<void> {
    return this.store.update(state => {
      const contact = state.contacts.find(c => c.id === contactId);
      if (!state.signedIn || !contact || contact.blocked) return state;
      const message: Message = { ...createMessage(contactId, text), author: 'contact' };
      return { ...state, messages: [...state.messages, message] };
    });
  }
}
