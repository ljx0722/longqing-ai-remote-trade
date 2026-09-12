import { ports, portById } from "./data";
import { additionalInlandCities, additionalRoadWaypoints } from "./inland-catalog";

export type InlandCity = {
  id: string;
  name: string;
  region: string;
  era: number;
  lon: number;
  lat: number;
  connections: string[];
};
type CityRow = [string, string, string, number, number, number, string];
const rows: CityRow[] = [
  ["thebes", "底比斯", "尼罗河谷", 0, 32.65, 25.7, "memphis"],
  ["babylon", "巴比伦", "两河平原", 1, 44.42, 32.54, "ur"],
  ["nineveh", "尼尼微", "底格里斯河上游", 1, 43.15, 36.36, "babylon"],
  ["damascus", "大马士革", "黎凡特内陆", 0, 36.29, 33.51, "byblos tyre"],
  ["aleppo", "阿勒颇", "叙利亚北部", 1, 37.16, 36.2, "ugarit damascus"],
  ["hattusa", "哈图沙", "安纳托利亚高原", 1, 34.62, 40.02, "sinope"],
  ["persepolis", "波斯波利斯", "伊朗高原", 3, 52.89, 29.94, "siraf"],
  ["susa", "苏萨", "胡齐斯坦平原", 0, 48.26, 32.19, "ur basra"],
  ["ecbatana", "埃克巴坦那", "扎格罗斯山地", 3, 48.51, 34.8, "susa persepolis"],
  ["mohenjo-daro", "摩亨佐达罗", "印度河平原", 0, 68.14, 27.33, "lothal"],
  ["ujjain", "乌阇衍那", "印度中部", 3, 75.78, 23.18, "lothal bharuch"],
  ["pataliputra", "华氏城", "恒河中游", 3, 85.14, 25.61, "satgaon ujjain"],
  ["delhi", "德里", "印度北部", 6, 77.21, 28.61, "ujjain pataliputra"],
  ["madurai", "马杜赖", "泰米尔内陆", 3, 78.12, 9.92, "nagapattinam quilon"],
  ["changan", "长安", "关中平原", 3, 108.94, 34.34, "luoyang"],
  ["luoyang", "洛阳", "中原", 3, 112.45, 34.62, "yangzhou"],
  ["chengdu", "成都", "四川盆地", 3, 104.07, 30.67, "changan"],
  ["jingdezhen", "景德镇", "赣东北", 6, 117.18, 29.27, "hangzhou fuzhou"],
  ["kyoto", "京都", "日本山城盆地", 6, 135.77, 35.01, "sakai"],
  ["gyeongju", "庆州", "朝鲜半岛东南部", 5, 129.22, 35.86, "busan"],
  ["rome", "罗马", "意大利中部", 3, 12.5, 41.9, "ostia naples"],
  ["florence", "佛罗伦萨", "托斯卡纳", 6, 11.25, 43.77, "pisa rome"],
  ["milan", "米兰", "波河平原", 4, 9.19, 45.46, "genoa venice"],
  ["paris", "巴黎", "塞纳河盆地", 3, 2.35, 48.86, "nantes bordeaux lyon"],
  ["lyon", "里昂", "罗讷河谷", 3, 4.84, 45.76, "marseille"],
  ["cordoba", "科尔多瓦", "安达卢西亚", 4, -4.78, 37.89, "malaga seville"],
  ["fez", "非斯", "摩洛哥内陆", 6, -5, 34.04, "tangier"],
  ["cusco", "库斯科", "安第斯高地", 7, -71.97, -13.52, "callao"],
  [
    "mexico-city",
    "墨西哥城",
    "墨西哥高原",
    8,
    -99.13,
    19.43,
    "veracruz acapulco",
  ],
  ["samarkand", "撒马尔罕", "中亚河中地区", 3, 66.97, 39.65, "ecbatana"],
  ["bukhara", "布哈拉", "中亚绿洲", 5, 64.42, 39.77, "samarkand"],
  ["nizwa", "尼兹瓦", "阿曼内陆绿洲", 0, 57.53, 22.93, "magAN muscat sohar"],
];
export const inlandCities: InlandCity[] = [...rows.map(
  ([id, name, region, era, lon, lat, connections]) => ({
    id,
    name,
    region,
    era,
    lon,
    lat,
    connections: connections.split(" "),
  }),
), ...additionalInlandCities];
for (const [id, additions] of Object.entries({pataliputra:["calcutta","dhaka"],paris:["le-havre"]})) {
  const city = inlandCities.find(c => c.id === id); if (city) city.connections.push(...additions);
}
const inlandById = new Map(inlandCities.map((city) => [city.id, city]));
type CityBase = {
  id: string;
  name: string;
  region: string;
  era: number;
  lon: number;
  lat: number;
  coastal: boolean;
  basin: string;
};
const baseCities: CityBase[] = [
  ...ports.map((p) => ({
    id: p.id,
    name: p.name,
    region: p.region,
    era: p.era,
    lon: p.x * 180,
    lat: p.y * 90,
    coastal: true,
    basin: p.basin,
  })),
  ...inlandCities.map((p) => ({ ...p, coastal: false, basin: "land" })),
];
const cityById = new Map(baseCities.map((city) => [city.id, city]));
type Road = {
  id: string;
  a: string;
  b: string;
  waypoints: { lon: number; lat: number }[];
  km: number;
};
const waypoints: Record<string, number[][]> = {
  ...additionalRoadWaypoints,
  "lothal:mohenjo-daro": [
    [72.25, 23.1],
    [70.5, 23.8],
    [68.7, 25.5],
  ],
  "ecbatana:samarkand": [
    [52.6, 35.6],
    [57.5, 36.3],
    [61.9, 37.6],
    [65.6, 38.8],
  ],
  "callao:cusco": [
    [-75.7, -13.1],
    [-73.5, -13.7],
  ],
  "changan:chengdu": [
    [107.8, 33.1],
    [105.9, 32.4],
  ],
};
function kilometers(
  a: { lon: number; lat: number },
  b: { lon: number; lat: number },
) {
  const radians = Math.PI / 180,
    dy = (b.lat - a.lat) * radians,
    dx = (b.lon - a.lon) * radians;
  const h =
    Math.sin(dy / 2) ** 2 +
    Math.cos(a.lat * radians) *
      Math.cos(b.lat * radians) *
      Math.sin(dx / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(Math.max(0, 1 - h)));
}
export const inlandRoads: Road[] = [];
for (const city of inlandCities)
  for (const otherId of city.connections) {
    const other = cityById.get(otherId);
    if (!other) throw new Error(`陆路端点缺失：${otherId}`);
    const [a, b] = [city.id, otherId].sort(),
      id = `${a}:${b}`;
    if (inlandRoads.some((road) => road.id === id)) continue;
    const first = cityById.get(a)!,
      last = cityById.get(b)!;
    const path = [
      { lon: first.lon, lat: first.lat },
      ...(waypoints[id] ?? []).map(([lon, lat]) => ({ lon, lat })),
      { lon: last.lon, lat: last.lat },
    ];
    inlandRoads.push({
      id,
      a,
      b,
      waypoints: path,
      km: Math.round(
        path.slice(1).reduce((sum, p, i) => sum + kilometers(path[i], p), 0),
      ),
    });
  }
