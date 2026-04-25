'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } }
);

export function LiveTopbar({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    // Subscribe to all changes and just refetch the count
    const refresh = async () => {
      const { count: c } = await supabase
        .from('readings')
        .select('*', { count: 'exact', head: true });
      if (typeof c === 'number') setCount(c);
    };

    const channel = supabase
      .channel('topbar-count')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'readings' }, refresh)
      .subscribe();

    // Poll fallback + initial refresh
    refresh();
    const interval = setInterval(refresh, 10_000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="topbar">
      <Link href="/" className="wordmark">
        AROYA<span className="dot">·</span>HIGH ROLLERS aW
      </Link>
      <div className="topbar-meta">
        <span className="pulse-dot" />
        <span>LIVE · {count} READING{count === 1 ? '' : 'S'}</span>
      </div>
    </header>
  );
}
