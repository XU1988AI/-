# ============================================
# Render 自动化部署脚本
# 使用方法: .\deploy-render.ps1
# ============================================

param(
    [string]$RenderEmail = "",
    [string]$RenderApiKey = ""
)

# 颜色定义
$Green = "`e[32m"
$Yellow = "`e[33m"
$Red = "`e[31m"
$Reset = "`e[0m"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Render 自动化部署脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检测 Git 状态
Write-Host "[1/5] 检查 Git 状态..." -ForegroundColor Yellow
$status = git status --short
if ($status) {
    Write-Host "$Green✓ Git 有未提交的更改" -ForegroundColor Green
    git status --short
} else {
    Write-Host "$Yellow○ Git 没有未提交的更改" -ForegroundColor Yellow
}

# 检查远程仓库
Write-Host "`n[2/5] 检查远程仓库..." -ForegroundColor Yellow
$remoteUrl = git remote get-url origin 2>$null
if ($remoteUrl) {
    Write-Host "$Green✓ 远程仓库: $remoteUrl" -ForegroundColor Green
} else {
    Write-Host "$Red✗ 未配置远程仓库" -ForegroundColor Red
    Write-Host "请先添加远程仓库: git remote add origin <your-repo-url>" -ForegroundColor Yellow
    exit 1
}

# 提交代码
Write-Host "`n[3/5] 提交代码到 GitHub..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git add .
git commit -m "Deploy: $timestamp" 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "$Green✓ 代码已提交" -ForegroundColor Green
} else {
    Write-Host "$Yellow○ 没有需要提交的内容" -ForegroundColor Yellow
}

# 推送到 GitHub
Write-Host "`n[4/5] 推送到 GitHub..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "$Green✓ 代码已推送到 GitHub" -ForegroundColor Green
    Write-Host "$Green✓ Render 将自动检测到更新并开始部署" -ForegroundColor Green
} else {
    Write-Host "$Red✗ 推送失败，请检查网络连接" -ForegroundColor Red
    exit 1
}

# 显示部署信息
Write-Host "`n[5/5] 部署信息..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   部署信息" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✓ 代码已推送到 GitHub" -ForegroundColor Green
Write-Host "✓ Render 将自动部署（通常 1-3 分钟）" -ForegroundColor Green
Write-Host ""
Write-Host "请访问以下链接查看部署状态:" -ForegroundColor Yellow
Write-Host "  https://dashboard.render.com" -ForegroundColor Cyan
Write-Host ""
Write-Host "部署成功后，您的网站将是:" -ForegroundColor Yellow
Write-Host "  https://shouzhan.onrender.com" -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

# 提示用户检查部署
Write-Host ""
Write-Host "提示: 首次部署可能需要 2-3 分钟" -ForegroundColor Yellow
Write-Host "      部署完成后网站即可访问" -ForegroundColor Yellow