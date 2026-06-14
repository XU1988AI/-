# 手赚网 - 平台数据展示网站

一个现代化的平台数据展示网站，支持应用管理、数据统计、用户管理等功能。

## 🎯 功能特性

- ✅ 平台数据统计
- ✅ 应用分类展示
- ✅ 赚钱项目推荐
- ✅ 最近更新展示
- ✅ 热门排行榜
- ✅ 管理后台系统
- ✅ 自动部署集成

## 🚀 技术栈

- **前端**: HTML5, CSS3, JavaScript
- **后端**: Node.js, Express
- **部署**: Vercel, GitHub Actions

## 📁 项目结构

```
├── public/              # 前端静态文件
│   ├── index.html      # 首页
│   ├── admin.html      # 管理后台
│   └── assets/         # 静态资源
├── server.js           # 后端服务器
├── vercel.json         # Vercel 配置
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Actions 配置
```

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动服务器
npm start

# 访问 http://localhost:3000
```

### 管理后台

- 地址: http://localhost:3000/admin.html
- 用户名: admin
- 密码: admin123

## 🌐 部署

本项目配置了 GitHub Actions 自动部署到 Vercel。

### 自动部署

每次推送到 `main` 分支时，GitHub Actions 会自动：
1. 安装依赖
2. 构建项目
3. 部署到 Vercel

### 手动部署

1. 在 GitHub Actions 页面
2. 选择 "Deploy to Vercel" 工作流
3. 点击 "Run workflow"
4. 选择 production 环境并运行

## 📊 API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/apps` | GET | 获取应用列表 |
| `/api/stats` | GET | 获取统计数据 |
| `/api/categories` | GET | 获取分类列表 |

## 🔧 配置

### Vercel 配置

需要在 GitHub Secrets 中配置以下变量：

- `VERCEL_TOKEN`: Vercel 访问令牌
- `VERCEL_PROJECT_ID`: 项目 ID
- `VERCEL_ORG_ID`: 组织 ID

详细配置请参考 [VERCEL_DEPLOY_GUIDE.md](VERCEL_DEPLOY_GUIDE.md)

## 📝 License

MIT License

## 👨‍💻 作者

手赚网开发团队

## 🔗 相关链接

- 🌐 网站地址: https://vercel.app
- 📦 GitHub 仓库: https://github.com/XU1988AI/-
- 📚 Vercel 文档: https://vercel.com/docs
- 🐙 GitHub Actions: https://docs.github.com/cn/actions

---

**最后更新时间**: 2024年
