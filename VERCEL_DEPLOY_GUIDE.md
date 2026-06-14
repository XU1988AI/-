# GitHub Actions 自动部署指南

## 📋 概述

本项目使用 GitHub Actions 实现代码的自动部署功能。每次将代码推送到 `main` 分支时，都会自动触发部署流程。

## 🚀 功能特性

- ✅ **自动部署**：推送到 main 分支自动部署
- ✅ **手动触发**：支持手动选择部署环境
- ✅ **预览环境**：可部署到预览环境进行测试
- ✅ **生产环境**：自动部署到生产环境
- ✅ **部署通知**：显示部署结果和访问地址
- ✅ **错误处理**：失败时提供详细信息

---

## ⚙️ 配置步骤

### 步骤 1：在 Vercel 创建项目

1. 访问 [Vercel](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 **New Project**
4. 选择你的仓库（如果还没导入，点击 Import Git Repository）
5. 点击 **Deploy** 部署项目

### 步骤 2：获取 Vercel 配置信息

#### 获取 VERCEL_TOKEN

1. 登录 Vercel
2. 点击右上角头像 → **Settings**
3. 左侧菜单选择 **Tokens**
4. 点击 **Create Token**
5. 填写信息：
   - **Name**: `github-action`（或自定义名称）
   - **Scope**: 选择你的账号
   - **Expiration**: 选择有效期
6. 点击 **Create**
7. **复制生成的 Token**（只显示一次，请妥善保存）

#### 获取 VERCEL_ORG_ID

1. 登录 Vercel
2. 点击右上角头像 → **Settings**
3. 左侧菜单选择 **General**
4. 找到 **Organization ID**
5. 复制 ID（格式类似：`team_xxxxxxxxxxxxx`）

#### 获取 VERCEL_PROJECT_ID

1. 进入你创建的项目
2. 点击 **Settings**
3. 左侧菜单选择 **General**
4. 找到 **Project ID**
5. 复制 ID（格式类似：`prj_xxxxxxxxxxxxx`）

### 步骤 3：配置 GitHub Secrets

1. 打开你的 GitHub 仓库
2. 点击 **Settings** 标签
3. 左侧菜单选择 **Secrets and variables** → **Actions**
4. 点击 **New repository secret**，添加以下三个 Secrets：

#### 添加 VERCEL_TOKEN
- **Name**: `VERCEL_TOKEN`
- **Value**: 粘贴你复制的 Vercel Token

#### 添加 VERCEL_ORG_ID
- **Name**: `VERCEL_ORG_ID`
- **Value**: 粘贴你复制的 Organization ID

#### 添加 VERCEL_PROJECT_ID
- **Name**: `VERCEL_PROJECT_ID`
- **Value**: 粘贴你复制的 Project ID

---

## 📝 使用方法

### 自动部署（推荐）

每次将代码推送到 `main` 分支时，GitHub Actions 会自动触发部署：

```bash
git add .
git commit -m "更新说明"
git push origin main
```

### 手动部署

1. 打开 GitHub 仓库页面
2. 点击 **Actions** 标签
3. 选择 **Deploy to Vercel** 工作流
4. 点击 **Run workflow**
5. 选择部署环境：
   - `production`：部署到生产环境
   - `preview`：部署到预览环境
6. 点击 **Run workflow**

---

## 🔍 查看部署状态

### 在 GitHub Actions 查看

1. 打开仓库页面
2. 点击 **Actions** 标签
3. 查看工作流运行状态：
   - 🟡 **黄色圆圈**：正在运行
   - 🟢 **绿色对勾**：部署成功
   - 🔴 **红色叉号**：部署失败

### 点击失败的运行记录

1. 点击失败的工作流
2. 点击 `deploy-production` 任务
3. 展开各个步骤查看详细日志
4. 找到错误信息并修复

---

## 🌐 访问网站

部署成功后，访问以下地址：

| 环境 | 地址格式 | 示例 |
|------|----------|------|
| 生产环境 | `https://[项目名].vercel.app` | `https://shouzwan.vercel.app` |
| 预览环境 | `https://[项目名]-[随机字符串].vercel.app` | `https://shouzwan-abc123.vercel.app` |

---

## 🔧 常见问题

### Q1: 部署失败，显示 "No such file or directory"

**原因**：项目根目录缺少必要的文件

**解决**：确保项目包含以下文件：
- `package.json`
- `vercel.json`（Vercel 配置文件）
- `server.js`（后端服务）
- `public/` 目录（前端文件）

### Q2: 部署失败，显示 "VERCEL_TOKEN" is not defined

**原因**：未配置 GitHub Secrets

**解决**：
1. 确认已在 GitHub Secrets 中添加 `VERCEL_TOKEN`
2. 检查 Secret 名称是否完全匹配（包括大小写）
3. 确认 Token 未过期

### Q3: 部署成功但网站显示空白

**原因**：路由配置问题

**解决**：
1. 检查 `vercel.json` 中的路由配置
2. 确认 `server.js` 正确处理所有路由
3. 查看 Vercel 部署日志中的构建输出

### Q4: 如何回滚到之前的版本？

**方法一**：通过 GitHub Actions 回滚
1. 打开 Actions 页面
2. 找到成功的运行记录
3. 点击右侧的 **Re-run jobs**

**方法二**：通过 Vercel 回滚
1. 登录 Vercel
2. 进入项目
3. 点击 **Deployments**
4. 选择之前的版本
5. 点击 **...** → **Promote to Production**

### Q5: 如何禁用自动部署？

**方法**：修改工作流文件

在 `.github/workflows/deploy.yml` 中注释掉 `push` 触发器：

```yaml
on:
  # push:
  #   branches:
  #     - main
  workflow_dispatch:
```

---

## 📊 工作流说明

### 部署流程

```
1. 检出代码 (Checkout)
   ↓
2. 设置 Node.js 环境 (Setup Node.js)
   ↓
3. 安装依赖 (npm install/npm ci)
   ↓
4. 安装 Vercel CLI
   ↓
5. 配置 Vercel (vercel pull)
   ↓
6. 构建项目 (vercel build)
   ↓
7. 部署到 Vercel (vercel deploy)
   ↓
8. 完成通知
```

### 环境说明

| 环境 | 触发方式 | 用途 |
|------|----------|------|
| **production** | push 到 main 分支 | 正式生产环境 |
| **preview** | 手动触发 | 测试预览环境 |

---

## 🔐 安全建议

### 保护敏感信息

1. **不要在代码中硬编码 Token**
   - ✅ 使用 GitHub Secrets
   - ❌ 不要在代码中写 `VERCEL_TOKEN=xxx`

2. **定期更新 Token**
   - 建议每 3 个月更新一次
   - Token 过期后需要重新生成

3. **限制 Token 权限**
   - 创建 Token 时选择最小必要权限
   - 只授权给需要的项目

4. **不要提交敏感文件**
   - 确保 `.env` 文件在 `.gitignore` 中
   - 不要提交包含密钥的配置文件

---

## 🛠️ 自定义配置

### 修改 Node.js 版本

在 `deploy.yml` 中修改：

```yaml
env:
  NODE_VERSION: '20'  # 修改为需要的版本
```

### 修改 Vercel CLI 版本

```yaml
env:
  VERCEL_CLI_VERSION: 'latest'  # 或指定版本号，如 '32.4.1'
```

### 添加更多部署前检查

在 `deploy-production` 任务中添加步骤：

```yaml
- name: 🔍 Run tests
  run: npm test

- name: 📏 Check code coverage
  run: npm run coverage
```

---

## 📞 获取帮助

如果遇到问题：

1. 查看 GitHub Actions 运行日志
2. 检查 Vercel 部署日志
3. 确认所有 Secrets 配置正确
4. 查看 [Vercel 文档](https://vercel.com/docs)
5. 查看 [GitHub Actions 文档](https://docs.github.com/cn/actions)

---

## 📄 许可证

本部署配置基于 MIT 许可证开源。
