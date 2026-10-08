import { useRef, useState } from 'react';
import { Bold, ChevronDown, Hand, Paperclip, Send, Smile, Sparkles } from 'lucide-react';
import type { Attachment, Message } from '../domain/models';
import { readAttachment } from '../infrastructure/attachments';
const emojis = ['😊', '😂', '❤️', '😎', '😭', '😍', '🙃', '👍', '🎵', '✨', '☕', '🌈'];
interface Props {
  contactId: string; disabled: boolean; initialDraft?: string; onDraftChange?: (draft: string) => void;
  onSend: (text: string, kind?: Message['kind'], extras?: { bold?: boolean; attachment?: Attachment }) => Promise<boolean>;
  onError: (message: string) => void;
}
export function Composer({ disabled, onSend, onError, initialDraft = '', onDraftChange }: Props) {
  const [draft, setDraftValue] = useState(initialDraft);
  const [sending, setSending] = useState(false);
  const pending = useRef(false);
  function setDraft(value: string) { setDraftValue(value); onDraftChange?.(value); }
  const [bold, setBold] = useState(false);
  const [picker, setPicker] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  async function send() {
    if (!draft.trim() || pending.current) return;
    pending.current = true; setSending(true);
    try { if (await onSend(draft, 'text', { bold })) setDraft(''); }
    finally { pending.current = false; setSending(false); }
  }
  async function attach(selected?: File) {
    if (!selected) return;
    try { const attachment = await readAttachment(selected); await onSend(`Shared ${selected.name}`, 'file', { attachment }); }
    catch (error) { onError((error as Error).message); }
    if (file.current) file.current.value = '';
  }
  return <div className="composer-area">
    <div className="composer"><div className="composer-toolbar">
      <button className={bold ? 'active' : ''} aria-label="Bold text" aria-pressed={bold} onClick={() => setBold(!bold)} disabled={disabled || sending}><Bold size={17} /></button>
      <span className="toolbar-divider" />
      <div className="emoji-control"><button aria-label="Choose an emoticon" aria-expanded={picker} onClick={() => setPicker(!picker)} disabled={disabled || sending}>
        <Smile size={19} className="emoji-icon" /><ChevronDown size={10} /></button>
        {picker && <div className="emoji-picker" aria-label="Emoticons">{emojis.map(emoji => <button key={emoji} aria-label={`Insert ${emoji}`}
          onClick={() => { setDraft(`${draft}${emoji}`); setPicker(false); input.current?.focus(); }}>{emoji}</button>)}</div>}
      </div>
      <button aria-label="Send a wink" title="Send a wink" onClick={() => onSend('😉', 'wink')} disabled={disabled || sending}><Sparkles size={18} className="wink-icon" /></button>
      <button aria-label="Attach a file" title="Attach a file (up to 2 MB)" onClick={() => file.current?.click()} disabled={disabled || sending}><Paperclip size={18} /></button>
      <span className="toolbar-divider" />
      <button className="nudge-button" aria-label="Send a nudge" onClick={() => onSend('You sent a nudge!', 'nudge')} disabled={disabled || sending}><Hand size={17} /> Nudge</button>
      <span className="composer-font">{bold ? 'Segoe UI · Bold' : 'Segoe UI'}</span>
    </div>
      <textarea ref={input} aria-label="Message" placeholder={disabled ? 'Unblock this contact to send a message.' : 'Type a message…'}
        value={draft} maxLength={2000} disabled={disabled || sending} className={bold ? 'bold-message' : ''}
        onChange={e => setDraft(e.target.value)} onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(); }
        }} />
      <div className="composer-bottom"><span>{draft.length ? `${draft.length}/2000` : 'A conversation can make your day.'}</span>
        <button className="send-button" onClick={send} disabled={disabled || sending || !draft.trim()}>Send <Send size={14} /></button></div>
    </div>
    <div className="composer-hint"><span><kbd>Enter</kbd> to send · <kbd>Shift + Enter</kbd> for a new line</span><span>Made for catching up <span className="tiny-heart">♡</span></span></div>
    <input className="visually-hidden" ref={file} type="file" aria-label="Choose file" tabIndex={-1} onChange={e => void attach(e.target.files?.[0])} />
  </div>;
}
