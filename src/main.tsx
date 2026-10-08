import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { MessengerService } from './application/MessengerService';
import { LocalMessengerRepository } from './infrastructure/LocalMessengerRepository';
import { MessengerContext } from './hooks/useMessenger';
import './styles/base.css';
import './styles/shell.css';
import './styles/sidebar.css';
import './styles/conversation.css';
import './styles/composer.css';
import './styles/dialogs.css';
import './styles/responsive.css';
const storage = {
  getItem: (key: string) => window.localStorage.getItem(key),
  setItem: (key: string, value: string) => window.localStorage.setItem(key, value),
};
const root = createRoot(document.getElementById('root')!);
root.render(<p role="status">Connecting to Messenger…</p>);
MessengerService.create(new LocalMessengerRepository(storage)).then(service => {
  root.render(<StrictMode><MessengerContext.Provider value={service}><App /></MessengerContext.Provider></StrictMode>);
}).catch(() => { root.render(<p role="alert">Messenger could not start. Please refresh to try again.</p>); });
