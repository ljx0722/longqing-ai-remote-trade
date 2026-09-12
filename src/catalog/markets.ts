import type { Good, Port } from "../data";

const hash = (value: string) => {
  let result = 2166136261;
  for (let index = 0; index < value.length; index++) result = Math.imul(result ^ value.charCodeAt(index), 16777619);
  return result >>> 0;
};

// These naming hints keep regional varieties attached to a plausible export
// harbour. A listed export harbour can receive hinterland goods by river/road;
// "produces" in the game includes this local wholesale supply.
const originHints: [RegExp, string[]][] = [
  [/埃及|尼罗河/, ["memphis", "alexandria"]],
  [/两河/, ["ur", "basra"]], [/迪尔蒙/, ["dilmun"]],
  [/阿曼|马干/, ["magAN", "sohar", "muscat"]], [/印度河/, ["lothal"]],
  [/黎凡特|黎巴嫩|叙利亚/, ["byblos", "sidon", "tyre", "ugarit", "arwad", "akka", "jaffa"]],
  [/克里特/, ["crete"]], [/罗得岛/, ["rhodes"]], [/西西里/, ["syracuse", "palermo", "messina"]],
  [/阿提卡/, ["athens"]], [/科林斯/, ["corinth"]], [/罗马|坎帕尼亚/, ["ostia", "naples"]],
  [/黑海|克里米亚/, ["chersonesus", "caffa", "sinope"]],
  [/突尼斯|北非/, ["tunis", "carthage", "tripoli"]], [/波斯|海湾/, ["dilmun", "siraf", "hormuz", "qishm"]],
  [/锡兰/, ["galle", "colombo"]], [/马拉巴尔|卡利卡特/, ["calicut", "cochin", "muziris", "quilon"]],
  [/古吉拉特|坎贝/, ["cambay", "bharuch", "surat"]], [/苏拉特/, ["surat"]],
  [/孟加拉/, ["chittagong", "satgaon"]], [/科罗曼德尔/, ["masulipatnam", "pulicat", "nagapattinam"]],
  [/马达班|缅甸/, ["martaban", "pegu"]], [/福建|福州|建州|德化|建窑|漳州/, ["fuzhou", "quanzhou", "yuegang"]],
  [/浙江|宁波|明州/, ["ningbo", "hangzhou"]], [/江南|绍兴|龙泉|越窑|北苑/, ["hangzhou", "ningbo", "fuzhou"]],
  [/岭南/, ["guangzhou"]], [/日本|伊万里|有田|柿右卫门/, ["nagasaki", "hakata", "sakai"]],
  [/琉球/, ["naha"]], [/马六甲/, ["malacca"]], [/巴鲁斯/, ["barus"]],
  [/苏门答腊/, ["palembang", "barus", "aceh"]], [/婆罗洲/, ["brunei"]],
  [/亚齐/, ["aceh"]], [/万丹/, ["banten"]], [/爪哇/, ["batavia", "banten", "gresik"]],
  [/班达/, ["banda"]], [/特尔纳特|蒂多雷/, ["ternate"]], [/占城/, ["hoi-an"]],
  [/苏拉威西/, ["makassar"]], [/摩卡|也门/, ["mocha", "aden"]],
  [/哈德拉毛/, ["qana", "aden"]], [/索马里|哈拉尔/, ["mogadishu", "adulis", "massawa"]],
  [/索法拉|东非/, ["sofala", "kilwa", "mozambique"]], [/几内亚|黄金海岸/, ["elmina", "accra", "benin", "bonny"]],
  [/威尼斯|穆拉诺/, ["venice"]], [/热那亚/, ["genoa"]], [/佛兰德斯/, ["bruges", "antwerp"]],
  [/拜占庭/, ["constantinople"]], [/塞浦路斯/, ["famagusta", "salamis"]],
  [/马赛/, ["marseille"]], [/瓦伦西亚/, ["valencia"]], [/马拉加/, ["malaga"]],
  [/波尔多/, ["bordeaux"]], [/杜罗河|葡萄牙/, ["porto", "lisbon"]],
  [/马德拉/, ["funchal"]], [/加那利/, ["las-palmas"]], [/里斯本/, ["lisbon"]],
  [/英格兰|不列颠/, ["bristol", "london", "plymouth"]], [/苏格兰/, ["edinburgh"]], [/爱尔兰/, ["dublin"]],
  [/挪威|卑尔根/, ["bergen"]], [/瑞典/, ["stockholm"]], [/俄国|俄罗斯/, ["novgorod", "riga"]],
  [/汉堡/, ["hamburg"]], [/不来梅/, ["bremen"]], [/吕贝克|吕讷堡/, ["lubeck"]],
  [/格但斯克|维斯瓦/, ["gdansk"]], [/波罗的海|波美拉尼亚/, ["riga", "gdansk", "visby", "lubeck", "tallinn", "stockholm"]],
  [/加勒比|牙买加/, ["havana", "santo-domingo", "port-royal", "san-juan"]],
  [/墨西哥|中美洲|危地马拉/, ["veracruz", "acapulco"]],
  [/安第斯/, ["callao"]], [/厄瓜多尔|瓜亚基尔/, ["guayaquil"]],
  [/巴西|伯南布哥/, ["salvador", "recife", "rio"]],
  [/加拿大/, ["quebec"]], [/北美/, ["quebec", "new-amsterdam", "boston"]],
];

