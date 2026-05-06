import { useState, useEffect, useRef } from 'react';
import { COUNTRIES } from '../data/countries';
import { flagUrl, weightedRandom } from '../lib/flagUtils';

const SPIN_DURATION_MS = 2800;

export default function RouletteSpinner({ onResult }) {
  const [display, setDisplay] = useState(COUNTRIES[0]);
  const [done, setDone]       = useState(false);
  const result   = useRef(weightedRandom());
  const timerRef = useRef(null);

  useEffect(() => {
    let elapsed = 0;
    let speed   = 55;

    function tick() {
      setDisplay(COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)]);
      elapsed += speed;

      // Gradually slow down in the last 45% of spin time
      if (elapsed > SPIN_DURATION_MS * 0.55) {
        speed = 55 + ((elapsed - SPIN_DURATION_MS * 0.55) / (SPIN_DURATION_MS * 0.45)) * 320;
      }

      if (elapsed >= SPIN_DURATION_MS) {
        setDisplay(result.current);
        setDone(true);
        return;
      }

      timerRef.current = setTimeout(tick, speed);
    }

    timerRef.current = setTimeout(tick, speed);
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <div style={styles.wrap}>
      <div style={styles.label}>
        {done ? 'You got —' : 'Drawing…'}
      </div>

      <div style={{
        ...styles.flagWrap,
        boxShadow: done
          ? '0 0 0 3px #c9a84c, 0 20px 70px rgba(201,168,76,0.3)'
          : '0 0 0 1px rgba(255,255,255,0.1), 0 12px 40px rgba(0,0,0,0.7)',
        filter: done ? 'none' : 'blur(0.8px)',
      }}>
        <img
          src={flagUrl(display.code)}
          alt={display.name}
          style={styles.flagImg}
        />
      </div>

      <div style={{ ...styles.countryName, opacity: done ? 1 : 0.25 }}>
        {display.name}
      </div>

      {done && (
        <button onClick={() => onResult(result.current)} style={styles.claimBtn}>
          Claim it ⚑
        </button>
      )}
    </div>
  );
}

const styles = {
  wrap: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 18, padding: '24px 0',
  },
  label: {
    fontSize: 11, letterSpacing: '0.25em',
    color: '#7a7060', fontFamily: 'monospace', textTransform: 'uppercase',
  },
  flagWrap: {
    width: 210, height: 131, borderRadius: 6, overflow: 'hidden',
    transition: 'box-shadow 0.5s, filter 0.5s',
  },
  flagImg: { width: '100%', height: '100%', objectFit: 'cover' },
  countryName: {
    fontSize: 19, transition: 'opacity 0.3s',
  },
  claimBtn: {
    marginTop: 4,
    background: 'linear-gradient(135deg,#c9a84c,#e8c86a)',
    border: 'none', borderRadius: 4, padding: '10px 28px',
    color: '#1a1209', cursor: 'pointer', fontSize: 14,
    fontFamily: 'Georgia, serif', fontWeight: 600,
    boxShadow: '0 4px 20px rgba(201,168,76,0.22)',
    animation: 'fadeUp 0.4s ease',
  },
};