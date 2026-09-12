import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { isLandPoint } from "../navigation";
import { groundHeight } from "./terrain-elevation";
import { riverDistance } from "./terrain-biomes";

/** Geographic coordinates and the actual top of the continuous terrain surface. */
export type TileVisual = {
  lon: number;
  lat: number;
  kind:
    | "grass"
    | "forest"
    | "desert"
    | "mountain"
    | "tundra"
    | "coast"
    | "ocean"
    | "river";
  seed: number;
  city?: boolean;
  height?: number;
  radius?: number;
};

type Placement = {
  x: number;
  y: number;
  z: number;
  sx: number;
  sy: number;
  sz: number;
  yaw: number;
  tint: number;
};
type Batch = {
  mesh: THREE.InstancedMesh;
  capacity: number;
  placements: Placement[];
};

function rng(seed: number) {
  let x = (seed | 0) ^ 0x9e3779b9;
  return () => {
    x = Math.imul(x ^ (x >>> 16), 2246822519);
    x = Math.imul(x ^ (x >>> 13), 3266489917);
    return ((x ^= x >>> 16) >>> 0) / 4294967296;
  };
}

function merge(parts: THREE.BufferGeometry[]) {
  const normalized = parts.map((part) =>
    part.index ? part.toNonIndexed() : part.clone(),
  );
  const geometry = mergeGeometries(normalized)!;
  normalized.forEach((part) => part.dispose());
  parts.forEach((part) => part.dispose());
  return geometry;
}

function box(w: number, h: number, d: number, x = 0, y = h / 2, z = 0) {
  return new THREE.BoxGeometry(w, h, d).translate(x, y, z);
}

/** Asymmetric triangulated ridgeline with foothills and two unequal summits. */
function ridgeGeometry() {
  const points: number[] = [];
  const cols = 8,
    rows = 6;
  const height = (x: number, z: number) => {
    const edge =
      Math.max(0, 1 - Math.pow(Math.abs(x) / 0.62, 6)) *
      Math.max(0, 1 - Math.pow(Math.abs(z) / 0.45, 6));
    const peakA = Math.exp(-((x + 0.18) ** 2 * 20 + (z - 0.07) ** 2 * 22));
    const peakB =
      0.76 * Math.exp(-((x - 0.28) ** 2 * 33 + (z + 0.09) ** 2 * 25));
    const ridges = 0.9 + 0.1 * Math.sin(x * 31 + z * 19);
    return Math.max(peakA, peakB) * edge * ridges;
  };
  const vertex = (x: number, z: number) => [x, height(x, z), z];
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++) {
      const x0 = -0.62 + (i / cols) * 1.24,
        x1 = -0.62 + ((i + 1) / cols) * 1.24;
      const z0 = -0.45 + (j / rows) * 0.9,
        z1 = -0.45 + ((j + 1) / rows) * 0.9;
      const a = vertex(x0, z0),
        b = vertex(x1, z0),
        c = vertex(x1, z1),
        d = vertex(x0, z1);
      if ((i + j) % 2) points.push(...a, ...d, ...b, ...b, ...d, ...c);
      else points.push(...a, ...c, ...b, ...a, ...d, ...c);
    }
  const geometry = new THREE.BufferGeometry().setAttribute(
    "position",
    new THREE.Float32BufferAttribute(points, 3),
  );
  geometry.computeVertexNormals();
  return geometry;
}

/** Snow follows the upper mountain faces instead of forming a detached cone. */
function snowGeometry(ridge: THREE.BufferGeometry) {
  const source = ridge.getAttribute("position"),
    vertices: number[] = [],
    snowline = 0.56;
  for (let i = 0; i < source.count; i += 3) {
    const triangle = [0, 1, 2].map((k) =>
      new THREE.Vector3().fromBufferAttribute(source, i + k),
    );
    const clipped: THREE.Vector3[] = [];
    for (let j = 0; j < 3; j++) {
      const a = triangle[j],
        b = triangle[(j + 1) % 3];
      if (a.y >= snowline) clipped.push(a.clone());
      if (a.y >= snowline !== b.y >= snowline)
        clipped.push(a.clone().lerp(b, (snowline - a.y) / (b.y - a.y)));
    }
    for (let j = 1; j + 1 < clipped.length; j++) {
      for (const v of [clipped[0], clipped[j], clipped[j + 1]])
        vertices.push(v.x, v.y + 0.003, v.z);
    }
  }
  const geometry = new THREE.BufferGeometry().setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );
  geometry.computeVertexNormals();
  return geometry;
}

