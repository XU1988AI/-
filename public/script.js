let appsData = [];

async function fetchAPI(url, method = 'GET', body = null) {
    const options = { method, headers: { 'Content-Type': 'application/json' } };
    if (body) options.body = JSON.stringify(body);
    const response = await fetch(url, options);
    return await response.json();
}

async function loadApps() {
    const result = await fetchAPI('/api/apps?limit=50');
    appsData = result.data || result;
    renderAppsGrid();
    renderRankList(appsData);
    renderQuickList('androidQuickList', appsData.filter(a => a.platform === 'android').slice(0, 6));
    renderQuickList('videoQuickList', appsData.filter(a => ['视频赚钱', '音乐', '游戏'].includes(a.category)).slice(0, 6));
    renderQuickList('iosQuickList', appsData.filter(a => a.platform === 'ios').slice(0, 6));
    renderQuickList('readQuickList', appsData.filter(a => ['阅读赚钱', '知识', '社交'].includes(a.category)).slice(0, 6));
    renderRecentList(appsData);
    initFilterTabs();
}

function renderAppsGrid() {
    const container = document.getElementById('appsGrid');
    if (!container) return;
    const displayApps = appsData.slice(0, 10);
    container.innerHTML = displayApps.map(app => `
        <div class="app-card" data-app-id="${app.id}">
            <span class="app-icon">${app.icon || '📱'}</span>
            <span class="app-name">${app.name}</span>
            <div class="app-meta">
                <span>⭐ ${app.rating}</span>
                <span>📥 ${formatNumber(app.downloads)}</span>
            </div>
            <button class="download-btn" onclick="downloadApp(${app.id})">下载</button>
        </div>
    `).join('');
}

function renderRankList(apps) {
    const container = document.getElementById('rankList');
    if (!container) return;
    const topApps = apps.slice(0, 10);
    container.innerHTML = topApps.map((app, index) => `
        <div class="rank-item ${index < 3 ? 'top3' : ''}">
            <span class="rank-num">${index + 1}</span>
            <a href="#">${app.name}</a>
            <span class="rank-downloads">${formatNumber(app.downloads)}</span>
        </div>
    `).join('');
}

function renderQuickList(containerId, apps) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = apps.map(app => `
        <div class="icon-card" data-app-id="${app.id}">
            <span class="app-icon">${app.icon || '📱'}</span>
            <span class="app-name">${app.name}</span>
        </div>
    `).join('');
}

function renderRecentList(apps) {
    const container = document.getElementById('recentAppsGrid');
    if (!container) return;
    const recentApps = apps.slice(-15).reverse();
    container.innerHTML = recentApps.map(app => `
        <div class="recent-app-card" data-app-id="${app.id}">
            <span class="app-icon">${app.icon || '📱'}</span>
            <span class="app-name">${app.name}</span>
            <button class="download-btn" onclick="downloadApp(${app.id})">下载</button>
        </div>
    `).join('');
}

function formatNumber(num) {
    if (num >= 10000) return (num / 10000).toFixed(1) + '万';
    return num.toString();
}

async function downloadApp(appId) {
    try {
        await fetchAPI(`/api/apps/${appId}/download`, 'POST');
        showDownloadModal(appId);
        const app = appsData.find(a => a.id === appId);
        if (app) app.downloads++;
        renderAppsGrid();
        renderRankList(appsData);
    } catch (e) {
        alert('下载失败，请重试');
    }
}

function showDownloadModal(appId) {
    const app = appsData.find(a => a.id === appId);
    if (!app) return;
    let modal = document.createElement('div');
    modal.className = 'download-modal show';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>${app.icon || ''} ${app.name}</h3>
            <p>正在跳转到下载页面...</p>
            <button class="btn" onclick="closeModal()">关闭</button>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => {
        window.open('https://www.example.com/download/' + appId, '_blank');
        closeModal();
    }, 1500);
}

function closeModal() {
    const modal = document.querySelector('.download-modal');
    if (modal) modal.remove();
}

async function loadCategories() {
    const categories = await fetchAPI('/api/categories');
    const container = document.getElementById('categoryList');
    if (!container) return;
    container.innerHTML = categories.map(cat => `
        <span class="category-item" data-category="${cat.name}">
            <span>${cat.icon || ''}</span>
            <span>${cat.name}</span>
        </span>
    `).join('');

    // 添加点击事件
    container.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', () => {
            const category = item.dataset.category;
            filterAppsByCategory(category);
        });
    });
}

