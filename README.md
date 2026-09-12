# 长晴 AI · 远海商途

基于 WebGPU + Three.js（WebGL2 fallback）的连续 2.5D 历史航海贸易与城邦经营游戏。

## 本地开发

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

## 容器部署

Docker 镜像使用 Nginx 提供 `dist/` 静态资源，入口支持前端路由回退到 `index.html`。Sealos 部署时选择 Dockerfile 构建，容器端口填写 `80`，并开启公网访问。

推送到 `main` 后，GitHub Actions 会自动构建并推送 GHCR 镜像；工作流文件位于 `.github/workflows/container.yml`。

项目包含 11 个历史纪元、406 座城市和 1765 种贸易货物；运行时 AI 采用本地规则，不产生在线 Token 消耗。
