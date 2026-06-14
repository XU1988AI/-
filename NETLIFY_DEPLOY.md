# Netlify 自动部署配置

## 快速开始

### 方式 1: 拖拽部署（5 秒）

1. 打开 https://app.netlify.com/drop
2. 将 `public` 文件夹拖入页面
3. 获得临时网站地址！

### 方式 2: GitHub 自动部署（5 分钟）

1. 登录 https://app.netlify.com
2. 点击 **"Add new site"**
3. 选择 **"Import from Git"**
4. 点击 **"Install GitHub App"** 授权
5. 选择仓库 `XU1988AI/-`
6. 配置：
   - **Build command**: (留空)
   - **Publish directory**: `public`
7. 点击 **"Deploy site"**

---

## Netlify.toml 配置文件

在项目根目录创建 `netlify.toml`:

```toml
[build]
  publish = "public"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

---

## 使用 Netlify CLI

```bash
# 安装 CLI
npm install -g netlify-cli

# 登录
netlify login

# 初始化项目
cd public
netlify init

# 部署到生产环境
netlify deploy --prod

# 获取临时部署链接
netlify deploy
```

---

## 自定义域名

1. 在 Netlify 控制台点击 **"Domain settings"**
2. 点击 **"Add custom domain"**
3. 输入你的域名 (如 `shouzwan.com`)
4. 配置 DNS:
   - 添加 CNAME 记录指向 `[随机名].netlify.app`
5. 等待 HTTPS 自动配置

---

## 环境变量

在 Netlify 控制台设置：

- `NODE_ENV` = `production`
- `API_URL` = `你的API地址`

---

## 优点

- ✅ 无限站点和流量
- ✅ 自动 HTTPS
- ✅ 拖拽即可部署
- ✅ GitHub 自动部署
- ✅ 免费 CDN
- ✅ 表单处理
- ✅ 函数计算

---

## 缺点

- ⚠️ 免费版无后端（需要 Functions）
- ⚠️ 函数有请求限制
- ⚠️ 大文件上传限制（100MB）

---

## 对比 Vercel

| 功能 | Netlify | Vercel |
|------|---------|--------|
| 免费额度 | 无限 | 无限 |
| HTTPS | ✅ 自动 | ✅ 自动 |
| 自定义域名 | ✅ 免费 | ✅ 免费 |
| CDN | ✅ 全球 | ✅ 全球 |
| 后端函数 | ⚠️ Functions | ✅ Serverless |
| GitHub 集成 | ✅ | ✅ |

---

## 推荐配置

### 前端项目（推荐 Netlify）

```toml
[build]
  command = ""
  publish = "public"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 混合项目（Netlify + 后端 API）

```toml
[build]
  publish = "public"

[[redirects]]
  from = "/api/*"
  to = "https://your-api.railway.app/api/:splat"
  status = 200
  force = true
```

---

## 部署检查清单

- [x] public 文件夹存在
- [x] 包含 index.html
- [x] 包含 admin.html
- [x] 静态资源在 public/assets
- [x] netlify.toml 已配置（可选）

---

## 常见问题

### Q: 如何回滚？

Netlify 控制台 → Deploys → 选择之前的版本 → Promote

### Q: 如何禁用自动部署？

仓库设置 → Builds → Pause builds

### Q: 如何查看日志？

Netlify 控制台 → Functions → 查看函数日志

---

## 获取帮助

- 文档: https://docs.netlify.com
- 社区: https://community.netlify.com
- 支持: support@netlify.com
