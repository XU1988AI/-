#!/usr/bin/env node
/**
 * 多平台部署脚本
 * 支持: Netlify, GitHub Pages, Cloudflare Pages, Render, Railway, Surge
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 显示菜单
function showMenu() {
  log('\n========================================', 'blue');
  log('       多平台部署脚本', 'blue');
  log('========================================\n', 'blue');
  
  log('支持的部署平台:', 'yellow');
  log('1. Netlify (推荐) - 最简单', 'cyan');
  log('2. GitHub Pages - 最免费', 'cyan');
  log('3. Cloudflare Pages - 最快', 'cyan');
  log('4. Render - 支持后端', 'cyan');
  log('5. Railway - 新兴平台', 'cyan');
  log('6. Surge - 命令行部署', 'cyan');
  log('7. 全部平台部署指南', 'cyan');
  log('0. 退出\n', 'reset');
}

// 检查 public 文件夹
function checkPublicFolder() {
  const publicPath = path.join(__dirname, 'public');
  if (!fs.existsSync(publicPath)) {
    log('❌ public 文件夹不存在！', 'red');
    log('请确保项目结构正确', 'yellow');
    return false;
  }
  log('✅ public 文件夹存在', 'green');
  return true;
}

// 检查文件
function checkFiles() {
  const publicPath = path.join(__dirname, 'public');
  const files = fs.readdirSync(publicPath);
  
  log('\n📁 public 文件夹内容:', 'blue');
  files.forEach(file => {
    log(`  - ${file}`, 'cyan');
  });
  
  // 检查关键文件
  const hasIndex = files.includes('index.html');
  const hasAdmin = files.includes('admin.html');
  
  log(`\n✅ 关键文件检查:`, 'blue');
  log(`  - index.html: ${hasIndex ? '✅' : '❌'}`, hasIndex ? 'green' : 'red');
  log(`  - admin.html: ${hasAdmin ? '✅' : '❌'}`, hasAdmin ? 'green' : 'red');
  
  return hasIndex && hasAdmin;
}

// Netlify 部署说明
function deployNetlify() {
  log('\n========================================', 'blue');
  log('Netlify 部署指南', 'green');
  log('========================================\n', 'blue');
  
  log('方式一：拖拽部署（最简单）\n', 'yellow');
  log('1. 打开浏览器访问:', 'reset');
  log('   https://app.netlify.com/drop', 'cyan');
  log('2. 将 public 文件夹拖入页面', 'reset');
  log('3. 等待部署完成，获得临时地址\n', 'reset');
  
  log('方式二：GitHub 自动部署\n', 'yellow');
  log('1. 登录 https://app.netlify.com', 'reset');
  log('2. 点击 "Add new site" → "Import from Git"', 'reset');
  log('3. 选择 GitHub，授权访问', 'reset');
  log('4. 选择仓库 XU1988AI/-', 'reset');
  log('5. 设置:', 'reset');
  log('   - Build command: (留空)', 'cyan');
  log('   - Publish directory: public', 'cyan');
  log('6. 点击 Deploy site\n', 'reset');
  
  log('方式三：Netlify CLI\n', 'yellow');
  log('执行以下命令:', 'reset');
  log('npm install -g netlify-cli', 'cyan');
  log('netlify login', 'cyan');
  log('cd public', 'cyan');
  log('netlify deploy --prod\n', 'cyan');
}

// GitHub Pages 部署说明
function deployGitHubPages() {
  log('\n========================================', 'blue');
  log('GitHub Pages 部署指南', 'green');
  log('========================================\n', 'blue');
  
  log('步骤 1: 修改构建输出\n', 'yellow');
  log('由于你的项目后端是 server.js，需要将 public 文件夹作为输出。\n', 'reset');
  
  log('步骤 2: 启用 GitHub Pages\n', 'yellow');
  log('1. 打开仓库 Settings', 'reset');
  log('2. 滚动到 Pages 部分', 'reset');
  log('3. Source: 选择 "Deploy from a branch"', 'reset');
  log('4. Branch: 选择 "main", 文件夹 "/"', 'reset');
  log('5. 点击 Save\n', 'reset');
  
  log('步骤 3: 等待部署\n', 'yellow');
  log('等待 2-3 分钟，访问:', 'reset');
  log('https://XU1988AI.github.io/-/\n', 'cyan');
  
  log('⚠️ 注意: GitHub Pages 不支持后端服务', 'red');
  log('如果需要后端功能，建议使用 Netlify Functions\n', 'yellow');
}

// Cloudflare Pages 部署说明
function deployCloudflarePages() {
  log('\n========================================', 'blue');
  log('Cloudflare Pages 部署指南', 'green');
  log('========================================\n', 'blue');
  
  log('1. 登录 https://pages.cloudflare.com\n', 'reset');
  log('2. 点击 "Create a project"\n', 'reset');
  log('3. 选择 "Connect to Git"\n', 'reset');
  log('4. 授权 GitHub\n', 'reset');
  log('5. 选择仓库: XU1988AI/-\n', 'reset');
  log('6. 设置构建配置:', 'yellow');
  log('   - Production branch: main', 'cyan');
  log('   - Build command: (留空)', 'cyan');
  log('   - Build output directory: /public\n', 'cyan');
  log('7. 点击 "Save and Deploy"\n', 'reset');
  
  log('优点:', 'green');
  log('- 无限流量', 'cyan');
  log('- CDN 全球加速', 'cyan');
  log('- 免费 SSL', 'cyan');
  log('- 自动 HTTPS\n', 'cyan');
}

// Render 部署说明
function deployRender() {
  log('\n========================================', 'blue');
  log('Render 部署指南', 'green');
  log('========================================\n', 'blue');
  
  log('方式一: 静态网站\n', 'yellow');
  log('1. 登录 https://render.com', 'reset');
  log('2. 点击 "New +" → "Static Site"', 'reset');
  log('3. 连接 GitHub，选择仓库', 'reset');
  log('4. 设置:', 'reset');
  log('   - Name: shouzwan', 'cyan');
  log('   - Branch: main', 'cyan');
  log('   - Build Command: (留空)', 'cyan');
  log('   - Publish directory: public', 'cyan');
  log('5. 点击 "Create Static Site"\n', 'reset');
  
  log('方式二: Web Service (Node.js)\n', 'yellow');
  log('1. 点击 "New +" → "Web Service"', 'reset');
  log('2. 连接 GitHub，选择仓库', 'reset');
  log('3. 设置:', 'reset');
  log('   - Name: shouzwan', 'cyan');
  log('   - Environment: Node', 'cyan');
  log('   - Build Command: npm install', 'cyan');
  log('   - Start Command: node server.js', 'cyan');
  log('4. 选择 Free Tier', 'reset');
  log('5. 点击 "Create Web Service"\n', 'reset');
  
  log('⚠️ 注意: 免费版 90 天不活动会休眠', 'red');
}

// Railway 部署说明
function deployRailway() {
  log('\n========================================', 'blue');
  log('Railway 部署指南', 'green');
  log('========================================\n', 'blue');
  
  log('1. 登录 https://railway.app', 'reset');
  log('2. 点击 "New Project" → "Deploy from GitHub repo"', 'reset');
  log('3. 选择仓库: XU1988AI/-', 'reset');
  log('4. Railway 会自动检测 Node.js', 'reset');
  log('5. 设置环境变量 (如需要)', 'reset');
  log('6. 点击 "Deploy"\n', 'reset');
  
  log('$5 免费额度/月\n', 'yellow');
  log('- 月度订阅: $5 免费额度', 'cyan');
  log('- 用完即停，不自动续费', 'cyan');
  log('- 适合小型项目\n', 'cyan');
}

// Surge 部署说明
function deploySurge() {
  log('\n========================================', 'blue');
  log('Surge 部署指南', 'green');
  log('========================================\n', 'blue');
  
  log('1. 安装 Surge', 'reset');
  log('   npm install -g surge\n', 'cyan');
  
  log('2. 部署 public 文件夹', 'reset');
  log('   cd public', 'cyan');
  log('   surge . shouzwan.surge.sh\n', 'cyan');
  
  log('3. 每次部署 URL 会变化\n', 'yellow');
  
  log('付费版可以固定域名:', 'reset');
  log('   surge . shouzwan.com -p ~/.npm/surge.pem\n', 'cyan');
}

// 显示所有指南
function showAllGuides() {
  log('\n========================================', 'blue');
  log('全部部署平台指南', 'yellow');
  log('========================================\n', 'blue');
  
  deployNetlify();
  deployGitHubPages();
  deployCloudflarePages();
  deployRender();
  deployRailway();
  deploySurge();
  
  log('\n========================================', 'blue');
  log('推荐方案', 'green');
  log('========================================\n', 'blue');
  
  log('最佳免费方案 (按优先级):\n', 'yellow');
  log('1. Netlify + Cloudflare Pages 双保险', 'green');
  log('   - Netlify: 主要部署', 'cyan');
  log('   - Cloudflare: CDN 加速 + 备份', 'cyan');
  
  log('\n2. 如果需要后端:', 'yellow');
  log('   - Railway 或 Render', 'green');
  log('   - 前端用 Netlify/Cloudflare', 'cyan');
  log('   - 后端用 Railway/Render', 'cyan');
  
  log('\n3. 最简单方案:', 'yellow');
  log('   - GitHub Pages (但不支持后端)', 'green');
}

// 主函数
function main() {
  showMenu();
  
  const args = process.argv.slice(2);
  const choice = args[0] || 'menu';
  
  switch(choice) {
    case '1':
      if (checkPublicFolder()) {
        checkFiles();
        deployNetlify();
      }
      break;
    case '2':
      if (checkPublicFolder()) {
        checkFiles();
        deployGitHubPages();
      }
      break;
    case '3':
      if (checkPublicFolder()) {
        checkFiles();
        deployCloudflarePages();
      }
      break;
    case '4':
      if (checkPublicFolder()) {
        checkFiles();
        deployRender();
      }
      break;
    case '5':
      if (checkPublicFolder()) {
        checkFiles();
        deployRailway();
      }
      break;
    case '6':
      if (checkPublicFolder()) {
        checkFiles();
        deploySurge();
      }
      break;
    case '7':
      if (checkPublicFolder()) {
        checkFiles();
        showAllGuides();
      }
      break;
    default:
      log('\n使用方式:', 'yellow');
      log('node multi-deploy.js [选项]\n', 'cyan');
      log('选项:', 'reset');
      log('1  - Netlify 部署', 'cyan');
      log('2  - GitHub Pages 部署', 'cyan');
      log('3  - Cloudflare Pages 部署', 'cyan');
      log('4  - Render 部署', 'cyan');
      log('5  - Railway 部署', 'cyan');
      log('6  - Surge 部署', 'cyan');
      log('7  - 显示所有平台指南', 'cyan');
      log('menu - 显示菜单\n', 'cyan');
  }
}

main();