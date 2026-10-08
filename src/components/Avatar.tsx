import type { Presence } from '../domain/models';
export function Avatar({ symbol, presence, size = 'normal' }: {
  symbol: string; presence?: Presence; size?: 'small' | 'normal' | 'large';
}) {
  return <span className={`avatar avatar-${size} avatar-${symbol.codePointAt(0)! % 5}`}>
    <span aria-hidden="true">{symbol}</span>
    {presence && <i className={`presence-dot ${presence}`} aria-label={presence} />}
  </span>;
}
