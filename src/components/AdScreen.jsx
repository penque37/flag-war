import { useState, useEffect } from 'react';

// Placeholder ads — replace ad content with your real ad SDK calls.
// adIndex cycles through the AD_CONTENT array so each ad looks different.
const AD_CONTENT = [
  { icon: '🍔', text: 'BurgerBlast — delivered hot in 15 min', bg: '#c0392b' },
  { icon: '✈️', text: 'FlyDirect. Cheap flights, no hidden fees.', bg: '#1a4fa0' },
  { icon: '👟', text: 'KickZone — New drops every Friday.', bg: '#1a1a1a' },
];

const AD_DURATION_SECONDS = 5;

export default function AdScreen({ adIndex, total, onDone }) {
  const [secs, setSecs] = useState(AD_DURATION_SECONDS);
  const ad = AD_CONTENT[adIndex % AD_CONTENT.length];

  useEffect(() => {
    setSecs(AD_DURATION_SECONDS); // reset timer for each new ad
  }, [adIndex]);

  useEffect(() => {
    if (secs <= 0) return;
    const t = setTimeout(() => setSecs(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);

  return (
    <div style={styles.overlay}>
      {/* Ad box */}
      <div style={{ ...styles.adBox, background: ad.bg }}>
        <div style={styles.icon}>{ad.icon}</div>
        <div style={styles.adText}>{ad.text}</div>
        <div style={styles.adLabel}>ADVERTISEMENT</div>
      </div>

      {/* Progress + skip */}
      <div style={styles.controls}>
        <div style={styles.dots}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{
              ...styles.dot,
              background: i < adIndex
                ? '#c9a84c'
                : i === adIndex
                  ? 'rgba(201,168,76,0.5)'
                  : 'rgba(255,255,255,0.1)',
            }} />
          ))}
        </div>

        <div style={styles.countText}>
          Ad {adIndex + 1} of {total}{secs > 0 ? ` — skip in ${secs}s` : ''}
        </div>

        <button
          onClick={secs <= 0 ? onDone : undefined}
          disabled={secs > 0}
          style={{
            ...styles.continueBtn,
            background: secs <= 0
              ? 'linear-gradient(135deg,#c9a84c,#e8c86a)'
              : 'rgba(255,255,255,0.06)',
            color: secs <= 0 ? '#1a1209' : '#3a3228',
            cursor: secs <= 0 ? 'pointer' : 'default',
          }}
        >
          {secs > 0 ? `Wait (${secs}s)` : 'Continue →'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 200,
    background: '#07070c',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: 28,
  },
  adBox: {
    width: 'min(360px, 88vw)', borderRadius: 10,
    padding: '44px 32px', textAlign: 'center',
    boxShadow: '0 32px 100px rgba(0,0,0,0.9)',
  },
  icon:    { fontSize: 68, marginBottom: 14 },
  adText:  { fontSize: 20, fontWeight: 700, color: '#fff', fontFamily: 'Georgia, serif', lineHeight: 1.35 },
  adLabel: { marginTop: 18, fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', letterSpacing: '0.15em' },
  controls: { textAlign: 'center' },
  dots: { display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 14 },
  dot:  { width: 28, height: 4, borderRadius: 2, transition: 'background 0.4s' },
  countText: { fontSize: 12, color: '#5a5040', fontFamily: 'monospace', marginBottom: 14 },
  continueBtn: {
    border: 'none', borderRadius: 5, padding: '12px 30px',
    fontSize: 14, fontFamily: 'Georgia, serif', fontWeight: 600,
    transition: 'all 0.35s',
  },
};