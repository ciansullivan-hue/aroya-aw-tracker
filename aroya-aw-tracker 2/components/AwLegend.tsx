export function AwLegend() {
  return (
    <div className="container" style={{ padding: '0 var(--s-5) var(--s-5)' }}>
      <div className="card" style={{
        padding: 'var(--s-4) var(--s-5)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--s-6)',
        flexWrap: 'wrap',
      }}>
        <span className="eyebrow" style={{ flexBasis: '100%', marginBottom: 0 }}>
          aW SWEET SPOT — CURE QUALITY INDICATOR
        </span>
        <div style={{
          flex: 1,
          minWidth: 280,
          position: 'relative',
          height: 32,
          borderRadius: 'var(--radius-pill)',
          background: 'linear-gradient(90deg, var(--error-bg) 0%, var(--error-bg) 25%, var(--success-bg) 35%, var(--success-bg) 65%, var(--error-bg) 75%, var(--error-bg) 100%)',
          border: '1px solid var(--border)',
        }}>
          <div style={{
            position: 'absolute',
            top: -6, bottom: -6, left: '27.5%',
            width: 2,
            background: 'var(--fg)',
          }}>
            <span style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: 10,
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--fg-subtle)',
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>0.55</span>
          </div>
          <div style={{
            position: 'absolute',
            top: -6, bottom: -6, left: '72.5%',
            width: 2,
            background: 'var(--fg)',
          }}>
            <span style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: 10,
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--fg-subtle)',
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>0.65</span>
          </div>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          color: 'var(--fg-subtle)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          <span>Over-dried · terps lost</span>
          <span>Ideal cure</span>
          <span>Moisture risk</span>
        </div>
      </div>
    </div>
  );
}
