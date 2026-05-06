// storage.js
// Currently uses localStorage so the app works with no backend.
// To go live with shared state, replace each function body with
// a Supabase call — the rest of the app won't need to change.

const KEYS = {
  currentFlag:    'fw-currentFlag',
  votes:          'fw-votes',
  paidPerCountry: 'fw-paidPerCountry',
  totalRaised:    'fw-totalRaised',
  totalSwaps:     'fw-totalSwaps',
};

export function loadState() {
  try {
    return {
      currentFlag:    JSON.parse(localStorage.getItem(KEYS.currentFlag)) || { code: 'US', name: 'United States' },
      votes:          JSON.parse(localStorage.getItem(KEYS.votes))          || {},
      paidPerCountry: JSON.parse(localStorage.getItem(KEYS.paidPerCountry)) || {},
      totalRaised:    parseFloat(localStorage.getItem(KEYS.totalRaised))    || 0,
      totalSwaps:     parseInt(localStorage.getItem(KEYS.totalSwaps))       || 0,
    };
  } catch {
    return {
      currentFlag:    { code: 'US', name: 'United States' },
      votes:          {},
      paidPerCountry: {},
      totalRaised:    0,
      totalSwaps:     0,
    };
  }
}

export function saveState({ currentFlag, votes, paidPerCountry, totalRaised, totalSwaps }) {
  try {
    localStorage.setItem(KEYS.currentFlag,    JSON.stringify(currentFlag));
    localStorage.setItem(KEYS.votes,          JSON.stringify(votes));
    localStorage.setItem(KEYS.paidPerCountry, JSON.stringify(paidPerCountry));
    localStorage.setItem(KEYS.totalRaised,    totalRaised.toString());
    localStorage.setItem(KEYS.totalSwaps,     totalSwaps.toString());
  } catch (err) {
    console.error('Failed to save state:', err);
  }
}