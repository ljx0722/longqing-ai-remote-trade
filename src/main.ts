import "./styles.css";
import { TradeSim, eras, goods, origins, ports } from "./sim";
import { WorldRenderer } from "./renderer";
import { GameClock } from "./clock";
import { lifeMarkup, type LifeTab } from "./life-view";
import { dominionMarkup, type DominionTab } from "./dominion-view";
import { inlandCities, inlandRoads } from "./dominion";
import { matchesCity } from "./city-names";
import { distanceDegrees, portPoint, navigationHazards } from "./navigation";
import type { MarketEvent } from "./market-events";
import { icon } from "./icons";
import { atlasMarkup, loadAtlas } from "./atlas";
import {
  saveGame,
  loadGame,
  loadBackup,
  downloadSave,
  registerOffline,
} from "./storage";

type Panel =
  | "market"
  | "route"
  | "fleet"
  | "history"
  | "guild"
  | "journal"
  | "settings"
  | "life"
  | "catalog";
const sim = new TradeSim();
const gameClock = new GameClock();
const $ = <T extends HTMLElement = HTMLElement>(s: string): T =>
  document.querySelector<T>(s)!;
const money = (v: number) => Math.round(v).toLocaleString("zh-CN");
const preciseMoney = (v: number) =>
  v.toLocaleString("zh-CN", { maximumFractionDigits: 2 });
const escape = (v: unknown) =>
  String(v).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
let panel: Panel | null = null;
let selected = "",
  selectedOrigin = origins[0].id;
let quantity = 5,
  speed = 1,
  dayFraction = 0,
  tutorial = 0,
  toastTimer = 0;
let paused = false,
  uiReady = false,
  saving = false,
  lowQuality = false;
let rendererKind = "加载中";
let journalTab: "news" | "voyages" = "news";
let marketFilter: "all" | "held" | "local" = "all";
let lifeTab: LifeTab = "residents";
let dominionTab: DominionTab = "cities",
  cityPage = 0,
  cityFocus = "",
  citySearch = "";
let cityScope: "known" | "all" = "known";
let catalogSearch = "",
  catalogPage = 0;
let marketSearch = "",
  marketCategory = "",
  marketPage = 0;
let routeSearch = "",
  routeRegion = "",
  routePage = 0;

