import { useEffect, useRef, useState } from 'react';
import type { Message } from '../domain/models';
import { useMessenger } from './useMessenger';
import { playSound } from '../infrastructure/sound';
const replies = ['Ahh, I missed chatting like this! 😊', 'Adding that to my playlist right now ♫',
  'We definitely need to do this more often!', 'Some things never get old. Like a good nudge 😂'];
export function useDemoReplies(reportError: (message: string) => void) {
  const { service } = useMessenger();
  const [typing, setTyping] = useState<string[]>([]);
  const timers = useRef(new Map<string, number>());
  const count = useRef(0);
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(window.clearTimeout);
  }, []);
  function schedule(message: Message) {
    const state = service.getSnapshot();
    const contact = state.contacts.find(c => c.id === message.contactId);
    if (!contact || contact.presence === 'offline') return;
    window.clearTimeout(timers.current.get(contact.id));
    setTyping(ids => [...new Set([...ids, contact.id])]);
    const reply = message.kind === 'nudge' ? 'Okay, okay, I’m here! 😄' :
      message.kind === 'file' ? 'Got your file! Thanks 📎' : replies[count.current++ % replies.length];
    timers.current.set(contact.id, window.setTimeout(async () => {
      try {
        await service.receive(contact.id, reply);
        if (service.getSnapshot().settings.sound) playSound();
      } catch (error) { reportError((error as Error).message); }
      setTyping(ids => ids.filter(id => id !== contact.id));
      timers.current.delete(contact.id);
    }, 1600));
  }
  return { typing, schedule };
}
