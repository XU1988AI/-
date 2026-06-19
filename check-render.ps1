# ============================================
# Render 部署状态检查脚本
# 使用方法: .\check-render.ps1
# ============================================

param(
    [string]$DeploymentId = ""
)

$Green = "`e[32m"
$Yellow = "`e[33m"
$Red = "`e[31m"
$Reset = "`e[0m"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Render 部署状态检查" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查本地服务
Write-Host "[1/3] 检查本地服务..." -ForegroundColor Yellow
$localRunning = (netstat -ano | findstr ":3000") -ne $null
if ($localRunning) {
    Write-Host "$Green✓ 本地服务器运行中: http://localhost:3000" -ForegroundColor Green
} else {
    Write-Host "$Yellow○ 本地服务器未运行" -ForegroundColor Yellow
    Write-Host "  启动命令: node server.js" -ForegroundColor Gray
}

# 检查 GitHub 连接
Write-Host "`n[2/3] 检查 GitHub 连接..." -ForegroundColor Yellow
$remoteUrl = git remote get-url origin 2>$null
if ($remoteUrl -match "github.com") {
    Write-Host "$Green✓ GitHub 仓库已配置" -ForegroundColor Green
    Write-Host "  仓库: $remoteUrl" -ForegroundColor Gray
    
    # 获取最新提交
    $latestCommit = git log -1 --format="%H %s" 2>$null
    if ($latestCommit) {
        Write-Host "  最新提交: $latestCommit" -ForegroundColor Gray
    }
} else {
    Write-Host "$Red✗ GitHub 仓库未配置" -ForegroundColor Red
}

# Render 信息
Write-Host "`n[3/3] Render 部署信息..." -ForegroundColor Yellow
Write-Host ""
Write-Host "请访问以下链接检查部署状态:" -ForegroundColor Yellow
Write-Host "  https://dashboard.render.com" -ForegroundColor Cyan
Write-Host ""
Write-Host "或直接访问您的网站:" -ForegroundColor Yellow
Write-Host "  https://shouzhan.onrender.com" -ForegroundColor Cyan
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan