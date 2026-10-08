import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    dialog?.showModal();
    return () => { dialog?.close(); previous?.focus(); };
  }, []);
  return <dialog ref={ref} className="modal" aria-label={title} onCancel={onClose}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <header className="modal-heading"><h2>{title}</h2>
      <button className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={19} /></button>
    </header><div className="modal-body">{children}</div>
  </dialog>;
}
