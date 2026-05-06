import { useState } from 'react';
import { COUNTRIES } from '../data/countries';
import { flagUrl } from '../lib/flagUtils';

export default function FlagPicker({ currentCode, votes, onPick, onCancel }) {
  const [search, setSearch] = useState('');

  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Search bar */}
      <div style={styles.searchWrap}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search 197 countries…"
          autoFocus
          style={styles.input}
        />
        <span style={styles.count}>{filtered.length}</span>
      </div>

      {/* Flag grid */}
      <div style={styles.grid}>
        {filtered.map(c => {
          const isActive = c.code === currentCode;
          return (
            <button
              key={c.code}
              onClick={() => onPick(c)}
              style={{
                ...styles.card,
                background:   isActive ? 'rgba(201,168,76,0.09)' : 'rgba(255,255,255,0.025)',
                borderColor:  isActive ? '#c9a84c'               : 'rgba(255,255,255,0.07)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background   = 'rgba(201,168,76,0.08)';
                e.currentTarget.style.borderColor  = 'rgba(201,168,76,0.45)';
                e.currentTarget.style.transform    = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background   = isActive ? 'rgba(201,168,76,0.09)' : 'rgba(255,255,255,0.025)';
                e.currentTarget.style.borderColor  = isActive ? '#c9a84c' : 'rgba(255,255,255,0.07)';
                e.currentTarget.style.transform    = 'none';
              }}
            >
              <img src={flagUrl(c.code)} alt={c.name} style={styles.flag} />
              <span style={styles.name}>{c.name}</span>
              {votes[c.code] > 0 && (
                <span style={styles.voteCount}>{votes[c.code]}×</span>
              )}
            </button>
          );
        })}
      </div>

      <button onClick={onCancel} style={styles.backBtn}>← Back</button>
    </div>
  );
}

const styles = {
  searchWrap: { position: 'relative', marginBottom: 10 },
  input: {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(201,168,76,0.28)',
    borderRadius: 4, padding: '11px 14px',
    color: '#e8e0d0', fontSize: 14,
    fontFamily: 'Georgia, serif', outline: 'none',
  },
  count: {
    position: 'absolute', right: 12, top: '50%',
    transform: 'translateY(-50%)',
    fontSize: 10, color: '#4a4238',
    fontFamily: 'monospace', pointerEvents: 'none',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(115px, 1fr))',
    gap: 6, maxHeight: 370, overflowY: 'auto', paddingRight: 2,
  },
  card: {
    border: '1px solid', borderRadius: 5, padding: '8px 5px',
    cursor: 'pointer', display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 5,
    color: '#e8e0d0', transition: 'all 0.12s',
  },
  flag:      { width: 62, height: 39, objectFit: 'cover', borderRadius: 2 },
  name:      { fontSize: 10, textAlign: 'center', lineHeight: 1.3, color: '#b0a898' },
  voteCount: { fontSize: 9, color: '#c9a84c', fontFamily: 'monospace' },
  backBtn: {
    marginTop: 12, width: '100%',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.13)',
    borderRadius: 4, padding: '10px 16px',
    color: '#908070', cursor: 'pointer',
    fontSize: 13, fontFamily: 'Georgia, serif',
  },
};