export function createMarketCatalog(ports: Port[], goods: Good[]): Map<string, Good[]> {
  const portIndex = new Map(ports.map((p) => [p.id, p]));
  const goodIndex = new Map(goods.map((g) => [g.id, g]));
  const catalogs = new Map(ports.map((p) => [p.id, new Set<string>()]));
  const add = (port: Port, goodId: string) => catalogs.get(port.id)!.add(goodId);
  const size = (port: Port) => catalogs.get(port.id)!.size;
  const preferSpace = (candidates: Port[], goodId: string) => [...candidates].sort((a, b) =>
    size(a) - size(b) || hash(`${a.id}:${goodId}`) - hash(`${b.id}:${goodId}`),
  );
  // Six shared staples make the opening lesson consistent; everything else is
  // local produce, requested import or an explicitly assigned regional variety.
  for (const p of ports) {
    for (const id of ["grain", "salt", "linen", "copper", "cedar", "pottery", ...p.produces, ...p.demands]) {
      if (goodIndex.has(id)) add(p, id);
    }
  }

  for (const g of goods.filter((item) => item.originPortIds)) {
    const namedOrigin = originHints.find(([pattern]) => pattern.test(g.name));
    const declared = g.originPortIds!.map((id) => portIndex.get(id)).filter((p): p is Port => Boolean(p));
    // A geographical name may identify a different entrepot than the broader
    // family. Include that real origin, then raise access era if necessary.
    const hinted = namedOrigin?.[1].map((id) => portIndex.get(id)).filter((p): p is Port => Boolean(p)) ?? [];
    const candidates = hinted.length ? hinted : declared;
    if (!candidates.length) throw new Error(`No source port for ${g.id}`);
    const availableCandidates = candidates.filter((p) => p.era <= g.era);
    const source = preferSpace(availableCandidates.length ? availableCandidates : candidates, g.id)[0];
    g.era = Math.max(g.era, source.era);
    g.originPortIds = [source.id];
    g.originRegions = [source.region];
    g.description = `${g.category} · ${source.name}及其腹地供货。${g.name}以一箱标准货量交易，品类按历史材料与手工形制归并。`;
    add(source, g.id);
    if (!source.produces.includes(g.id)) source.produces.push(g.id);
  }

  // A second, commercially plausible buyer gives each variety an initial
  // destination. Imported goods are explicitly marked as local demand.
  for (const g of goods.filter((item) => item.originPortIds)) {
    const source = portIndex.get(g.originPortIds![0])!;
    const candidates = ports.filter((p) => p.id !== source.id && p.era <= Math.max(8, g.era) && size(p) < 58);
    const familyBuyers = candidates.filter((p) => p.demands.includes(g.familyId ?? ""));
    const sameSea = candidates.filter((p) => p.basin === source.basin);
    const buyer = preferSpace(familyBuyers.length ? familyBuyers : sameSea.length ? sameSea : candidates, g.id)[0];
    if (buyer) {
      add(buyer, g.id);
      if (!buyer.demands.includes(g.id)) buyer.demands.push(g.id);
    }
  }

  // Some small outports have fewer native families. Fill their shelves with
  // imports from the same sea, without cloning the entire world catalogue.
  for (const p of ports) {
    if (size(p) >= 28) continue;
    const regional = goods.filter((g) => g.originPortIds?.some((id) => portIndex.get(id)?.basin === p.basin));
    regional.sort((a, b) => hash(`${p.id}:${a.id}`) - hash(`${p.id}:${b.id}`));
    for (const g of regional) {
      if (size(p) >= 28) break;
      if (catalogs.get(p.id)!.has(g.id)) continue;
      add(p, g.id);
      p.demands.push(g.id);
    }
  }

  return new Map(ports.map((p) => [p.id, [...catalogs.get(p.id)!].map((id) => goodIndex.get(id)!).sort((a, b) =>
    Number(p.produces.includes(b.id)) - Number(p.produces.includes(a.id)) || a.era - b.era || a.name.localeCompare(b.name, "zh-CN"),
  )]));
}