const helmKeys = new Set<string>();
let lastBlockedNotice = 0;
let tradeReceiptVisible = false;
let growthHidden = false;
let newsRemaining = 0;
let displayedNewsId = "";
const announcedNews = new Set<string>();
try {
  lowQuality = localStorage.getItem("remote-trade-quality") === "low";
} catch {
  /* Default graphics remain usable. */
}
let lastFocus: HTMLElement | null = null;
const titles: Record<Panel, [string, string]> = {
  market: ["港口市场", "MARKET"],
  route: ["远洋航路", "NAVIGATION"],
  fleet: ["我的船队", "FLEET"],
  history: ["家族编年史", "CHRONICLE"],
  guild: ["城邦与商路", "CITY STATES"],
  journal: ["航海日志", "LOGBOOK"],
  settings: ["航海选项", "OPTIONS"],
  life: ["港口生活", "PORT LIFE"],
  catalog: ["世界物产图鉴", "TRADE ATLAS"],
};
const dock: [Panel, string, string][] = [
  ["market", "market", "市场"],
  ["route", "route", "航路"],
  ["fleet", "ship", "船队"],
  ["history", "history", "文明"],
  ["guild", "guild", "城邦"],
  ["journal", "log", "日志"],
];
$("#app").innerHTML = `
<div class="game-shell">
  <div id="worldStage" class="world-stage" aria-label="港湾地图，可拖动和缩放"></div><div class="scene-vignette"></div>
  <header class="topbar"><div class="brand"><span class="brand-seal">${icon("anchor")}</span><div><strong>远海商途</strong><small>长晴 · 家族航海纪</small></div></div>
    <div class="resources" aria-label="经营概况"><button data-panel="market" class="resource" title="现银 · 打开市场">${icon("coin")}<span><small>现银</small><b id="cash">—</b></span></button><button data-panel="fleet" class="resource" title="货舱 · 打开船队">${icon("cargo")}<span><small>货舱</small><b id="cargo">—</b></span></button><button data-panel="fleet" class="resource" title="补给 · 打开船队">${icon("supply")}<span><small>补给</small><b id="supplies">—</b></span></button></div>
    <button class="square-button" data-panel="settings" aria-label="航海选项">${icon("settings")}</button></header>
  <div class="place-header"><span class="eyebrow" id="eraLabel">河口与海湾贸易</span><h1 id="placeName">尼罗河口</h1><p id="placeRegion">海风初起，商途未远。</p></div>
  <div class="time-bar"><span class="weather">${icon("sun")}<span id="dayLabel">航海日 1</span></span><span class="time-divider"></span><button id="pause" aria-label="暂停时间">Ⅱ</button><button data-speed="1" class="active">1×</button><button data-speed="2">2×</button><button data-speed="4">4×</button><span id="clockState" class="clock-state">准备起航</span><div class="day-progress"><i id="dayProgress"></i></div></div>
  <section id="marketNews" class="market-news" aria-label="远港来信" hidden><span class="news-seal" aria-hidden="true">${icon("log")}</span><button id="readNews" class="news-copy"><span class="news-heading"><span>远港来信</span><small id="newsDate"></small></span><strong id="newsHeadline"></strong><span id="newsClue" role="status" aria-live="polite"></span><small class="news-link">收进日志，细读商情 ${icon("arrow")}</small></button><button id="dismissNews" class="news-close" aria-label="收起远港来信">${icon("close")}</button><div class="news-lifetime" aria-hidden="true"><i id="newsProgress"></i></div></section>
  <button id="toggleMap" class="map-mode" hidden>展开海图</button><div id="oceanLabels" class="landmarks ocean-labels"></div>
  <div id="landmarks" class="landmarks"></div><div class="map-tools"><button id="zoomIn" aria-label="放大地图">+</button><button id="zoomOut" aria-label="缩小地图">−</button><button id="recenter" aria-label="回到船队" title="回到船队，保留当前缩放">${icon("compass")}</button></div>
  <div class="compass-rose" aria-hidden="true"><span>N</span>${icon("compass")}<small>港 湾</small></div><div class="map-hint">拖动地图 · 滚轮缩放 · 点击建筑</div>
  <section id="guide" class="guide-card" aria-label="当前航海目标"></section><div id="voyageBar" class="voyage-bar" hidden></div><div id="helm" class="helm" hidden><div class="helm-line"><button id="toggleHelm">手动掌舵</button><span id="headingLabel"></span><button id="followShip" aria-label="镜头跟随商船">跟随船队</button></div><div id="manualControls" class="helm-line" hidden><button data-helm="left" aria-label="向左转舵">↶</button><button data-helm="right" aria-label="向右转舵">↷</button><button data-helm="down" aria-label="收帆减速">− 收帆</button><button data-helm="up" aria-label="升帆加速">+ 升帆</button></div><div id="nearbyDock" class="nearby-dock"></div></div>
  <nav class="bottom-dock" aria-label="游戏功能">${dock.map(([p, i, t], n) => `<button data-panel="${p}" aria-label="${t}">${icon(i)}<span>${t}</span><kbd>${n + 1}</kbd></button>`).join("")}</nav>
  <aside id="drawer" class="drawer" role="dialog" aria-modal="false" aria-labelledby="drawerTitle" hidden><header class="drawer-header"><div><span class="eyebrow" id="drawerSubtitle"></span><h2 id="drawerTitle"></h2></div><button id="closeDrawer" class="square-button" aria-label="关闭面板">${icon("close")}</button></header><div id="drawerBody" class="drawer-body"></div><footer class="drawer-footer">${icon("anchor")}经营期间时间暂停 · Esc 返回地图</footer></aside>
  <section id="welcome" class="welcome" role="dialog" aria-labelledby="welcomeTitle"><div class="welcome-header"><span class="eyebrow">一个家族 · 五千年商途</span><h2 id="welcomeTitle">从一座港口开始。</h2><p>选择家族的故乡。让第一船货物，换来远方的海风。</p></div><div id="origins" class="origin-list"></div><button id="startGame" class="primary" disabled>建立商贸家族 ${icon("arrow")}</button><button id="continueGame" class="quiet-button" hidden>继续上次的航程</button><small class="welcome-note">公元前 3000 — 公元 1750 · 11 个纪元</small></section>
  <div id="toast" class="toast" role="status" aria-live="polite"></div><input id="importFile" type="file" accept="application/json,.json" hidden>
</div>`;
const world = new WorldRenderer($("#worldStage"));
function hideNews(): void {
  $("#marketNews").hidden = true;
  $(".game-shell").classList.remove("has-news");
  newsRemaining = 0;
}
function resetNews(): void {
  hideNews();
  announcedNews.clear();
  displayedNewsId = "";
}
function renderNews(): void {
  if (!sim.state.started || !$("#welcome").hidden) return;
  const events = sim.state.marketEvents;
  if (
    displayedNewsId &&
    !events.some((e) => e.id === displayedNewsId && e.endDay > sim.state.day)
  )
    hideNews();
  const unread = events.filter(
    (e) =>
      e.startDay <= sim.state.day &&
      e.endDay > sim.state.day &&
      !announcedNews.has(e.id),
  );
  const latest = unread.at(-1);
  if (latest && !panel) {
    unread.forEach((e) => announcedNews.add(e.id));
    displayedNewsId = latest.id;
    newsRemaining = 16;
    $("#newsDate").textContent = `第 ${latest.startDay} 日`;
    $("#newsHeadline").textContent = latest.headline;
    $("#newsClue").textContent = latest.clue;
    $("#marketNews").hidden = false;
    $(".game-shell").classList.add("has-news");
  }
  const active = events.filter(
    (e) => e.startDay <= sim.state.day && e.endDay > sim.state.day,
  ).length;
  const journal = $(".bottom-dock [data-panel=journal]");
  journal.classList.toggle("has-intelligence", active > 0);
  journal.setAttribute(
    "aria-label",
    active ? `日志 · ${active} 条近期商情` : "日志",
  );
}
function newsCard(event: MarketEvent, compact = false): string {
  const age = sim.state.day - event.startDay;
  const expired = sim.state.day >= event.endDay;
  return `<article class="intelligence-card ${expired ? "expired" : ""}" data-news-id="${escape(event.id)}"><div class="intelligence-meta"><span>第 ${event.startDay} 日 · ${age ? `${age} 日前` : "今日传来"}</span><span>${expired ? "旧闻 · 影响已消退" : age >= 4 ? "消息渐旧" : "近期见闻"}</span></div><h4>${escape(event.headline)}</h4><p>${escape(event.clue)}</p>${compact ? "" : `<div class="news-ports">${event.portIds.map((id) => `<button class="quiet-button" data-news-port="${escape(id)}">${escape(sim.port(id).name)} · ${id === sim.state.currentPortId ? "查看市场" : "查看航路"} ${icon("arrow")}</button>`).join("")}</div>`}</article>`;
}
function notice(text: string): void {
  $("#toast").textContent = text;
  $("#toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(
    () => $("#toast").classList.remove("show"),
    4200,
  );
}
function traveling(): boolean {
  return !!sim.state.destinationId;
}
function blocked(): boolean {
  return (
    !sim.state.started ||
    !!panel ||
    !$("#welcome").hidden ||
    paused ||
    document.hidden
  );
}
function rememberTutorial(): void {
  try {
    localStorage.setItem("remote-trade-tutorial", String(tutorial));
  } catch {
    /* Optional UI preference. */
  }
}
function showPanel(next: Panel): void {
  if (!sim.state.started || !$("#welcome").hidden) return;
  lastFocus = document.activeElement as HTMLElement;
  panel = next;
  if (next !== "market") tradeReceiptVisible = false;
  hideNews();
  $("#drawer").hidden = false;
  $(".game-shell").classList.add("drawer-open");
  $("#drawerTitle").textContent = titles[next][0];
  $("#drawerSubtitle").textContent = titles[next][1];
  renderPanel();
  $("#drawerBody").scrollTop = 0;
  renderHud();
  $("#closeDrawer").focus({ preventScroll: true });
}
function closePanel(): void {
  panel = null;
  $("#drawer").hidden = true;
  $(".game-shell").classList.remove("drawer-open");
  renderHud();
  lastFocus?.focus({ preventScroll: true });
}
function action(fn: () => boolean): void {
  if (fn()) {
    render();
    void persist();
  }
  notice(sim.state.lastEvent);
}
async function persist(explicit = false): Promise<void> {
  if (!sim.state.started || saving) return;
  saving = true;
  try {
    await saveGame(sim.export());
    if (explicit) notice("航程已保存到本机");
  } catch (e) {
    notice(`存档未保存：${e instanceof Error ? e.message : "存储不可用"}`);
  } finally {
    saving = false;
  }
}
function renderOrigins(): void {
  $("#origins").innerHTML = origins
    .map(
      (o, i) =>
        `<button class="origin-option ${o.id === selectedOrigin ? "selected" : ""}" data-origin="${o.id}"><span class="origin-glyph">${["𓂀", "▤", "♧", "◈", "♜", "✧", "◇", "◉"][i % 8]}</span><span><strong>${o.title}</strong><small>${o.region}</small><em>${o.perk}</em></span><i>${o.id === selectedOrigin ? "✓" : ""}</i></button>`,
    )
    .join("");
}
function renderHud(): void {
  const s = sim.state;
  $("#cash").textContent = s.started ? money(s.cash) : "—";
  $("#cargo").textContent = s.started
    ? `${sim.cargoCount()} / ${sim.capacity()}`
    : "—";
  $("#supplies").textContent = s.started ? `${Math.floor(s.supplies)} 份` : "—";
  $("#eraLabel").textContent =
    `${String(s.eraIndex + 1).padStart(2, "0")} / ${eras.length} · ${eras[s.eraIndex].title}`;
  $("#placeName").textContent = traveling() ? "远洋航行中" : sim.port().name;
  $("#placeRegion").textContent = traveling()
    ? `${sim.port().name} → ${sim.port(s.destinationId!).name}`
    : `${sim.port().polity} · ${sim.port().region}`;
  $("#dayLabel").textContent = `航海日 ${s.day}`;
  $("#clockState").textContent = !s.started
    ? "准备起航"
    : document.hidden
      ? "后台暂停"
      : panel
        ? "经营暂停"
        : paused
          ? "已暂停"
          : `${speed} 倍速`;
  $("#pause").textContent = paused ? "▶" : "Ⅱ";
  $("#pause").setAttribute("aria-label", paused ? "继续时间" : "暂停时间");
  document.querySelectorAll<HTMLElement>("[data-speed]").forEach((b) => {
    b.classList.toggle("active", Number(b.dataset.speed) === speed);
    b.setAttribute("aria-pressed", String(Number(b.dataset.speed) === speed));
  });
  document
    .querySelectorAll<HTMLElement>(".bottom-dock [data-panel]")
    .forEach((b) => b.classList.toggle("active", b.dataset.panel === panel));
  $("#guide").hidden = !s.started || (tutorial >= 5 && growthHidden);
  const localGood =
    sim.availableGoods().find((g) => sim.port().produces.includes(g.id)) ??
    sim.availableGoods()[0];
  const tasks = [
    [
      "购入第一批货物",
      `先看单价，再选数量。${sim.port().name}出产${localGood.name}，可先少量买入，留出工资和补给钱。`,
      "market",
    ],
    ["规划第一条航路", "打开航路，看看邻近港口的需求与航程。", "route"],
    [
      "补给齐备，扬帆出港",
      "航路面板会列出航时、风险与补给消耗。准备好就启航。",
      "route",
    ],
    ["随海风前行", "船队正在自动航行。可提高倍率，也可以暂时停下来。", "route"],
    [
      "把货物换成第一笔收入",
      "抵达新港口了。打开市场，出售运来的货物。",
      "market",
    ],
  ];
  if (tutorial < 5) {
    const t = tasks[tutorial];
    $("#guide").innerHTML =
      `<div class="guide-top"><span class="eyebrow">初航指引 · ${tutorial + 1} / 5</span><button id="skipGuide" title="隐藏新手指引">×</button></div><strong>${t[0]}</strong><p>${t[1]}</p><button data-panel="${t[2]}" class="guide-link">${tutorial === 3 ? "查看航程" : "前往"} ${icon("arrow")}</button>`;
  } else if (!growthHidden) {
    const next = eras[s.eraIndex + 1];
    let goal = {
      title: "扩大家族商网",
      copy: `已经到访 ${s.visited.length} / ${sim.availablePorts().length} 座港口。寻找下一座城市的独特物产。`,
      panel: "route",
      current: s.visited.length,
      target: sim.availablePorts().length,
      reward: "发现新市场与贸易机会",
    };
    if (next)
      goal = {
        title: `迈向${next.title}`,
        copy: "稳步积累可兑现资产，为下一代商人打开新的商路。",
        panel: "history",
        current: sim.assets(),
        target: next.threshold,
        reward: `${ports.filter((p) => p.era === s.eraIndex + 1).length} 座新港口 · ${goods.filter((g) => g.era === s.eraIndex + 1).length} 种新货物`,
      };
    if (s.ship.level === 1 && !(next && sim.assets() >= next.threshold))
      goal = {
        title: "给第一艘商船扩舱",
        copy: "保留远航周转金后，在船坞升级。每次能多带一批货。",
        panel: "fleet",
        current: s.cash,
        target: sim.upgradeCost(),
        reward: `货舱 +${10 * s.fleetSize} · 船速与耐久提升`,
      };
    const homeCity = sim
      .dominion()
      .cities()
      .find((c) => c.id === s.currentPortId);
    if (!Object.keys(s.dominion.owned).length && homeCity)
      goal = {
        title: "建立第一座商贸城邦",
        copy: `积累现银，在${sim.port().name}取得经营权，组织商队前往内陆。`,
        panel: "guild",
        current: s.cash,
        target: homeCity.price,
        reward: "每日城市收入 · 陆路探索 · 城市建设",
      };
    else if (
      Object.keys(s.dominion.owned).length &&
      !s.dominion.discovered.length
    )
      goal = {
        title: "让第一支商队走向内陆",
        copy: "查看已拥有城市的陆路，备好货物与护送费，等待商队归来发现新市场。",
        panel: "guild",
        current: s.dominion.activeCaravans.length,
        target: 1,
        reward: "发现内陆城市 · 延伸城邦商网",
      };
    if (s.supplies < 12 * s.fleetSize)
      goal = {
        title: "为下一趟补足物资",
        copy: "食物与淡水不多了。先补给，再规划远方的生意。",
        panel: "fleet",
        current: s.supplies,
        target: 100 * s.fleetSize,
        reward: "备足补给，减少航程中断",
      };
    if (s.ship.hull < s.ship.maxHull * 0.25)
      goal = {
        title: "先修复受损的船体",
        copy: `本次维修需要 ${money(sim.repairCost())} 金币。把商船修好，再继续远航。`,
        panel: "fleet",
        current: s.cash,
        target: sim.repairCost(),
        reward: "恢复船体耐久",
      };
    $("#guide").innerHTML =
      `<div class="guide-top"><span class="eyebrow">下一步 · 家族成长</span><button id="hideGrowth" title="隐藏成长目标">×</button></div><strong>${goal.title}</strong><p>${goal.copy}</p><div class="goal-progress"><span>${money(goal.current)} / ${money(goal.target)}</span><div class="progress"><i style="width:${Math.min(100, (goal.current / Math.max(1, goal.target)) * 100)}%"></i></div><small>${goal.reward}</small></div><button data-panel="${goal.panel}" class="guide-link">查看目标 ${icon("arrow")}</button>`;
  }
  $("#voyageBar").hidden = !traveling();
  if (s.voyage) {
    const v = s.voyage;
    $("#voyageBar").innerHTML =
      `${icon("ship")}<div><strong>驶向 ${sim.port(s.destinationId!).name}</strong><small>航程 ${v.elapsedDays} / ${v.totalDays} 日</small><div class="progress"><i style="width:${(v.elapsedDays / v.totalDays) * 100}%"></i></div></div>`;
  }
  renderNavigationHud();
  renderNews();
}
function render(): void {
  renderHud();
  if (panel) renderPanel();
  world.updateState(sim.state);
  syncWorld();
}
const metric = (label: string, value: string) =>
  `<div><small>${label}</small><strong>${value}</strong></div>`;
