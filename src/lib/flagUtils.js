import { COUNTRIES, FLAG_WEIGHTS } from '../data/countries';

export function flagUrl(code) {
  return `https://flagcdn.com/w320/${code.toLowerCase()}.png`;
}

export function getWeight(code) {
  return FLAG_WEIGHTS[code] || 1;
}

export function weightedRandom() {
  const total = COUNTRIES.reduce((sum, c) => sum + getWeight(c.code), 0);
  let r = Math.random() * total;
  for (const c of COUNTRIES) {
    r -= getWeight(c.code);
    if (r <= 0) return c;
  }
  return COUNTRIES[0];
}