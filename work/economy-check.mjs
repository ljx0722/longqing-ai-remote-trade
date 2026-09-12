import assert from 'node:assert/strict';
import {TradeSim,origins,ports,goods,eras} from './sim-bundle.mjs';
let checks=0;
for(const origin of origins){const s=new TradeSim();s.start(origin);assert.equal(s.state.originId,origin.id);for(const g of s.availableGoods()){const before=s.export();s.state.cash=10000;const cash=s.state.cash;s.buy(g.id,10);s.sell(g.id,10);assert(s.state.cash<=cash,origin.id+':'+g.id+' arbitrage');assert(s.import(before));checks++;}}
const s=new TradeSim();s.start(origins[0]);assert.equal(s.sail('london'),false);assert(s.sail('byblos'));assert.equal(s.state.currentPortId,'memphis');assert.equal(s.buy('grain',1),false);const days=s.state.voyage.totalDays;const oldDay=s.state.day;for(let i=0;i<days;i++)s.nextDay();assert.equal(s.state.currentPortId,'byblos');assert.equal(s.state.day,oldDay+days);assert.equal(s.state.voyage,null);assert.equal(s.state.destinationId,null);assert(s.state.supplies>=0);assert(Object.values(s.state.cargo).every(x=>x>=0));checks+=8;
const checkpoint=s.export();for(const mutate of [r=>r.cash=-1,r=>r.cargo.grain=100000,r=>r.version=99,r=>r.ship.hull=99999,r=>r.eraIndex=100,r=>r.destinationId='bad']){const raw=JSON.parse(checkpoint);mutate(raw);assert.equal(s.import(JSON.stringify(raw)),false);assert.equal(s.export(),checkpoint);checks++;}
const clone=new TradeSim();assert(clone.import(s.export()));s.nextDay();clone.nextDay();assert.deepEqual(JSON.parse(s.export()),JSON.parse(clone.export()));checks++;
for(let i=1;i<eras.length;i++){s.state.cash=eras[i].threshold;assert(s.advanceEra());assert.equal(s.state.eraIndex,i);assert(s.availablePorts().some(p=>p.era===i));assert(s.availableGoods().some(g=>g.era===i));checks++;}
s.state.cash=50000000;assert(s.startSandbox());assert.equal(s.availablePorts().length,ports.length);assert.equal(s.availableGoods().length,goods.length);checks+=3;
for(let i=0;i<50;i++){s.state.cash=100000;s.resupply();s.repair();const to=s.availablePorts().find(p=>p.id!==s.state.currentPortId&&s.voyage(p.id).supplies<=s.state.supplies);assert(s.sail(to.id));while(s.state.voyage)s.nextDay();assert(Object.values(s.state.cargo).every(x=>x>=0));assert(s.state.ship.hull>=0);assert(s.state.cash>=0);checks++;}
console.log(JSON.stringify({passed:true,checks,eras:eras.length,ports:ports.length,goods:goods.length,origins:origins.length}));

