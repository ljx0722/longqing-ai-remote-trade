import type { TradeSim } from "./sim";
import { cityAlias, matchesCity } from "./city-names";

export type DominionTab = "cities" | "caravans" | "army";
const button = (
  action: string,
  id: string,
  label: string,
  disabled = false,
  kind = "",
) =>
  `<button class="secondary" data-city-action="${action}" data-city-id="${id}" ${kind ? `data-city-kind="${kind}"` : ""} ${disabled ? "disabled" : ""}>${label}</button>`;
export function dominionMarkup(
  sim: TradeSim,
  tab: DominionTab,
  page: number,
  focus: string,
  query = "",
  scope: "known" | "all" = "known",
): string {
  const realm = sim.dominion(),
    cities = realm.cities(),
    owned = cities.filter((c) => c.owned),
    army = realm.army();
  let html = `<div class="panel-intro"><h3>用一船生意，建立一座城邦。</h3><p>购买城市 → 商队探索内陆 → 建设或扩张。你只需安排商业、粮食和守备，其余按日运行。</p></div><div class="panel-metrics"><div><small>持有城市</small><b>${owned.length}</b></div><div><small>城市净收入／日</small><b>${owned.reduce((sum, c) => sum + c.income, 0)}</b></div><div><small>军饷／日</small><b>−${army.upkeep}</b></div></div><div class="life-tabs">${[
    ["cities", "城市"],
    ["caravans", "陆地商队"],
    ["army", "军队与战役"],
  ]
    .map(
      ([id, label]) =>
        `<button data-dominion-tab="${id}" class="${tab === id ? "active" : ""}">${label}</button>`,
    )
    .join("")}</div>`;
  if (tab === "cities") {
    const known = cities
      .filter(
        (c) => (scope === "all" || c.known || c.owned) && matchesCity(c, query),
      )
      .sort(
        (a, b) =>
          Number(b.id === focus) - Number(a.id === focus) ||
          Number(b.owned) - Number(a.owned),
      );
    page = Math.min(page, Math.max(0, Math.ceil(known.length / 8) - 1));
    const safeQuery = query.replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c]!,
    );
    html += `<div class="catalog-search"><input id="citySearch" type="search" maxlength="60" aria-label="搜索城市" placeholder="搜索古今城名、地区" value="${safeQuery}"></div><div class="life-tabs"><button data-city-scope="known" class="${scope === "known" ? "active" : ""}">已发现</button><button data-city-scope="all" class="${scope === "all" ? "active" : ""}">本纪元地图</button></div>`;
    if (!known.length)
      html +=
        '<p class="empty-note">没有匹配的城市。可查看「本纪元地图」，或尝试城市的古今名称。</p>';
    if (!owned.length)
      html +=
        '<p class="empty-note">第一步：攒够现银，在停靠的港口购买城市。取得经营权后，这座城市每天提供收入，并开放通往内陆的商队道路。</p>';
    html +=
      known
        .slice(page * 8, page * 8 + 8)
        .map((c) => {
          const development = sim.state.dominion.owned[c.id];
          const canBuy =
            c.known &&
            !sim.state.voyage &&
            (!c.coastal || c.id === sim.state.currentPortId) &&
            sim.state.cash >= c.price;
          return `<article class="city-card" data-city="${c.id}"><span class="eyebrow">${c.coastal ? "沿海与河港" : "内陆城市"} · ${c.region}${c.id === sim.state.currentPortId ? " · 船队驻港" : ""}</span><h3>${c.owned ? "⚑ " : ""}${c.name}</h3>${cityAlias(c.id, c.name) ? `<p>古今名称：${cityAlias(c.id, c.name)}</p>` : ""}<button class="quiet-button" data-city-focus="${c.id}">在世界地图上定位 →</button>${
            c.owned
              ? `<p>商业 ${c.commerce}/3 · 粮食 ${c.food}/3 · 守备 ${c.defense}<br>忠诚度 ${c.loyalty}/100 · 城市净收入 ${c.income} 金币／日</p><div class="card-actions">${(
                  [
                    ["commerce", "集市"],
                    ["food", "农田"],
                    ["defense", "城防"],
                  ] as const
                )
                  .map(([kind, label]) => {
                    const level = development[kind],
                      cost = (350 + c.era * 140) * (level + 1);
                    return button(
                      "develop",
                      c.id,
                      level >= 3
                        ? `${label}已满级`
                        : `${label} ${level + 1}级 · ${cost}`,
                      level >= 3 || sim.state.cash < cost,
                      kind,
                    );
                  })
                  .join("")}</div>`
              : !c.known
                ? `<p>地图已标注 · 尚未发现。${c.coastal ? "船队驶近后，停靠城市即可访问市场与签约。" : "从相连的自有城市派遣陆地商队，归来后即可发现并签约。"}</p>${c.coastal ? `<button data-news-port="${c.id}" class="quiet-button">规划前往航路 →</button>` : ""}`
                : `<p>购买城市 · ${c.price} 金币。获得经营特许权、日常税收与陆路商队组织权。</p>${button("purchase", c.id, `购买 ${c.name} · ${c.price}`, !canBuy)}${c.coastal && c.id !== sim.state.currentPortId ? `<p>需要亲自停靠签约。<button data-news-port="${c.id}" class="quiet-button">规划前往航路 →</button></p>` : ""}`
          }</article>`;
        })
        .join("") +
      `<div class="pagination"><button data-city-page="${page - 1}" ${page === 0 ? "disabled" : ""}>上一页</button><span>${page + 1} / ${Math.max(1, Math.ceil(known.length / 8))} · ${known.length} 座城市</span><button data-city-page="${page + 1}" ${(page + 1) * 8 >= known.length ? "disabled" : ""}>下一页</button></div><p class="footnote">商业增加收入，粮食支持城市与军队，城防增加守备但需要维护。征服城市忠诚度较低，优先建农田恢复治理。持有城市的保守价值计入资产，战争占领不直接增加可兑现资产。</p>`;
  }
  if (tab === "caravans") {
    html += realm
      .caravans()
      .map(
        (c) =>
          `<article class="life-card"><span class="eyebrow">商队在途</span><h3>${c.name}</h3><p>第 ${c.returnsDay} 日归来 · 回款 ${c.reward} 金币（含本金）</p></article>`,
      )
      .join("");
    const routes = realm.routes();
    html +=
      routes
        .map(
          (r) =>
            `<article class="life-card"><span class="eyebrow">${r.discovered ? "熟悉的商路" : "探索内陆"}</span><h3>${r.name}</h3><p>${r.days} 日往返 · 准备费 ${r.cost} 金币<br>回款 ${r.reward} 金币 · 预计货物差额 +${r.reward - r.cost}</p>${button("caravan", r.id, "派出商队", sim.state.cash < r.cost || realm.caravans().length >= 3 || sim.state.dominion.activeCaravans.some((c) => c.routeId === r.id))}</article>`,
        )
        .join("") ||
      '<p class="empty-note">先拥有一座与内陆道路相连的城市。孟菲斯通往底比斯，比布鲁斯通往大马士革；以后会开放更多道路。</p>';
    html +=
      '<p class="footnote">最多 3 支商队。准备费已含货物、粮食与护送，不占船舱。归来时一次性回款并发现目标城市，可购买相连内陆城继续延伸商路。</p><button id="openOcean" class="secondary full">在世界海图上查看陆路 →</button>';
  }
  if (tab === "army") {
    const camp = army.campaign,
      targets = realm.campaignTargets();
    html += `<article class="life-card"><h3>城邦卫队 · ${army.troops} / 100 人</h3><p>军饷 ${army.upkeep} 金币／日。粮食建设减轻负担；无力发饷时士兵离队。</p><div class="card-actions">${[10, 25].map((q) => button("recruit", String(q), `招募 ${q} 人 · ${q * 60}`, !!sim.state.voyage || !sim.state.dominion.owned[sim.state.currentPortId] || !!camp || army.troops + q > 100 || sim.state.cash < q * 60)).join("")}${button("disband", String(Math.min(10, army.troops)), "遣散 10 人", !!camp || army.troops === 0)}</div></article>`;
    if (camp)
      html += `<article class="life-card"><span class="eyebrow">战役进行中</span><h3>向 ${cities.find((c) => c.id === camp.targetId)?.name || camp.targetId} 推进</h3><p>第 ${camp.arrivesDay} 日结算。期间需继续支付军饷，断粮会降低实际胜算。</p></article>`;
    else
      html +=
        targets
          .slice(0, 12)
          .map(
            (c) =>
              `<article class="life-card"><span class="eyebrow">已知且可以抵达的目标</span><h3>${c.name}</h3><p>守备 ${c.defense} · 预计 ${c.days} 日<br>当前胜率约 ${Math.round(c.winChance * 100)}% · 远征费 ${c.cost} 金币</p>${button("attack", c.id, `进军 ${c.name}`, sim.state.cash < c.cost)}</article>`,
          )
          .join("") ||
        '<p class="empty-note">在持有的沿海城市招募军队，再探索相连内陆城市或附近同一海域的港口。</p>';
    html +=
      '<p class="footnote">同一时间只打一场战役。胜率随兵力、守备与供养变化，失利也会损失兵员。征服降低商贸声望，占领后还需治理；购买城市是另一条扩张道路。</p>';
  }
  return (
    html +
    '<button data-panel="life" class="quiet-button full">拜访港口居民 · 委托、研究与收集 →</button>'
  );
}
