const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

let users = [{ id: 1, username: 'admin', password: 'admin123' }];

let apps = [
    { id: 1, name: '趣头条', icon: '📰', category: '阅读赚钱', platform: 'android', downloads: 125600, rating: 4.8, status: 'online' },
    { id: 2, name: '快手极速版', icon: '🎬', category: '视频赚钱', platform: 'android', downloads: 98500, rating: 4.7, status: 'online' },
    { id: 3, name: '抖音极速版', icon: '🎵', category: '视频赚钱', platform: 'android', downloads: 87300, rating: 4.9, status: 'online' },
    { id: 4, name: '番茄小说', icon: '📚', category: '阅读赚钱', platform: 'ios', downloads: 65200, rating: 4.6, status: 'online' },
    { id: 5, name: '今日头条', icon: '📱', category: '阅读赚钱', platform: 'android', downloads: 78900, rating: 4.5, status: 'online' },
    { id: 6, name: '腾讯新闻', icon: '🗞️', category: '阅读赚钱', platform: 'ios', downloads: 45600, rating: 4.4, status: 'online' },
    { id: 7, name: '爱奇艺极速版', icon: '🎥', category: '视频赚钱', platform: 'android', downloads: 32100, rating: 4.3, status: 'online' },
    { id: 8, name: '优酷视频', icon: '📺', category: '视频赚钱', platform: 'ios', downloads: 28900, rating: 4.2, status: 'online' },
    { id: 9, name: '拼多多', icon: '🛒', category: '购物赚钱', platform: 'android', downloads: 156000, rating: 4.7, status: 'online' },
    { id: 10, name: '淘宝', icon: '🛍️', category: '购物赚钱', platform: 'ios', downloads: 134000, rating: 4.8, status: 'online' },
    { id: 11, name: '京东', icon: '📦', category: '购物赚钱', platform: 'android', downloads: 98700, rating: 4.6, status: 'online' },
    { id: 12, name: '美团', icon: '🍜', category: '生活服务', platform: 'ios', downloads: 87600, rating: 4.5, status: 'online' },
    { id: 13, name: '饿了么', icon: '🍔', category: '生活服务', platform: 'android', downloads: 76500, rating: 4.4, status: 'online' },
    { id: 14, name: '滴滴出行', icon: '🚗', category: '生活服务', platform: 'ios', downloads: 65400, rating: 4.3, status: 'online' },
    { id: 15, name: '微信', icon: '💬', category: '社交', platform: 'android', downloads: 200000, rating: 4.9, status: 'online' },
    { id: 16, name: 'QQ', icon: '🐧', category: '社交', platform: 'ios', downloads: 180000, rating: 4.8, status: 'online' },
    { id: 17, name: '微博', icon: '📢', category: '社交', platform: 'android', downloads: 120000, rating: 4.5, status: 'online' },
    { id: 18, name: '小红书', icon: '📕', category: '社交', platform: 'ios', downloads: 98000, rating: 4.7, status: 'online' },
    { id: 19, name: '知乎', icon: '💡', category: '知识', platform: 'android', downloads: 76000, rating: 4.6, status: 'online' },
    { id: 20, name: '豆瓣', icon: '🎬', category: '知识', platform: 'ios', downloads: 54000, rating: 4.4, status: 'online' },
    { id: 21, name: '百度', icon: '🔍', category: '工具', platform: 'android', downloads: 167000, rating: 4.6, status: 'online' },
    { id: 22, name: '高德地图', icon: '🗺️', category: '工具', platform: 'ios', downloads: 112000, rating: 4.7, status: 'online' },
    { id: 23, name: '网易云音乐', icon: '🎶', category: '音乐', platform: 'android', downloads: 145000, rating: 4.8, status: 'online' },
    { id: 24, name: 'QQ音乐', icon: '🎵', category: '音乐', platform: 'ios', downloads: 132000, rating: 4.7, status: 'online' },
    { id: 25, name: '王者荣耀', icon: '🎮', category: '游戏', platform: 'android', downloads: 198000, rating: 4.9, status: 'online' },
    { id: 26, name: '和平精英', icon: '🔫', category: '游戏', platform: 'ios', downloads: 156000, rating: 4.8, status: 'online' },
    { id: 27, name: '原神', icon: '⚔️', category: '游戏', platform: 'android', downloads: 123000, rating: 4.9, status: 'online' },
    { id: 28, name: '明日方舟', icon: '🛡️', category: '游戏', platform: 'ios', downloads: 89000, rating: 4.7, status: 'online' },
    { id: 29, name: '支付宝', icon: '💳', category: '金融', platform: 'android', downloads: 189000, rating: 4.8, status: 'online' },
    { id: 30, name: '微信支付', icon: '💰', category: '金融', platform: 'ios', downloads: 178000, rating: 4.9, status: 'online' },
];

