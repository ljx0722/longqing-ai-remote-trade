import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

export type HarborLandmark = {
  id: string;
  name: string;
  position: THREE.Vector3;
};
export type HarborScene = {
  group: THREE.Group;
  landmarks: HarborLandmark[];
  flagship: THREE.Group;
  update: (time: number, voyage: number | null) => void;
  dispose: () => void;
};

const color = {
  plaster: 0xe5d7ad,
  plasterShade: 0xc8bb94,
  roof: 0x846b50,
  roofLight: 0xa0875b,
  stone: 0xb5b59c,
  stoneLight: 0xd0ccb3,
  timber: 0x5a5039,
  dark: 0x39483d,
  cloth: 0xe7ddba,
  rust: 0xb57c56,
  sage: 0x75866c,
  gold: 0xc6ab63,
};

function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
export function coast(x: number) {
  return 1.5 + Math.sin(x * 0.035) * 5 + Math.sin(x * 0.14) * 1.2;
}
function riverX(z: number) {
  return -54 + Math.sin(z * 0.035) * 7;
}
function heightAt(x: number, z: number) {
  const shore = coast(x) - z;
  if (shore < -2) return -1.6;
  const river = Math.abs(x - riverX(z));
  if (river < 3.7 && z < 10) return -1.1;
  const shoreHeight = THREE.MathUtils.smoothstep(shore, -2, 3) * 1.35 - 0.5;
  if (z > -62) return shoreHeight;
  const hill =
    Math.max(0, Math.sin(x * 0.037 + 1) * Math.cos(z * 0.031) + 0.2) * 15;
  return shoreHeight + THREE.MathUtils.smoothstep(-z, 62, 110) * hill;
}

/** Static meshes share materials and are merged to keep mobile draw calls low. */
class Builder {
  buckets = new Map<number, THREE.BufferGeometry[]>();
  matrix = new THREE.Matrix4();
  add(
    geometry: THREE.BufferGeometry,
    tint: number,
    x: number,
    y: number,
    z: number,
    rx = 0,
    ry = 0,
    rz = 0,
  ) {
    const quaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(rx, ry, rz),
    );
    geometry.applyMatrix4(
      this.matrix.compose(
        new THREE.Vector3(x, y, z),
        quaternion,
        new THREE.Vector3(1, 1, 1),
      ),
    );
    // A uniform attribute layout allows cylinders, boxes and custom roofs to merge.
    geometry.deleteAttribute("uv");
    const flat = geometry.index ? geometry.toNonIndexed() : geometry;
    if (flat !== geometry) geometry.dispose();
    const bucket = this.buckets.get(tint) ?? [];
    bucket.push(flat);
    this.buckets.set(tint, bucket);
  }
  box(
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
    tint: number,
    ry = 0,
  ) {
    this.add(new THREE.BoxGeometry(w, h, d), tint, x, y, z, 0, ry);
  }
  cylinder(
    x: number,
    y: number,
    z: number,
    rt: number,
    rb: number,
    h: number,
    tint: number,
    sides = 8,
  ) {
    this.add(new THREE.CylinderGeometry(rt, rb, h, sides), tint, x, y, z);
  }
  beam(a: THREE.Vector3, b: THREE.Vector3, radius: number, tint: number) {
    const delta = b.clone().sub(a),
      mid = a.clone().add(b).multiplyScalar(0.5);
    const geometry = new THREE.CylinderGeometry(
      radius,
      radius,
      delta.length(),
      5,
    );
    geometry.applyQuaternion(
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        delta.normalize(),
      ),
    );
    this.add(geometry, tint, mid.x, mid.y, mid.z);
  }
  finish(group: THREE.Group) {
    for (const [tint, geometries] of this.buckets) {
      const merged = mergeGeometries(geometries, false);
      geometries.forEach((g) => g.dispose());
      if (!merged) continue;
      const mesh = new THREE.Mesh(
        merged,
        new THREE.MeshStandardMaterial({
          color: tint,
          roughness: 0.94,
          flatShading: true,
        }),
      );
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
    }
    this.buckets.clear();
  }
}

