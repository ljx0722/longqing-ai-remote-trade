import assert from 'node:assert/strict';
import { build } from 'esbuild';

await build({entryPoints:['src/port-life.ts'],bundle:true,platform:'node',format:'esm',outfile:'work/port-life-bundle.mjs'});
await build({entryPoints:['src/data.ts'],bundle:true,platform:'node',format:'esm',outfile:'work/life-data-bundle.mjs'});
const {PortLife,createLifeState,readLifeState}=await import('./port-life-bundle.mjs');
const {goodsForPort,goodById}=await import('./life-data-bundle.mjs');
let checks=0;
const check=(value,message)=>{assert(value,message);checks++;};
const equal=(actual,expected,message)=>{assert.deepEqual(actual,expected,message);checks++;};
function game(day=1){
  const account={day,eraIndex:0,currentPortId:'memphis',cash:20000,atSea:false,supplies:100,shipCapacity:40,cargo:{grain:100,linen:100,pottery:100,cedar:100,copper:100,salt:100},reputation:0};
  const host={
    get day(){return account.day},get eraIndex(){return account.eraIndex},get currentPortId(){return account.currentPortId},get cash(){return account.cash},get atSea(){return account.atSea},get supplies(){return account.supplies},get shipCapacity(){return account.shipCapacity},
    cargo(id){return account.cargo[id]??0},marketGoods(id){return goodsForPort(id,account.eraIndex)},
    spendCash(amount){if(!Number.isSafeInteger(amount)||amount<0||account.cash<amount)return false;account.cash-=amount;return true},
    addCash(amount){assert(Number.isSafeInteger(amount)&&amount>=0);account.cash+=amount},
    consumeCargo(id,quantity){if(!Number.isSafeInteger(quantity)||quantity<0||(account.cargo[id]??0)<quantity)return false;account.cargo[id]-=quantity;return true},
    addReputation(amount){account.reputation+=amount},
  };
  const state=createLifeState(),life=new PortLife(state,host);
  return {account,host,state,life};
}

