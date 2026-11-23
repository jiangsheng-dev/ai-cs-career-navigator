# AI赋能计算机学子成才领航系统

面向计算机专业学生的成长路线工作台：把「大一到大四该做什么」串成一条可执行的路线，覆盖比赛、证书、专升本、考研、考公与就业。
## 在线使用

点开即用，无需安装：

- **工作台**：https://jiangsheng-dev.github.io/ai-cs-career-navigator/
- **小程序网页预览**：https://jiangsheng-dev.github.io/ai-cs-career-navigator/wechat-miniprogram-preview.html

## 功能

- **学期路线**：大一上 → 大四下，共 8 个阶段，可按学期和省份筛选
- **赛证 · 路线时间图**：把比赛、证书、专升本、考研、考公的报名 / 备赛 / 考试 / 比赛节点排到 12 个月上
- **往届资源库**：获奖作品拆解、申报书 / 计划书 / 作品说明书模板、真题样题、18 个项目池
- **智能体广场**：9 个专业 AI 助手，提供角色设定与对话
- **首页 AI 机器人**：右下角可拖动的机器人，支持专业咨询与闲聊
- **就业岗位地图**：8 个专业方向、22 个岗位，含技能、加分项与去向
- **微信小程序**：倒计时、记事本、定时提醒、写入手机日历

## 目录

```text
.
├── index.html                      # 主工作台（单文件，含样式与交互）
├── wechat-miniprogram-preview.html # 小程序网页预览
├── assets/
│   ├── miniprogram-qr.png          # 小程序体验版二维码
│   └── web-llm/                    # 随站点发布的 WebLLM 0.2.89 运行库与模型运行文件
└── miniprogram/                    # 微信小程序源码
    ├── pages/                      # 倒计时 / 选择 / 详情 / 提醒
    ├── utils/                      # 数据、日期、存储、日历
    ├── cloudfunctions/login/       # 可选：openid 自动绑定
    └── tools/export-catalog.js     # 从 index.html 重新导出数据

```

## 本地运行

直接双击 `index.html` 可以浏览基础界面；本地 AI 建议通过静态服务器打开：

```bash
python -m http.server 8000
# 访问 http://127.0.0.1:8000/
```

首页 AI 默认使用浏览器本地模型（Qwen2.5-0.5B，WebGPU）。WebLLM 运行库和两个模型运行文件已随站点发布，不再依赖单一 CDN；首次仍需从国内镜像下载约 400MB 模型权重，后续使用浏览器缓存。

### AI 本地模型加载失败？

- 需要最新版 Chrome / Edge，并且设备和浏览器支持 **WebGPU**（部分老显卡、虚拟机、远程桌面不支持）
- 页面会优先加载本地运行库；若失败，会自动尝试 esm.sh、jsDelivr、esm.run 三条线路
- 模型权重优先从 `hf-mirror.com` 获取；国内网络或校园网仍可能限制大文件下载
- 可打开「智能体广场 → 模型设置」切换 **API 模式**（需要自己的 API Key）
- 网页版预览和小程序不依赖这个模型，可以正常使用

## 部署到 GitHub Pages

1. 新建一个 **public** 仓库
2. 把本目录下的所有文件上传到仓库根目录
3. 仓库 → Settings → Pages → Source 选「Deploy from a branch」→ `main` / `/ (root)`
4. 访问 `https://<你的用户名>.github.io/<仓库名>/`

`index.html` 已在根目录，指向 `wechat-miniprogram-preview.html` 的相对链接可以直接使用。

## 微信小程序

1. 微信开发者工具 → 导入项目 → 选择 `miniprogram/`
2. `project.config.json` 中的 AppID 已置为 `touristappid`，请换成自己的小程序 AppID
3. 真机预览即可测试倒计时、记事本、写入手机日历

配置细节见 [miniprogram/README.md](miniprogram/README.md)。

## 数据与更新

- 赛证时间按往年规律与 2026 年官方报名信息整理，具体以当年官方通知为准
- 小程序数据快照可通过以下命令重新导出（会读取仓库根目录的 `index.html`）：
  ```bash
  cd miniprogram
  node tools/export-catalog.js
  ```
- **二维码为体验版，有效期至 2026-11-29**；公开前请替换 `assets/miniprogram-qr.png`，并同步更新 `index.html` 中内嵌的二维码图片

## 隐私说明

- 勾选进度、待办、目标和提醒只保存在浏览器 `localStorage`，不上传服务器
- AI API Key 只保存在本机浏览器
- 清除浏览器数据或换设备会丢失进度

## License

本项目采用 [MIT License](LICENSE)。

第三方依赖：Lucide 图标、WebLLM 0.2.89（随站点发布，Apache-2.0），本地模型运行文件与权重来自 MLC。WebLLM 许可证见 `assets/web-llm/LICENSE`。