function roofGeometry(w: number, d: number, h: number) {
  const g = new THREE.BufferGeometry();
  const a = [-w / 2, 0, -d / 2],
    b = [w / 2, 0, -d / 2],
    c = [0, h, -d / 2];
  const e = [-w / 2, 0, d / 2],
    f = [w / 2, 0, d / 2],
    k = [0, h, d / 2];
  g.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      [
        ...a,
        ...c,
        ...b,
        ...f,
        ...k,
        ...e,
        ...a,
        ...k,
        ...c,
        ...a,
        ...e,
        ...k,
        ...c,
        ...f,
        ...b,
        ...c,
        ...k,
        ...f,
      ],
      3,
    ),
  );
  g.computeVertexNormals();
  return g;
}

function house(
  b: Builder,
  x: number,
  z: number,
  w: number,
  d: number,
  h: number,
  variant: number,
  flatRoof: boolean,
) {
  const y = 0.85,
    roofColor = variant % 3 === 0 ? color.roofLight : color.roof;
  b.box(
    x,
    y + h / 2,
    z,
    w,
    h,
    d,
    variant % 3 === 1 ? color.plasterShade : color.plaster,
  );
  b.box(x, y + 0.15, z, w + 0.2, 0.3, d + 0.2, color.stone);
  if (flatRoof) {
    b.box(x, y + h + 0.12, z, w + 0.35, 0.25, d + 0.35, color.stoneLight);
    b.box(x - w / 2, y + h + 0.4, z, 0.22, 0.55, d, color.plasterShade);
    b.box(x + w / 2, y + h + 0.4, z, 0.22, 0.55, d, color.plasterShade);
    b.box(x, y + h + 0.4, z - d / 2, w, 0.55, 0.22, color.plasterShade);
    b.box(x + w * 0.2, y + h + 0.42, z, w * 0.35, 0.6, d * 0.35, color.plaster);
  } else {
    b.add(roofGeometry(w + 0.55, d + 0.6, w * 0.37), roofColor, x, y + h, z);
    b.box(x, y + h + w * 0.37, z, 0.18, 0.16, d + 0.7, color.timber);
    // Exposed roof rafters, lintels and wall timbers give buildings a useful silhouette.
    b.box(x, y + h - 0.08, z + d / 2 + 0.035, w, 0.16, 0.12, color.timber);
    for (const side of [-1, 1])
      b.box(
        x + side * (w / 2 - 0.1),
        y + h / 2,
        z + d / 2 + 0.04,
        0.12,
        h,
        0.13,
        color.timber,
      );
  }
  b.box(x, y + 0.85, z + d / 2 + 0.035, 0.75, 1.65, 0.08, color.dark);
  b.box(x, y + 1.74, z + d / 2 + 0.12, 1.02, 0.13, 0.35, color.timber);
  for (const side of [-1, 1]) {
    b.box(
      x + side * w * 0.3,
      y + h * 0.65,
      z + d / 2 + 0.03,
      0.54,
      0.7,
      0.07,
      color.dark,
    );
    b.box(
      x + side * w * 0.3,
      y + h * 0.65 - 0.38,
      z + d / 2 + 0.1,
      0.7,
      0.1,
      0.28,
      color.stoneLight,
    );
  }
  if (variant % 4 === 0) {
    b.box(x, y + 2.25, z + d / 2 + 1.05, w * 0.85, 0.12, 2.1, color.sage);
    for (const side of [-1, 1])
      b.cylinder(
        x + side * w * 0.38,
        y + 1.1,
        z + d / 2 + 1.9,
        0.065,
        0.065,
        2.2,
        color.timber,
        5,
      );
  }
}

function tree(b: Builder, x: number, z: number, size: number, kind: number) {
  const y = heightAt(x, z);
  if (y < 0.45) return;
  b.cylinder(x, y + size * 0.5, z, 0.11 * size, 0.14 * size, size, 0x665d42, 5);
  const shades = [0x697e52, 0x7b8d5d, 0x899662, 0x536f4e, 0x708a60];
  const tint = shades[kind % shades.length];
  if (kind % 3 === 0) {
    b.add(
      new THREE.ConeGeometry(size * 0.55, size * 1.75, 6),
      tint,
      x,
      y + size * 1.4,
      z,
    );
    b.add(
      new THREE.ConeGeometry(size * 0.42, size * 1.35, 6),
      tint,
      x,
      y + size * 2.0,
      z,
    );
  } else {
    b.add(
      new THREE.IcosahedronGeometry(size * 0.75, 0),
      tint,
      x,
      y + size * 1.6,
      z,
    );
    b.add(
      new THREE.IcosahedronGeometry(size * 0.53, 0),
      shades[(kind + 1) % 5],
      x + size * 0.35,
      y + size * 1.9,
      z - size * 0.2,
    );
  }
}

