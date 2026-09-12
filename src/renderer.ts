import * as THREE from "three";
import { buildRealmOverlay, type RealmMap } from "./scene/realm";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { WebGPURenderer } from "three/webgpu";
import { buildHarbor, coast, type HarborScene } from "./scene/harbor";
import { ports, type GameState, type Port } from "./sim";
import { buildOcean, type OceanScene } from "./scene/ocean";
import { groundHeight, setElevationRaster } from "./scene/terrain-elevation";
import { bindMapPointer } from "./map-pointer";
import {
  initializeNavigationGeography,
  portPoint,
  type GeoPoint,
  type NavigationState,
  type NavHazard,
} from "./navigation";

type Backend = THREE.WebGLRenderer | WebGPURenderer;

/** One orthographic, dimensional world; simulation state never depends on the camera. */
export class WorldRenderer {
  private scene = new THREE.Scene();
  private camera = new THREE.OrthographicCamera(-60, 60, 50, -50, 0.1, 700);
  private renderer: Backend | null = null;
  private controls: OrbitControls | null = null;
  private harbor: HarborScene | null = null;
  private ocean: OceanScene | null = null;
  private realm: ReturnType<typeof buildRealmOverlay> | null = null;
  private realmData: RealmMap = { cities: [], roads: [], caravans: [] };
  private oceanView = false;
  private followingShip = false;
  private gestureTarget: THREE.Vector3 | null = null;
  private viewingWorld = false;
  private navigation: NavigationState | null = null;
  private oceanPorts: Port[] = [];
  private onOceanPort: ((id: string) => void) | null = null;
  private onOceanPoint: ((point: GeoPoint) => void) | null = null;
  private pointerOrigin: { x: number; y: number; time: number } | null = null;
  private disposeMapPointer: (() => void) | null = null;
  private harborCamera: {
    position: THREE.Vector3;
    target: THREE.Vector3;
    zoom: number;
  } | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private sun = new THREE.DirectionalLight(0xffedc5, 2.5);
  private ambient = new THREE.HemisphereLight(0xe4eed5, 0x617052, 2.1);
  private water: THREE.Mesh | null = null;
  private frame = 0;
  private disposed = false;
  private portId = "";
  private eraIndex = -1;
  private voyage: number | null = null;
  private elapsed = 0;
  private lastTimestamp = 0;
  private defaultTarget = new THREE.Vector3(0, 0, -11);
  private cameraOffset = new THREE.Vector3(81, 101, 121);
  private targetTween: {
    from: THREE.Vector3;
    to: THREE.Vector3;
    start: number;
    fromZoom?: number;
    toZoom?: number;
    follow?: boolean;
  } | null = null;
  private desiredDaylight = 0.78;
  private currentDaylight = 0.78;
  private kind: "webgpu" | "webgl2" = "webgl2";
  private onVisibility = () => {
    this.lastTimestamp = 0;
  };

  constructor(private container: HTMLElement) {}

