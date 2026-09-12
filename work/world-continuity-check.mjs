import assert from 'node:assert/strict';
import { build } from 'esbuild';

// Keep this suite isolated from the shared bundles used by the ordinary tests.
await build({
  stdin: {
    contents: 'export * from "./src/sim.ts"; export * from "./src/navigation.ts"; export { inlandCities, inlandRoads } from "./src/dominion.ts"; export { majorPorts } from "./src/catalog/major-ports.ts"; import { initializeNavigationGeography } from "./src/navigation.ts"; import land from "./public/data/land.geojson"; initializeNavigationGeography(land);',
    resolveDir: process.cwd(),
  },
  loader: { '.geojson': 'json' }, bundle: true, platform: 'node', format: 'esm',
  outfile: 'work/world-continuity-bundle.mjs',
});
const {
  TradeSim, ports, majorPorts, goods, origins, inlandCities, inlandRoads,
  portPoint, createNavigation, planSeaRoute, advanceNavigation, distanceDegrees,
} = await import('./world-continuity-bundle.mjs');
let groups = 0, failures = 0, roundtrips = 0;
const check = (name, run) => {
  try { run(); groups++; console.log(`PASS ${name}`); }
  catch (error) { failures++; console.error(`FAIL ${name}\n${error.stack}`); }
};
const cityList = [
  ...ports.map(p => ({ ...p, ...portPoint(p) })), ...inlandCities,
];
const cities = new Map(cityList.map(c => [c.id, c]));
const port = id => { const p = ports.find(p => p.id === id); assert(p, `missing port ${id}`); return p; };

check('The world catalog has distinct historical cities, valid coordinates and at least 1,765 named goods', () => {
  assert(ports.length >= 204);
  assert(inlandCities.length >= 202);
  assert(goods.length >= 1765);
  assert.equal(cities.size, cityList.length, 'port and inland city IDs must not overlap');
  assert.equal(new Set(cityList.map(c => c.name)).size, cityList.length, 'city display names must be distinct');
  for (const city of cityList) {
    assert(Number.isFinite(city.lon) && Math.abs(city.lon) <= 180, city.id);
    assert(Number.isFinite(city.lat) && Math.abs(city.lat) <= 90, city.id);
    assert(Number.isInteger(city.era) && city.era >= 0 && city.era <= 10, city.id);
  }
  assert.equal(new Set(goods.map(g => g.id)).size, goods.length);
  assert.equal(new Set(goods.map(g => g.name)).size, goods.length);
});

check('Every inland city is reachable from a port through complete, nonzero roads', () => {
  const graph = new Map(cityList.map(c => [c.id, new Set()]));
  assert.equal(new Set(inlandRoads.map(r => r.id)).size, inlandRoads.length);
  for (const road of inlandRoads) {
    assert(cities.has(road.a) && cities.has(road.b), `missing endpoint ${road.id}`);
    assert.notEqual(road.a, road.b, road.id);
    assert(road.km > 0 && road.waypoints.length >= 2, road.id);
    assert(distanceDegrees(road.waypoints[0], cities.get(road.a)) < .001, road.id);
    assert(distanceDegrees(road.waypoints.at(-1), cities.get(road.b)) < .001, road.id);
    graph.get(road.a).add(road.b); graph.get(road.b).add(road.a);
  }
  const reached = new Set(ports.map(p => p.id)), queue = [...reached];
  for (let i = 0; i < queue.length; i++) {
    for (const next of graph.get(queue[i])) if (!reached.has(next)) { reached.add(next); queue.push(next); }
  }
  assert.deepEqual(inlandCities.filter(c => !reached.has(c.id)).map(c => c.id), [], 'inland cities stranded from all seaports');
});

const pairs = [
  ['shanghai', 'nanjing'], ['nanjing', 'shanghai'],
  ['calcutta', 'dhaka'], ['dhaka', 'calcutta'],
  ['dagon', 'bangkok'], ['bangkok', 'dagon'],
  ['rotterdam', 'le-havre'], ['oslo', 'st-petersburg'],
  ['st-petersburg', 'oslo'], ['oslo', 'helsinki'], ['helsinki', 'oslo'],
  ['hong-kong', 'temasek'], ['goree', 'lagos'],
];
for (const [from, to] of pairs) check(`${from} → ${to} reaches its real destination through navigable water/river access`, () => {
  const nav = createNavigation(port(from), 0);
  nav.route = planSeaRoute(nav.position, port(to)); nav.targetId = to;
  assert(nav.route.length >= 2, `no route ${from} → ${to}`);
  assert(distanceDegrees(nav.route.at(-1), portPoint(port(to))) < .001);
  let reached = false;
  for (let i = 0; i < 2400 && !reached; i++) {
    const result = advanceNavigation(nav, 1.5, 4);
    assert.equal(result.blocked, false, `blocked at ${JSON.stringify(nav.position)}`);
    reached = result.reached;
  }
  assert(reached, 'must actually move to arrival rather than just produce a route');
  assert(distanceDegrees(nav.position, portPoint(port(to))) < .001);
});

