// src/scene/hex-topology.ts
var HEX_RADIUS = 1.5;
function hexCenter(q, r) {
  return {
    lon: Math.sqrt(3) * HEX_RADIUS * (q + r / 2),
    lat: 1.5 * HEX_RADIUS * r
  };
}
function hexCorner(lon, lat, corner) {
  const angle = (30 + 60 * corner) * Math.PI / 180;
  return {
    lon: lon + Math.cos(angle) * HEX_RADIUS,
    lat: lat + Math.sin(angle) * HEX_RADIUS
  };
}
function hexAt(lon, lat) {
  const q = (Math.sqrt(3) / 3 * lon - lat / 3) / HEX_RADIUS;
  const r = 2 / 3 * lat / HEX_RADIUS;
  const s = -q - r;
  let rq = Math.round(q), rr = Math.round(r), rs = Math.round(s);
  const dq = Math.abs(rq - q), dr = Math.abs(rr - r), ds = Math.abs(rs - s);
  if (dq > dr && dq > ds) rq = -rr - rs;
  else if (dr > ds) rr = -rq - rs;
  return { q: rq, r: rr, ...hexCenter(rq, rr) };
}

// src/scene/river-courses.ts
var rivers = [
  [
    [31.1, 31.4],
    [31.2, 30],
    [31, 28],
    [32.6, 25.7],
    [32.9, 24],
    [31.4, 21],
    [32.5, 15.6],
    [31.5, 12.2],
    [31.7, 9]
  ],
  [
    [48.6, 29.7],
    [47.8, 31],
    [46.6, 32],
    [44.4, 33.3],
    [43.2, 35],
    [43.1, 36.4],
    [41.2, 37.5]
  ],
  [
    [47.8, 31],
    [45.8, 31.4],
    [44.4, 32.4],
    [42.3, 34.5],
    [40.1, 35.3],
    [38.2, 36.5]
  ],
  [
    [121.8, 31.5],
    [120.5, 31.9],
    [119.5, 32.2],
    [118.8, 32],
    [116.7, 29.9],
    [114.3, 30.6],
    [111.3, 30.7],
    [108.4, 30.8],
    [106.6, 29.6],
    [104.6, 28.8]
  ],
  [
    [118.6, 37.9],
    [117.1, 36.7],
    [114.9, 35.1],
    [112.6, 34.8],
    [110.3, 34.7],
    [110.7, 39.2],
    [106.9, 40.8],
    [106.3, 38.4],
    [103.8, 36.1]
  ],
  [
    [113.7, 22.6],
    [113.2, 23.1],
    [111.7, 23.5],
    [110.3, 23.5],
    [108.4, 23.8]
  ],
  [
    [90.6, 21.7],
    [90.5, 23],
    [89.5, 24],
    [87, 25.1],
    [85.1, 25.6],
    [82.9, 25.3],
    [80.4, 26.4],
    [78.3, 29.4]
  ],
  [
    [67.5, 24],
    [68, 25],
    [69, 27.3],
    [70.6, 29.1],
    [71.5, 31.1],
    [72.6, 33]
  ],
  [
    [106.4, 10],
    [105.1, 11.5],
    [105.9, 13.5],
    [105.8, 15.4],
    [104.5, 17.4],
    [102.6, 18],
    [102.1, 19.9],
    [100.1, 22.1]
  ],
  [
    [95.3, 16],
    [95.2, 18],
    [94.9, 21.2],
    [96, 21.8],
    [96.1, 24]
  ],
  [
    [100.6, 13.4],
    [100.5, 13.8],
    [100.6, 14.4],
    [100.2, 15.6]
  ],
  [
    [29.7, 45.2],
    [27.6, 44.2],
    [25.2, 43.7],
    [22.6, 44.7],
    [20.4, 44.8],
    [19, 47.5],
    [16.4, 48.2],
    [13.4, 48.6],
    [10, 48.4]
  ],
  [
    [4.1, 51.9],
    [6.2, 51.8],
    [6.9, 50.9],
    [7.6, 50.3],
    [8.3, 49],
    [7.7, 48.6],
    [7.6, 47.6]
  ],
  [
    [0.1, 49.5],
    [1, 49.4],
    [2.3, 48.9],
    [3.3, 48.4]
  ],
  [
    [1, 51.5],
    [0.1, 51.5],
    [-0.7, 51.5],
    [-1.3, 51.75]
  ],
  [
    [48.3, 46],
    [44.5, 48.7],
    [48, 52.3],
    [49.1, 55.8],
    [44, 56.3],
    [38.5, 57.7]
  ],
  [
    [32.2, 46.5],
    [35.1, 47.8],
    [34.8, 49.1],
    [30.5, 50.5],
    [30.3, 52.5]
  ],
  [
    [-49.4, -0.6],
    [-52, -1.7],
    [-55, -2],
    [-60, -3.2],
    [-64, -3.5],
    [-68, -3.7],
    [-71, -4],
    [-74, -4.4]
  ],
  [
    [12.4, -6],
    [15.3, -4.3],
    [17.7, -0.5],
    [19.5, 1.5],
    [23, 1.7],
    [25, 0.5],
    [26, -3]
  ],
  [
    [5.5, 5.8],
    [6.8, 7.7],
    [6.3, 10.2],
    [2.1, 13.6],
    [-0.1, 16.3],
    [-3, 16.8],
    [-4.5, 14],
    [-8, 12.6]
  ],
  [
    [36.8, -18.6],
    [33.6, -16.4],
    [30, -15.7],
    [26, -17.9],
    [24.4, -16.2],
    [23.6, -13.2]
  ],
  [
    [-89.3, 29.1],
    [-91.2, 30.5],
    [-91.1, 32.3],
    [-90.2, 35.1],
    [-89.5, 37],
    [-90.2, 38.6],
    [-91.1, 40.6],
    [-93.3, 44.9]
  ],
  [
    [-58.3, -34.6],
    [-59.8, -32.7],
    [-60.7, -31.6],
    [-59.6, -29.2],
    [-58.8, -27.5],
    [-57.6, -25.3]
  ],
  [
    [-69, 48.1],
    [-71.2, 46.8],
    [-73.6, 45.5],
    [-75.7, 44.5],
    [-77, 44.1]
  ]
];

