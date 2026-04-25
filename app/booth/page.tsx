import { supabasePublic, type Reading } from '@/lib/supabase';
import { LiveTopbar } from '@/components/LiveTopbar';
import { LiveReadings } from '@/components/LiveReadings';

export const dynamic = 'force-dynamic';

async function getReadings(): Promise<Reading[]> {
  const { data } = await supabasePublic
    .from('readings')
    .select('*')
    .order('created_at', { ascending: false });
  return (data ?? []) as Reading[];
}

// Minimal fullscreen display for the booth TV.
// No hero, no CTA, no footer — just topbar + legend + live grid.
export default async function BoothPage() {
  const readings = await getReadings();

  return (
    <>
      <LiveTopbar initialCount={readings.length} />

      <section className="container" style={{ padding: 'var(--s-5) var(--s-5) var(--s-3)' }}>
        <div className="eyebrow" style={{ marginBottom: 'var(--s-2)' }}>
          LIVE · AROYA AT HIGH ROLLERS 2026
        </div>
        <h1 className="hero-title" style={{
          fontSize: 'clamp(32px, 4vw, 56px)',
          marginBottom: 'var(--s-2)',
        }}>
          The science <em>behind</em> the smoke.
        </h1>
        <p style={{
          fontSize: 'var(--text-base)',
          color: 'var(--fg-muted)',
          margin: 0,
          maxWidth: 700,
        }}>
          0.55 – 0.65 = ideal cure. Below, over-dried and terp loss. Above, moisture risk.
        </p>
      </section>

      <div id="readings" />
      <LiveReadings initial={readings} />
    </>
  );
}