const intro = (title: string, copy: string) =>
  `<div class="panel-intro"><h3>${title}</h3><p>${copy}</p></div>`;
const signedMoney = (value: number) =>
  `${value >= 0 ? "+" : "−"}${preciseMoney(Math.abs(value))}`;
function tradeReceipt(): string {
  const t = sim.state.lastTrade;
  if (!tradeReceiptVisible || !t) return "";
  const good = goods.find((g) => g.id === t.goodId)!;
  return `<section class="trade-receipt" aria-label="最近成交"><div><span>${t.side === "buy" ? "已购入" : "已售出"} ${t.quantity} ${good.unit}${good.name}</span><button id="dismissReceipt" aria-label="收起成交凭单">×</button></div><strong>${t.side === "buy" ? "支付" : "收入"} ${money(t.total)} 金币</strong>${t.side === "sell" ? `<p>货物差额 <b class="${t.tradingProfit! >= 0 ? "positive" : "negative"}">${signedMoney(t.tradingProfit!)} 金币</b> · 未扣航行开支${t.costBasisEstimated ? "；成本含参考估值" : ""}</p><button class="quiet-button" id="openAccounts">查看航程账册 ${icon("arrow")}</button>` : `<p>平均成交价 ${preciseMoney(t.total / t.quantity)} 金币／${good.unit} · 已计入持仓成本</p>`}</section>`;
}
function marketRow(g: (typeof goods)[number]): string {
  const s = sim.state,
    held = s.cargo[g.id],
    stock = sim.marketStock(s.currentPortId, g.id);
  const buy = sim.quote(g.id, quantity, "buy"),
    sale = sim.salePreview(g.id, quantity);
  const local = sim.port().produces.includes(g.id),
    demand = sim.port().demands.includes(g.id);
  const buyReason = traveling()
    ? "抵港后交易"
    : !stock
      ? "暂时缺货"
      : sim.cargoCount() >= sim.capacity()
        ? "货舱已满"
        : "金币不足";
  return `<article class="market-product" data-good="${g.id}"><div class="market-product-main"><div class="product-identity"><span class="good-icon" style="--good:${g.color}">${g.icon}</span><div><strong>${g.name}</strong><small>${local ? "本地特产" : demand ? "当地紧缺" : "常规货物"}</small></div></div><div class="unit-price" data-unit-buy="${g.id}" aria-label="${g.name}买入单价"><b>${money(sim.buyPrice(s.currentPortId, g.id))}</b><small>金币／${g.unit}</small></div><div class="unit-price sell-price" data-unit-sell="${g.id}" aria-label="${g.name}卖出单价"><b>${money(sim.sellPrice(s.currentPortId, g.id))}</b><small>金币／${g.unit}</small></div></div><div class="product-stock"><span>随船 ${held} ${g.unit} · 市场 ${stock} ${g.unit}</span>${held ? `<span>持仓${s.cargoCostEstimated[g.id] ? "参考" : "均"}价 ${preciseMoney(sim.cargoUnitCost(g.id))}／${g.unit}</span>` : ""}</div><div class="product-actions"><button data-buy="${g.id}" ${traveling() || !buy.quantity ? "disabled" : ""}><span>${traveling() || !buy.quantity ? buyReason : `买入 ${buy.quantity} ${g.unit}`}</span><small>${buy.quantity && !traveling() ? `支付 ${money(buy.total)} 金币` : "—"}</small></button><button data-sell="${g.id}" ${traveling() || !sale.quantity ? "disabled" : ""}><span>${traveling() ? "抵港后交易" : !sale.quantity ? "未持有" : `卖出 ${sale.quantity} ${g.unit}`}</span><small>${sale.quantity && !traveling() ? `收入 ${money(sale.revenue)} 金币` : "—"}</small></button></div>${sale.quantity ? `<div class="sale-estimate">本次货物差额 <b class="${sale.tradingProfit >= 0 ? "positive" : "negative"}">${signedMoney(sale.tradingProfit)} 金币</b><span>${sale.costBasisEstimated ? "含参考成本 · " : ""}未扣航行开支</span></div>` : ""}${buy.quantity > 0 && buy.quantity < quantity ? `<p class="quantity-limit">受金币、库存或货舱限制，本次可买 ${buy.quantity} ${g.unit}。</p>` : ""}</article>`;
}
function accountSummary(): string {
  const ledger = sim.state.tradeLedger,
    voyage = sim.voyageExpenseReport();
  return `<section class="account-summary"><span class="eyebrow">自第 ${ledger.sinceDay} 日开始记账</span><div class="account-row"><span>销售收入</span><b>${preciseMoney(ledger.revenue)} 金币</b></div><div class="account-row"><span>已售货物成本</span><b>−${preciseMoney(ledger.costBasis)} 金币</b></div><div class="account-row account-total"><span>累计货物差额</span><b class="${ledger.realizedTradingProfit >= 0 ? "positive" : "negative"}">${signedMoney(ledger.realizedTradingProfit)} 金币</b></div><p class="footnote">差额未扣航行、维修等开支。${ledger.costBasisEstimated ? "包含开局或旧货的参考成本。" : "按实际采购成本结转。"}</p>${voyage ? `<details class="voyage-expenses"><summary>${voyage.endedDay === null ? "当前" : "最近"}航程已记录支出 · ${preciseMoney(voyage.totalRecordedCost)} 金币</summary><p>${escape(sim.port(voyage.fromId).name)} → ${escape(sim.port(voyage.toId).name)}${voyage.partial ? " · 仅记录旧档恢复后的部分费用" : ""}</p><div class="account-row"><span>船员工资与转运</span><b>${preciseMoney(voyage.wages + voyage.transfer)}</b></div><div class="account-row"><span>已消耗 ${voyage.suppliesUsed} 份补给</span><b>${preciseMoney(voyage.suppliesCost)}</b></div><div class="account-row"><span>赎金</span><b>${preciseMoney(voyage.ransom)}</b></div><div class="account-row"><span>损失货物成本${voyage.costBasisEstimated ? "（含参考值）" : ""}</span><b>${preciseMoney(voyage.cargoLossCost)}</b></div><p class="footnote">补给按实际消耗记账。未含维修、升级与折旧；此处为一段航程开支，不能直接从累计差额扣减为家族总利润。</p></details>` : ""}</section>`;
}
function unlockPreview(index: number): string {
  const newPorts = ports.filter((p) => p.era === index),
    newGoods = goods.filter((g) => g.era === index);
  return `<div class="unlock-preview"><span>下一纪元的新机会</span><p><b>${newPorts.length} 座港口</b>${newPorts
    .slice(0, 5)
    .map((p) => p.name)
    .join("、")}等</p><p><b>${newGoods.length} 种货物</b>${newGoods
    .slice(0, 5)
    .map((g) => g.name)
    .join(
      "、",
    )}等</p><p><b>船型</b>${eras[index].shipName}</p><button data-panel="catalog" class="quiet-button">浏览世界物产图鉴 →</button></div>`;
}
function searchTools(
  kind: "market" | "route",
  value: string,
  selectedCategory: string,
  categories: string[],
): string {
  return `<div class="catalog-search"><input id="${kind}Search" type="search" maxlength="60" value="${escape(value)}" placeholder="${kind === "market" ? "搜索商品、产地" : "搜索港口、地区"}" aria-label="${kind === "market" ? "搜索商品" : "搜索港口"}"><select id="${kind}Category" aria-label="筛选${kind === "market" ? "商品类别" : "地区"}"><option value="">全部${kind === "market" ? "类别" : "地区"}</option>${categories.map((c) => `<option value="${escape(c)}" ${selectedCategory === c ? "selected" : ""}>${escape(c)}</option>`).join("")}</select></div>`;
}
function pagination(
  kind: string,
  page: number,
  total: number,
  size = 12,
): string {
  return `<div class="pagination"><button data-page-kind="${kind}" data-page="${page - 1}" ${page === 0 ? "disabled" : ""}>上一页</button><span>${page + 1} / ${Math.max(1, Math.ceil(total / size))} · ${total} 项</span><button data-page-kind="${kind}" data-page="${page + 1}" ${(page + 1) * size >= total ? "disabled" : ""}>下一页</button></div>`;
}
function renderPanel(): void {
  const s = sim.state,
    body = $("#drawerBody"),
    atSea = traveling();
  if (panel === "market") {
    const shelf = sim.marketGoods();
    const categories = [...new Set(shelf.map((g) => g.category || "基础物资"))];
    const filtered = shelf.filter(
      (g) =>
        (marketFilter === "held"
          ? s.cargo[g.id] > 0
          : marketFilter === "local"
            ? sim.port().produces.includes(g.id)
            : true) &&
        (!marketCategory || (g.category || "基础物资") === marketCategory) &&
        `${g.name} ${g.description || ""} ${g.originRegions?.join(" ") || ""}`.includes(
          marketSearch.trim(),
        ),
    );
    marketPage = Math.min(
      marketPage,
      Math.max(0, Math.ceil(filtered.length / 12) - 1),
    );
    body.innerHTML =
      intro(
        sim.port().name,
        atSea
          ? "船队正在海上。抵港后才能进行交易。"
          : "看单价、选数量，再决定成交。到不同城市出售，价差要能覆盖航程开支。",
      ) +
      `<div class="panel-metrics">${metric("现银 · 金币", money(s.cash))}${metric("货舱", `${sim.cargoCount()} / ${sim.capacity()}`)}</div>${tradeReceipt()}<div class="section-heading"><h3>每次最多交易</h3><div class="segmented">${[1, 5, 10, 10000].map((n) => `<button data-quantity="${n}" class="${quantity === n ? "active" : ""}" aria-pressed="${quantity === n}">${n === 10000 ? "最大" : n}</button>`).join("")}</div></div><div class="market-filters" aria-label="筛选货物">${[
        ["all", "全部货物"],
        ["held", "随船货物"],
        ["local", "本地特产"],
      ]
        .map(
          ([id, label]) =>
            `<button data-market-filter="${id}" class="${marketFilter === id ? "active" : ""}" aria-pressed="${marketFilter === id}">${label}</button>`,
        )
        .join(
          "",
        )} </div>${searchTools("market", marketSearch, marketCategory, categories)}<div class="price-table-heading"><span>商品</span><span>买入单价</span><span>卖出单价</span></div><div class="market-list">${
        filtered
          .slice(marketPage * 12, marketPage * 12 + 12)
          .map((g) => marketRow(g))
          .join("") ||
        '<p class="empty-note">没有符合条件的货物，换一个名称或类别试试。</p>'
      }${pagination("market", marketPage, filtered.length)}<button data-panel="catalog" class="quiet-button">查看 ${goods.length} 种世界物产 →</button></div><p class="footnote">单价是下一单位的报价，已计入港税与交易差价。大批成交会改变库存，按钮总额按每一单位的价格计算。开局赠货与旧存档货物按标准参考价记成本。</p><button class="primary full" data-panel="route">比较航路与目的港 ${icon("arrow")}</button>`;
  } else if (panel === "route") {
    const available = sim.availablePorts();
    const filtered = available
      .filter(
        (p) =>
          (atSea || p.id !== s.currentPortId) &&
          (!routeRegion || p.region === routeRegion) &&
          matchesCity(p, routeSearch),
      )
      .sort(
        (a, b) =>
          distanceDegrees(s.navigation.position, portPoint(a)) -
          distanceDegrees(s.navigation.position, portPoint(b)),
      );
    routePage = Math.min(
      routePage,
      Math.max(0, Math.ceil(filtered.length / 12) - 1),
    );
    body.innerHTML =
      intro(
        atSea ? "风向变了，也可以换一个目的地。" : "从近岸出发，逐步打开世界。",
        "先看邻港与需求，再决定航路。途中可手动改航，接近城市后停靠。",
      ) +
      `<button id="openOcean" class="secondary full">在 2.5D 世界海图中规划 ${icon("compass")}</button>` +
      atlasMarkup(available, s.currentPortId, selected || null) +
      searchTools("route", routeSearch, routeRegion, [
        ...new Set(available.map((p) => p.region)),
      ]) +
      `<p class="footnote">${available.length} 座港口已开放 · 按距船队远近排列。选择后计算绕过大陆的实际海路。</p><div id="routeDetail"></div><div class="route-list">${filtered
        .slice(routePage * 12, routePage * 12 + 12)
        .map(
          (p, i) =>
            `<button data-destination="${p.id}" class="route-item ${selected === p.id ? "selected" : ""}"><span class="route-order">${String(routePage * 12 + i + 1).padStart(2, "0")}</span><span><strong>${p.name}</strong><small>${p.region} · ${p.specialty || p.polity}</small></span><span class="tag">${s.visited.includes(p.id) ? "已到访" : s.navigation.discovered.includes(p.id) ? "已发现" : "未探索"}</span></button>`,
        )
        .join("")}</div>${pagination("route", routePage, filtered.length)}`;
    if (selected && available.some((p) => p.id === selected)) {
      const p = sim.port(selected),
        v = sim.voyage(selected, true);
      const nearby = atSea && sim.nearbyPorts().some((p) => p.id === selected);
      const prepay = v.wages;
      const ready =
        v.reachable &&
        (atSea ||
          (s.supplies >= v.supplies &&
            s.cash >= prepay &&
            s.ship.hull >= s.ship.maxHull * 0.2));
      const market = sim
        .marketGoods(p.id)
        .slice()
        .sort((a, b) => Number(s.cargo[b.id] > 0) - Number(s.cargo[a.id] > 0))
        .slice(0, 6);
      $("#routeDetail").innerHTML =
        `<div class="route-detail"><span class="eyebrow">${nearby ? "已进入引航水域" : "已选择目的港"}</span><h3>${p.name}</h3><p>${p.polity} · ${p.climate || p.region} · ${p.specialty || "沿岸贸易"}</p><div class="panel-metrics">${metric("海路约需", v.reachable ? v.days + " 日" : "暂无航路")}${metric("基础风险", Math.round(v.risk * 100) + "%")}${metric("补给预计", v.reachable ? v.supplies + " 份" : "—")}</div><label class="field-label" for="strategy">遇险预案</label><select id="strategy">${[
          ["avoid", "谨慎绕行"],
          ["ransom", "缴纳赎金"],
          ["flee", "全力逃离"],
          ["defend", "自卫反击"],
        ]
          .map(
            ([value, label]) =>
              `<option value="${value}" ${s.strategy === value ? "selected" : ""}>${label}</option>`,
          )
          .join(
            "",
          )}</select><details class="port-prices"><summary>今日市场报价 · 优先展示随船货物</summary><div class="cargo-row"><span>商品</span><small>买入 / 卖出单价</small></div>${market.map((g) => `<div class="cargo-row"><span>${g.name}</span><b>${sim.buyPrice(p.id, g.id)} / ${sim.sellPrice(p.id, g.id)}<small> 金币／${g.unit}</small></b></div>`).join("")}</details>${s.marketEvents
          .filter((e) => e.portIds.includes(p.id) && e.endDay > s.day)
          .slice(-1)
          .map((e) => newsCard(e, true))
          .join(
            "",
          )}<p class="footnote">按海岸航路估算；风暴、绕航与手动操舵会延长航程。不同地区之间需绕过大陆，补给不足时请分段靠港。</p>${nearby ? `<button data-dock="${p.id}" class="primary full">现在停靠 ${p.name}</button>` : ""}<button id="sail" class="primary full" ${ready ? "" : "disabled"}>${atSea ? "改航前往" : "启航前往"} ${p.name} ${icon("arrow")}</button>${!atSea ? `<div class="departure-check ${ready ? "ready" : "not-ready"}"><strong>${ready ? "已具备启航条件" : "启航前还需准备"}</strong><p>补给 ${Math.floor(s.supplies)} / ${v.supplies} 份 · 预付工资 ${prepay} 金币</p>${!ready ? `<button class="quiet-button" data-panel="fleet">补给与维修 →</button>` : ""}</div>` : `<p class="footnote">已付的工资仍然有效，绕航超过预付日数后按日补发。</p>`}</div>`;
    }
  } else if (panel === "fleet") {
    body.innerHTML =
      intro(s.ship.name, "货舱、船速与补给共同决定一趟生意能走多远。") +
      `<div class="ship-portrait">${icon("ship")}<div><span class="eyebrow">商贸船队</span><h3>等级 ${s.ship.level}</h3><p>${s.fleetSize} / 5 艘 · 共同分担运力</p></div></div><div class="panel-metrics">${metric("装载", sim.cargoCount() + " / " + sim.capacity())}${metric("船体", Math.round((s.ship.hull / s.ship.maxHull) * 100) + "%")}${metric("补给", s.supplies + " 份")}</div><div class="progress"><i style="width:${(s.ship.hull / s.ship.maxHull) * 100}%"></i></div><div class="service-list">${[
        [
          "resupply",
          "supply",
          "补满食物与淡水",
          "远航前备足物资",
          sim.resupplyCost(),
        ],
        [
          "repair",
          "anchor",
          "维修船体",
          "在港口船坞恢复耐久",
          sim.repairCost(),
        ],
        [
          "upgrade",
          "ship",
          "升级商船",
          "提升货舱、耐久与船速",
          sim.upgradeCost(),
        ],
        [
          "buyShip",
          "ship",
          "购置同行商船",
          "扩充船队，最多 5 艘",
          sim.shipCost(),
        ],
      ]
        .map(
          ([id, i, title, desc, cost]) =>
            `<button id="${id}" ${atSea || (id === "buyShip" && s.fleetSize >= 5) ? "disabled" : ""}>${icon(String(i))}<span>${title}<small>${desc}</small></span><b>${money(Number(cost))}</b></button>`,
        )
        .join("")}</div><div class="section-heading"><h3>随船货物</h3></div>${
        goods
          .filter((g) => s.cargo[g.id] > 0)
          .map(
            (g) =>
              `<div class="cargo-row"><span>${g.name}</span><b>${s.cargo[g.id]} ${g.unit}</b></div>`,
          )
          .join("") ||
        '<p class="empty-note">货舱还空着，前往市场挑选第一批货物。</p>'
      }`;
  } else if (panel === "history") {
    const next = eras[s.eraIndex + 1];
    body.innerHTML =
      intro(
        "一代人的航程，一个家族的历史。",
        "游戏日自动流动；历史纪元由家族资产推动，在港口开启下一篇章。",
      ) +
      `<button data-panel="life" class="secondary full">港口生活、科技研究与收藏 →</button><div class="panel-metrics">${metric("可兑现资产", money(sim.assets()))}${metric("当前纪元", `${s.eraIndex + 1} / ${eras.length}`)}</div>${next ? `<div class="era-unlock"><span>下一纪元 · ${next.title}</span><b>${money(sim.assets())} / ${money(next.threshold)}</b><div class="progress"><i style="width:${Math.min(100, (sim.assets() / next.threshold) * 100)}%"></i></div><button id="advanceEra" class="primary full" ${atSea || sim.assets() < next.threshold ? "disabled" : ""}>开启下一纪元 ${icon("arrow")}</button></div>` : `<p class="empty-note">家族已驶入近代早期。完成最终资产目标后解锁无尽沙盒。</p><button id="sandbox" class="primary full">进入无尽沙盒 ${icon("arrow")}</button>`}<div class="timeline">${eras.map((e, i) => `<article class="era-entry ${i === s.eraIndex ? "current" : ""} ${i > s.eraIndex ? "locked" : ""}"><span>${String(i + 1).padStart(2, "0")}</span><div><small>${e.years}</small><h3>${e.title}</h3><p>${e.subtitle}</p><small>${e.tech}</small></div></article>`).join("")}</div><p class="footnote">纪元更替以商贸家族传承解释，不将数千年的经营视作同一人物的一生。</p>`;
    if (next)
      body
        .querySelector(".era-unlock .progress")
        ?.insertAdjacentHTML("afterend", unlockPreview(s.eraIndex + 1));
  } else if (panel === "catalog") {
    const matches = goods.filter((g) =>
      `${g.name} ${g.category || ""} ${g.description || ""} ${(g.originRegions || []).join(" ")}`.includes(
        catalogSearch.trim(),
      ),
    );
    catalogPage = Math.min(
      catalogPage,
      Math.max(0, Math.ceil(matches.length / 12) - 1),
    );
    body.innerHTML =
      intro(
        "世界各有物产，商路连接远方。",
        `${ports.length} 座港口 · ${goods.length} 种货物。各港按物产经营少量货架，外来货物可随船运入出售。`,
      ) +
      `<div class="catalog-search"><input type="search" id="catalogSearch" maxlength="60" aria-label="搜索物产图鉴" placeholder="搜索名称、产地或工艺" value="${escape(catalogSearch)}"><button data-panel="market" class="secondary">返回市场</button></div>${
        matches
          .slice(catalogPage * 12, catalogPage * 12 + 12)
          .map((g) => {
            const sources = ports.filter((p) => p.produces.includes(g.id));
            return `<article class="life-card"><span class="eyebrow">${g.category || "基础物资"} · ${g.era <= s.eraIndex || s.sandbox ? "当前纪元可交易" : "于" + eras[g.era].title + "开放"}</span><h3>${g.icon} ${g.name}</h3><p>${g.description || "沿历史商路流通的基础物资。"}</p><p>标准参考价 ${g.base} 金币／${g.unit}，成交价格随港口供需变化。</p><div class="card-actions">${sources
              .slice(0, 3)
              .map(
                (p) =>
                  `<button data-news-port="${p.id}" class="quiet-button" ${p.era > s.eraIndex && !s.sandbox ? "disabled" : ""}>${p.name} →</button>`,
              )
              .join("")}</div></article>`;
          })
          .join("") || '<p class="empty-note">没有找到这类物产。</p>'
      }${pagination("catalog", catalogPage, matches.length)}<p class="footnote">年代为玩法开放窗口；材料、工艺与产地经过简化，并非每个品种的严格历史断代。</p>`;
  } else if (panel === "life") {
    body.innerHTML = lifeMarkup(sim, lifeTab);
  } else if (panel === "guild") {
    body.innerHTML = dominionMarkup(
      sim,
      dominionTab,
      cityPage,
      cityFocus || s.currentPortId,
      citySearch,
      cityScope,
    );
  } else if (panel === "journal") {
    body.innerHTML =
      intro(
        journalTab === "news"
          ? "风声入耳，生意在心。"
          : "每一笔生意，都有来路。",
        journalTab === "news"
          ? "来信记录各港见闻。留意地点、货源和消息的新旧，再结合航程作判断。"
          : "交易、海上事件与家族里程碑会留在这里。",
      ) +
      `<div class="journal-tabs" aria-label="日志分类"><button data-journal="news" class="${journalTab === "news" ? "active" : ""}" aria-pressed="${journalTab === "news"}">远港商情 <small>${s.marketEvents.length}</small></button><button data-journal="voyages" class="${journalTab === "voyages" ? "active" : ""}" aria-pressed="${journalTab === "voyages"}">航程账册</button></div>` +
      (journalTab === "news"
        ? `<div class="intelligence-list">${
            s.marketEvents
              .slice()
              .reverse()
              .map((e) => newsCard(e))
              .join("") ||
            '<p class="empty-note">还没有远港来信。让时间流动，新的商情会随商船传来。</p>'
          }</div><p class="footnote">消息留存最近 32 条。远方市价会随日变化，见闻不保证获利。</p>`
        : `${accountSummary()}<div class="log-list">${
            s.logs
              .slice()
              .reverse()
              .map(
                (log) =>
                  `<article><span class="log-dot"></span><p>${escape(log)}</p></article>`,
              )
              .join("") || `<article><p>${escape(s.lastEvent)}</p></article>`
          }</div>`);
  } else if (panel === "settings") {
    body.innerHTML =
      intro("按照自己的节奏航行。", "连续 2.5D 世界 · 自动时间 · 本地存档") +
      `<div class="section-heading"><h3>时间与镜头</h3></div><p class="setting-copy">1×：20 秒 / 游戏日；2×：10 秒；4×：5 秒。经营抽屉打开时暂停，切到后台也会暂停。</p><div class="service-list"><button id="resetCamera">${icon("compass")}<span>回到船队位置<small>恢复斜俯视视角与缩放</small></span></button><button id="toggleQuality">${icon("sun")}<span>画质：${lowQuality ? "省电" : "标准"}<small>调整阴影与渲染分辨率</small></span></button></div><div class="section-heading"><h3>本地航程</h3><span class="tag">自动保存</span></div><div class="save-grid">${[
        ["save", "保存航程"],
        ["load", "读取航程"],
        ["export", "导出存档"],
        ["import", "导入存档"],
        ["backup", "恢复上一备份"],
        ["guideAgain", "重新查看引导"],
      ]
        .map(([id, t]) => `<button id="${id}" class="secondary">${t}</button>`)
        .join(
          "",
        )}</div><p class="footnote">存档保存在本机浏览器。可导出 JSON 在另一设备导入，云同步尚未接入。</p><div class="section-heading"><h3>世界与技术</h3></div><p class="setting-copy">${eras.length} 个纪元 · ${ports.length} 座港口 + ${inlandCities.length} 座内陆城市 · ${goods.length} 种贸易货物<br>渲染：${rendererKind} · Three.js<br>商情与事件采用本地规则，不调用在线 AI。</p><button id="newGame" class="quiet-button full">返回出生地选择</button>`;
  }
}
async function restore(serialized: string | null): Promise<void> {
  if (!serialized) {
    notice("没有找到可读取的航程");
    return;
  }
  if (!sim.import(serialized)) {
    notice("存档内容无效，当前航程未改变");
    return;
  }
  tutorial = 5;
  try {
    const n = Number(localStorage.getItem("remote-trade-tutorial") ?? 5);
    if (Number.isInteger(n) && n >= 0 && n <= 5) tutorial = n;
  } catch {}
  selected = "";
  resetNews();
  dayFraction = 0;
  gameClock.reset();
  $("#welcome").hidden = true;
  closePanel();
  render();
  world.focusAt(sim.state.navigation.position, traveling() ? 7 : 12, true);
  notice("已恢复家族航程");
}
document.addEventListener("click", async (e) => {
  const target = (e.target as Element).closest<HTMLElement>(
    "button,[data-atlas]",
  );
  if (!target || (target as HTMLButtonElement).disabled) return;
  if (target.dataset.dominionTab) {
    dominionTab = target.dataset.dominionTab as DominionTab;
    renderPanel();
    return;
  }
  if (target.dataset.cityPage) {
    cityPage = Number(target.dataset.cityPage);
    renderPanel();
    return;
  }
  if (target.dataset.cityScope) {
    cityScope = target.dataset.cityScope as typeof cityScope;
    cityPage = 0;
    renderPanel();
    return;
  }
  if (target.dataset.cityFocus) {
    const id = target.dataset.cityFocus;
    const inland = inlandCities.find((c) => c.id === id),
      port = ports.find((p) => p.id === id);
    if (inland || port) {
      cityFocus = id;
      closePanel();
      world.focusAt(inland ?? portPoint(port!), 16);
    }
    return;
  }
  if (target.dataset.cityAction) {
    const realm = sim.dominion(),
      id = target.dataset.cityId!;
    const outcome =
      target.dataset.cityAction === "purchase"
        ? realm.purchase(id)
        : target.dataset.cityAction === "develop"
          ? realm.develop(
              id,
              target.dataset.cityKind as "commerce" | "food" | "defense",
            )
          : target.dataset.cityAction === "caravan"
            ? realm.sendCaravan(id)
            : target.dataset.cityAction === "recruit"
              ? realm.recruit(Number(id))
              : target.dataset.cityAction === "disband"
                ? realm.disband(Number(id))
                : realm.attack(id);
    sim.state.lastEvent = outcome.message;
    if (outcome.ok) {
      sim.state.logs.push(`第 ${sim.state.day} 日 · ${outcome.message}`);
      sim.state.logs = sim.state.logs.slice(-100);
      void persist();
    }
    render();
    notice(outcome.message);
    return;
  }
  if (target.dataset.lifeTab) {
    lifeTab = target.dataset.lifeTab as LifeTab;
    renderPanel();
    return;
  }
  if (target.dataset.lifeAction) {
    const life = sim.life(),
      id = target.dataset.lifeId!;
    const outcome =
      target.dataset.lifeAction === "talk"
        ? life.talk(id)
        : target.dataset.lifeAction === "accept"
          ? life.acceptCommission(id)
          : target.dataset.lifeAction === "deliver"
            ? life.deliverCommission(id)
            : target.dataset.lifeAction === "research"
              ? life.research(id)
              : target.dataset.lifeAction === "build"
                ? life.build(id)
                : life.contributeBundle(id);
    sim.state.lastEvent = outcome.message;
    render();
    if (outcome.ok) void persist();
    notice(outcome.message);
    return;
  }
  if (target.dataset.pageKind) {
    if (target.dataset.pageKind === "market")
      marketPage = Number(target.dataset.page);
    else if (target.dataset.pageKind === "catalog")
      catalogPage = Number(target.dataset.page);
    else routePage = Number(target.dataset.page);
    renderPanel();
    return;
  }
  if (target.dataset.oceanPort) {
    const id = target.dataset.oceanPort;
    if (inlandCities.some((c) => c.id === id)) {
      cityFocus = id;
      cityPage = 0;
      citySearch = "";
      cityScope = "all";
      dominionTab = "cities";
      showPanel("guild");
      return;
    }
    if (id === sim.state.currentPortId && !traveling()) {
      syncWorld();
      world.focusAt(sim.state.navigation.position, 12, true);
      showPanel("market");
    } else {
      selected = id;
      showPanel("route");
    }
    return;
  }
  if (target.dataset.dock) {
    if (sim.dockAt(target.dataset.dock)) {
      closePanel();
      handleArrival();
    } else notice(sim.state.lastEvent);
    return;
  }
  if (target.dataset.marketFilter) {
    marketFilter = target.dataset.marketFilter as typeof marketFilter;
    marketPage = 0;
    renderPanel();
    return;
  }
  if (target.dataset.journal) {
    journalTab = target.dataset.journal === "voyages" ? "voyages" : "news";
    renderPanel();
    return;
  }
  if (target.dataset.newsPort) {
    selected =
      target.dataset.newsPort === sim.state.currentPortId
        ? ""
        : target.dataset.newsPort;
    showPanel(selected ? "route" : "market");
    return;
  }
  if (target.dataset.panel) {
    const next = target.dataset.panel as Panel;
    if (panel === next) closePanel();
    else showPanel(next);
    return;
  }
  if (target.dataset.origin) {
    selectedOrigin = target.dataset.origin;
    renderOrigins();
    return;
  }
  if (target.dataset.quantity) {
    quantity = Number(target.dataset.quantity);
    renderPanel();
    return;
  }
  if (target.dataset.speed) {
    speed = Number(target.dataset.speed);
    paused = false;
    renderHud();
    return;
  }
  if (target.dataset.destination || target.dataset.atlas) {
    const id = target.dataset.destination || target.dataset.atlas!;
    if (id === sim.state.currentPortId && !traveling()) return;
    selected = id;
    if (tutorial === 1) tutorial = 2;
    rememberTutorial();
    renderPanel();
    renderHud();
    $("#routeDetail")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return;
  }
  if (target.dataset.buy) {
    if (sim.buy(target.dataset.buy, quantity)) {
      if (tutorial === 0) tutorial = 1;
      tradeReceiptVisible = true;
    }
    rememberTutorial();
    render();
    void persist();
    notice(sim.state.lastEvent);
    return;
  }
  if (target.dataset.sell) {
    if (sim.sell(target.dataset.sell, quantity)) {
      if (tutorial === 4) tutorial = 5;
      tradeReceiptVisible = true;
      growthHidden = false;
    }
    rememberTutorial();
    render();
    void persist();
    notice(sim.state.lastEvent);
    return;
  }
  try {
    switch (target.id) {
      case "startGame":
        sim.start(origins.find((o) => o.id === selectedOrigin)!);
        resetNews();
        marketFilter = "all";
        tradeReceiptVisible = false;
        growthHidden = false;
        paused = false;
        speed = 1;
        tutorial = 0;
        rememberTutorial();
        dayFraction = 0;
        gameClock.reset();
        selected = "";
        $("#welcome").hidden = true;
        closePanel();
        render();
        world.focusAt(sim.state.navigation.position, 12, true);
        void persist();
        notice("家族已建立。点击港口市场，开始第一笔生意。");
        break;
      case "continueGame":
        await restore(await loadGame());
        break;
      case "closeDrawer":
        closePanel();
        break;
      case "readNews":
        journalTab = "news";
        showPanel("journal");
        break;
      case "dismissNews":
        hideNews();
        break;
      case "dismissReceipt":
        tradeReceiptVisible = false;
        renderPanel();
        break;
      case "openAccounts":
        journalTab = "voyages";
        showPanel("journal");
        break;
      case "hideGrowth":
        growthHidden = true;
        renderHud();
        break;
      case "pause":
        paused = !paused;
        renderHud();
        break;
      case "zoomIn":
        world.zoom(1.15);
        break;
      case "zoomOut":
        world.zoom(1 / 1.15);
        break;
      case "recenter":
        if (world.isOceanView()) world.followShip();
        else world.resetCamera();
        break;
      case "resetCamera":
        if (world.isOceanView())
          world.focusAt(
            sim.state.navigation.position,
            traveling() ? 7 : 12,
            true,
          );
        else world.resetCamera();
        break;
      case "skipGuide":
        tutorial = 5;
        rememberTutorial();
        renderHud();
        break;
      case "openOcean":
        closePanel();
        syncWorld();
        world.focusWorld();
        renderHud();
        break;
      case "toggleMap":
        if (world.getMapView().following && world.getZoom() > 4)
          world.focusWorld();
        else
          world.focusAt(
            sim.state.navigation.position,
            world.getZoom() > 4 ? world.getZoom() : traveling() ? 7 : 12,
            true,
          );
        renderHud();
        break;
      case "followShip":
        world.followShip();
        break;
      case "toggleHelm":
        action(() => sim.setManual(!sim.state.navigation.manual));
        break;
      case "sail": {
        const departing = !traveling();
        if (traveling() ? sim.redirect(selected) : sim.sail(selected)) {
          tradeReceiptVisible = false;
          marketFilter = "all";
          if (tutorial < 3) tutorial = 3;
          rememberTutorial();
          world.followShip();
          world.focusAt(sim.state.navigation.position, 7, true);
          if (departing) {
            gameClock.reset();
            dayFraction = 0;
          }
          selected = "";
          closePanel();
          render();
          void persist();
          notice(sim.state.lastEvent);
        } else notice(sim.state.lastEvent);
        break;
      }
      case "repair":
        action(() => sim.repair());
        break;
      case "upgrade":
        action(() => sim.upgrade());
        break;
      case "resupply":
        action(() => sim.resupply());
        break;
      case "buyShip":
        action(() => sim.buyShip());
        break;
      case "invest":
        action(() => sim.invest());
        break;
      case "advanceEra":
        action(() => sim.advanceEra());
        break;
      case "sandbox":
        action(() => sim.startSandbox());
        break;
      case "sellAll": {
        let sold = false;
        for (const g of goods)
          if (sim.state.cargo[g.id] > 0)
            sold = sim.sell(g.id, sim.state.cargo[g.id]) || sold;
        if (sold && tutorial === 4) tutorial = 5;
        rememberTutorial();
        render();
        void persist();
        notice(sim.state.lastEvent);
        break;
      }
      case "save":
        await persist(true);
        break;
      case "load":
        await restore(await loadGame());
        break;
      case "backup":
        await restore(await loadBackup());
        break;
      case "export":
        downloadSave(sim.export());
        notice("已导出 JSON 存档");
        break;
      case "import":
        $("#importFile").click();
        break;
      case "toggleQuality":
        lowQuality = !lowQuality;
        world.setQuality(lowQuality ? "low" : "high");
        renderPanel();
        break;
      case "guideAgain":
        tutorial = 0;
        growthHidden = false;
        rememberTutorial();
        closePanel();
        render();
        break;
      case "newGame":
        await persist();
        closePanel();
        hideNews();
        $("#welcome").hidden = false;
        renderOrigins();
        $("#continueGame").hidden = !sim.state.started;
        renderHud();
        break;
    }
  } catch (err) {
    notice(err instanceof Error ? err.message : "操作暂未完成");
  }
});
document.addEventListener("change", async (e) => {
  const t = e.target as HTMLInputElement;
  if (t.id === "marketCategory" || t.id === "routeCategory") {
    if (t.id === "marketCategory") {
      marketCategory = t.value;
      marketPage = 0;
    } else {
      routeRegion = t.value;
      routePage = 0;
    }
    renderPanel();
    return;
  }
  if (t.id === "strategy") {
    sim.setStrategy(t.value as Parameters<TradeSim["setStrategy"]>[0]);
    renderPanel();
  }
  if (t.id === "importFile" && t.files?.[0]) {
    try {
      if (t.files[0].size > 5 * 1024 * 1024)
        throw new Error("存档不能大于 5 MB");
      await restore(await t.files[0].text());
    } catch (err) {
      notice(String(err));
    }
    t.value = "";
  }
});
document.addEventListener("keydown", (e) => {
  const t = e.target as HTMLElement;
  if (t.matches("input,select,textarea")) return;
  const direction = (
    {
      a: "left",
      d: "right",
      w: "up",
      s: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowUp: "up",
      ArrowDown: "down",
    } as Record<string, string>
  )[e.key];
  if (direction && traveling() && !blocked()) {
    e.preventDefault();
    helmKeys.add(direction);
    if (!e.repeat) {
      sim.steer(
        direction === "left" ? -0.09 : direction === "right" ? 0.09 : 0,
        direction === "up" ? 0.1 : direction === "down" ? -0.1 : 0,
      );
      renderNavigationHud();
    }
    return;
  }
  if (e.key === "Escape") {
    closePanel();
    return;
  }
  if (e.key === " " && t === document.body) {
    e.preventDefault();
    paused = !paused;
    renderHud();
  }
  const n = Number(e.key) - 1;
  if (n >= 0 && n < dock.length) showPanel(dock[n][0]);
});
document.addEventListener("visibilitychange", () => {
  lastFrame = performance.now();
  gameClock.tick(lastFrame, false, speed);
  renderHud();
});
function renderLandmarks(): void {
  const map: Record<string, [Panel, string]> = {
    market: ["market", "港口市场"],
    shipyard: ["fleet", "船坞"],
    warehouse: ["guild", "仓库"],
    manor: ["life", "港口生活"],
    beacon: ["route", "远洋码头"],
  };
  const root = $("#landmarks");
  for (const p of world.getLandmarks()) {
    let b = root.querySelector<HTMLButtonElement>(`[data-landmark="${p.id}"]`);
    if (!b) {
      b = document.createElement("button");
      b.className = "landmark";
      b.dataset.landmark = p.id;
      b.dataset.panel = map[p.id]?.[0] ?? "market";
      b.innerHTML = `<span>${map[p.id]?.[1] ?? escape(p.name)}</span><i></i>`;
      root.appendChild(b);
    }
    b.style.left = p.x + "%";
    b.style.top = p.y + "%";
    b.hidden =
      p.x < 4 ||
      p.x > 96 ||
      p.y < 15 ||
      p.y > 88 ||
      !sim.state.started ||
      world.isOceanView();
  }
}
function syncWorld(): void {
  world.updateNavigation(
    sim.state.navigation,
    sim.availablePorts(),
    navigationHazards(sim.state.day),
  );
  if (sim.state.started) world.setOceanView(true);
  const state = sim.state.dominion;
  const availableRoads = new Set(
    sim
      .dominion()
      .routes()
      .map((route) => route.id),
  );
  const roads = inlandRoads
    .filter((r) => !!state.owned[r.a] || !!state.owned[r.b])
    .filter((r) => availableRoads.has(r.id));
  world.updateCivilization({
    cities: inlandCities
      .filter((c) => c.era <= sim.state.eraIndex || sim.state.sandbox)
      .map((c) => ({
        ...c,
        owned: !!state.owned[c.id],
        known: state.discovered.includes(c.id) || !!state.owned[c.id],
      })),
    roads: roads.map((r) => ({ id: r.id, points: r.waypoints })),
    caravans: state.activeCaravans.map((c) => {
      const road = inlandRoads.find((r) => r.id === c.routeId)!;
      const path =
        c.fromId === road.a ? road.waypoints : [...road.waypoints].reverse();
      const progress = Math.min(
        1,
        Math.max(
          0,
          (sim.state.day + dayFraction - c.sentDay) /
            (c.returnsDay - c.sentDay),
        ),
      );
      const along =
          (progress < 0.5 ? progress * 2 : (1 - progress) * 2) *
          (path.length - 1),
        leg = Math.min(path.length - 2, Math.floor(along));
      const a = path[leg],
        b = path[leg + 1],
        f = along - leg;
      return {
        id: c.id,
        point: {
          lon: a.lon + (b.lon - a.lon) * f,
          lat: a.lat + (b.lat - a.lat) * f,
        },
      };
    }),
  });
}
function handleArrival(): void {
  if (tutorial === 3) tutorial = 4;
  rememberTutorial();
  helmKeys.clear();
  marketSearch = "";
  marketPage = 0;
  marketCategory = "";
  render();
  world.focusAt(sim.state.navigation.position, 12, true);
  void persist();
  notice(sim.state.lastEvent);
}
function renderNavigationHud(): void {
  const n = sim.state.navigation,
    atSea = traveling(),
    ocean = world.isOceanView(),
    mapView = world.getMapView();
  $("#toggleMap").hidden =
    !sim.state.started || !$("#welcome").hidden || !!panel;
  $("#toggleMap").textContent =
    mapView.following && !mapView.regional ? "查看区域" : "回到船队";
  $("#followShip").textContent = mapView.following ? "已跟随船队" : "跟随船队";
  $("#followShip").setAttribute("aria-pressed", String(mapView.following));
  if (ocean) {
    $("#placeName").textContent = mapView.following
      ? atSea
        ? "远洋航行中"
        : sim.port().name
      : mapView.cityName
        ? `${mapView.cityName}一带`
        : "自由查看";
    $("#placeRegion").textContent = mapView.following
      ? atSea
        ? `${sim.port().name} → ${sim.port(sim.state.destinationId!).name}`
        : `${sim.port().polity} · ${sim.port().region}`
      : `地图浏览 · 船队${atSea ? "驶向 " + sim.port(sim.state.destinationId!).name : "停泊 " + sim.port().name}`;
  }
  $("#helm").hidden = !atSea || !!panel;
  $("#manualControls").hidden = !n.manual;
  $("#toggleHelm").textContent = n.manual ? "交还自动领航" : "接管手动掌舵";
  $("#headingLabel").textContent =
    `${Math.round(((n.heading * 180) / Math.PI + 360) % 360)}° · ${n.manual ? Math.round(n.throttle * 100) + "% 帆速" : "自动领航"}`;
  $(".compass-rose small").textContent = ocean ? "世 界" : "港 湾";
  $(".map-hint").textContent = ocean
    ? `发现 ${new Set([...n.discovered, ...sim.state.dominion.discovered]).size} 城 · 世界 ${ports.length + inlandCities.length} 城 · ${matchMedia("(pointer: fine)").matches ? "左键拖动 · 滚轮缩放" : "单指拖动 · 双指缩放"} · 点击城市${atSea ? " · 点击海面定航向" : ""}`
    : "拖动地图 · 滚轮缩放 · 点击建筑";
  $(".game-shell").classList.toggle("ocean-active", ocean);
  $(".game-shell").classList.toggle("sailing", atSea);
  if (atSea) {
    const near = sim.nearbyPorts();
    const dockMarkup =
      near
        .map((p) => `<button data-dock="${p.id}">停靠 ${p.name}</button>`)
        .join("") ||
      "<small>驶近城市后出现停靠按钮 · WASD / 方向键掌舵</small>";
    if ($("#nearbyDock").innerHTML !== dockMarkup)
      $("#nearbyDock").innerHTML = dockMarkup;
    const hazards = navigationHazards(sim.state.day).filter(
      (h) => distanceDegrees(n.position, h) < h.radius,
    );
    const voyageText = `${icon("ship")}<div><strong>${n.manual ? "自由航行" : "驶向 " + sim.port(sim.state.destinationId!).name}</strong><small>${n.manual ? "海路由你决定" : "剩余约 " + sim.navigationRemainingDays() + " 日"} · ${hazards.length ? hazards.map((h) => h.label).join("、") : "附近海况平稳"} · 补给约 ${Math.floor(sim.state.supplies / sim.state.voyage!.dailySupply)} 日</small></div>`;
    if ($("#voyageBar").innerHTML !== voyageText)
      $("#voyageBar").innerHTML = voyageText;
  }
}
function renderOceanMarkers(): void {
  const root = $("#oceanLabels");
  const candidates = [
    ...world.getOceanMarkers(),
    ...world.getInlandMarkers().map((p) => ({ ...p, visited: p.known })),
  ];
  const priority = (p: (typeof candidates)[number]) =>
    p.id === cityFocus
      ? 4
      : p.id === sim.state.currentPortId
        ? 3
        : sim.state.dominion.owned[p.id]
          ? 2
          : p.visited
            ? 1
            : 0;
  candidates.sort(
    (a, b) =>
      priority(b) - priority(a) ||
      Math.hypot(a.x - 50, a.y - 50) - Math.hypot(b.x - 50, b.y - 50),
  );
  const width = Math.max(1, root.clientWidth),
    height = Math.max(1, root.clientHeight),
    rootRect = root.getBoundingClientRect();
  const obstacles = Array.from(
    document.querySelectorAll<HTMLElement>(
      ".topbar, .place-header, .time-bar, #marketNews, #toggleMap, .map-tools, #guide, #voyageBar, #helm, .bottom-dock, #drawer",
    ),
  )
    .filter((el) => el.getClientRects().length)
    .map((el) => el.getBoundingClientRect());
  const labelWidth = (name: string) =>
    name.length * (width < 760 ? 10 : 11) + 38;
  const labelHeight = width < 760 ? 27 : 30;
  const markers: typeof candidates = [];
  for (const p of candidates) {
    const x = rootRect.left + (p.x * width) / 100,
      y = rootRect.top + (p.y * height) / 100,
      half = labelWidth(p.name) / 2;
    if (
      x - half < rootRect.left + 8 ||
      x + half > rootRect.right - 8 ||
      y - labelHeight < rootRect.top + 8 ||
      y > rootRect.bottom - 8 ||
      obstacles.some(
        (rect) =>
          x + half + 6 > rect.left &&
          x - half - 6 < rect.right &&
          y + 6 > rect.top &&
          y - labelHeight - 6 < rect.bottom,
      )
    )
      continue;
    if (
      !markers.some(
        (other) =>
          (Math.abs(other.x - p.x) * width) / 100 <
            (labelWidth(other.name) + labelWidth(p.name)) / 2 + 8 &&
          (Math.abs(other.y - p.y) * height) / 100 < 34,
      )
    )
      markers.push(p);
    if (markers.length >= (width < 760 ? 14 : 28)) break;
  }
  const ids = new Set(markers.map((p) => p.id));
  root.querySelectorAll<HTMLElement>("button").forEach((b) => {
    if (!ids.has(b.dataset.oceanPort!)) b.remove();
  });
  for (const p of markers) {
    let b = root.querySelector<HTMLButtonElement>(
      `[data-ocean-port="${p.id}"]`,
    );
    if (!b) {
      b = document.createElement("button");
      b.className = "landmark ocean-port";
      b.dataset.oceanPort = p.id;
      root.append(b);
    }
    b.classList.toggle("owned-city", !!sim.state.dominion.owned[p.id]);
    b.classList.toggle("focused-city", p.id === cityFocus);
    b.classList.toggle("unvisited-city", !p.visited);
    b.title = `${p.name} · ${p.visited ? "已发现" : "尚未到访"}`;
    b.textContent = `${sim.state.dominion.owned[p.id] ? "⚑" : p.visited ? "◇" : "·"} ${p.name}`;
    b.style.left = p.x + "%";
    b.style.top = p.y + "%";
  }
}
world.setMapInteraction(
  (id) => {
    if (!sim.state.started || panel || !$("#welcome").hidden) return;
    if (inlandCities.some((c) => c.id === id)) {
      cityFocus = id;
      cityPage = 0;
      citySearch = "";
      cityScope = "all";
      dominionTab = "cities";
      showPanel("guild");
      return;
    }
    if (!traveling() && id === sim.state.currentPortId) {
      syncWorld();
      world.focusAt(sim.state.navigation.position, 12, true);
      showPanel("market");
    } else {
      selected = id;
      showPanel("route");
    }
  },
  (point) => {
    if (!traveling() || blocked()) return;
    if (sim.steerToward(point)) {
      renderNavigationHud();
      notice(sim.state.lastEvent);
    }
  },
);
document.addEventListener("input", (e) => {
  const t = e.target as HTMLInputElement;
  if (
    !["marketSearch", "routeSearch", "catalogSearch", "citySearch"].includes(
      t.id,
    )
  )
    return;

  if (t.id === "marketSearch") {
    marketSearch = t.value;
    marketPage = 0;
  } else if (t.id === "catalogSearch") {
    catalogSearch = t.value;
    catalogPage = 0;
  } else if (t.id === "citySearch") {
    citySearch = t.value;
    cityPage = 0;
  } else {
    routeSearch = t.value;
    routePage = 0;
  }
  renderPanel();
  const input = $<HTMLInputElement>("#" + t.id);
  input.focus();
});
document.addEventListener("pointerdown", (e) => {
  const t = (e.target as Element).closest<HTMLElement>("[data-helm]");
  if (t && !blocked()) {
    e.preventDefault();
    const direction = t.dataset.helm!;
    helmKeys.add(direction);
    sim.steer(
      direction === "left" ? -0.09 : direction === "right" ? 0.09 : 0,
      direction === "up" ? 0.1 : direction === "down" ? -0.1 : 0,
    );
    renderNavigationHud();
  }
});
document.addEventListener("pointerup", () => helmKeys.clear());
document.addEventListener("pointercancel", () => helmKeys.clear());
document.addEventListener("keyup", (e) => {
  const direction = (
    {
      a: "left",
      d: "right",
      w: "up",
      s: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowUp: "up",
      ArrowDown: "down",
    } as Record<string, string>
  )[e.key];
  if (direction) helmKeys.delete(direction);
});
window.addEventListener("blur", () => helmKeys.clear());
let lastFrame = performance.now(),
  landmarkTimer = 0;
