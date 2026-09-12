/** Pointy-top axial grid. Boundaries share vertices; there are no inset tiles. */
export const HEX_RADIUS = 1.5;
export function hexCenter(q: number, r: number) {
  return {
    lon: Math.sqrt(3) * HEX_RADIUS * (q + r / 2),
    lat: 1.5 * HEX_RADIUS * r,
  };
}
export function hexCorner(lon: number, lat: number, corner: number) {
  const angle = ((30 + 60 * corner) * Math.PI) / 180;
  return {
    lon: lon + Math.cos(angle) * HEX_RADIUS,
    lat: lat + Math.sin(angle) * HEX_RADIUS,
  };
}
export function hexAt(lon: number, lat: number) {
  const q = ((Math.sqrt(3) / 3) * lon - lat / 3) / HEX_RADIUS;
  const r = ((2 / 3) * lat) / HEX_RADIUS;
  const s = -q - r;
  let rq = Math.round(q),
    rr = Math.round(r),
    rs = Math.round(s);
  const dq = Math.abs(rq - q),
    dr = Math.abs(rr - r),
    ds = Math.abs(rs - s);
  if (dq > dr && dq > ds) rq = -rr - rs;
  else if (dr > ds) rr = -rq - rs;
  return { q: rq, r: rr, ...hexCenter(rq, rr) };
}
