import { useState } from 'react';
import { useMessenger } from '../hooks/useMessenger';
import { Avatar } from './Avatar';
import { Modal } from './Modal';
const avatars = ['🏖️', '🌻', '🐱', '🦋', '🎧', '🛹', '🌷', '🐶', '🚀', '🍊'];
export function ProfileDialog({ onClose }: { onClose: () => void }) {
  const { state, service } = useMessenger();
  const [name, setName] = useState(state.profile.name);
  const [message, setMessage] = useState(state.profile.message);
  const [avatar, setAvatar] = useState(state.profile.avatar);
  const [error, setError] = useState('');
  return <Modal title="Make it yours" onClose={onClose}>
    <form className="dialog-form" onSubmit={async e => {
      e.preventDefault();
      try { await service.updateProfile({ name: name.trim(), message, avatar }); onClose(); }
      catch (failure) { setError((failure as Error).message); }
    }}><div className="profile-preview"><Avatar symbol={avatar} size="large" /><div><strong>Your display picture</strong><p>A little bit of you, in a little square.</p></div></div>
      <div className="avatar-options">{avatars.map(symbol => <button type="button" key={symbol} aria-label={`Use ${symbol} avatar`}
        aria-pressed={avatar === symbol} onClick={() => setAvatar(symbol)}>{symbol}</button>)}</div>
      <label>Display name<input value={name} onChange={e => setName(e.target.value)} maxLength={40} required /></label>
      <label>Personal message<input value={message} onChange={e => setMessage(e.target.value)} maxLength={120} /></label>
      {error && <p role="alert" className="form-error">{error}</p>}
      <button className="primary-button" disabled={!name.trim()}>Save changes</button>
    </form>
  </Modal>;
}