// src/scene/terrain-biomes.ts
var deserts = [
  [12, 23, 33, 12],
  [46, 24, 17, 10],
  [65, 37, 12, 8],
  [96, 42, 17, 8],
  [134, -26, 20, 10],
  [19, -25, 7, 11],
  [-112, 31, 10, 9],
  [-70, -23, 4, 10]
];
var forests = [
  [-61, -4, 19, 11],
  [22, 0, 14, 9],
  [105, 9, 17, 16],
  [-119, 51, 10, 14],
  [-78, 44, 13, 13],
  [17, 52, 15, 11],
  [80, 58, 49, 10],
  [138, 38, 5, 11],
  [145, -6, 10, 4]
];
var ranges = [
  [
    [-6, 31],
    [3, 35],
    [9, 36]
  ],
  [
    [-6, 43],
    [3, 43]
  ],
  [
    [6, 45],
    [10, 47],
    [16, 47]
  ],
  [
    [40, 42],
    [48, 43]
  ],
  [
    [68, 36],
    [75, 34],
    [83, 29],
    [92, 29],
    [98, 27]
  ],
  [
    [-128, 57],
    [-119, 48],
    [-111, 39],
    [-104, 25]
  ],
  [
    [-74, 7],
    [-77, -6],
    [-69, -24],
    [-72, -43]
  ],
  [
    [36, 13],
    [40, 7]
  ],
  [
    [28, -29],
    [31, -25]
  ],
  [
    [101, 26],
    [106, 30],
    [111, 33]
  ],
  [
    [138, 34],
    [141, 41]
  ]
];
function segmentDistance(x, y, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const t = Math.max(
    0,
    Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy || 1))
  );
  return Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy);
}
function riverDistance(lon, lat) {
  let distance = 1e3;
  for (const river of rivers)
    for (let i = 1; i < river.length; i++) {
      const a = river[i - 1], b = river[i];
      if (lon < Math.min(a[0], b[0]) - 3 || lon > Math.max(a[0], b[0]) + 3 || lat < Math.min(a[1], b[1]) - 3 || lat > Math.max(a[1], b[1]) + 3)
        continue;
      distance = Math.min(distance, segmentDistance(lon, lat, a, b));
    }
  return distance;
}
function zoneStrength(lon, lat, zones) {
  let value = 0;
  for (const [x, y, w, h] of zones)
    value = Math.max(value, 1 - Math.hypot((lon - x) / w, (lat - y) / h));
  return Math.max(0, value);
}
function mountainStrength(lon, lat) {
  let d = 1e3;
  for (const range of ranges)
    for (let i = 1; i < range.length; i++)
      d = Math.min(d, segmentDistance(lon, lat, range[i - 1], range[i]));
  return Math.max(0, 1 - d / 1.7);
}
function terrainKind(lon, lat) {
  if (Math.abs(lat) > 67) return "tundra";
  if (mountainStrength(lon, lat) > 0.23) return "mountain";
  if (riverDistance(lon, lat) < 0.65) return "river";
  if (zoneStrength(lon, lat, deserts) > 0.13) return "desert";
  if (zoneStrength(lon, lat, forests) > 0.17) return "forest";
  return "grass";
}

