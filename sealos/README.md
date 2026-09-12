# Sealos 发布说明

在 Sealos Cloud 的 App Launchpad 中选择“从 GitHub 导入”并填写：

- 仓库：`ljx0722/longqing-ai-remote-trade`
- 分支：`main`
- 构建方式：`Dockerfile`
- 应用名称：`longqing-remote-trade`
- 容器端口：`80`，协议 `HTTP`
- 副本：`1`
- CPU：`500m`；内存：`512Mi`
- 开启公网访问

仓库根目录的 `Dockerfile` 使用 Nginx 托管 `dist/`，`sealos/app-form.json` 是 App Launchpad 的表单预设，`deployment.yaml` 可用于已连接集群的 YAML 导入。部署完成后，应用名称会以 `longqing-remote-trade` 显示在 Sealos 应用列表。

当前命名空间的公网入口为 `https://longqing-remote-trade.sealoshzh.site/`；`sealos/ingress.yaml` 使用 Sealos App Launchpad 的应用标签和通配 TLS 证书，使应用在应用列表中按该名称归组显示。

如果选择镜像方式，先构建并推送 `ghcr.io/ljx0722/longqing-ai-remote-trade:latest`，再导入 `sealos/app-form.json`；若镜像仓库要求登录，在 Sealos 中添加对应的镜像仓库 Secret。
