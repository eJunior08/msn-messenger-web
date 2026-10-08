import { LogOut, Music2, Pencil, Settings } from 'lucide-react';
import { useMessenger } from '../hooks/useMessenger';
import type { Presence } from '../domain/models';
import { presenceLabels } from '../domain/models';
import { Avatar } from './Avatar';
import { ContactList } from './ContactList';
interface Props {
  activeId: string; onSelect: (id: string) => void; onDialog: (name: 'profile' | 'settings' | 'add') => void;
  unread: Record<string, number>; onError: (message: string) => void;
}
export function Sidebar(props: Props) {
  const { state, service } = useMessenger();
  const { profile } = state;
  async function presence(value: Presence) {
    try { await service.updateProfile({ presence: value }); } catch (error) { props.onError((error as Error).message); }
  }
  return <aside className="sidebar" aria-label="Contacts">
    <div className="self-profile"><button className="avatar-button" aria-label="Edit profile" onClick={() => props.onDialog('profile')}>
      <Avatar symbol={profile.avatar} presence={profile.presence} size="large" /></button>
      <div className="self-copy"><button onClick={() => props.onDialog('profile')} className="profile-name">
        {profile.name}<Pencil size={12} /></button>
        <label className="status-select"><i className={`presence-dot ${profile.presence}`} />
          <select aria-label="Your status" value={profile.presence} onChange={e => presence(e.target.value as Presence)}>
            {Object.entries(presenceLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select></label>
      </div>
    </div>
    <button className="personal-message" onClick={() => props.onDialog('profile')}>{profile.message}<Pencil size={11} /></button>
    <div className="now-playing"><Music2 size={14} /><span>Somewhere Only We Know</span><span className="track-artist"> · Keane</span>
      <span className="equalizer" aria-hidden="true"><i /><i /><i /></span></div>
    <ContactList {...props} contacts={state.contacts} onAdd={() => props.onDialog('add')} />
    <footer className="sidebar-footer"><button onClick={() => props.onDialog('settings')}><Settings size={15} /> Preferences</button>
      <button aria-label="Sign out" title="Sign out" onClick={async () => {
        try { await service.signOut(); } catch (error) { props.onError((error as Error).message); }
      }}><LogOut size={16} /></button></footer>
  </aside>;
}