for (const [from, to] of [['shanghai', 'nanjing'], ['dhaka', 'calcutta'], ['dagon', 'bangkok']]) {
  check(`${from}: handing the helm back within the river can still reach ${to}`, () => {
    const nav = createNavigation(port(from), 0);
    nav.route = planSeaRoute(nav.position, port(to)); nav.targetId = to;
    assert.equal(advanceNavigation(nav, .2, 4).blocked, false);
    assert(distanceDegrees(nav.position, portPoint(port(from))) > .05, 'must test a moving vessel, not the exact berth');
    nav.manual = true;
    nav.throttle = 0;
    const held = { ...nav.position };
    advanceNavigation(nav, 2, 4); assert.deepEqual(nav.position, held);
    nav.manual = false;
    nav.route = planSeaRoute(nav.position, port(to)); nav.leg = 0;
    assert(nav.route.length >= 2, 'mid-river reroute must exist');
    let reached = false;
    for (let i = 0; i < 2400 && !reached; i++) {
      const result = advanceNavigation(nav, 1.5, 4);
      assert.equal(result.blocked, false, `reroute blocked at ${JSON.stringify(nav.position)}`);
      reached = result.reached;
    }
    assert(reached);
  });
}

check('Every newly added port can sail out to an established regional trading hub', () => {
  const hubs = { china: 'manila', southeast: 'malacca', baltic: 'london', atlantic: 'lisbon', indian: 'calicut', gulf: 'muscat' };
  for (const origin of majorPorts) {
    const destination = port(hubs[origin.basin]);
    const nav = createNavigation(origin, 0);
    nav.route = planSeaRoute(nav.position, destination); nav.targetId = destination.id;
    assert(nav.route.length >= 2, `${origin.id}: regional route unavailable`);
    let reached = false;
    for (let i = 0; i < 2400 && !reached; i++) {
      const result = advanceNavigation(nav, 1.5, 4);
      assert.equal(result.blocked, false, `${origin.id}: blocked leaving new port at ${JSON.stringify(nav.position)}`);
      reached = result.reached;
    }
    assert(reached, `${origin.id}: cannot reach ${destination.id}`);
  }
});

check('Actual same-port buy and sell never profits after origin, workshop, research and tax bonuses stack', () => {
  for (const origin of origins) {
    const sim = new TradeSim(); sim.start(origin);
    sim.state.cash = 10_000_000; sim.state.eraIndex = 10; sim.state.reputation = 100;
    sim.state.marketEvents = [];
    for (const key of Object.keys(sim.state.cargo)) {
      sim.state.cargo[key] = 0; sim.state.cargoCost[key] = 0; sim.state.cargoCostEstimated[key] = false;
    }
    assert(sim.life().research('ledger').ok);
    assert(sim.life().research('craft-guilds').ok);
    for (let i = 0; i < 3; i++) assert(sim.life().build('workshop').ok);
    assert(sim.life().bonuses().production >= .12);
    sim.state.investments[origin.portId] = 5;
    const local = sim.marketGoods().filter(g => sim.port().produces.includes(g.id));
    assert(local.length > 0);
    for (const good of local) for (const stock of [1, 10, 50, 140]) {
      sim.state.stock[origin.portId][good.id] = stock;
      const amount = Math.min(stock, 25, sim.capacity());
      const before = sim.state.cash;
      const quote = sim.quote(good.id, amount, 'buy');
      assert.equal(quote.quantity, amount);
      assert(sim.buy(good.id, amount));
      assert.equal(sim.state.cash, before - quote.total);
      assert(sim.sell(good.id, amount));
      assert(sim.state.cash <= before - amount, `${origin.id}/${good.id}: bought and resold ${amount} for a profit`);
      assert.equal(sim.state.cargo[good.id], 0);
      assert.equal(sim.marketStock(origin.portId, good.id), stock);
      roundtrips++;
    }
  }
});

check('Disbanding lowers the actual next-day payroll, refunds no recruitment cost, and clears the empty garrison', () => {
  const sim = new TradeSim(); sim.start(origins[0]); sim.state.cash = 100_000;
  assert(sim.dominion().purchase('memphis').ok);
  const hiredAt = sim.state.cash;
  assert(sim.dominion().recruit(30).ok);
  assert.equal(sim.state.cash, hiredAt - 1800);
  const upkeep = sim.dominion().army().upkeep;
  const cash = sim.state.cash;
  assert.equal(sim.dominion().disband(31).ok, false);
  assert.equal(sim.dominion().disband(1.5).ok, false);
  assert(sim.dominion().disband(20).ok);
  assert.equal(sim.state.cash, cash);
  assert(sim.dominion().army().upkeep < upkeep);
  const remainingUpkeep = sim.dominion().army().upkeep;
  const peaceful = new TradeSim(); assert(peaceful.import(sim.export()));
  assert(peaceful.dominion().disband(10).ok);
  assert.equal(peaceful.state.cash, sim.state.cash);
  assert.equal(peaceful.dominion().army().upkeep, 0);
  assert.equal(peaceful.state.dominion.armyBaseId, null);
  sim.nextDay(); peaceful.nextDay();
  assert.equal(peaceful.state.cash - sim.state.cash, remainingUpkeep);
});

console.log(`World continuity: ${groups} passed, ${failures} failed; ${ports.length} ports + ${inlandCities.length} inland cities, ${inlandRoads.length} roads, ${goods.length} goods; ${roundtrips} real buy/sell roundtrips.`);
if (failures) process.exitCode = 1;
