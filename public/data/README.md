# 世界地理底图

`land.geojson` 同时用于连续世界地形渲染和海上寻路。坐标为 WGS84 经纬度，属于游戏尺度的现代海岸简化数据，不代表任一历史年代的精确海岸，该海岸文件本身不包含街道、地形高程或全部岛屿；本轮新增的相对起伏栅格见下文。

底图来自 **Natural Earth**（Public Domain，公有领域），原有 1:110m 大陆及岛屿的全部几何保持不变。为避免主要商贸岛屿在地图上缺失，从同源 1:50m land 数据补入 9 个完整岛屿多边形：马耳他、罗得岛、马德拉岛、亚速尔圣米格尔岛、冲绳岛、桑给巴尔岛、毛里求斯岛、留尼汪岛、济州岛。没有以手绘轮廓代替现实岛屿，也没有扩展为现代城市时间线。

合并后为 136 个地理要素、5,301 个经纬度顶点、143,640 字节；相比原底图仅增加 158 个顶点。

来源：

- [Natural Earth 数据使用条款](https://www.naturalearthdata.com/about/terms-of-use/)
- [1:110m land 原始 GeoJSON](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson)
- [1:50m land 原始 GeoJSON](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_land.geojson)

项目中的原始输入副本保存在 `work/land-110m-original.geojson` 和 `work/ne50-land.geojson`。对应 SHA-256：

- 110m：`9e0729ee253ca7d7a5c4ae9395fb1902264c5377c52e224d13dd85010e2835d9`
- 50m：`e874b27a51d146452be360cafb3cc50c86001074a67d534113e6534682f9826b`

从工程根目录执行 `node work/augment-world-islands.mjs` 可重复生成本文件；加上 `--check-routes` 可验证代表性岛屿航线的规划和实际航行。脚本通过岛内真实经纬度定位源多边形，检查原底图不存在对应陆地、岛屿与原有海岸无交叠，并保留原始多边形，不做运行时在线下载。

## 全球地表起伏

`earth-elevation.jpg` 是 Tom Patterson 的 **Natural Earth III** 全球地形起伏图，经 Bjørn Sandvik 的 WebGL Earth 示例仓库提供。作者文章明确说明了地图来源。原图为 4096 × 2048，SHA-256 为 `078ce6b67ad45594bda48e5c98a60b68375174a8142f613ca4fd6041c8439341`。

- [地图作者与原始图集](https://www.shadedrelief.com/natural3/)
- [示例作者对地图来源的说明](https://blog.mastermaps.com/2013/09/creating-webgl-earth-with-threejs.html)
- [本项目采用的原始起伏图](https://raw.githubusercontent.com/turban/webgl-earth/master/images/elev_bump_4k.jpg)

`elevation.bin` 是原图转灰度并以 Lanczos 缩至 1024 × 512 的无头字节数组，按北到南、西到东存储，524,288 字节。SHA-256 为 `ddbde922995bc2067b198d80d40c003a37789a5b5601dc7271438fe1286373f2`。运行 `python work/prepare-terrain-assets.py` 可重建，需 Pillow。

游戏用双线性采样抬升真实海岸多边形内的地表，并压缩垂直尺度。这是**相对地貌图，不是以米为单位的测量 DEM**；山地模型依据主要山脉走向补充表现，河道使用简化实际河网，森林和沙漠为实际地理大区的近似分布。地表细纹、树群、沙丘与农田为本地程序生成，不是每棵树、每片农田的遥感复原。起伏图已随游戏打包并加入离线缓存，运行不请求外部地图服务。
