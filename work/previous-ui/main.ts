import './styles.css';
import { TradeSim, eras, goods, origins, ports, Origin, Port, ViewMode } from './sim';
import { WorldRenderer } from './renderer';

const app = document.querySelector<HTMLDivElement>('#app')!;
const sim = new TradeSim();

app.innerHTML = `
  <div class="shell">
    <header class="topbar">
      <div class="brand-block"><div class="brand-mark">⚓</div><div><div class="brand">长晴 AI · 远海商途</div><div class="brand-sub">HISTORICAL TRADE SIMULATION</div></div></div>
      <div class="header-metrics"><div><span>现银</span><strong id="cash">0</strong></div><div><span>资产指数</span><strong id="assets">0</strong></div><div><span>声望</span><strong id="rep">0</strong></div><div><span>航海日</span><strong id="day">1</strong></div></div>
      <div class="header-actions"><button class="icon-button" id="save" title="导出本地存档">⇩</button><button class="icon-button" id="load" title="读取本地存档">↥</button><button class="icon-button" id="settings" title="显示渲染信息">⋯</button></div>
    </header>
    <main class="main-grid">
      <aside class="left-rail">
        <section class="panel dynasty-panel"><div class="eyebrow">商贸家族</div><div class="dynasty-name" id="dynasty">尼罗河新航线</div><div class="dynasty-meta"><span id="originName">未选择出生地</span><span class="status-dot"></span><span id="rendererStatus">初始化渲染器</span></div></section>
        <section class="panel era-panel"><div class="section-title"><span>历史纪元</span><span class="tiny-code">01 / 11</span></div><div class="era-track" id="eraTrack"></div></section>
        <section class="panel route-panel"><div class="section-title"><span>航线参谋</span><span class="advisor-badge">本地 AI</span></div><div class="advisor-copy" id="advisorCopy">选择目标港口后，系统会按照利润、航时与海况给出路线建议。</div><div class="route-options" id="routeOptions"></div></section>
        <section class="panel event-panel"><div class="section-title"><span>航海日志</span><span class="tiny-code">LIVE</span></div><div class="log-entry" id="log">等待家族起航。</div></section>
      </aside>
      <section class="world-column">
        <div class="world-toolbar"><div class="view-switch"><button class="view-btn active" data-view="2d">航图</button><button class="view-btn" data-view="3d">海面</button></div><div class="world-context"><span class="context-dot"></span><span id="currentPort">选择出生地</span><span class="divider">/</span><span id="season">前 2500 年 · 丰水期</span></div><button class="pause-btn" id="nextDay">推进一日 <span>›</span></button></div>
        <div class="world-stage" id="worldStage"><div class="map-overlay-label label-top">东地中海 · 波斯湾 · 印度河</div><div class="map-overlay-label label-bottom">航路由确定性模拟驱动 · 海况每个贸易日更新</div><div class="port-labels" id="portLabels"></div><div class="origin-overlay" id="originOverlay"><div class="origin-card"><div class="eyebrow">建立商贸家族</div><h1>选择你的出生港</h1><p>历史从河口与海湾开始。出生地改变开局市场与第一条航线，后续可以迁移和建立第二总部。</p><div class="origin-grid" id="originGrid"></div><button class="primary-button" id="startGame">建立家族并起航 <span>→</span></button></div></div></div>
        <div class="world-footer"><div class="legend"><span><i class="legend-dot gold"></i>可交易港口</span><span><i class="legend-dot route"></i>建议航线</span><span><i class="legend-dot risk"></i>风险海域</span></div><div class="footer-note" id="footerNote">WebGPU 优先 · WebGL2 回退</div></div>
      </section>
      <aside class="right-rail">
        <section class="panel port-panel"><div class="port-heading"><div><div class="eyebrow">当前港口</div><h2 id="portTitle">尚未启航</h2><div class="muted" id="portSubtitle">选择出生地开始经营</div></div><div class="port-seal">▦</div></div><div class="port-stats"><div><span>市场温度</span><strong id="marketTemp">—</strong></div><div><span>港口税</span><strong>6.0%</strong></div><div><span>补给</span><strong>充足</strong></div></div></section>
        <section class="panel market-panel"><div class="section-title"><span>本地市场</span><button class="text-button" id="sellAll">出售可售货物</button></div><div class="market-table" id="marketTable"></div></section>
        <section class="panel ship-panel"><div class="section-title"><span>船队</span><span class="tiny-code" id="shipLevel">LV.1</span></div><div class="ship-card"><div class="ship-swatch">⛵</div><div class="ship-info"><strong id="shipName">河口号</strong><span id="shipStats">货舱 0 / 30 · 船体 100%</span></div><div class="ship-value" id="shipValue">估值 240</div></div><div class="ship-actions"><button class="secondary-button" id="repair">维修</button><button class="secondary-button" id="upgrade">升级船体</button></div></section>
        <section class="panel destination-panel"><div class="section-title"><span>选择目的港</span><span class="tiny-code">航图</span></div><div class="destination-list" id="destinationList"></div><button class="primary-button sail-button" id="sail">启航前往 <span>→</span></button></section>
      </aside>
    </main>
  </div>`;

