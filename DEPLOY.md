# Vercel 自动部署配置指南

## 📋 部署步骤

### 第一步：安装 Git

1. 下载 Git: https://git-scm.com/download/win
2. 安装后打开终端验证: `git --version`

### 第二步：配置 Git

```bash
git config --global user.name "你的用户名"
git config --global user.email "你的邮箱"
```

### 第三步：创建 GitHub 仓库

1. 登录 https://github.com
2. 点击 "+" → "New repository"
3. Repository name: `shouzwan`
4. 选择 Public
5. 点击 "Create repository"

### 第四步：获取 Vercel Token

1. 登录 https://vercel.com
2. 点击右上角头像 → Settings
3. 左侧菜单选择 "Tokens"
4. 点击 "Create Token"
5. 输入 Token 名称，选择有效期
6. 复制生成的 Token（只显示一次）

### 第五步：配置 GitHub Secrets

1. 打开你的 GitHub 仓库
2. Settings → Secrets and variables → Actions
3. 点击 "New repository secret"
4. Name: `VERCEL_TOKEN`
5. Value: 粘贴你的 Vercel Token
6. 点击 "Add secret"

### 第六步：初始化并推送代码

```bash
# 进入项目目录
cd c:\Users\18829\Desktop\B

# 初始化 Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: 手赚网项目"

# 设置主分支
git branch -M main

# 添加远程仓库
git remote add origin https://github.com/你的用户名/shouzwan.git

# 推送到 GitHub
git push -u origin main
```

### 第七步：自动部署

推送成功后，GitHub Actions 会自动触发部署：
- 查看: 仓库 → Actions 标签页
- 约 1-2 分钟完成部署

---

## 🌐 访问地址

部署完成后访问:
- 前端: `https://shouzwan.vercel.app`
- 后台: `https://shouzwan.vercel.app/admin.html`
- API: `https://shouzwan.vercel.app/api/...`

---

## 🔄 后续更新

每次修改代码后，只需:

```bash
git add .
git commit -m "更新说明"
git push
```

GitHub Actions 会自动重新部署！

---

## 📁 文件说明

| 文件 | 作用 |
|------|------|
| `vercel.json` | Vercel 部署配置 |
| `.github/workflows/deploy.yml` | GitHub Actions 自动部署脚本 |
| `.gitignore` | 排除不需要上传的文件 |

---

## ❓ 常见问题

### Q: 部署失败怎么办？
查看 Actions 页面的错误日志，常见原因:
- VERCEL_TOKEN 未配置或过期
- 依赖安装失败

### Q: 如何绑定自定义域名？
1. Vercel 项目设置 → Domains
2. 添加域名
3. 在域名服务商配置 DNS 解析

### Q: 如何查看部署日志？
- Vercel 控制台 → 项目 → Deployments
- GitHub → Actions → 查看运行记录