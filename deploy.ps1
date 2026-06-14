#!/usr/bin/env pwsh

<#
.SYNOPSIS
Vercel 自动部署脚本 (PowerShell 版本)

.DESCRIPTION
用于自动部署项目到 Vercel 平台

.EXAMPLE
.\deploy.ps1
#>

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   Vercel 自动部署脚本 (PowerShell)" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# 检查 Node.js 是否安装
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js 未安装，请先安装 Node.js"
    exit 1
}

# 检查 Vercel CLI 是否安装
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "安装 Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel@latest
}

# 检查是否已登录
Write-Host "检查登录状态..." -ForegroundColor Yellow
try {
    vercel whoami
} catch {
    Write-Host "需要登录 Vercel..." -ForegroundColor Yellow
    vercel login
}

# 获取项目信息
Write-Host "获取项目配置..." -ForegroundColor Yellow
vercel pull --yes --environment=production

# 构建项目
Write-Host "构建项目..." -ForegroundColor Yellow
vercel build --prod

# 部署到生产环境
Write-Host "部署到生产环境..." -ForegroundColor Yellow
vercel deploy --prebuilt --prod

Write-Host ""
Write-Host "✅ 部署完成！" -ForegroundColor Green
Write-Host "请访问: https://shouzwan.vercel.app" -ForegroundColor Green