import type { Contact, MessengerState, Message } from '../domain/models';
const people: [string, string, string, Contact['presence'], string, boolean, Contact['group']][] = [
  ['Jamie Parker', 'jamie', 'Somewhere between a song and a daydream ♫', 'online', '🌻', true, 'Friends'],
  ['Sarah Chen', 'sarah', 'just one more episode…', 'online', '🐱', true, 'Friends'],
  ['Lucas Martins', 'lucas', '♫ The Killers – Mr. Brightside', 'online', '🛹', true, 'Friends'],
  ['Emma Wilson', 'emma', 'out chasing the sunshine ☀', 'away', '🍊', false, 'Friends'],
  ['Daniel Kim', 'daniel', 'Probably making a playlist', 'online', '🎧', false, 'Friends'],
  ['Sophie Taylor', 'sophie', 'brb, making tea', 'busy', '🪻', false, 'Friends'],
  ['Mom', 'mom', 'Home is wherever you are ♡', 'online', '🌷', false, 'Family'],
  ['Oliver Reed', 'oliver', 'see you on the other side', 'offline', '🏔️', false, 'Friends'],
  ['Mia Robinson', 'mia', 'collecting little moments', 'offline', '🦋', false, 'Friends'],
];
export function createSeed(): MessengerState {
  const contacts: Contact[] = people.map(([name, id, message, presence, avatar, favorite, group]) => ({
    name, id, message, presence, avatar, favorite, group, blocked: false, email: `${id}@hotmail.com`,
  }));
  const now = Date.now();
  const conversation: [Message['author'], string][] = [
    ['contact', 'heyyy! look who’s online 😊'],
    ['self', 'Hey! This feels like 2006 all over again.'],
    ['contact', 'right?! the only thing missing is my ridiculously long screen name 😂'],
    ['contact', 'So, what have you been listening to lately? ♫'],
  ];
  const messages: Message[] = conversation.map(([author, text], index) => ({
    id: `welcome-${index}`, contactId: 'jamie', author, text, kind: 'text',
    createdAt: new Date(now - (4 - index) * 60000).toISOString(),
  }));
  return { version: 1, profile: { name: 'Alex Morgan', email: 'alex@hotmail.com',
    message: 'a little nostalgia, a lot of good vibes ✨', avatar: '🏖️', presence: 'online' },
    contacts, messages, signedIn: true, settings: { sound: true, theme: 'sky' } };
}
