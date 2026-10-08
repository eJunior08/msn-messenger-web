import { useEffect, useRef } from 'react';
import { Download, Hand, LockKeyhole } from 'lucide-react';
import type { Contact, Message, Profile } from '../domain/models';
import { Avatar } from './Avatar';
export function MessageList({ messages, contact, profile, typing }: {
  messages: Message[]; contact: Contact; profile: Profile; typing: boolean;
}) {
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, [messages.length, typing]);
  return <div className="messages" role="log" aria-label="Conversation messages" aria-live="polite">
    <div className="conversation-start"><span>THE START OF SOMETHING GOOD</span>
      <p>You and {contact.name.split(' ')[0]}. Just like old times.</p></div>
    <div className="safety-note"><LockKeyhole size={12} /> Never share passwords or personal information in a conversation.</div>
    {messages.map((message, index) => {
      const self = message.author === 'self';
      const author = self ? profile : contact;
      if (message.kind === 'nudge') return <div className="nudge-message" key={message.id}>
        <Hand size={15} /> {self ? 'You' : author.name} sent a nudge! <span>A little hello, impossible to miss.</span></div>;
      const sameAuthor = index > 0 && messages[index - 1].author === message.author && messages[index - 1].kind !== 'nudge';
      return <div key={message.id} className={`message-row ${self ? 'outgoing' : ''} ${sameAuthor ? 'continued' : ''}`}>
        <span className={sameAuthor ? 'hidden-avatar' : ''}><Avatar symbol={author.avatar} size="small" /></span>
        <div className="message-content">{!sameAuthor && <div className="message-meta"><strong>{self ? 'You' : author.name}</strong>
          <time dateTime={message.createdAt}>{new Date(message.createdAt).toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' })}</time></div>}
          <div className={`message-bubble ${message.kind === 'wink' ? 'wink-message' : ''} ${message.bold ? 'bold-message' : ''}`}>
            {message.attachment ? <a href={message.attachment.dataUrl} download={message.attachment.name} className="attachment-link">
              <Download size={20} /><span>{message.attachment.name}<small>{Math.max(1, Math.round(message.attachment.size / 1024))} KB · Download file</small></span></a> : message.text}
          </div></div>
      </div>;
    })}
    {typing && <div className="typing-indicator"><span>● ● ●</span> {contact.name.split(' ')[0]} is typing…</div>}
    <div ref={end} />
  </div>;
}