function filterAppsByCategory(category) {
    const container = document.getElementById('appsGrid');
    if (!container) return;

    let filteredApps = appsData;
    if (category !== '热门推荐') {
        filteredApps = appsData.filter(app => app.category === category);
    }

    container.innerHTML = filteredApps.slice(0, 10).map(app => `
        <div class="app-card" data-app-id="${app.id}">
            <span class="app-icon">${app.icon || '📱'}</span>
            <span class="app-name">${app.name}</span>
            <div class="app-meta">
                <span>⭐ ${app.rating}</span>
                <span>📥 ${formatNumber(app.downloads)}</span>
            </div>
            <button class="download-btn" onclick="downloadApp(${app.id})">下载</button>
        </div>
    `).join('');
}

async function loadNews() {
    const news = await fetchAPI('/api/news?limit=5');
    const container = document.getElementById('newsList');
    if (!container) return;
    container.innerHTML = news.map(item => `
        <div class="news-item">
            <a href="#">${item.title}</a>
            <span> ${item.category}   ${formatNumber(item.views)}</span>
        </div>
    `).join('');
}

async function loadStats() {
    const stats = await fetchAPI('/api/stats');
    document.getElementById('statApps').textContent = stats.totalApps;
    document.getElementById('statDownloads').textContent = formatNumber(stats.totalDownloads);
    document.getElementById('statUsers').textContent = formatNumber(stats.totalUsers);
    document.getElementById('statActive').textContent = formatNumber(stats.todayActive);
}

function initBanner() {
    const bannerItems = document.querySelectorAll('.banner-item');
    const dots = document.querySelectorAll('.banner-dots .dot');
    let currentIndex = 0;
    function showSlide(index) {
        bannerItems.forEach((item, i) => item.classList.toggle('active', i === index));
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
        currentIndex = index;
    }
    dots.forEach((dot, index) => dot.addEventListener('click', () => showSlide(index)));
    setInterval(() => {
        currentIndex = (currentIndex + 1) % bannerItems.length;
        showSlide(currentIndex);
    }, 4000);
}

async function loadDynamic() {
    try {
        const dynamic = await fetchAPI('/api/dynamic');
        renderDynamic(dynamic);
    } catch (e) {
        console.error('加载动态失败', e);
    }
}

function renderDynamic(items) {
    const container = document.getElementById('floatDynamicList');
    if (!container || !items.length) return;
    container.innerHTML = items.slice(0, 8).map(item => `
        <div class="float-item">
            <span class="float-type ${item.type === '下载' ? 'download' : item.type === '注册' ? 'register' : item.type === '提现' ? 'withdraw' : 'invite'}">${item.type}</span>
            <span class="float-user">${item.user}</span>
            <span class="float-app">${item.app}</span>
            <span class="float-time">${item.time}</span>
        </div>
    `).join('');
}

function initFilterTabs() {
    document.getElementById('androidFilter')?.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-tab')) {
            document.querySelectorAll('#androidFilter .filter-tab').forEach(tab => tab.classList.remove('active'));
            e.target.classList.add('active');
            const category = e.target.dataset.category;
            let filtered = appsData.filter(a => a.platform === 'android');
            if (category !== 'all') {
                filtered = filtered.filter(a => a.category === category);
            }
            renderQuickList('androidQuickList', filtered.slice(0, 6));
        }
    });

    document.getElementById('videoFilter')?.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-tab')) {
            document.querySelectorAll('#videoFilter .filter-tab').forEach(tab => tab.classList.remove('active'));
            e.target.classList.add('active');
            const category = e.target.dataset.category;
            let filtered = appsData.filter(a => ['视频赚钱', '音乐', '游戏'].includes(a.category));
            if (category !== 'all') {
                filtered = filtered.filter(a => a.category === category);
            }
            renderQuickList('videoQuickList', filtered.slice(0, 6));
        }
    });

    document.getElementById('iosFilter')?.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-tab')) {
            document.querySelectorAll('#iosFilter .filter-tab').forEach(tab => tab.classList.remove('active'));
            e.target.classList.add('active');
            const category = e.target.dataset.category;
            let filtered = appsData.filter(a => a.platform === 'ios');
            if (category !== 'all') {
                filtered = filtered.filter(a => a.category === category);
            }
            renderQuickList('iosQuickList', filtered.slice(0, 6));
        }
    });

    document.getElementById('readFilter')?.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-tab')) {
            document.querySelectorAll('#readFilter .filter-tab').forEach(tab => tab.classList.remove('active'));
            e.target.classList.add('active');
            const category = e.target.dataset.category;
            let filtered = appsData.filter(a => ['阅读赚钱', '知识', '社交'].includes(a.category));
            if (category !== 'all') {
                filtered = filtered.filter(a => a.category === category);
            }
            renderQuickList('readQuickList', filtered.slice(0, 6));
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadApps();
    await loadCategories();
    await loadNews();
    await loadStats();
    initBanner();
    await loadDynamic();
    setInterval(loadDynamic, 5000);
});
