# EastWise — 部署指南

> I Ching & Chinese Astrology 云端版（免费卦象 + 付费解读）

## 项目结构

```
eastwise-deploy/
├── index.html        # 前端（起卦/八字，英文界面，调 /api）
├── api/
│   ├── jiedu.js      # 起卦解读接口（服务端调用 DeepSeek）
│   └── bazi.js       # 八字解读接口
├── lib/
│   └── deepseek.js   # DeepSeek 调用封装（Key 从环境变量读取）
├── vercel.json       # Vercel 配置
└── package.json
```

**关键点**：DeepSeek Key 只放在 Vercel 的环境变量里，前端代码里没有 Key，不会被泄露。

---

## 部署步骤（全程网页操作，约 10 分钟）

### 第 1 步：在 GitHub 创建仓库

1. 登录 github.com
2. 右上角「+」→「New repository」
3. Repository name 填 `eastwise`，选 **Public** 或 **Private** 都行
4. 点「Create repository」

### 第 2 步：上传代码到仓库

进入刚创建的仓库页面，点「uploading an existing file」（或「Add file → Upload files」），把本地 `eastwise-deploy` 文件夹里的所有文件**拖拽上传**，然后点「Commit changes」。

> 需要上传的文件：`index.html`、`api/` 目录（2 个 js）、`lib/` 目录（1 个 js）、`vercel.json`、`package.json`、`.gitignore`

### 第 3 步：在 Vercel 导入项目

1. 打开 vercel.com，用 GitHub 账号登录
2. 点「Add New → Project」
3. 授权并选择刚才的 `eastwise` 仓库
4. Vercel 会自动识别（无需改任何构建配置），点「Deploy」

### 第 4 步：配置环境变量（关键！）

部署后进入项目 →「Settings → Environment Variables」，添加：

| Key | Value |
|---|---|
| `DEEPSEEK_API_KEY` | `sk-7bdbe5201df443af884664989dbf196a` |

添加后点「Save」，然后 **Redeploy**（重新部署）使变量生效。

### 第 5 步：访问

部署完成后，Vercel 会给你一个免费网址（如 `https://eastwise-xxx.vercel.app`），打开即可使用。

---

## 当前状态与后续

- ✅ 免费展示卦象 / 八字排盘
- ✅ 付费墙 UI（点击「Unlock Reading」预览解读）
- ⬜ 第 3 步：接入 Stripe 真支付（替换「Unlock」为真实支付流程）
- ⬜ 第 4 步：绑定正式域名

> 说明：目前「Unlock Reading」是模拟付费（点击即预览），真正的支付在第 3 步接入 Stripe 后实现。
