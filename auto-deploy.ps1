# 自动部署脚本 - PowerShell 版本
# 用于检查部署状态并自动完成部署

param(
    [string]$GitHubToken = $env:GITHUB_TOKEN,
    [string]$VercelToken = $env:VERCEL_TOKEN,
    [string]$VercelProjectId = $env:VERCEL_PROJECT_ID,
    [string]$VercelOrgId = $env:VERCEL_ORG_ID,
    [string]$ProjectName = "shouzwan"
)

# 颜色输出函数
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# 显示标题
Write-ColorOutput "`n========================================" "Blue"
Write-ColorOutput "       自动部署检查与执行脚本" "Blue"
Write-ColorOutput "========================================`n" "Blue"

# 配置
$GitHubRepo = "XU1988AI/-"
$GitHubUrl = "https://github.com/$GitHubRepo"
$VercelUrl = "https://$ProjectName.vercel.app"

Write-ColorOutput "📋 配置信息:" "Yellow"
Write-ColorOutput "  - GitHub 仓库: $GitHubUrl"
Write-ColorOutput "  - 项目名称: $ProjectName"
Write-ColorOutput "  - 预期网站: $VercelUrl"

# 1. 检查 Git 状态
Write-ColorOutput "`n📦 检查 Git 状态..." "Blue"
try {
    $gitStatus = & git status --porcelain 2>&1
    $gitLog = & git log --oneline -3 2>&1
    
    Write-ColorOutput "最近提交记录:" "Yellow"
    Write-ColorOutput $gitLog
    
    if ($gitStatus -and $gitStatus.Trim()) {
        Write-ColorOutput "发现未提交的更改:" "Yellow"
        Write-ColorOutput $gitStatus
    } else {
        Write-ColorOutput "✅ Git 状态正常，无待提交更改" "Green"
    }
} catch {
    Write-ColorOutput "❌ Git 检查失败: $_" "Red"
}

# 2. 检查 GitHub Actions 状态（如果有 Token）
Write-ColorOutput "`n📊 检查 GitHub Actions 状态..." "Blue"
if ($GitHubToken) {
    try {
        $headers = @{
            "User-Agent" = "Deploy-Script"
            "Accept" = "application/vnd.github.v3+json"
            "Authorization" = "token $GitHubToken"
        }
        
        $actionsUrl = "https://api.github.com/repos/$GitHubRepo/actions/runs?per_page=5"
        $response = Invoke-RestMethod -Uri $actionsUrl -Headers $headers -Method Get
        
        if ($response.workflow_runs -and $response.workflow_runs.Count -gt 0) {
            $latestRun = $response.workflow_runs[0]
            Write-ColorOutput "最近运行记录:" "Yellow"
            Write-ColorOutput "  - ID: $($latestRun.id)"
            Write-ColorOutput "  - 状态: $($latestRun.status)"
            Write-ColorOutput "  - 结论: $($latestRun.conclusion)"
            Write-ColorOutput "  - 时间: $($latestRun.created_at)"
            Write-ColorOutput "  - 提交: $($latestRun.head_commit.message)"
        } else {
            Write-ColorOutput "没有找到运行记录" "Yellow"
        }
    } catch {
        Write-ColorOutput "❌ GitHub Actions 检查失败: $_" "Red"
    }
} else {
    Write-ColorOutput "⚠️ 未设置 GITHUB_TOKEN，无法检查 Actions 状态" "Yellow"
    Write-ColorOutput "获取 Token: https://github.com/settings/tokens" "Yellow"
}

# 3. 检查网站可访问性
Write-ColorOutput "`n🔗 检查网站可访问性..." "Blue"
Write-ColorOutput "检查地址: $VercelUrl" "Yellow"

try {
    $webRequest = Invoke-WebRequest -Uri $VercelUrl -TimeoutSeconds 10 -UseBasicParsing -ErrorAction Stop
    if ($webRequest.StatusCode -eq 200) {
        Write-ColorOutput "✅ 网站可访问!" "Green"
        Write-ColorOutput "  - 状态码: $($webRequest.StatusCode)"
        $isAccessible = $true
    } else {
        Write-ColorOutput "⚠️ 网站返回非200状态码: $($webRequest.StatusCode)" "Yellow"
        $isAccessible = $false
    }
} catch {
    Write-ColorOutput "❌ 网站无法访问: $_" "Red"
    $isAccessible = $false
}

# 4. 输出部署状态总结
Write-ColorOutput "`n========================================" "Blue"
Write-ColorOutput "       部署状态总结" "Blue"
Write-ColorOutput "========================================`n" "Blue"

