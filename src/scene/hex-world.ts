import * as THREE from "three";
import { isLandPoint } from "../navigation";
import { buildTileProps, type TileVisual } from "./tile-props";
import { hexCenter, hexCorner, HEX_RADIUS } from "./hex-topology";
import { terrainKind } from "./terrain-biomes";
import { groundHeight } from "./terrain-elevation";

/** Grid lines follow the geographic surface; they never replace the coastline. */
export function buildHexWorld() {
  const group = new THREE.Group();
  group.name = "连续地形上的六角边界";
  const tiles: TileVisual[] = [];
  const landEdges: number[] = [],
    seaEdges: number[] = [];
  for (let r = -39; r <= 39; r++)
    for (let q = -90; q <= 90; q++) {
      const center = hexCenter(q, r);
      if (Math.abs(center.lon) > 180 || Math.abs(center.lat) > 85) continue;
      const onLand = isLandPoint(center);
      if (onLand)
        tiles.push({
          ...center,
          kind: terrainKind(center.lon, center.lat),
          seed: Math.imul(q + 182, 73856093) ^ Math.imul(r + 91, 19349663),
          radius: HEX_RADIUS,
          height: groundHeight(center.lon, center.lat),
        });
      // Three of six sides owns each edge once, avoiding double-dark shared lines.
      for (let side = 0; side < 3; side++) {
        const a = hexCorner(center.lon, center.lat, side),
          b = hexCorner(center.lon, center.lat, side + 1);
        for (let part = 0; part < 8; part++) {
          const t = part / 8,
            u = (part + 1) / 8;
          const p = {
            lon: THREE.MathUtils.lerp(a.lon, b.lon, t),
            lat: THREE.MathUtils.lerp(a.lat, b.lat, t),
          };
          const n = {
            lon: THREE.MathUtils.lerp(a.lon, b.lon, u),
            lat: THREE.MathUtils.lerp(a.lat, b.lat, u),
          };
          const land = isLandPoint(p);
          if (land !== isLandPoint(n)) continue;
          const positions = land ? landEdges : seaEdges;
          positions.push(
            p.lon,
            land ? groundHeight(p.lon, p.lat) + 0.022 : 0.025,
            -p.lat,
            n.lon,
            land ? groundHeight(n.lon, n.lat) + 0.022 : 0.025,
            -n.lat,
          );
        }
      }
    }
  const borderMaterials: THREE.LineBasicMaterial[] = [];
  for (const [positions, tint, opacity] of [
    [landEdges, 0x5d6345, 0.18],
    [seaEdges, 0x86bab7, 0.065],
  ] as const) {
    const geometry = new THREE.BufferGeometry().setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    const material = new THREE.LineBasicMaterial({
      color: tint,
      transparent: true,
      opacity,
      depthWrite: false,
    });
    borderMaterials.push(material);
    group.add(new THREE.LineSegments(geometry, material));
  }
  const props = buildTileProps();
  group.add(props.group);
  let lastKey = "";
  let cityPoints: { lon: number; lat: number }[] = [];
  let cityKey = "";
  return {
    group,
    setCities(points: { lon: number; lat: number }[]) {
      const next = points.map((p) => `${p.lon},${p.lat}`).join(";");
      if (next === cityKey) return;
      cityKey = next;
      cityPoints = points;
      lastKey = "";
    },
    updateView(lon: number, lat: number, spanX: number, spanY: number) {
      const key = `${Math.floor(lon / 3)}:${Math.floor(lat / 3)}:${Math.round(spanX / 6)}:${Math.round(spanY / 6)}`;
      if (key === lastKey) return;
      lastKey = key;
      const far = spanY > 65;
      borderMaterials[0].opacity = far ? 0.07 : 0.18;
      borderMaterials[1].opacity = far ? 0.035 : 0.065;
      const local = tiles
        .filter(
          (t) =>
            Math.abs(t.lon - lon) < Math.min(65, spanX * 0.65 + 5) &&
            Math.abs(t.lat - lat) < Math.min(50, spanY * 0.8 + 5),
        )
        .sort(
          (a, b) =>
            Math.hypot(a.lon - lon, a.lat - lat) -
            Math.hypot(b.lon - lon, b.lat - lat),
        )
        .slice(0, far ? 450 : 900);
      props.update(
        local.map((t) => ({
          ...t,
          city: cityPoints.some(
            (c) => Math.hypot(c.lon - t.lon, c.lat - t.lat) < 1.4,
          ),
        })),
      );
    },
    dispose() {
      props.dispose();
      for (const child of [...group.children])
        if (child instanceof THREE.LineSegments) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      group.clear();
    },
  };
}
