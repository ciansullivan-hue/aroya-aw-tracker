'use client';

import { useEffect, useState, useRef } from 'react';
import type { Reading } from '@/lib/supabase';
import { ReadingCard } from './ReadingCard';
import { createClient } from '@supabase/supabase-js';

type Filter = 'All' | 'High Rollers' | 'Open Strain' | 'Other';

// Create a browser-side client. Safe: uses anon key, public data.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } }
);

interface Props {
  initial: Reading[];
  onCountChange?: (n: number) => void;
}

export function LiveReadings({ initial, onCountChange }: Props) {
  const [readings, setReadings] = useState<Reading[]>(initial);
  const [filter, setFilter] = useState<Filter>('All');
  const [freshIds, setFreshIds] = useState<Set<string>>(new Set());
  const lastSeenTs = useRef<string>(
    initial.length > 0 ? initial[0].created_at : new Date(0).toISOString()
  );

  // Notify parent (topbar) when count changes
  useEffect(() => {
    onCountChange?.(readings.length);
  }, [readings.length, onCountChange]);

  // Merge a reading into state (insert new, update existing, remove deleted)
  function mergeReading(row: Reading, action: 'INSERT' | 'UPDATE' | 'DELETE') {
    setReadings(prev => {
      if (action === 'DELETE') {
        return prev.filter(r => r.id !== row.id);
      }
      const without = prev.filter(r => r.id !== row.id);
      const next = [row, ...without].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      return next;
    });

    if (action === 'INSERT') {
      // Flash the card for 3 seconds
      setFreshIds(prev => new Set(prev).add(row.id));
      setTimeout(() => {
        setFreshIds(prev => {
          const next = new Set(prev);
          next.delete(row.id);
          return next;
        });
      }, 3000);
    }

    if (row.created_at > lastSeenTs.current) {
      lastSeenTs.current = row.created_at;
    }
  }

  // -------- Supabase Realtime subscription --------
  useEffect(() => {
    const channel = supabase
      .channel('readings-live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'readings' },
        (payload) => mergeReading(payload.new as Reading, 'INSERT')
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'readings' },
        (payload) => mergeReading(payload.new as Reading, 'UPDATE')
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'readings' },
        (payload) => mergeReading(payload.old as Reading, 'DELETE')
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // -------- Polling fallback (every 10s) --------
  // Runs regardless of realtime. If realtime already delivered the row,
  // mergeReading dedupes by id, so no double-inserts.
  useEffect(() => {
    const tick = async () => {
      const { data, error } = await supabase
        .from('readings')
        .select('*')
        .order('created_at', { ascending: false });
      if (error || !data) return;
      const rows = data as Reading[];
      setReadings(rows); // authoritative snapshot — also catches deletes
    };

    const interval = setInterval(tick, 10_000);
    // Also refresh on tab visibility change (booth display that sleeps briefly)
    const onVis = () => { if (document.visibilityState === 'visible') tick(); };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  const counts = {
    All: readings.length,
    'High Rollers': readings.filter(r => r.bracket === 'High Rollers').length,
    'Open Strain': readings.filter(r => r.bracket === 'Open Strain').length,
    Other: readings.filter(r => r.bracket === 'Other').length,
  };

  const visible = filter === 'All'
    ? readings
    : readings.filter(r => r.bracket === filter);

  const filters: Filter[] = ['All', 'High Rollers', 'Open Strain', 'Other'];

  return (
    <>
      <div className="container" style={{
        padding: '0 var(--s-5) var(--s-5)',
        display: 'flex',
        gap: 'var(--s-2)',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <span className="eyebrow" style={{ marginRight: 'var(--s-3)' }}>FILTER</span>
        {filters.map(f => (
          <button
            key={f}
            className={`pill ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
            type="button"
          >
            {f} <span className="count num">{counts[f]}</span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="container" style={{ padding: 'var(--s-7) var(--s-5)' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div className="eyebrow" style={{ marginBottom: 'var(--s-3)' }}>
              AWAITING READINGS
            </div>
            <p style={{ color: 'var(--fg-muted)', margin: 0 }}>
              Readings will appear here the moment the Aroya tech logs them.
            </p>
          </div>
        </div>
      ) : (
        <div className="container" style={{
          padding: '0 var(--s-5) var(--s-8)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--s-4)',
        }}>
          {visible.map(r => (
            <div
              key={r.id}
              className={freshIds.has(r.id) ? 'reading-fresh' : undefined}
              style={{
                animation: freshIds.has(r.id) ? 'fresh-pulse 3s ease-out' : undefined,
              }}
            >
              <ReadingCard reading={r} />
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes fresh-pulse {
          0% {
            transform: scale(0.96);
            box-shadow: 0 0 0 0 rgba(203, 238, 176, 0);
            opacity: 0.5;
          }
          10% {
            transform: scale(1.02);
            box-shadow: 0 0 0 6px rgba(203, 238, 176, 0.5);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(203, 238, 176, 0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
