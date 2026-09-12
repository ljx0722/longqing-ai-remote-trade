import assert from "node:assert/strict";
import {
  TradeSim,
  origins,
  ports,
  goods,
  eras,
  createMarketEvent,
  marketEventFactor,
} from "./sim-bundle.mjs";

const check = (name, fn) => {
  fn();
  console.log(`PASS ${name}`);
};
const sim = () => {
  const s = new TradeSim();
  s.start(origins[0]);
  return s;
};
const eventFor = (kind, era = 0, portRoll = 0) => {
  const kinds = [
    "storm",
    "drought",
    "harvest",
    "repairs",
    "festival",
    "convoy",
    "monsoon",
  ];
  return createMarketEvent(
    1,
    ports.filter((p) => p.era <= era),
    goods.filter((g) => g.era <= era),
    (key) =>
      key === "news-kind"
        ? (kinds.indexOf(kind) + 0.1) / kinds.length
        : portRoll,
  );
};

check("a new family receives an actionable but indirect local report", () => {
  const s = sim();
  assert.equal(s.state.marketEvents.length, 1);
  const event = s.state.marketEvents[0];
  assert(s.state.logs.some((log) => log.includes(event.clue)));
  assert(event.portIds.every((id) => event.clue.includes(s.port(id).name)));
  assert(
    event.goodIds.every((id) =>
      event.clue.includes(goods.find((g) => g.id === id).name),
    ),
  );
  assert(!/买入|卖出|涨价|跌价|必赚|%/.test(event.clue));
  assert(event.source.includes(s.port(event.portIds[0]).name));
});

check(
  "every cause affects its stated goods and ports, with both rises and falls",
  () => {
    for (const kind of [
      "storm",
      "drought",
      "harvest",
      "repairs",
      "festival",
      "convoy",
      "monsoon",
    ]) {
      const event = eventFor(kind);
      assert.equal(event.kind, kind);
      const s = sim();
      s.state.marketEvents = [];
      const before = Object.fromEntries(
        ports.map((p) => [
          p.id,
          Object.fromEntries(goods.map((g) => [g.id, s.price(p.id, g.id)])),
        ]),
      );
      s.state.marketEvents = [event];
      for (const port of ports)
        for (const good of goods) {
          const price = s.price(port.id, good.id);
          if (
            event.portIds.includes(port.id) &&
            event.goodIds.includes(good.id)
          ) {
            assert(
              event.multiplier > 1
                ? price > before[port.id][good.id]
                : price < before[port.id][good.id],
              `${kind}: ${port.id}/${good.id}`,
            );
          } else
            assert.equal(
              price,
              before[port.id][good.id],
              `${kind} must not leak into ${port.id}/${good.id}`,
            );
        }
    }
  },
);

check("effects ease, expire exactly, and remain bounded when combined", () => {
  for (const kind of ["drought", "harvest"]) {
    const event = eventFor(kind);
    const args = [event.portIds[0], event.goodIds[0]];
    assert.equal(marketEventFactor([event], ...args, 0), 1);
    const full = marketEventFactor([event], ...args, event.startDay);
    const fading = marketEventFactor([event], ...args, event.endDay - 1);
    assert(Math.abs(fading - 1) < Math.abs(full - 1));
    assert.equal(marketEventFactor([event], ...args, event.endDay), 1);
    assert.equal(
      marketEventFactor(Array(32).fill(event), ...args, 1),
      kind === "drought" ? 1.65 : 0.62,
    );
    const s = sim();
    s.state.marketEvents = [event];
    s.state.day = event.endDay;
    const expiredPrice = s.price(...args);
    s.state.marketEvents = [];
    assert.equal(s.price(...args), expiredPrice);
  }
});

check("reports are scheduled every four days at sea as well as at port", () => {
  const s = sim();
  s.state.ship.speed = 4; s.state.supplies = 100;
  assert(s.sail("lothal"));
  assert(s.state.voyage.totalDays > 4);
  for (let i = 0; i < 3; i++) s.nextDay();
  assert.equal(s.state.marketEvents.length, 1);
  s.nextDay();
  assert(s.state.voyage);
  assert.equal(s.state.marketEvents.length, 2);
  assert.deepEqual(
    s.state.marketEvents.map((e) => e.startDay),
    [1, 5],
  );
  for (let i = 0; i < 160; i++) s.nextDay();
  assert.equal(s.state.marketEvents.length, 32);
  assert(s.state.marketEvents.some((e) => e.endDay <= s.state.day));
  assert(
    s.state.marketEvents.filter((e) => e.endDay > s.state.day).length <= 3,
  );
});