const roadById = new Map(inlandRoads.map((road) => [road.id, road]));

export type OwnedCity = {
  commerce: number;
  food: number;
  defense: number;
  loyalty: number;
  acquiredDay: number;
  method: "charter" | "conquest";
};
export type CaravanState = {
  id: string;
  routeId: string;
  fromId: string;
  toId: string;
  sentDay: number;
  returnsDay: number;
  reward: number;
};
export type CampaignState = {
  targetId: string;
  fromId: string;
  sentDay: number;
  arrivesDay: number;
  force: number;
  winChance: number;
  roll: number;
  serial: number;
};
export type DominionState = {
  version: 1;
  owned: Record<string, OwnedCity>;
  discovered: string[];
  activeCaravans: CaravanState[];
  troops: number;
  armyBaseId: string | null;
  campaign: CampaignState | null;
  campaignSerial: number;
  caravanSerial: number;
  lastProcessedDay: number;
};
export type DominionHost = {
  readonly day: number;
  readonly eraIndex: number;
  readonly currentPortId: string;
  readonly cash: number;
  readonly atSea: boolean;
  readonly visited: string[];
  spendCash(amount: number): boolean;
  addCash(amount: number): void;
  addReputation(amount: number): void;
};
type Action = { ok: boolean; message: string };
const action = (ok: boolean, message: string): Action => ({ ok, message });
function hash(value: string) {
  let n = 2166136261;
  for (let i = 0; i < value.length; i++) {
    n ^= value.charCodeAt(i);
    n = Math.imul(n, 16777619);
  }
  return n >>> 0;
}
const cityPrice = (city: CityBase) =>
  (city.coastal ? 1800 : 1250) + city.era * 1400 + (hash(city.id) % 650);
