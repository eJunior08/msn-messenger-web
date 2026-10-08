export function BuddyLogo({ small = false }: { small?: boolean }) {
  return <span className={`buddy-logo ${small ? 'small' : ''}`} aria-hidden="true">
    <i className="buddy blue" /><i className="buddy green" />
  </span>;
}
export function Brand() {
  return <span className="brand"><BuddyLogo /><span>messenger<span className="brand-dot">.</span></span></span>;
}
