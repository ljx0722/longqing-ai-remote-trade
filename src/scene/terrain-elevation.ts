import { mountainStrength, riverDistance } from "./terrain-biomes";

let raster: Uint8Array | null = null;
export function setElevationRaster(data: Uint8Array) {
  if (data.length !== 1024 * 512) throw new Error("地形高程数据大小不正确");
  raster = data;
}
/** Vertical scale is compressed to keep cities and shipping readable. */
export function groundHeight(lon: number, lat: number) {
  if (!raster) {
    const mountain = mountainStrength(lon, lat);
    const rolling =
      (Math.sin(lon * 1.7 + lat * 0.6) * Math.sin(lat * 2.1 - lon * 0.2) + 1) *
      0.025;
    return (
      0.8 +
      (mountain * mountain * 0.75 + rolling) *
        Math.min(1, riverDistance(lon, lat) * 1.8)
    );
  }
  const x = (((lon + 180) / 360) * 1024 + 1024) % 1024,
    y = Math.max(0, Math.min(511, ((90 - lat) / 180) * 512));
  const ix = Math.floor(x),
    iy = Math.floor(y),
    fx = x - ix,
    fy = y - iy;
  const a = raster[iy * 1024 + ix],
    b = raster[iy * 1024 + ((ix + 1) % 1024)];
  const c = raster[Math.min(511, iy + 1) * 1024 + ix],
    d = raster[Math.min(511, iy + 1) * 1024 + ((ix + 1) % 1024)];
  return (
    0.8 +
    (Math.max(0, (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy - 24) /
      230) *
      3.6
  );
}