check(
  "events respect all eleven eras, local production and regional boundaries",
  () => {
    for (let era = 0; era < eras.length; era++)
      for (const kind of [
        "storm",
        "drought",
        "harvest",
        "repairs",
        "festival",
        "convoy",
        "monsoon",
      ])
        for (const roll of [0, 0.23, 0.51, 0.99]) {
          const event = eventFor(kind, era, roll);
          assert.equal(event.kind, kind);
          const affectedPorts = event.portIds.map((id) =>
            ports.find((p) => p.id === id),
          );
          assert(affectedPorts.every((p) => p.era <= era));
          assert(
            event.goodIds.every(
              (id) => goods.find((g) => g.id === id).era <= era,
            ),
          );
          assert(affectedPorts.every((p) => event.clue.includes(p.name)));
          if (kind === "harvest" || kind === "drought")
            assert(
              affectedPorts.every((p) =>
                event.goodIds.every((id) => p.produces.includes(id)),
              ),
            );
          if (kind === "monsoon")
            assert(
              affectedPorts.every((p) =>
                ["gulf", "indian", "china", "redsea", "southeast"].includes(p.basin),
              ),
            );
          assert(
            affectedPorts.every((p) => p.basin === affectedPorts[0].basin),
          );
          if (era < 5) assert(!/茶叶|茶棚|咖啡/.test(event.clue));
          const s = sim();
          s.state.eraIndex = era;
          s.state.marketEvents = [event];
          const loaded = new TradeSim();
          assert(
            loaded.import(s.export()),
            `${era}/${kind}/${roll} round trip`,
          );
        }
  },
);

check(
  "saving during a voyage preserves current quotes and future reports",
  () => {
    const s = sim();
    s.state.ship.speed = 4; s.state.supplies = 100;
    assert(s.sail("lothal"));
    for (let i = 0; i < 4; i++) s.nextDay();
    const clone = new TradeSim();
    assert(clone.import(s.export()));
    assert.deepEqual(JSON.parse(clone.export()), JSON.parse(s.export()));
    for (const port of s.availablePorts())
      for (const good of s.availableGoods())
        assert.equal(clone.price(port.id, good.id), s.price(port.id, good.id));
    for (let i = 0; i < 12; i++) {
      s.nextDay();
      clone.nextDay();
    }
    assert.deepEqual(JSON.parse(clone.export()), JSON.parse(s.export()));
  },
);

check(
  "malformed event archives reject atomically without changing the save",
  () => {
    const s = sim();
    s.state.marketEvents = [eventFor("drought")];
    const checkpoint = s.export();
    const cases = [
      (r) => (r.marketEvents = {}),
      (r) => (r.marketEvents = null),
      (r) => r.marketEvents.push({ ...r.marketEvents[0] }),
      (r) => (r.marketEvents[0].portIds = ["missing-port"]),
      (r) => (r.marketEvents[0].goodIds = ["missing-good"]),
      (r) => (r.marketEvents[0].goodIds = ["tea"]),
      (r) => (r.marketEvents[0].goodIds = ["copper"]),
      (r) => (r.marketEvents[0].kind = "fake"),
      (r) => (r.marketEvents[0].startDay = NaN),
      (r) => (r.marketEvents[0].startDay = 1e300),
      (r) => (r.marketEvents[0].startDay = 0),
      (r) => (r.marketEvents[0].endDay = 1e300),
      (r) => r.marketEvents[0].endDay++,
      (r) => (r.marketEvents[0].multiplier = NaN),
      (r) => (r.marketEvents[0].multiplier = Infinity),
      (r) => (r.marketEvents[0].multiplier = 5000),
      (r) => (r.marketEvents[0].clue = "x".repeat(501)),
      (r) => (r.marketEvents[0].source = ""),
      (r) => (r.marketEvents[0].headline = "\u0000bad"),
      (r) => (r.marketEvents = Array(33).fill(r.marketEvents[0])),
    ];
    for (const mutate of cases) {
      const raw = JSON.parse(checkpoint);
      mutate(raw);
      assert.equal(s.import(JSON.stringify(raw)), false);
      assert.equal(s.export(), checkpoint);
    }
  },
);

check(
  "existing version-two and legacy saves without reports remain playable",
  () => {
    const s = sim();
    const raw = JSON.parse(s.export());
    delete raw.marketEvents;
    const loaded = new TradeSim();
    assert(loaded.import(JSON.stringify(raw)));
    assert.deepEqual(loaded.state.marketEvents, []);
    for (let i = 0; i < 4; i++) loaded.nextDay();
    assert.equal(loaded.state.marketEvents.length, 1);
    delete raw.version;
    assert(loaded.import(JSON.stringify(raw)));
    assert.deepEqual(loaded.state.marketEvents, []);
  },
);

check(
  "cross-basin sea route quotes charge actual wages without imaginary transit and cannot overdraw cash",
  () => {
    const s = sim();
    s.state.ship.speed = 4; s.state.supplies = 100;
    const quote = s.voyage("ur");
    assert.equal(quote.transfer, false);
    const cash = s.state.cash;
    assert(s.sail("ur"));
    assert.equal(cash - s.state.cash, quote.wages);
    assert.equal(quote.cost, quote.wages + quote.supplies * 2);
    const poor = sim();
    poor.state.ship.speed = 4; poor.state.supplies = 100;
    poor.state.cash = quote.wages - 1;
    assert.equal(poor.sail("ur"), false);
    assert.equal(poor.state.cash, quote.wages - 1);
    assert.equal(poor.state.voyage, null);
  },
);

console.log("Market news: all 9 behavior groups passed.");

