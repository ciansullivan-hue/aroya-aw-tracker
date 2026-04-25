import { Topbar } from '@/components/Topbar';
import { login } from './actions';

export const dynamic = 'force-dynamic';

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <>
      <Topbar />
      <section className="container-narrow" style={{ padding: 'var(--s-8) var(--s-5)' }}>
        <div className="eyebrow" style={{ marginBottom: 'var(--s-4)' }}>
          AROYA TECH ACCESS
        </div>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 'var(--fw-regular)',
          fontStyle: 'italic',
          fontSize: 'clamp(28px, 5vw, 48px)',
          lineHeight: 1.1,
          letterSpacing: '-0.01em',
          marginBottom: 'var(--s-5)',
        }}>
          Enter password to log readings.
        </h1>

        {searchParams.error === 'invalid' && (
          <div className="banner error">Incorrect password.</div>
        )}
        {searchParams.error === 'server' && (
          <div className="banner error">Server not configured. Check ADMIN_PASSWORD env var.</div>
        )}

        <form action={login} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
          <div className="field required">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn primary" style={{ alignSelf: 'flex-start' }}>
            Enter →
          </button>
        </form>
      </section>
    </>
  );
}
