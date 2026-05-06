export default function TierCard({ emoji, title, desc, badge, badgeColor, highlight, action }) {
  return (
    <div style={{
      background:   highlight ? 'rgba(201,168,76,0.05)' : 'rgba(255,255,255,0.025)',
      border:       `1px solid ${highlight ? 'rgba(201,168,76,0.28)' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: 8, padding: '18px 20px',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', gap: 14,
    }}>
      <div style={{ flex: 1 }}>
        <div style={styles.titleRow}>
          <span style={styles.emoji}>{emoji}</span>
          <span style={styles.title}>{title}</span>
          <span style={{ ...styles.badge, background: badgeColor }}>{badge}</span>
        </div>
        <div style={styles.desc}>{desc}</div>
      </div>
      <div style={{ flexShrink: 0 }}>{action}</div>
    </div>
  );
}

const styles = {
  titleRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 },
  emoji:    { fontSize: 16 },
  title:    { fontSize: 15, color: '#e8e0d0' },
  badge: {
    fontSize: 9, fontFamily: 'monospace', letterSpacing: '0.1em',
    color: '#fff', borderRadius: 3, padding: '1px 5px',
  },
  desc: { fontSize: 12, color: '#7a7060', lineHeight: 1.5 },
};