const cityDefense = (city: CityBase) =>
  14 + city.era * 3 + (hash(city.id) % 14);
const connected = (a: string, b: string) =>
  inlandRoads.some(
    (road) => (road.a === a && road.b === b) || (road.a === b && road.b === a),
  );
export function createDominionState(): DominionState {
  return {
    version: 1,
    owned: {},
    discovered: [],
    activeCaravans: [],
    troops: 0,
    armyBaseId: null,
    campaign: null,
    campaignSerial: 0,
    caravanSerial: 0,
    lastProcessedDay: -1,
  };
}

export class Dominion {
  constructor(
    public state: DominionState,
    private host: DominionHost,
  ) {}
  private known(city: CityBase) {
    return (
      city.era <= this.host.eraIndex &&
      (city.coastal
        ? this.host.visited.includes(city.id)
        : this.state.discovered.includes(city.id))
    );
  }
  private netIncome(city: CityBase, owned: OwnedCity) {
    const gross = 10 + city.era * 2 + owned.commerce * 10;
    const shortage = Math.max(0, Math.max(1, owned.commerce) - owned.food) * 6;
    return (
      Math.floor((gross * owned.loyalty) / 100) -
      3 -
      owned.defense * 2 -
      shortage
    );
  }
  cities() {
    return baseCities
      .filter((city) => city.era <= this.host.eraIndex)
      .map((city) => {
        const owned = this.state.owned[city.id];
        return {
          id: city.id,
          name: city.name,
          region: city.region,
          era: city.era,
          coastal: city.coastal,
          known: this.known(city),
          owned: !!owned,
          price: cityPrice(city),
          commerce: owned?.commerce ?? 0,
          food: owned?.food ?? 0,
          defense: owned
            ? cityDefense(city) + owned.defense * 12
            : cityDefense(city),
          income: owned ? this.netIncome(city, owned) : 0,
          loyalty: owned?.loyalty ?? 0,
        };
      });
  }
  purchase(id: string): Action {
    const city = cityById.get(id);
    if (!city || city.era > this.host.eraIndex || !this.known(city))
      return action(false, "先探索并发现这座城市。");
    if (this.state.owned[id])
      return action(false, "已经持有这座城市的经营特许权。");
    if (this.state.campaign?.targetId === id)
      return action(false, "该城正在交战，暂不能签订特许协议。");
    if (city.coastal && (this.host.atSea || this.host.currentPortId !== id))
      return action(false, "购买沿海城市须亲自停靠，与当地议事会签约。");
    if (
      !city.coastal &&
      !Object.keys(this.state.owned).some((owned) => connected(owned, id))
    )
      return action(false, "先拥有一座与它有陆路相连的城市。");
    const price = cityPrice(city);
    if (!this.host.spendCash(price))
      return action(false, `签订特许协议需要 ${price} 金币。`);
    this.state.owned[id] = {
      commerce: 0,
      food: 1,
      defense: 0,
      loyalty: 85,
      acquiredDay: this.host.day,
      method: "charter",
    };
    this.host.addReputation(2);
    return action(
      true,
      `取得${city.name}经营特许权，每日获得城市净收入，可组织陆地商队。`,
    );
  }
  develop(id: string, kind: "commerce" | "food" | "defense"): Action {
    const city = cityById.get(id),
      owned = this.state.owned[id];
    if (!city || !owned || !["commerce", "food", "defense"].includes(kind))
      return action(false, "只能建设自己拥有的城市。");
    if (owned[kind] >= 3) return action(false, "该项建设已达到 3 级。");
    const cost = (350 + city.era * 140) * (owned[kind] + 1);
    if (!this.host.spendCash(cost))
      return action(false, `建设需要 ${cost} 金币。`);
    owned[kind]++;
    return action(
      true,
      `${city.name}${{ commerce: "市场", food: "农田", defense: "城防" }[kind]}升至 ${owned[kind]} 级。`,
    );
  }
  routes() {
    const result: {
      id: string;
      fromId: string;
      toId: string;
      name: string;
      days: number;
      cost: number;
      reward: number;
      discovered: boolean;
    }[] = [];
    for (const road of inlandRoads) {
      const fromId = this.state.owned[road.a]
        ? road.a
        : this.state.owned[road.b]
          ? road.b
          : null;
      if (!fromId) continue;
      const toId = fromId === road.a ? road.b : road.a,
        from = cityById.get(fromId)!,
        to = cityById.get(toId)!;
      if (Math.max(from.era, to.era) > this.host.eraIndex) continue;
      const days = Math.max(3, Math.ceil(road.km / 100) + 2),
        cost = 100 + days * 18 + Math.max(from.era, to.era) * 40;
      const commerce = this.state.owned[fromId].commerce;
      result.push({
        id: road.id,
        fromId,
        toId,
        name: `${from.name} → ${to.name}`,
        days,
        cost,
        reward: Math.round(cost * (1.18 + commerce * 0.035) + days * 4),
        discovered: this.known(to),
      });
    }
    return result;
  }
  sendCaravan(routeId: string): Action {
    const route = this.routes().find((road) => road.id === routeId);
    if (!route)
      return action(false, "先取得陆路起点城市的特许权，并解锁相应时代。");
    if (this.state.activeCaravans.length >= 3)
      return action(false, "最多同时派出 3 支陆地商队。");
    if (
      this.state.activeCaravans.some((caravan) => caravan.routeId === routeId)
    )
      return action(false, "这条道路已有商队在途。");
    if (!this.host.spendCash(route.cost))
      return action(
        false,
        `商队需 ${route.cost} 金币，已包括货物、粮食和护送费用。`,
      );
    const id = `caravan-${++this.state.caravanSerial}`;
    this.state.activeCaravans.push({
      id,
      routeId,
      fromId: route.fromId,
      toId: route.toId,
      sentDay: this.host.day,
      returnsDay: this.host.day + route.days,
      reward: route.reward,
    });
    return action(
      true,
      `商队启程：${route.name}。${route.days} 日后回报，准备费含货物与补给，不占船舱。`,
    );
  }
  private upkeep() {
    const food = Object.values(this.state.owned).reduce(
      (sum, city) => sum + city.food * 2,
      0,
    );
    return Math.max(0, Math.ceil(this.state.troops * 1.2) - food);
  }
  recruit(quantity: number): Action {
    if (!Number.isInteger(quantity) || quantity <= 0 || quantity > 100)
      return action(false, "招募人数须为 1 至 100 的整数。");
    if (
      this.host.atSea ||
      !this.state.owned[this.host.currentPortId] ||
      !portById.has(this.host.currentPortId)
    )
      return action(false, "在拥有特许权的沿海城市停靠后才能招募。");
    if (this.state.campaign)
      return action(false, "军队远征中，待战役结束再招募。");
    if (this.state.troops && this.state.armyBaseId !== this.host.currentPortId)
      return action(
        false,
        `军队驻扎在${cityById.get(this.state.armyBaseId!)?.name ?? "原驻地"}，请到驻地补充兵员。`,
      );
    if (this.state.troops + quantity > 100)
      return action(false, "军队上限为 100 人。");
    const cost = quantity * 60;
    if (!this.host.spendCash(cost))
      return action(false, `招募需要 ${cost} 金币，另有每日军饷。`);
    this.state.troops += quantity;
    this.state.armyBaseId = this.host.currentPortId;
    return action(
      true,
      `招募 ${quantity} 人；现有 ${this.state.troops} 人，每日军饷 ${this.upkeep()} 金币。`,
    );
  }
  campaignTargets() {
    if (!this.state.troops || this.state.campaign || !this.state.armyBaseId)
      return [];
    const base = cityById.get(this.state.armyBaseId)!;
    const accessible = new Set([base.id]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const road of inlandRoads) {
        if (
          accessible.has(road.a) &&
          this.state.owned[road.b] &&
          !accessible.has(road.b)
        ) {
          accessible.add(road.b);
          changed = true;
        }
        if (
          accessible.has(road.b) &&
          this.state.owned[road.a] &&
          !accessible.has(road.a)
        ) {
          accessible.add(road.a);
          changed = true;
        }
      }
    }
    return baseCities
      .filter((city) => {
        if (this.state.owned[city.id] || !this.known(city)) return false;
        const landAccess = [...accessible].some((id) => connected(id, city.id));
        const seaAccess =
          base.coastal &&
          city.coastal &&
          base.basin === city.basin &&
          kilometers(base, city) <= 2200;
        return landAccess || seaAccess;
      })
      .map((city) => {
        const days = Math.max(3, Math.ceil(kilometers(base, city) / 120) + 2),
          defense = cityDefense(city);
        const ratio = this.state.troops / defense;
        const winChance = Math.max(0.025, Math.min(0.95, (ratio - 0.2) / 2.1));
        return {
          id: city.id,
          name: city.name,
          days,
          defense,
          winChance,
          cost:
            180 +
            this.state.troops * 8 +
            days * Math.ceil(this.state.troops * 0.4),
        };
      });
  }
  disband(quantity: number): Action {
    if (this.state.campaign)
      return action(false, "战役期间不能遣散远征军，请等待部队归来。");
    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > this.state.troops
    )
      return action(false, "请选择不超过现有兵力的遣散人数。");
    this.state.troops -= quantity;
    if (!this.state.troops) this.state.armyBaseId = null;
    return action(
      true,
      `${quantity} 名士兵解甲归乡，每日军饷降至 ${this.upkeep()} 金币。招募费用不退还。`,
    );
  }
  attack(id: string): Action {
    if (this.state.campaign) return action(false, "同一时间只能进行一场战役。");
    const target = this.campaignTargets().find((city) => city.id === id);
    if (!target)
      return action(
        false,
        "目标须已发现、与己方陆路相连，或在驻军港口附近同一海域。",
      );
    if (!this.host.spendCash(target.cost))
      return action(false, `远征需 ${target.cost} 金币，另计每日军饷。`);
    const serial = ++this.state.campaignSerial;
    this.state.campaign = {
      targetId: id,
      fromId: this.state.armyBaseId!,
      sentDay: this.host.day,
      arrivesDay: this.host.day + target.days,
      force: this.state.troops,
      winChance: target.winChance,
      roll:
        hash(`${id}:${this.host.day}:${serial}:${this.state.troops}`) /
        4294967296,
      serial,
    };
    this.host.addReputation(-5);
    return action(
      true,
      `军队前往${target.name}，${target.days} 日后结算。预估胜率 ${Math.round(target.winChance * 100)}%，远征会影响商贸声望。`,
    );
  }
  army() {
    return {
      troops: this.state.troops,
      upkeep: this.upkeep(),
      campaign: this.state.campaign
        ? {
            targetId: this.state.campaign.targetId,
            arrivesDay: this.state.campaign.arrivesDay,
          }
        : null,
    };
  }
  caravans() {
    return this.state.activeCaravans.map((caravan) => ({
      id: caravan.id,
      name: `${cityById.get(caravan.fromId)!.name} → ${cityById.get(caravan.toId)!.name}`,
      returnsDay: caravan.returnsDay,
      reward: caravan.reward,
    }));
  }
  daily(): { messages: string[] } {
    const messages: string[] = [],
      day = this.host.day;
    if (day <= this.state.lastProcessedDay) return { messages };
    this.state.lastProcessedDay = day;
    let income = 0;
    for (const [id, owned] of Object.entries(this.state.owned)) {
      if (owned.acquiredDay >= day) continue;
      owned.loyalty = Math.min(
        100,
        owned.loyalty + (owned.food >= Math.max(1, owned.commerce) ? 1 : 0),
      );
      income += this.netIncome(cityById.get(id)!, owned);
    }
    if (income > 0) this.host.addCash(income);
    if (income < 0 && !this.host.spendCash(-income)) {
      for (const owned of Object.values(this.state.owned))
        owned.loyalty = Math.max(10, owned.loyalty - 1);
      messages.push(
        "城市收支出现缺口，拨款不足影响忠诚度；优先建设粮食、减少过度城防开支。",
      );
    }
    const upkeep = this.upkeep();
    if (upkeep && !this.host.spendCash(upkeep)) {
      const lost = Math.max(1, Math.ceil(this.state.troops * 0.12));
      this.state.troops = Math.max(0, this.state.troops - lost);
      if (!this.state.troops) this.state.armyBaseId = null;
      messages.push(
        `军饷不足，${lost} 名士兵离队。城市粮食建设可减轻军饷负担。`,
      );
    }
    const completed = this.state.activeCaravans.filter(
      (caravan) => caravan.returnsDay <= day,
    );
    this.state.activeCaravans = this.state.activeCaravans.filter(
      (caravan) => caravan.returnsDay > day,
    );
    for (const caravan of completed) {
      const city = cityById.get(caravan.toId)!;
      if (!city.coastal && !this.state.discovered.includes(city.id))
        this.state.discovered.push(city.id);
      this.host.addCash(caravan.reward);
      this.host.addReputation(1);
      messages.push(
        `陆地商队归来，${city.name}商路已探明；收到 ${caravan.reward} 金币回款（含本金）。`,
      );
    }
    const campaign = this.state.campaign;
    if (campaign && campaign.arrivesDay <= day) {
      this.state.campaign = null;
      const city = cityById.get(campaign.targetId)!;
      const strength = Math.min(
        1,
        this.state.troops / Math.max(1, campaign.force),
      );
      const victory =
        this.state.troops > 0 && campaign.roll < campaign.winChance * strength;
      const lossRate = victory
        ? 0.12 + campaign.roll * 0.13
        : 0.35 + campaign.roll * 0.25;
      const losses = Math.min(
        this.state.troops,
        Math.max(1, Math.ceil(this.state.troops * lossRate)),
      );
      this.state.troops -= losses;
      if (!this.state.troops) this.state.armyBaseId = null;
      if (victory && !this.state.owned[city.id]) {
        this.state.owned[city.id] = {
          commerce: 0,
          food: 0,
          defense: 0,
          loyalty: 35,
          acquiredDay: day,
          method: "conquest",
        };
        this.host.addReputation(-7);
        messages.push(
          `取得${city.name}控制权，损失 ${losses} 人。当地忠诚度仅 35，须建设粮食恢复收入。`,
        );
      } else
        messages.push(
          `${city.name}远征失利，${losses} 人离队；残部已返回原驻地。先积累贸易收入并补充军力。`,
        );
    }
    return { messages };
  }
}