function roofGeometry() {
  // Gable roof and inset doors/shutters share one material and one draw call.
  const a = [-0.17, 0.24, -0.16],
    b = [0.17, 0.24, -0.16],
    c = [0, 0.36, -0.16];
  const d = [-0.17, 0.24, 0.16],
    e = [0.17, 0.24, 0.16],
    f = [0, 0.36, 0.16];
  const geometry = new THREE.BufferGeometry().setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      [
        ...a,
        ...c,
        ...b,
        ...d,
        ...e,
        ...f,
        ...a,
        ...d,
        ...f,
        ...a,
        ...f,
        ...c,
        ...b,
        ...c,
        ...f,
        ...b,
        ...f,
        ...e,
      ],
      3,
    ),
  );
  geometry.computeVertexNormals();
  geometry.setAttribute(
    "uv",
    new THREE.Float32BufferAttribute(new Float32Array(18 * 2), 2),
  );
  return merge([
    geometry,
    box(0.05, 0.12, 0.008, 0, 0.06, 0.145),
    box(0.045, 0.055, 0.008, -0.09, 0.16, 0.145),
    box(0.045, 0.055, 0.008, 0.09, 0.16, 0.145),
  ]);
}

function duneGeometry() {
  const positions: number[] = [];
  const sample = (i: number, j: number) => {
    const x = (i / 10 - 0.5) * 1.1,
      z = (j / 8 - 0.5) * 0.7 * Math.sqrt(Math.max(0, 1 - (x / 0.55) ** 2));
    const crest = 0.035 + Math.sin(x * 4) * 0.055;
    const slope =
      z < crest ? (z + 0.35) / (crest + 0.35) : (0.35 - z) / (0.35 - crest);
    return [
      x,
      Math.max(0, slope) *
        Math.pow(Math.max(0, Math.cos((x / 1.1) * Math.PI)), 1.7) *
        0.2,
      z,
    ];
  };
  for (let i = 0; i < 10; i++)
    for (let j = 0; j < 8; j++) {
      const a = sample(i, j),
        b = sample(i + 1, j),
        c = sample(i + 1, j + 1),
        d = sample(i, j + 1);
      positions.push(...a, ...c, ...b, ...a, ...d, ...c);
    }
  const geometry = new THREE.BufferGeometry().setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.computeVertexNormals();
  return geometry;
}

