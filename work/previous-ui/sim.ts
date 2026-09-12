export type ViewMode = '2d' | '3d';

export type Era = {
  id: string;
  title: string;
  years: string;
  subtitle: string;
  tech: string;
  color: string;
};

export type Port = {
  id: string;
  name: string;
  polity: string;
  region: string;
  x: number;
  y: number;
  produces: string[];
  demands: string[];
  era: number;
  danger: number;
};

export type Good = {
  id: string;
  name: string;
  icon: string;
  base: number;
  unit: string;
  color: string;
};

export type Origin = {
  id: string;
  title: string;
  portId: string;
  region: string;
  note: string;
  perk: string;
  capital: number;
  goods: Record<string, number>;
  accent: string;
};

export type Cargo = Record<string, number>;

export type GameState = {
  day: number;
  eraIndex: number;
  cash: number;
  reputation: number;
  currentPortId: string;
  destinationId: string | null;
  ship: { name: string; capacity: number; hull: number; maxHull: number; speed: number; level: number };
  cargo: Cargo;
  marketShift: Record<string, number>;
  routeRisk: number;
  lastEvent: string;
  started: boolean;
};

export const eras: Era[] = [
  { id: 'river', title: '河口与海湾贸易', years: '前 3000 — 前 1800', subtitle: '谷物、盐与早期航路', tech: '芦苇船 · 标准度量', color: '#cf9f52' },
  { id: 'bronze', title: '青铜海路', years: '前 1800 — 前 1200', subtitle: '铜、锡与黎凡特木材', tech: '缝合木船 · 季风观测', color: '#b98549' },
  { id: 'iron', title: '铁器与城邦', years: '前 1200 — 前 600', subtitle: '玻璃、染料与葡萄酒', tech: '桨帆船 · 港口关税', color: '#987b62' },
  { id: 'classical', title: '古典帝国商路', years: '前 600 — 公元 200', subtitle: '地中海、红海与印度洋', tech: '远洋帆桨船 · 护航', color: '#6d9c9d' },
  { id: 'late-antique', title: '晚古代海网', years: '200 — 700', subtitle: '拜占庭、萨珊与东非', tech: '季风历法 · 海上驿站', color: '#628d86' },
  { id: 'monsoon', title: '季风商网', years: '700 — 1000', subtitle: '阿拉伯海与唐代港口', tech: '三角帆 · 商业票据', color: '#4f8b93' },
  { id: 'medieval', title: '中世纪远洋', years: '1000 — 1300', subtitle: '宋元、印度洋与南洋', tech: '中国帆船 · 保险雏形', color: '#6c8fa1' },
  { id: 'crossroads', title: '跨洲商网', years: '1300 — 1450', subtitle: '威尼斯、泉州与霍尔木兹', tech: '罗盘 · 航海图', color: '#8c9a91' },
  { id: 'oceanic', title: '大洋航路', years: '1450 — 1600', subtitle: '加勒比、印度洋与环球航线', tech: '卡拉维尔 · 克拉克', color: '#c77f5c' },
  { id: 'global', title: '全球商网', years: '1600 — 1700', subtitle: '马尼拉、月港与特许商会', tech: '盖伦船 · 远洋保险', color: '#bd7254' },
  { id: 'early-modern', title: '近代早期', years: '1700 — 1750', subtitle: '全球价格联动的前夜', tech: '大型商船 · 商业金融', color: '#a56753' },
];

export const goods: Good[] = [
  { id: 'grain', name: '谷物', icon: '粮', base: 18, unit: '袋', color: '#d3b37c' },
  { id: 'salt', name: '盐', icon: '盐', base: 26, unit: '罐', color: '#c8d4d1' },
  { id: 'linen', name: '亚麻', icon: '麻', base: 42, unit: '捆', color: '#d4c4a2' },
  { id: 'copper', name: '铜锭', icon: '铜', base: 82, unit: '块', color: '#b66e4b' },
  { id: 'cedar', name: '雪松木', icon: '木', base: 66, unit: '段', color: '#78927e' },
  { id: 'pottery', name: '陶器', icon: '陶', base: 58, unit: '箱', color: '#b87355' },
  { id: 'oil', name: '橄榄油', icon: '油', base: 74, unit: '罐', color: '#a0a64e' },
  { id: 'dye', name: '紫染料', icon: '染', base: 145, unit: '匣', color: '#95658f' },
];