function road(b: Builder, points: number[][], width = 2.1) {
  for (let i = 1; i < points.length; i++) {
    const [x1, z1] = points[i - 1],
      [x2, z2] = points[i];
    const len = Math.hypot(x2 - x1, z2 - z1);
    b.box(
      (x1 + x2) / 2,
      0.91,
      (z1 + z2) / 2,
      width,
      0.075,
      len + 0.2,
      0xb8b28b,
      Math.atan2(x2 - x1, z2 - z1),
    );
  }
}

function terrain() {
  const g = new THREE.BufferGeometry(),
    vertices: number[] = [],
    colors: number[] = [];
  const rng = seeded(7137),
    tint = new THREE.Color();
  const step = 3,
    n = 110;
  for (let iz = 0; iz < n; iz++)
    for (let ix = 0; ix < n; ix++) {
      const x = (ix - n / 2) * step,
        z = (iz - n / 2) * step;
      const points = [
        [x, z],
        [x, z + step],
        [x + step, z],
        [x + step, z],
        [x, z + step],
        [x + step, z + step],
      ];
      for (let tri = 0; tri < 2; tri++) {
        const tz = z + step / 2,
          tx = x + step / 2,
          h = heightAt(tx, tz);
        const isShore = coast(tx) - tz < 3 || Math.abs(tx - riverX(tz)) < 6;
        tint.setHex(
          h < 0 ? 0x729b8c : isShore ? 0xc5bf92 : h > 4 ? 0x7f916a : 0x9da97b,
        );
        tint.multiplyScalar(0.96 + rng() * 0.09);
        for (const [vx, vz] of points.slice(tri * 3, tri * 3 + 3)) {
          vertices.push(vx, heightAt(vx, vz), vz);
          colors.push(tint.r, tint.g, tint.b);
        }
      }
    }
  g.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  g.computeVertexNormals();
  const mesh = new THREE.Mesh(
    g,
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 1,
      flatShading: true,
    }),
  );
  mesh.receiveShadow = true;
  return mesh;
}

function sail(width: number, height: number, tint: number, triangular = false) {
  const geometry = new THREE.PlaneGeometry(width, height, 8, 6),
    pos = geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const u = pos.getX(i) / width + 0.5,
      v = pos.getY(i) / height + 0.5;
    pos.setZ(i, Math.sin(u * Math.PI) * Math.sin(v * Math.PI) * width * 0.17);
    if (triangular) pos.setX(i, pos.getX(i) * (1 - v * 0.95));
  }
  geometry.computeVertexNormals();
  return new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      color: tint,
      roughness: 0.9,
      side: THREE.DoubleSide,
    }),
  );
}

