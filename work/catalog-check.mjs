import { build } from 'esbuild';
import assert from 'node:assert/strict';

await build({ entryPoints: ['src/data.ts'], bundle: true, platform: 'node', format: 'esm', outfile: 'work/catalog-bundle.mjs' });
const { goods, ports, origins, eras, goodsForPort, goodById, portById } = await import('./catalog-bundle.mjs');
let checks = 0;
const check = (value, label) => { assert.ok(value, label); checks++; };
check(ports.length >= 120, `At least 120 real trading cities (${ports.length})`);
check(goods.length >= 1050, `At least 1050 distinct named goods (${goods.length})`);
check(new Set(ports.map(p => p.id)).size === ports.length, 'Unique port IDs');
check(new Set(ports.map(p => p.name)).size === ports.length, 'Unique port names');
check(new Set(goods.map(g => g.id)).size === goods.length, 'Unique good IDs');
const duplicateNames = goods.map(g => g.name).filter((name, index, all) => all.indexOf(name) !== index);
check(!duplicateNames.length, `Unique names: ${duplicateNames.join(', ')}`);
check(goodById.size === goods.length && portById.size === ports.length, 'Maps cover catalog');
const sold = new Set();
const sizes = [];
for (const p of ports) {
  check(Number.isFinite(p.x) && Number.isFinite(p.y) && Math.abs(p.x) <= 1 && Math.abs(p.y) <= 1, `${p.id}: valid geographic position`);
  check(Number.isInteger(p.era) && p.era >= 0 && p.era < eras.length, `${p.id}: known era`);
  check(p.produces.every(id => goodById.has(id)) && p.demands.every(id => goodById.has(id)), `${p.id}: known produces and demands`);
  const local = goodsForPort(p.id, eras.length - 1);
  sizes.push(local.length);
  check(local.length >= 20 && local.length <= 75, `${p.id}: bounded local market (${local.length})`);
  check(new Set(local.map(g => g.id)).size === local.length, `${p.id}: no duplicate shelf goods`);
  for (const g of local) sold.add(g.id);
  for (let era = 0; era < eras.length; era++) {
    const shelf = goodsForPort(p.id, era);
    check(shelf.every(g => g.era <= era), `${p.id}: no future goods in era ${era}`);
    check([...p.produces, ...p.demands].every(id => goodById.get(id).era > era || shelf.some(g => g.id === id)), `${p.id}: eligible produce / demand on shelf`);
    check(shelf.length === goodsForPort(p.id, era).length, `${p.id}: deterministic market`);
  }
  check(goodsForPort(p.id, 0, true).length === local.length, `${p.id}: sandbox unlocks local goods`);
  if (['caribbean', 'atlantic-americas', 'pacific'].includes(p.basin)) check(p.era >= 8, `${p.id}: cross-ocean Americas gated`);
}
check(sold.size === goods.length, `Every catalog good actually available (${sold.size}/${goods.length})`);
for (const g of goods) {
  check(g.name.length > 0 && !/商品\d|货物\d|品种\d/.test(g.name), `${g.id}: named commodity`);
  check(Number.isFinite(g.base) && g.base > 0 && g.era >= 0 && g.era < eras.length, `${g.id}: valid value and era`);
  if (g.originPortIds) {
    check(g.originPortIds.every(id => portById.has(id)), `${g.id}: valid source`);
    check(g.originPortIds.some(id => portById.get(id).era <= g.era), `${g.id}: source available when good unlocks`);
    check(g.originPortIds.some(id => portById.get(id).produces.includes(g.id)), `${g.id}: source supplies actual good`);
  }
}
for (const origin of origins) {
  check(portById.has(origin.portId) && portById.get(origin.portId).era <= origin.era, `${origin.id}: valid starting port`);
  check(Object.keys(origin.goods).every(id => goodById.has(id) && goodById.get(id).era <= origin.era), `${origin.id}: valid starting cargo`);
}
for (const id of ['grain','salt','linen','copper','cedar','pottery','wine','silk','pepper','coffee','indigo']) check(goodById.has(id), `${id}: legacy good retained`);
for (const id of ['memphis','magAN','lothal','byblos','lisbon','manila','london','surat']) check(portById.has(id), `${id}: legacy port retained`);
console.log(`Catalog checks: ${checks} passed. ${ports.length} cities, ${goods.length} goods. Local shelves: ${Math.min(...sizes)}–${Math.max(...sizes)}, mean ${(sizes.reduce((a,b)=>a+b,0)/sizes.length).toFixed(1)}.`);
