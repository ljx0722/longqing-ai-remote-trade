/** Historical urban centers. Coordinates are city centers, not invented map tiles. */
const records = `
dongguan|东莞|珠江三角洲|9|113.75|23.02|xinan guangzhou
hamar|哈马尔|挪威内陆湖区|6|11.07|60.79|oslo
hameenlinna|海门林纳|芬兰湖区|9|24.47|61.00|helsinki
beijing|北京|华北平原|5|116.40|39.90|jinan tianjin datong
tianjin|天津|海河平原|7|117.20|39.13|beijing jinan
taiyuan|太原|汾河谷地|5|112.55|37.87|datong luoyang
datong|大同|晋北|6|113.30|40.08|beijing taiyuan
jinan|济南|山东|5|117.12|36.65|dengzhou kaifeng
kaifeng|开封|黄河中下游|5|114.31|34.80|luoyang xuzhou
anyang|安阳|中原北部|5|114.39|36.10|kaifeng taiyuan
xuzhou|徐州|淮海平原|5|117.28|34.20|yangzhou kaifeng
suzhou|苏州|江南|6|120.59|31.30|hangzhou yangzhou shanghai
hefei|合肥|江淮|7|117.23|31.82|nanjing nanchang
nanchang|南昌|鄱阳湖平原|6|115.86|28.68|jingdezhen changsha
changsha|长沙|湘江谷地|5|112.94|28.23|guangzhou guilin
guilin|桂林|桂东北|5|110.30|25.27|guangzhou changsha kunming
kunming|昆明|滇池盆地|7|102.83|24.88|guilin dali
dali|大理|洱海盆地|6|100.23|25.60|kunming chengdu
lanzhou|兰州|黄河上游|5|103.83|36.06|changan dunhuang
dunhuang|敦煌|河西走廊|5|94.66|40.14|lanzhou turpan
turpan|吐鲁番|吐鲁番盆地|6|89.19|42.95|dunhuang kashgar
kashgar|喀什|塔里木盆地西部|6|75.99|39.47|turpan khotan samarkand
khotan|和田|昆仑山北麓|6|79.93|37.11|kashgar
lhasa|拉萨|拉萨河谷|6|91.13|29.65|chengdu kathmandu
yinchuan|兴庆府|宁夏平原|6|106.23|38.49|lanzhou taiyuan
hohhot|归化城|土默川|9|111.75|40.84|datong
lahore|拉合尔|旁遮普|6|74.36|31.55|multan delhi
multan|木尔坦|印度河支流平原|3|71.47|30.20|mohenjo-daro taxila karachi
taxila|塔克西拉|犍陀罗|3|72.84|33.75|multan kabul
kabul|喀布尔|兴都库什南麓|6|69.17|34.56|taxila balkh
balkh|巴尔赫|巴克特里亚|6|66.90|36.76|samarkand herat
agra|阿格拉|亚穆纳河|6|78.01|27.18|delhi varanasi
varanasi|瓦拉纳西|恒河中游|6|82.97|25.32|pataliputra agra
jaipur|斋浦尔|拉贾斯坦|10|75.79|26.91|agra ahmedabad
ahmedabad|艾哈迈达巴德|古吉拉特|7|72.57|23.02|cambay ujjain
srinagar|斯利那加|克什米尔谷地|6|74.80|34.08|lahore taxila
hyderabad|海得拉巴|德干高原|9|78.49|17.39|masulipatnam bijapur
bijapur|比贾布尔|德干西部|7|75.71|16.83|goa mysore bombay
mysore|迈索尔|卡纳塔克|7|76.64|12.30|calicut bangalore
bangalore|班加罗尔|卡纳塔克高原|8|77.59|12.97|mysore kanchipuram
thanjavur|坦贾武尔|高韦里三角洲|6|79.14|10.79|nagapattinam madurai
kanchipuram|建志补罗|泰米尔北部|8|79.70|12.83|pulicat thanjavur madras
anuradhapura|阿努拉德普勒|斯里兰卡内陆|6|80.39|8.31|colombo kandy
kandy|康提|斯里兰卡高地|7|80.63|7.29|colombo galle
kathmandu|加德满都|尼泊尔谷地|6|85.32|27.72|varanasi
thimphu|廷布|喜马拉雅南坡|9|89.64|27.47|kathmandu pataliputra
bagan|蒲甘|伊洛瓦底江谷地|6|94.86|21.17|pegu ava dagon
ava|阿瓦|缅甸中部|7|95.98|21.85|bagan
chiangmai|清迈|泰北山间盆地|7|98.98|18.79|sukhothai luang-prabang
sukhothai|素可泰|泰国中北部|7|99.82|17.01|ayutthaya chiangmai bangkok
angkor|吴哥|洞里萨湖平原|7|103.87|13.41|ayutthaya phnom-penh
phnom-penh|金边|湄公河下游|8|104.93|11.56|angkor saigon
luang-prabang|琅勃拉邦|湄公河上游|7|102.14|19.89|chiangmai vientiane
vientiane|万象|湄公河谷地|7|102.63|17.98|luang-prabang hue
hanoi|升龙|红河三角洲|8|105.85|21.03|hue hoi-an
hue|顺化|越南中部|8|107.59|16.46|hoi-an
saigon|嘉定|湄公河三角洲东缘|9|106.70|10.78|phnom-penh hoi-an
bandung|万隆|爪哇西部高地|9|107.62|-6.92|batavia banten
surakarta|梭罗|爪哇中部|10|110.83|-7.57|gresik bandung
seoul|汉城|朝鲜半岛中西部|7|126.98|37.57|busan jeonju
jeonju|全州|朝鲜半岛西南部|7|127.15|35.82|busan seoul
nara|奈良|日本大和盆地|7|135.80|34.68|sakai kyoto
osaka|大阪|日本摄津|7|135.50|34.69|sakai kyoto
nagoya|名古屋|日本尾张|9|136.91|35.18|kyoto edo
edo|江户|日本关东|9|139.69|35.69|nagoya
tashkent|塔什干|中亚绿洲|6|69.24|41.30|samarkand kashgar
herat|赫拉特|哈里河谷|6|62.20|34.35|mashhad balkh
isfahan|伊斯法罕|伊朗高原中部|4|51.68|32.65|persepolis ecbatana
shiraz|设拉子|法尔斯|4|52.58|29.59|persepolis siraf
mashhad|马什哈德|呼罗珊|6|59.62|36.30|ecbatana herat
tabriz|大不里士|伊朗西北部|5|46.29|38.08|ecbatana erzurum
qazvin|加兹温|厄尔布尔士山南麓|6|50.00|36.27|tabriz isfahan
tehran|德黑兰|伊朗高原北缘|9|51.39|35.69|qazvin mashhad
ankara|安卡拉|安纳托利亚中部|3|32.86|39.93|sinope hattusa
konya|科尼亚|安纳托利亚南部|4|32.49|37.87|ankara smyrna
erzurum|埃尔祖鲁姆|安纳托利亚东部|4|41.27|39.90|trebizond tabriz
jerusalem|耶路撒冷|犹太山地|2|35.21|31.77|jaffa damascus
amman|安曼|约旦高地|2|35.91|31.95|damascus jerusalem
mosul|摩苏尔|底格里斯河|4|43.12|36.34|nineveh baghdad
baghdad|巴格达|两河中部|5|44.37|33.32|basra babylon kuwait
mecca|麦加|汉志|5|39.86|21.42|jeddah medina
medina|麦地那|汉志绿洲|5|39.61|24.47|jeddah mecca
sanaa|萨那|也门高地|5|44.21|15.37|aden taiz
taiz|塔伊兹|也门山地|5|44.02|13.58|aden mocha
diriyah|德拉伊耶|内志绿洲|8|46.58|24.74|medina
madrid|马德里|伊比利亚中部|8|-3.70|40.42|toledo salamanca
toledo|托莱多|塔霍河|6|-4.03|39.86|malaga burgos
granada|格拉纳达|安达卢西亚|6|-3.60|37.18|malaga cordoba
salamanca|萨拉曼卡|卡斯蒂利亚|6|-5.66|40.97|porto toledo
burgos|布尔戈斯|卡斯蒂利亚北部|6|-3.70|42.34|barcelona toledo
toulouse|图卢兹|加龙河谷|6|1.44|43.60|bordeaux marseille
avignon|阿维尼翁|罗讷河|6|4.81|43.95|marseille lyon
reims|兰斯|香槟|6|4.03|49.26|paris strasbourg
strasbourg|斯特拉斯堡|莱茵河谷|6|7.75|48.58|paris frankfurt
zurich|苏黎世|瑞士高原|6|8.54|47.38|milan augsburg
bern|伯尔尼|瑞士高原西部|6|7.45|46.95|lyon zurich
vienna|维也纳|多瑙河|6|16.37|48.21|venice budapest prague
prague|布拉格|波希米亚|6|14.42|50.08|nuremberg berlin
frankfurt|法兰克福|美因河|6|8.68|50.11|bremen cologne nuremberg
nuremberg|纽伦堡|法兰克尼亚|6|11.08|49.45|munich prague
cologne|科隆|莱茵河|6|6.96|50.94|bruges antwerp rotterdam
munich|慕尼黑|巴伐利亚|6|11.58|48.14|venice augsburg
augsburg|奥格斯堡|施瓦本|6|10.90|48.37|munich zurich
berlin|柏林|勃兰登堡|6|13.40|52.52|hamburg gdansk rostock
warsaw|华沙|维斯瓦河|6|21.01|52.23|gdansk krakow
krakow|克拉科夫|波兰南部|6|19.94|50.06|warsaw budapest
budapest|布达与佩斯|多瑙河中游|6|19.04|47.50|split belgrade vienna
belgrade|贝尔格莱德|萨瓦河口|6|20.46|44.82|ragusa sofia
sofia|索菲亚|巴尔干内陆|4|23.32|42.70|thessaloniki constantinople
bucharest|布加勒斯特|瓦拉几亚|7|26.10|44.43|sofia belgrade
kyiv|基辅|第聂伯河|6|30.52|50.45|smolensk minsk
smolensk|斯摩棱斯克|第聂伯河上游|6|32.05|54.78|novgorod moscow st-petersburg
moscow|莫斯科|莫斯科河|6|37.62|55.75|novgorod smolensk
vilnius|维尔纽斯|立陶宛内陆|6|25.28|54.69|riga minsk
minsk|明斯克|白俄罗斯|6|27.56|53.90|vilnius smolensk
york|约克|英格兰北部|6|-1.08|53.96|bristol edinburgh
oxford|牛津|英格兰中南部|6|-1.26|51.75|bristol london
cambridge|剑桥|英格兰东部|10|0.12|52.21|london york
stirling|斯特灵|苏格兰中部|6|-3.94|56.12|edinburgh
marrakech|马拉喀什|阿特拉斯山北麓|6|-7.98|31.63|tangier fez anfa
meknes|梅克内斯|摩洛哥内陆|6|-5.55|33.89|fez tangier
tlemcen|特莱姆森|阿尔及利亚西部|6|-1.32|34.88|algiers fez
constantine|君士坦丁|阿尔及利亚东北部|6|6.61|36.36|tunis algiers
kairouan|凯鲁万|突尼斯内陆|5|10.10|35.68|tunis tripoli
ghadames|盖达米斯|撒哈拉北缘|6|9.50|30.13|tripoli kairouan
sijilmasa|锡吉勒马萨|撒哈拉绿洲|8|-4.25|31.28|marrakech arguin
timbuktu|廷巴克图|尼日尔河北岸|8|-3.00|16.77|sijilmasa gao djenne
gao|加奥|尼日尔河中游|8|-0.05|16.27|timbuktu kano
djenne|杰内|尼日尔河内三角洲|8|-4.55|13.91|timbuktu bamako
bamako|巴马科|尼日尔河上游|8|-8.00|12.64|djenne
kano|卡诺|豪萨地区|8|8.52|12.00|benin oyo
oyo|奥约|约鲁巴内陆|8|3.92|8.15|benin accra lagos
abomey|阿波美|西非内陆|9|1.98|7.18|accra oyo
kumasi|库马西|西非森林带|9|-1.62|6.69|accra elmina
aksum|阿克苏姆|埃塞俄比亚高原|4|38.72|14.12|adulis lalibela
lalibela|拉利贝拉|埃塞俄比亚高原中部|6|39.05|12.03|aksum gondar
gondar|贡德尔|埃塞俄比亚高原西部|9|37.47|12.60|massawa lalibela
harar|哈勒尔|非洲之角高地|6|42.12|9.31|mogadishu aksum
great-zimbabwe|大津巴布韦|非洲东南部高原|6|30.93|-20.27|sofala delagoa
mbanza-kongo|姆班扎刚果|刚果内陆|8|14.24|-6.27|bonny luanda
quito|基多|安第斯北部|8|-78.47|-0.18|guayaquil cuenca-ecuador
cuenca-ecuador|昆卡|厄瓜多尔高地|8|-79.00|-2.90|guayaquil quito
bogota|波哥大|哥伦比亚高原|8|-74.07|4.71|cartagena medellin
medellin|麦德林|阿布拉谷地|9|-75.56|6.24|cartagena bogota
arequipa|阿雷基帕|秘鲁南部高地|8|-71.54|-16.40|callao cusco
la-paz|拉巴斯|安第斯高原|8|-68.15|-16.50|cusco potosi
potosi|波托西|安第斯矿区|8|-65.75|-19.59|la-paz sucre
sucre|拉普拉塔|玻利维亚高地|8|-65.26|-19.04|potosi salta
salta|萨尔塔|南美西北部|8|-65.41|-24.79|tucuman potosi
tucuman|图库曼|南美内陆|8|-65.20|-26.81|cordoba-argentina buenos-aires
cordoba-argentina|科尔多瓦新城|拉普拉塔内陆|8|-64.18|-31.42|buenos-aires
asuncion|亚松森|巴拉圭河|8|-57.64|-25.26|buenos-aires
santiago-chile|圣地亚哥|智利中央谷地|8|-70.67|-33.45|valparaiso
sao-paulo|圣保罗|巴西高原东缘|8|-46.63|-23.55|rio
ouro-preto|维拉里卡|巴西矿区|9|-43.51|-20.38|rio sao-paulo
puebla|普埃布拉|墨西哥高原东缘|8|-98.20|19.04|veracruz mexico-city
oaxaca|瓦哈卡|墨西哥南部高原|8|-96.73|17.07|acapulco puebla
guadalajara|瓜达拉哈拉|墨西哥西部|8|-103.35|20.68|mexico-city
morelia|巴利亚多利德|墨西哥中部|8|-101.19|19.70|mexico-city guadalajara
merida|梅里达|尤卡坦半岛|8|-89.59|20.97|veracruz guatemala
guatemala|危地马拉城|危地马拉高地|8|-90.73|14.56|oaxaca leon-nicaragua
leon-nicaragua|莱昂|尼加拉瓜低地|8|-86.88|12.44|guatemala cartago
cartago|卡塔戈|哥斯达黎加高地|8|-83.92|9.86|panama
santa-fe|圣菲|北美西南部高原|9|-105.94|35.69|mexico-city
philadelphia|费城|特拉华河|9|-75.16|39.95|new-amsterdam williamsburg
williamsburg|威廉斯堡|弗吉尼亚|9|-76.71|37.27|philadelphia
montreal|蒙特利尔|圣劳伦斯河|9|-73.57|45.50|quebec albany
albany|奥尔巴尼|哈德逊河上游|9|-73.76|42.65|new-amsterdam montreal
antananarivo|塔那那利佛|马达加斯加高地|9|47.51|-18.88|toamasina
detroit|底特律|北美五大湖|10|-83.05|42.33|montreal
`.trim();

