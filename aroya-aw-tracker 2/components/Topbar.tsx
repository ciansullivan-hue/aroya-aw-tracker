import Link from 'next/link';

interface TopbarProps {
  meta?: React.ReactNode;
  live?: boolean;
  count?: number;
}

export function Topbar({ meta, live = false, count }: TopbarProps) {
  return (
    <header className="topbar">
      <Link href="/" className="wordmark">
        AROYA<span className="dot">·</span>HIGH ROLLERS aW
      </Link>
      <div className="topbar-meta">
        {live && <span className="pulse-dot" />}
        {meta ?? (
          live && count !== undefined
            ? <span>LIVE · {count} READING{count === 1 ? '' : 'S'}</span>
            : null
        )}
      </div>
    </header>
  );
}
