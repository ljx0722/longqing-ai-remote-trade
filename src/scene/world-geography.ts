import * as THREE from "three";
import { rivers } from "./river-courses";
import { groundHeight } from "./terrain-elevation";

/** Actual river courses are ribbons draped onto the same relief as cities and forests. */
export function buildGeographicDetail(): THREE.Group {
  const group = new THREE.Group();
  group.name = "真实河网与河岸";
  const banks: number[] = [],
    water: number[] = [],
    glints: number[] = [];
  for (const source of rivers) {
    const points = source.map(([lon, lat]) => new THREE.Vector3(lon, 0, -lat));
    const curve = new THREE.CatmullRomCurve3(points, false, "centripetal");
    const samples = curve.getPoints(
      Math.max(16, Math.ceil(curve.getLength() / 0.18)),
    );
    for (let i = 1; i < samples.length; i++) {
      const a = samples[i - 1],
        b = samples[i],
        length = Math.hypot(b.x - a.x, b.z - a.z);
      if (length < 0.00001) continue;
      const nx = -(b.z - a.z) / length,
        nz = (b.x - a.x) / length;
      const strip = (list: number[], width: number, lift: number) => {
        const v = (p: THREE.Vector3, side: number) => {
          const x = p.x + nx * width * side,
            z = p.z + nz * width * side;
          return [x, groundHeight(x, -z) + lift, z];
        };
        list.push(
          ...v(a, -1),
          ...v(b, 1),
          ...v(b, -1),
          ...v(a, -1),
          ...v(a, 1),
          ...v(b, 1),
        );
      };
      strip(banks, 0.135, 0.026);
      strip(water, 0.085, 0.038);
      if (i % 4 === 0)
        glints.push(
          a.x,
          groundHeight(a.x, -a.z) + 0.052,
          a.z,
          b.x,
          groundHeight(b.x, -b.z) + 0.052,
          b.z,
        );
    }
  }
  for (const [vertices, tint] of [
    [banks, 0x879960],
    [water, 0x579fa4],
  ] as const) {
    const mesh = new THREE.Mesh(
      new THREE.BufferGeometry().setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3),
      ),
      new THREE.MeshBasicMaterial({ color: tint, side: THREE.DoubleSide }),
    );
    group.add(mesh);
  }
  group.add(
    new THREE.LineSegments(
      new THREE.BufferGeometry().setAttribute(
        "position",
        new THREE.Float32BufferAttribute(glints, 3),
      ),
      new THREE.LineBasicMaterial({
        color: 0xa8d6cc,
        transparent: true,
        opacity: 0.5,
      }),
    ),
  );
  return group;
}
