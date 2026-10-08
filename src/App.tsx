import { useEffect, useRef, useState } from 'react';
import { Heart, MessageCircle, X } from 'lucide-react';
import type { Attachment, Message } from './domain/models';
import { useMessenger } from './hooks/useMessenger';
import { useDemoReplies } from './hooks/useDemoReplies';
import { playSound } from './infrastructure/sound';
import { AppHeader } from './components/AppHeader';
import { Sidebar } from './components/Sidebar';
import { Conversation } from './components/Conversation';
import { ConversationTabs } from './components/ConversationTabs';
import { ProfileDialog } from './components/ProfileDialog';
import { AddContactDialog } from './components/AddContactDialog';
import { SettingsDialog } from './components/SettingsDialog';
import { GameDialog } from './components/GameDialog';
import { SignIn } from './components/SignIn';
type Dialog = 'profile' | 'add' | 'settings' | 'game' | null;
export default function App() {
  const { state, service } = useMessenger();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [activeId, setActiveId] = useState('jamie');
  const [openIds, setOpenIds] = useState(['jamie']);
  const [mobileChat, setMobileChat] = useState(false);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [error, setError] = useState('');
  const [nudging, setNudging] = useState(false);
  const nudgeTimer = useRef<number>(0);
  const { typing, schedule } = useDemoReplies(setError);
  const [readCounts, setReadCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(state.contacts.map(c => [c.id, state.messages.filter(m => m.contactId === c.id).length])));
  const contact = state.contacts.find(c => c.id === activeId);
  useEffect(() => () => window.clearTimeout(nudgeTimer.current), []);
  useEffect(() => {
    if (!state.signedIn) { setDialog(null); setMobileChat(false); }
  }, [state.signedIn]);
  const unread = Object.fromEntries(state.contacts.map(c => [c.id,
    c.id === activeId ? 0 : Math.max(0, state.messages.filter(m => m.contactId === c.id).length - (readCounts[c.id] ?? 0))]));
  function select(id: string) {
    setReadCounts(counts => ({ ...counts,
      [activeId]: state.messages.filter(m => m.contactId === activeId).length,
      [id]: state.messages.filter(m => m.contactId === id).length }));
    setActiveId(id); setOpenIds(ids => ids.includes(id) ? ids : [...ids, id]); setMobileChat(true);
  }
  function close(id: string) {
    const next = openIds.filter(value => value !== id && state.contacts.some(c => c.id === value));
    setOpenIds(next);
    if (activeId === id) { setActiveId(next.at(-1) ?? ''); if (!next.length) setMobileChat(false); }
  }
  async function send(text: string, kind: Message['kind'] = 'text', extras?: { bold?: boolean; attachment?: Attachment }) {
    try {
      const message = await service.send(activeId, text, kind, extras);
      if (state.settings.sound) playSound(kind === 'nudge' ? 'nudge' : 'message');
      if (kind === 'nudge') {
        setNudging(true); window.clearTimeout(nudgeTimer.current);
        nudgeTimer.current = window.setTimeout(() => setNudging(false), 500);
      }
      schedule(message); return true;
    } catch (failure) { setError((failure as Error).message); return false; }
  }
  if (!state.signedIn) return <SignIn />;
  return <div className={`app theme-${state.settings.theme}`}>
    <AppHeader onError={setError} />
    <main className={`messenger-window ${mobileChat && contact ? 'show-chat' : ''}`}>
      <Sidebar activeId={activeId} onSelect={select} onDialog={setDialog} unread={unread} onError={setError} />
      <div className="chat-workspace"><ConversationTabs activeId={activeId} onSelect={select} onClose={close}
        contacts={openIds.flatMap(id => { const match = state.contacts.find(c => c.id === id); return match ? [match] : []; })} />
        {contact ? <Conversation draft={drafts[contact.id] ?? ''} onDraftChange={draft => setDrafts(values => ({ ...values, [contact.id]: draft }))} contact={contact} typing={typing.includes(contact.id)} nudging={nudging}
          onBack={() => setMobileChat(false)} onGame={() => setDialog('game')} onSend={send} onError={setError} /> :
          <div className="empty-conversation"><MessageCircle size={56} /><h1>Someone’s day starts with your hello.</h1><p>Choose a friend to start a conversation.</p></div>}
      </div>
    </main>
    <footer className="app-footer"><span><i className="connection-dot" /> All systems nostalgic.</span>
      <span>Friends’ replies are simulated · Saved on this device</span><span>Back to the good old days <Heart size={12} /></span></footer>
    {dialog === 'profile' && <ProfileDialog onClose={() => setDialog(null)} />}
    {dialog === 'add' && <AddContactDialog onClose={() => setDialog(null)} />}
    {dialog === 'settings' && <SettingsDialog onClose={() => setDialog(null)} />}
    {dialog === 'game' && <GameDialog onClose={() => setDialog(null)} />}
    {error && <div className="error-toast" role="alert">{error}<button aria-label="Dismiss error" onClick={() => setError('')}><X size={16} /></button></div>}
  </div>;
}