{
  const {life,state,account}=game();
  equal(life.season(),{name:'春',day:1,festival:''});
  const resident=life.residents()[0];
  check(life.talk(resident.id).ok);equal(life.residents()[0].friendship,2);
  check(!life.talk(resident.id).ok);equal(life.residents()[0].friendship,2);
  account.day=14;check(life.season().festival.length>0);check(life.talk(resident.id).ok);equal(life.residents()[0].friendship,6);
  account.currentPortId='ur';check(!life.talk(resident.id).ok);equal(life.residents()[0].friendship,0);
  account.day=29;equal(life.season(),{name:'夏',day:1,festival:''});
  check(readLifeState(state,account.day)!==null);
}
{
  const {life,state,account}=game();
  const requests=life.commissions();equal(requests.length,3);
  for(const request of requests) {
    check(goodsForPort(account.currentPortId,account.eraIndex).some(g=>g.id===request.goodId),'Starter requests must be stocked locally');
    check(goodById.get(request.goodId).base*request.quantity<400,'Starter request affordable');
  }
  const request=requests[0];
  check(!life.deliverCommission(request.id).ok);
  check(life.acceptCommission(request.id).ok);check(!life.acceptCommission(request.id).ok);
  account.cargo[request.goodId]=request.quantity-1;
  const cash=account.cash;
  check(!life.deliverCommission(request.id).ok);equal(account.cash,cash);equal(account.cargo[request.goodId],request.quantity-1);
  account.cargo[request.goodId]=request.quantity+2;
  check(life.deliverCommission(request.id).ok);equal(account.cash,cash+request.reward);equal(account.cargo[request.goodId],2);equal(account.reputation,1);
  check(!life.deliverCommission(request.id).ok);check(!life.acceptCommission(request.id).ok);equal(account.cash,cash+request.reward);
  equal(life.commissions().find(c=>c.id===request.id).status,'completed');
  const restored=readLifeState(JSON.parse(JSON.stringify(state)),account.day);check(restored!==null);equal(restored,state);
  equal(restored.accepted.length,0);
  const second=requests[1];check(life.acceptCommission(second.id).ok);
  account.day=second.expiresDay+1;account.cargo[second.goodId]=second.quantity;
  const before=account.cash;check(!life.deliverCommission(second.id).ok);equal(account.cash,before);equal(account.cargo[second.goodId],second.quantity);
  equal(life.commissions().find(c=>c.id===second.id).status,'expired');
}
{
  const {life,account}=game(14);const request=life.commissions()[0];
  check(life.acceptCommission(request.id).ok);const fixed=life.commissions()[0].reward;
  account.day=15;equal(life.commissions().find(c=>c.id===request.id).reward,fixed);
  account.cargo[request.goodId]=request.quantity;check(life.deliverCommission(request.id).ok);equal(life.residents()[0].friendship,10);
}
{
  const {life,account}=game();
  for(const request of life.commissions())check(life.acceptCommission(request.id).ok);
  account.currentPortId='ur';check(!life.acceptCommission(life.commissions()[0].id).ok,'Global accepted cap is three');
  account.day=15;check(life.acceptCommission(life.commissions()[0].id).ok,'Expired requests release cap');
}
{
  const {life,account,state}=game();
  const cash=account.cash;
  check(!life.research('compass').ok);check(!life.research('stowage').ok);equal(account.cash,cash);
  check(life.research('ledger').ok);equal(account.cash,cash-180);check(life.bonuses().taxReduction>0);
  check(!life.research('ledger').ok);equal(account.cash,cash-180);
  check(life.research('stowage').ok);equal(life.bonuses().capacity,6);
  account.eraIndex=8;
  for(const id of ['stars','sailcloth','preservation','survey','craft-guilds','compass','marine-insurance'])check(life.research(id).ok,id);
  equal(state.researched.length,9);check(life.bonuses().speed>1.19);check(life.bonuses().riskReduction>=.06);check(life.bonuses().supplyReduction>=.08);
  check(readLifeState(state,account.day)!==null);
}
{
  const {life,account,state}=game();
  const cost=life.facilities().find(f=>f.id==='warehouse').cost,cash=account.cash;
  check(life.build('warehouse').ok);equal(account.cash,cash-cost);equal(life.bonuses().capacity,4);
  check(life.build('warehouse').ok);check(life.build('warehouse').ok);check(!life.build('warehouse').ok);equal(life.bonuses().capacity,12);
  check(life.build('workshop').ok);equal(life.bonuses().production,.03);
  check(life.build('garden').ok);equal(life.bonuses().supplyReduction,.015);
  account.currentPortId='ur';equal(life.bonuses().production,0);equal(life.bonuses().capacity,12);equal(life.bonuses().supplyReduction,.015);
  check(readLifeState(state,account.day)!==null);
}
{
  const {life,account}=game();
  account.cargo.pottery=0;const cash=account.cash,grain=account.cargo.grain;
  check(!life.contributeBundle('harbor-pantry').ok);equal(account.cash,cash);equal(account.cargo.grain,grain);
  account.cargo.pottery=2;check(life.contributeBundle('harbor-pantry').ok);equal(account.cash,cash+220);equal(account.cargo.pottery,0);equal(account.cargo.grain,grain-6);equal(life.bonuses().capacity,2);
  check(!life.contributeBundle('harbor-pantry').ok);equal(account.cash,cash+220);
  check(!life.contributeBundle('world-teatable').ok);
  account.eraIndex=10;account.cargo.tea=3;account.cargo.pepper=3;account.cargo.porcelain=2;
  check(life.contributeBundle('world-teatable').ok);equal(account.cargo.tea,0);check(life.bonuses().taxReduction>=.003);
}
{
  const {life,account,state}=game();
  const id=life.residents()[0].id,request=life.commissions()[0];life.acceptCommission(request.id);account.cargo[request.goodId]=20;
  account.atSea=true;const before=JSON.stringify({state,account});
  for(const action of [()=>life.talk(id),()=>life.acceptCommission(life.commissions()[1].id),()=>life.deliverCommission(request.id),()=>life.research('ledger'),()=>life.build('warehouse'),()=>life.contributeBundle('harbor-pantry')])check(!action().ok,'No town mutations at sea');
  equal(JSON.stringify({state,account}),before);
}
{
  const {life,state,account}=game();
  life.talk(life.residents()[0].id);life.research('ledger');life.build('garden');life.acceptCommission(life.commissions()[0].id);
  check(readLifeState(undefined,1)!==null);check(readLifeState(null,1)===null);
  for(const mutate of [
    s=>s.version=2,s=>s.extra=true,s=>s.accepted.push({...s.accepted[0]}),s=>s.accepted[0].quantity=-1,s=>s.accepted[0].reward=999999,
    s=>s.accepted[0].goodId='invented',s=>s.accepted[0].expiresDay=99999,s=>s.accepted[0].portId='missing',s=>s.researched.push('compass'),s=>s.researched.push('ledger'),
    s=>s.facilities.memphis.garden=4,s=>s.facilities.missing={warehouse:0,workshop:0,garden:0},s=>s.residents['memphis~steward'].friendship=NaN,
    s=>s.residents['memphis~steward'].lastTalkDay=2,s=>s.completedBundles=['harbor-pantry','harbor-pantry'],
    s=>s.claimed[s.accepted[0].id]=1,s=>s.claimed['memphis~999~0']=1,
  ]) {
    const raw=structuredClone(state);mutate(raw);check(readLifeState(raw,account.day)===null,'Malformed state must be rejected');
  }
}
console.log(JSON.stringify({passed:true,checks,systems:['resident relations','four seasons','festival requests','commission economy','research tree','port facilities','collection bundles','strict saves']}));
