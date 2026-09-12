import * as THREE from "three";
import { deserts, forests } from "./terrain-biomes";
import { rivers } from "./river-courses";
import { groundHeight } from "./terrain-elevation";

export function buildTerrainMaterial() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;
  const sx = canvas.width / 360,
    sy = canvas.height / 180;
  ctx.fillStyle = "#a2ac72";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const zone = (x: number, y: number, w: number, h: number, tint: string) => {
    ctx.save();
    ctx.translate((x + 180) * sx, (90 - y) * sy);
    ctx.scale(w * sx, h * sy);
    const gradient = ctx.createRadialGradient(0, 0, 0.12, 0, 0, 1);
    gradient.addColorStop(0, tint);
    gradient.addColorStop(0.65, tint);
    gradient.addColorStop(1, tint + "00");
    ctx.fillStyle = gradient;
    ctx.fillRect(-1, -1, 2, 2);
    ctx.restore();
  };
  for (const [x, y, w, h] of forests) zone(x, y, w, h, "#688451");
  for (const [x, y, w, h] of deserts) zone(x, y, w, h, "#c7ad79");
  const pole = ctx.createLinearGradient(0, 0, 0, canvas.height);
  pole.addColorStop(0, "#e4e7d9");
  pole.addColorStop(0.1, "#d5dbbd");
  pole.addColorStop(0.17, "#aebd9d00");
  pole.addColorStop(0.86, "#aebd9d00");
  pole.addColorStop(0.96, "#dde5d3");
  pole.addColorStop(1, "#f4f3df");
  ctx.fillStyle = pole;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const river of rivers) {
    ctx.beginPath();
    river.forEach(([lon, lat], i) =>
      i
        ? ctx.lineTo((lon + 180) * sx, (90 - lat) * sy)
        : ctx.moveTo((lon + 180) * sx, (90 - lat) * sy),
    );
    ctx.strokeStyle = "#84925a";
    ctx.lineWidth = sx * 0.9;
    ctx.stroke();
    ctx.strokeStyle = "#738e53";
    ctx.lineWidth = sx * 0.43;
    ctx.stroke();
  }
  // Fine deterministic pigment variation removes flat colour plates, with no asset requests.
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let seed = 1709;
  for (let y = 0; y < canvas.height; y++)
    for (let x = 0; x < canvas.width; x++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const noise =
        (seed / 4294967296 - 0.5) * 12 +
        Math.sin(x * 0.27 + y * 0.41) * 2.4 +
        Math.sin(x * 0.09 - y * 0.17) * 2;
      const i = (y * canvas.width + x) * 4;
      const relief =
        groundHeight(
          (x / canvas.width) * 360 - 180,
          90 - (y / canvas.height) * 180,
        ) - 0.8;
      const rock = Math.max(0, Math.min(0.72, (relief - 0.3) * 0.6));
      const snow = Math.max(0, Math.min(0.92, (relief - 1.5) * 0.8));
      for (let c = 0; c < 3; c++)
        pixels.data[i + c] = Math.max(
          0,
          Math.min(
            255,
            (pixels.data[i + c] * (1 - rock) + [148, 145, 126][c] * rock) *
              (1 - snow) +
              [227, 229, 215][c] * snow +
              noise,
          ),
        );
    }
  ctx.putImageData(pixels, 0, 0);
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 4;
  const grain = document.createElement("canvas");
  grain.width = grain.height = 256;
  const gc = grain.getContext("2d")!,
    image = gc.createImageData(256, 256);
  for (let y = 0; y < 256; y++)
    for (let x = 0; x < 256; x++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const value =
        128 +
        (seed / 4294967296 - 0.5) * 58 +
        Math.sin(x * 0.13 + y * 0.18) * 18;
      image.data.set([value, value, value, 255], (y * 256 + x) * 4);
    }
  gc.putImageData(image, 0, 0);
  const bump = new THREE.CanvasTexture(grain);
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
  bump.repeat.set(80, 40);
  return new THREE.MeshStandardMaterial({
    map,
    bumpMap: bump,
    bumpScale: 0.065,
    roughness: 1,
    color: 0xffffff,
  });
}

/** Subdivide geographic polygons before sampling relief, retaining their original shore. */
export function buildReliefGeometry(shape: THREE.Shape) {
  const base = new THREE.ShapeGeometry(shape),
    p = base.getAttribute("position"),
    index = base.index!;
  const positions: number[] = [],
    normals: number[] = [],
    uvs: number[] = [];
  type Point = [number, number];
  const vertex = (v: Point) => {
    const h = groundHeight(v[0], v[1]),
      e = 0.06;
    const dx =
      (groundHeight(v[0] + e, v[1]) - groundHeight(v[0] - e, v[1])) / (e * 2);
    const dz =
      (groundHeight(v[0], v[1] + e) - groundHeight(v[0], v[1] - e)) / (e * 2);
    const length = Math.hypot(dx, 1, dz);
    positions.push(v[0], h, -v[1]);
    normals.push(-dx / length, 1 / length, dz / length);
    uvs.push((v[0] + 180) / 360, (v[1] + 90) / 180);
  };
  const distance = (a: Point, b: Point) =>
    (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
  const triangle = (a: Point, b: Point, c: Point, depth: number) => {
    const ab = distance(a, b),
      bc = distance(b, c),
      ca = distance(c, a);
    if (Math.max(ab, bc, ca) > 1.1 ** 2 && depth < 20) {
      if (bc > ab && bc >= ca) {
        const old = a;
        a = b;
        b = c;
        c = old;
      } else if (ca > ab && ca > bc) {
        const old = a;
        a = c;
        c = b;
        b = old;
      }
      const mid: Point = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      triangle(a, mid, c, depth + 1);
      triangle(mid, b, c, depth + 1);
    } else {
      vertex(a);
      vertex(b);
      vertex(c);
    }
  };
  for (let i = 0; i < index.count; i += 3) {
    const a = index.getX(i),
      b = index.getX(i + 1),
      c = index.getX(i + 2);
    triangle(
      [p.getX(a), p.getY(a)],
      [p.getX(b), p.getY(b)],
      [p.getX(c), p.getY(c)],
      0,
    );
  }
  base.dispose();
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  return geometry;
}
