import {
  eras,
  goods,
  ports,
  origins,
  goodsForPort,
  goodById,
  portById,
  type Era,
  type Good,
  type Port,
  type Origin,
} from "./data";
import {
  createMarketEvent,
  marketEventFactor,
  readMarketEvents,
  type MarketEvent,
} from "./market-events";
import {
  createNavigation,
  readNavigation,
  planSeaRoute,
  advanceNavigation,
  navigationHazards,
  distanceDegrees,
  portPoint,
  type NavigationState,
  type GeoPoint,
} from "./navigation";
import {
  PortLife,
  createLifeState,
  readLifeState,
  type LifeState,
} from "./port-life";
import {
  Dominion,
  createDominionState,
  readDominionState,
  type DominionState,
} from "./dominion";
export { eras, goods, ports, origins };
export { createMarketEvent, marketEventFactor } from "./market-events";
export type { MarketEvent, MarketEventKind } from "./market-events";
export type { Era, Good, Port, Origin };
export type ViewMode = "2d" | "3d";
export type Cargo = Record<string, number>;
export type Strategy = "avoid" | "ransom" | "flee" | "defend";
export type SalePreview = {
  quantity: number;
  revenue: number;
  costBasis: number;
  tradingProfit: number;
  costBasisEstimated: boolean;
};
export type TradeReceipt = {
  day: number;
  portId: string;
  goodId: string;
  side: "buy" | "sell";
  quantity: number;
  total: number;
  costBasis: number;
  tradingProfit: number | null;
  costBasisEstimated: boolean;
};
export type TradeLedger = {
  sinceDay: number;
  revenue: number;
  costBasis: number;
  realizedTradingProfit: number;
  costBasisEstimated: boolean;
};
export type VoyageExpenses = {
  fromId: string;
  toId: string;
  startedDay: number;
  endedDay: number | null;
  wages: number;
  transfer: number;
  suppliesUsed: number;
  suppliesCost: number;
  ransom: number;
  cargoLossQuantity: number;
  cargoLossCost: number;
  costBasisEstimated: boolean;
  partial: boolean;
};
export type Voyage = {
  pace?: number;
  fromId: string;
  toId: string;
  totalDays: number;
  elapsedDays: number;
  risk: number;
  strategy: Strategy;
  dailySupply: number;
  wages: number;
};
export type GameState = {
  version: 2;
  day: number;
  eraIndex: number;
  cash: number;
  reputation: number;
  currentPortId: string;
  destinationId: string | null;
  ship: {
    name: string;
    capacity: number;
    hull: number;
    maxHull: number;
    speed: number;
    level: number;
  };
  cargo: Cargo;
  cargoCost: Cargo;
  cargoCostEstimated: Record<string, boolean>;
  tradeLedger: TradeLedger;
  lastTrade: TradeReceipt | null;
  lastVoyage: VoyageExpenses | null;
  marketShift: Record<string, number>;
  marketEvents: MarketEvent[];
  stock: Record<string, Record<string, number>>;
  investments: Record<string, number>;
  routeRisk: number;
  lastEvent: string;
  started: boolean;
  originId: string;
  supplies: number;
  fleetSize: number;
  strategy: Strategy;
  voyage: Voyage | null;
  navigation: NavigationState;
  life: LifeState;
  dominion: DominionState;
  logs: string[];
  sandbox: boolean;
  sandboxUnlocked: boolean;
  generation: number;
  visited: string[];
  profits: number;
};
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const dict = (items: string[], value = 0): Record<string, number> =>
  Object.fromEntries(items.map((id) => [id, value]));
