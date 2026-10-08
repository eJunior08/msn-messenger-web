import { ArrowLeft, Ban, Gamepad2, MoreHorizontal, ShieldCheck, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Contact, Message } from '../domain/models';
import { useMessenger } from '../hooks/useMessenger';
import { Avatar } from './Avatar';
import { Composer } from './Composer';
import { MessageList } from './MessageList';
interface Props {
  draft: string; onDraftChange: (draft: string) => void; contact: Contact; typing: boolean; nudging: boolean; onBack: () => void;
  onGame: () => void; onSend: Parameters<typeof Composer>[0]['onSend']; onError: (message: string) => void;
}
export function Conversation(props: Props) {
  const { state, service } = useMessenger();
  const [menu, setMenu] = useState(false);
  const { contact } = props;
  const messages: Message[] = state.messages.filter(message => message.contactId === contact.id);
  async function update(changes: { favorite?: boolean; blocked?: boolean }) {
    try { await service.updateContact(contact.id, changes); setMenu(false); }
    catch (error) { props.onError((error as Error).message); }
  }
  return <section className={`conversation ${props.nudging ? 'nudging' : ''}`} aria-label={`Conversation with ${contact.name}`}>
    <header className="conversation-header"><button className="icon-button mobile-back" aria-label="Back to contacts" onClick={props.onBack}><ArrowLeft size={21} /></button>
      <Avatar symbol={contact.avatar} presence={contact.presence} />
      <div className="conversation-person"><h1>{contact.name} <span className={`status-pill ${contact.presence}`}>{contact.presence === 'online' ? 'Online' : contact.presence}</span></h1>
        <p>{contact.message}</p></div>
      <button className={`icon-button favorite-button ${contact.favorite ? 'is-favorite' : ''}`} aria-label={contact.favorite ? 'Remove from favorites' : 'Add to favorites'}
        onClick={() => update({ favorite: !contact.favorite })}><Star size={19} fill={contact.favorite ? 'currentColor' : 'none'} /></button>
      <div className="contact-menu-wrap"><button className="icon-button" aria-label="Contact options" aria-expanded={menu} onClick={() => setMenu(!menu)}><MoreHorizontal size={22} /></button>
        {menu && <div className="contact-menu"><button onClick={() => update({ blocked: !contact.blocked })}><Ban size={15} />{contact.blocked ? 'Unblock contact' : 'Block contact'}</button>
          <button onClick={async () => { if (window.confirm(`Remove ${contact.name} and this conversation?`)) {
            try { await service.removeContact(contact.id); } catch (error) { props.onError((error as Error).message); }
          } }}><Trash2 size={15} />Remove contact</button></div>}
      </div>
    </header>
    <div className="conversation-strip"><span><ShieldCheck size={14} />{contact.blocked ? 'This contact is blocked.' : contact.presence === 'offline' ? 'Offline · Messages are saved in this local demo.' : 'You’re connected. Say something good.'}</span>
      <button onClick={props.onGame}><Gamepad2 size={16} /> Play a game</button></div>
    <MessageList messages={messages} contact={contact} profile={state.profile} typing={props.typing} />
    <Composer key={contact.id} initialDraft={props.draft} onDraftChange={props.onDraftChange} contactId={contact.id} disabled={contact.blocked} onSend={props.onSend} onError={props.onError} />
  </section>;
}
