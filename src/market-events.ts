import type { Port, Good } from "./data";

export type MarketEventKind =
  | "storm"
  | "drought"
  | "harvest"
  | "repairs"
  | "festival"
  | "convoy"
  | "monsoon";
export type MarketEvent = {
  id: string;
  kind: MarketEventKind;
  startDay: number;
  endDay: number;
  portIds: string[];
  goodIds: string[];
  multiplier: number;
  source: string;
  headline: string;
  clue: string;
};
type Template = {
  kind: MarketEventKind;
  headline: string;
  source: string;
  goods: string[];
  multiplier: number;
  duration: number;
};
const templates: Template[] = [
  {
    kind: "storm",
    headline: "外海迟来的帆影",
    source: "码头搬运工",
    goods: ["pepper", "cinnamon", "cloves", "linen", "copper", "cedar"],
    multiplier: 1.22,
    duration: 7,
  },
  {
    kind: "drought",
    headline: "雨季迟迟未到",
    source: "乡间行商",
    goods: ["grain", "linen", "cotton", "sugar"],
    multiplier: 1.27,
    duration: 9,
  },
  {
    kind: "harvest",
    headline: "乡间满载的车队",
    source: "收货车夫",
    goods: ["grain", "linen", "cotton", "sugar"],
    multiplier: 0.79,
    duration: 8,
  },
  {
    kind: "repairs",
    headline: "船坞重新开工",
    source: "船坞木匠",
    goods: ["cedar", "iron", "copper", "wood", "rigging"],
    multiplier: 1.24,
    duration: 7,
  },
  {
    kind: "festival",
    headline: "集市开始布置长桌",
    source: "集市摊主",
    goods: ["wine", "oil", "pottery", "silk"],
    multiplier: 1.2,
    duration: 6,
  },
  {
    kind: "convoy",
    headline: "货仓深夜的灯火",
    source: "商队领队",
    goods: ["porcelain", "silk", "cotton", "pottery", "salt"],
    multiplier: 0.82,
    duration: 7,
  },
  {
    kind: "monsoon",
    headline: "引航员仍在等风",
    source: "港口引航员",
    goods: ["tea", "coffee", "pepper", "cloves", "copper", "salt", "cedar"],
    multiplier: 1.18,
    duration: 8,
  },
];

function targetGoods(template: Template, port: Port, goods: Map<string, Good>): string[] {
  if (
    template.kind === "monsoon" &&
    !["gulf", "indian", "china", "redsea", "southeast"].includes(port.basin)
  )
    return [];
  const local = template.kind === "harvest" || template.kind === "drought"
    ? port.produces
    : template.kind === "storm" || template.kind === "monsoon"
      ? port.demands
      : [...port.produces, ...port.demands];
  // The era-filtered map and local production/demand lists jointly guarantee
  // that a report never advertises a future or unavailable commodity. Families
  // connect regional varieties to the same real supply shock as core goods.
  return [...new Set(local)].filter((id) => {
    const good = goods.get(id);
    return good && (template.goods.includes(id) || template.goods.includes(good.familyId ?? ""));
  });
}

function hint(kind: MarketEventKind, goodIds: string[], goods: Good[]): string {
  const names = goodIds
    .map((id) => goods.find((good) => good.id === id)!.name)
    .join("、");
  switch (kind) {
    case "storm":
      return `外海风浪连日不息。运送${names}的几艘商船迟迟未进港，仓库掌柜已连续问了三次船期。`;
    case "drought":
      return `雨季迟迟未到。${names}的收货人空着车回来，货栈掌柜把新的交货单压在了桌角。`;
    case "harvest":
      return `今年的收成比预想更好。装着${names}的车队挤满仓库，货主开始担心下批货没地方放。`;
    case "repairs":
      return `港口正在修整旧船坞。工匠们一早就上了码头，采购员拿着${names}的清单挨家敲门。`;
    case "festival":
      return `庆典将近，集市开始预留长桌。几位主事接连问起${names}，说等船进港可能就来不及了。`;
    case "convoy":
      return `一支满载${names}的商队刚刚入港。货仓灯火亮到深夜，几位货主主动留住了路过的买家。`;
    case "monsoon":
      return `季风比预计来得晚。装着${names}的船还在远处候风，货铺掌柜开始打听别处的货源。`;
  }
}

