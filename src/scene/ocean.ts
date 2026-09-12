import * as THREE from "three";
import { buildGeographicDetail } from "./world-geography";
import { buildHexWorld } from "./hex-world";
import { buildReliefGeometry, buildTerrainMaterial } from "./terrain-surface";
import { groundHeight } from "./terrain-elevation";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { Port } from "../data";
import {
  isLandPoint,
  distanceDegrees,
  portPoint,
  type GeoPoint,
  type NavigationState,
  type NavHazard,
} from "../navigation";

export type OceanScene = {
  group: THREE.Group;
  ship: THREE.Group;
  update: (nav: NavigationState, ports: Port[], hazards: NavHazard[]) => void;
  animate: (time: number) => void;
  updateView: (lon: number, lat: number, width: number, height: number) => void;
  revealInland: (points: GeoPoint[]) => void;
  setInlandCities: (points: GeoPoint[]) => void;
  dispose: () => void;
};
const geoVector = (point: GeoPoint, height = 1.2) =>
  new THREE.Vector3(point.lon, height, -point.lat);
function disposeTree(root: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>(),
    materials = new Set<THREE.Material>(),
    textures = new Set<THREE.Texture>();
  root.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (mesh.geometry) geometries.add(mesh.geometry);
    if (mesh.material)
      for (const mat of Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material]) {
        materials.add(mat);
        const material = mat as THREE.MeshBasicMaterial;
        if (material.map) textures.add(material.map);
        if ((mat as THREE.MeshStandardMaterial).bumpMap)
          textures.add((mat as THREE.MeshStandardMaterial).bumpMap!);
      }
  });
  for (const geometry of geometries) geometry.dispose();
  for (const material of materials) material.dispose();
  for (const texture of textures) texture.dispose();
}
function labelSprite(text: string, color: string, width = 30, fontSize = 30) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 80;
  const ctx = canvas.getContext("2d")!;
  ctx.font = `600 ${fontSize}px Georgia, "Microsoft YaHei", serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "#0b2635";
  ctx.shadowBlur = 8;
  ctx.fillStyle = color;
  ctx.fillText(text, 256, 40);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
      opacity: 0.75,
    }),
  );
  sprite.scale.set(width, (width * 80) / 512, 1);
  return sprite;
}
function shipModel(scale = 1) {
  const ship = new THREE.Group();
  const hull = new THREE.Mesh(
    new THREE.BoxGeometry(1.35, 0.65, 3.7),
    new THREE.MeshStandardMaterial({ color: 0x563b26, roughness: 1 }),
  );
  hull.position.y = 0.45;
  ship.add(hull);
  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.18, 3.45),
    new THREE.MeshStandardMaterial({ color: 0xc8a370 }),
  );
  deck.position.y = 0.85;
  ship.add(deck);
  const mast = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.09, 3.8, 5),
    new THREE.MeshStandardMaterial({ color: 0x55412a }),
  );
  mast.position.y = 2.6;
  ship.add(mast);
  const sail = new THREE.Mesh(
    new THREE.PlaneGeometry(2.45, 2.6, 8, 6),
    new THREE.MeshStandardMaterial({
      color: 0xf7e9bd,
      side: THREE.DoubleSide,
      roughness: 1,
    }),
  );
  const position = sail.geometry.attributes.position;
  for (let i = 0; i < position.count; i++)
    position.setZ(i, Math.cos(position.getX(i) * 0.8) * 0.4);
  sail.geometry.computeVertexNormals();
  sail.position.set(0, 2.8, 0.1);
  ship.add(sail);
  const flag = new THREE.Mesh(
    new THREE.PlaneGeometry(0.85, 0.45),
    new THREE.MeshBasicMaterial({ color: 0xf0c46d, side: THREE.DoubleSide }),
  );
  flag.position.set(0.45, 4.6, 0);
  ship.add(flag);
  ship.scale.setScalar(scale);
  return ship;
}
export function buildOcean(geojson: unknown): OceanScene {
  const group = new THREE.Group();
  group.name = "远海航海图";
  const terrain = new THREE.Group();
  group.add(terrain);
  const hexWorld = buildHexWorld();
  terrain.add(hexWorld.group);
  const plane = new THREE.PlaneGeometry(360, 180, 90, 45);
  plane.rotateX(-Math.PI / 2);
  const positions = plane.attributes.position,
    colors = new Float32Array(positions.count * 3),
    color = new THREE.Color();
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i),
      z = positions.getZ(i);
    color.setHSL(
      0.548 + Math.sin(x * 0.025) * 0.011,
      0.56,
      0.29 + Math.cos(z * 0.018) * 0.04 + Math.sin(x * 0.05 + z * 0.08) * 0.007,
    );
    colors.set([color.r, color.g, color.b], i * 3);
  }
  plane.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const water = new THREE.Mesh(
    plane,
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.95,
      metalness: 0.03,
    }),
  );
  water.position.z = 0;
  group.add(water);

  const geometries: THREE.BufferGeometry[] = [],
    coastPositions: number[] = [],
    shallows: number[] = [];
  const data = geojson as {
    features: {
      geometry: { type: string; coordinates: number[][][] | number[][][][] };
    }[];
  };
  for (const feature of data.features) {
    const geometry = feature.geometry;
    const polygons =
      geometry.type === "Polygon"
        ? [geometry.coordinates]
        : geometry.type === "MultiPolygon"
          ? geometry.coordinates
          : [];
    for (const rings of polygons as number[][][][]) {
      if (!rings[0] || rings[0].length < 4) continue;
      const shape = new THREE.Shape(
        rings[0].map(([lon, lat]) => new THREE.Vector2(lon, lat)),
      );
      for (const ring of rings.slice(1))
        shape.holes.push(
          new THREE.Path(ring.map(([lon, lat]) => new THREE.Vector2(lon, lat))),
        );
      geometries.push(buildReliefGeometry(shape));
      for (const ring of rings)
        for (let i = 1; i < ring.length; i++) {
          const a = ring[i - 1],
            b = ring[i];
          if (Math.abs(a[0] - b[0]) > 180) continue;
          const length = Math.hypot(a[0] - b[0], a[1] - b[1]);
          if (length < 0.00001) continue;
          const nx = ((b[1] - a[1]) / length) * 0.28,
            nz = (-(b[0] - a[0]) / length) * 0.28;
          const v = (p: number[], side: number) => [
            p[0] + nx * side,
            0.035,
            -p[1] - nz * side,
          ];
          shallows.push(
            ...v(a, -1),
            ...v(b, 1),
            ...v(b, -1),
            ...v(a, -1),
            ...v(a, 1),
            ...v(b, 1),
          );
          coastPositions.push(
            a[0],
            groundHeight(a[0], a[1]) + 0.025,
            -a[1],
            b[0],
            groundHeight(b[0], b[1]) + 0.025,
            -b[1],
          );
        }
    }
  }
  if (geometries.length) {
    const merged = mergeGeometries(geometries, false)!;
    const land = new THREE.Mesh(merged, buildTerrainMaterial());
    land.receiveShadow = true;
    land.name = "真实海岸与连续起伏地表";
    terrain.add(land);
    geometries.forEach((g) => g.dispose());
  }
  terrain.add(
    new THREE.Mesh(
      new THREE.BufferGeometry().setAttribute(
        "position",
        new THREE.Float32BufferAttribute(shallows, 3),
      ),
      new THREE.MeshBasicMaterial({
        color: 0x75a6a6,
        transparent: false,
        opacity: 1,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    ),
  );
  terrain.add(
    new THREE.LineSegments(
      new THREE.BufferGeometry().setAttribute(
        "position",
        new THREE.Float32BufferAttribute(coastPositions, 3),
      ),
      new THREE.LineBasicMaterial({
        color: 0xe0d7aa,
        transparent: true,
        opacity: 0.7,
      }),
    ),
  );
  terrain.add(buildGeographicDetail());
  const transform = new THREE.Object3D();

  const cityGroup = new THREE.Group();
  group.add(cityGroup);
  const routeMaterial = new THREE.LineDashedMaterial({
    color: 0xffe0a2,
    dashSize: 0.8,
    gapSize: 0.52,
    transparent: true,
    opacity: 0.92,
  });
  const route = new THREE.LineSegments(
    new THREE.BufferGeometry(),
    routeMaterial,
  );
  route.renderOrder = 4;
  group.add(route);
  const trail = new THREE.LineSegments(
    new THREE.BufferGeometry(),
    new THREE.LineBasicMaterial({
      color: 0x9bdddc,
      transparent: true,
      opacity: 0.5,
    }),
  );
  group.add(trail);
  const hazardGroup = new THREE.Group();
  group.add(hazardGroup);
  const ship = shipModel(0.43);
  ship.name = "玩家商船";
  group.add(ship);
  // Ambient merchant traffic: a small pooled set of decorative vessels that
  // loop around major trade basins. They only update transforms, so simulation
  // and collision remain untouched while the continuous map feels alive.
  const ambientTraffic = new THREE.Group();
  ambientTraffic.name = "远洋商船与渔船";
  group.add(ambientTraffic);
  const trafficPaths: GeoPoint[][] = [
    [
      { lon: -20, lat: 35 },
      { lon: -30, lat: 28 },
      { lon: -40, lat: 20 },
      { lon: -30, lat: 35 },
    ],
    [
      { lon: 18, lat: 34 },
      { lon: 24, lat: 33 },
      { lon: 30, lat: 33 },
      { lon: 25, lat: 34.2 },
    ],
    [
      { lon: 60, lat: 2 },
      { lon: 67, lat: -5 },
      { lon: 80, lat: -7 },
      { lon: 72, lat: 3 },
    ],
    [
      { lon: 112, lat: 14 },
      { lon: 115, lat: 10 },
      { lon: 118, lat: 16 },
      { lon: 114, lat: 18 },
    ],
    [
      { lon: -88, lat: 24 },
      { lon: -92, lat: 23 },
      { lon: -94, lat: 25 },
      { lon: -90, lat: 27 },
    ],
    [
      { lon: 145, lat: 30 },
      { lon: 154, lat: 25 },
      { lon: 165, lat: 21 },
      { lon: 155, lat: 33 },
    ],
    [
      { lon: -34, lat: -10 },
      { lon: -27, lat: -18 },
      { lon: -16, lat: -15 },
      { lon: -23, lat: -7 },
    ],
    [
      { lon: 55, lat: -24 },
      { lon: 61, lat: -26 },
      { lon: 66, lat: -22 },
      { lon: 58, lat: -16 },
    ],
  ];
  const traffic = trafficPaths.map((path, i) => {
    const vessel = shipModel(i % 3 === 0 ? 0.34 : 0.25);
    vessel.name = `航行中的商船 ${i + 1}`;
    ambientTraffic.add(vessel);
    return { vessel, path, phase: i * 0.73, speed: 0.018 + (i % 4) * 0.004 };
  });
  const halo = new THREE.Mesh(
    new THREE.RingGeometry(1.4, 1.52, 40),
    new THREE.MeshBasicMaterial({
      color: 0xffd48a,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
    }),
  );
  halo.rotation.x = -Math.PI / 2;
  halo.position.y = 0.04;
  ship.add(halo);
  const worldLabels: [string, number, number, number][] = [
    ["大 西 洋", -36, 12, 30],
    ["印 度 洋", 75, -18, 34],
    ["太 平 洋", -139, -12, 37],
    ["欧 洲", 19, 56, 20],
    ["非 洲", 18, 6, 22],
    ["亚 洲", 93, 49, 23],
    ["美 洲", -99, 35, 23],
    ["南 美 洲", -58, -17, 26],
    ["大 洋 洲", 137, -28, 24],
  ];
  for (const [text, lon, lat, width] of worldLabels) {
    const label = labelSprite(text, "#dfdcb4", width);
    label.position.set(lon, 2, -lat);
    terrain.add(label);
  }
  const fogCanvas = document.createElement("canvas");
  fogCanvas.width = 1024;
  fogCanvas.height = 512;
  const fogTexture = new THREE.CanvasTexture(fogCanvas);
  fogTexture.colorSpace = THREE.SRGBColorSpace;
  const fog = new THREE.Mesh(
    new THREE.PlaneGeometry(360, 180),
    new THREE.MeshBasicMaterial({
      map: fogTexture,
      transparent: true,
      depthWrite: false,
      opacity: 1,
    }),
  );
  fog.rotation.x = -Math.PI / 2;
  fog.position.y = 6;
  fog.renderOrder = 2;
  group.add(fog);
  let lastPorts = "",
    lastHazards = "",
    lastFog = "",
    lastRoute = "",
    lastTrail = "";
  let shipPosition: GeoPoint = { lon: 0, lat: 0 },
    shipHeading = 0;
  let portCoordinates: GeoPoint[] = [],
    inlandCoordinates: GeoPoint[] = [];
  let inlandExplored: GeoPoint[] = [],
    inlandFogKey = "";
  function lineGeometry(points: GeoPoint[], height: number) {
    const vertices: number[] = [];
    for (let i = 1; i < points.length; i++) {
      if (Math.abs(points[i].lon - points[i - 1].lon) > 180) continue;
      const a = geoVector(points[i - 1], height),
        b = geoVector(points[i], height);
      vertices.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
    return new THREE.BufferGeometry().setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3),
    );
  }
  function update(
    nav: NavigationState,
    available: Port[],
    hazards: NavHazard[],
  ) {
    shipPosition = { ...nav.position };
    shipHeading = nav.heading;
    ship.position.copy(
      geoVector(
        nav.position,
        isLandPoint(nav.position)
          ? groundHeight(nav.position.lon, nav.position.lat) + 0.06
          : 0.16,
      ),
    );
    ship.rotation.y = -nav.heading;
    const citiesKey = `${available.map((p) => p.id).join(",")}:${nav.discovered.join(",")}`;
    if (citiesKey !== lastPorts) {
      lastPorts = citiesKey;
      portCoordinates = available.map(portPoint);
      hexWorld.setCities([...portCoordinates, ...inlandCoordinates]);
      disposeTree(cityGroup);
      cityGroup.clear();
      const buildings = new THREE.InstancedMesh(
        new THREE.BoxGeometry(0.42, 0.85, 0.48),
        new THREE.MeshStandardMaterial({ color: 0xdbcca4, roughness: 1 }),
        available.length * 15,
      );
      const roofs = new THREE.InstancedMesh(
        new THREE.ConeGeometry(0.4, 0.43, 4),
        new THREE.MeshStandardMaterial({ color: 0x876244, roughness: 1 }),
        available.length * 15,
      );
      const markers = new THREE.InstancedMesh(
        new THREE.RingGeometry(0.54, 0.575, 32),
        new THREE.MeshBasicMaterial({
          color: 0xf2d497,
          side: THREE.DoubleSide,
          depthTest: true,
        }),
        available.length,
      );
      available.forEach((port, i) => {
        const p = portPoint(port),
          visited = nav.discovered.includes(port.id);
        for (let j = 0; j < 15; j++) {
          transform.position.set(
            p.lon + ((j % 5) - 2) * 0.33,
            0,
            -p.lat + (Math.floor(j / 5) - 1) * 0.36,
          );
          if (
            !isLandPoint({
              lon: transform.position.x,
              lat: -transform.position.z,
            })
          ) {
            const angle = j * 2.4;
            for (let r = 0.15; r < 1.8; r += 0.15) {
              const x = p.lon + Math.cos(angle) * r,
                lat = p.lat + Math.sin(angle) * r;
              if (isLandPoint({ lon: x, lat })) {
                transform.position.set(x, 1.6, -lat);
                break;
              }
            }
          }
          transform.rotation.set(0, (j % 3) * 0.12, 0);
          transform.scale.set(
            0.63,
            j === 7 ? 1.15 : 0.55 + (j % 4) * 0.13,
            0.65,
          );
          transform.updateMatrix();
          transform.position.y =
            groundHeight(transform.position.x, -transform.position.z) +
            0.425 * transform.scale.y;
          transform.updateMatrix();
          buildings.setMatrixAt(i * 15 + j, transform.matrix);
          transform.position.y += transform.scale.y * 0.52;
          transform.scale.set(0.67, 0.6, 0.68);
          transform.rotation.y = Math.PI / 4;
          transform.updateMatrix();
          roofs.setMatrixAt(i * 15 + j, transform.matrix);
        }
        transform.position.set(
          p.lon,
          groundHeight(p.lon, p.lat) + 0.045,
          -p.lat,
        );
        transform.scale.setScalar(visited ? 1 : 0.7);
        transform.rotation.set(-Math.PI / 2, 0, 0);
        transform.updateMatrix();
        markers.setMatrixAt(i, transform.matrix);
        markers.setColorAt(i, new THREE.Color(visited ? 0xffd991 : 0x879ea3));
      });
      cityGroup.add(buildings, roofs, markers);
      // Put a few fishing/coastal boats close to the player's known harbour,
      // so normal regional zoom is lively as well as open-ocean zoom.  Every
      // candidate loop is checked against the same land mask as navigation.
      const nearby = [...available].sort(
        (a, b) =>
          distanceDegrees(nav.position, portPoint(a)) -
          distanceDegrees(nav.position, portPoint(b)),
      );
      for (let i = 0; i < Math.min(4, traffic.length); i++) {
        const anchorPort = nearby[Math.min(i, nearby.length - 1)];
        if (!anchorPort) continue;
        const anchor = portPoint(anchorPort);
        let assigned = false;
        for (let ring = 0.55; ring <= 5 && !assigned; ring += 0.35) {
          for (let side = 0; side < 12 && !assigned; side++) {
            const angle = (side * Math.PI) / 6 + i * 0.35;
            const center = {
              lon: anchor.lon + Math.cos(angle) * ring,
              lat: anchor.lat + Math.sin(angle) * ring,
            };
            const radius = 0.2 + i * 0.04;
            const loop = Array.from({ length: 8 }, (_, corner) => ({
              lon: center.lon + Math.cos((corner * Math.PI) / 4) * radius,
              lat: center.lat + Math.sin((corner * Math.PI) / 4) * radius,
            }));
            if (loop.every((p) => !isLandPoint(p))) {
              traffic[i].path = loop;
              traffic[i].speed = 0.1 + i * 0.015;
              assigned = true;
            }
          }
        }
      }
    }
    const routeKey = `${nav.leg}:${nav.route.map((p) => `${p.lon.toFixed(2)},${p.lat.toFixed(2)}`).join(";")}:${nav.position.lon.toFixed(1)},${nav.position.lat.toFixed(1)}`;
    if (routeKey !== lastRoute) {
      lastRoute = routeKey;
      route.geometry.dispose();
      route.geometry = lineGeometry(
        nav.route.length ? [nav.position, ...nav.route.slice(nav.leg)] : [],
        3.25,
      );
      route.computeLineDistances();
    }
    const trailKey = `${nav.trail.length}:${nav.trail[0]?.lon}:${nav.trail.at(-1)?.lon}:${nav.trail.at(-1)?.lat}`;
    if (lastTrail !== trailKey) {
      lastTrail = trailKey;
      trail.geometry.dispose();
      trail.geometry = lineGeometry(nav.trail, 2.8);
    }
    const fogKey = `${nav.discovered.join(",")}:${Math.round(nav.position.lon)}:${Math.round(nav.position.lat)}:${Math.floor(nav.trail.length / 8)}:${inlandFogKey}`;
    if (fogKey !== lastFog) {
      lastFog = fogKey;
      const ctx = fogCanvas.getContext("2d")!;
      ctx.clearRect(0, 0, 1024, 512);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(8, 27, 46, 0.28)";
      ctx.fillRect(0, 0, 1024, 512);
      ctx.globalCompositeOperation = "destination-out";
      const reveal = (p: GeoPoint, radius: number) => {
        const x = ((p.lon + 180) / 360) * 1024,
          y = ((90 - p.lat) / 180) * 512,
          r = (radius / 360) * 1024;
        for (const offset of [-1024, 0, 1024]) {
          const gradient = ctx.createRadialGradient(
            x + offset,
            y,
            r * 0.4,
            x + offset,
            y,
            r,
          );
          gradient.addColorStop(0, "rgba(0,0,0,1)");
          gradient.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = gradient;
          ctx.fillRect(x + offset - r, y - r, r * 2, r * 2);
        }
      };
      for (const p of available)
        if (nav.discovered.includes(p.id)) reveal(portPoint(p), 17);
      for (const p of inlandExplored) reveal(p, 10);
      for (let i = 0; i < nav.trail.length; i += 4) reveal(nav.trail[i], 9);
      reveal(nav.position, 15);
      fogTexture.needsUpdate = true;
    }
    const hazardsKey = hazards.map((h) => h.id).join(",");
    if (hazardsKey !== lastHazards) {
      lastHazards = hazardsKey;
      disposeTree(hazardGroup);
      hazardGroup.clear();
      for (const h of hazards.slice(0, 32)) {
        const zone = new THREE.Group();
        zone.position.set(h.lon, 3.3, -h.lat);
        zone.name = h.label;
        const tint =
          h.kind === "pirate"
            ? 0xd38666
            : h.kind === "current"
              ? 0x91d0c2
              : h.kind === "fog"
                ? 0xd3d9cb
                : 0xadc9d0;
        const disk = new THREE.Mesh(
          new THREE.CircleGeometry(h.radius, 40),
          new THREE.MeshBasicMaterial({
            color: tint,
            transparent: true,
            opacity: h.kind === "pirate" ? 0.14 : 0.09,
            side: THREE.DoubleSide,
            depthWrite: false,
          }),
        );
        disk.rotation.x = -Math.PI / 2;
        zone.add(disk);
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(h.radius - 0.09, h.radius, 48),
          new THREE.MeshBasicMaterial({
            color: tint,
            transparent: true,
            opacity: 0.42,
            side: THREE.DoubleSide,
            depthWrite: false,
          }),
        );
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = 0.03;
        zone.add(ring);
        if (h.kind === "storm" || h.kind === "fog") {
          const clouds = new THREE.InstancedMesh(
            new THREE.SphereGeometry(1, 8, 5),
            new THREE.MeshStandardMaterial({
              color: h.kind === "storm" ? 0x66818b : 0xd0d9cf,
              transparent: true,
              opacity: 0.72,
              roughness: 1,
              depthWrite: false,
            }),
            4,
          );
          for (let j = 0; j < 4; j++) {
            transform.position.set(
              (j - 1.5) * 1.1,
              1.3 + Math.sin(j) * 0.3,
              Math.cos(j * 2) * 0.6,
            );
            transform.scale.set(1.2, 0.6, 0.9);
            transform.rotation.set(0, 0, 0);
            transform.updateMatrix();
            clouds.setMatrixAt(j, transform.matrix);
          }
          zone.add(clouds);
        } else {
          const symbol = labelSprite(
            h.kind === "pirate" ? "⚑" : "≋",
            h.kind === "pirate" ? "#ffd0ac" : "#b6e4d3",
            12,
            52,
          );
          symbol.position.y = 2;
          zone.add(symbol);
        }
        hazardGroup.add(zone);
      }
    }
  }
  function animate(time: number) {
    ship.position.set(
      shipPosition.lon,
      (isLandPoint(shipPosition)
        ? groundHeight(shipPosition.lon, shipPosition.lat) + 0.06
        : 0.16) +
        Math.sin(time * 1.6) * 0.025,
      -shipPosition.lat,
    );
    ship.rotation.set(
      Math.sin(time * 1.1) * 0.025,
      -shipHeading,
      Math.cos(time) * 0.035,
    );
    halo.material.opacity = 0.6 + Math.sin(time * 2) * 0.16;
    for (const item of traffic) {
      const cycle = item.path.length;
      const cursor = (time * item.speed + item.phase) % cycle;
      const index = Math.floor(cursor);
      const t = cursor - index;
      const a = item.path[index],
        b = item.path[(index + 1) % cycle];
      const lon = a.lon + (b.lon - a.lon) * t;
      const lat = a.lat + (b.lat - a.lat) * t;
      item.vessel.position.set(
        lon,
        0.12 + Math.sin(time * 1.8 + item.phase) * 0.025,
        -lat,
      );
      item.vessel.rotation.y = -Math.atan2(b.lon - a.lon, b.lat - a.lat);
      item.vessel.rotation.z = Math.sin(time * 1.4 + item.phase) * 0.025;
    }
    hazardGroup.children.forEach((zone, i) => {
      const clouds = zone.children[2];
      if (clouds?.type === "Mesh")
        clouds.position.y = Math.sin(time * 0.4 + i) * 0.14;
    });
  }
  return {
    group,
    ship,
    update,
    animate,
    updateView: hexWorld.updateView,
    setInlandCities: (points) => {
      inlandCoordinates = points;
      hexWorld.setCities([...portCoordinates, ...inlandCoordinates]);
    },
    revealInland: (points) => {
      inlandExplored = points;
      inlandFogKey = points.map((p) => `${p.lon},${p.lat}`).join(";");
    },
    dispose: () => {
      hexWorld.dispose();
      disposeTree(group);
      group.clear();
    },
  };
}