export function readDominionState(
  raw: unknown,
  day: number,
): DominionState | null {
  if (raw === undefined) return createDominionState();
  if (
    !raw ||
    typeof raw !== "object" ||
    Array.isArray(raw) ||
    !Number.isInteger(day) ||
    day < 0
  )
    return null;
  const state = raw as DominionState;
  const integer = (value: unknown, min: number, max: number): value is number =>
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= min &&
    value <= max;
  const record = (value: unknown): value is Record<string, unknown> =>
    !!value && typeof value === "object" && !Array.isArray(value);
  if (
    state.version !== 1 ||
    !record(state.owned) ||
    Object.keys(state.owned).length > baseCities.length ||
    !Array.isArray(state.discovered) ||
    state.discovered.length > inlandCities.length ||
    new Set(state.discovered).size !== state.discovered.length ||
    state.discovered.some(
      (id) => typeof id !== "string" || !inlandById.has(id),
    ) ||
    !integer(state.troops, 0, 100) ||
    !integer(state.campaignSerial, 0, 10000000) ||
    !integer(state.caravanSerial, 0, 10000000) ||
    !integer(state.lastProcessedDay, -1, day)
  )
    return null;
  for (const [id, value] of Object.entries(state.owned)) {
    if (
      !cityById.has(id) ||
      !record(value) ||
      !integer(value.commerce, 0, 3) ||
      !integer(value.food, 0, 3) ||
      !integer(value.defense, 0, 3) ||
      !integer(value.loyalty, 0, 100) ||
      !integer(value.acquiredDay, 0, day) ||
      !["charter", "conquest"].includes(value.method as string)
    )
      return null;
    if (inlandById.has(id) && !state.discovered.includes(id)) return null;
  }
  if (
    state.armyBaseId !== null &&
    (typeof state.armyBaseId !== "string" ||
      !portById.has(state.armyBaseId) ||
      !state.owned[state.armyBaseId])
  )
    return null;
  if (state.troops > 0 && state.armyBaseId === null) return null;
  if (!Array.isArray(state.activeCaravans) || state.activeCaravans.length > 3)
    return null;
  const caravanIds = new Set<string>(),
    roadIds = new Set<string>();
  for (const caravan of state.activeCaravans) {
    if (
      !record(caravan) ||
      typeof caravan.id !== "string" ||
      !/^caravan-\d{1,8}$/.test(caravan.id) ||
      Number(caravan.id.slice(8)) < 1 ||
      Number(caravan.id.slice(8)) > state.caravanSerial ||
      caravanIds.has(caravan.id) ||
      typeof caravan.routeId !== "string" ||
      roadIds.has(caravan.routeId)
    )
      return null;
    const road = roadById.get(caravan.routeId);
    if (
      !road ||
      !state.owned[caravan.fromId] ||
      !(
        (road.a === caravan.fromId && road.b === caravan.toId) ||
        (road.b === caravan.fromId && road.a === caravan.toId)
      ) ||
      !integer(caravan.sentDay, 0, day) ||
      !integer(
        caravan.returnsDay,
        caravan.sentDay + 1,
        caravan.sentDay + 100,
      ) ||
      !integer(caravan.reward, 1, 20000)
    )
      return null;
    const from = cityById.get(caravan.fromId)!,
      to = cityById.get(caravan.toId)!;
    const days = Math.max(3, Math.ceil(road.km / 100) + 2);
    const cost = 100 + days * 18 + Math.max(from.era, to.era) * 40;
    const possibleRewards = [0, 1, 2, 3].map((commerce) =>
      Math.round(cost * (1.18 + commerce * 0.035) + days * 4),
    );
    if (
      caravan.returnsDay !== caravan.sentDay + days ||
      !possibleRewards.includes(caravan.reward)
    )
      return null;
    caravanIds.add(caravan.id);
    roadIds.add(caravan.routeId);
  }
  if (state.campaign !== null) {
    const campaign = state.campaign;
    if (
      !record(campaign) ||
      typeof campaign.targetId !== "string" ||
      !cityById.has(campaign.targetId) ||
      state.owned[campaign.targetId] ||
      typeof campaign.fromId !== "string" ||
      !state.owned[campaign.fromId] ||
      !portById.has(campaign.fromId) ||
      !integer(campaign.sentDay, 0, day) ||
      !integer(
        campaign.arrivesDay,
        campaign.sentDay + 1,
        campaign.sentDay + 100,
      ) ||
      !integer(campaign.force, 1, 100) ||
      !integer(campaign.serial, 1, state.campaignSerial) ||
      typeof campaign.winChance !== "number" ||
      !Number.isFinite(campaign.winChance) ||
      campaign.winChance < 0.025 ||
      campaign.winChance > 0.95 ||
      typeof campaign.roll !== "number" ||
      !Number.isFinite(campaign.roll) ||
      campaign.roll < 0 ||
      campaign.roll >= 1
    )
      return null;
    const target = cityById.get(campaign.targetId)!,
      base = cityById.get(campaign.fromId)!;
    const days = Math.max(3, Math.ceil(kilometers(base, target) / 120) + 2);
    const chance = Math.max(
      0.025,
      Math.min(0.95, (campaign.force / cityDefense(target) - 0.2) / 2.1),
    );
    if (
      campaign.arrivesDay !== campaign.sentDay + days ||
      campaign.winChance !== chance ||
      campaign.serial !== state.campaignSerial ||
      campaign.force < state.troops ||
      (state.troops > 0 && state.armyBaseId !== campaign.fromId) ||
      (!target.coastal && !state.discovered.includes(target.id))
    )
      return null;
    if (
      campaign.roll !==
      hash(
        `${campaign.targetId}:${campaign.sentDay}:${campaign.serial}:${campaign.force}`,
      ) /
        4294967296
    )
      return null;
  }
  return {
    version: 1,
    owned: Object.fromEntries(
      Object.entries(state.owned).map(([id, owned]) => [id, { ...owned }]),
    ),
    discovered: [...state.discovered],
    activeCaravans: state.activeCaravans.map((caravan) => ({ ...caravan })),
    troops: state.troops,
    armyBaseId: state.armyBaseId,
    campaign: state.campaign ? { ...state.campaign } : null,
    campaignSerial: state.campaignSerial,
    caravanSerial: state.caravanSerial,
    lastProcessedDay: state.lastProcessedDay,
  };
}
