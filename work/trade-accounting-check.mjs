import assert from "node:assert/strict";
import { TradeSim, origins, goods } from "./sim-bundle.mjs";

const check = (name, fn) => {
  fn();
  console.log(`PASS ${name}`);
};
const near = (actual, expected) =>
  assert(
    Math.abs(actual - expected) <= 1e-8,
    `${actual} should equal ${expected}`,
  );
const sim = () => {
  const s = new TradeSim();
  s.start(origins[0]);
  s.state.cash = 100000;
  s.state.ship.speed = 4; s.state.supplies = 100;
  return s;
};
const ledgerKeys = [
  "cargoCost",
  "cargoCostEstimated",
  "tradeLedger",
  "lastTrade",
  "lastVoyage",
];

check(
  "separate purchase lots form an actual weighted average, including marginal prices",
  () => {
    const s = sim();
    const startCash = s.state.cash;
    assert(s.buy("copper", 3));
    const firstCost = startCash - s.state.cash;
    s.state.stock.memphis.copper = 32;
    const beforeSecond = s.state.cash;
    assert(s.buy("copper", 7));
    const secondCost = beforeSecond - s.state.cash;
    assert.notEqual(firstCost / 3, secondCost / 7);
    near(s.cargoUnitCost("copper"), (firstCost + secondCost) / 10);
    assert.equal(s.state.cargoCostEstimated.copper, false);
    const preview = s.salePreview("copper", 4);
    near(preview.costBasis, (firstCost + secondCost) * 0.4);
    const beforeSale = s.state.cash;
    assert(s.sell("copper", 4));
    assert.equal(s.state.cash - beforeSale, preview.revenue);
    near(
      s.state.tradeLedger.realizedTradingProfit,
      preview.revenue - preview.costBasis,
    );
    near(s.state.cargoCost.copper, firstCost + secondCost - preview.costBasis);
    assert.equal(s.state.lastTrade.side, "sell");
    near(s.state.lastTrade.tradingProfit, preview.tradingProfit);
    assert(s.state.logs.at(-1).includes("不含航行开支"));
    assert(s.sell("copper", 999));
    assert.equal(s.state.cargo.copper, 0);
    assert.equal(s.state.cargoCost.copper, 0);
    near(s.state.tradeLedger.costBasis, firstCost + secondCost);
    near(s.state.tradeLedger.realizedTradingProfit, s.state.cash - startCash);
    assert.equal(s.state.profits, s.state.tradeLedger.revenue);
  },
);

check(
  "starting stock uses a disclosed reference valuation and resets after liquidation",
  () => {
    const s = sim();
    const grain = goods.find((g) => g.id === "grain");
    assert.equal(s.cargoUnitCost("grain"), grain.base);
    assert(s.state.cargoCostEstimated.grain);
    const quantity = s.state.cargo.grain;
    const preview = s.salePreview("grain", quantity);
    assert.equal(preview.costBasis, grain.base * quantity);
    assert(preview.costBasisEstimated);
    assert(s.sell("grain", quantity));
    assert(s.state.tradeLedger.costBasisEstimated);
    assert.equal(s.state.cargoCostEstimated.grain, false);
    assert(s.buy("grain", 2));
    assert.equal(s.state.cargoCostEstimated.grain, false);
    assert.equal(s.salePreview("grain", 1).costBasisEstimated, false);
  },
);

check(
  "partial sales retain full fractional precision and persist across reloads",
  () => {
    const s = sim();
    assert(s.buy("copper", 11));
    const originalCost = s.state.cargoCost.copper;
    assert(!Number.isInteger(originalCost / 11));
    assert(s.sell("copper", 1));
    assert(!Number.isInteger(s.state.cargoCost.copper));
    const restored = new TradeSim();
    assert(restored.import(s.export()));
    assert.deepEqual(restored.state.cargoCost, s.state.cargoCost);
    assert.deepEqual(restored.state.tradeLedger, s.state.tradeLedger);
    assert.deepEqual(restored.state.lastTrade, s.state.lastTrade);
    for (let i = 0; i < 10; i++) assert(restored.sell("copper", 1));
    assert.equal(restored.state.cargoCost.copper, 0);
    near(restored.state.tradeLedger.costBasis, originalCost);
    assert.equal(restored.salePreview("unknown", 3).quantity, 0);
    assert.equal(restored.salePreview("grain", NaN).quantity, 0);
    assert.equal(restored.salePreview("grain", -1).quantity, 0);
  },
);

check(
  "voyage reports count consumed provisions once and record wages and transit",
  () => {
    const s = sim();
    s.resupply();
    const quote = s.voyage("byblos", true);
    const cash = s.state.cash;
    assert(s.sail("byblos"));
    const initial = s.voyageExpenseReport();
    assert.equal(initial.operatingCost, cash - s.state.cash);
    assert.equal(initial.suppliesCost, 0);
    s.state.voyage.risk = 0;
    const initialSupplies = s.state.supplies;
    while (s.state.voyage) s.nextDay();
    const report = s.voyageExpenseReport();
    assert.equal(report.wages, quote.wages);
    assert.equal(report.transfer, 0);
    assert.equal(report.suppliesUsed, initialSupplies - s.state.supplies);
    assert.equal(report.suppliesCost, (initialSupplies - s.state.supplies) * 2);
    assert.equal(report.operatingCost, quote.cost);
    assert.equal(report.endedDay, s.state.day);
    assert.equal(report.partial, false);
    const completed = { ...report };
    s.resupply();
    assert.deepEqual(
      s.voyageExpenseReport(),
      completed,
      "restocking must not charge the previous voyage twice",
    );
    const clone = new TradeSim();
    assert(clone.import(s.export()));
    assert.deepEqual(clone.voyageExpenseReport(), completed);
    assert(s.sail("memphis"));
    assert.equal(
      s.voyageExpenseReport().suppliesCost,
      0,
      "a new voyage starts a new expense report",
    );
  },
);