// src/scene/terrain-elevation.ts
var raster = null;
function setElevationRaster(data) {
  if (data.length !== 1024 * 512) throw new Error("\u5730\u5F62\u9AD8\u7A0B\u6570\u636E\u5927\u5C0F\u4E0D\u6B63\u786E");
  raster = data;
}
function groundHeight(lon, lat) {
  if (!raster) {
    const mountain = mountainStrength(lon, lat);
    const rolling = (Math.sin(lon * 1.7 + lat * 0.6) * Math.sin(lat * 2.1 - lon * 0.2) + 1) * 0.025;
    return 0.8 + (mountain * mountain * 0.75 + rolling) * Math.min(1, riverDistance(lon, lat) * 1.8);
  }
  const x = ((lon + 180) / 360 * 1024 + 1024) % 1024, y = Math.max(0, Math.min(511, (90 - lat) / 180 * 512));
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
  const a = raster[iy * 1024 + ix], b = raster[iy * 1024 + (ix + 1) % 1024];
  const c = raster[Math.min(511, iy + 1) * 1024 + ix], d = raster[Math.min(511, iy + 1) * 1024 + (ix + 1) % 1024];
  return 0.8 + Math.max(0, (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy - 24) / 230 * 3.6;
}

// src/scene/terrain-surface.ts
import * as THREE from "three";
function buildTerrainMaterial() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  const sx = canvas.width / 360, sy = canvas.height / 180;
  ctx.fillStyle = "#a2ac72";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const zone = (x, y, w, h, tint) => {
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
    river.forEach(
      ([lon, lat], i) => i ? ctx.lineTo((lon + 180) * sx, (90 - lat) * sy) : ctx.moveTo((lon + 180) * sx, (90 - lat) * sy)
    );
    ctx.strokeStyle = "#84925a";
    ctx.lineWidth = sx * 0.9;
    ctx.stroke();
    ctx.strokeStyle = "#738e53";
    ctx.lineWidth = sx * 0.43;
    ctx.stroke();
  }
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let seed = 1709;
  for (let y = 0; y < canvas.height; y++)
    for (let x = 0; x < canvas.width; x++) {
      seed = Math.imul(seed, 1664525) + 1013904223 >>> 0;
      const noise = (seed / 4294967296 - 0.5) * 12 + Math.sin(x * 0.27 + y * 0.41) * 2.4 + Math.sin(x * 0.09 - y * 0.17) * 2;
      const i = (y * canvas.width + x) * 4;
      const relief = groundHeight(
        x / canvas.width * 360 - 180,
        90 - y / canvas.height * 180
      ) - 0.8;
      const rock = Math.max(0, Math.min(0.72, (relief - 0.3) * 0.6));
      const snow = Math.max(0, Math.min(0.92, (relief - 1.5) * 0.8));
      for (let c = 0; c < 3; c++)
        pixels.data[i + c] = Math.max(
          0,
          Math.min(
            255,
            (pixels.data[i + c] * (1 - rock) + [148, 145, 126][c] * rock) * (1 - snow) + [227, 229, 215][c] * snow + noise
          )
        );
    }
  ctx.putImageData(pixels, 0, 0);
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 4;
  const grain = document.createElement("canvas");
  grain.width = grain.height = 256;
  const gc = grain.getContext("2d"), image = gc.createImageData(256, 256);
  for (let y = 0; y < 256; y++)
    for (let x = 0; x < 256; x++) {
      seed = Math.imul(seed, 1664525) + 1013904223 >>> 0;
      const value = 128 + (seed / 4294967296 - 0.5) * 58 + Math.sin(x * 0.13 + y * 0.18) * 18;
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
    color: 16777215
  });
}
function buildReliefGeometry(shape) {
  const base = new THREE.ShapeGeometry(shape), p = base.getAttribute("position"), index = base.index;
  const positions = [], normals = [], uvs = [];
  const vertex = (v) => {
    const h = groundHeight(v[0], v[1]), e = 0.06;
    const dx = (groundHeight(v[0] + e, v[1]) - groundHeight(v[0] - e, v[1])) / (e * 2);
    const dz = (groundHeight(v[0], v[1] + e) - groundHeight(v[0], v[1] - e)) / (e * 2);
    const length = Math.hypot(dx, 1, dz);
    positions.push(v[0], h, -v[1]);
    normals.push(-dx / length, 1 / length, dz / length);
    uvs.push((v[0] + 180) / 360, (v[1] + 90) / 180);
  };
  const distance = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
  const triangle = (a, b, c, depth) => {
    const ab = distance(a, b), bc = distance(b, c), ca = distance(c, a);
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
      const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      triangle(a, mid, c, depth + 1);
      triangle(mid, b, c, depth + 1);
    } else {
      vertex(a);
      vertex(b);
      vertex(c);
    }
  };
  for (let i = 0; i < index.count; i += 3) {
    const a = index.getX(i), b = index.getX(i + 1), c = index.getX(i + 2);
    triangle(
      [p.getX(a), p.getY(a)],
      [p.getX(b), p.getY(b)],
      [p.getX(c), p.getY(c)],
      0
    );
  }
  base.dispose();
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  return geometry;
}
export {
  HEX_RADIUS,
  buildReliefGeometry,
  buildTerrainMaterial,
  deserts,
  forests,
  groundHeight,
  hexAt,
  hexCenter,
  hexCorner,
  mountainStrength,
  riverDistance,
  setElevationRaster,
  terrainKind,
  zoneStrength
};
