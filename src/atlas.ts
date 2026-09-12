import { Port } from "./sim";
let land = "";
type Ring = number[][];
export async function loadAtlas(): Promise<void> {
  const response = await fetch("/data/land.geojson");
  if (!response.ok) throw new Error("海岸资料未加载");
  const data = await response.json();
  const rings: Ring[] = [];
  for (const feature of data.features) {
    const g = feature.geometry;
    if (g.type === "Polygon") rings.push(...g.coordinates);
    else if (g.type === "MultiPolygon")
      for (const poly of g.coordinates) rings.push(...poly);
  }
  land = rings
    .map(
      (r) =>
        r
          .map(
            ([lon, lat], i) =>
              `${i ? "L" : "M"}${(lon + 180).toFixed(2)},${(90 - lat).toFixed(2)}`,
          )
          .join("") + "Z",
    )
    .join("");
}
export function atlasMarkup(
  available: Port[],
  current: string,
  selected: string | null,
): string {
  return `<svg class="atlas" viewBox="0 0 360 180" role="img" aria-label="世界港口分布图"><defs><pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="#abc2af" stroke-width=".3"/></pattern></defs><rect width="360" height="180" fill="#436f75"/><rect width="360" height="180" fill="url(#grid)"/><path d="${land}" fill="#b2b58b" stroke="#d5cfaa" stroke-width=".35"/>${available.map((p) => `<g data-atlas="${p.id}" role="button" tabindex="0" aria-label="选择${p.name}" class="atlas-port"><circle cx="${(p.x + 1) * 180}" cy="${(1 - p.y) * 90}" r="${p.id === current || p.id === selected ? 3 : 1.8}" fill="${p.id === current ? "#f5db87" : p.id === selected ? "#f79561" : "#233f36"}" stroke="#f1e5c3" stroke-width=".6"/><title>${p.name} · ${p.region}</title></g>`).join("")}<text x="12" y="168" fill="#dde5cb" font-size="4" letter-spacing="1.5">远 海 航 路 图</text></svg>`;
}
