import assert from 'node:assert/strict';
import { TradeSim, origins, ports, goods, eras, createMarketEvent } from './sim-bundle.mjs';

let checks = 0;
const run = (name, fn) => { fn(); checks++; console.log(`PASS independent review: ${name}`); };
const start = (origin = origins[0]) => { const s = new TradeSim(); s.start(origin); return s; };
const clone = (s) => { const c = new TradeSim(); assert(c.import(s.export())); return c; };

run('reported prices affect executable buy/sell quotes, not only display prices', () => {
  for (const origin of origins) {
    const s = start(origin), baseline = clone(s), event = s.state.marketEvents[0];
    baseline.state.marketEvents = [];
    for (const port of s.availablePorts()) for (const good of s.availableGoods()) {
      const affected = event.portIds.includes(port.id) && event.goodIds.includes(good.id);
      for (const method of ['buyPrice', 'sellPrice']) {
        const actual = s[method](port.id, good.id), normal = baseline[method](port.id, good.id);
        if (!affected) assert.equal(actual, normal, `${method}: unrelated market changed`);
        else assert(event.multiplier > 1 ? actual > normal : actual < normal, `${method}: event direction`);
      }
    }
    const portId = event.portIds[0], goodId = event.goodIds[0];
    s.state.currentPortId = baseline.state.currentPortId = portId;
    s.state.cash = baseline.state.cash = 100000;
    s.state.cargo = Object.fromEntries(goods.map(g => [g.id, 0]));
    baseline.state.cargo = { ...s.state.cargo };
    const before = s.export(), quote = s.quote(goodId, 5, 'buy');
    assert.equal(s.export(), before, 'quoting must be read-only');
    assert.equal(quote.quantity, 5);
    const cash = s.state.cash; assert(s.buy(goodId, 5));
    assert.equal(cash - s.state.cash, quote.total);
    const sale = s.quote(goodId, 5, 'sell'), earnedBefore = s.state.cash;
    assert(s.sell(goodId, 5)); assert.equal(s.state.cash - earnedBefore, sale.total);
  }
});

run('every era survives varied generated reports and boundary random values', () => {
  const hash = (text) => { let h = 2166136261; for (const c of text) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return (h >>> 0) / 4294967296; };
  for (let era = 0; era < eras.length; era++) for (let sample = 0; sample < 40; sample++) {
    const availablePorts = ports.filter(p => p.era <= era), availableGoods = goods.filter(g => g.era <= era);
    const random = key => sample < 4 ? [-1, 1, NaN, Infinity][sample] : hash(`${era}:${sample}:${key}`);
    const event = createMarketEvent(1, availablePorts, availableGoods, random);
    assert.deepEqual(event, createMarketEvent(1, availablePorts, availableGoods, random));
    const s = start(); s.state.eraIndex = era; s.state.marketEvents = [event];
    assert.deepEqual(JSON.parse(clone(s).export()), JSON.parse(s.export()));
    assert(event.portIds.every(id => availablePorts.some(p => p.id === id)));
    assert(event.goodIds.every(id => availableGoods.some(g => g.id === id)));
  }
});

run('numeric-overflow JSON and partial valid archives reject without mutation', () => {
  const s = start(), snapshot = s.export(), event = s.state.marketEvents[0];
  for (const token of ['1e400', '-1e400', 'null', '"1.22"']) {
    const malicious = snapshot.replace(/"multiplier":[\d.]+/, `"multiplier":${token}`);
    assert.notEqual(malicious, snapshot); assert.equal(s.import(malicious), false);
    assert.equal(s.export(), snapshot);
  }
  const raw = JSON.parse(snapshot);
  raw.marketEvents = [event, { ...event, id: 'second-bad-event', portIds: ['not-a-port'] }];
  assert.equal(s.import(JSON.stringify(raw)), false);
  assert.equal(s.export(), snapshot, 'earlier valid archive entries must not be committed');
});

run('starting a different family clears earlier reports and preserves the new seed', () => {
  const s = start(); for (let i = 0; i < 36; i++) s.nextDay();
  s.start(origins[1]); const newFamily = start(origins[1]);
  assert.equal(s.export(), newFamily.export());
  for (let i = 0; i < 24; i++) { s.nextDay(); newFamily.nextDay(); }
  assert.equal(s.export(), newFamily.export());
});

run('same-basin departures do not double-charge supplies or charge transfer fees', () => {
  const s = start(), quote = s.voyage('byblos');
  assert.equal(quote.transfer, false);
  assert.equal(quote.cost, quote.wages + quote.supplies * 2);
  const beforeCash = s.state.cash, beforeSupplies = s.state.supplies;
  assert(s.sail('byblos'));
  assert.equal(beforeCash - s.state.cash, quote.wages);
  assert.equal(s.state.supplies, beforeSupplies);
  s.nextDay(); assert.equal(s.state.supplies, beforeSupplies - s.state.voyage.dailySupply);
});

console.log(JSON.stringify({ passed: true, independentMarketChecks: checks, additionalRoundTrips: eras.length * 40 }));