export const ports: Port[] = [
  { id: 'memphis', name: '尼罗河口', polity: '古埃及', region: '尼罗河三角洲', x: -0.76, y: 0.06, produces: ['grain', 'linen', 'pottery'], demands: ['cedar', 'copper', 'salt'], era: 0, danger: 0.12 },
  { id: 'ur', name: '乌尔', polity: '两河城邦', region: '波斯湾北岸', x: -0.2, y: -0.18, produces: ['grain', 'linen', 'pottery'], demands: ['cedar', 'copper', 'salt'], era: 0, danger: 0.16 },
  { id: 'dilmun', name: '迪尔蒙', polity: '海湾中转地', region: '波斯湾', x: 0.11, y: -0.28, produces: ['salt', 'copper'], demands: ['grain', 'cedar', 'pottery'], era: 0, danger: 0.24 },
  { id: 'lothal', name: '洛塔尔', polity: '印度河流域', region: '古吉拉特沿岸', x: 0.58, y: -0.02, produces: ['linen', 'pottery', 'salt'], demands: ['copper', 'cedar', 'grain'], era: 0, danger: 0.29 },
  { id: 'byblos', name: '比布鲁斯', polity: '黎凡特港邦', region: '东地中海', x: -0.36, y: 0.35, produces: ['cedar', 'dye', 'pottery'], demands: ['grain', 'copper', 'linen'], era: 0, danger: 0.18 },
  { id: 'crete', name: '克里特', polity: '爱琴海港邦', region: '爱琴海', x: -0.9, y: 0.44, produces: ['oil', 'pottery', 'salt'], demands: ['grain', 'cedar', 'dye'], era: 0, danger: 0.21 },
];

export const origins: Origin[] = [
  { id: 'egypt', title: '尼罗河三角洲', portId: 'memphis', region: '古埃及 · 前 2500 年', note: '丰饶河谷让第一趟商路更稳。', perk: '粮食与亚麻的本地采购价 -10%', capital: 850, goods: { grain: 12, linen: 5 }, accent: '#c68b47' },
  { id: 'mesopotamia', title: '两河下游', portId: 'ur', region: '城邦商人 · 前 2500 年', note: '账册和仓储是家族最早的资产。', perk: '仓储损耗 -15%，谷物售价 +5%', capital: 920, goods: { grain: 8, pottery: 4 }, accent: '#a77755' },
  { id: 'levant', title: '黎凡特海岸', portId: 'byblos', region: '港邦联盟 · 前 1800 年', note: '木材与染料带来更远的海风。', perk: '远洋风险判断 +15%，木材采购价 -12%', capital: 780, goods: { cedar: 4, dye: 2 }, accent: '#73928d' },
];

const cloneCargo = (): Cargo => Object.fromEntries(goods.map((good) => [good.id, 0]));

export class TradeSim {
  state: GameState = {
    day: 1,
    eraIndex: 0,
    cash: 0,
    reputation: 12,
    currentPortId: 'memphis',
    destinationId: null,
    ship: { name: '河口号', capacity: 30, hull: 100, maxHull: 100, speed: 1, level: 1 },
    cargo: cloneCargo(),
    marketShift: Object.fromEntries(ports.map((port) => [port.id, 0])),
    routeRisk: 0,
    lastEvent: '等待出航',
    started: false,
  };

  private seeded(portId: string, goodId: string): number {
    const source = `${portId}:${goodId}:${this.state.day}:${this.state.eraIndex}`;
    let hash = 2166136261;
    for (let i = 0; i < source.length; i += 1) hash = Math.imul(hash ^ source.charCodeAt(i), 16777619);
    return ((hash >>> 0) % 1000) / 1000;
  }

  start(origin: Origin): void {
    this.state.cash = origin.capital;
    this.state.currentPortId = origin.portId;
    this.state.cargo = cloneCargo();
    Object.entries(origin.goods).forEach(([goodId, amount]) => { this.state.cargo[goodId] = amount; });
    this.state.started = true;
    this.state.lastEvent = `家族从${origin.title}启航`;
  }

  port(id = this.state.currentPortId): Port {
    return ports.find((port) => port.id === id) ?? ports[0];
  }

  destination(id: string): Port { return this.port(id); }

  cargoCount(): number { return Object.values(this.state.cargo).reduce((sum, amount) => sum + amount, 0); }

  price(portId: string, goodId: string): number {
    const port = this.port(portId);
    const good = goods.find((item) => item.id === goodId) ?? goods[0];
    const supply = port.produces.includes(goodId) ? 0.72 : port.demands.includes(goodId) ? 1.42 : 1.02;
    const noise = 0.88 + this.seeded(portId, goodId) * 0.3;
    const pressure = 1 + (this.state.marketShift[portId] ?? 0) * 0.04;
    return Math.max(5, Math.round(good.base * supply * noise * pressure));
  }

  buy(goodId: string, amount: number): boolean {
    const price = this.price(this.state.currentPortId, goodId);
    const affordable = Math.floor(this.state.cash / price);
    const room = this.state.ship.capacity - this.cargoCount();
    const quantity = Math.max(0, Math.min(amount, affordable, room));
    if (!quantity) return false;
    this.state.cash -= quantity * price;
    this.state.cargo[goodId] += quantity;
    this.state.marketShift[this.state.currentPortId] += quantity / 16;
    this.state.lastEvent = `购入 ${quantity} 单位${goods.find((good) => good.id === goodId)?.name ?? goodId}`;
    return true;
  }

