import { build } from "esbuild";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
await build({
  stdin: {
    contents:
      'export * from "./src/dominion.ts"; export { ports } from "./src/data.ts";',
    resolveDir: process.cwd(),
  },
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: "work/dominion-bundle.mjs",
});
const {
  Dominion,
  createDominionState,
  readDominionState,
  inlandCities,
  inlandRoads,
  ports,
} = await import("./dominion-bundle.mjs");
const fixture = (cash = 100000, eraIndex = 10) => {
  const host = {
    day: 1,
    eraIndex,
    currentPortId: "memphis",
    cash,
    atSea: false,
    reputation: 50,
    visited: ["memphis", "byblos", "ur", "magAN", "lisbon", "manila", "havana"],
    spendCash(amount) {
      assert.ok(Number.isFinite(amount) && amount >= 0);
      if (this.cash < amount) return false;
      this.cash -= amount;
      return true;
    },
    addCash(amount) {
      assert.ok(Number.isFinite(amount) && amount >= 0);
      this.cash += amount;
    },
    addReputation(amount) {
      this.reputation += amount;
    },
  };
  const state = createDominionState(),
    dominion = new Dominion(state, host);
  return { host, state, dominion };
};
let checks = 0;
const test = (name, run) => {
  run();
  console.log(`PASS ${name}`);
  checks++;
};
test("Expanded inland cities use real coordinates and never replace ports", () => {
  assert.ok(inlandCities.length >= 190);
  assert.equal(
    new Set(inlandCities.map((c) => c.id)).size,
    inlandCities.length,
  );
  assert.ok(
    inlandCities.every(
      (c) =>
        !ports.some((p) => p.id === c.id) &&
        Math.abs(c.lon) < 180 &&
        Math.abs(c.lat) < 80 &&
        c.era >= 0 &&
        c.era <= 10,
    ),
  );
});
const coastline = JSON.parse(
  await readFile("public/data/land.geojson", "utf8"),
);
const rings = coastline.features.flatMap((f) =>
  f.geometry.type === "Polygon"
    ? f.geometry.coordinates
    : f.geometry.coordinates.flat(),
);
function land(lon, lat) {
  let inside = false;
  for (const ring of rings)
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [x1, y1] = ring[i],
        [x2, y2] = ring[j];
      if (
        y1 > lat !== y2 > lat &&
        lon < ((x2 - x1) * (lat - y1)) / (y2 - y1) + x1
      )
        inside = !inside;
    }
  return inside;
}
test("Explicit caravan roads stay on continental land, without ocean jumps", () => {
  assert.equal(new Set(inlandRoads.map((r) => r.id)).size, inlandRoads.length);
  for (const road of inlandRoads) {
    assert.ok(road.km > 0 && road.km < 5000, road.id);
    const samples = [];
    for (let i = 1; i < road.waypoints.length; i++) {
      const a = road.waypoints[i - 1],
        b = road.waypoints[i];
      for (let t = 0.2; t <= 0.8; t += 0.2)
        samples.push(
          land(a.lon + (b.lon - a.lon) * t, a.lat + (b.lat - a.lat) * t),
        );
    }
    assert.ok(
      samples.filter(Boolean).length / samples.length >= 0.7,
      `${road.id} crosses water`,
    );
  }
});
test("City charter purchase checks discovery, dock location, money, and duplicate ownership atomically", () => {
  const { host, state, dominion } = fixture(500);
  assert.equal(dominion.purchase("memphis").ok, false);
  assert.equal(host.cash, 500);
  assert.deepEqual(state.owned, {});
  host.cash = 10000;
  assert.equal(dominion.purchase("byblos").ok, false);
  host.atSea = true;
  assert.equal(dominion.purchase("memphis").ok, false);
  host.atSea = false;
  assert.equal(dominion.purchase("memphis").ok, true);
  const cash = host.cash;
  assert.equal(dominion.purchase("memphis").ok, false);
  assert.equal(host.cash, cash);
  assert.equal(dominion.purchase("alexandria").ok, false);
});
test("Inland exploration is locked until a connected coastal charter is owned", () => {
  const { dominion } = fixture();
  assert.deepEqual(dominion.routes(), []);
  assert.equal(dominion.purchase("thebes").ok, false);
  assert.equal(dominion.sendCaravan("memphis:thebes").ok, false);
  dominion.purchase("memphis");
  assert.ok(
    dominion.routes().some((r) => r.toId === "thebes" && !r.discovered),
  );
});
test("Caravans charge cargo/supplies upfront, discover on return, and pay only once", () => {
  const { dominion, host, state } = fixture();
  dominion.purchase("memphis");
  const route = dominion.routes().find((r) => r.toId === "thebes"),
    before = host.cash;
  assert.equal(dominion.sendCaravan(route.id).ok, true);
  assert.equal(host.cash, before - route.cost);
  assert.equal(dominion.sendCaravan(route.id).ok, false);
  assert.equal(state.discovered.includes("thebes"), false);
  host.day += route.days - 1;
  assert.equal(
    dominion.daily().messages.some((m) => m.includes("归来")),
    false,
  );
  assert.equal(state.discovered.includes("thebes"), false);
  host.day++;
  const result = dominion.daily();
  assert.ok(result.messages.some((m) => m.includes(`${route.reward}`)));
  assert.ok(state.discovered.includes("thebes"));
  assert.equal(state.activeCaravans.length, 0);
  const paid = host.cash;
  assert.deepEqual(dominion.daily().messages, []);
  assert.equal(host.cash, paid);
  assert.equal(dominion.purchase("thebes").ok, true);
  assert.equal(state.owned.thebes.method, "charter");
});
test("Caravan capacity is three and route duplicates cannot consume funds", () => {
  const { host, state, dominion } = fixture();
  for (const id of ["memphis", "byblos", "ur", "magAN"]) {
    host.currentPortId = id;
    assert.equal(dominion.purchase(id).ok, true);
  }
  const routes = dominion.routes();
  for (const route of routes.slice(0, 3))
    assert.equal(dominion.sendCaravan(route.id).ok, true);
  const before = host.cash;
  assert.equal(dominion.sendCaravan(routes[3].id).ok, false);
  assert.equal(host.cash, before);
  assert.equal(state.activeCaravans.length, 3);
});
test("Development is limited, consumes money, and food changes city income", () => {
  const { host, state, dominion } = fixture();
  dominion.purchase("memphis");
  assert.equal(dominion.develop("thebes", "food").ok, false);
  for (let i = 0; i < 3; i++)
    assert.equal(dominion.develop("memphis", "commerce").ok, true);
  const income = dominion.cities().find((c) => c.id === "memphis").income;
  dominion.develop("memphis", "food");
  assert.ok(dominion.cities().find((c) => c.id === "memphis").income > income);
  const before = host.cash;
  assert.equal(dominion.develop("memphis", "commerce").ok, false);
  assert.equal(host.cash, before);
  assert.equal(state.owned.memphis.commerce, 3);
});
test("Recruitment requires owned dock, integer quantity, money, and <=100 soldiers", () => {
  const { host, state, dominion } = fixture();
  assert.equal(dominion.recruit(10).ok, false);
  dominion.purchase("memphis");
  assert.equal(dominion.recruit(-1).ok, false);
  assert.equal(dominion.recruit(1.5).ok, false);
  host.atSea = true;
  assert.equal(dominion.recruit(10).ok, false);
  host.atSea = false;
  assert.equal(dominion.recruit(95).ok, true);
  assert.equal(dominion.recruit(6).ok, false);
  assert.equal(state.troops, 95);
  assert.ok(dominion.army().upkeep > 0);
  host.cash = 1;
  assert.equal(dominion.recruit(1).ok, false);
});
test("Campaigns cannot teleport into another ocean or target unknown inland cities", () => {
  const { dominion } = fixture();
  dominion.purchase("memphis");
  dominion.recruit(40);
  const targets = dominion.campaignTargets();
  assert.ok(targets.some((t) => t.id === "byblos"));
  assert.ok(
    !targets.some((t) =>
      ["manila", "havana", "lisbon", "thebes"].includes(t.id),
    ),
  );
});
test("A strong prepared army resolves once, owns a low-loyalty city, and loses soldiers/reputation", () => {
  const { host, state, dominion } = fixture();
  dominion.purchase("memphis");
  dominion.recruit(100);
  const before = host.reputation;
  assert.equal(dominion.attack("byblos").ok, true);
  assert.equal(dominion.attack("ur").ok, false);
  assert.equal(dominion.recruit(1).ok, false);
  assert.ok(
    state.campaign.roll < state.campaign.winChance,
    "deterministic victory fixture",
  );
  const saved = readDominionState(JSON.parse(JSON.stringify(state)), host.day);
  assert.ok(saved);
  assert.deepEqual(saved.campaign, state.campaign);
  host.day = state.campaign.arrivesDay;
  const result = dominion.daily();
  assert.ok(result.messages.some((m) => m.includes("控制权")));
  assert.equal(state.owned.byblos.loyalty, 35);
  assert.equal(state.owned.byblos.food, 0);
  assert.ok(state.troops < 100);
  assert.ok(host.reputation < before);
  assert.equal(state.campaign, null);
  const cash = host.cash,
    troops = state.troops;
  dominion.daily();
  assert.equal(host.cash, cash);
  assert.equal(state.troops, troops);
  assert.equal(dominion.attack("byblos").ok, false);
});
test("An underpowered army can lose; insufficient upkeep causes additional attrition", () => {
  const { host, state, dominion } = fixture();
  dominion.purchase("memphis");
  dominion.recruit(1);
  dominion.attack("byblos");
  assert.ok(state.campaign.roll > state.campaign.winChance);
  host.day = state.campaign.arrivesDay;
  assert.ok(dominion.daily().messages.some((m) => m.includes("失利")));
  assert.equal(state.owned.byblos, undefined);
  assert.equal(state.troops, 0);
  dominion.recruit(50);
  host.cash = 0;
  host.day++;
  assert.ok(dominion.daily().messages.some((m) => m.includes("军饷不足")));
  assert.ok(state.troops < 50);
});
test("Daily city revenue is bounded and same-day calls have no effect", () => {
  const { host, dominion } = fixture();
  dominion.purchase("memphis");
  const before = host.cash;
  dominion.daily();
  assert.equal(host.cash, before);
  host.day++;
  dominion.daily();
  const after = host.cash;
  assert.ok(after > before && after - before < 30);
  dominion.daily();
  assert.equal(host.cash, after);
});
test("State migration, defensive cloning, and corruption validation", () => {
  const { host, state, dominion } = fixture();
  dominion.purchase("memphis");
  dominion.sendCaravan(dominion.routes()[0].id);
  dominion.recruit(20);
  const original = JSON.parse(JSON.stringify(state)),
    roundtrip = readDominionState(original, host.day);
  assert.deepEqual(roundtrip, state);
  roundtrip.owned.memphis.food = 3;
  assert.equal(state.owned.memphis.food, 1);
  assert.deepEqual(
    readDominionState(undefined, host.day),
    createDominionState(),
  );
  const bad = [
    null,
    [],
    { ...original, troops: 101 },
    { ...original, troops: NaN },
    { ...original, lastProcessedDay: host.day + 1 },
    { ...original, discovered: ["bogus"] },
    { ...original, armyBaseId: "byblos" },
    { ...original, owned: { bogus: original.owned.memphis } },
    {
      ...original,
      owned: { memphis: { ...original.owned.memphis, commerce: 4 } },
    },
    {
      ...original,
      activeCaravans: [{ ...original.activeCaravans[0], reward: 1e20 }],
    },
    {
      ...original,
      activeCaravans: [{ ...original.activeCaravans[0], toId: "manila" }],
    },
  ];
  for (const corrupted of bad)
    assert.equal(readDominionState(corrupted, host.day), null);
});
console.log(
  `Dominion: ${checks} checks passed; ${inlandCities.length} inland cities and ${inlandRoads.length} explicit roads.`,
);
