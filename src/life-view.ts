import { goods, eras, type TradeSim } from "./sim";

export type LifeTab =
  "residents" | "commissions" | "research" | "facilities" | "collections";
const button = (action: string, id: string, label: string, disabled = false) =>
  `<button class="secondary" data-life-action="${action}" data-life-id="${id}" ${disabled ? "disabled" : ""}>${label}</button>`;
export function lifeMarkup(sim: TradeSim, tab: LifeTab): string {
  const life = sim.life(),
    season = life.season(),
    atSea = !!sim.state.voyage;
  const tabs: [LifeTab, string][] = [
    ["residents", "街坊"],
    ["commissions", "委托"],
    ["research", "研究"],
    ["facilities", "商栈"],
    ["collections", "收集"],
  ];
  let content = `<div class="panel-intro"><h3>${sim.port().name}的日常</h3><p>${season.name} · 第 ${season.day} 日${season.festival ? " · 港口集会，委托酬劳与关系奖励增加" : " · 航海之外，也有值得回来的地方"}</p></div><div class="life-tabs">${tabs.map(([id, name]) => `<button data-life-tab="${id}" class="${tab === id ? "active" : ""}">${name}</button>`).join("")}</div>`;
  if (atSea)
    content +=
      '<p class="empty-note">船队正在海上，靠港后可以拜访居民、交付委托与建设。</p>';
  if (tab === "residents")
    content +=
      life
        .residents()
        .map(
          (r) =>
            `<article class="life-card"><div class="resident-portrait">${r.portrait}</div><span class="eyebrow">${r.role} · 熟悉度 ${r.friendship}/100</span><h3>${r.name}</h3><p>${r.dialogue}</p>${button("talk", r.id, "坐下聊聊", atSea)}</article>`,
        )
        .join("") +
      '<p class="footnote">每日聊天增加一次关系。熟悉本港居民会降低交易税；季节在不同气候地区作为当地商事节候的简化。</p>';
  if (tab === "commissions")
    content +=
      life
        .commissions()
        .map((c) => {
          const g = goods.find((g) => g.id === c.goodId)!;
          return `<article class="life-card"><span class="eyebrow">${c.status === "accepted" ? "已接下" : c.status === "completed" ? "已完成" : c.status === "expired" ? "已过期" : "告示板"} · 截止第 ${c.expiresDay} 日</span><h3>${c.title}</h3><p>${c.description}</p><p>随船 ${sim.state.cargo[c.goodId]} / ${c.quantity} ${g.unit}${g.name} · 报酬 ${c.reward} 金币</p>${c.status === "available" ? button("accept", c.id, "接下委托", atSea) : c.status === "accepted" ? button("deliver", c.id, "交付货物", atSea || sim.state.cargo[c.goodId] < c.quantity) : ""}</article>`;
        })
        .join("") +
      '<p class="footnote">最多同时接 3 份，每周换新。交付实际消耗随船货物，报酬不是纯利润，记得考虑采购费用。</p>';
  if (tab === "research")
    content +=
      '<p class="footnote">先选择眼前需要的改进：货舱、航速或经营。费用一次支付，效果永久保留。</p>' +
      life
        .technologies()
        .map((t) => {
          const ready =
            t.era <= sim.state.eraIndex &&
            t.requires.every((id) => sim.state.life.researched.includes(id));
          const names = t.requires.map(
            (id) => life.technologies().find((t) => t.id === id)!.name,
          );
          return `<article class="life-card"><span class="eyebrow">${eras[t.era].title}${names.length ? " · 需要 " + names.join("、") : " · 起始研究"}</span><h3>${t.name}</h3><p>${t.description}</p>${button("research", t.id, t.unlocked ? "已经掌握" : `研究 · ${t.cost} 金币`, atSea || t.unlocked || !ready || sim.state.cash < t.cost)}</article>`;
        })
        .join("");
  if (tab === "facilities")
    content +=
      life
        .facilities()
        .map(
          (f) =>
            `<article class="life-card"><span class="eyebrow">本港设施 · ${f.level} / 3 级</span><h3>${f.name}</h3><p>${f.description}</p>${button("build", f.id, f.level >= 3 ? "建设完成" : `扩建 · ${f.cost} 金币`, atSea || f.level >= 3 || sim.state.cash < f.cost)}</article>`,
        )
        .join("") +
      `<article class="life-card"><h3>港口贸易投资</h3><p>当前 ${sim.state.investments[sim.state.currentPortId] || 0}/5 级，降低本港交易税。</p><button id="invest" class="secondary" ${atSea || sim.state.eraIndex < 2 ? "disabled" : ""}>投资 · ${sim.investmentCost()} 金币</button></article>`;
  if (tab === "collections")
    content += life
      .bundles()
      .map(
        (b) =>
          `<article class="life-card"><h3>${b.name}</h3><p>${b.description}</p>${b.requirements.map((r) => `<div class="cargo-row"><span>${goods.find((g) => g.id === r.goodId)!.name}</span><b>${sim.state.cargo[r.goodId]} / ${r.quantity}</b></div>`).join("")}${button("bundle", b.id, b.completed ? "已经珍藏" : "交齐这份收集", atSea || b.completed || b.requirements.some((r) => sim.state.cargo[r.goodId] < r.quantity))}</article>`,
      )
      .join("");
  return content;
}
