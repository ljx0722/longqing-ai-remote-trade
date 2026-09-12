# City expansion contract

User has just changed direction: make the game resemble Civilization while remaining simple. Trade funds buying cities; owning a coastal city permits land caravans to discover inland cities; optional abstract warfare can capture other cities. No hex armies or complex unit types. Root owns main.ts/sim.ts/styles.css and integrates your standalone src/dominion.ts. Do not edit root files.

Implement now, with independent tests in work/dominion-check.mjs. Use existing ports/data. Add ~24 genuinely inland cities with historic name/era/region/lat/lon and explicit land connections to coastal ports/inland cities, geographically sensible and no roads crossing oceans. Keep inland cities separate from seaports. Export inlandCities.

Export DominionState, createDominionState(), readDominionState(raw:unknown,day:number):DominionState|null, Dominion class constructed(state,host). Host getters: day,eraIndex,currentPortId,cash,atSea,visited:string[]; spendCash(amount):boolean, addCash(amount):void, addReputation(amount):void. Do not modify cargo accounting. Caravan prep cost includes its cargo and supplies in cash; make this clear. State tracks owned city development, discovered inland cities, at most 3 active caravans, one army of up to 100 units, at most 1 campaign. JSON serializable, strict bounded validation, old undefined initializes.

API exact contract:
- cities(): {id,name,region,era,coastal:boolean,known:boolean,owned:boolean,price:number,commerce:number,food:number,defense:number,income:number,loyalty:number}[]
- purchase(id), develop(id,kind:'commerce'|'food'|'defense') => {ok,message}; coastal purchase requires visited city, docked at that city, cost sufficient; discovered inland purchase requires a connected owned city. Grant city charter ownership (polities remain backdrop).
- routes(): {id,fromId,toId,name,days,cost,reward,discovered:boolean}[]; only accessible roads from owned cities.
- sendCaravan(routeId) => action; max 3, cash expense, return reward and discovery ONCE only when days elapsed, prevent simultaneous duplicate routes.
- recruit(quantity:number) => action; fixed cost and upkeep, only at owned coastal city, army <=100.
- campaignTargets(): {id,name,days,defense,winChance,cost}[]; only known enemy cities connected by roads from owned cities, or visited coastal cities; same region/basin for coastal invasion (no teleport across world).
- attack(id) => action; one active war, deduct campaign cost, auto resolve deterministic attrition/supply once on due day; probabilistic seeded reproducible result, force weaker attacker can lose, no free repeated reward; victory ownership starts loyalty 35 and reduced income, conquering costs reputation; recruitment expense must make peaceful trade viable. No gore.
- army(): {troops,upkeep,campaign:{targetId,arrivesDay}|null}
- caravans(): {id,name,returnsDay,reward}[]
- daily() => {messages:string[]}; root calls exactly once per game day; defend against duplicate same-day processing in state lastProcessedDay; city daily income minus food shortage/city upkeep, army upkeep including insufficient-funds attrition, completed caravans/campaigns; no exponential infinite cash.

State ownership develops commerce/food/defense up to3; food sustains city/army, no dozens of resources. New user explicitly authorizes warfare, superseding prior defense-only plan. Cities cannot be bought/captured twice; purchases atomic. Relevant tests: geography/roads, purchase location/cost guards, route lock/discovery, caravan delayed payout/exactly once, land city purchase, recruit capacity/resources, campaign victory/loss/one at a time, daily double-call, save roundtrip/corruption. Send implementation summary and exact API immediately when ready. Root builds UI itself.