export function createMerchantShip(scale = 1, ancient = true) {
  const group = new THREE.Group(),
    b = new Builder();
  const geometry = new THREE.BufferGeometry(),
    positions: number[] = [];
  const rings = [
    [-4.9, 0.12, 1.1],
    [-3.7, 1.25, 0.8],
    [-1.8, 1.6, 0.75],
    [1.8, 1.6, 0.8],
    [3.6, 1.12, 1.1],
    [4.3, 0.15, 1.65],
  ];
  for (let i = 1; i < rings.length; i++) {
    const [za, wa, ya] = rings[i - 1],
      [zb, wb, yb] = rings[i];
    for (const side of [-1, 1]) {
      const a = [wa * side, ya, za],
        c = [wb * side, yb, zb],
        d = [wb * 0.52 * side, -0.1, zb],
        e = [wa * 0.52 * side, -0.1, za];
      if (side < 0) positions.push(...a, ...e, ...c, ...e, ...d, ...c);
      else positions.push(...a, ...c, ...e, ...e, ...c, ...d);
    }
    positions.push(
      -wa,
      ya,
      za,
      -wb,
      yb,
      zb,
      wa,
      ya,
      za,
      wa,
      ya,
      za,
      -wb,
      yb,
      zb,
      wb,
      yb,
      zb,
    );
  }
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.computeVertexNormals();
  b.add(geometry, 0x73513b, 0, 0.2, 0);
  for (let i = 1; i < rings.length; i++)
    for (const side of [-1, 1]) {
      const [za, wa, ya] = rings[i - 1],
        [zb, wb, yb] = rings[i];
      b.beam(
        new THREE.Vector3(wa * side, ya + 0.4, za),
        new THREE.Vector3(wb * side, yb + 0.4, zb),
        0.09,
        0xc3aa75,
      );
    }
  for (let z = -3.3; z < 3.4; z += 0.37)
    b.box(0, 1.02, z, 2.55, 0.06, 0.055, 0xa88d5f);
  b.box(0, 1.43, 2.7, 2, 0.6, 1.3, 0x9b7750);
  b.cylinder(0, 4.15, -0.45, 0.1, 0.14, 7, color.timber, 7);
  b.box(0, 7.22, -0.45, 5.8, 0.15, 0.15, color.timber);
  b.beam(
    new THREE.Vector3(0, 1.4, -3.7),
    new THREE.Vector3(0, 2.8, -6),
    0.08,
    color.timber,
  );
  b.box(0.35, 1.6, 1.2, 0.7, 0.7, 0.75, color.rust);
  b.box(-0.55, 1.5, 0.8, 0.65, 0.6, 0.7, color.gold);
  if (!ancient) {
    b.cylinder(0, 3.1, 2.1, 0.06, 0.11, 5, color.timber, 7);
    b.box(0, 5.5, 2.1, 3.4, 0.12, 0.12, color.timber);
    const aft = sail(3.2, 2.7, 0xe5d9af);
    aft.position.set(0, 4.1, 2.12);
    group.add(aft);
  }
  const canvas = sail(5.35, 4.15, color.cloth, ancient);
  canvas.position.set(0, 5.05, -0.43);
  group.add(canvas);
  const ropeMaterial = new THREE.LineBasicMaterial({
    color: 0x655b45,
    transparent: true,
    opacity: 0.85,
  });
  const ropePoints: THREE.Vector3[] = [];
  for (const [x, z] of [
    [-1.4, -1.8],
    [1.4, -1.8],
    [-1.3, 2.3],
    [1.3, 2.3],
    [0, -5.5],
  ])
    ropePoints.push(
      new THREE.Vector3(0, 7.4, -0.45),
      new THREE.Vector3(x, 1.2, z),
    );
  ropePoints.push(
    new THREE.Vector3(-2.65, 7.15, -0.45),
    new THREE.Vector3(-1.4, 1.2, -0.5),
    new THREE.Vector3(2.65, 7.15, -0.45),
    new THREE.Vector3(1.4, 1.2, -0.5),
  );
  group.add(
    new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints(ropePoints),
      ropeMaterial,
    ),
  );
  b.finish(group);
  group.scale.setScalar(scale);
  group.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  return group;
}