Write-ColorOutput "GitHub 仓库: $GitHubUrl" "White"
Write-ColorOutput "网站访问: $(if ($isAccessible) { '✅ 可访问' } else { '❌ 不可访问' })" $(if ($isAccessible) { "Green" } else { "Red" })
Write-ColorOutput "网站地址: $VercelUrl" "White"

# 5. 如果部署未完成，执行部署操作
if (-not $isAccessible) {
    Write-ColorOutput "`n⚠️ 网站不可访问，开始执行部署操作..." "Yellow"
    
    # Git 操作
    Write-ColorOutput "`n📦 执行 Git 操作..." "Blue"
    
    try {
        # 添加所有文件
        Write-ColorOutput "添加文件..." "Yellow"
        & git add .
        
        # 检查是否有更改
        $status = & git status --porcelain
        if ($status -and $status.Trim()) {
            # 提交
            Write-ColorOutput "提交更改..." "Yellow"
            & git commit -m "自动部署更新"
            
            # 推送
            Write-ColorOutput "推送到 GitHub..." "Yellow"
            & git push origin main
            
            Write-ColorOutput "✅ Git 操作完成!" "Green"
        } else {
            Write-ColorOutput "没有需要提交的更改" "Yellow"
        }
    } catch {
        Write-ColorOutput "❌ Git 操作失败: $_" "Red"
    }
    
    # 触发 GitHub Actions（如果有 Token）
    if ($GitHubToken) {
        Write-ColorOutput "`n🚀 触发 GitHub Actions..." "Blue"
        try {
            $headers = @{
                "User-Agent" = "Deploy-Script"
                "Accept" = "application/vnd.github.v3+json"
                "Authorization" = "token $GitHubToken"
                "Content-Type" = "application/json"
            }
            
            $body = @{
                ref = "main"
                inputs = @{
                    environment = "production"
                }
            } | ConvertTo-Json
            
            $triggerUrl = "https://api.github.com/repos/$GitHubRepo/actions/workflows/deploy.yml/dispatches"
            Invoke-RestMethod -Uri $triggerUrl -Headers $headers -Method Post -Body $body
            
            Write-ColorOutput "✅ GitHub Actions 已触发!" "Green"
        } catch {
            Write-ColorOutput "❌ 触发失败: $_" "Red"
        }
    } else {
        Write-ColorOutput "`n💡 提示: 设置 GITHUB_TOKEN 环境变量可以自动触发 GitHub Actions" "Yellow"
    }
    
    Write-ColorOutput "`n⏳ 等待部署完成..." "Yellow"
    Write-ColorOutput "请访问 https://github.com/$GitHubRepo/actions 查看部署进度" "Blue"
} else {
    Write-ColorOutput "`n✅ 网站已成功部署!" "Green"
    Write-ColorOutput "🌐 访问地址: $VercelUrl" "Green"
    
    # 测试 API
    Write-ColorOutput "`n📊 测试 API 接口..." "Blue"
    try {
        $apiUrl = "$VercelUrl/api/apps"
        Write-ColorOutput "测试地址: $apiUrl" "Yellow"
        $apiResponse = Invoke-WebRequest -Uri $apiUrl -TimeoutSeconds 10 -UseBasicParsing
        if ($apiResponse.StatusCode -eq 200) {
            Write-ColorOutput "✅ API 接口正常!" "Green"
        }
    } catch {
        Write-ColorOutput "⚠️ API 测试失败: $_" "Yellow"
    }
}

# 6. 输出下一步操作建议
Write-ColorOutput "`n========================================" "Blue"
Write-ColorOutput "       下一步操作建议" "Blue"
Write-ColorOutput "========================================`n" "Blue"

if (-not $isAccessible) {
    Write-ColorOutput "1. 访问 Vercel 创建项目: https://vercel.com" "Yellow"
    Write-ColorOutput "2. 导入 GitHub 仓库: $GitHubRepo" "Yellow"
    Write-ColorOutput "3. 配置 GitHub Secrets:" "Yellow"
    Write-ColorOutput "   - VERCEL_TOKEN" "Yellow"
    Write-ColorOutput "   - VERCEL_PROJECT_ID" "Yellow"
    Write-ColorOutput "   - VERCEL_ORG_ID" "Yellow"
    Write-ColorOutput "4. 等待自动部署完成" "Yellow"
} else {
    Write-ColorOutput "✅ 部署已完成!" "Green"
    Write-ColorOutput "首页: $VercelUrl" "White"
    Write-ColorOutput "后台: $VercelUrl/admin.html" "White"
    Write-ColorOutput "API: $VercelUrl/api/apps" "White"
}

Write-ColorOutput "`n========================================" "Blue"
Write-ColorOutput "       脚本执行完成" "Blue"
Write-ColorOutput "========================================`n" "Blue"