let categories = [
    { id: 1, name: '热门推荐', icon: '', displayCount: 10, sortOrder: 1 },
    { id: 2, name: '阅读赚钱', icon: '', displayCount: 8, sortOrder: 2 },
    { id: 3, name: '视频赚钱', icon: '', displayCount: 8, sortOrder: 3 },
    { id: 4, name: '购物赚钱', icon: '', displayCount: 8, sortOrder: 4 },
    { id: 5, name: '安卓赚钱', icon: '', displayCount: 6, sortOrder: 5 },
    { id: 6, name: '苹果赚钱', icon: '', displayCount: 6, sortOrder: 6 },
];

let news = [
    { id: 1, title: '2024年最赚钱的APP推荐', content: '盘点今年最受欢迎的赚钱软件', category: '资讯', views: 12580 },
    { id: 2, title: '新手赚钱攻略大全', content: '从零开始学习如何利用手机赚钱', category: '攻略', views: 8960 },
    { id: 3, title: '提现技巧分享', content: '教你如何快速提现，秒到账', category: '技巧', views: 6720 },
    { id: 4, title: '高佣金APP排行', content: '最新高佣金赚钱软件排行榜', category: '排行', views: 15320 },
    { id: 5, title: '赚钱APP防坑指南', content: '识别哪些是真正能赚钱的APP', category: '指南', views: 9840 },
];

let homepageConfig = {
    modules: [
        { id: 'banner', enabled: true, count: 3 },
        { id: 'dynamic', enabled: true, count: 15 },
        { id: 'hotApps', enabled: true, count: 30, layout: 'grid' },
        { id: 'projects', enabled: true, count: 6 },
        { id: 'topics', enabled: true, count: 6 },
        { id: 'leftSidebar', enabled: true },
        { id: 'rightSidebar', enabled: true },
        { id: 'liveDynamic', enabled: true, position: 'bottom-right' },
    ]
};

let dynamicLogs = [];
setInterval(() => {
    const types = ['下载', '注册', '提现', '邀请'];
    const users = ['用户***8', '用户***5', '用户***2', '用户***9', '用户***1'];
    const appsList = ['趣头条', '快手极速版', '抖音极速版', '番茄小说', '拼多多'];
    const type = types[Math.floor(Math.random() * types.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const app = appsList[Math.floor(Math.random() * appsList.length)];
    dynamicLogs.unshift({
        id: Date.now(),
        type,
        user,
        app,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    });
    if (dynamicLogs.length > 50) dynamicLogs.pop();
}, 3000);

let tokenStore = {};

function generateToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const token = generateToken();
        tokenStore[token] = { userId: user.id, username: user.username, expires: Date.now() + 3600000 };
        res.json({ success: true, token, user: { id: user.id, username: user.username } });
    } else {
        res.status(401).json({ success: false, message: '用户名或密码错误' });
    }
});

function authMiddleware(req, res, next) {
    const token = req.headers['authorization'] || req.query.token;
    if (!token) return res.status(401).json({ success: false, message: '未登录' });
    const session = tokenStore[token];
    if (!session || session.expires < Date.now()) return res.status(401).json({ success: false, message: '登录已过期' });
    session.expires = Date.now() + 3600000;
    req.user = session;
    next();
}

