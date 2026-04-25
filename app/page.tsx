import Link from 'next/link';
import { supabasePublic, type Reading } from '@/lib/supabase';
import { LiveTopbar } from '@/components/LiveTopbar';
import { AwLegend } from '@/components/AwLegend';
import { LiveReadings } from '@/components/LiveReadings';
import { Footer } from '@/components/Footer';

// Server-render once per request. Client then subscribes + polls.
// Dynamic = no stale caching on QR scans; first paint is always current.
export const dynamic = 'force-dynamic';

async function getReadings(): Promise<Reading[]> {
  const { data, error } = await supabasePublic
    .from('readings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch readings:', error);
    return [];
  }
  return (data ?? []) as Reading[];
}

export default async function HomePage() {
  const readings = await getReadings();

  return (
    <>
      <LiveTopbar initialCount={readings.length} />

      <section className="container" style={{ padding: 'var(--s-8) var(--s-5) var(--s-7)' }}>
        <div className="eyebrow" style={{ marginBottom: 'var(--s-4)' }}>
          THC MEMBERS ONLY CLUB · APR 25, 2026 · PROPER SMOKE NETWORK
        </div>
        <h1 className="hero-title" style={{ marginBottom: 'var(--s-4)', maxWidth: 900 }}>
          The science <em>behind</em> the smoke.
        </h1>
        <p style={{
          fontSize: 'var(--text-lg)',
          color: 'var(--fg-muted)',
          maxWidth: 620,
          margin: '0 0 var(--s-5)',
          lineHeight: 1.5,
        }}>
          Every contestant sample measured. Water activity (aW) is the objective metric
          the judges can&apos;t taste — but it&apos;s what decides whether the cure preserved
          the terpenes they score on.
        </p>
        <div style={{ display: 'flex', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
          <a href="#readings" className="btn primary">View live readings →</a>
          <Link href="/request" className="btn ghost">Get aW on your flower</Link>
        </div>
      </section>

      <AwLegend />

      <div id="readings" />
      <LiveReadings initial={readings} />

      <section className="container" style={{
        padding: 'var(--s-7) var(--s-5)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 'var(--s-6)',
        alignItems: 'center',
      }}>
        <blockquote className="pull-quote">
          Standardize the cure, you force the weed to stand on its own.
          Water activity is the number behind that standard.
        </blockquote>
        <div>
          <div className="eyebrow" style={{ marginBottom: 'var(--s-3)' }}>
            WHY aW MATTERS FOR JUDGING
          </div>
          <p style={{
            fontSize: 'var(--text-base)',
            color: 'var(--fg-muted)',
            lineHeight: 1.6,
            margin: 0,
          }}>
            Aroma accuracy, flavor integrity, smoothness, clean burn — the pillars
            Proper Doinks judges on are all downstream of cure quality. Water activity
            is the single number that tells you whether the terpenes still have a
            monolayer of water holding them in place, or whether they evaporated out
            on a warm drying room floor.
          </p>
        </div>
      </section>

      <section style={{
        background: 'var(--aroya-vibrant-green)',
        color: 'var(--fg)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--s-7) var(--s-6)',
        maxWidth: 1280,
        margin: '0 auto var(--s-7)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'var(--s-5)',
        alignItems: 'center',
      }}>
        <div>
          <div className="eyebrow" style={{
            color: 'var(--aroya-medium-gray)',
            marginBottom: 'var(--s-3)',
          }}>
            FOR CULTIVATORS
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 'var(--fw-regular)',
            fontStyle: 'italic',
            fontSize: 'clamp(28px, 4vw, 40px)',
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
            margin: '0 0 var(--s-3)',
          }}>
            Want aW on your finished flower?
          </h2>
          <p style={{
            fontSize: 'var(--text-base)',
            color: 'var(--aroya-medium-gray)',
            margin: 0,
            maxWidth: 520,
          }}>
            AROYA can set your cure process up for measured, repeatable terpene retention.
            Drop your details and we&apos;ll be in touch before the show ends.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--s-3)', flexDirection: 'column' }}>
          <Link href="/request" className="btn primary" style={{
            background: 'var(--fg)',
            color: 'var(--aroya-vibrant-green)',
          }}>
            Request aW testing →
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
