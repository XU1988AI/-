#!/bin/bash

# Vercel 自动部署脚本
# 使用方法: bash deploy.sh

echo "======================================"
echo "   Vercel 自动部署脚本"
echo "======================================"

# 检查 Vercel CLI 是否安装
if ! command -v vercel &> /dev/null; then
    echo "安装 Vercel CLI..."
    npm install -g vercel@latest
fi

# 检查是否已登录
echo "检查登录状态..."
vercel whoami || {
    echo "需要登录 Vercel..."
    vercel login
}

# 获取项目信息
echo "获取项目配置..."
vercel pull --yes --environment=production

# 构建项目
echo "构建项目..."
vercel build --prod

# 部署到生产环境
echo "部署到生产环境..."
vercel deploy --prebuilt --prod

echo ""
echo "✅ 部署完成！"
echo "请访问: https://shouzwan.vercel.app"