const stage = document.querySelector<HTMLElement>('#worldStage')!;
const world = new WorldRenderer(stage);
const selectedOrigin = { value: origins[0] };
let selectedDestination: string | null = null;
let selectedView: ViewMode = '2d';
let rendererKind = 'webgl2';

const money = (value: number): string => Math.round(value).toLocaleString('zh-CN');
const q = <T extends HTMLElement>(selector: string): T => document.querySelector<T>(selector)!;

function assets(): number {
  const cargoValue = goods.reduce((sum, good) => sum + sim.state.cargo[good.id] * sim.price(sim.state.currentPortId, good.id) * 0.7, 0);
  return sim.state.cash + cargoValue + 240 * sim.state.ship.level;
}

function renderOrigins(): void {
  q('#originGrid').innerHTML = origins.map((origin, index) => `<button class="origin-option ${index === 0 ? 'selected' : ''}" data-origin="${origin.id}" style="--accent:${origin.accent}"><span class="origin-number">0${index + 1}</span><strong>${origin.title}</strong><small>${origin.region}</small><em>${origin.perk}</em></button>`).join('');
  document.querySelectorAll<HTMLButtonElement>('[data-origin]').forEach((button) => button.addEventListener('click', () => {
    const next = origins.find((origin) => origin.id === button.dataset.origin);
    if (!next) return;
    selectedOrigin.value = next;
    document.querySelectorAll('[data-origin]').forEach((node) => node.classList.remove('selected'));
    button.classList.add('selected');
  }));
}

function renderEras(): void {
  q('#eraTrack').innerHTML = eras.map((era, index) => `<div class="era-item ${index === sim.state.eraIndex ? 'current' : index < sim.state.eraIndex ? 'done' : 'locked'}"><span class="era-index">${String(index + 1).padStart(2, '0')}</span><div><strong>${era.title}</strong><small>${era.years}</small></div></div>`).join('');
}

function renderPortLabels(): void {
  q('#portLabels').innerHTML = ports.map((port) => `<button aria-label="${port.name} ${port.polity}" class="map-port-label ${port.id === sim.state.currentPortId ? 'current' : ''} ${port.id === selectedDestination ? 'selected' : ''}" data-port="${port.id}" style="left:${((port.x + 1.1) / 2.2) * 100}%;top:${((0.9 - port.y) / 1.7) * 100}%"><span></span>${port.name}<small>${port.polity}</small></button>`).join('');
  document.querySelectorAll<HTMLButtonElement>('[data-port]').forEach((button) => button.addEventListener('click', () => selectDestination(button.dataset.port!)));
}

function selectDestination(portId: string): void {
  if (portId === sim.state.currentPortId) return;
  selectedDestination = portId;
  const destination = sim.port(portId);
  const route = sim.routeScore(portId);
  q('#advisorCopy').textContent = `前往${destination.name}：预计净利 ${money(route.profit)}，航程 ${route.days} 日，风险 ${(route.risk * 100).toFixed(0)}%。`;
  world.showRoute(sim.port(), destination);
  renderPortLabels();
  renderDestinations();
}

function renderAdvisor(): void {
  if (!sim.state.started) return;
  const routes = ports.filter((port) => port.id !== sim.state.currentPortId).map((port) => ({ port, route: sim.routeScore(port.id) })).sort((a, b) => b.route.profit - a.route.profit);
  q('#routeOptions').innerHTML = routes.slice(0, 3).map(({ port, route }) => `<button class="route-option ${port.id === selectedDestination ? 'selected' : ''}" data-route="${port.id}"><span class="route-grade ${route.grade}">${route.grade}</span><span class="route-main"><strong>${port.name}</strong><small>${route.days} 日航程 · 风险 ${(route.risk * 100).toFixed(0)}%</small></span><b>+${money(route.profit)}</b></button>`).join('');
  document.querySelectorAll<HTMLButtonElement>('[data-route]').forEach((button) => button.addEventListener('click', () => selectDestination(button.dataset.route!)));
}

function renderMarket(): void {
  const port = sim.port();
  q('#marketTable').innerHTML = goods.map((good) => {
    const owned = sim.state.cargo[good.id];
    const price = sim.price(port.id, good.id);
    const isLocal = port.produces.includes(good.id);
    return `<div class="market-row"><span class="good-icon" style="--good:${good.color}">${good.icon}</span><div class="good-name"><strong>${good.name}</strong><small>${isLocal ? '本地出产' : port.demands.includes(good.id) ? '港口紧缺' : '常规流通'}</small></div><strong class="good-price">${money(price)}</strong><span class="owned">${owned ? `持有 ${owned}` : '—'}</span><button class="mini-button" data-buy="${good.id}">买</button><button class="mini-button sell" data-sell="${good.id}">卖</button></div>`;
  }).join('');
  document.querySelectorAll<HTMLButtonElement>('[data-buy]').forEach((button) => button.addEventListener('click', () => { sim.buy(button.dataset.buy!, 1); render(); }));
  document.querySelectorAll<HTMLButtonElement>('[data-sell]').forEach((button) => button.addEventListener('click', () => { sim.sell(button.dataset.sell!, 1); render(); }));
}

