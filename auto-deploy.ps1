# Auto Deploy Script - PowerShell Version
# Check deployment status and auto deploy

param(
    [string]$GitHubToken = $env:GITHUB_TOKEN,
    [string]$VercelToken = $env:VERCEL_TOKEN,
    [string]$VercelProjectId = $env:VERCEL_PROJECT_ID,
    [string]$VercelOrgId = $env:VERCEL_ORG_ID,
    [string]$ProjectName = "shouzwan"
)

# Color output function
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# Display title
Write-ColorOutput "`n========================================" "Blue"
Write-ColorOutput "       Auto Deploy Check Script" "Blue"
Write-ColorOutput "========================================`n" "Blue"

# Configuration
$GitHubRepo = "XU1988AI/-"
$GitHubUrl = "https://github.com/$GitHubRepo"
$VercelUrl = "https://$ProjectName.vercel.app"

Write-ColorOutput "Configuration:" "Yellow"
Write-ColorOutput "  - GitHub Repo: $GitHubUrl"
Write-ColorOutput "  - Project Name: $ProjectName"
Write-ColorOutput "  - Expected URL: $VercelUrl"

# 1. Check Git status
Write-ColorOutput "`nChecking Git status..." "Blue"
try {
    $gitStatus = & git status --porcelain 2>&1
    $gitLog = & git log --oneline -3 2>&1
    
    Write-ColorOutput "Recent commits:" "Yellow"
    Write-ColorOutput $gitLog
    
    if ($gitStatus -and $gitStatus.Trim()) {
        Write-ColorOutput "Found uncommitted changes:" "Yellow"
        Write-ColorOutput $gitStatus
    } else {
        Write-ColorOutput "OK - Git status clean" "Green"
    }
} catch {
    Write-ColorOutput "ERROR - Git check failed: $_" "Red"
}

# 2. Check GitHub Actions status
Write-ColorOutput "`nChecking GitHub Actions..." "Blue"
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
            Write-ColorOutput "Latest run:" "Yellow"
            Write-ColorOutput "  - ID: $($latestRun.id)"
            Write-ColorOutput "  - Status: $($latestRun.status)"
            Write-ColorOutput "  - Conclusion: $($latestRun.conclusion)"
            Write-ColorOutput "  - Time: $($latestRun.created_at)"
        } else {
            Write-ColorOutput "No runs found" "Yellow"
        }
    } catch {
        Write-ColorOutput "ERROR - GitHub Actions check failed: $_" "Red"
    }
} else {
    Write-ColorOutput "WARNING - GITHUB_TOKEN not set" "Yellow"
    Write-ColorOutput "Get token: https://github.com/settings/tokens" "Yellow"
}

# 3. Check website accessibility
Write-ColorOutput "`nChecking website accessibility..." "Blue"
Write-ColorOutput "Checking URL: $VercelUrl" "Yellow"

$isAccessible = $false
try {
    $webRequest = Invoke-WebRequest -Uri $VercelUrl -TimeoutSeconds 10 -UseBasicParsing -ErrorAction Stop
    if ($webRequest.StatusCode -eq 200) {
        Write-ColorOutput "OK - Website accessible!" "Green"
        Write-ColorOutput "  - Status: $($webRequest.StatusCode)"
        $isAccessible = $true
    }
} catch {
    Write-ColorOutput "ERROR - Website not accessible: $_" "Red"
    $isAccessible = $false
}

# 4. Summary
Write-ColorOutput "`n========================================" "Blue"
Write-ColorOutput "       Deployment Summary" "Blue"
Write-ColorOutput "========================================`n" "Blue"

Write-ColorOutput "GitHub Repo: $GitHubUrl" "White"
if ($isAccessible) {
    Write-ColorOutput "Website: OK - Accessible" "Green"
} else {
    Write-ColorOutput "Website: ERROR - Not accessible" "Red"
}
Write-ColorOutput "URL: $VercelUrl" "White"

# 5. Deploy if not accessible
if (-not $isAccessible) {
    Write-ColorOutput "`nWARNING - Website not accessible, starting deploy..." "Yellow"
    
    # Git operations
    Write-ColorOutput "`nRunning Git operations..." "Blue"
    
    try {
        & git add .
        
        $status = & git status --porcelain
        if ($status -and $status.Trim()) {
            Write-ColorOutput "Committing changes..." "Yellow"
            & git commit -m "Auto deploy update"
            
            Write-ColorOutput "Pushing to GitHub..." "Yellow"
            & git push origin main
            
            Write-ColorOutput "OK - Git operations complete!" "Green"
        } else {
            Write-ColorOutput "No changes to commit" "Yellow"
        }
    } catch {
        Write-ColorOutput "ERROR - Git operations failed: $_" "Red"
    }
    
    Write-ColorOutput "`nWaiting for deployment..." "Yellow"
    Write-ColorOutput "Check progress: https://github.com/$GitHubRepo/actions" "Blue"
} else {
    Write-ColorOutput "`nOK - Website deployed successfully!" "Green"
    Write-ColorOutput "URL: $VercelUrl" "Green"
    
    # Test API
    Write-ColorOutput "`nTesting API..." "Blue"
    try {
        $apiUrl = "$VercelUrl/api/apps"
        Write-ColorOutput "Testing: $apiUrl" "Yellow"
        $apiResponse = Invoke-WebRequest -Uri $apiUrl -TimeoutSeconds 10 -UseBasicParsing
        if ($apiResponse.StatusCode -eq 200) {
            Write-ColorOutput "OK - API working!" "Green"
        }
    } catch {
        Write-ColorOutput "WARNING - API test failed: $_" "Yellow"
    }
}

# 6. Next steps
Write-ColorOutput "`n========================================" "Blue"
Write-ColorOutput "       Next Steps" "Blue"
Write-ColorOutput "========================================`n" "Blue"

if (-not $isAccessible) {
    Write-ColorOutput "1. Visit Vercel: https://vercel.com" "Yellow"
    Write-ColorOutput "2. Import repo: $GitHubRepo" "Yellow"
    Write-ColorOutput "3. Configure GitHub Secrets:" "Yellow"
    Write-ColorOutput "   - VERCEL_TOKEN" "Yellow"
    Write-ColorOutput "   - VERCEL_PROJECT_ID" "Yellow"
    Write-ColorOutput "   - VERCEL_ORG_ID" "Yellow"
    Write-ColorOutput "4. Wait for auto deploy" "Yellow"
} else {
    Write-ColorOutput "OK - Deployment complete!" "Green"
    Write-ColorOutput "Home: $VercelUrl" "White"
    Write-ColorOutput "Admin: $VercelUrl/admin.html" "White"
    Write-ColorOutput "API: $VercelUrl/api/apps" "White"
}

Write-ColorOutput "`n========================================" "Blue"
Write-ColorOutput "       Script Complete" "Blue"
Write-ColorOutput "========================================`n" "Blue"