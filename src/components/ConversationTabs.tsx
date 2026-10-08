import { MessageCircle, X } from 'lucide-react';
import type { Contact } from '../domain/models';
export function ConversationTabs({ contacts, activeId, onSelect, onClose }: {
  contacts: Contact[]; activeId: string; onSelect: (id: string) => void; onClose: (id: string) => void;
}) {
  return <div className="conversation-tabs" aria-label="Open conversations">{contacts.map(contact => <div key={contact.id}
    className={`conversation-tab ${contact.id === activeId ? 'active' : ''}`}>
    <button onClick={() => onSelect(contact.id)} aria-pressed={contact.id === activeId}><MessageCircle size={14} />{contact.name.split(' ')[0]}</button>
    <button aria-label={`Close chat with ${contact.name}`} onClick={() => onClose(contact.id)}><X size={12} /></button>
  </div>)}<span className="tabs-note">Stay a little longer.</span></div>;
}
