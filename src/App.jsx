import { useState, useEffect } from 'react';
import { flagUrl } from './lib/flagUtils';
import { loadState, saveState, subscribeToState } from './lib/storage';
import { COUNTRIES } from './data/countries';
import AdScreen         from './components/AdScreen';
import RouletteSpinner  from './components/RouletteSpinner';
import FlagPicker       from './components/FlagPicker';
import TierCard         from './components/TierCard';
import LeaderboardModal from './components/LeaderboardModal';

const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/test_00w7sN1MOcB5acvexW6oo00';

export function gBtn(variant) {
  if (variant === 'gold') return {
    background: 'linear-gradient(135deg,#c9a84c,#e8c86a)',
    border: 'none', borderRadius: 4, padding: '10px 20px',
    color: '#1a1209', cursor: 'pointer', fontSize: 13,
    fontFamily: 'Georgia, serif', fontWeight: 600,
    boxShadow: '0 4px 20px rgba(201,168,76,0.22)', whiteSpace: 'nowrap',
  };
  return {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.13)',
    borderRadius: 4, padding: '10px 16px',
    color: '#908070', cursor: 'pointer',
    fontSize: 13, fontFamily: 'Georgia, serif', whiteSpace: 'nowrap',
  };
}

export default function App() {
  // ── Persistent state ──────────────────────────────────────────────────────
  const [currentFlag,    setCurrentFlag]    = useState({ code: 'US', name: 'United States' });
  const [votes,          setVotes]          = useState({});
  const [paidPerCountry, setPaidPerCountry] = useState({});
  const [totalRaised,    setTotalRaised]    = useState(0);
  const [totalSwaps,     setTotalSwaps]     = useState(0);
  const [loading,        setLoading]        = useState(true);

  // ── UI state ──────────────────────────────────────────────────────────────
  const [flow,            setFlow]            = useState('home');
  const [adIndex,         setAdIndex]         = useState(0);
  const [adTotal,         setAdTotal]         = useState(1);
  const [adDest,          setAdDest]          = useState('roulette');
  const [pendingFlag,     setPendingFlag]     = useState(null);
  const [prevFlag,        setPrevFlag]        = useState(null);
  const [isWaving,        setIsWaving]        = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // ── Load from Supabase on mount ───────────────────────────────────────────
  useEffect(() => {
    async function init() {
      // Check if returning from Stripe payment
      const params = new URLSearchParams(window.location.search);
      if (params.get('payment') === 'success') {
        const stored = sessionStorage.getItem('pendingFlag');
        if (stored) {
          const flag = JSON.parse(stored);
          sessionStorage.removeItem('pendingFlag');
          window.history.replaceState({}, '', window.location.pathname);
          const s = await loadState();
          setCurrentFlag(s.currentFlag);
          setVotes(s.votes);
          setPaidPerCountry(s.paidPerCountry);
          setTotalRaised(s.totalRaised);
          setTotalSwaps(s.totalSwaps);
          setLoading(false);
          await commitFlagDirect(flag, 0.99, s);
          return;
        }
      }

      const s = await loadState();
      setCurrentFlag(s.currentFlag);
      setVotes(s.votes);
      setPaidPerCountry(s.paidPerCountry);
      setTotalRaised(s.totalRaised);
      setTotalSwaps(s.totalSwaps);
      setLoading(false);
    }
    init();

    // Real-time updates for all connected users
    const channel = subscribeToState((s) => {
      setCurrentFlag(s.currentFlag);
      setVotes(s.votes);
      setPaidPerCountry(s.paidPerCountry);
      setTotalRaised(s.totalRaised);
      setTotalSwaps(s.totalSwaps);
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 2200);
    });

    return () => channel.unsubscribe();
  }, []);

  // ── Commit flag (used after returning from Stripe) ────────────────────────
  async function commitFlagDirect(flag, amount, currentState) {
    const nv = { ...currentState.votes,          [flag.code]: (currentState.votes[flag.code] || 0) + 1 };
    const np = { ...currentState.paidPerCountry, [flag.code]: parseFloat(((currentState.paidPerCountry[flag.code] || 0) + amount).toFixed(2)) };
    const nr = parseFloat((currentState.totalRaised + amount).toFixed(2));
    const ns = currentState.totalSwaps + 1;

    setCurrentFlag(flag);
    setVotes(nv);
    setPaidPerCountry(np);
    setTotalRaised(nr);
    setTotalSwaps(ns);

    await saveState({ currentFlag: flag, votes: nv, paidPerCountry: np, totalRaised: nr, totalSwaps: ns });
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 2200);
    setFlow('success');
  }

  // ── Commit a flag change ──────────────────────────────────────────────────
  async function commitFlag(flag, amount) {
    setPrevFlag({ ...currentFlag });

    const nv = { ...votes,          [flag.code]: (votes[flag.code] || 0) + 1 };
    const np = { ...paidPerCountry, [flag.code]: parseFloat(((paidPerCountry[flag.code] || 0) + amount).toFixed(2)) };
    const nr = parseFloat((totalRaised + amount).toFixed(2));
    const ns = totalSwaps + 1;

    setCurrentFlag(flag);
    setVotes(nv);
    setPaidPerCountry(np);
    setTotalRaised(nr);
    setTotalSwaps(ns);

    await saveState({ currentFlag: flag, votes: nv, paidPerCountry: np, totalRaised: nr, totalSwaps: ns });

    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 2200);
    setFlow('success');
  }

  // ── Stripe checkout ───────────────────────────────────────────────────────
  function handleStripePayment() {
    if (!pendingFlag) return;
    sessionStorage.setItem('pendingFlag', JSON.stringify(pendingFlag));
    const returnUrl = `${window.location.origin}?payment=success`;
    window.location.href = `${STRIPE_PAYMENT_LINK}?success_url=${encodeURIComponent(returnUrl)}`;
  }

  // ── Ad flow ───────────────────────────────────────────────────────────────
  function watchAds(total, dest) {
    setAdTotal(total);
    setAdIndex(0);
    setAdDest(dest);
    setFlow('ad');
  }

  function onAdNext() {
    const next = adIndex + 1;
    if (next >= adTotal) setFlow(adDest);
    else setAdIndex(next);
  }

  // ── Top 3 chips ───────────────────────────────────────────────────────────
  const topClaims = Object.entries(votes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([code, count]) => ({
      ...COUNTRIES.find(c => c.code === code) || { code, name: code },
      count,
    }));

  // ── Loading screen ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ ...styles.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#c9a84c', fontFamily: 'monospace', fontSize: 13, letterSpacing: '0.2em' }}>
          LOADING…
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      {/* Noise overlay */}
      <div style={styles.noise} />

      {/* Ad screen */}
      {flow === 'ad' && (
        <AdScreen adIndex={adIndex} total={adTotal} onDone={onAdNext} />
      )}

      {/* Leaderboard modal */}
      {showLeaderboard && (
        <LeaderboardModal
          votes={votes}
          paidPerCountry={paidPerCountry}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      <div style={styles.inner}>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div style={styles.header}>
          <div style={styles.eyebrow}>⚑ Live — One Flag Rules</div>
          <h1 style={styles.title}>RAGING FLAG-IT</h1>
          <p style={styles.subtitle}>Watch ads or pay to change the world's flag</p>
        </div>

        {/* ── Reigning flag ───────────────────────────────────────────────── */}
        <div style={styles.heroWrap}>
          <div style={{
            ...styles.flagBox,
            animation: isWaving ? 'flagWave 0.45s ease-in-out 4' : 'float 6s ease-in-out infinite',
          }}>
            <img src={flagUrl(currentFlag.code)} alt={currentFlag.name} style={styles.flagImg} />
          </div>
          <div style={styles.countryName}>{currentFlag.name}</div>
        </div>

        {/* ── Mini chips + leaderboard button ─────────────────────────────── */}
        <div style={styles.chipsRow}>
          {topClaims.map((c, i) => (
            <div key={c.code} style={styles.chip}>
              <span>{['🥇','🥈','🥉'][i]}</span>
              <img src={flagUrl(c.code)} style={styles.chipFlag} alt={c.name} />
              <span style={{ color: '#907060' }}>{c.name}</span>
              <span style={{ color: '#c9a84c', fontFamily: 'monospace' }}>{c.count}×</span>
            </div>
          ))}
          <button onClick={() => setShowLeaderboard(true)} style={styles.lbBtn}>
            ⊞ Leaderboard
          </button>
        </div>

        {/* ── HOME ────────────────────────────────────────────────────────── */}
        {flow === 'home' && (
          <div style={styles.tiers}>
            <TierCard
              emoji="🎲" title="Random Flag"
              desc={<>Watch <b style={{ color: '#b0a090' }}>1 ad</b> — flag chosen by weighted draw</>}
              badge="FREE" badgeColor="#3a6e3a"
              action={<button onClick={() => watchAds(1, 'roulette')} style={gBtn('ghost')}>Watch 1 Ad</button>}
            />
            <TierCard
              emoji="🎯" title="Pick Your Flag"
              desc={<>Watch <b style={{ color: '#b0a090' }}>3 ads</b> — choose any of 197 countries</>}
              badge="FREE" badgeColor="#3a6e3a"
              action={<button onClick={() => watchAds(3, 'pick')} style={gBtn('ghost')}>Watch 3 Ads</button>}
            />
            <TierCard
              emoji="⚡" title="Instant Claim"
              desc={<>Pay <b style={{ color: '#c9a84c' }}>$0.99</b> — skip all ads, choose instantly</>}
              badge="PREMIUM" badgeColor="#7a5a1a" highlight
              action={<button onClick={() => setFlow('pay-pick')} style={gBtn('gold')}>$0.99 — Claim</button>}
            />
          </div>
        )}

        {/* ── ROULETTE ────────────────────────────────────────────────────── */}
        {flow === 'roulette' && (
          <RouletteSpinner onResult={f => commitFlag(f, 0)} />
        )}

        {/* ── PICK (after 3 ads) ───────────────────────────────────────────── */}
        {flow === 'pick' && (
          <div style={styles.pickerWrap}>
            <div style={styles.pickerLabel}>Ads complete — choose your flag</div>
            <FlagPicker
              currentCode={currentFlag.code} votes={votes}
              onPick={f => commitFlag(f, 0)}
              onCancel={() => setFlow('home')}
            />
          </div>
        )}

        {/* ── PAY-PICK ────────────────────────────────────────────────────── */}
        {flow === 'pay-pick' && (
          <div style={styles.pickerWrap}>
            <div style={styles.pickerLabel}>$0.99 — choose your flag</div>
            <FlagPicker
              currentCode={currentFlag.code} votes={votes}
              onPick={f => { setPendingFlag(f); setFlow('confirm-pay'); }}
              onCancel={() => setFlow('home')}
            />
          </div>
        )}

        {/* ── CONFIRM PAY ─────────────────────────────────────────────────── */}
        {flow === 'confirm-pay' && pendingFlag && (
          <div style={styles.confirmWrap}>
            <div style={styles.confirmLabel}>Confirm claim</div>

            <div style={styles.swapRow}>
              <div style={{ textAlign: 'center', opacity: 0.4 }}>
                <img src={flagUrl(currentFlag.code)} style={styles.swapFlagFrom} alt={currentFlag.name} />
                <div style={{ fontSize: 10, marginTop: 4, color: '#7a7060' }}>{currentFlag.name}</div>
              </div>
              <div style={{ fontSize: 24, color: '#c9a84c' }}>→</div>
              <div style={{ textAlign: 'center' }}>
                <img src={flagUrl(pendingFlag.code)} style={styles.swapFlagTo} alt={pendingFlag.name} />
                <div style={{ fontSize: 11, marginTop: 4 }}>{pendingFlag.name}</div>
              </div>
            </div>

            <div style={styles.priceBox}>
              <div style={{ fontSize: 32, color: '#c9a84c' }}>$0.99</div>
              <div style={{ fontSize: 10, color: '#7a7060', marginTop: 3, fontFamily: 'monospace' }}>
                one-time · instant · no ads
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setFlow('pay-pick')} style={gBtn('ghost')}>← Back</button>
              <button onClick={handleStripePayment} style={gBtn('gold')}>Pay $0.99 & Claim ⚑</button>
            </div>
          </div>
        )}

        {/* ── SUCCESS ─────────────────────────────────────────────────────── */}
        {flow === 'success' && (
          <div style={styles.successWrap}>
            <div style={{ fontSize: 50 }}>⚑</div>
            <div style={{ fontSize: 21 }}>Flag claimed!</div>
            {prevFlag && (
              <div style={{ fontSize: 12, color: '#7a7060', fontFamily: 'monospace' }}>
                {prevFlag.name} → <span style={{ color: '#c9a84c' }}>{currentFlag.name}</span>
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
              <button onClick={() => setShowLeaderboard(true)} style={gBtn('ghost')}>⊞ Leaderboard</button>
              <button onClick={() => setFlow('home')} style={gBtn('gold')}>Play again</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh', background: '#0a0a0f',
    fontFamily: "Georgia, 'Times New Roman', serif",
    color: '#e8e0d0', overflow: 'hidden',
  },
  noise: {
    position: 'fixed', inset: 0, opacity: 0.025, zIndex: 0, pointerEvents: 'none',
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'repeat', backgroundSize: '128px',
  },
  inner:    { position: 'relative', zIndex: 1, maxWidth: 840, margin: '0 auto', padding: '0 18px 60px' },
  header:   { textAlign: 'center', padding: '42px 0 16px' },
  eyebrow:  { fontSize: 10, letterSpacing: '0.32em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: 10, fontFamily: 'monospace' },
  title:    { fontSize: 'clamp(28px,7vw,60px)', margin: 0, fontWeight: 400, color: '#f0e8d8', letterSpacing: '-0.02em', lineHeight: 1 },
  subtitle: { color: '#7a7060', fontSize: 13, marginTop: 7, letterSpacing: '0.04em' },

  heroWrap:    { display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px 0 20px', gap: 11 },
  flagBox:     { width: 248, height: 155, borderRadius: 6, overflow: 'hidden', boxShadow: '0 0 0 1px rgba(201,168,76,0.28), 0 24px 80px rgba(0,0,0,0.85)' },
  flagImg:     { width: '100%', height: '100%', objectFit: 'cover' },
  countryName: { fontSize: 19 },

  chipsRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 24 },
  chip:     { display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 4, padding: '3px 8px', fontSize: 10 },
  chipFlag: { width: 16, height: 10, objectFit: 'cover', borderRadius: 1 },
  lbBtn:    { background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.22)', borderRadius: 4, padding: '4px 12px', color: '#c9a84c', cursor: 'pointer', fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.08em' },

  tiers: { maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 10 },

  pickerWrap:  { maxWidth: 600, margin: '0 auto' },
  pickerLabel: { fontSize: 11, letterSpacing: '0.2em', color: '#c9a84c', textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 12, textAlign: 'center' },

  confirmWrap:  { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '14px 0', maxWidth: 400, margin: '0 auto' },
  confirmLabel: { fontSize: 10, letterSpacing: '0.22em', color: '#7a7060', textTransform: 'uppercase', fontFamily: 'monospace' },
  swapRow:      { display: 'flex', alignItems: 'center', gap: 18 },
  swapFlagFrom: { width: 88, height: 55, objectFit: 'cover', borderRadius: 4 },
  swapFlagTo:   { width: 108, height: 68, objectFit: 'cover', borderRadius: 4, boxShadow: '0 0 0 2px #c9a84c,0 12px 40px rgba(201,168,76,0.2)' },
  priceBox:     { background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.22)', borderRadius: 6, padding: '13px 28px', textAlign: 'center' },

  successWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '26px 0', textAlign: 'center' },
};