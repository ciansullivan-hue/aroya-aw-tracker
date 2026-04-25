import { supabaseAdmin, awZone, awZoneLabel, type Reading } from '@/lib/supabase';
import { Topbar } from '@/components/Topbar';
import { addReading, deleteReading } from './actions';
import { logout } from './login/actions';

export const dynamic = 'force-dynamic';

async function getRecentReadings(): Promise<Reading[]> {
  const sb = supabaseAdmin();
  const { data } = await sb
    .from('readings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);
  return (data ?? []) as Reading[];
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { ok?: string; error?: string };
}) {
  const recent = await getRecentReadings();
  const success = searchParams.ok === '1';
  const error = searchParams.error;

  return (
    <>
      <Topbar meta={<>
        <form action={logout}>
          <button type="submit" style={{
            background: 'transparent',
            border: 0,
            color: 'var(--fg-faint)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            cursor: 'pointer',
          }}>
            LOG OUT
          </button>
        </form>
      </>} />

      <section className="container-narrow" style={{ padding: 'var(--s-6) var(--s-5) var(--s-8)' }}>
        <div className="eyebrow" style={{ marginBottom: 'var(--s-3)' }}>NEW READING</div>
        <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--s-5)' }}>
          Log an aW measurement
        </h1>

        {success && <div className="banner success">Reading saved. It&apos;s live on the public page.</div>}
        {error === 'missing' && <div className="banner error">Contestant, strain, and aW are required.</div>}
        {error === 'aw' && <div className="banner error">aW must be a number between 0 and 1.</div>}
        {error === 'server' && <div className="banner error">Couldn&apos;t save. Check console / Supabase.</div>}

        <form action={addReading} encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-5)' }}>
          <div className="field required">
            <label htmlFor="contestant">Contestant</label>
            <input id="contestant" name="contestant" type="text" required />
          </div>

          <div className="field required">
            <label htmlFor="strain">Strain</label>
            <input id="strain" name="strain" type="text" required />
          </div>

          <div className="field required">
            <label htmlFor="bracket">Bracket</label>
            <select id="bracket" name="bracket" required defaultValue="High Rollers">
              <option>High Rollers</option>
              <option>Open Strain</option>
              <option>Other</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-4)' }}>
            <div className="field required">
              <label htmlFor="aw">aW</label>
              <input id="aw" name="aw" type="number" step="0.001" min="0" max="1" required className="num" inputMode="decimal" placeholder="0.612" />
              <span className="hint">0.55 – 0.65 = IDEAL CURE</span>
            </div>
            <div className="field">
              <label htmlFor="temp_f">Temp (°F)</label>
              <input id="temp_f" name="temp_f" type="number" step="0.1" className="num" inputMode="decimal" placeholder="68.2" />
            </div>
          </div>

          <div className="field">
            <label htmlFor="cultivator">Cultivator</label>
            <input id="cultivator" name="cultivator" type="text" />
          </div>

          <div className="field">
            <label htmlFor="cure_days">Cure days</label>
            <input id="cure_days" name="cure_days" type="number" min="0" className="num" inputMode="numeric" placeholder="21" />
          </div>

          <div className="field">
            <label htmlFor="notes">Notes</label>
            <textarea id="notes" name="notes" rows={3} />
          </div>

          <div className="field">
            <label htmlFor="photo">Photo (optional)</label>
            <input id="photo" name="photo" type="file" accept="image/*" capture="environment" />
            <span className="hint">SNAP A PHOTO OF THE SAMPLE</span>
          </div>

          <button type="submit" className="btn primary" style={{
            position: 'sticky',
            bottom: 'var(--s-4)',
            alignSelf: 'stretch',
          }}>
            Save reading →
          </button>
        </form>
      </section>

      {/* Recent readings list */}
      <section className="container-narrow" style={{ padding: '0 var(--s-5) var(--s-8)' }}>
        <div className="eyebrow" style={{ marginBottom: 'var(--s-4)' }}>
          LAST 10 READINGS
        </div>
        {recent.length === 0 ? (
          <p style={{ color: 'var(--fg-muted)', fontStyle: 'italic' }}>
            No readings yet. Log the first one above.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
            {recent.map(r => {
              const zone = awZone(r.aw);
              return (
                <div key={r.id} className="card" style={{
                  padding: 'var(--s-3) var(--s-4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'var(--s-3)',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--fw-medium)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {r.contestant} <span style={{
                        fontFamily: 'var(--font-serif)',
                        fontStyle: 'italic',
                        color: 'var(--fg-muted)',
                      }}>· {r.strain}</span>
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--fg-subtle)',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      marginTop: 2,
                    }}>
                      {r.bracket} · {new Date(r.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)' }}>
                    <div className="num" style={{
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--fw-medium)',
                    }}>
                      {r.aw.toFixed(3)}
                    </div>
                    <span className={`aw-zone ${zone}`}>
                      <span className="dot" />
                      {awZoneLabel(zone)}
                    </span>
                    <form action={deleteReading}>
                      <input type="hidden" name="id" value={r.id} />
                      <button type="submit" aria-label="Delete reading" style={{
                        background: 'transparent',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '6px 10px',
                        color: 'var(--fg-subtle)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'var(--text-xs)',
                        cursor: 'pointer',
                      }}>
                        ✕
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