  async init(): Promise<"webgpu" | "webgl2"> {
    if (this.renderer) return this.kind;
    const isSmallScreen = this.container.clientWidth < 760;
    let lowQuality = false;
    try {
      lowQuality = localStorage.getItem("remote-trade-quality") === "low";
    } catch {
      /* Defaults are usable without storage. */
    }
    const navigatorGPU = (
      navigator as Navigator & {
        gpu?: { requestAdapter: () => Promise<unknown> };
      }
    ).gpu;
    if (navigatorGPU) {
      let candidate: WebGPURenderer | null = null;
      try {
        const adapter = await navigatorGPU.requestAdapter();
        if (adapter) {
          const { WebGPURenderer: GPURenderer } = await import("three/webgpu");
          candidate = new GPURenderer({
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
          });
          await candidate.init();
          this.renderer = candidate;
          this.kind = "webgpu";
        }
      } catch (error) {
        candidate?.dispose();
        console.info("WebGPU unavailable; using WebGL2.", error);
      }
    }
    if (!this.renderer) {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });
      this.kind = "webgl2";
    }
    if (this.disposed) {
      this.renderer.dispose();
      return this.kind;
    }
    this.renderer.setPixelRatio(
      lowQuality
        ? 1
        : Math.min(window.devicePixelRatio || 1, isSmallScreen ? 1.5 : 1.65),
    );
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.06;
    this.renderer.shadowMap.enabled = !lowQuality;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.domElement.className = "harbor-canvas";
    this.renderer.domElement.setAttribute(
      "aria-label",
      "可拖动和缩放的港口立体地图",
    );
    this.renderer.domElement.style.cssText =
      "display:block;width:100%;height:100%;touch-action:none;outline:none";
    this.container.querySelector("canvas")?.remove();
    this.container.insertBefore(
      this.renderer.domElement,
      this.container.firstChild,
    );
    this.scene.background = new THREE.Color(0xb7cbb8);
    this.scene.fog = new THREE.Fog(0xb7cbb8, 225, 385);
    this.scene.add(this.ambient);
    this.sun.position.set(-55, 105, 50);
    this.sun.target.position.set(0, 0, -20);
    this.sun.castShadow = true;
    const resolution = isSmallScreen ? 1024 : 2048;
    this.sun.shadow.mapSize.set(resolution, resolution);
    Object.assign(this.sun.shadow.camera, {
      left: -90,
      right: 90,
      top: 90,
      bottom: -90,
      near: 1,
      far: 240,
    });
    this.sun.shadow.bias = -0.0004;
    this.sun.shadow.normalBias = 0.16;
    this.sun.shadow.radius = 3;
    this.scene.add(this.sun, this.sun.target);
    const fill = new THREE.DirectionalLight(0xd6e9e1, 0.35);
    fill.position.set(70, 30, -70);
    this.scene.add(fill);
    this.createWater();
    this.camera.position.copy(this.defaultTarget).add(this.cameraOffset);
    this.camera.lookAt(this.defaultTarget);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.copy(this.defaultTarget);
    this.controls.enableRotate = false;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.screenSpacePanning = false;
    this.controls.zoomToCursor = false;
    this.controls.panSpeed = 0.85;
    this.controls.zoomSpeed = 0.6;
    this.controls.minZoom = 0.85;
    this.controls.maxZoom = 2.6;
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN,
    };
    this.controls.touches = {
      ONE: THREE.TOUCH.PAN,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };
    this.controls.addEventListener("start", () => {
      this.targetTween = null;
      // Browsing zooms toward the cursor; following keeps the fleet centered.
      this.controls!.zoomToCursor = this.oceanView && !this.followingShip;
      this.gestureTarget = this.controls!.target.clone();
    });
    this.controls.addEventListener("change", () => {
      if (!this.gestureTarget) return;
      this.viewingWorld = false;
      // Wheel/pinch zoom retains fleet follow; only moving the map releases it.
      if (this.gestureTarget.distanceToSquared(this.controls!.target) > 0.0001)
        this.followingShip = false;
    });
    this.controls.addEventListener("end", () => {
      this.gestureTarget = null;
    });
    this.setPort(ports[0], 0);
    const coastResponse = await fetch("/data/land.geojson");
    if (!coastResponse.ok) throw new Error("世界海岸资料加载失败，请刷新重试");
    const geography: unknown = await coastResponse.json();
    initializeNavigationGeography(geography);
    const elevationResponse = await fetch("/data/elevation.bin");
    if (elevationResponse.ok)
      setElevationRaster(new Uint8Array(await elevationResponse.arrayBuffer()));
    if (this.disposed) return this.kind;
    this.ocean = buildOcean(geography);
    this.ocean.group.visible = false;
    this.scene.add(this.ocean.group);
    this.realm = buildRealmOverlay();
    this.ocean.group.add(this.realm.group);
    this.renderer.domElement.addEventListener(
      "pointerdown",
      this.oceanPointerDown,
    );
    this.renderer.domElement.addEventListener("pointerup", this.oceanPointerUp);
    this.disposeMapPointer = bindMapPointer(
      this.container.parentElement ?? this.container,
      this.renderer.domElement,
      {
        enabled: () => this.oceanView,
        beginDrag: () => {
          this.followingShip = false;
          this.targetTween = null;
          this.viewingWorld = false;
        },
        pan: (dx, dy) => this.panMap(dx, dy),
        select: (x, y) => this.pickOceanPoint(x, y),
      },
    );
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);
    this.resize();
    document.addEventListener("visibilitychange", this.onVisibility);
    this.renderer.setAnimationLoop(this.animate);
    return this.kind;
  }

  private createWater() {
    const geometry = new THREE.PlaneGeometry(650, 650, 90, 90);
    geometry.rotateX(-Math.PI / 2);
    const positions = geometry.attributes.position;
    const colors = new Float32Array(positions.count * 3),
      base = new THREE.Color(),
      near = new THREE.Color(0x6e9b8d),
      deep = new THREE.Color(0x477e80);
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i),
        z = positions.getZ(i);
      base
        .copy(near)
        .lerp(deep, THREE.MathUtils.smoothstep(z - coast(x), 0, 70));
      colors[i * 3] = base.r;
      colors[i * 3 + 1] = base.g;
      colors[i * 3 + 2] = base.b;
    }
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.38,
      metalness: 0.08,
      flatShading: false,
    });
    this.water = new THREE.Mesh(geometry, material);
    this.water.receiveShadow = true;
    this.scene.add(this.water);
  }

  private resize() {
    if (!this.renderer) return;
    const width = Math.max(1, this.container.clientWidth),
      height = Math.max(1, this.container.clientHeight),
      aspect = width / height;
    // Narrow screens show a wider vertical slice so the town and roadstead stay together.
    const viewHeight = this.oceanView
      ? aspect < 0.8
        ? 195
        : 225
      : aspect < 0.8
        ? 108
        : aspect < 1.2
          ? 101
          : 96;
    this.camera.left = (-viewHeight * aspect) / 2;
    this.camera.right = (viewHeight * aspect) / 2;
    this.camera.top = viewHeight / 2;
    this.camera.bottom = -viewHeight / 2;
    if (this.oceanView && this.viewingWorld) {
      this.camera.zoom = this.worldZoom();
      if (this.targetTween) this.targetTween.toZoom = this.camera.zoom;
    }
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  private animate = (timestamp: number) => {
    if (this.disposed || !this.renderer || document.hidden) return;
    const dt = this.lastTimestamp
      ? Math.min((timestamp - this.lastTimestamp) / 1000, 0.05)
      : 0;
    this.lastTimestamp = timestamp;
    this.elapsed += dt;
    if (this.targetTween && this.controls) {
      const t = Math.min((performance.now() - this.targetTween.start) / 650, 1),
        eased = t * t * (3 - 2 * t);
      const next = this.targetTween.from
        .clone()
        .lerp(this.targetTween.to, eased);
      this.camera.position.add(next.clone().sub(this.controls.target));
      this.controls.target.copy(next);
      if (this.targetTween.toZoom !== undefined) {
        this.camera.zoom = THREE.MathUtils.lerp(
          this.targetTween.fromZoom ?? this.camera.zoom,
          this.targetTween.toZoom,
          eased,
        );
        this.camera.updateProjectionMatrix();
      }
      if (t === 1) {
        this.followingShip = !!this.targetTween.follow;
        this.targetTween = null;
      }
    }
    this.controls?.update();
    if (
      this.oceanView &&
      this.followingShip &&
      this.navigation &&
      this.controls
    ) {
      const target = new THREE.Vector3(
        this.navigation.position.lon,
        0,
        -this.navigation.position.lat,
      );
      this.camera.position.add(target.clone().sub(this.controls.target));
      this.controls.target.copy(target);
    }
    if (this.controls) {
      const target = this.controls.target,
        bounded = target.clone();
      bounded.x = THREE.MathUtils.clamp(
        bounded.x,
        this.oceanView ? -180 : -70,
        this.oceanView ? 180 : 75,
      );
      bounded.z = THREE.MathUtils.clamp(
        bounded.z,
        this.oceanView ? -90 : -70,
        this.oceanView ? 90 : 65,
      );
      bounded.y = 0;
      this.camera.position.add(bounded.clone().sub(target));
      target.copy(bounded);
    }
    if (this.oceanView) {
      if (this.controls)
        this.ocean?.updateView(
          this.controls.target.x,
          -this.controls.target.z,
          (this.camera.right - this.camera.left) / this.camera.zoom,
          (this.camera.top - this.camera.bottom) / this.camera.zoom,
        );
      this.ocean?.animate(this.elapsed);
      this.realm?.animate(this.elapsed);
    } else this.harbor?.update(this.elapsed, this.voyage);
    this.currentDaylight +=
      (this.desiredDaylight - this.currentDaylight) * Math.min(dt * 0.7, 1);
    this.sun.intensity = this.oceanView
      ? 1.05
      : 1.8 + this.currentDaylight * 0.9;
    this.ambient.intensity = this.oceanView
      ? 1.8
      : 1.65 + this.currentDaylight * 0.45;
    if (!this.oceanView && this.water && this.frame++ % 3 === 0) {
      const position = this.water.geometry.attributes.position;
      for (let i = 0; i < position.count; i++) {
        const x = position.getX(i),
          z = position.getZ(i);
        position.setY(
          i,
          -0.06 +
            Math.sin(x * 0.07 + this.elapsed * 0.65) * 0.035 +
            Math.sin(z * 0.095 + x * 0.04 - this.elapsed * 0.5) * 0.04,
        );
      }
      position.needsUpdate = true;
      this.water.geometry.computeVertexNormals();
    }
    this.renderer.render(this.scene, this.camera);
  };

  setPort(port: Port, eraIndex = 0) {
    if (!port || (port.id === this.portId && eraIndex === this.eraIndex))
      return;
    this.portId = port.id;
    this.eraIndex = eraIndex;
    if (this.harbor) {
      this.scene.remove(this.harbor.group);
      this.harbor.dispose();
    }
    this.harbor = buildHarbor(port.id, eraIndex);
    this.harbor.group.visible = !this.oceanView;
    this.scene.add(this.harbor.group);
  }

  updateState(state: GameState) {
    const port = ports.find((p) => p.id === state.currentPortId);
    if (port) {
      if (this.oceanView) {
        this.portId = port.id;
        this.eraIndex = state.eraIndex;
      } else this.setPort(port, state.eraIndex);
    }
    // Tolerates saved games from before continuous voyages were introduced.
    const travel = (
      state as GameState & {
        voyage?: {
          progress?: number;
          elapsedDays?: number;
          durationDays?: number;
          daysTotal?: number;
          daysElapsed?: number;
          totalDays?: number;
        } | null;
      }
    ).voyage;
    if (travel) {
      this.setVoyage(
        travel.progress ??
          (travel.elapsedDays ?? travel.daysElapsed ?? 0) /
            Math.max(
              1,
              travel.durationDays ?? travel.totalDays ?? travel.daysTotal ?? 1,
            ),
      );
    } else this.setVoyage(null);
  }

  getLandmarks(): Array<{ id: string; name: string; x: number; y: number }> {
    if (this.oceanView) return [];
    this.camera.updateMatrixWorld();
    return (this.harbor?.landmarks ?? []).map((landmark) => {
      const p = landmark.position.clone().project(this.camera);
      return {
        id: landmark.id,
        name: landmark.name,
        x: (p.x + 1) * 50,
        y: (1 - p.y) * 50,
      };
    });
  }

  focusLandmark(id: string) {
    const landmark = this.harbor?.landmarks.find((p) => p.id === id);
    if (!landmark || !this.controls) return;
    this.targetTween = {
      from: this.controls.target.clone(),
      to: new THREE.Vector3(landmark.position.x, 0, landmark.position.z),
      start: performance.now(),
    };
  }

  zoomBy(factor: number) {
    if (!Number.isFinite(factor) || factor <= 0) return;
    this.targetTween = null;
    this.viewingWorld = false;
    this.camera.zoom = THREE.MathUtils.clamp(
      this.camera.zoom * factor,
      this.oceanView ? 0.85 : 0.65,
      this.oceanView ? 32 : 2.6,
    );
    this.camera.updateProjectionMatrix();
  }

  zoom(factor: number) {
    this.zoomBy(factor);
  }

  setQuality(quality: "low" | "high") {
    if (!this.renderer) return;
    try {
      localStorage.setItem("remote-trade-quality", quality);
    } catch {
      /* Session setting remains active. */
    }
    this.renderer.setPixelRatio(
      quality === "low" ? 1 : Math.min(window.devicePixelRatio || 1, 1.65),
    );
    this.renderer.shadowMap.enabled = quality !== "low";
    this.resize();
  }

  focusAt(point: GeoPoint, zoom = 12, follow = false) {
    if (!this.controls || !this.oceanView) return;
    this.followingShip = false;
    this.viewingWorld = false;
    this.targetTween = {
      from: this.controls.target.clone(),
      to: new THREE.Vector3(point.lon, 0, -point.lat),
      start: performance.now(),
      fromZoom: this.camera.zoom,
      toZoom: Math.max(0.85, Math.min(32, zoom)),
      follow,
    };
  }
  getZoom() {
    return this.camera.zoom;
  }
  getMapView() {
    const target = this.controls?.target ?? this.defaultTarget;
    const center = { lon: target.x, lat: -target.z };
    let cityName = "",
      nearest = Infinity;
    const candidates = [
      ...this.oceanPorts.map((port) => ({
        ...portPoint(port),
        name: port.name,
      })),
      ...this.realmData.cities,
    ];
    for (const city of candidates) {
      const distance = Math.hypot(city.lon - center.lon, city.lat - center.lat);
      if (distance < nearest) {
        nearest = distance;
        cityName = city.name;
      }
    }
    const span = (this.camera.right - this.camera.left) / this.camera.zoom;
    return {
      following: this.followingShip || !!this.targetTween?.follow,
      cityName: nearest < Math.min(12, span * 0.24) ? cityName : "",
      regional: this.camera.zoom <= 4,
    };
  }
  private worldZoom() {
    // Keep the far view regional, like a strategy game; do not fit the globe.
    return 1.8;
  }
  focusWorld() {
    const point = this.controls
      ? { lon: this.controls.target.x, lat: -this.controls.target.z }
      : (this.navigation?.position ?? { lon: 0, lat: 6 });
    this.focusAt(point, this.worldZoom());
    this.viewingWorld = true;
  }
  resetCamera() {
    this.targetTween = null;
    if (this.oceanView) {
      this.followingShip = false;
      this.camera.zoom = 1;
      this.controls?.target.set(0, 0, -6);
      this.camera.position.set(0, 200, 114);
      this.camera.lookAt(0, 0, -6);
      this.camera.updateProjectionMatrix();
      this.controls?.update();
      return;
    }
    this.camera.zoom = 1;
    this.camera.position.copy(this.defaultTarget).add(this.cameraOffset);
    this.controls?.target.copy(this.defaultTarget);
    this.camera.lookAt(this.defaultTarget);
    this.camera.updateProjectionMatrix();
    this.controls?.update();
  }

  setDaylight(fraction: number) {
    if (Number.isFinite(fraction))
      this.desiredDaylight = 0.52 + Math.sin((fraction % 1) * Math.PI) * 0.48;
  }
  setTime(fraction: number) {
    this.setDaylight(fraction);
  }
  setVoyage(progress: number | null) {
    this.voyage =
      progress === null ? null : THREE.MathUtils.clamp(progress, 0, 1);
  }
  async exportScene(): Promise<ArrayBuffer> {
    if (!this.harbor) throw new Error("港湾场景尚未加载");
    const { GLTFExporter } =
      await import("three/addons/exporters/GLTFExporter.js");
    const result = await new GLTFExporter().parseAsync(this.harbor.group, {
      binary: true,
      onlyVisible: true,
    });
    if (!(result instanceof ArrayBuffer)) throw new Error("模型导出失败");
    return result;
  }
  setMode(_mode: string) {
    /* Legacy saves always use the unified orthographic world. */
  }
  updatePorts(_ports: Port[]) {}
  showRoute(from: Port, _to: Port | null) {
    this.setPort(from, Math.max(0, this.eraIndex));
  }
  placeShip(progress: number | Port, traveling = false) {
    if (typeof progress === "number")
      this.setVoyage(traveling ? progress : null);
  }

  setOceanView(enabled: boolean) {
    if (!this.ocean || !this.controls || enabled === this.oceanView) return;
    this.targetTween = null;
    if (enabled) {
      this.harborCamera = {
        position: this.camera.position.clone(),
        target: this.controls.target.clone(),
        zoom: this.camera.zoom,
      };
      const at =
        this.navigation?.position ??
        portPoint(ports.find((p) => p.id === this.portId) ?? ports[0]);
      this.controls.target.set(at.lon, 0, -at.lat);
      this.camera.position
        .copy(this.controls.target)
        .add(new THREE.Vector3(0, 200, 120));
      this.camera.zoom = 2.3;
      this.controls.minZoom = 0.85;
      this.controls.maxZoom = 32;
      this.scene.background = new THREE.Color(0x173d52);
      this.scene.fog = null;
      this.followingShip = true;
    } else {
      this.controls.minZoom = 0.85;
      this.controls.maxZoom = 2.6;
      if (this.harborCamera) {
        this.camera.position.copy(this.harborCamera.position);
        this.controls.target.copy(this.harborCamera.target);
        this.camera.zoom = this.harborCamera.zoom;
      }
      this.scene.background = new THREE.Color(0xb7cbb8);
      this.scene.fog = new THREE.Fog(0xb7cbb8, 225, 385);
      this.followingShip = false;
    }
    this.oceanView = enabled;
    this.ocean.group.visible = enabled;
    if (this.harbor) this.harbor.group.visible = !enabled;
    if (this.water) this.water.visible = !enabled;
    this.renderer?.domElement.setAttribute(
      "aria-label",
      enabled
        ? "可平移缩放的世界航海图，点击城市选择停靠，点击海面设置航点"
        : "可拖动和缩放的港口立体地图",
    );
    this.camera.lookAt(this.controls.target);
    this.controls.update();
    this.resize();
  }
  isOceanView() {
    return this.oceanView;
  }
  updateNavigation(
    nav: NavigationState,
    availablePorts: Port[],
    hazards: NavHazard[],
  ) {
    this.navigation = nav;
    this.oceanPorts = availablePorts;
    this.ocean?.update(nav, availablePorts, hazards);
  }
  updateCivilization(data: RealmMap) {
    this.realmData = data;
    this.realm?.update(data);
    this.ocean?.setInlandCities(data.cities);
    this.ocean?.revealInland(
      data.cities.filter((c) => c.known !== false || c.owned),
    );
  }
  /**
   * Use the city model's terrain height for both DOM labels and canvas picking.
   * The terrain is continuous and not flat, so fixed
   * heights make labels drift a long way above towns at regional zooms (and
   * can project them outside the HUD at maximum zoom).
   */
  private markerAnchor(point: GeoPoint, lift: number) {
    return new THREE.Vector3(
      point.lon,
      groundHeight(point.lon, point.lat) + lift,
      -point.lat,
    );
  }
  getInlandMarkers() {
    if (!this.oceanView) return [];
    this.camera.updateMatrixWorld();
    return this.realmData.cities
      .map((c) => {
        // Town flags are roughly one world unit above the relief surface.
        const p = this.markerAnchor(c, 1.12).project(this.camera);
        return {
          id: c.id,
          name: c.name,
          owned: c.owned,
          known: c.known !== false,
          x: (p.x + 1) * 50,
          y: (1 - p.y) * 50,
        };
      })
      .filter((p) => p.x > 2 && p.x < 98 && p.y > 5 && p.y < 95);
  }
  setMapInteraction(
    onPort: (id: string) => void,
    onPoint: (point: GeoPoint) => void,
  ) {
    this.onOceanPort = onPort;
    this.onOceanPoint = onPoint;
  }
  getOceanMarkers(): {
    id: string;
    name: string;
    x: number;
    y: number;
    visited: boolean;
  }[] {
    if (!this.oceanView) return [];
    this.camera.updateMatrixWorld();
    // The DOM layer owns priority/collision filtering; return all on-screen
    // ports so focusing a region cannot discard cities by fleet distance.
    return this.oceanPorts
      .map((port) => {
        const at = portPoint(port),
          p = this.markerAnchor(at, 1.12).project(this.camera);
        return {
          id: port.id,
          name: port.name,
          x: (p.x + 1) * 50,
          y: (1 - p.y) * 50,
          visited: this.navigation?.discovered.includes(port.id) ?? false,
        };
      })
      .filter((p) => p.x > 2 && p.x < 98 && p.y > 5 && p.y < 95);
  }
  followShip() {
    if (!this.oceanView || !this.navigation || !this.controls) return;
    this.targetTween = null;
    this.viewingWorld = false;
    this.followingShip = true;
    const target = new THREE.Vector3(
      this.navigation.position.lon,
      0,
      -this.navigation.position.lat,
    );
    this.camera.position.add(target.clone().sub(this.controls.target));
    this.controls.target.copy(target);
    this.controls.update();
  }
  private oceanPointerDown = (event: PointerEvent) => {
    if (this.oceanView && event.button === 0)
      this.pointerOrigin = {
        x: event.clientX,
        y: event.clientY,
        time: performance.now(),
      };
  };
  private oceanPointerUp = (event: PointerEvent) => {
    const origin = this.pointerOrigin;
    this.pointerOrigin = null;
    if (
      !origin ||
      !this.oceanView ||
      !this.renderer ||
      Math.hypot(origin.x - event.clientX, origin.y - event.clientY) > 7 ||
      performance.now() - origin.time > 550
    )
      return;
    this.pickOceanPoint(event.clientX, event.clientY);
  };
  private panMap(dx: number, dy: number) {
    if (!this.renderer || !this.controls) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.camera.updateMatrixWorld();
    const right = new THREE.Vector3().setFromMatrixColumn(
      this.camera.matrixWorld,
      0,
    );
    const screenUp = new THREE.Vector3().setFromMatrixColumn(
      this.camera.matrixWorld,
      1,
    );
    const up = new THREE.Vector3()
      .crossVectors(this.camera.up, right)
      .normalize();
    const offset = right
      .multiplyScalar(
        (-dx * (this.camera.right - this.camera.left)) /
          (this.camera.zoom * Math.max(1, rect.width)),
      )
      .addScaledVector(
        up,
        (dy * (this.camera.top - this.camera.bottom)) /
          (this.camera.zoom *
            Math.max(1, rect.height) *
            Math.max(0.1, up.dot(screenUp))),
      );
    this.camera.position.add(offset);
    this.controls.target.add(offset);
    this.controls.update();
  }
  private pickOceanPoint(clientX: number, clientY: number) {
    if (!this.renderer || !this.oceanView) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.camera.updateMatrixWorld();
    let selectedId = "",
      nearest = Math.max(
        20,
        Math.min(
          72,
          (rect.width * this.camera.zoom * 0.62) /
            (this.camera.right - this.camera.left),
        ),
      );
    const pointer = new THREE.Vector2(clientX - rect.left, clientY - rect.top);
    const consider = (id: string, point: GeoPoint) => {
      const project = (lift: number) => {
        const screen = this.markerAnchor(point, lift).project(this.camera);
        return new THREE.Vector2(
          ((screen.x + 1) * rect.width) / 2,
          ((1 - screen.y) * rect.height) / 2,
        );
      };
      const foot = project(0.06),
        crown = project(1.12),
        stem = crown.clone().sub(foot),
        t = THREE.MathUtils.clamp(
          pointer.clone().sub(foot).dot(stem) /
            Math.max(0.001, stem.lengthSq()),
          0,
          1,
        );
      // The hit area follows the full town from ground to roof, with a small
      // screen-space minimum.  At close zoom clicking a building must work as
      // well as clicking the label above it.
      const distance = pointer.distanceTo(foot.addScaledVector(stem, t));
      if (distance < nearest) {
        selectedId = id;
        nearest = distance;
      }
    };
    for (const port of this.oceanPorts) consider(port.id, portPoint(port));
    for (const city of this.realmData.cities) consider(city.id, city);
    if (selectedId) {
      this.onOceanPort?.(selectedId);
      return;
    }
    const ray = new THREE.Raycaster();
    ray.setFromCamera(
      new THREE.Vector2(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        1 - ((clientY - rect.top) / rect.height) * 2,
      ),
      this.camera,
    );
    const at = ray.ray.intersectPlane(
      new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
      new THREE.Vector3(),
    );
    if (at && at.x >= -180 && at.x <= 180 && at.z >= -90 && at.z <= 90)
      this.onOceanPoint?.({ lon: at.x, lat: -at.z });
  }

  dispose() {
    this.disposed = true;
    this.renderer?.setAnimationLoop(null);
    this.resizeObserver?.disconnect();
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.controls?.dispose();
    this.disposeMapPointer?.();
    this.disposeMapPointer = null;
    this.harbor?.dispose();
    this.realm?.dispose();
    this.realm = null;
    this.ocean?.dispose();
    this.renderer?.domElement.removeEventListener(
      "pointerdown",
      this.oceanPointerDown,
    );
    this.renderer?.domElement.removeEventListener(
      "pointerup",
      this.oceanPointerUp,
    );
    if (this.water) {
      this.water.geometry.dispose();
      (this.water.material as THREE.Material).dispose();
    }
    this.sun.shadow.map?.dispose();
    this.renderer?.dispose();
    this.renderer?.domElement.remove();
    this.scene.clear();
    this.renderer = null;
  }
}
