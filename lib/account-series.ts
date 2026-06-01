/**
 * Deterministic synthetic balance history for an account, so each row can
 * show a sparkline. Seeded from the account id, so server and client render
 * identical data (no hydration mismatch). Swap for real history with Plaid.
 */
function hashSeed(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function accountSeries(id: string, end: number, n = 16): number[] {
  let r = hashSeed(id) || 1;
  const rnd = () => {
    r = (Math.imul(r, 1103515245) + 12345) & 0x7fffffff;
    return r / 0x7fffffff;
  };
  const mag = Math.max(Math.abs(end), 500);
  const points: number[] = [end];
  for (let i = 1; i < n; i++) {
    // Slight upward bias so most series trend toward the current balance.
    const drift = (rnd() - 0.42) * mag * 0.035;
    points.unshift(points[0] - drift);
  }
  return points;
}
