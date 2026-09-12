import { build } from 'esbuild';
import assert from 'node:assert/strict';
await build({entryPoints: ['src/market-events.ts'], bundle: true, platform: 'node', format: 'esm', outfile: 'work/catalog-events-bundle.mjs'});
await build({entryPoints: ['src/data.ts'], bundle: true, platform: 'node', format: 'esm', outfile: 'work/catalog-bundle.mjs'});
const {createMarketEvent, readMarketEvents, marketEventFactor} = await import('./catalog-events-bundle.mjs');
const {goods, ports, eras, goodsForPort, goodById, portById} = await import('./catalog-bundle.mjs');
const hash = (key) => { let h = 2166136261; for (const c of key) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return (h >>> 0) / 4294967296; };
const kinds = new Set(), regionalGoods = new Set();
let reports = 0, checks = 0;
const check = (value, label) => { assert.ok(value, label); checks++; };
for (let era = 0; era < eras.length; era++) {
  const openPorts = ports.filter(p => p.era <= era), openGoods = goods.filter(g => g.era <= era);
  for (let sample = 0; sample < 100; sample++) {
    const random = key => hash(`${era}:${sample}:${key}`);
    const event = createMarketEvent(5, openPorts, openGoods, random);
    reports++; kinds.add(event.kind);
    assert.deepEqual(event, createMarketEvent(5, openPorts, openGoods, random));
    check(event.goodIds.length >= 1 && event.goodIds.length <= 3, 'Top-of-screen hint mentions a readable number of goods');
    check(event.clue.length < 220, `Mobile clue remains short: ${event.clue.length}`);
    check(!/必赚|买入|卖出|涨价|跌价|%/.test(event.clue), 'Clue describes an observation without a profit instruction');
    check(readMarketEvents([event], 5, openPorts, openGoods)?.length === 1, 'Generated catalog report survives validated reload');
    for (const id of event.goodIds) {
      const good = goodById.get(id);
      check(good.era <= era, `${id}: report respects era`);
      check(event.clue.includes(good.name), `${id}: clue names affected cargo`);
      if (id.startsWith('catalog-')) regionalGoods.add(id);
      for (const portId of event.portIds) {
        const port = portById.get(portId), shelf = goodsForPort(portId, era);
        check(shelf.some(g => g.id === id), `${portId}/${id}: report cargo can actually be traded here`);
        if (['drought','harvest'].includes(event.kind)) check(port.produces.includes(id), 'Harvest affects local production');
        if (['storm','monsoon'].includes(event.kind)) check(port.demands.includes(id), 'Delayed ship affects local imports');
        if (event.kind === 'monsoon') check(['gulf','indian','china','redsea','southeast'].includes(port.basin), 'Monsoon confined to relevant seas');
        const value = marketEventFactor([event], portId, id, 5);
        check(event.multiplier > 1 ? value > 1 : value < 1, 'Matching quote gets the correct effect');
        check(marketEventFactor([event], portId, id, event.endDay) === 1, 'Effect expires');
      }
    }
    const unrelated = openGoods.find(g => !event.goodIds.includes(g.id));
    check(marketEventFactor([event], event.portIds[0], unrelated.id, 5) === 1, 'Unmentioned goods retain their price');
    const badGood = openGoods.find(g => !goodsForPort(event.portIds[0], era).some(x => x.id === g.id));
    if (badGood) check(readMarketEvents([{...event, goodIds: [badGood.id]}], 5, openPorts, openGoods) === null, 'Invented local supply in imported report is rejected');
  }
}
check(kinds.size === 7, 'All seven event causes remain reachable');
check(regionalGoods.size >= 100, `Events reach the expanded catalog (${regionalGoods.size} varieties)`);
// Concrete regional and late-style regressions, independent of random selection.
for (const [name, allowed] of [
  ['埃及二粒小麦', ['memphis','alexandria']], ['锡兰蓝宝石', ['galle','colombo']],
  ['班达肉豆蔻仁', ['banda']], ['特尔纳特丁香苞', ['ternate']],
  ['墨西哥可可豆', ['veracruz','acapulco']], ['加拿大海狸皮', ['quebec']],
]) {
  const good = goods.find(g => g.name === name);
  check(good?.originPortIds?.every(id => allowed.includes(id)), `${name}: source stays in real region`);
}
check(goods.find(g => g.name === '外销纹章瓷').era >= 10, 'Later named export porcelain stays in its historical window');
check(goods.find(g => g.name === '松萝炒青茶').era >= 8, 'Later tea processing is not available in medieval period');
console.log(`Expanded market-event checks: ${checks} passed, ${reports} deterministic reports, ${regionalGoods.size} regional varieties affected.`);
