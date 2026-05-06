import { useState } from 'react';
import { COUNTRIES } from '../data/countries';
import { flagUrl } from '../lib/flagUtils';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardModal({ votes, paidPerCountry, onClose }) {
  const [tab, setTab] = useState('claims');

  const claimsData = Object.entries(votes)
    .map(([code, count]) => ({ ...COUNTRIES.find(c => c.code === code), count }))
    .sort((a, b) => b.count - a.count);

  const moneyData = Object.entries(paidPerCountry)
    .map(([code, amount]) => ({ ...COUNTRIES.find(c => c.code === code), amount }))
    .sort((a, b) => b.amount - a.amount);

  const maxClaims = claimsData[0]?.count  || 1;
  const maxMoney  = moneyData[0]?.amount  || 1;

  return (
    <div onClick={onClose} style={styles.overlay}>
      <div onClick={e => e.stopPropagation()} style={styles.modal}>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.title}>Leaderboard</div>
          <button onClick={onClose} style={styles.closeBtn}>×</button>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <Tab label="🏆 Most Claimed" active={tab === 'claims'} onClick={() => setTab('claims')} />
          <Tab label="💰 Most Paid"    active={tab === 'money'}  onClick={() => setTab('money')}  />
        </div>

        {/* Rows */}
        <div style={styles.body}>
          {tab === 'claims' && (
            claimsData.length === 0
              ? <Empty />
              : claimsData.map((c, i) => (
                <Row key={c.code} rank={i + 1} code={c.code} name={c.name}
                  label={`${c.count} claim${c.count !== 1 ? 's' : ''}`}
                  bar={(c.count / maxClaims) * 100}
                  gold={i === 0}
                />
              ))
          )}
          {tab === 'money' && (
            moneyData.length === 0
              ? <Empty />
              : moneyData.map((c, i) => (
                <Row key={c.code} rank={i + 1} code={c.code} name={c.name}
                  label={`$${c.amount.toFixed(2)}`}
                  bar={(c.amount / maxMoney) * 100}
                  gold={i === 0}
                />
              ))
          )}
        </div>
      </div>
    </div>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '9px 0', background: 'none',
      border: 'none',
      borderBottom: `2px solid ${active ? '#c9a84c' : 'transparent'}`,
      color: active ? '#c9a84c' : '#5a5040',
      cursor: 'pointer', fontSize: 12,
      fontFamily: 'monospace', letterSpacing: '0.1em',
      textTransform: 'uppercase', transition: 'all 0.2s',
    }}>
      {label}
    </button>
  );
}

function Row({ rank, code, name, label, bar, gold }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      marginBottom: 10, padding: '10px 12px',
      background: gold ? 'rgba(201,168,76,0.06)' : 'rgba(255,255,255,0.02)',
      border: `1px solid ${gold ? 'rgba(201,168,76,0.18)' : 'rgba(255,255,255,0.05)'}`,
      borderRadius: 6,
    }}>
      <div style={{ width: 22, textAlign: 'center', fontSize: rank <= 3 ? 16 : 12, color: '#5a5040', fontFamily: 'monospace', flexShrink: 0 }}>
        {rank <= 3 ? MEDALS[rank - 1] : rank}
      </div>
      <img src={flagUrl(code)} alt={name} style={{ width: 36, height: 22, objectFit: 'cover', borderRadius: 3, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: '#d0c8b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
        <div style={{ marginTop: 5, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
          <div style={{ width: `${bar}%`, height: '100%', background: gold ? '#c9a84c' : 'rgba(201,168,76,0.4)', borderRadius: 2, transition: 'width 0.6s ease' }} />
        </div>
      </div>
      <div style={{ fontSize: 13, color: gold ? '#c9a84c' : '#7a6a50', fontFamily: 'monospace', flexShrink: 0, fontWeight: gold ? 600 : 400 }}>
        {label}
      </div>
    </div>
  );
}

function Empty() {
  return (
    <div style={{ textAlign: 'center', color: '#3a3228', fontFamily: 'monospace', fontSize: 12, padding: '30px 0' }}>
      No data yet — make some claims!
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 150,
    background: 'rgba(0,0,0,0.9)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
  },
  modal: {
    background: '#0e0e0b',
    border: '1px solid rgba(201,168,76,0.22)',
    borderRadius: 10,
    width: 'min(480px, 96vw)', maxHeight: '85vh',
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 22px 14px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  title:    { fontSize: 18, color: '#f0e8d8' },
  closeBtn: { background: 'none', border: 'none', color: '#5a5040', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: 0 },
  tabs:     { display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 22px' },
  body:     { overflowY: 'auto', padding: '16px 22px 22px', flex: 1 },
};