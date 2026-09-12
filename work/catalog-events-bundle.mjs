// src/market-events.ts
var templates = [
  {
    kind: "storm",
    headline: "\u5916\u6D77\u8FDF\u6765\u7684\u5E06\u5F71",
    source: "\u7801\u5934\u642C\u8FD0\u5DE5",
    goods: ["pepper", "cinnamon", "cloves", "linen", "copper", "cedar"],
    multiplier: 1.22,
    duration: 7
  },
  {
    kind: "drought",
    headline: "\u96E8\u5B63\u8FDF\u8FDF\u672A\u5230",
    source: "\u4E61\u95F4\u884C\u5546",
    goods: ["grain", "linen", "cotton", "sugar"],
    multiplier: 1.27,
    duration: 9
  },
  {
    kind: "harvest",
    headline: "\u4E61\u95F4\u6EE1\u8F7D\u7684\u8F66\u961F",
    source: "\u6536\u8D27\u8F66\u592B",
    goods: ["grain", "linen", "cotton", "sugar"],
    multiplier: 0.79,
    duration: 8
  },
  {
    kind: "repairs",
    headline: "\u8239\u575E\u91CD\u65B0\u5F00\u5DE5",
    source: "\u8239\u575E\u6728\u5320",
    goods: ["cedar", "iron", "copper", "wood", "rigging"],
    multiplier: 1.24,
    duration: 7
  },
  {
    kind: "festival",
    headline: "\u96C6\u5E02\u5F00\u59CB\u5E03\u7F6E\u957F\u684C",
    source: "\u96C6\u5E02\u644A\u4E3B",
    goods: ["wine", "oil", "pottery", "silk"],
    multiplier: 1.2,
    duration: 6
  },
  {
    kind: "convoy",
    headline: "\u8D27\u4ED3\u6DF1\u591C\u7684\u706F\u706B",
    source: "\u5546\u961F\u9886\u961F",
    goods: ["porcelain", "silk", "cotton", "pottery", "salt"],
    multiplier: 0.82,
    duration: 7
  },
  {
    kind: "monsoon",
    headline: "\u5F15\u822A\u5458\u4ECD\u5728\u7B49\u98CE",
    source: "\u6E2F\u53E3\u5F15\u822A\u5458",
    goods: ["tea", "coffee", "pepper", "cloves", "copper", "salt", "cedar"],
    multiplier: 1.18,
    duration: 8
  }
];
function targetGoods(template, port, goods) {
  if (template.kind === "monsoon" && !["gulf", "indian", "china", "redsea", "southeast"].includes(port.basin))
    return [];
  const local = template.kind === "harvest" || template.kind === "drought" ? port.produces : template.kind === "storm" || template.kind === "monsoon" ? port.demands : [...port.produces, ...port.demands];
  return [...new Set(local)].filter((id) => {
    const good = goods.get(id);
    return good && (template.goods.includes(id) || template.goods.includes(good.familyId ?? ""));
  });
}
function hint(kind, goodIds, goods) {
  const names = goodIds.map((id) => goods.find((good) => good.id === id).name).join("\u3001");
  switch (kind) {
    case "storm":
      return `\u5916\u6D77\u98CE\u6D6A\u8FDE\u65E5\u4E0D\u606F\u3002\u8FD0\u9001${names}\u7684\u51E0\u8258\u5546\u8239\u8FDF\u8FDF\u672A\u8FDB\u6E2F\uFF0C\u4ED3\u5E93\u638C\u67DC\u5DF2\u8FDE\u7EED\u95EE\u4E86\u4E09\u6B21\u8239\u671F\u3002`;
    case "drought":
      return `\u96E8\u5B63\u8FDF\u8FDF\u672A\u5230\u3002${names}\u7684\u6536\u8D27\u4EBA\u7A7A\u7740\u8F66\u56DE\u6765\uFF0C\u8D27\u6808\u638C\u67DC\u628A\u65B0\u7684\u4EA4\u8D27\u5355\u538B\u5728\u4E86\u684C\u89D2\u3002`;
    case "harvest":
      return `\u4ECA\u5E74\u7684\u6536\u6210\u6BD4\u9884\u60F3\u66F4\u597D\u3002\u88C5\u7740${names}\u7684\u8F66\u961F\u6324\u6EE1\u4ED3\u5E93\uFF0C\u8D27\u4E3B\u5F00\u59CB\u62C5\u5FC3\u4E0B\u6279\u8D27\u6CA1\u5730\u65B9\u653E\u3002`;
    case "repairs":
      return `\u6E2F\u53E3\u6B63\u5728\u4FEE\u6574\u65E7\u8239\u575E\u3002\u5DE5\u5320\u4EEC\u4E00\u65E9\u5C31\u4E0A\u4E86\u7801\u5934\uFF0C\u91C7\u8D2D\u5458\u62FF\u7740${names}\u7684\u6E05\u5355\u6328\u5BB6\u6572\u95E8\u3002`;
    case "festival":
      return `\u5E86\u5178\u5C06\u8FD1\uFF0C\u96C6\u5E02\u5F00\u59CB\u9884\u7559\u957F\u684C\u3002\u51E0\u4F4D\u4E3B\u4E8B\u63A5\u8FDE\u95EE\u8D77${names}\uFF0C\u8BF4\u7B49\u8239\u8FDB\u6E2F\u53EF\u80FD\u5C31\u6765\u4E0D\u53CA\u4E86\u3002`;
    case "convoy":
      return `\u4E00\u652F\u6EE1\u8F7D${names}\u7684\u5546\u961F\u521A\u521A\u5165\u6E2F\u3002\u8D27\u4ED3\u706F\u706B\u4EAE\u5230\u6DF1\u591C\uFF0C\u51E0\u4F4D\u8D27\u4E3B\u4E3B\u52A8\u7559\u4F4F\u4E86\u8DEF\u8FC7\u7684\u4E70\u5BB6\u3002`;
    case "monsoon":
      return `\u5B63\u98CE\u6BD4\u9884\u8BA1\u6765\u5F97\u665A\u3002\u88C5\u7740${names}\u7684\u8239\u8FD8\u5728\u8FDC\u5904\u5019\u98CE\uFF0C\u8D27\u94FA\u638C\u67DC\u5F00\u59CB\u6253\u542C\u522B\u5904\u7684\u8D27\u6E90\u3002`;
  }
}
function createMarketEvent(day, ports, goods, random) {
  const goodIndex = new Map(goods.map((good) => [good.id, good]));
  const choices = templates.map((template2) => ({
    template: template2,
    ports: ports.filter(
      (port2) => targetGoods(template2, port2, goodIndex).length > 0
    )
  })).filter((entry) => entry.ports.length > 0);
  if (!choices.length)
    throw new Error("\u5E02\u573A\u6D88\u606F\u9700\u8981\u81F3\u5C11\u4E00\u4E2A\u53EF\u4EA4\u6613\u6E2F\u53E3\u548C\u5546\u54C1\u3002");
  const choose = (list, key) => {
    const roll = random(key);
    return list[Math.floor(
      Math.max(0, Math.min(0.999999999, Number.isFinite(roll) ? roll : 0)) * list.length
    )];
  };
  const { template, ports: eligible } = choose(choices, "news-kind");
  const port = choose(eligible, "news-port");
  const candidates = targetGoods(template, port, goodIndex);
  const first = candidates.indexOf(choose(candidates, "news-goods"));
  const goodIds = [...candidates.slice(first), ...candidates.slice(0, first)].slice(0, 3);
  const regional = ["storm", "drought", "harvest", "monsoon"].includes(
    template.kind
  );
  const distance = (other) => Math.hypot(
    (other.x - port.x) * 180 * Math.cos(port.y * Math.PI / 2),
    (other.y - port.y) * 90
  );
  const nearby = regional ? eligible.filter(
    (other) => other.id !== port.id && other.basin === port.basin && distance(other) <= 9 && goodIds.every(
      (id) => targetGoods(template, other, goodIndex).includes(id)
    )
  ).sort((a, b) => distance(a) - distance(b)).slice(0, 1) : [];
  const affected = [port, ...nearby];
  return {
    id: `${day}-${port.id}-${template.kind}`,
    kind: template.kind,
    startDay: day,
    endDay: day + template.duration,
    portIds: affected.map((entry) => entry.id),
    goodIds,
    multiplier: template.multiplier,
    source: `${port.name} \xB7 ${template.source}`,
    headline: template.headline,
    clue: `${affected.map((entry) => entry.name).join("\u3001")}\uFF1A${hint(template.kind, goodIds, goods)}${nearby.length ? "\u90BB\u8FD1\u7801\u5934\u4E5F\u4F20\u6765\u76F8\u4F3C\u7684\u6D88\u606F\u3002" : ""}`
  };
}
function marketEventFactor(events, portId, goodId, day) {
  let factor = 1;
  for (const event of events) {
    if (day < event.startDay || day >= event.endDay || !event.portIds.includes(portId) || !event.goodIds.includes(goodId))
      continue;
    const remaining = (event.endDay - day) / (event.endDay - event.startDay);
    factor *= 1 + (event.multiplier - 1) * Math.min(1, remaining * 1.6);
  }
  return Math.max(0.62, Math.min(1.65, factor));
}
function readMarketEvents(value, day, ports, goods) {
  if (value === void 0) return [];
  if (!Array.isArray(value) || value.length > 32) return null;
  const text = (v, max) => typeof v === "string" && v.length > 0 && v.length <= max && !/[\u0000-\u001f]/.test(v);
  const ids = (v, known, max) => Array.isArray(v) && v.length > 0 && v.length <= max && new Set(v).size === v.length && v.every(
    (id) => typeof id === "string" && known.some((entry) => entry.id === id)
  );
  const result = [];
  const goodIndex = new Map(goods.map((good) => [good.id, good]));
  for (const item of value) {
    if (!item || typeof item !== "object" || Array.isArray(item)) return null;
    const event = item;
    const template = templates.find((entry) => entry.kind === event.kind);
    if (!template || !text(event.id, 100) || !text(event.headline, 100) || !text(event.clue, 500) || !text(event.source, 100) || !Number.isInteger(event.startDay) || !Number.isInteger(event.endDay) || typeof event.startDay !== "number" || typeof event.endDay !== "number" || event.startDay < 1 || event.startDay > day || event.endDay !== event.startDay + template.duration || !ids(event.portIds, ports, 2) || !ids(event.goodIds, goods, 7) || event.multiplier !== template.multiplier || result.some((previous) => previous.id === event.id))
      return null;
    const eventGoodIds = event.goodIds;
    const eventPorts = event.portIds.map(
      (id) => ports.find((port) => port.id === id)
    );
    if (!eventPorts.every(
      (port) => eventGoodIds.every(
        (id) => targetGoods(template, port, goodIndex).includes(id)
      )
    ))
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
      clue: event.clue
    });
  }
  return result;
}
export {
  createMarketEvent,
  marketEventFactor,
  readMarketEvents
};
