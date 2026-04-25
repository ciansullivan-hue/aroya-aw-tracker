import { awZone, awZoneLabel, type Reading } from '@/lib/supabase';

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Los_Angeles',
  }) + ' PT';
}

function shortId(id: string): string {
  return id.slice(0, 8).toUpperCase();
}

export function ReadingCard({ reading }: { reading: Reading }) {
  const zone = awZone(reading.aw);
  const bracketClass = reading.bracket === 'High Rollers'
    ? 'high-rollers'
    : reading.bracket === 'Open Strain'
      ? 'open-strain'
      : '';

  return (
    <article style={{
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: 'var(--s-5)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--s-3)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 'var(--s-3)',
      }}>
        <div>
          <div style={{
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--fw-medium)',
            color: 'var(--fg)',
            lineHeight: 1.3,
          }}>
            {reading.contestant}
          </div>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 'var(--text-sm)',
            color: 'var(--fg-muted)',
            marginTop: 2,
          }}>
            {reading.strain}
          </div>
        </div>
        <span className={`bracket-tag ${bracketClass}`}>
          {reading.bracket}
        </span>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 'var(--s-3)',
        padding: 'var(--s-3) 0',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        flexWrap: 'wrap',
      }}>
        <div>
          <div className="eyebrow">Water Activity</div>
          <div className="num" style={{
            fontSize: 'var(--text-display)',
            fontWeight: 'var(--fw-medium)',
            lineHeight: 1,
            color: 'var(--fg)',
          }}>
            {reading.aw.toFixed(3)}
          </div>
        </div>
        <span className={`aw-zone ${zone}`}>
          <span className="dot" />
          {awZoneLabel(zone)}
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--s-3)',
      }}>
        {reading.temp_f !== null && (
          <div>
            <div className="eyebrow" style={{ fontSize: 10 }}>TEMP</div>
            <div className="num" style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--fg)',
              fontWeight: 'var(--fw-medium)',
              marginTop: 2,
            }}>
              {reading.temp_f}°F
            </div>
          </div>
        )}
        {reading.cure_days !== null && (
          <div>
            <div className="eyebrow" style={{ fontSize: 10 }}>CURE DAYS</div>
            <div className="num" style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--fg)',
              fontWeight: 'var(--fw-medium)',
              marginTop: 2,
            }}>
              {reading.cure_days}
            </div>
          </div>
        )}
        {reading.cultivator && (
          <div style={{ gridColumn: '1 / -1' }}>
            <div className="eyebrow" style={{ fontSize: 10 }}>CULTIVATOR</div>
            <div style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--fg)',
              fontWeight: 'var(--fw-regular)',
              marginTop: 2,
            }}>
              {reading.cultivator}
            </div>
          </div>
        )}
      </div>

      {reading.notes && (
        <div style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--fg-muted)',
          fontStyle: 'italic',
          paddingTop: 'var(--s-2)',
          borderTop: '1px dashed var(--border)',
        }}>
          {reading.notes}
        </div>
      )}

      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        color: 'var(--fg-faint)',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <span>{shortId(reading.id)}</span>
        <span>{formatTime(reading.created_at)}</span>
      </div>
    </article>
  );
}
