import { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { useMessenger } from '../hooks/useMessenger';
import type { Theme } from '../domain/models';
import { Modal } from './Modal';
export function SettingsDialog({ onClose }: { onClose: () => void }) {
  const { state, service } = useMessenger();
  const [error, setError] = useState('');
  async function change(action: () => Promise<void>) { try { await action(); } catch (failure) { setError((failure as Error).message); } }
  return <Modal title="Your Messenger, your way" onClose={onClose}>
    <div className="settings-content"><h3>A splash of color</h3><p>Pick the color that feels like you.</p>
      <div className="theme-options">{(['sky', 'mint', 'rose'] as Theme[]).map(theme => <button key={theme}
        className={`theme-option theme-${theme}`} aria-pressed={state.settings.theme === theme}
        onClick={() => change(() => service.updateSettings({ theme }))}><span />{theme}</button>)}</div>
      <label className="sound-setting"><span><Volume2 size={20} /><span>Messenger sounds<small>That familiar little hello.</small></span></span>
        <input type="checkbox" checked={state.settings.sound} onChange={e => change(() => service.updateSettings({ sound: e.target.checked }))} /></label>
      {state.contacts.some(c => c.blocked) && <div className="blocked-list"><h3>Blocked contacts</h3>{state.contacts.filter(c => c.blocked).map(c =>
        <div key={c.id}><span>{c.name}</span><button className="text-button" onClick={() => change(() => service.updateContact(c.id, { blocked: false }))}>Unblock</button></div>)}</div>}
      <div className="local-info"><strong>A familiar place. A fresh start.</strong><p>This is a local, interactive demo. Chats and preferences stay in this browser. Friends’ replies are simulated. Real accounts, calls and live messaging need a backend.</p></div>
      {error && <p role="alert" className="form-error">{error}</p>}
    </div>
  </Modal>;
}
