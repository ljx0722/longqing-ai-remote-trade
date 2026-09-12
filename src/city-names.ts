/** Search aliases identify the same historical place; they do not add modern cities. */
const aliases: Record<string, string> = {
  changan: "西安 长安",
  constantinople: "伊斯坦布尔 君士坦丁堡",
  "new-amsterdam": "纽约 新阿姆斯特丹",
  batavia: "雅加达 巴达维亚",
  athens: "雅典 比雷埃夫斯",
  edinburgh: "爱丁堡 利斯",
  ragusa: "杜布罗夫尼克 拉古萨",
  smyrna: "伊兹密尔 士麦那",
  hohhot: "呼和浩特 归化城",
  yinchuan: "银川 兴庆府",
  hanoi: "河内 升龙",
  saigon: "胡志明市 西贡 嘉定",
  temasek: "新加坡 淡马锡",
  xinan: "深圳 新安",
  bombay: "孟买",
  madras: "金奈 马德拉斯",
  calcutta: "加尔各答",
  dagon: "仰光 大光",
  anfa: "卡萨布兰卡 安法",
  goree: "达喀尔 戈雷岛",
  delagoa: "马普托 德拉戈阿湾",
  toamasina: "图阿马西纳 塔马塔夫",
  tenochtitlan: "墨西哥城 特诺奇蒂特兰",
};

export function matchesCity(
  city: { id: string; name: string; region: string },
  query: string,
): boolean {
  const text =
    `${city.id} ${city.name} ${city.region} ${aliases[city.id] ?? ""}`.toLocaleLowerCase();
  return query
    .trim()
    .toLocaleLowerCase()
    .split(/\s+/)
    .every((word) => text.includes(word));
}

export function cityAlias(id: string, name: string): string {
  return (aliases[id] ?? "")
    .split(" ")
    .filter((alias) => alias && !name.includes(alias))
    .join("、");
}