const fresh = (): GameState => ({
  version: 2,
  day: 1,
  eraIndex: 0,
  cash: 0,
  reputation: 15,
  currentPortId: ports[0].id,
  destinationId: null,
  ship: {
    name: "河口号",
    capacity: 30,
    hull: 100,
    maxHull: 100,
    speed: 1,
    level: 1,
  },
  cargo: dict(goods.map((g) => g.id)),
  cargoCost: dict(goods.map((g) => g.id)),
  cargoCostEstimated: Object.fromEntries(goods.map((g) => [g.id, false])),
  tradeLedger: {
    sinceDay: 1,
    revenue: 0,
    costBasis: 0,
    realizedTradingProfit: 0,
    costBasisEstimated: false,
  },
  lastTrade: null,
  lastVoyage: null,
  marketShift: dict(ports.map((p) => p.id)),
  marketEvents: [],
  stock: Object.fromEntries(
    ports.map((p) => [
      p.id,
      dict(
        goodsForPort(p.id, 10, true).map((g) => g.id),
        100,
      ),
    ]),
  ),
  investments: dict(ports.map((p) => p.id)),
  routeRisk: 0,
  lastEvent: "等待家族起航",
  started: false,
  originId: origins[0].id,
  supplies: 90,
  fleetSize: 1,
  strategy: "avoid",
  voyage: null,
  navigation: createNavigation(ports[0], 1),
  life: createLifeState(),
  dominion: createDominionState(),
  logs: [],
  sandbox: false,
  sandboxUnlocked: false,
  generation: 1,
  visited: [],
  profits: 0,
});
export class TradeSim {
  state: GameState = fresh();
  dominion(): Dominion {
    const sim = this;
    return new Dominion(this.state.dominion, {
      get day() {
        return sim.state.day;
      },
      get eraIndex() {
        return sim.state.eraIndex;
      },
      get currentPortId() {
        return sim.state.currentPortId;
      },
      get cash() {
        return sim.state.cash;
      },
      get atSea() {
        return !!sim.state.voyage;
      },
      get visited() {
        return sim.state.visited;
      },
      spendCash: (amount) => {
        if (!Number.isFinite(amount) || amount < 0 || sim.state.cash < amount)
          return false;
        sim.state.cash -= amount;
        return true;
      },
      addCash: (amount) => {
        if (Number.isFinite(amount) && amount >= 0) sim.state.cash += amount;
      },
      addReputation: (amount) => {
        sim.state.reputation = clamp(sim.state.reputation + amount, 0, 100);
      },
    });
  }
  life(portId = this.state.currentPortId): PortLife {
    const sim = this;
    return new PortLife(this.state.life, {
      get day() {
        return sim.state.day;
      },
      get eraIndex() {
        return sim.state.eraIndex;
      },
      get currentPortId() {
        return portId;
      },
      get cash() {
        return sim.state.cash;
      },
      get atSea() {
        return !!sim.state.voyage;
      },
      get supplies() {
        return sim.state.supplies;
      },
      get shipCapacity() {
        return sim.state.ship.capacity;
      },
      cargo: (id) => sim.state.cargo[id] || 0,
      marketGoods: (id) =>
        goodsForPort(id, sim.state.eraIndex, sim.state.sandbox),
      spendCash: (amount) => {
        if (!Number.isFinite(amount) || amount < 0 || sim.state.cash < amount)
          return false;
        sim.state.cash -= amount;
        return true;
      },
      addCash: (amount) => {
        if (Number.isFinite(amount) && amount >= 0) sim.state.cash += amount;
      },
      consumeCargo: (id, qty) => {
        if (
          !Number.isInteger(qty) ||
          qty < 0 ||
          !goodById.has(id) ||
          sim.state.cargo[id] < qty
        )
          return false;
        sim.removeCargo(id, qty);
        return true;
      },
      addReputation: (amount) => {
        sim.state.reputation = clamp(sim.state.reputation + amount, 0, 100);
      },
    });
  }
  capacity(): number {
    return this.state.ship.capacity + this.life().bonuses().capacity;
  }
  private random(key: string): number {
    let h = 2166136261;
    for (const c of `${key}:${this.state.day}:${this.state.originId}`)
      h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    return (h >>> 0) / 4294967296;
  }
  private log(text: string): void {
    this.state.lastEvent = text;
    this.state.logs.push(`第 ${this.state.day} 日 · ${text}`);
    if (this.state.logs.length > 100) this.state.logs.shift();
  }
  private fail(text: string): false {
    this.state.lastEvent = text;
    return false;
  }
  private docked(): boolean {
    return this.state.started && !this.state.voyage;
  }
  start(origin: Origin): void {
    const valid = origins.find((o) => o.id === origin.id);
    if (!valid) return;
    this.state = fresh();
    Object.assign(this.state, {
      started: true,
      cash: valid.capital,
      currentPortId: valid.portId,
      originId: valid.id,
      eraIndex: valid.era,
      visited: [valid.portId],
    });
    Object.assign(this.state.cargo, valid.goods);
    this.state.navigation = createNavigation(this.port(), this.state.day);
    for (const good of goods) {
      this.state.cargoCost[good.id] = this.state.cargo[good.id] * good.base;
      this.state.cargoCostEstimated[good.id] = this.state.cargo[good.id] > 0;
    }
    this.log(
      `家族在${valid.title}建立商号。起始货物按商品标准参考价入账，出售差额不含航行开支。`,
    );
    this.publishMarketEvent(true);
  }
  private publishMarketEvent(local = false): void {
    const reportPorts = this.availablePorts().filter(
      (port) => !local || port.basin === this.port().basin,
    );
    const event = createMarketEvent(
      this.state.day,
      reportPorts,
      this.availableGoods(),
      (key) => this.random(key),
    );
    this.state.marketEvents.push(event);
    this.state.marketEvents = this.state.marketEvents.slice(-32);
    this.log(`远港来信 · ${event.source}：${event.clue}`);
  }
  port(id = this.state.currentPortId): Port {
    return portById.get(id) ?? ports[0];
  }
  destination(id: string): Port {
    return this.port(id);
  }
  availablePorts(): Port[] {
    return ports.filter(
      (p) => p.era <= this.state.eraIndex || this.state.sandbox,
    );
  }
  availableGoods(): Good[] {
    return goods.filter(
      (g) => g.era <= this.state.eraIndex || this.state.sandbox,
    );
  }
  marketGoods(portId = this.state.currentPortId): Good[] {
    const local = goodsForPort(portId, this.state.eraIndex, this.state.sandbox);
    const held = goods.filter(
      (g) =>
        (this.state.cargo[g.id] || 0) > 0 && !local.some((x) => x.id === g.id),
    );
    return [...local, ...held];
  }
  marketStock(portId: string, goodId: string): number {
    return this.state.stock[portId]?.[goodId] ?? 0;
  }
  cargoCount(): number {
    return Object.values(this.state.cargo).reduce((a, b) => a + b, 0);
  }
  cargoUnitCost(goodId: string): number {
    const quantity = this.state.cargo[goodId] || 0;
    return quantity > 0 ? this.state.cargoCost[goodId] / quantity : 0;
  }
  salePreview(goodId: string, amount: number): SalePreview {
    const quote = this.quote(goodId, amount, "sell");
    const held = this.state.cargo[goodId] || 0;
    const costBasis =
      held && quote.quantity
        ? this.state.cargoCost[goodId] * (quote.quantity / held)
        : 0;
    return {
      quantity: quote.quantity,
      revenue: quote.total,
      costBasis,
      tradingProfit: quote.total - costBasis,
      costBasisEstimated:
        quote.quantity > 0 && this.state.cargoCostEstimated[goodId],
    };
  }
  voyageExpenseReport():
    | (VoyageExpenses & { operatingCost: number; totalRecordedCost: number })
    | null {
    const report = this.state.lastVoyage;
    if (!report) return null;
    const operatingCost =
      report.wages + report.transfer + report.suppliesCost + report.ransom;
    return {
      ...report,
      operatingCost,
      totalRecordedCost: operatingCost + report.cargoLossCost,
    };
  }
  private removeCargo(goodId: string, quantity: number): number {
    const held = this.state.cargo[goodId];
    if (!held || !quantity) return 0;
    const removedCost = this.state.cargoCost[goodId] * (quantity / held);
    this.state.cargo[goodId] -= quantity;
    this.state.cargoCost[goodId] =
      quantity === held
        ? 0
        : Math.max(0, this.state.cargoCost[goodId] - removedCost);
    if (quantity === held) this.state.cargoCostEstimated[goodId] = false;
    return removedCost;
  }
  tax(portId = this.state.currentPortId): number {
    return Math.max(
      0.025,
      0.06 -
        (this.state.investments[portId] || 0) * 0.006 -
        this.state.reputation * 0.0001 -
        this.life(portId).bonuses().taxReduction,
    );
  }
  private discount(goodId: string): number {
    const o = this.state.originId;
    const eligible: Record<string, [string[], number]> = {
      egypt: [["grain", "linen"], 0.1],
      mesopotamia: [["pottery"], 0.12],
      levant: [["cedar"], 0.12],
      dilmun: [["salt", "copper"], 0.08],
      indus: [["linen", "pottery"], 0.1],
      oman: [["copper"], 0.12],
    };
    const entry = eligible[o];
    return entry && entry[0].includes(goodId) ? entry[1] : 0;
  }
  private rawPrice(
    portId: string,
    goodId: string,
    stockOverride?: number,
  ): number {
    const p = portById.get(portId),
      g = goodById.get(goodId);
    if (!p || !g) return 0;
    const local = p.produces.includes(goodId)
      ? 0.72
      : p.demands.includes(goodId)
        ? 1.5
        : 1.06;
    const stock = stockOverride ?? this.marketStock(portId, goodId);
    const pressure = clamp(1 + (100 - stock) * 0.004, 0.62, 1.7);
    const seasonal = 1 + (this.random(`${portId}:${goodId}`) - 0.5) * 0.09;
    const eventFactor = marketEventFactor(
      this.state.marketEvents,
      portId,
      goodId,
      this.state.day,
    );
    return Math.max(5, g.base * local * pressure * seasonal * eventFactor);
  }
  price(portId: string, goodId: string): number {
    return Math.round(this.rawPrice(portId, goodId));
  }
  buyPrice(portId: string, goodId: string, stockOverride?: number): number {
    return Math.max(
      this.sellPrice(portId, goodId, (stockOverride ?? this.marketStock(portId, goodId)) - 1) + 1,
      Math.ceil(
        this.rawPrice(portId, goodId, stockOverride) *
          1.05 *
          (1 - this.discount(goodId)) *
          (1 -
            (this.port(portId).produces.includes(goodId)
              ? this.life(portId).bonuses().production
              : 0)),
      ),
    );
  }
  sellPrice(portId: string, goodId: string, stockOverride?: number): number {
    return Math.max(
      1,
      Math.floor(
        this.rawPrice(portId, goodId, stockOverride) *
          (0.91 - this.tax(portId)),
      ),
    );
  }
  quote(
    goodId: string,
    amount: number,
    side: "buy" | "sell",
    portId = this.state.currentPortId,
  ): { quantity: number; total: number } {
    if (
      !goodById.has(goodId) ||
      !portById.has(portId) ||
      !Number.isFinite(amount)
    )
      return { quantity: 0, total: 0 };
    const inventory = this.marketStock(portId, goodId);
    const freeCapacity = this.capacity() - this.cargoCount();
    let total = 0,
      quantity = 0;
    const max = Math.max(
      0,
      Math.min(
        10000,
        Math.floor(amount),
        side === "buy" ? inventory : this.state.cargo[goodId],
      ),
    );
    for (let i = 0; i < max; i++) {
      const price =
        side === "buy"
          ? this.buyPrice(portId, goodId, inventory - i)
          : this.sellPrice(portId, goodId, inventory + i);
      if (
        side === "buy" &&
        (total + price > this.state.cash || quantity >= freeCapacity)
      )
        break;
      total += price;
      quantity++;
    }
    return { quantity, total };
  }
  buy(goodId: string, amount: number): boolean {
    if (!this.docked()) return this.fail("请先停靠港口再交易。");
    if (!this.availableGoods().some((g) => g.id === goodId))
      return this.fail("该货物尚未开放。");
    const q = this.quote(goodId, amount, "buy");
    if (!q.quantity) return this.fail("金币、货舱或市场库存不足。");
    this.state.cash -= q.total;
    this.state.cargo[goodId] += q.quantity;
    this.state.cargoCost[goodId] += q.total;
    this.state.stock[this.state.currentPortId][goodId] -= q.quantity;
    this.state.lastTrade = {
      day: this.state.day,
      portId: this.state.currentPortId,
      goodId,
      side: "buy",
      quantity: q.quantity,
      total: q.total,
      costBasis: q.total,
      tradingProfit: null,
      costBasisEstimated: false,
    };
    this.log(
      `购入 ${q.quantity} ${goods.find((g) => g.id === goodId)!.unit}${goods.find((g) => g.id === goodId)!.name}，支付 ${q.total} 金币。`,
    );
    return true;
  }
  sell(goodId: string, amount: number): boolean {
    if (!this.docked()) return this.fail("请先停靠港口再交易。");
    if (!this.availableGoods().some((g) => g.id === goodId))
      return this.fail("该货物尚未开放。");
    const preview = this.salePreview(goodId, amount);
    const q = { quantity: preview.quantity, total: preview.revenue };
    if (!q.quantity) return this.fail("没有可出售的货物。");
    this.state.cash += q.total;
    this.removeCargo(goodId, q.quantity);
    this.state.stock[this.state.currentPortId][goodId] =
      this.marketStock(this.state.currentPortId, goodId) + q.quantity;
    this.state.reputation = clamp(
      this.state.reputation + q.quantity * 0.04,
      0,
      100,
    );
    this.state.profits += q.total;
    this.state.tradeLedger.revenue += q.total;
    this.state.tradeLedger.costBasis += preview.costBasis;
    this.state.tradeLedger.realizedTradingProfit =
      this.state.tradeLedger.revenue - this.state.tradeLedger.costBasis;
    this.state.tradeLedger.costBasisEstimated ||= preview.costBasisEstimated;
    this.state.lastTrade = {
      day: this.state.day,
      portId: this.state.currentPortId,
      goodId,
      side: "sell",
      quantity: q.quantity,
      total: q.total,
      costBasis: preview.costBasis,
      tradingProfit: preview.tradingProfit,
      costBasisEstimated: preview.costBasisEstimated,
    };
    this.log(
      `售出 ${q.quantity} ${goods.find((g) => g.id === goodId)!.unit}${goods.find((g) => g.id === goodId)!.name}，收入 ${q.total} 金币，货物差额 ${preview.tradingProfit >= 0 ? "+" : ""}${preview.tradingProfit.toFixed(1)} 金币（不含航行开支${preview.costBasisEstimated ? "，成本含参考估值" : ""}）。`,
    );
    this.checkCompletion();
    return true;
  }
  assets(): number {
    return Math.floor(
      this.state.cash +
        this.dominion()
          .cities()
          .filter(
            (c) =>
              c.owned && this.state.dominion.owned[c.id].method === "charter",
          )
          .reduce((sum, c) => sum + c.price * 0.45, 0) +
        goods.reduce(
          (sum, g) => sum + (this.state.cargo[g.id] || 0) * g.base * 0.52,
          0,
        ) +
        this.state.fleetSize *
          240 *
          this.state.ship.level *
          (this.state.ship.hull / this.state.ship.maxHull) *
          0.7 +
        Object.values(this.state.investments).reduce(
          (sum, n) => sum + n * 400,
          0,
        ),
    );
  }
  private distance(to: Port): number {
    const from = this.port();
    const lat1 = (from.y * Math.PI) / 2,
      lat2 = (to.y * Math.PI) / 2,
      dl = (to.x - from.x) * Math.PI;
    const a =
      Math.sin((lat2 - lat1) / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dl / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  voyage(
    destinationId: string,
    precise = true,
  ): {
    days: number;
    risk: number;
    supplies: number;
    wages: number;
    cost: number;
    transfer: boolean;
    reachable: boolean;
  } {
    const to = this.port(destinationId),
      from = this.port();
    const route = precise
      ? planSeaRoute(
          this.state.voyage ? this.state.navigation.position : portPoint(from),
          to,
        )
      : [];
    const distance = precise
      ? this.routeDistance(route) * 111
      : this.distance(to);
    const transfer = false;
    const days = Math.max(2, Math.ceil(distance / 111 / this.sailingSpeed()));
    const risk = clamp(
      0.07 +
        to.danger * 0.45 +
        distance / 45000 -
        this.state.reputation * 0.0005 -
        (this.state.originId === "oman" ? 0.035 : 0) -
        (this.state.strategy === "avoid" ? 0.06 : 0) -
        this.life().bonuses().riskReduction,
      0.025,
      0.6,
    );
    const supplies = Math.ceil(
        days *
          this.state.fleetSize *
          2 *
          (1 - this.life().bonuses().supplyReduction),
      ),
      wages = days * this.state.fleetSize * 2;
    return {
      days,
      risk,
      supplies,
      wages,
      cost: wages + supplies * 2 + (transfer ? 12 : 0),
      transfer,
      reachable: !precise || route.length > 1,
    };
  }
  routeScore(destinationId: string): {
    profit: number;
    days: number;
    risk: number;
    grade: string;
    goodId: string;
    quantity: number;
    expectedLoss: number;
    cost: number;
    reason: string;
  } {
    const v = this.voyage(destinationId);
    let best = { id: "grain", profit: 0, quantity: 0 };
    for (const g of goodsForPort(
      this.state.currentPortId,
      this.state.eraIndex,
      this.state.sandbox,
    )) {
      const q = this.quote(
        g.id,
        Math.min(30, this.capacity() - this.cargoCount()),
        "buy",
      );
      const revenue = Array.from({ length: q.quantity }, (_, i) =>
        this.sellPrice(
          destinationId,
          g.id,
          this.marketStock(destinationId, g.id) + i,
        ),
      ).reduce((a, b) => a + b, 0);
      const profit = revenue - q.total;
      if (profit > best.profit)
        best = { id: g.id, profit, quantity: q.quantity };
    }
    const held = goods
      .filter((g) => this.state.cargo[g.id] > 0)
      .reduce(
        (n, g) =>
          n +
          this.state.cargo[g.id] *
            (this.sellPrice(destinationId, g.id) -
              this.sellPrice(this.state.currentPortId, g.id)),
        0,
      );
    const expectedLoss = Math.round(
        (this.cargoCount() + best.quantity) * 7 * v.risk,
      ),
      profit = Math.round(best.profit + held - v.cost - expectedLoss);
    const name = goods.find((g) => g.id === best.id)!.name;
    return {
      profit,
      days: v.days,
      risk: v.risk,
      grade: v.risk < 0.13 ? "稳健" : v.risk < 0.24 ? "平衡" : "谨慎",
      goodId: best.id,
      quantity: best.quantity,
      expectedLoss,
      cost: v.cost,
      reason: `${best.quantity ? `可购入 ${best.quantity} 单位${name}，` : "优先运送现有货物，"}估算已扣除 ${v.cost} 金币航行成本与 ${expectedLoss} 金币风险准备。${v.transfer ? "跨海域包含商栈转运与绕航段。" : ""}抵港报价会随市场变化。`,
    };
  }
  sail(destinationId: string): boolean {
    if (!this.docked()) return this.fail("船队正在航行。");
    if (
      !this.availablePorts().some((p) => p.id === destinationId) ||
      destinationId === this.state.currentPortId
    )
      return this.fail("请选择一个可用的目的港。");
    if (this.state.ship.hull < this.state.ship.maxHull * 0.2)
      return this.fail("船体受损严重，请先维修。");
    const v = this.voyage(destinationId, true);
    if (!v.reachable)
      return this.fail("暂未找到可通航海路，请选择邻近港口或等待地图加载。");
    if (this.state.supplies < v.supplies)
      return this.fail(`本航程需要 ${v.supplies} 份补给，请先在船队面板补满。`);
    const prepaid = v.wages + (v.transfer ? 12 : 0);
    if (this.state.cash < prepaid)
      return this.fail(
        `需要预付 ${prepaid} 金币${v.transfer ? "船员工资与转运费" : "船员工资"}。`,
      );
    this.state.cash -= prepaid;
    this.state.navigation.position = portPoint(this.port());
    this.state.navigation.route = planSeaRoute(
      this.state.navigation.position,
      this.port(destinationId),
    );
    this.state.navigation.leg = 1;
    this.state.navigation.manual = false;
    this.state.navigation.throttle = 1;
    this.state.navigation.targetId = destinationId;
    this.state.destinationId = destinationId;
    this.state.routeRisk = v.risk;
    this.state.voyage = {
      pace: this.routeDistance(this.state.navigation.route) / v.days,
      fromId: this.state.currentPortId,
      toId: destinationId,
      totalDays: v.days,
      elapsedDays: 0,
      risk: v.risk,
      strategy: this.state.strategy,
      dailySupply:
        this.state.fleetSize * 2 * (1 - this.life().bonuses().supplyReduction),
      wages: v.wages,
    };
    this.state.lastVoyage = {
      fromId: this.state.currentPortId,
      toId: destinationId,
      startedDay: this.state.day,
      endedDay: null,
      wages: v.wages,
      transfer: v.transfer ? 12 : 0,
      suppliesUsed: 0,
      suppliesCost: 0,
      ransom: 0,
      cargoLossQuantity: 0,
      cargoLossCost: 0,
      costBasisEstimated: false,
      partial: false,
    };
    this.log(
      `船队驶向${this.port(destinationId).name}，预计 ${v.days} 日抵达，预付工资 ${v.wages} 金币${v.transfer ? "，转运费 12 金币" : ""}。`,
    );
    return true;
  }
  private loseCargo(amount: number): number {
    let left = Math.min(this.cargoCount(), Math.max(0, Math.floor(amount))),
      lost = 0;
    for (const g of goods) {
      const n = Math.min(this.state.cargo[g.id], left);
      const estimated = this.state.cargoCostEstimated[g.id];
      const cost = this.removeCargo(g.id, n);
      if (n && this.state.lastVoyage && this.state.voyage) {
        this.state.lastVoyage.cargoLossQuantity += n;
        this.state.lastVoyage.cargoLossCost += cost;
        this.state.lastVoyage.costBasisEstimated ||= estimated;
      }
      left -= n;
      lost += n;
      if (!left) break;
    }
    return lost;
  }
  private advanceVoyage(): void {
    const v = this.state.voyage;
    if (!v) return;
    v.elapsedDays++;
    const suppliesUsed = Math.min(this.state.supplies, v.dailySupply);
    this.state.supplies -= suppliesUsed;
    if (this.state.lastVoyage) {
      this.state.lastVoyage.suppliesUsed += suppliesUsed;
      this.state.lastVoyage.suppliesCost += suppliesUsed * 2;
    }
    if (v.elapsedDays > v.totalDays) {
      const wages = Math.min(this.state.cash, this.state.fleetSize * 2);
      this.state.cash -= wages;
      v.wages += wages;
      if (this.state.lastVoyage) this.state.lastVoyage.wages += wages;
    }
    if (suppliesUsed < v.dailySupply) {
      this.state.ship.hull = Math.max(8, this.state.ship.hull - 4);
      this.state.reputation = Math.max(0, this.state.reputation - 0.2);
      this.log("食物与淡水不足，船员疲惫，船体维护中断。请尽快停靠附近港口。");
    }
    const localHazards = navigationHazards(this.state.day).filter(
      (h) => distanceDegrees(h, this.state.navigation.position) < h.radius,
    );
    const stormRisk = localHazards.some((h) => h.kind === "storm")
      ? 0.32
      : v.risk * 0.2;
    const pirateRisk = localHazards.some((h) => h.kind === "pirate")
      ? 0.38
      : v.risk * 0.11;
    const roll = this.random(`voyage:${v.fromId}:${v.toId}:${v.elapsedDays}`);
    if (roll < stormRisk) {
      const damage = 2 + Math.floor(v.risk * 15);
      this.state.ship.hull = Math.max(8, this.state.ship.hull - damage);
      const lost = this.loseCargo(Math.ceil(this.cargoCount() * 0.035));
      this.log(`风浪来袭，船体损伤 ${damage}，损失 ${lost} 单位货物。`);
    } else if (roll < stormRisk + pirateRisk) {
      if (v.strategy === "ransom") {
        const toll = Math.min(this.state.cash, 12 * this.state.fleetSize);
        this.state.cash -= toll;
        if (this.state.lastVoyage) this.state.lastVoyage.ransom += toll;
        this.log(`遭遇海盗，支付 ${toll} 金币赎金后安全通过。`);
      } else if (v.strategy === "avoid") {
        this.log("瞭望手提前发现劫掠船，船队沿安全航道绕行。");
      } else {
        const damage = v.strategy === "flee" ? 5 : 10;
        this.state.ship.hull = Math.max(8, this.state.ship.hull - damage);
        this.log(
          v.strategy === "flee"
            ? "船队全帆脱离追击，船具磨损增加。"
            : "船队自卫击退劫掠船，船体需要修复。",
        );
      }
    } else if (roll > 0.985) {
      this.state.reputation = clamp(this.state.reputation + 1, 0, 100);
      this.log("救助迷航渔船，商港之间传开了家族的善名。");
    }
  }
  private routeDistance(route: GeoPoint[]): number {
    return route.reduce(
      (sum, p, i) => sum + (i ? distanceDegrees(route[i - 1], p) : 0),
      0,
    );
  }
  sailingSpeed(): number {
    return (
      (4.2 * this.state.ship.speed * this.life().bonuses().speed) /
      (this.state.strategy === "avoid" ? 1.2 : 1)
    );
  }
  navigationRemainingDays(): number {
    const n = this.state.navigation;
    return Math.ceil(
      this.routeDistance([n.position, ...n.route.slice(n.leg)]) /
        (this.state.voyage?.pace ?? this.sailingSpeed()),
    );
  }
  nearbyPorts(): Port[] {
    return this.availablePorts().filter(
      (p) =>
        distanceDegrees(this.state.navigation.position, portPoint(p)) <= 1.2,
    );
  }
  private arrive(portId: string): boolean {
    const v = this.state.voyage;
    if (!v) return false;
    if (this.state.lastVoyage) {
      this.state.lastVoyage.endedDay = this.state.day;
      this.state.lastVoyage.toId = portId;
    }
    this.state.currentPortId = portId;
    this.state.destinationId = null;
    this.state.voyage = null;
    const n = this.state.navigation;
    n.position = portPoint(this.port());
    n.route = [];
    n.leg = 0;
    n.targetId = null;
    n.manual = false;
    if (!n.discovered.includes(portId)) n.discovered.push(portId);
    if (!this.state.visited.includes(portId)) this.state.visited.push(portId);
    this.state.ship.hull = Math.max(8, this.state.ship.hull - 1);
    this.log(
      `已停靠${this.port().name}，本次在海上度过 ${v.elapsedDays} 日。市场与港口居民已可交互。`,
    );
    return true;
  }
  dockAt(portId: string): boolean {
    if (!this.state.voyage || !this.nearbyPorts().some((p) => p.id === portId))
      return this.fail("请先驶入该港口附近的引航水域，再申请停靠。");
    return this.arrive(portId);
  }
  redirect(destinationId: string): boolean {
    if (
      !this.state.voyage ||
      !this.availablePorts().some((p) => p.id === destinationId)
    )
      return this.fail("请选择一个开放的港口。");
    const n = this.state.navigation;
    const route = planSeaRoute(n.position, this.port(destinationId));
    if (route.length < 2)
      return this.fail("这里没有找到连通海路，请先驶离浅滩。");
    n.route = route;
    n.leg = 1;
    n.manual = false;
    n.throttle = 1;
    n.targetId = destinationId;
    this.state.destinationId = destinationId;
    this.state.voyage.toId = destinationId;
    this.state.voyage.pace =
      this.routeDistance(route) /
      Math.max(1, Math.ceil(this.routeDistance(route) / this.sailingSpeed()));
    if (this.state.lastVoyage) this.state.lastVoyage.toId = destinationId;
    this.log(
      `已改航${this.port(destinationId).name}。绕航期间继续消耗补给，超过预付日数另计工资。`,
    );
    return true;
  }
  setManual(enabled: boolean): boolean {
    if (!this.state.voyage) return this.fail("出港后可以手动掌舵。");
    if (!enabled) return this.redirect(this.state.destinationId!);
    this.state.navigation.manual = true;
    this.log("已交接手动掌舵。左右调整航向，上下调整帆速；接近城市后可停靠。");
    return true;
  }
  steer(turn: number, throttleDelta = 0): void {
    if (
      !this.state.voyage ||
      !Number.isFinite(turn) ||
      !Number.isFinite(throttleDelta)
    )
      return;
    const n = this.state.navigation;
    n.manual = true;
    n.heading =
      (n.heading + clamp(turn, -Math.PI, Math.PI) + Math.PI * 2) %
      (Math.PI * 2);
    n.throttle = clamp(n.throttle + throttleDelta, 0, 1);
  }
  steerToward(point: GeoPoint): boolean {
    if (!this.state.voyage)
      return this.fail("先选择目的港启航，再点击海面调整航向。");
    if (!Number.isFinite(point.lon) || !Number.isFinite(point.lat))
      return false;
    const n = this.state.navigation,
      delta = ((point.lon - n.position.lon + 540) % 360) - 180;
    n.heading = Math.atan2(
      delta * Math.cos((n.position.lat * Math.PI) / 180),
      point.lat - n.position.lat,
    );
    n.manual = true;
    n.throttle = 1;
    this.log("瞭望手记下新航向。正在手动航行，留意前方海岸与风险水域。");
    return true;
  }
  advanceSailing(dayFraction: number): { arrived: boolean; blocked: boolean } {
    const n = this.state.navigation;
    if (!this.state.voyage || !Number.isFinite(dayFraction) || dayFraction <= 0)
      return { arrived: false, blocked: false };
    if (!n.manual && !n.route.length) {
      n.route = planSeaRoute(n.position, this.port(this.state.destinationId!));
      n.leg = 1;
      if (!n.route.length) return { arrived: false, blocked: true };
    }
    const result = advanceNavigation(
      n,
      (n.manual
        ? this.sailingSpeed()
        : (this.state.voyage.pace ?? this.sailingSpeed())) *
        Math.min(1, dayFraction),
      this.state.day,
    );
    for (const p of this.availablePorts()) {
      if (
        distanceDegrees(n.position, portPoint(p)) < 7 &&
        !n.discovered.includes(p.id)
      ) {
        n.discovered.push(p.id);
        this.state.reputation = clamp(this.state.reputation + 0.15, 0, 100);
      }
    }
    if (
      result.reached &&
      n.targetId &&
      this.nearbyPorts().some((p) => p.id === n.targetId)
    )
      return { arrived: this.arrive(n.targetId), blocked: false };
    if (result.blocked) {
      n.throttle = 0;
      n.manual = true;
      this.state.lastEvent =
        "前方浅滩无法通航，已收帆。调整航向并升帆，或让领航员重新规划。";
    }
    return { arrived: false, blocked: result.blocked };
  }
  nextDay(navigationHandled = false): void {
    if (!this.state.started) return;
    this.state.day++;
    for (const message of this.dominion().daily().messages) this.log(message);
    // Local merchant agents replenish supplies and respond to scarcity within bounded stock.
    for (const p of this.availablePorts())
      for (const id of Object.keys(this.state.stock[p.id])) {
        const g = goodById.get(id)!;
        if (!this.state.sandbox && g.era > this.state.eraIndex) continue;
        const stock = this.state.stock[p.id][g.id];
        const recovery = (100 - stock) * 0.04;
        const demand = p.demands.includes(g.id)
          ? -1
          : p.produces.includes(g.id)
            ? 1
            : 0;
        const competition =
          this.random(`traders:${p.id}:${g.id}`) > 0.65 ? -1 : 0;
        this.state.stock[p.id][g.id] = clamp(
          Math.round(stock + recovery + demand + competition),
          20,
          200,
        );
      }
    if ((this.state.day - 1) % 4 === 0) this.publishMarketEvent();
    this.advanceVoyage();
    if (!navigationHandled) this.advanceSailing(1);
    this.checkCompletion();
  }
  repairCost(): number {
    return Math.ceil(
      (this.state.ship.maxHull - this.state.ship.hull) *
        1.8 *
        this.state.fleetSize,
    );
  }
  repair(): boolean {
    const cost = this.repairCost();
    if (!this.docked()) return this.fail("请在港口维修。");
    if (!cost) return this.fail("船体已经完好。");
    if (this.state.cash < cost) return this.fail(`维修需要 ${cost} 金币。`);
    this.state.cash -= cost;
    this.state.ship.hull = this.state.ship.maxHull;
    this.log(`船坞维修完成，支付 ${cost} 金币。`);
    return true;
  }
  upgradeCost(): number {
    return Math.round(480 * this.state.ship.level ** 1.4);
  }
  upgrade(): boolean {
    if (!this.docked()) return this.fail("请在港口升级。");
    if (this.state.ship.level >= this.state.eraIndex * 2 + 3)
      return this.fail("当前纪元船舶技术已经达到上限。");
    const cost = this.upgradeCost();
    if (this.state.cash < cost) return this.fail(`升级需要 ${cost} 金币。`);
    this.state.cash -= cost;
    this.state.ship.level++;
    this.state.ship.capacity += 10 * this.state.fleetSize;
    this.state.ship.maxHull += 12;
    this.state.ship.hull = this.state.ship.maxHull;
    this.state.ship.speed += 0.12;
    this.state.ship.name = eras[this.state.eraIndex].shipName;
    this.log(`升级为 ${this.state.ship.name} Lv.${this.state.ship.level}。`);
    return true;
  }
  resupplyCost(): number {
    return Math.max(0, this.state.fleetSize * 100 - this.state.supplies) * 2;
  }
  resupply(): boolean {
    if (!this.docked()) return this.fail("请在港口补给。");
    const quantity = Math.max(
      0,
      Math.min(
        this.state.fleetSize * 100 - this.state.supplies,
        Math.floor(this.state.cash / 2),
      ),
    );
    if (!quantity) return this.fail("补给已满或金币不足。");
    this.state.cash -= quantity * 2;
    this.state.supplies += quantity;
    this.log(`补充 ${quantity} 份食物与淡水，支付 ${quantity * 2} 金币。`);
    return true;
  }
  shipCost(): number {
    return Math.round(950 * this.state.fleetSize ** 1.5);
  }
  buyShip(): boolean {
    if (!this.docked()) return this.fail("请在港口购船。");
    if (this.state.fleetSize >= 5) return this.fail("船队已达到 5 艘上限。");
    const cost = this.shipCost();
    if (this.state.cash < cost) return this.fail(`购船需要 ${cost} 金币。`);
    this.state.cash -= cost;
    this.state.fleetSize++;
    this.state.ship.capacity += 30 + (this.state.ship.level - 1) * 10;
    this.log(`新商船加入船队，目前共 ${this.state.fleetSize} 艘。`);
    return true;
  }
  investmentCost(): number {
    return 800 * ((this.state.investments[this.state.currentPortId] || 0) + 1);
  }
  invest(): boolean {
    if (!this.docked() || this.state.eraIndex < 2)
      return this.fail("第三纪元起可在港口投资。");
    const n = this.state.investments[this.state.currentPortId] || 0;
    if (n >= 5) return this.fail("该港口商业设施已达到 5 级。");
    const cost = this.investmentCost();
    if (this.state.cash < cost) return this.fail(`投资需要 ${cost} 金币。`);
    this.state.cash -= cost;
    this.state.investments[this.state.currentPortId] = n + 1;
    this.state.reputation = clamp(this.state.reputation + 2, 0, 100);
    this.log(`${this.port().name}商业投资升至 ${n + 1} 级，港税降低。`);
    return true;
  }
  setStrategy(strategy: Strategy): boolean {
    if (!["avoid", "ransom", "flee", "defend"].includes(strategy)) return false;
    if (this.state.voyage) return this.fail("航行中保持出港时制定的预案。");
    this.state.strategy = strategy;
    return true;
  }
  advanceEra(): boolean {
    if (!this.docked()) return this.fail("请在港口开启新纪元。");
    const next = eras[this.state.eraIndex + 1];
    if (!next) return this.fail("已抵达最后纪元。");
    if (this.assets() < next.threshold)
      return this.fail(`开启下一纪元需要 ${next.threshold} 可兑现资产。`);
    this.state.eraIndex++;
    this.state.generation++;
    this.state.ship.capacity += 15 * this.state.fleetSize;
    this.state.ship.speed += 0.08;
    this.state.ship.name = next.shipName;
    this.log(
      `第 ${this.state.generation} 代商人接过家族账册，进入「${next.title}」。新的港口与货物开放。`,
    );
    return true;
  }
  private checkCompletion(): void {
    if (
      !this.state.sandboxUnlocked &&
      this.state.eraIndex === eras.length - 1 &&
      this.assets() >= 50000000
    ) {
      this.state.sandboxUnlocked = true;
      this.log("全球商业网络建成，无尽沙盒已解锁。");
    }
  }
  startSandbox(): boolean {
    this.checkCompletion();
    if (!this.state.sandboxUnlocked)
      return this.fail("完成最后纪元并达到 5000 万资产后解锁沙盒。");
    if (!this.docked()) return this.fail("请先抵港。");
    this.state.sandbox = true;
    this.state.eraIndex = eras.length - 1;
    this.log("已进入无尽沙盒，全部港口与商品开放。");
    return true;
  }
  export(): string {
    return JSON.stringify(this.state);
  }
  import(serialized: string): boolean {
    try {
      if (serialized.length > 5000000) return false;
      const raw = JSON.parse(serialized);
      if (
        !raw ||
        typeof raw !== "object" ||
        Array.isArray(raw) ||
        (raw.version !== undefined && raw.version !== 2)
      )
        return false;
      const numeric = (x: unknown, min = 0, max = 1e12) =>
        typeof x === "number" && Number.isFinite(x) && x >= min && x <= max;
      const integer = (x: unknown, min = 0, max = 1e12) =>
        numeric(x, min, max) && Number.isInteger(x);
      if (
        !integer(raw.day, 1, 1e9) ||
        !integer(raw.eraIndex, 0, 10) ||
        !numeric(raw.cash) ||
        !numeric(raw.reputation, 0, 100) ||
        typeof raw.started !== "boolean" ||
        !ports.some((p) => p.id === raw.currentPortId)
      )
        return false;
      const next = fresh();
      const ship = raw.ship;
      if (
        !ship ||
        !integer(ship.level, 1, 30) ||
        !integer(ship.capacity, 1, 10000) ||
        !numeric(ship.maxHull, 1, 5000) ||
        !numeric(ship.hull, 0, ship.maxHull) ||
        !numeric(ship.speed, 0.1, 20) ||
        typeof ship.name !== "string" ||
        ship.name.length > 80
      )
        return false;
      Object.assign(next, {
        day: raw.day,
        eraIndex: raw.eraIndex,
        cash: raw.cash,
        reputation: raw.reputation,
        started: raw.started,
        currentPortId: raw.currentPortId,
        ship: {
          name: ship.name,
          level: ship.level,
          capacity: ship.capacity,
          hull: ship.hull,
          maxHull: ship.maxHull,
          speed: ship.speed,
        },
      });
      if (!raw.cargo || typeof raw.cargo !== "object") return false;
      for (const g of goods) {
        const amount = raw.cargo[g.id] ?? 0;
        if (!integer(amount, 0, 10000)) return false;
        if (
          amount &&
          g.era > next.eraIndex &&
          !raw.sandbox &&
          raw.version === 2
        )
          return false;
        if (amount && raw.version === undefined)
          next.eraIndex = Math.max(next.eraIndex, g.era);
        next.cargo[g.id] = amount;
      }
      const life = readLifeState(raw.life, next.day);
      if (!life) return false;
      next.life = life;
      const bonusCapacity = new PortLife(life, {
        day: next.day,
        eraIndex: next.eraIndex,
        currentPortId: next.currentPortId,
        cash: next.cash,
        atSea: false,
        supplies: 0,
        shipCapacity: ship.capacity,
        cargo: () => 0,
        marketGoods: () => [],
        spendCash: () => false,
        addCash: () => {},
        consumeCargo: () => false,
        addReputation: () => {},
      }).bonuses().capacity;
      if (
        Object.values(next.cargo).reduce((a, b) => a + b, 0) >
        ship.capacity + bonusCapacity
      )
        return false;
      if (raw.version === 2) {
        if (
          !integer(raw.fleetSize, 1, 5) ||
          !numeric(raw.supplies, 0, raw.fleetSize * 100) ||
          !origins.some((o) => o.id === raw.originId) ||
          !["avoid", "ransom", "flee", "defend"].includes(raw.strategy) ||
          typeof raw.sandbox !== "boolean" ||
          typeof raw.sandboxUnlocked !== "boolean" ||
          !integer(raw.generation, 1, 10000) ||
          !Array.isArray(raw.logs) ||
          raw.logs.some(
            (l: unknown) => typeof l !== "string" || l.length > 600,
          ) ||
          !Array.isArray(raw.visited) ||
          raw.visited.some((id: unknown) => !ports.some((p) => p.id === id)) ||
          !numeric(raw.profits)
        )
          return false;
        Object.assign(next, {
          fleetSize: raw.fleetSize,
          supplies: raw.supplies,
          originId: raw.originId,
          strategy: raw.strategy,
          sandbox: raw.sandbox,
          sandboxUnlocked: raw.sandboxUnlocked,
          generation: raw.generation,
          logs: raw.logs.slice(-100),
          visited: [...new Set<string>(raw.visited)],
          profits: raw.profits,
        });
        for (const p of ports) {
          const investment = raw.investments?.[p.id] ?? 0;
          if (!integer(investment, 0, 5)) return false;
          next.investments[p.id] = investment;
          const inventory = raw.stock?.[p.id];
          if (
            inventory !== undefined &&
            (!inventory ||
              typeof inventory !== "object" ||
              Array.isArray(inventory))
          )
            return false;
          for (const id of new Set([
            ...Object.keys(next.stock[p.id]),
            ...Object.keys(inventory ?? {}),
          ])) {
            if (!goodById.has(id)) return false;
            const n = inventory?.[id] ?? next.stock[p.id][id] ?? 0;
            if (!integer(n, 0, 20000)) return false;
            // Old universal shelves are reduced to local trade stock; carried
            // imports can still be sold and then become available locally.
            if (id in next.stock[p.id] || n !== 100) next.stock[p.id][id] = n;
          }
        }
        if (raw.voyage) {
          const v = raw.voyage;
          if (
            !v ||
            v.fromId !== raw.currentPortId ||
            v.toId !== raw.destinationId ||
            !ports.some(
              (p) =>
                p.id === v.toId && (p.era <= next.eraIndex || next.sandbox),
            ) ||
            !integer(v.totalDays, 1, 1000) ||
            !integer(v.elapsedDays, 0, 1000000) ||
            !numeric(v.risk, 0, 1) ||
            !["avoid", "ransom", "flee", "defend"].includes(v.strategy) ||
            !numeric(v.dailySupply, 1, 100) ||
            !numeric(v.wages, 0, 1000000) ||
            (v.pace !== undefined && !numeric(v.pace, 0.00001, 100))
          )
            return false;
          next.voyage = {
            ...(v.pace !== undefined ? { pace: v.pace } : {}),
            fromId: v.fromId,
            toId: v.toId,
            totalDays: v.totalDays,
            elapsedDays: v.elapsedDays,
            risk: v.risk,
            strategy: v.strategy,
            dailySupply: v.dailySupply,
            wages: v.wages,
          };
          next.destinationId = v.toId;
        } else if (raw.destinationId !== null) return false;
      }
      if (raw.version === undefined)
        next.eraIndex = Math.max(
          next.eraIndex,
          this.port(next.currentPortId).era,
        );
      if (
        ports.find((p) => p.id === next.currentPortId)!.era > next.eraIndex &&
        !next.sandbox
      )
        return false;
      const marketEvents = readMarketEvents(
        raw.marketEvents,
        next.day,
        ports.filter((port) => port.era <= next.eraIndex || next.sandbox),
        goods.filter((good) => good.era <= next.eraIndex || next.sandbox),
      );
      if (marketEvents === null) return false;
      next.marketEvents = marketEvents;
      const accountingKeys = [
        "cargoCost",
        "cargoCostEstimated",
        "tradeLedger",
        "lastTrade",
        "lastVoyage",
      ];
      const hasAccounting = accountingKeys.some(
        (key) => raw[key] !== undefined,
      );
      if (!hasAccounting) {
        // Historical purchases cannot be reconstructed from cash. Start a new ledger
        // and identify the carried stock as a reference valuation instead.
        for (const good of goods) {
          next.cargoCost[good.id] = next.cargo[good.id] * good.base;
          next.cargoCostEstimated[good.id] = next.cargo[good.id] > 0;
        }
        next.tradeLedger.sinceDay = next.day;
        if (next.voyage) {
          next.lastVoyage = {
            fromId: next.voyage.fromId,
            toId: next.voyage.toId,
            startedDay: Math.max(1, next.day - next.voyage.elapsedDays),
            endedDay: null,
            wages: next.voyage.wages,
            transfer: 0,
            suppliesUsed: 0,
            suppliesCost: 0,
            ransom: 0,
            cargoLossQuantity: 0,
            cargoLossCost: 0,
            costBasisEstimated: false,
            partial: true,
          };
        }
      } else {
        if (accountingKeys.some((key) => raw[key] === undefined)) return false;
        const record = (value: unknown): value is Record<string, unknown> =>
          !!value && typeof value === "object" && !Array.isArray(value);
        const close = (actual: number, expected: number) =>
          Math.abs(actual - expected) <=
          Number.EPSILON *
            64 *
            Math.max(1, Math.abs(actual), Math.abs(expected));
        const knownPort = (id: unknown) =>
          ports.some(
            (port) =>
              port.id === id && (port.era <= next.eraIndex || next.sandbox),
          );
        if (
          !record(raw.cargoCost) ||
          !record(raw.cargoCostEstimated) ||
          Object.keys(raw.cargoCost).some(
            (id) => !goods.some((good) => good.id === id),
          ) ||
          Object.keys(raw.cargoCostEstimated).some(
            (id) => !goods.some((good) => good.id === id),
          )
        )
          return false;
        for (const good of goods) {
          const quantity = next.cargo[good.id],
            cost = raw.cargoCost[good.id] ?? (quantity === 0 ? 0 : undefined),
            estimated =
              raw.cargoCostEstimated[good.id] ??
              (quantity === 0 ? false : undefined);
          if (
            !numeric(cost, 0, quantity * good.base * 10) ||
            typeof estimated !== "boolean" ||
            (!quantity && (cost !== 0 || estimated)) ||
            (quantity > 0 && cost <= 0)
          )
            return false;
          next.cargoCost[good.id] = cost;
          next.cargoCostEstimated[good.id] = estimated;
        }
        const ledger = raw.tradeLedger;
        if (
          !record(ledger) ||
          !integer(ledger.sinceDay, 1, next.day) ||
          !integer(ledger.revenue) ||
          !numeric(ledger.costBasis) ||
          !numeric(ledger.realizedTradingProfit, -1e12) ||
          typeof ledger.costBasisEstimated !== "boolean" ||
          !close(
            ledger.realizedTradingProfit as number,
            (ledger.revenue as number) - (ledger.costBasis as number),
          ) ||
          (ledger.revenue === 0 &&
            (ledger.costBasis !== 0 || ledger.costBasisEstimated))
        )
          return false;
        next.tradeLedger = {
          sinceDay: ledger.sinceDay as number,
          revenue: ledger.revenue as number,
          costBasis: ledger.costBasis as number,
          realizedTradingProfit: ledger.realizedTradingProfit as number,
          costBasisEstimated: ledger.costBasisEstimated,
        };
        if (raw.lastTrade !== null) {
          const receipt = raw.lastTrade;
          if (
            !record(receipt) ||
            !integer(receipt.day, next.tradeLedger.sinceDay, next.day) ||
            !knownPort(receipt.portId) ||
            !goods.some(
              (good) =>
                good.id === receipt.goodId &&
                (good.era <= next.eraIndex || next.sandbox),
            ) ||
            !["buy", "sell"].includes(receipt.side as string) ||
            !integer(receipt.quantity, 1, 10000) ||
            !integer(receipt.total, 1) ||
            !numeric(receipt.costBasis, 0.0000001) ||
            typeof receipt.costBasisEstimated !== "boolean"
          )
            return false;
          if (receipt.side === "buy") {
            if (
              receipt.tradingProfit !== null ||
              receipt.costBasis !== receipt.total ||
              receipt.costBasisEstimated
            )
              return false;
          } else if (
            !numeric(receipt.tradingProfit, -1e12) ||
            !close(
              receipt.tradingProfit as number,
              (receipt.total as number) - (receipt.costBasis as number),
            ) ||
            (receipt.total as number) > next.tradeLedger.revenue ||
            (receipt.costBasis as number) > next.tradeLedger.costBasis + 1e-7 ||
            (receipt.costBasisEstimated && !next.tradeLedger.costBasisEstimated)
          )
            return false;
          next.lastTrade = {
            day: receipt.day as number,
            portId: receipt.portId as string,
            goodId: receipt.goodId as string,
            side: receipt.side as "buy" | "sell",
            quantity: receipt.quantity as number,
            total: receipt.total as number,
            costBasis: receipt.costBasis as number,
            tradingProfit: receipt.tradingProfit as number | null,
            costBasisEstimated: receipt.costBasisEstimated,
          };
        }
        if (raw.lastVoyage !== null) {
          const report = raw.lastVoyage;
          if (
            !record(report) ||
            !knownPort(report.fromId) ||
            !knownPort(report.toId) ||
            !integer(report.startedDay, 1, next.day) ||
            (report.endedDay !== null &&
              !integer(
                report.endedDay,
                report.startedDay as number,
                next.day,
              )) ||
            !integer(report.wages, 0, 1e6) ||
            ![0, 12].includes(report.transfer as number) ||
            !numeric(report.suppliesUsed, 0, 100000) ||
            !numeric(report.suppliesCost, 0, 200000) ||
            report.suppliesCost !== (report.suppliesUsed as number) * 2 ||
            !integer(report.ransom, 0, 1e6) ||
            !integer(report.cargoLossQuantity, 0, 10000) ||
            !numeric(report.cargoLossCost) ||
            typeof report.costBasisEstimated !== "boolean" ||
            typeof report.partial !== "boolean" ||
            (report.cargoLossQuantity === 0 &&
              (report.cargoLossCost !== 0 || report.costBasisEstimated)) ||
            ((report.cargoLossQuantity as number) > 0 &&
              (report.cargoLossCost as number) <= 0)
          )
            return false;
          if (next.voyage) {
            if (
              report.endedDay !== null ||
              report.fromId !== next.voyage.fromId ||
              report.toId !== next.voyage.toId ||
              report.wages !== next.voyage.wages ||
              (report.suppliesUsed as number) >
                next.voyage.elapsedDays * next.voyage.dailySupply ||
              (report.startedDay as number) !==
                Math.max(1, next.day - next.voyage.elapsedDays)
            )
              return false;
          } else if (report.endedDay === null) return false;
          next.lastVoyage = {
            fromId: report.fromId as string,
            toId: report.toId as string,
            startedDay: report.startedDay as number,
            endedDay: report.endedDay as number | null,
            wages: report.wages as number,
            transfer: report.transfer as number,
            suppliesUsed: report.suppliesUsed as number,
            suppliesCost: report.suppliesCost as number,
            ransom: report.ransom as number,
            cargoLossQuantity: report.cargoLossQuantity as number,
            cargoLossCost: report.cargoLossCost as number,
            costBasisEstimated: report.costBasisEstimated,
            partial: report.partial,
          };
        } else if (next.voyage) return false;
      }
      if (raw.routeRisk !== undefined && !numeric(raw.routeRisk, 0, 1))
        return false;
      next.routeRisk = raw.routeRisk ?? 0;
      next.lastEvent =
        typeof raw.lastEvent === "string"
          ? raw.lastEvent.slice(0, 600)
          : "本地航程已恢复";
      const rawNavigation = raw.version === 2 ? raw.navigation : undefined;
      const navigation = readNavigation(
        rawNavigation,
        this.port(next.currentPortId),
        ports.filter((p) => p.era <= next.eraIndex || next.sandbox),
      );
      if (!navigation) return false;
      if (
        rawNavigation &&
        (navigation.targetId !== next.destinationId ||
          (!next.voyage &&
            distanceDegrees(
              navigation.position,
              portPoint(this.port(next.currentPortId)),
            ) > 0.01))
      )
        return false;
      if (!rawNavigation) {
        navigation.targetId = next.destinationId;
        navigation.discovered = [...next.visited];
      }
      next.navigation = navigation;
      const dominion = readDominionState(raw.dominion, next.day);
      if (!dominion) return false;
      next.dominion = dominion;
      this.state = next;
      return true;
    } catch {
      return false;
    }
  }
}