  sell(goodId: string, amount: number): boolean {
    const owned = this.state.cargo[goodId] ?? 0;
    const quantity = Math.max(0, Math.min(amount, owned));
    if (!quantity) return false;
    const price = this.price(this.state.currentPortId, goodId);
    this.state.cash += quantity * price;
    this.state.cargo[goodId] -= quantity;
    this.state.marketShift[this.state.currentPortId] -= quantity / 18;
    this.state.reputation = Math.min(100, this.state.reputation + quantity * 0.08);
    this.state.lastEvent = `售出 ${quantity} 单位${goods.find((good) => good.id === goodId)?.name ?? goodId}`;
    return true;
  }

  sail(destinationId: string): boolean {
    if (destinationId === this.state.currentPortId || this.cargoCount() > this.state.ship.capacity) return false;
    const origin = this.port();
    const destination = this.port(destinationId);
    const dx = destination.x - origin.x;
    const dy = destination.y - origin.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const days = Math.max(1, Math.round(2 + distance * 5 / this.state.ship.speed));
    const risk = Math.min(0.78, 0.08 + distance * 0.12 + destination.danger * 0.32 - this.state.reputation / 800);
    this.state.destinationId = destinationId;
    this.state.routeRisk = risk;
    this.state.day += days;
    this.state.currentPortId = destinationId;
    this.state.destinationId = null;
    this.state.ship.hull = Math.max(8, this.state.ship.hull - Math.round(risk * 19));
    const roll = this.seeded(destinationId, 'event');
    if (roll < risk * 0.32) {
      const loss = Math.min(this.cargoCount(), Math.max(1, Math.round(this.cargoCount() * 0.12)));
      const first = goods.find((good) => this.state.cargo[good.id] > 0);
      if (first) this.state.cargo[first.id] -= loss;
      this.state.lastEvent = `海况突变：损失 ${loss} 单位货物，船体受到冲击`;
      this.state.reputation = Math.max(0, this.state.reputation - 1);
    } else if (roll < risk * 0.55) {
      const toll = Math.max(6, Math.round(this.state.cash * risk * 0.08));
      this.state.cash = Math.max(0, this.state.cash - toll);
      this.state.lastEvent = `遇到巡逻船：支付 ${toll} 金币通行费`;
    } else {
      this.state.lastEvent = `顺利抵达${destination.name}，航程 ${days} 日`;
    }
    return true;
  }

  repair(): boolean {
    const missing = this.state.ship.maxHull - this.state.ship.hull;
    const cost = Math.ceil(missing * (1.6 + this.state.ship.level * 0.25));
    if (!missing || this.state.cash < cost) return false;
    this.state.cash -= cost;
    this.state.ship.hull = this.state.ship.maxHull;
    this.state.lastEvent = `船坞维修完成，花费 ${cost} 金币`;
    return true;
  }

  upgrade(): boolean {
    const cost = Math.round(480 * this.state.ship.level ** 1.45);
    if (this.state.cash < cost) return false;
    this.state.cash -= cost;
    this.state.ship.level += 1;
    this.state.ship.capacity += 8;
    this.state.ship.maxHull += 10;
    this.state.ship.hull = this.state.ship.maxHull;
    this.state.ship.speed += 0.12;
    this.state.lastEvent = `船体升级至 Lv.${this.state.ship.level}`;
    return true;
  }

  nextDay(): void {
    this.state.day += 1;
    this.state.lastEvent = '港口进入新一日，市场开始重新报价';
  }

  routeScore(destinationId: string): { profit: number; days: number; risk: number; grade: string } {
    const origin = this.port();
    const destination = this.port(destinationId);
    const dx = destination.x - origin.x;
    const dy = destination.y - origin.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const candidates = goods.map((good) => ({ good, delta: this.price(destinationId, good.id) - this.price(origin.id, good.id) })).sort((a, b) => b.delta - a.delta);
    const best = candidates[0];
    const quantity = Math.min(this.state.ship.capacity - this.cargoCount(), 18);
    const profit = Math.max(0, best.delta * quantity - Math.round(distance * 18));
    const risk = Math.min(0.78, 0.08 + distance * 0.12 + destination.danger * 0.32 - this.state.reputation / 800);
    const days = Math.max(1, Math.round(2 + distance * 5 / this.state.ship.speed));
    return { profit, days, risk, grade: risk < 0.22 ? '稳健' : risk < 0.42 ? '平衡' : '激进' };
  }

  export(): string { return JSON.stringify(this.state); }

  import(serialized: string): boolean {
    try { this.state = { ...this.state, ...JSON.parse(serialized) } as GameState; return true; } catch { return false; }
  }
}
