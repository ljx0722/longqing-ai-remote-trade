import type { Port } from "../data";
type Row = [string, string, string, number, number, number, string];
const rows: Row[] = [
  ["shanghai", "上海", "长江口", 7, 121.47, 31.23, "china"],
  ["hong-kong", "香港", "珠江口东岸", 9, 114.16, 22.28, "china"],
  ["xinan", "新安（深圳）", "珠江口东岸", 9, 113.93, 22.54, "china"],
  ["temasek", "淡马锡（新加坡）", "马来半岛南端", 7, 103.85, 1.29, "southeast"],
  ["oslo", "奥斯陆", "奥斯陆峡湾", 6, 10.75, 59.91, "baltic"],
  ["helsinki", "赫尔辛基", "芬兰湾", 9, 24.94, 60.17, "baltic"],
  ["st-petersburg", "圣彼得堡", "涅瓦河口", 10, 30.31, 59.94, "baltic"],
  ["rostock", "罗斯托克", "波罗的海南岸", 6, 12.1, 54.09, "baltic"],
  ["rotterdam", "鹿特丹", "莱茵河口", 7, 4.48, 51.92, "atlantic"],
  ["le-havre", "勒阿弗尔", "塞纳河口", 8, 0.11, 49.49, "atlantic"],
  ["anfa", "安法（卡萨布兰卡）", "摩洛哥大西洋岸", 7, -7.62, 33.59, "atlantic"],
  ["goree", "戈雷岛（达喀尔）", "塞内加尔海岸", 9, -17.4, 14.67, "atlantic"],
  ["lagos", "拉各斯", "几内亚湾", 8, 3.39, 6.45, "atlantic"],
  ["luanda", "罗安达", "安哥拉海岸", 9, 13.23, -8.81, "atlantic"],
  ["delagoa", "德拉戈阿湾（马普托）", "非洲东南岸", 9, 32.59, -25.97, "indian"],
  [
    "toamasina",
    "塔马塔夫（图阿马西纳）",
    "马达加斯加东岸",
    9,
    49.4,
    -18.15,
    "indian",
  ],
  ["kuwait", "科威特", "波斯湾西北岸", 10, 47.98, 29.38, "gulf"],
  ["karachi", "卡拉奇", "印度河三角洲西部", 10, 67.01, 24.86, "indian"],
  ["bombay", "孟买", "印度西岸", 9, 72.83, 18.93, "indian"],
  ["madras", "马德拉斯（金奈）", "印度东岸", 9, 80.28, 13.08, "indian"],
  ["calcutta", "加尔各答", "恒河三角洲", 10, 88.36, 22.57, "indian"],
  ["dhaka", "达卡", "恒河三角洲东北部", 9, 90.41, 23.81, "indian"],
  ["bangkok", "曼谷", "湄南河口", 9, 100.5, 13.75, "southeast"],
  ["dagon", "大光（仰光）", "伊洛瓦底江三角洲", 8, 96.16, 16.8, "southeast"],
];
export const majorPorts: Port[] = rows.map(
  ([id, name, region, era, lon, lat, basin]) => ({
    id,
    name,
    region,
    era,
    x: lon / 180,
    y: lat / 90,
    basin,
    polity: region,
    produces: ["grain", "pottery"],
    demands: ["iron", "linen"],
    danger: 0.18,
    type: [
      "shanghai",
      "rotterdam",
      "st-petersburg",
      "calcutta",
      "dhaka",
      "bangkok",
      "dagon",
    ].includes(id)
      ? "river"
      : id === "goree"
        ? "island"
        : "coastal",
    specialty: Math.abs(lat) > 40 ? "木材、粮食与手工业" : "地域物产与沿岸集散",
    climate:
      Math.abs(lat) > 40
        ? "温带"
        : Math.abs(lat) < 24
          ? "热带与季风"
          : "亚热带",
  }),
);
