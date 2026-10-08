import { useState } from 'react';
import { ChevronDown, ChevronRight, Search, Star, UserRoundPlus, Users } from 'lucide-react';
import type { Contact } from '../domain/models';
import { filterContacts } from '../domain/rules';
import { Avatar } from './Avatar';
interface Props {
  contacts: Contact[]; activeId: string; onSelect: (id: string) => void; onAdd: () => void;
  unread: Record<string, number>;
}
function ContactGroup({ title, contacts, ...props }: Props & { title: string }) {
  const [collapsed, setCollapsed] = useState(false);
  if (!contacts.length) return null;
  return <section className="contact-group">
    <button className="group-heading" onClick={() => setCollapsed(!collapsed)} aria-expanded={!collapsed}>
      {collapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
      {title === 'Favorites' && <Star size={12} className="gold" fill="currentColor" />}
      {title}<span>{contacts.length}</span>
    </button>
    {!collapsed && contacts.map(contact => <button key={contact.id}
      className={`contact-row ${props.activeId === contact.id ? 'selected' : ''}`}
      aria-label={`Chat with ${contact.name}`} aria-pressed={props.activeId === contact.id}
      onClick={() => props.onSelect(contact.id)}>
      <Avatar symbol={contact.avatar} presence={contact.presence} size="small" />
      <span className="contact-copy"><strong>{contact.name}</strong><span>{contact.message}</span></span>
      {props.unread[contact.id] > 0 && <span className="unread">{props.unread[contact.id]}</span>}
    </button>)}
  </section>;
}
export function ContactList(props: Props) {
  const [query, setQuery] = useState('');
  const contacts = filterContacts(props.contacts, query);
  const favorites = contacts.filter(c => c.favorite);
  const online = contacts.filter(c => !c.favorite && c.presence !== 'offline');
  const offline = contacts.filter(c => !c.favorite && c.presence === 'offline');
  return <>
    <div className="contacts-tools"><label className="search-box"><Search size={16} />
      <input aria-label="Find a contact" placeholder="Find a contact…" value={query}
        onChange={event => setQuery(event.target.value)} /><kbd>⌕</kbd>
    </label><button className="icon-button add-contact" title="Add a contact" aria-label="Add a contact"
      onClick={props.onAdd}><UserRoundPlus size={19} /></button></div>
    <div className="contacts-label"><span>CONTACTS</span><span>{props.contacts.filter(c => c.presence !== 'offline' && !c.blocked).length} online</span></div>
    <div className="contact-scroll">
      <ContactGroup {...props} title="Favorites" contacts={favorites} />
      <ContactGroup {...props} title="Online" contacts={online} />
      <ContactGroup {...props} title="Offline" contacts={offline} />
      {!contacts.length && <div className="empty-contacts"><Users size={28} /><p>No contacts found.</p>
        <button className="text-button" onClick={props.onAdd}>Add someone new</button></div>}
    </div>
    <div className="sidebar-memory"><span>✦</span><div><strong>Good times. Great conversations.</strong>
      <p>A little piece of the internet we missed.</p></div></div>
  </>;
}
