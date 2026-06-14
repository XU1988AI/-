#!/usr/bin/env node
/**
 * 自动部署脚本
 * 用于检查部署状态并自动完成部署
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
const config = {
  githubRepo: 'XU1988AI/-',
  githubToken: process.env.GITHUB_TOKEN || '',
  vercelToken: process.env.VERCEL_TOKEN || '',
  vercelProjectId: process.env.VERCEL_PROJECT_ID || '',
  vercelOrgId: process.env.VERCEL_ORG_ID || '',
  projectName: 'shouzwan'
};

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 检查 GitHub Actions 状态
async function checkGitHubActionsStatus() {
  log('\n📊 检查 GitHub Actions 状态...', 'blue');
  
  try {
    const url = `https://api.github.com/repos/${config.githubRepo}/actions/runs?per_page=5`;
    
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${config.githubRepo}/actions/runs?per_page=5`,
      method: 'GET',
      headers: {
        'User-Agent': 'Deploy-Script',
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': config.githubToken ? `token ${config.githubToken}` : ''
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            const runs = JSON.parse(data);
            if (runs.workflow_runs && runs.workflow_runs.length > 0) {
              const latestRun = runs.workflow_runs[0];
              log(`\n最近运行记录:`, 'yellow');
              log(`  - ID: ${latestRun.id}`);
              log(`  - 状态: ${latestRun.status}`);
              log(`  - 结论: ${latestRun.conclusion || '进行中'}`);
              log(`  - 触发时间: ${latestRun.created_at}`);
              log(`  - 提交信息: ${latestRun.head_commit?.message || '未知'}`);
              resolve(latestRun);
            } else {
              log('没有找到运行记录', 'yellow');
              resolve(null);
            }
          } else if (res.statusCode === 404) {
            log('仓库不存在或没有权限访问', 'red');
            resolve(null);
          } else {
            log(`请求失败: ${res.statusCode}`, 'red');
            resolve(null);
          }
        });
      });
      req.on('error', (e) => {
        log(`请求错误: ${e.message}`, 'red');
        resolve(null);
      });
      req.end();
    });
  } catch (error) {
    log(`检查失败: ${error.message}`, 'red');
    return null;
  }
}

// 检查 Vercel 部署状态
async function checkVercelDeployment() {
  log('\n🌐 检查 Vercel 部署状态...', 'blue');
  
  if (!config.vercelToken || !config.vercelProjectId) {
    log('缺少 Vercel 配置信息', 'yellow');
    log('请设置环境变量: VERCEL_TOKEN, VERCEL_PROJECT_ID, VERCEL_ORG_ID', 'yellow');
    return null;
  }

  try {
    const options = {
      hostname: 'api.vercel.com',
      path: `/v13/deployments?projectId=${config.vercelProjectId}&limit=5`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.vercelToken}`,
        'Content-Type': 'application/json'
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            const deployments = JSON.parse(data);
            if (deployments.deployments && deployments.deployments.length > 0) {
              const latest = deployments.deployments[0];
              log(`\n最新部署:`, 'yellow');
              log(`  - ID: ${latest.uid}`);
              log(`  - 状态: ${latest.readyState}`);
              log(`  - URL: ${latest.url}`);
              log(`  - 创建时间: ${latest.created}`);
              resolve(latest);
            } else {
              log('没有找到部署记录', 'yellow');
              resolve(null);
            }
          } else {
            log(`请求失败: ${res.statusCode}`, 'red');
            resolve(null);
          }
        });
      });
      req.on('error', (e) => {
        log(`请求错误: ${e.message}`, 'red');
        resolve(null);
      });
      req.end();
    });
  } catch (error) {
    log(`检查失败: ${error.message}`, 'red');
    return null;
  }
}

// 检查网站是否可访问
async function checkWebsiteAccessible(url) {
  log('\n🔗 检查网站可访问性...', 'blue');
  
  if (!url) {
    url = `https://${config.projectName}.vercel.app`;
  }
  
  log(`检查地址: ${url}`, 'yellow');
  
  try {
    return new Promise((resolve) => {
      const req = https.request(url, {
        method: 'GET',
        timeout: 10000
      }, (res) => {
        if (res.statusCode === 200) {
          log(`✅ 网站可访问!`, 'green');
          log(`  - 状态码: ${res.statusCode}`);
          resolve(true);
        } else {
          log(`⚠️ 网站返回非200状态码: ${res.statusCode}`, 'yellow');
          resolve(false);
        }
      });
      req.on('error', (e) => {
        log(`❌ 网站无法访问: ${e.message}`, 'red');
        resolve(false);
      });
      req.on('timeout', () => {
        log(`❌ 请求超时`, 'red');
        req.destroy();
        resolve(false);
      });
      req.end();
    });
  } catch (error) {
    log(`检查失败: ${error.message}`, 'red');
    return false;
  }
}

// Git 操作
function gitOperations() {
  log('\n📦 执行 Git 操作...', 'blue');
  
  try {
    // 检查状态
    log('检查 Git 状态...', 'yellow');
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    
    if (status.trim()) {
      log('发现未提交的更改:', 'yellow');
      log(status);
      
      // 添加所有文件
      log('添加文件...', 'yellow');
      execSync('git add .');
      
      // 提交
      log('提交更改...', 'yellow');
      execSync('git commit -m "自动部署更新"');
      
      // 推送
      log('推送到 GitHub...', 'yellow');
      execSync('git push origin main');
      
      log('✅ Git 操作完成!', 'green');
      return true;
    } else {
      log('没有需要提交的更改', 'yellow');
      return false;
    }
  } catch (error) {
    log(`Git 操作失败: ${error.message}`, 'red');
    return false;
  }
}

// 触发 GitHub Actions
async function triggerGitHubActions() {
  log('\n🚀 触发 GitHub Actions...', 'blue');
  
  if (!config.githubToken) {
    log('缺少 GitHub Token，无法手动触发', 'yellow');
    log('请设置环境变量: GITHUB_TOKEN', 'yellow');
    return false;
  }
  
  try {
    const url = `https://api.github.com/repos/${config.githubRepo}/actions/workflows/deploy.yml/dispatches`;
    
    const postData = JSON.stringify({
      ref: 'main',
      inputs: {
        environment: 'production'
      }
    });
    
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${config.githubRepo}/actions/workflows/deploy.yml/dispatches`,
      method: 'POST',
      headers: {
        'User-Agent': 'Deploy-Script',
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${config.githubToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    return new Promise((resolve) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 204) {
            log('✅ GitHub Actions 已触发!', 'green');
            resolve(true);
          } else {
            log(`触发失败: ${res.statusCode}`, 'red');
            log(data);
            resolve(false);
          }
        });
      });
      req.on('error', (e) => {
        log(`请求错误: ${e.message}`, 'red');
        resolve(false);
      });
      req.write(postData);
      req.end();
    });
  } catch (error) {
    log(`触发失败: ${error.message}`, 'red');
    return false;
  }
}

// 主函数
async function main() {
  log('\n========================================', 'blue');
  log('       自动部署检查与执行脚本', 'blue');
  log('========================================\n', 'blue');
  
  // 1. 检查 GitHub Actions 状态
  const actionsStatus = await checkGitHubActionsStatus();
  
  // 2. 检查 Vercel 部署状态
  const vercelStatus = await checkVercelDeployment();
  
  // 3. 检查网站可访问性
  let websiteUrl = vercelStatus?.url || `https://${config.projectName}.vercel.app`;
  const isAccessible = await checkWebsiteAccessible(websiteUrl);
  
  // 4. 输出部署状态总结
  log('\n========================================', 'blue');
  log('       部署状态总结', 'blue');
  log('========================================\n', 'blue');
  
  const statusTable = [
    ['GitHub 仓库', `https://github.com/${config.githubRepo}`],
    ['GitHub Actions', actionsStatus ? `${actionsStatus.status} (${actionsStatus.conclusion || '进行中'})` : '未知'],
    ['Vercel 部署', vercelStatus ? vercelStatus.readyState : '未配置'],
    ['网站访问', isAccessible ? '✅ 可访问' : '❌ 不可访问'],
    ['网站地址', websiteUrl]
  ];
  
  statusTable.forEach(([key, value]) => {
    log(`${key}: ${value}`);
  });
  
  // 5. 如果部署未完成，执行部署操作
  if (!isAccessible) {
    log('\n⚠️ 网站不可访问，开始执行部署操作...', 'yellow');
    
    // Git 操作
    const hasChanges = gitOperations();
    
    // 触发 GitHub Actions
    if (config.githubToken) {
      await triggerGitHubActions();
    } else {
      log('\n💡 提示: 设置 GITHUB_TOKEN 环境变量可以自动触发 GitHub Actions', 'yellow');
      log('获取 Token: https://github.com/settings/tokens', 'yellow');
    }
    
    log('\n⏳ 等待部署完成...', 'yellow');
    log('请访问 https://github.com/XU1988AI/-/actions 查看部署进度', 'blue');
  } else {
    log('\n✅ 网站已成功部署!', 'green');
    log(`🌐 访问地址: ${websiteUrl}`, 'green');
  }
  
  log('\n========================================', 'blue');
  log('       脚本执行完成', 'blue');
  log('========================================\n', 'blue');
}

// 执行主函数
main().catch(error => {
  log(`脚本执行失败: ${error.message}`, 'red');
  process.exit(1);
});