function renderDestinations(): void {
  q('#destinationList').innerHTML = ports.filter((port) => port.id !== sim.state.currentPortId).map((port) => { const route = sim.routeScore(port.id); return `<button class="destination-row ${port.id === selectedDestination ? 'selected' : ''}" data-destination="${port.id}"><span class="destination-pin"></span><span><strong>${port.name}</strong><small>${port.region}</small></span><span class="destination-risk">${(route.risk * 100).toFixed(0)}%</span></button>`; }).join('');
  document.querySelectorAll<HTMLButtonElement>('[data-destination]').forEach((button) => button.addEventListener('click', () => selectDestination(button.dataset.destination!)));
}

function render(): void {
  const state = sim.state;
  q('#cash').textContent = money(state.cash);
  q('#assets').textContent = money(assets());
  q('#rep').textContent = String(Math.round(state.reputation));
  q('#day').textContent = String(state.day);
  q('#originName').textContent = state.started ? selectedOrigin.value.region : '未选择出生地';
  q('#currentPort').textContent = state.started ? sim.port().name : '选择出生地';
  q('#portTitle').textContent = state.started ? sim.port().name : '尚未启航';
  q('#portSubtitle').textContent = state.started ? `${sim.port().polity} · ${sim.port().region}` : '选择出生地开始经营';
  q('#marketTemp').textContent = state.started ? `${state.marketShift[state.currentPortId] > 2 ? '偏热' : state.marketShift[state.currentPortId] < -1 ? '偏冷' : '平稳'}` : '—';
  q('#log').textContent = state.lastEvent;
  q('#shipName').textContent = state.ship.name;
  q('#shipStats').textContent = `货舱 ${sim.cargoCount()} / ${state.ship.capacity} · 船体 ${Math.round((state.ship.hull / state.ship.maxHull) * 100)}%`;
  q('#shipLevel').textContent = `LV.${state.ship.level}`;
  q('#shipValue').textContent = `估值 ${money(240 * state.ship.level)}`;
  q('#rendererStatus').textContent = `${rendererKind === 'webgpu' ? 'WebGPU' : 'WebGL2'} · ${selectedView === '2d' ? '航图' : '海面'}`;
  q('#footerNote').textContent = `${rendererKind === 'webgpu' ? 'WebGPU' : 'WebGL2'} 优先回退 · 确定性本地模拟`;
  renderEras();
  renderPortLabels();
  renderMarket();
  renderDestinations();
  renderAdvisor();
}

renderOrigins();
renderEras();
render();
world.init().then((kind) => { rendererKind = kind; render(); });

q<HTMLButtonElement>('#startGame').addEventListener('click', () => {
  sim.start(selectedOrigin.value);
  q('#originOverlay').classList.add('hidden');
  render();
  selectDestination(ports.find((port) => port.id !== sim.state.currentPortId)!.id);
});

document.querySelectorAll<HTMLButtonElement>('.view-btn').forEach((button) => button.addEventListener('click', () => {
  selectedView = button.dataset.view as ViewMode;
  document.querySelectorAll('.view-btn').forEach((node) => node.classList.remove('active'));
  button.classList.add('active');
  world.setMode(selectedView);
  render();
}));

q<HTMLButtonElement>('#sail').addEventListener('click', () => { if (selectedDestination && sim.sail(selectedDestination)) { selectedDestination = null; render(); world.showRoute(sim.port(), null); } });
q<HTMLButtonElement>('#nextDay').addEventListener('click', () => { sim.nextDay(); render(); });
q<HTMLButtonElement>('#repair').addEventListener('click', () => { sim.repair(); render(); });
q<HTMLButtonElement>('#upgrade').addEventListener('click', () => { sim.upgrade(); render(); });
q<HTMLButtonElement>('#sellAll').addEventListener('click', () => { goods.forEach((good) => sim.sell(good.id, sim.state.cargo[good.id])); render(); });
q<HTMLButtonElement>('#save').addEventListener('click', () => { localStorage.setItem('remote-trade-save', sim.export()); sim.state.lastEvent = '本地存档已导出到浏览器'; render(); });
q<HTMLButtonElement>('#load').addEventListener('click', () => { const saved = localStorage.getItem('remote-trade-save'); if (saved && sim.import(saved)) { q('#originOverlay').classList.add('hidden'); sim.state.lastEvent = '本地存档已读取'; render(); } });
q<HTMLButtonElement>('#settings').addEventListener('click', () => { sim.state.lastEvent = `当前渲染器：${rendererKind.toUpperCase()}，贸易模拟运行于本地 Worker 兼容模式`; render(); });
