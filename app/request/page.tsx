import Link from 'next/link';
import { Topbar } from '@/components/Topbar';
import { Footer } from '@/components/Footer';
import { submitLead } from './actions';

export const dynamic = 'force-dynamic';

export default function RequestPage({
  searchParams,
}: {
  searchParams: { ok?: string; error?: string };
}) {
  const success = searchParams.ok === '1';
  const error = searchParams.error;

  if (success) {
    return (
      <>
        <Topbar />
        <section className="container-narrow" style={{ padding: 'var(--s-8) var(--s-5)' }}>
          <div className="eyebrow" style={{ marginBottom: 'var(--s-4)' }}>
            REQUEST RECEIVED
          </div>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 'var(--fw-regular)',
            fontStyle: 'italic',
            fontSize: 'clamp(32px, 6vw, 56px)',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            marginBottom: 'var(--s-5)',
          }}>
            Thanks — we&apos;ll be in touch shortly.
          </h1>
          <p style={{
            fontSize: 'var(--text-lg)',
            color: 'var(--fg-muted)',
            marginBottom: 'var(--s-6)',
            lineHeight: 1.5,
          }}>
            An AROYA specialist will reach out using your preferred contact method.
            In the meantime, enjoy the show.
          </p>
          <div style={{ display: 'flex', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
            <Link href="/" className="btn primary">← Back to live readings</Link>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Topbar />
      <section className="container-narrow" style={{ padding: 'var(--s-7) var(--s-5)' }}>
        <div className="eyebrow" style={{ marginBottom: 'var(--s-4)' }}>
          FOR CULTIVATORS
        </div>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 'var(--fw-regular)',
          fontStyle: 'italic',
          fontSize: 'clamp(28px, 5vw, 48px)',
          lineHeight: 1.1,
          letterSpacing: '-0.01em',
          marginBottom: 'var(--s-4)',
        }}>
          Want aW on your finished flower?
        </h1>
        <p style={{
          fontSize: 'var(--text-base)',
          color: 'var(--fg-muted)',
          marginBottom: 'var(--s-6)',
          lineHeight: 1.6,
        }}>
          Tell us a bit about your operation and the samples you&apos;d like measured.
          We&apos;ll reach out with next steps before the show ends.
        </p>

        {error && (
          <div className="banner error">
            {error === 'missing' && 'Name and email are required.'}
            {error === 'email' && "That email doesn't look right — please double-check."}
            {error === 'server' && 'Something went wrong on our end. Please try again.'}
          </div>
        )}

        <form action={submitLead} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-5)' }}>
          <div className="field required">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" required autoComplete="name" />
          </div>

          <div className="field required">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" inputMode="email" />
          </div>

          <div className="field">
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" />
          </div>

          <div className="field">
            <label htmlFor="company">Company / Farm</label>
            <input id="company" name="company" type="text" autoComplete="organization" />
          </div>

          <div className="field">
            <label htmlFor="sample_count"># of samples</label>
            <input id="sample_count" name="sample_count" type="number" min={1} className="num" inputMode="numeric" />
            <span className="hint">HOW MANY FINISHED-FLOWER SAMPLES YOU&apos;D LIKE MEASURED</span>
          </div>

          <div className="field">
            <label>Preferred contact</label>
            <div className="radio-group">
              <input type="radio" id="pc-email" name="preferred_contact" value="email" defaultChecked />
              <label htmlFor="pc-email">Email</label>
              <input type="radio" id="pc-phone" name="preferred_contact" value="phone" />
              <label htmlFor="pc-phone">Phone</label>
              <input type="radio" id="pc-text" name="preferred_contact" value="text" />
              <label htmlFor="pc-text">Text</label>
            </div>
          </div>

          <div className="field">
            <label htmlFor="notes">Notes</label>
            <textarea id="notes" name="notes" rows={4} />
            <span className="hint">ANYTHING SPECIFIC ABOUT YOUR CURE PROCESS OR GOALS</span>
          </div>

          <button type="submit" className="btn primary" style={{ alignSelf: 'flex-start' }}>
            Submit request →
          </button>
        </form>

        <div style={{
          marginTop: 'var(--s-8)',
          paddingTop: 'var(--s-5)',
          borderTop: '1px solid var(--border)',
        }}>
          <Link href="/" style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--fg-subtle)',
          }}>
            ← BACK TO LIVE READINGS
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