export function buildHarbor(portId = "byblos", era = 0): HarborScene {
  const group = new THREE.Group(),
    b = new Builder(),
    rng = seeded(14723);
  const flatRoof =
    ["ur", "dilmun", "memphis", "lothal"].includes(portId) && era < 4;
  group.add(terrain());

  // Main quay and individual finger piers follow the shoreline, with visible masonry courses.
  b.box(0, 0.48, 0.6, 55, 1.35, 12.3, color.stone);
  b.box(0, 1.21, 0.6, 55.5, 0.16, 12.5, color.stoneLight);
  for (let x = -26; x <= 26; x += 2.2) {
    b.box(x, 0.46, 6.76, 2.04, 0.42, 0.1, 0x858d7b);
    b.box(x + 1.1, -0.01, 6.76, 2.04, 0.4, 0.1, 0x959c86);
  }
  for (const [x, length] of [
    [-20, 15],
    [1, 20],
    [23, 13],
  ]) {
    b.box(x, 0.68, 6 + length / 2, 3.6, 0.85, length, color.stone);
    b.box(x, 1.14, 6 + length / 2, 3.8, 0.12, length + 0.1, color.stoneLight);
    for (let z = 8; z < length + 6; z += 3)
      for (const side of [-1, 1]) {
        b.cylinder(x + side * 1.35, 1.42, z, 0.19, 0.24, 0.5, color.timber, 7);
        b.cylinder(x + side * 1.86, 0.12, z, 0.15, 0.19, 2.4, color.timber, 6);
      }
  }
  // A long curved breakwater protects the little roadstead.
  const breakwater = [
    [-28, 0],
    [-31, 8],
    [-32, 17],
    [-27, 24],
    [-22, 26],
  ];
  for (let i = 1; i < breakwater.length; i++) {
    const a = breakwater[i - 1],
      c = breakwater[i];
    b.box(
      (a[0] + c[0]) / 2,
      0.8,
      (a[1] + c[1]) / 2,
      2,
      1.5,
      Math.hypot(c[0] - a[0], c[1] - a[1]) + 1,
      color.stone,
      Math.atan2(c[0] - a[0], c[1] - a[1]),
    );
  }
  road(
    b,
    [
      [0, 4],
      [0, -15],
      [-2, -26],
      [0, -49],
      [5, -69],
    ],
    3.4,
  );
  road(
    b,
    [
      [-35, -10],
      [-21, -13],
      [0, -13],
      [25, -13],
      [43, -23],
      [67, -40],
    ],
    2.5,
  );
  road(
    b,
    [
      [-36, -33],
      [-20, -33],
      [0, -33],
      [24, -33],
    ],
    2.2,
  );
  road(
    b,
    [
      [-22, 0],
      [-22, -47],
      [-33, -65],
    ],
    2.1,
  );
  road(
    b,
    [
      [19, 0],
      [19, -46],
      [26, -58],
    ],
    2.1,
  );
  road(
    b,
    [
      [-3, -24],
      [-45, -24],
      [-66, -24],
      [-84, -40],
    ],
    2.1,
  );

  // Distinct neighborhoods leave open streets and a central public square.
  let houseIndex = 0;
  for (const row of [-42, -34, -23, -6])
    for (const col of [-16, -9, 8, 14]) {
      if ((row === -23 && col === -9) || (row === -34 && col === 8)) continue;
      const w = 3.7 + rng() * 1.3,
        d = 4 + rng() * 1.7,
        h = 2.8 + rng() * 1.8;
      house(b, col, row, w, d, h, houseIndex++, flatRoof);
    }
  for (const [x, z] of [
    [-32, -18],
    [-33, -26],
    [-32, -37],
    [-30, -46],
    [29, -17],
    [29, -26],
    [29, -36],
    [36, -24],
    [37, -34],
    [43, -32],
    [-13, -53],
    [-5, -54],
    [5, -54],
    [13, -53],
  ]) {
    house(
      b,
      x,
      z,
      3.3 + rng() * 1.6,
      4 + rng() * 1.7,
      2.6 + rng() * 2,
      houseIndex++,
      flatRoof,
    );
  }
  // Old city walls: irregular masonry, gate piers and square crenellated towers.
  b.box(-26, 2.1, -30, 0.9, 2.5, 39, color.stone);
  b.box(23, 2.1, -39, 0.9, 2.5, 19, color.stone);
  b.box(-1.5, 2.1, -49, 50, 2.5, 0.9, color.stone);
  for (const [x, z] of [
    [-26, -49],
    [23, -49],
    [-26, -11],
    [23, -29],
  ]) {
    b.box(x, 2.7, z, 3, 3.8, 3, color.stoneLight);
    b.box(x, 4.62, z, 3.5, 0.22, 3.5, color.stone);
    for (const sx of [-1, 0, 1])
      for (const sz of [-1, 1])
        b.box(
          x + sx * 1.16,
          5,
          z + sz * 1.2,
          0.72,
          0.7,
          0.55,
          color.stoneLight,
        );
  }
  for (let x = -24; x < 23; x += 2)
    b.box(x, 3.7, -49, 0.9, 0.6, 1, color.stoneLight);

  // Merchant house and enclosed courtyard.
  house(b, 6, -35, 8, 7, 5.1, 1, flatRoof);
  b.box(6, 1.03, -28, 9.5, 0.22, 5, color.stoneLight);
  for (const x of [2, 4, 6, 8, 10])
    b.cylinder(x, 2.3, -26.1, 0.19, 0.25, 2.4, color.stoneLight);
  b.box(6, 3.6, -26.1, 9.5, 0.3, 1.7, color.stone);
  // Central market: striped canvas awnings, tables, baskets and a well.
  b.box(-8, 0.97, -21, 14, 0.15, 12, 0xbfb896);
  for (const [x, z, shade] of [
    [-13, -25, color.rust],
    [-6, -25, color.sage],
    [-13, -17, color.gold],
    [-6, -17, color.cloth],
  ]) {
    for (const side of [-1, 1])
      for (const end of [-1, 1])
        b.cylinder(
          x + side * 1.85,
          2.25,
          z + end * 1.15,
          0.065,
          0.08,
          2.6,
          color.timber,
          5,
        );
    for (let strip = 0; strip < 6; strip++)
      b.box(
        x - 1.75 + strip * 0.7,
        3.6 + Math.sin((strip / 5) * Math.PI) * 0.16,
        z,
        0.71,
        0.08,
        2.7,
        strip % 2 ? color.cloth : shade,
      );
    b.box(x, 1.5, z, 3.4, 1, 1.35, color.timber);
    for (let j = 0; j < 5; j++)
      b.add(
        new THREE.IcosahedronGeometry(0.24, 0),
        j % 2 ? color.gold : color.rust,
        x - 1.3 + j * 0.65,
        2.15,
        z,
      );
  }
  b.cylinder(-2, 1.3, -19, 0.95, 1, 0.7, color.stone, 10);
  b.cylinder(-2, 1.68, -19, 0.67, 0.67, 0.08, color.dark, 10);
  // Warehouses, cargo and dockside jib crane.
  house(b, 15, -2, 8, 5.5, 4, 2, flatRoof);
  house(b, -13, -2, 9, 5.5, 3.6, 3, flatRoof);
  for (let i = 0; i < 36; i++) {
    const x = -23 + rng() * 46,
      z = 2 + rng() * 3;
    if (Math.abs(x) < 3) continue;
    const s = 0.45 + rng() * 0.55;
    b.box(
      x,
      1.26 + s / 2,
      z,
      s,
      s,
      s,
      i % 3 ? 0x9a825b : 0xc1a574,
      rng() * 0.25,
    );
    b.box(x, 1.27 + s, z, s + 0.02, 0.065, 0.08, color.timber);
  }
  b.cylinder(20, 4.1, 5.3, 0.2, 0.27, 6, color.timber);
  b.beam(
    new THREE.Vector3(20, 6.8, 5.3),
    new THREE.Vector3(15.5, 6.8, 8),
    0.16,
    color.timber,
  );
  b.beam(
    new THREE.Vector3(20, 4.5, 5.3),
    new THREE.Vector3(16.5, 6.7, 7.4),
    0.12,
    color.timber,
  );
  b.cylinder(15.5, 4.8, 8, 0.025, 0.025, 4, color.timber, 4);
  // Dry dock with ribs of a hull under construction.
  b.box(34, 1.03, 1, 12, 0.35, 15, 0xaa9c77);
  for (let z = -4; z < 7; z += 1) {
    b.box(34, 1.35, z, 6.4, 0.28, 0.32, color.timber);
    for (const side of [-1, 1])
      b.beam(
        new THREE.Vector3(34, 1.6, z),
        new THREE.Vector3(34 + side * (2.2 - Math.abs(z - 1) * 0.18), 3.1, z),
        0.12,
        color.roofLight,
      );
  }
  house(b, 37, -10, 6, 4.7, 3, 0, flatRoof);
  // Harbor beacon, built as a fire tower in antiquity.
  b.cylinder(-27, 1.5, 23, 2, 2.4, 2.4, color.stone, 8);
  b.cylinder(-27, 5.2, 23, 1.3, 1.75, 5.5, color.stoneLight, 8);
  b.cylinder(-27, 8.05, 23, 1.65, 1.65, 0.3, color.stone, 8);
  for (const x of [-0.8, 0.8])
    for (const z of [-0.8, 0.8])
      b.cylinder(-27 + x, 8.9, 23 + z, 0.09, 0.1, 1.8, color.timber, 5);
  b.add(
    new THREE.ConeGeometry(1.9, 1.2, 4),
    color.roof,
    -27,
    10,
    23,
    0,
    Math.PI / 4,
  );
  b.cylinder(-27, 8.4, 23, 0.5, 0.45, 0.3, color.rust, 8);

  // Fields, irrigation ditches and tiny outlying farmsteads.
  const fields = [
    [-41, -42, 12, 10],
    [-41, -57, 15, 11],
    [-19, -66, 14, 9],
    [0, -68, 15, 10],
    [21, -66, 12, 11],
    [46, -46, 12, 10],
    [59, -31, 12, 9],
    [-77, -35, 13, 12],
    [-73, -51, 15, 10],
  ];
  fields.forEach(([x, z, w, d], index) => {
    b.box(x, 0.9, z, w, 0.11, d, index % 3 ? 0xadb179 : 0xc7b97c);
    for (let row = -d / 2 + 0.5; row < d / 2; row += 0.65)
      b.box(
        x,
        1.01,
        z + row,
        w - 0.65,
        0.11,
        0.22,
        index % 3 ? 0x919768 : 0xb6a364,
      );
    b.box(x, 0.97, z - d / 2, w + 0.5, 0.2, 0.25, 0x8c997a);
    b.box(x - w / 2, 0.98, z, 0.22, 0.23, d, 0x798b72);
  });
  house(b, -37, -67, 4.2, 4.4, 2.5, 3, flatRoof);
  house(b, 48, -58, 4.6, 4.7, 2.8, 4, flatRoof);
  // Bridge spans the visible river, with timber railings and stone abutments.
  b.box(-57, 1.2, -24, 15, 0.65, 3, color.stone);
  for (const z of [-25.35, -22.65]) {
    b.box(-57, 2, z, 15, 0.17, 0.15, color.timber);
    for (let x = -63; x <= -50; x += 1.6)
      b.box(x, 1.7, z, 0.12, 1, 0.12, color.timber);
  }
  // Woodland clusters break up fields and frame the city without obscuring it.
  for (const [cx, cz, radius, count] of [
    [-83, -75, 22, 70],
    [52, -79, 23, 90],
    [3, -96, 33, 100],
    [-93, -9, 16, 50],
    [69, -5, 19, 60],
    [-35, -88, 16, 45],
  ]) {
    for (let i = 0; i < count; i++) {
      const angle = rng() * Math.PI * 2,
        distance = Math.sqrt(rng()) * radius;
      tree(
        b,
        cx + Math.cos(angle) * distance,
        cz + Math.sin(angle) * distance,
        1.7 + rng() * 1.8,
        Math.floor(rng() * 10),
      );
    }
  }
  for (const [x, z] of [
    [-29, -4],
    [-37, -13],
    [27, -42],
    [34, -44],
    [44, -18],
    [-18, -57],
    [16, -57],
    [-65, -20],
    [-71, -13],
    [52, -13],
  ])
    tree(b, x, z, 2.1 + rng(), Math.floor(rng() * 10));
  // Rounded coastal stones and reeds, keeping the coast visually grounded.
  for (let i = 0; i < 100; i++) {
    const x = -135 + rng() * 270;
    if (x > -34 && x < 44) continue;
    const z = coast(x) + rng() * 3 - 1.5;
    b.add(
      new THREE.IcosahedronGeometry(0.35 + rng() * 0.7, 0),
      i % 2 ? 0x929d88 : 0xb2b69b,
      x,
      0.08,
      z,
    );
  }
  // Small inhabitants emphasize the scale of the docks and streets.
  for (let i = 0; i < 32; i++) {
    const x = i < 16 ? -24 + rng() * 48 : -1 + rng() * 2;
    const z = i < 16 ? 2 + rng() * 3 : -10 - rng() * 32;
    b.cylinder(
      x,
      1.62,
      z,
      0.16,
      0.23,
      0.72,
      [color.rust, color.sage, color.cloth, color.dark][i % 4],
      5,
    );
    b.add(new THREE.IcosahedronGeometry(0.16, 0), 0xcba67e, x, 2.1, z);
  }
  b.finish(group);

  const flagship = createMerchantShip(1.15, era < 4);
  flagship.position.set(8, 0.08, 19);
  flagship.rotation.y = -0.1;
  group.add(flagship);
  const ships: Array<{
    mesh: THREE.Group;
    x: number;
    z: number;
    angle: number;
    moving: boolean;
  }> = [];
  for (const [x, z, s, a, m] of [
    [-14, 13, 0.68, 0, 0],
    [27, 14, 0.76, Math.PI, 0],
    [-8, 38, 0.8, -1.9, 1],
    [47, 41, 0.65, -2.1, 1],
    [-55, 34, 0.6, 1.7, 1],
  ]) {
    const mesh = createMerchantShip(s, era < 4);
    mesh.position.set(x, 0.05, z);
    mesh.rotation.y = a;
    group.add(mesh);
    ships.push({ mesh, x, z, angle: a, moving: !!m });
  }
  const foamMaterial = new THREE.MeshBasicMaterial({
    color: 0xdde7c7,
    transparent: true,
    opacity: 0.26,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const foam = new THREE.Group(),
    foamPieces: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 95; i++) {
    const x = -110 + rng() * 220,
      z = 14 + rng() * 120;
    const strip = new THREE.PlaneGeometry(
      0.8 + rng() * 3.3,
      0.055 + rng() * 0.07,
    );
    strip.rotateZ(-0.12);
    strip.rotateX(-Math.PI / 2);
    strip.translate(x, 0.08, z);
    foamPieces.push(strip);
  }
  foam.add(new THREE.Mesh(mergeGeometries(foamPieces)!, foamMaterial));
  foamPieces.forEach((g) => g.dispose());
  group.add(foam);
  const wakeMaterial = new THREE.MeshBasicMaterial({
    color: 0xdce8cd,
    transparent: true,
    opacity: 0.36,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const wake = new THREE.Group(),
    wakePieces: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 7; i++)
    for (const side of [-1, 1]) {
      const strip = new THREE.PlaneGeometry(2.2 + i * 0.25, 0.12);
      strip.rotateZ(side * 0.4);
      strip.rotateX(-Math.PI / 2);
      strip.translate(side * (0.9 + i * 0.4), 0.1, 4 + i * 1.2);
      wakePieces.push(strip);
    }
  wake.add(new THREE.Mesh(mergeGeometries(wakePieces)!, wakeMaterial));
  wakePieces.forEach((g) => g.dispose());
  flagship.add(wake);
  const birdMaterial = new THREE.LineBasicMaterial({
    color: 0x465e53,
    transparent: true,
    opacity: 0.65,
  });
  const birds: THREE.Line[] = [];
  for (let i = 0; i < 8; i++) {
    const bird = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-0.55, 0.08, 0),
        new THREE.Vector3(0, 0, 0.15),
        new THREE.Vector3(0.55, 0.08, 0),
      ]),
      birdMaterial,
    );
    group.add(bird);
    birds.push(bird);
  }
  const landmarks: HarborLandmark[] = [
    {
      id: "market",
      name: "港口集市",
      position: new THREE.Vector3(-9, 4.5, -20),
    },
    { id: "shipyard", name: "船坞", position: new THREE.Vector3(35, 4, 0) },
    { id: "warehouse", name: "货仓", position: new THREE.Vector3(15, 6.5, -2) },
    { id: "manor", name: "商会宅邸", position: new THREE.Vector3(6, 8, -35) },
    {
      id: "beacon",
      name: "引航灯塔",
      position: new THREE.Vector3(-27, 11, 23),
    },
  ];
  return {
    group,
    landmarks,
    flagship,
    update(time, voyage) {
      if (voyage !== null) {
        const t = THREE.MathUtils.clamp(voyage, 0, 1);
        flagship.position.x = 8 + Math.sin(t * Math.PI) * 30;
        flagship.position.z = 19 + Math.sin(t * Math.PI) * 34;
        flagship.rotation.y = t < 0.5 ? -2.5 : 0.65;
      } else {
        flagship.position.x = 8;
        flagship.position.z = 19;
        flagship.rotation.y = -0.1;
      }
      flagship.position.y = 0.12 + Math.sin(time * 1.4) * 0.07;
      flagship.rotation.z = Math.sin(time * 0.8) * 0.018;
      wake.visible = voyage !== null;
      for (const s of ships) {
        s.mesh.position.y = 0.08 + Math.sin(time * 1.2 + s.x) * 0.06;
        s.mesh.rotation.z = Math.sin(time * 0.7 + s.z) * 0.015;
        if (s.moving) {
          const phase = time * 0.024 + s.x;
          s.mesh.position.x = s.x + Math.sin(phase) * 8;
          s.mesh.position.z = s.z + Math.cos(phase) * 3;
          s.mesh.rotation.y = s.angle + Math.cos(phase) * 0.1;
        }
      }
      foam.position.x = Math.sin(time * 0.1) * 1.1;
      foam.position.z = Math.cos(time * 0.13) * 0.6;
      birds.forEach((bird, i) => {
        const angle = time * 0.06 + i * 0.8;
        bird.position.set(
          Math.cos(angle) * (16 + i * 3),
          17 + (i % 3) * 2,
          -5 + Math.sin(angle) * 18,
        );
        bird.rotation.y = -angle;
        bird.rotation.z = Math.sin(time * 3 + i) * 0.15;
      });
    },
    dispose() {
      const geometries = new Set<THREE.BufferGeometry>(),
        materials = new Set<THREE.Material>();
      group.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.Line) {
          geometries.add(o.geometry);
          for (const m of Array.isArray(o.material) ? o.material : [o.material])
            materials.add(m);
        }
      });
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      group.clear();
    },
  };
}