export const additionalInlandCities = records.split("\n").map((line) => {
  const [id, name, region, era, lon, lat, connections] = line.split("|");
  return {
    id: id.replaceAll(" ", ""),
    name,
    region,
    era: Number(era),
    lon: Number(lon),
    lat: Number(lat),
    connections: connections.split(" "),
  };
});
export const additionalRoadWaypoints: Record<string, number[][]> = {
  "merida:veracruz": [
    [-90.5, 19.1],
    [-91.7, 18.4],
    [-94.3, 18.0],
  ],
  "dengzhou:jinan": [
    [120.4, 37.3],
    [119.3, 36.7],
  ],
  "hanoi:hue": [
    [105.8, 19.2],
    [106.3, 18.0],
    [107.0, 16.8],
  ],
  "kairouan:tripoli": [
    [10.1, 34.0],
    [10.5, 32.7],
    [12.0, 32.3],
  ],
  "cartago:panama": [
    [-83.2, 9.0],
    [-82.7, 8.7],
    [-81.4, 8.6],
    [-80.4, 8.5],
  ],
  "detroit:montreal": [
    [-81.3, 42.9],
    [-79.8, 43.5],
    [-77.2, 44.3],
    [-75.8, 45.0],
  ],
  "edo:nagoya": [
    [138.9, 35.3],
    [138.4, 35.0],
    [137.7, 34.9],
  ],
  "guangzhou:guilin": [
    [112.0, 23.9],
    [111.0, 24.6],
  ],
  "kashgar:samarkand": [
    [73.4, 39.6],
    [71.4, 40.5],
    [69.7, 40.3],
  ],
  "mbanza-kongo:bonny": [
    [12.5, -4.0],
    [11.4, -0.8],
    [10.7, 2.4],
    [9.5, 4.2],
  ],
  "bonny:mbanza-kongo": [
    [9.5, 4.2],
    [10.7, 2.4],
    [11.4, -0.8],
    [12.5, -4.0],
  ],
  "asuncion:buenos-aires": [
    [-58.6, -27.5],
    [-58.5, -30.5],
    [-58.5, -32.8],
  ],
  "hanoi:hoi-an": [
    [105.8, 19.2],
    [106.3, 18.0],
    [107.0, 16.8],
  ],
  "hoi-an:saigon": [
    [108.5, 14.8],
    [108.9, 12.0],
    [107.8, 11.0],
  ],
  "lhasa:chengdu": [
    [93.4, 29.7],
    [96.3, 30.1],
    [98.6, 30.9],
    [101.3, 30.0],
  ],
  "chengdu:lhasa": [
    [101.3, 30.0],
    [98.6, 30.9],
    [96.3, 30.1],
    [93.4, 29.7],
  ],
};
