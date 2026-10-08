import { useState } from 'react';
import { UserRoundPlus } from 'lucide-react';
import type { Contact } from '../domain/models';
import { useMessenger } from '../hooks/useMessenger';
import { Modal } from './Modal';
export function AddContactDialog({ onClose }: { onClose: () => void }) {
  const { service } = useMessenger();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [group, setGroup] = useState<Contact['group']>('Friends');
  const [error, setError] = useState('');
  return <Modal title="A new connection" onClose={onClose}><form className="dialog-form" onSubmit={async e => {
    e.preventDefault();
    try { await service.addContact(name, email, group); onClose(); }
    catch (failure) { setError((failure as Error).message); }
  }}><div className="dialog-intro"><UserRoundPlus size={30} /><p>Good conversations start with a hello.</p></div>
    <label>Display name<input required maxLength={40} value={name} onChange={e => setName(e.target.value)} placeholder="Your friend’s name" /></label>
    <label>Email address<input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="friend@hotmail.com" /></label>
    <label>Group<select value={group} onChange={e => setGroup(e.target.value as Contact['group'])}><option>Friends</option><option>Family</option></select></label>
    <p className="field-hint">Adds a local contact. No invitation email is sent.</p>
    {error && <p role="alert" className="form-error">{error}</p>}
    <button className="primary-button">Add contact</button>
  </form></Modal>;
}
