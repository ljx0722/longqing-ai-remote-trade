import * as THREE from "three";
import { groundHeight } from "./terrain-elevation";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { isLandPoint, type GeoPoint } from "../navigation";

function buildTownGeometry() {
  const masonry: THREE.BufferGeometry[] = [],
    houses: THREE.BufferGeometry[] = [],
    flags: THREE.BufferGeometry[] = [];
  const add = (
    parts: THREE.BufferGeometry[],
    source: THREE.BufferGeometry,
    tint: number,
    x: number,
    y: number,
    z: number,
  ) => {
    const geometry = source.index ? source.toNonIndexed() : source;
    if (geometry !== source) source.dispose();
    geometry.deleteAttribute("uv");
    geometry.translate(x, y, z);
    const color = new THREE.Color(tint),
      colors = new Float32Array(geometry.getAttribute("position").count * 3);
    for (let i = 0; i < colors.length; i += 3) {
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    parts.push(geometry);
  };
  const box = (
    parts: THREE.BufferGeometry[],
    width: number,
    height: number,
    depth: number,
    x: number,
    y: number,
    z: number,
    tint: number,
  ) => add(parts, new THREE.BoxGeometry(width, height, depth), tint, x, y, z);
  const roof = (
    width: number,
    height: number,
    depth: number,
    x: number,
    y: number,
    z: number,
    tint: number,
  ) => {
    const triangle = new THREE.Shape([
      new THREE.Vector2(-width / 2, 0),
      new THREE.Vector2(width / 2, 0),
      new THREE.Vector2(0, height),
    ]);
    const geometry = new THREE.ExtrudeGeometry(triangle, {
      depth,
      bevelEnabled: false,
      steps: 1,
      curveSegments: 1,
    });
    add(houses, geometry, tint, x, y, z - depth / 2);
  };

  // A small paved settlement with an open south gate, rather than a solid tower.
  box(masonry, 1.5, 0.04, 1.4, 0, 0.02, 0, 0xd9d1b7);
  box(masonry, 1.45, 0.22, 0.075, 0, 0.15, -0.66, 0xf3eddb);
  for (const side of [-1, 1]) {
    box(masonry, 0.075, 0.22, 1.32, side * 0.7, 0.15, 0, 0xe4ddc8);
    box(masonry, 0.43, 0.22, 0.075, side * 0.5, 0.15, 0.66, 0xf3eddb);
    box(masonry, 0.19, 0.43, 0.22, side * 0.18, 0.255, 0.63, 0xf3eddb);
    roof(0.24, 0.13, 0.27, side * 0.18, 0.47, 0.63, 0x866147);
    for (const z of [-0.56, -0.28, 0, 0.28, 0.56])
      box(masonry, 0.09, 0.065, 0.09, side * 0.7, 0.2925, z, 0xf9f2df);
  }
  box(masonry, 0.26, 0.09, 0.18, 0, 0.38, 0.63, 0xe1d5b8);
  for (const x of [-0.56, -0.28, 0, 0.28, 0.56])
    box(masonry, 0.09, 0.065, 0.09, x, 0.2925, -0.66, 0xf9f2df);

  const homes = [
    [-0.43, -0.4, 0.25, 0.34, 0.28],
    [-0.03, -0.39, 0.34, 0.59, 0.31],
    [0.41, -0.4, 0.26, 0.39, 0.27],
    [-0.44, -0.01, 0.25, 0.45, 0.26],
    [0.43, 0.02, 0.27, 0.31, 0.27],
    [-0.45, 0.36, 0.25, 0.3, 0.26],
    [-0.08, 0.18, 0.27, 0.37, 0.24],
    [0.43, 0.4, 0.25, 0.43, 0.23],
  ];
  const plaster = [0xe5d2a5, 0xeedfc0, 0xd5b27d, 0xcdbb95],
    tiles = [0xa95d42, 0x7d5140, 0x9b7049, 0x6c7973];
  homes.forEach(([x, z, width, height, depth], index) => {
    box(
      houses,
      width,
      height,
      depth,
      x,
      0.04 + height / 2,
      z,
      plaster[index % 4],
    );
    roof(
      width + 0.045,
      0.13 + (index % 3) * 0.025,
      depth + 0.045,
      x,
      0.04 + height,
      z,
      tiles[index % 4],
    );
    box(houses, 0.065, 0.12, 0.012, x, 0.1, z + depth / 2 + 0.007, 0x574536);
    for (const side of [-1, 1])
      box(
        houses,
        0.045,
        0.055,
        0.014,
        x + side * width * 0.28,
        height * 0.7,
        z + depth / 2 + 0.008,
        0x475454,
      );
    if (index % 2 === 0)
      box(
        houses,
        0.045,
        0.12,
        0.055,
        x + width * 0.24,
        height + 0.16,
        z - depth * 0.2,
        0x998675,
      );
  });
  box(houses, 0.18, 0.11, 0.18, 0.05, 0.095, -0.03, 0xa59778);
  box(houses, 0.11, 0.02, 0.11, 0.05, 0.16, -0.03, 0x547473);
  box(flags, 0.025, 1.12, 0.025, -0.59, 0.6, -0.5, 0x685641);
  add(flags, new THREE.PlaneGeometry(0.25, 0.17), 0xffffff, -0.45, 1.055, -0.5);

  const merge = (parts: THREE.BufferGeometry[]) => {
    const geometry = mergeGeometries(parts, false)!;
    parts.forEach((part) => part.dispose());
    return geometry;
  };
  return { walls: merge(masonry), houses: merge(houses), flags: merge(flags) };
}

export type RealmMap = {
  cities: {
    id: string;
    name: string;
    lon: number;
    lat: number;
    owned: boolean;
    known?: boolean;
  }[];
  roads: { id: string; points: GeoPoint[] }[];
  caravans: { id: string; point: GeoPoint }[];
};
export function buildRealmOverlay() {
  const group = new THREE.Group(),
    settlements = new THREE.Group(),
    transport = new THREE.Group(),
    peopleGroup = new THREE.Group();
  group.name = "城邦、陆路与商队";
  peopleGroup.name = "陆地居民";
  group.add(settlements, transport, peopleGroup);
  let key = "";
  const wagons = new Map<string, THREE.Group>();
  const wagonPhases = new Map<string, number>();
  let people: THREE.InstancedMesh | null = null;
  let peopleSeeds: {
    point: GeoPoint;
    phase: number;
    speed: number;
    radius: number;
  }[] = [];
  const dispose = (root: THREE.Object3D) => {
    root.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (obj instanceof THREE.InstancedMesh) obj.dispose();
      mesh.geometry?.dispose();
      if (mesh.material)
        for (const mat of Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material])
          mat.dispose();
    });
    root.clear();
  };
  function update(data: RealmMap) {
    const next =
      data.cities.map((c) => c.id + c.owned + c.known).join(",") +
      data.roads.map((r) => r.id).join(",");
    if (next !== key) {
      key = next;
      dispose(settlements);
      dispose(peopleGroup);
      people = null;
      peopleSeeds = [];
      if (data.cities.length) {
        const town = buildTownGeometry();
        const walls = new THREE.InstancedMesh(
          town.walls,
          new THREE.MeshStandardMaterial({
            emissive: 0x938b72,
            emissiveIntensity: 0.1,
            roughness: 1,
            vertexColors: true,
            flatShading: true,
          }),
          data.cities.length,
        );
        const keeps = new THREE.InstancedMesh(
          town.houses,
          new THREE.MeshStandardMaterial({
            emissive: 0x938b72,
            emissiveIntensity: 0.1,
            roughness: 1,
            vertexColors: true,
            flatShading: true,
          }),
          data.cities.length,
        );
        const banners = new THREE.InstancedMesh(
          town.flags,
          new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            vertexColors: true,
          }),
          data.cities.length,
        );
        walls.name = "城墙";
        keeps.name = "城镇民居与屋顶";
        banners.name = "城邦旗帜";
        const matrix = new THREE.Matrix4(),
          color = new THREE.Color();
        data.cities.forEach((c, index) => {
          matrix.makeScale(0.72, 0.72, 0.72);
          matrix.setPosition(c.lon, groundHeight(c.lon, c.lat) + 0.025, -c.lat);
          walls.setMatrixAt(index, matrix);
          walls.setColorAt(
            index,
            color.setHex(
              c.owned ? 0xbea36a : c.known === false ? 0x7b928c : 0xbeb393,
            ),
          );
          keeps.setMatrixAt(index, matrix);
          keeps.setColorAt(
            index,
            color.setHex(
              c.owned ? 0xffedcf : c.known === false ? 0xc4c9b5 : 0xffffff,
            ),
          );
          banners.setMatrixAt(index, matrix);
          banners.setColorAt(
            index,
            color.setHex(
              c.owned ? 0xedc975 : c.known === false ? 0x637c7b : 0xadc6b4,
            ),
          );
        });
        for (const batch of [walls, keeps, banners]) {
          batch.instanceMatrix.needsUpdate = true;
          if (batch.instanceColor) batch.instanceColor.needsUpdate = true;
          batch.computeBoundingSphere();
          settlements.add(batch);
        }
      }
      const positions: number[] = [],
        distances: number[] = [];
      for (const r of data.roads) {
        let distance = 0;
        for (let index = 1; index < r.points.length; index++) {
          const from = r.points[index - 1],
            to = r.points[index];
          positions.push(
            from.lon,
            groundHeight(from.lon, from.lat) + 0.05,
            -from.lat,
            to.lon,
            groundHeight(to.lon, to.lat) + 0.05,
            -to.lat,
          );
          distances.push(distance);
          distance += Math.hypot(to.lon - from.lon, to.lat - from.lat);
          distances.push(distance);
        }
      }
      if (positions.length) {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(positions, 3),
        );
        // Preserve dash phase along each road without joining unrelated routes.
        geometry.setAttribute(
          "lineDistance",
          new THREE.Float32BufferAttribute(distances, 1),
        );
        const line = new THREE.LineSegments(
          geometry,
          new THREE.LineDashedMaterial({
            color: 0xe0bb7a,
            dashSize: 0.45,
            gapSize: 0.32,
            transparent: true,
            opacity: 0.75,
            depthTest: false,
          }),
        );
        line.name = "陆路";
        settlements.add(line);
      }

      // Ambient population: one low-poly person mesh is instanced across
      // discovered towns and roads.  It is deliberately tiny at world scale
      // and animated in a pool so the continuous map feels inhabited without
      // adding one draw call per resident.
      const personBody = new THREE.CylinderGeometry(0.07, 0.1, 0.24, 5);
      const personHead = new THREE.SphereGeometry(0.085, 6, 4);
      personHead.translate(0, 0.19, 0);
      for (const [geometry, tint] of [
        [personBody, 0x3e6976],
        [personHead, 0xffffff],
      ] as const) {
        const color = new THREE.Color(tint);
        const colors = new Float32Array(
          geometry.getAttribute("position").count * 3,
        );
        for (let i = 0; i < colors.length; i += 3)
          colors.set([color.r, color.g, color.b], i);
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      }
      const personGeometry = mergeGeometries([personBody, personHead], false)!;
      personBody.dispose();
      personHead.dispose();
      const visibleCities = data.cities.filter((city) => city.known !== false);
      const anchors: GeoPoint[] = [];
      for (const city of visibleCities) {
        for (let i = 0; i < 5; i++) {
          const angle = (i * 1.7 + city.lon * 0.11) * Math.PI;
          anchors.push({
            lon: city.lon + Math.cos(angle) * (0.16 + (i % 2) * 0.11),
            lat: city.lat + Math.sin(angle) * (0.12 + (i % 3) * 0.08),
          });
        }
      }
      for (const road of data.roads) {
        for (let i = 1; i < road.points.length; i += 2) {
          const a = road.points[i - 1],
            b = road.points[i];
          anchors.push({ lon: (a.lon + b.lon) / 2, lat: (a.lat + b.lat) / 2 });
        }
      }
      const landAnchors = anchors.filter((point) => isLandPoint(point));
      const count = Math.min(180, landAnchors.length);
      if (count) {
        people = new THREE.InstancedMesh(
          personGeometry,
          new THREE.MeshStandardMaterial({
            roughness: 1,
            vertexColors: true,
            flatShading: true,
          }),
          count,
        );
        people.name = "行人（多样肤色）";
        const skinTones = [
          0xf4c7a1, 0xd99a70, 0xb96d45, 0x8a4f32, 0x63351f, 0xe8ae83,
        ];
        const personMatrix = new THREE.Matrix4();
        const personColor = new THREE.Color();
        for (let i = 0; i < count; i++) {
          const point = landAnchors[i];
          peopleSeeds.push({
            point,
            phase: i * 2.37,
            speed: 0.35 + (i % 5) * 0.06,
            radius: 0.025 + (i % 3) * 0.018,
          });
          personMatrix.makeTranslation(
            point.lon,
            groundHeight(point.lon, point.lat) + 0.14,
            -point.lat,
          );
          people.setMatrixAt(i, personMatrix);
          people.setColorAt(
            i,
            personColor.setHex(skinTones[i % skinTones.length]),
          );
        }
        people.instanceMatrix.needsUpdate = true;
        people.instanceColor!.needsUpdate = true;
        people.computeBoundingSphere();
        peopleGroup.add(people);
      } else {
        personGeometry.dispose();
      }
    }
    const ids = new Set(data.caravans.map((c) => c.id));
    for (const [id, wagon] of wagons)
      if (!ids.has(id)) {
        dispose(wagon);
        transport.remove(wagon);
        wagons.delete(id);
        wagonPhases.delete(id);
      }
    for (const c of data.caravans) {
      let wagon = wagons.get(c.id);
      if (!wagon) {
        wagon = new THREE.Group();
        const crate = new THREE.Mesh(
          new THREE.BoxGeometry(0.7, 0.45, 1.05),
          new THREE.MeshStandardMaterial({ color: 0xe5c391, roughness: 1 }),
        );
        const cover = new THREE.Mesh(
          new THREE.CylinderGeometry(0.43, 0.43, 0.85, 7, 1, false, 0, Math.PI),
          new THREE.MeshStandardMaterial({
            color: 0xf1e2bc,
            side: THREE.DoubleSide,
          }),
        );
        cover.rotation.x = Math.PI / 2;
        cover.position.y = 0.2;
        wagon.add(crate, cover);
        wagon.scale.setScalar(0.45);
        transport.add(wagon);
        wagons.set(c.id, wagon);
        wagonPhases.set(c.id, wagonPhases.size * 1.37);
      }
      wagon.position.set(
        c.point.lon,
        groundHeight(c.point.lon, c.point.lat) + 0.16,
        -c.point.lat,
      );
    }
  }
  function animate(time: number) {
    if (people && peopleSeeds.length) {
      const matrix = new THREE.Matrix4();
      const forward = new THREE.Vector3();
      peopleSeeds.forEach((seed, i) => {
        const sway = time * seed.speed + seed.phase;
        const lon = seed.point.lon + Math.sin(sway) * seed.radius;
        const lat = seed.point.lat + Math.cos(sway * 0.83) * seed.radius * 0.7;
        matrix.makeRotationY(Math.sin(sway) * 0.22);
        forward.set(
          lon,
          groundHeight(lon, lat) +
            0.14 +
            Math.abs(Math.sin(sway * 1.7)) * 0.025,
          -lat,
        );
        matrix.setPosition(forward);
        people!.setMatrixAt(i, matrix);
      });
      people.instanceMatrix.needsUpdate = true;
    }
    // Wagons advance by a tiny eased step between simulation ticks, making
    // caravan contracts readable at a glance without changing their data.
    wagons.forEach((wagon, id) => {
      const phase = wagonPhases.get(id) ?? 0;
      wagon.position.y =
        groundHeight(wagon.position.x, -wagon.position.z) +
        0.16 +
        Math.sin(time * 2 + phase) * 0.018;
      wagon.rotation.y = Math.sin(time * 0.8 + phase) * 0.06;
    });
  }
  return {
    group,
    update,
    animate,
    dispose: () => {
      dispose(group);
      wagons.clear();
      wagonPhases.clear();
      peopleSeeds = [];
      people = null;
    },
  };
}
