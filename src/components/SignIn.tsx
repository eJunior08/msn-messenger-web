import { useState } from 'react';
import { ArrowRight, Heart } from 'lucide-react';
import { useMessenger } from '../hooks/useMessenger';
import { Brand, BuddyLogo } from './Brand';
export function SignIn() {
  const { state, service } = useMessenger();
  const [name, setName] = useState(state.profile.name);
  const [email, setEmail] = useState(state.profile.email);
  const [error, setError] = useState('');
  return <main className="signin-page"><div className="signin-card"><Brand /><div className="signin-art"><BuddyLogo /></div>
    <span className="eyebrow">SOME THINGS JUST FEEL LIKE HOME.</span><h1>Good to see you again.</h1><p>Your people. Your conversations. Your Messenger.</p>
    <form className="dialog-form" onSubmit={async e => { e.preventDefault();
      try { await service.signIn(name, email); } catch (failure) { setError((failure as Error).message); }
    }}><label>Display name<input required maxLength={40} value={name} onChange={e => setName(e.target.value)} /></label>
      <label>Email address<input type="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
      {error && <p role="alert" className="form-error">{error}</p>}
      <button className="primary-button">Sign in to the demo <ArrowRight size={16} /></button></form>
    <div className="signin-note">No password needed. This demo stays in your browser.</div>
    <footer><Heart size={13} /> A little nostalgia. A lot of connection.</footer>
  </div></main>;
}