app.get('/api/apps', (req, res) => {
    const { category, platform, page = 1, limit = 10 } = req.query;
    let filtered = apps;
    if (category) filtered = filtered.filter(a => a.category === category);
    if (platform) filtered = filtered.filter(a => a.platform === platform);
    const start = (page - 1) * limit;
    const end = start + parseInt(limit);
    res.json({ data: filtered.slice(start, end), total: filtered.length, page: parseInt(page), limit: parseInt(limit) });
});

app.post('/api/apps', authMiddleware, (req, res) => {
    const newApp = { id: Date.now(), ...req.body, downloads: 0, status: 'online' };
    apps.push(newApp);
    res.json({ success: true, data: newApp });
});

app.put('/api/apps/:id', authMiddleware, (req, res) => {
    const index = apps.findIndex(a => a.id === parseInt(req.params.id));
    if (index !== -1) {
        apps[index] = { ...apps[index], ...req.body };
        res.json({ success: true, data: apps[index] });
    } else {
        res.status(404).json({ success: false, message: '应用不存在' });
    }
});

app.delete('/api/apps/:id', authMiddleware, (req, res) => {
    const index = apps.findIndex(a => a.id === parseInt(req.params.id));
    if (index !== -1) {
        apps.splice(index, 1);
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, message: '应用不存在' });
    }
});

app.post('/api/apps/:id/download', (req, res) => {
    const index = apps.findIndex(a => a.id === parseInt(req.params.id));
    if (index !== -1) {
        apps[index].downloads++;
        res.json({ success: true, downloads: apps[index].downloads });
    } else {
        res.status(404).json({ success: false, message: '应用不存在' });
    }
});

app.get('/api/categories', (req, res) => res.json(categories));

app.post('/api/categories', authMiddleware, (req, res) => {
    const newCategory = { id: Date.now(), ...req.body, displayCount: req.body.displayCount || 6, sortOrder: categories.length + 1 };
    categories.push(newCategory);
    res.json({ success: true, data: newCategory });
});

app.put('/api/categories/:id', authMiddleware, (req, res) => {
    const index = categories.findIndex(c => c.id === parseInt(req.params.id));
    if (index !== -1) {
        categories[index] = { ...categories[index], ...req.body };
        res.json({ success: true, data: categories[index] });
    } else {
        res.status(404).json({ success: false, message: '分类不存在' });
    }
});

app.delete('/api/categories/:id', authMiddleware, (req, res) => {
    const index = categories.findIndex(c => c.id === parseInt(req.params.id));
    if (index !== -1) {
        categories.splice(index, 1);
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, message: '分类不存在' });
    }
});

app.get('/api/news', (req, res) => {
    const { limit = 5 } = req.query;
    res.json(news.slice(0, parseInt(limit)));
});

app.post('/api/news', authMiddleware, (req, res) => {
    const newNews = { id: Date.now(), ...req.body, views: 0 };
    news.push(newNews);
    res.json({ success: true, data: newNews });
});

app.delete('/api/news/:id', authMiddleware, (req, res) => {
    const index = news.findIndex(n => n.id === parseInt(req.params.id));
    if (index !== -1) {
        news.splice(index, 1);
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, message: '资讯不存在' });
    }
});

app.get('/api/homepage-config', (req, res) => res.json(homepageConfig));

app.post('/api/homepage-config', authMiddleware, (req, res) => {
    homepageConfig = req.body;
    res.json({ success: true, data: homepageConfig });
});

app.get('/api/dynamic', (req, res) => res.json(dynamicLogs.slice(0, 20)));

app.get('/api/stats', (req, res) => {
    res.json({
        totalApps: apps.length,
        totalDownloads: apps.reduce((sum, a) => sum + a.downloads, 0),
        totalUsers: 12580,
        todayActive: 3256
    });
});

app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