function frame(now: number): void {
  const dt = Math.min(0.25, Math.max(0, (now - lastFrame) / 1000));
  lastFrame = now;
  if (newsRemaining > 0 && !document.hidden && !panel && !paused) {
    newsRemaining = Math.max(0, newsRemaining - dt);
    $("#newsProgress").style.width = `${(newsRemaining / 16) * 100}%`;
    if (!newsRemaining) hideNews();
  }
  const active = uiReady && !blocked();
  const wasSailing = traveling();
  const fractionBefore = gameClock.fraction;
  const days = gameClock.tick(now, active, speed);
  if (active && traveling()) {
    const turn = Number(helmKeys.has("right")) - Number(helmKeys.has("left"));
    const throttle = Number(helmKeys.has("up")) - Number(helmKeys.has("down"));
    if (turn || throttle) sim.steer(turn * dt * 0.8, throttle * dt * 0.4);
  }
  dayFraction = gameClock.fraction;
  for (let day = 0; day < days; day++) {
    sim.nextDay(true);
    if (/商队归来|远征失利|控制权|军饷不足/.test(sim.state.lastEvent))
      notice(sim.state.lastEvent);
    render();
    void persist();
  }
  if (active && wasSailing) {
    const result = sim.advanceSailing(
      Math.max(0, days + gameClock.fraction - fractionBefore),
    );
    if (result.arrived) handleArrival();
    if (result.blocked && now - lastBlockedNotice > 5000) {
      lastBlockedNotice = now;
      notice(sim.state.lastEvent);
    }
  }
  $("#dayProgress").style.width = dayFraction * 100 + "%";
  if (uiReady) {
    world.setTime(((sim.state.day % 8) + dayFraction) / 8);
    const v = sim.state.voyage;
    world.placeShip(
      v ? Math.min(1, (v.elapsedDays + dayFraction) / v.totalDays) : 0,
      traveling(),
    );
    landmarkTimer += dt;
    if (landmarkTimer > 0.08) {
      renderLandmarks();
      if (world.isOceanView()) {
        syncWorld();
        renderOceanMarkers();
        renderNavigationHud();
      }
      landmarkTimer = 0;
    }
  }
  requestAnimationFrame(frame);
}
renderOrigins();
world
  .init()
  .then((kind) => {
    rendererKind = kind === "webgpu" ? "WebGPU" : "WebGL2";
    uiReady = true;
    $("#startGame").removeAttribute("disabled");
    $("#worldStage").dataset.ready = "true";
    render();
  })
  .catch((err) => {
    notice("场景初始化失败，请刷新或换用支持 WebGL2 的浏览器");
    console.error(err);
  });
loadAtlas()
  .then(() => {
    if (panel === "route") renderPanel();
  })
  .catch(() => notice("世界海岸图未加载，仍可用港口列表规划航路"));
loadGame()
  .then((saved) => {
    $("#continueGame").hidden = !saved;
  })
  .catch((err) => notice(String(err)));
registerOffline().catch(() => {});
requestAnimationFrame(frame);