check(
  "storm losses remove their historical cost without realizing a sale",
  () => {
    const s = sim();
    assert(s.sail("lothal"));
    // Exercise a hazardous route deterministically; cargo loss must reconcile by value.
    s.state.voyage.risk = 1;
    let sawLoss = false;
    while (s.state.voyage) {
      const beforeCargo = { ...s.state.cargo };
      const beforeCost = { ...s.state.cargoCost };
      const oldLoss = s.voyageExpenseReport().cargoLossCost;
      s.nextDay();
      let lostCost = 0;
      for (const good of goods) {
        const lost = beforeCargo[good.id] - s.state.cargo[good.id];
        if (lost) {
          sawLoss = true;
          lostCost += (beforeCost[good.id] * lost) / beforeCargo[good.id];
          near(
            beforeCost[good.id] - s.state.cargoCost[good.id],
            (beforeCost[good.id] * lost) / beforeCargo[good.id],
          );
        }
      }
      near(s.voyageExpenseReport().cargoLossCost - oldLoss, lostCost);
    }
    assert(sawLoss);
    assert.equal(s.state.tradeLedger.revenue, 0);
    assert.equal(s.state.tradeLedger.costBasis, 0);
    assert(s.voyageExpenseReport().costBasisEstimated);
    const report = s.voyageExpenseReport();
    near(report.totalRecordedCost, report.operatingCost + report.cargoLossCost);
  },
);

check(
  "old saves start an honest ledger with reference cargo values, preserving legacy revenue",
  () => {
    const s = sim();
    s.sell("grain", 1);
    assert(s.sail("lothal"));
    s.nextDay();
    const raw = JSON.parse(s.export());
    for (const key of ledgerKeys) delete raw[key];
    const restored = new TradeSim();
    assert(restored.import(JSON.stringify(raw)));
    assert.equal(restored.state.profits, raw.profits);
    assert.equal(restored.state.tradeLedger.revenue, 0);
    assert.equal(restored.state.tradeLedger.sinceDay, raw.day);
    for (const good of goods) {
      assert.equal(
        restored.state.cargoCost[good.id],
        restored.state.cargo[good.id] * good.base,
      );
      assert.equal(
        restored.state.cargoCostEstimated[good.id],
        restored.state.cargo[good.id] > 0,
      );
    }
    assert(restored.voyageExpenseReport().partial);
    assert.equal(restored.voyageExpenseReport().suppliesUsed, 0);
    restored.nextDay();
    assert.equal(
      restored.voyageExpenseReport().suppliesUsed,
      restored.state.voyage.dailySupply,
    );
    const clone = new TradeSim();
    assert(clone.import(restored.export()));
    assert.deepEqual(
      clone.voyageExpenseReport(),
      restored.voyageExpenseReport(),
    );
    delete raw.version;
    assert(
      clone.import(JSON.stringify(raw)),
      "pre-version-two saves still migrate",
    );
  },
);

check(
  "ransom reports match actual cash deductions and remain separate from trading margin",
  () => {
    let encountered = false;
    for (const origin of origins) {
      const s = new TradeSim();
      s.start(origin);
      s.state.cash = 100000;
      s.state.ship.speed = 4; s.state.supplies = 100;
      s.setStrategy("ransom");
      const destination =
        s.state.currentPortId === "memphis" ? "lothal" : "memphis";
      assert(s.sail(destination));
      s.state.voyage.risk = 1;
      const voyageCash = s.state.cash, initialWages = s.state.voyage.wages;
      while (s.state.voyage) s.nextDay();
      const report = s.voyageExpenseReport();
      near(report.ransom + report.wages, voyageCash - s.state.cash + initialWages);
      assert.equal(s.state.tradeLedger.realizedTradingProfit, 0);
      encountered ||= report.ransom > 0;
    }
    assert(
      encountered,
      "fixture routes must include an actual ransom encounter",
    );
  },
);

check(
  "invalid accounting imports leave cash, cargo, receipts and reports untouched",
  () => {
    const s = sim();
    s.sell("grain", 1);
    assert(s.sail("lothal"));
    s.nextDay();
    const checkpoint = s.export();
    for (const mutate of [
      (r) => delete r.cargoCost,
      (r) => (r.cargoCost = []),
      (r) => (r.cargoCost.grain = -1),
      (r) => (r.cargoCost.grain = NaN),
      (r) => (r.cargoCost.grain = 1e300),
      (r) => (r.cargoCost.grain = 0),
      (r) => (r.cargoCost.copper = 1),
      (r) => (r.cargoCost.unknown = 5),
      (r) => (r.cargoCostEstimated.grain = "yes"),
      (r) => (r.tradeLedger.sinceDay = r.day + 1),
      (r) => (r.tradeLedger.revenue = -2),
      (r) => (r.tradeLedger.realizedTradingProfit = 12345),
      (r) => (r.lastTrade.quantity = 0),
      (r) => (r.lastTrade.goodId = "bad"),
      (r) => (r.lastTrade.tradingProfit = Infinity),
      (r) => (r.lastVoyage = null),
      (r) => (r.lastVoyage.fromId = "bad"),
      (r) => (r.lastVoyage.suppliesCost += 2),
      (r) => (r.lastVoyage.endedDay = r.day),
      (r) => (r.lastVoyage.ransom = -2),
    ]) {
      const raw = JSON.parse(checkpoint);
      mutate(raw);
      assert.equal(s.import(JSON.stringify(raw)), false);
      assert.equal(s.export(), checkpoint);
    }
  },
);

console.log("Trade accounting: all 8 behavior groups passed.");