export function createMarketEvent(
  day: number,
  ports: Port[],
  goods: Good[],
  random: (key: string) => number,
): MarketEvent {
  const goodIndex = new Map(goods.map((good) => [good.id, good]));
  const choices = templates
    .map((template) => ({
      template,
      ports: ports.filter(
        (port) => targetGoods(template, port, goodIndex).length > 0,
      ),
    }))
    .filter((entry) => entry.ports.length > 0);
  if (!choices.length)
    throw new Error("市场消息需要至少一个可交易港口和商品。");
  const choose = <T>(list: T[], key: string): T => {
    const roll = random(key);
    return list[
      Math.floor(
        Math.max(0, Math.min(0.999999999, Number.isFinite(roll) ? roll : 0)) *
          list.length,
      )
    ];
  };
  const { template, ports: eligible } = choose(choices, "news-kind");
  const port = choose(eligible, "news-port");
  const candidates = targetGoods(template, port, goodIndex);
  const first = candidates.indexOf(choose(candidates, "news-goods"));
  // Reports mention at most three concrete cargoes, making the clue readable
  // on a phone and keeping saved reports inside their validated size limits.
  const goodIds = [...candidates.slice(first), ...candidates.slice(0, first)].slice(0, 3);
  // Regional weather and harvests spill into a nearby market; local purchases stay local.
  const regional = ["storm", "drought", "harvest", "monsoon"].includes(
    template.kind,
  );
  const distance = (other: Port) =>
    Math.hypot(
      (other.x - port.x) * 180 * Math.cos((port.y * Math.PI) / 2),
      (other.y - port.y) * 90,
    );
  const nearby = regional
    ? eligible
        .filter(
          (other) =>
            other.id !== port.id &&
            other.basin === port.basin &&
            distance(other) <= 9 &&
            goodIds.every((id) =>
              targetGoods(template, other, goodIndex).includes(id),
            ),
        )
        .sort((a, b) => distance(a) - distance(b))
        .slice(0, 1)
    : [];
  const affected = [port, ...nearby];
  return {
    id: `${day}-${port.id}-${template.kind}`,
    kind: template.kind,
    startDay: day,
    endDay: day + template.duration,
    portIds: affected.map((entry) => entry.id),
    goodIds,
    multiplier: template.multiplier,
    source: `${port.name} · ${template.source}`,
    headline: template.headline,
    clue: `${affected.map((entry) => entry.name).join("、")}：${hint(template.kind, goodIds, goods)}${nearby.length ? "邻近码头也传来相似的消息。" : ""}`,
  };
}

/** Only active, matching markets are changed. The effect eases as trade recovers. */
export function marketEventFactor(
  events: MarketEvent[],
  portId: string,
  goodId: string,
  day: number,
): number {
  let factor = 1;
  for (const event of events) {
    if (
      day < event.startDay ||
      day >= event.endDay ||
      !event.portIds.includes(portId) ||
      !event.goodIds.includes(goodId)
    )
      continue;
    const remaining = (event.endDay - day) / (event.endDay - event.startDay);
    factor *= 1 + (event.multiplier - 1) * Math.min(1, remaining * 1.6);
  }
  return Math.max(0.62, Math.min(1.65, factor));
}

/** Validate into a new array so rejected imports cannot partially mutate the game. */
export function readMarketEvents(
  value: unknown,
  day: number,
  ports: Port[],
  goods: Good[],
): MarketEvent[] | null {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > 32) return null;
  const text = (v: unknown, max: number): v is string =>
    typeof v === "string" &&
    v.length > 0 &&
    v.length <= max &&
    !/[\u0000-\u001f]/.test(v);
  const ids = (
    v: unknown,
    known: { id: string }[],
    max: number,
  ): v is string[] =>
    Array.isArray(v) &&
    v.length > 0 &&
    v.length <= max &&
    new Set(v).size === v.length &&
    v.every(
      (id) => typeof id === "string" && known.some((entry) => entry.id === id),
    );
  const result: MarketEvent[] = [];
  const goodIndex = new Map(goods.map((good) => [good.id, good]));
  for (const item of value) {
    if (!item || typeof item !== "object" || Array.isArray(item)) return null;
    const event = item as Record<string, unknown>;
    const template = templates.find((entry) => entry.kind === event.kind);
    if (
      !template ||
      !text(event.id, 100) ||
      !text(event.headline, 100) ||
      !text(event.clue, 500) ||
      !text(event.source, 100) ||
      !Number.isInteger(event.startDay) ||
      !Number.isInteger(event.endDay) ||
      typeof event.startDay !== "number" ||
      typeof event.endDay !== "number" ||
      event.startDay < 1 ||
      event.startDay > day ||
      event.endDay !== event.startDay + template.duration ||
      !ids(event.portIds, ports, 2) ||
      !ids(event.goodIds, goods, 7) ||
      event.multiplier !== template.multiplier ||
      result.some((previous) => previous.id === event.id)
    )
      return null;
    const eventGoodIds = event.goodIds;
    const eventPorts = event.portIds.map((id) =>
      ports.find((port) => port.id === id)!,
    );
    if (
      !eventPorts.every((port) =>
        eventGoodIds.every((id) =>
          targetGoods(template, port, goodIndex).includes(id),
        ),
      )
    )
      return null;
    if (eventPorts.length > 1 && eventPorts[0].basin !== eventPorts[1].basin)
      return null;
    result.push({
      id: event.id,
      kind: template.kind,
      startDay: event.startDay,
      endDay: event.endDay,
      portIds: [...event.portIds],
      goodIds: [...event.goodIds],
      multiplier: template.multiplier,
      source: event.source,
      headline: event.headline,
      clue: event.clue,
    });
  }
  return result;
}
