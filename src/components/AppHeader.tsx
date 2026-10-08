import { Heart, Volume2, VolumeX } from 'lucide-react';
import { Brand } from './Brand';
import { useMessenger } from '../hooks/useMessenger';
export function AppHeader({ onError }: { onError: (message: string) => void }) {
  const { state, service } = useMessenger();
  return <header className="app-header"><Brand /><span className="header-tagline">A little nostalgia. A lot of connection.</span>
    <div className="header-right"><span className="demo-badge"><i /> LOCAL DEMO</span>
      <button className="icon-button" aria-label={state.settings.sound ? 'Mute sounds' : 'Enable sounds'} onClick={async () => {
        try { await service.updateSettings({ sound: !state.settings.sound }); } catch (error) { onError((error as Error).message); }
      }}>{state.settings.sound ? <Volume2 size={18} /> : <VolumeX size={18} />}</button>
      <span className="header-heart"><Heart size={16} /></span></div>
  </header>;
}
