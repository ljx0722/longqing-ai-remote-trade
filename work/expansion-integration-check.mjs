import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {TradeSim, origins, goods, ports, portPoint} from './sim-bundle.mjs';
const setup=()=>{const s=new TradeSim();s.start(origins[0]);s.state.cash=60000;return s;};
const copy=s=>{const c=new TradeSim();assert(c.import(s.export()),'integrated save roundtrip');return c;};
let checks=0;
const check=(name,fn)=>{fn();checks++;console.log('PASS integration: '+name);};
check('local shelf and first imported sale have matching executable unit prices',()=>{
 const s=setup();const id=goods.find(g=>g.era===0&&!s.marketGoods().some(x=>x.id===g.id)).id;
 assert.equal(s.marketStock('memphis',id),0);s.state.cargo[id]=1;s.state.cargoCost[id]=goods.find(g=>g.id===id).base;
 assert(s.marketGoods().some(g=>g.id===id));assert.equal(s.quote(id,1,'sell').total,s.sellPrice('memphis',id));assert(s.sell(id,1));assert.equal(s.marketStock('memphis',id),1);copy(s);
});
check('research and facilities change real capacity and supply, with no local purchase-resale profit',()=>{
 const s=setup();assert(s.life().research('ledger').ok);assert(s.life().research('stowage').ok);assert(s.life().build('warehouse').ok);assert.equal(s.capacity(),40);
 assert(s.life().build('garden').ok);assert(s.voyage('byblos').supplies<=Math.ceil(s.voyage('byblos').days*2));
 for(let i=0;i<3;i++)assert(s.life().build('workshop').ok);
 for(const g of s.marketGoods())assert(s.buyPrice('memphis',g.id)>s.sellPrice('memphis',g.id));
 assert(s.buy('grain',40));assert.equal(s.cargoCount(),40);copy(s);
 assert(s.sail('byblos'));s.nextDay();copy(s);
});
check('expanded empty commodity accounting migrates while missing held cost is rejected',()=>{
 const s=setup(),raw=JSON.parse(s.export());delete raw.cargoCost.copper;delete raw.cargoCostEstimated.copper;
 assert(new TradeSim().import(JSON.stringify(raw)));delete raw.cargoCost.grain;assert.equal(new TradeSim().import(JSON.stringify(raw)),false);
 const legacy=JSON.parse(s.export());delete legacy.life;delete legacy.navigation;delete legacy.dominion;
 assert(new TradeSim().import(JSON.stringify(legacy)));
});
check('continuous automatic sailing arrives physically and preserves the saved voyage',()=>{
 let s=setup();assert(s.sail('byblos'));const start={...s.state.navigation.position};
 s.advanceSailing(.1);assert.notDeepEqual(s.state.navigation.position,start);s=copy(s);
 for(let i=1;i<2400&&s.state.voyage;i++){if(i%20===0)s.nextDay(true);s.advanceSailing(.05);}
 assert.equal(s.state.currentPortId,'byblos');assert.equal(s.state.voyage,null);assert.deepEqual(s.state.navigation.position,portPoint(s.port()));copy(s);
});
check('manual detours cannot teleport on the original due date and continue paying supplies and wages',()=>{
 const s=setup();assert(s.sail('byblos'));assert(s.setManual(true));s.state.navigation.throttle=0;
 const position={...s.state.navigation.position},cash=s.state.cash,expected=s.state.voyage.totalDays;
 for(let i=0;i<expected+4;i++)s.nextDay();
 assert(s.state.voyage);assert.deepEqual(s.state.navigation.position,position);assert(s.state.cash<cash);assert(s.state.lastVoyage.suppliesUsed>expected*2);copy(s);
 assert.equal(s.dockAt('lothal'),false);assert(s.redirect('memphis'));copy(s);
});
check('mid-voyage docking changes actual port and closes the correct expense record',()=>{
 const s=setup();assert(s.sail('byblos'));assert.equal(s.dockAt('lothal'),false);
 s.state.navigation.position=portPoint(s.port('byblos'));assert(s.dockAt('byblos'));
 assert.equal(s.state.currentPortId,'byblos');assert.equal(s.state.lastVoyage.toId,'byblos');assert.equal(s.state.destinationId,null);assert(s.buy('grain',1));copy(s);
});
check('city ownership, caravans, discovery and income persist through ordinary day ticks',()=>{
 const s=setup();assert(s.dominion().purchase('memphis').ok);assert(s.dominion().develop('memphis','commerce').ok);
 const road=s.dominion().routes().find(r=>r.toId==='thebes');assert(road);assert(s.dominion().sendCaravan(road.id).ok);
 const before=s.state.cash;for(let i=0;i<road.days;i++)s.nextDay();
 assert(s.state.dominion.discovered.includes('thebes'));assert(s.state.cash>=before+road.reward);
 assert(s.dominion().purchase('thebes').ok);const c=copy(s);s.nextDay();c.nextDay();assert.deepEqual(JSON.parse(s.export()),JSON.parse(c.export()));
 const raw=JSON.parse(s.export());raw.dominion.troops=999;assert.equal(s.import(JSON.stringify(raw)),false);
});
const fixture=setup();fixture.dominion().purchase('memphis');fixture.dominion().develop('memphis','commerce');
const road=fixture.dominion().routes().find(r=>r.toId==='thebes');fixture.dominion().sendCaravan(road.id);
for(let i=0;i<road.days;i++)fixture.nextDay();fixture.dominion().purchase('thebes');fixture.dominion().recruit(40);
fixture.dominion().sendCaravan(road.id);fixture.life().research('ledger');fixture.life().talk(fixture.life().residents()[0].id);
await writeFile('work/expansion-fixture.json',fixture.export());
console.log(`Expansion integration: ${checks} behavior groups passed. ${ports.length} seaports, ${goods.length} cargo types.`);