/** Eleven instance batches supply the visible land tiles without hidden-capacity draws. */
export function buildTileProps() {
  const group = new THREE.Group();
  group.name = "civilization-tile-props";
  const batches: Record<string, Batch> = {};
  // Instance colours multiply this neutral base once, avoiding double-darkened forests.
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.94,
    metalness: 0,
    flatShading: true,
  });
  const add = (name: string, geometry: THREE.BufferGeometry) => {
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    const mesh = new THREE.InstancedMesh(geometry, material, 1);
    mesh.name = `tile-${name}`;
    mesh.count = 0;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.receiveShadow = true;
    group.add(mesh);
    batches[name] = { mesh, capacity: 1, placements: [] };
  };
  add(
    "trunks",
    new THREE.CylinderGeometry(0.025, 0.045, 0.28, 6).translate(0, 0.14, 0),
  );
  add(
    "canopy",
    merge([
      new THREE.IcosahedronGeometry(1, 1)
        .scale(0.15, 0.19, 0.14)
        .translate(-0.07, 0.31, 0),
      new THREE.IcosahedronGeometry(1, 1)
        .scale(0.145, 0.18, 0.16)
        .translate(0.075, 0.33, 0.025),
      new THREE.IcosahedronGeometry(1, 1)
        .scale(0.145, 0.17, 0.14)
        .translate(0, 0.43, -0.035),
    ]),
  );
  add(
    "pine",
    merge([
      new THREE.ConeGeometry(0.185, 0.27, 7).translate(0, 0.25, 0),
      new THREE.ConeGeometry(0.145, 0.28, 7).translate(0, 0.37, 0),
      new THREE.ConeGeometry(0.098, 0.25, 7).translate(0, 0.48, 0),
    ]),
  );
  const ridge = ridgeGeometry();
  add("mountains", ridge);
  add("snowcaps", snowGeometry(ridge));
  add("dunes", duneGeometry());
  add("field-earth", box(0.53, 0.015, 0.61));
  const cropParts: THREE.BufferGeometry[] = [];
  for (let row = 0; row < 6; row++) {
    cropParts.push(box(0.047, 0.035, 0.56, (row - 2.5) * 0.081, 0.034));
    for (let stem = 0; stem < 7; stem++)
      cropParts.push(
        box(
          0.025,
          0.062,
          0.025,
          (row - 2.5) * 0.081,
          0.053,
          (stem - 3) * 0.074,
        ),
      );
  }
  add("crop-rows", merge(cropParts));
  add(
    "farmhouses",
    merge([box(0.3, 0.24, 0.28), box(0.045, 0.17, 0.055, 0.085, 0.29, -0.05)]),
  );
  add("roofs", roofGeometry());
  const rock = new THREE.DodecahedronGeometry(1, 0);
  const rp = rock.getAttribute("position");
  for (let i = 0; i < rp.count; i++) {
    const x = rp.getX(i),
      y = rp.getY(i),
      z = rp.getZ(i);
    rp.setXYZ(
      i,
      x * (0.88 + 0.1 * Math.sin(y * 13)),
      (y + 0.94) * 0.42,
      z * (0.84 + 0.12 * Math.cos(x * 11)),
    );
  }
  rock.computeBoundingBox();
  rock.translate(0, -rock.boundingBox!.min.y, 0);
  rock.computeVertexNormals();
  add("stones", rock);

  const matrix = new THREE.Matrix4(),
    position = new THREE.Vector3(),
    scale = new THREE.Vector3();
  const rotation = new THREE.Quaternion(),
    axis = new THREE.Vector3(0, 1, 0),
    color = new THREE.Color();
  let disposed = false;

  function update(tiles: TileVisual[]) {
    if (disposed) return;
    for (const batch of Object.values(batches)) batch.placements.length = 0;
    for (const tile of tiles) {
      if (tile.kind === "ocean" || (tile.city && tile.kind !== "mountain"))
        continue;
      const random = rng(tile.seed),
        radius = Math.max(0.1, tile.radius ?? 1);

      const put = (
        name: string,
        dx: number,
        dz: number,
        sx: number,
        sy: number,
        sz: number,
        yaw: number,
        tint: number,
      ) => {
        const x = tile.lon + dx * radius,
          z = -tile.lat + dz * radius;
        if (!isLandPoint({ lon: x, lat: -z }) || riverDistance(x, -z) < 0.16)
          return;
        const footprint = Math.min(0.26, Math.max(sx, sz) * radius * 0.2);
        if (
          ![
            [footprint, 0],
            [-footprint, 0],
            [0, footprint],
            [0, -footprint],
          ].every(([a, b]) => isLandPoint({ lon: x + a, lat: -z + b }))
        )
          return;
        batches[name].placements.push({
          x,
          y: groundHeight(x, -z) + 0.014,
          z,
          sx: sx * radius,
          sy: sy * radius,
          sz: sz * radius,
          yaw,
          tint,
        });
      };
      const tree = (dx: number, dz: number, size: number, pine = false) => {
        const yaw = random() * Math.PI * 2;
        put("trunks", dx, dz, size, size, size, yaw, 0x806448);
        const green = pine
          ? [0x4c7153, 0x597a55, 0x365f4c]
          : [0x63834b, 0x799555, 0x4e7951, 0x899c5a];
        put(
          pine ? "pine" : "canopy",
          dx,
          dz,
          size,
          size,
          size,
          yaw,
          green[Math.floor(random() * green.length)],
        );
      };
      if (tile.kind === "forest") {
        for (let i = 0; i < 15; i++) {
          const angle = random() * Math.PI * 2,
            spread = Math.sqrt(random()) * 0.74;
          tree(
            Math.cos(angle) * spread,
            Math.sin(angle) * spread,
            0.5 + random() * 0.32,
            Math.abs(tile.lat) > 47 || random() < 0.16,
          );
        }
        put("stones", -0.35, 0.35, 0.1, 0.1, 0.14, random() * 6.28, 0x9a9880);
      } else if (tile.kind === "mountain") {
        const yaw = random() * Math.PI * 2,
          h = 0.85 + random() * 0.7;
        put("mountains", -0.03, 0.02, 0.82, h, 0.85, yaw, 0x99998b);
        put("mountains", 0.19, 0.19, 0.48, h * 0.52, 0.5, yaw + 0.28, 0xaaa48e);
        if (Math.abs(tile.lat) > 28 || h > 1.4)
          put("snowcaps", -0.03, 0.02, 0.82, h, 0.85, yaw, 0xf1f1df);
        for (let i = 0; i < 3; i++)
          put(
            "stones",
            (random() - 0.5) * 0.6,
            0.35 + random() * 0.08,
            0.09,
            0.12,
            0.11,
            yaw + i,
            0x8f9381,
          );
      } else if (tile.kind === "desert" && random() > 0.3) {
        const yaw = 0.35 + random() * 0.6;
        put(
          "dunes",
          (random() - 0.5) * 0.5,
          -0.14,
          0.8 + random() * 0.5,
          0.6 + random() * 0.8,
          0.7,
          yaw,
          0xc4ab78,
        );
        if (random() > 0.45)
          put("dunes", 0.14, 0.28, 0.7, 0.75, 0.6, yaw, 0xcbb080);
        if (random() > 0.54) {
          put("stones", -0.3, -0.25, 0.18, 0.16, 0.11, yaw, 0xb09469);
          put("stones", -0.2, -0.2, 0.13, 0.22, 0.11, yaw + 0.2, 0xbda077);
        }
      } else if (tile.kind === "grass" || tile.kind === "river") {
        const farm = tile.kind === "river" || random() > 0.36;
        if (farm) {
          const yaw = ((Math.floor(random() * 3) - 1) * Math.PI) / 3;
          put("field-earth", -0.1, 0.07, 0.9, 1, 0.9, yaw, 0x987652);
          put(
            "crop-rows",
            -0.1,
            0.07,
            0.9,
            1,
            0.9,
            yaw,
            random() > 0.25 ? 0x98b45a : 0xc4bb72,
          );
          put("farmhouses", 0.3, -0.28, 0.68, 0.68, 0.68, yaw, 0xd5c5a0);
          put("roofs", 0.3, -0.28, 0.68, 0.68, 0.68, yaw, 0x94694f);
          tree(-0.32, -0.3, 0.6);
          tree(0.3, 0.3, 0.55);
        } else {
          tree(-0.26, -0.16, 0.76);
          tree(0.16, 0.26, 0.61);
          put("stones", 0.26, -0.3, 0.12, 0.1, 0.16, random() * 6.28, 0xaaa58a);
        }
      } else if (tile.kind === "tundra") {
        if (Math.abs(tile.lat) < 73) {
          tree(-0.19, -0.06, 0.61, true);
          tree(0.16, 0.25, 0.51, true);
        }
        put("stones", 0.3, -0.29, 0.2, 0.13, 0.15, random() * 6.28, 0xa6afa2);
      } else if (tile.kind === "coast") {
        for (let i = 0; i < 3; i++)
          put(
            "stones",
            (random() - 0.5) * 0.7,
            (random() - 0.5) * 0.6,
            0.11 + random() * 0.1,
            0.12,
            0.15,
            random() * 6.28,
            0xb2ad91,
          );
        if (Math.abs(tile.lat) < 58) tree(0.15, -0.15, 0.63);
      }
    }
    for (const [name, batch] of Object.entries(batches)) {
      const count = batch.placements.length;
      if (count > batch.capacity) {
        const old = batch.mesh;
        batch.capacity = Math.ceil(count * 1.15);
        batch.mesh = new THREE.InstancedMesh(
          old.geometry,
          material,
          batch.capacity,
        );
        batch.mesh.name = `tile-${name}`;
        batch.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        batch.mesh.receiveShadow = true;
        group.remove(old);
        old.dispose();
        group.add(batch.mesh);
      }
      batch.mesh.count = count;
      batch.mesh.visible = count > 0;
      for (let i = 0; i < count; i++) {
        const p = batch.placements[i];
        position.set(p.x, p.y, p.z);
        scale.set(p.sx, p.sy, p.sz);
        rotation.setFromAxisAngle(axis, p.yaw);
        matrix.compose(position, rotation, scale);
        batch.mesh.setMatrixAt(i, matrix);
        batch.mesh.setColorAt(i, color.setHex(p.tint));
      }
      batch.mesh.instanceMatrix.needsUpdate = true;
      if (batch.mesh.instanceColor) batch.mesh.instanceColor.needsUpdate = true;
      // Rebuild geographic bounds after count so unused capacity is excluded.
      batch.mesh.computeBoundingBox();
      batch.mesh.computeBoundingSphere();
      batch.placements.length = 0;
    }
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    for (const batch of Object.values(batches)) {
      batch.mesh.dispose();
      batch.mesh.geometry.dispose();
      batch.placements.length = 0;
    }
    material.dispose();
    group.clear();
  }
  return { group, update, dispose };
}
