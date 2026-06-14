let currentToken = null;
let currentEditId = null;
let currentEditType = null;

async function fetchAPI(url, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    if (currentToken) {
        options.headers['Authorization'] = currentToken;
    }
    if (body) options.body = JSON.stringify(body);
    
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
}

// 登录功能
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
        username: form.username.value,
        password: form.password.value
    };
    
    try {
        const result = await fetchAPI('/api/login', 'POST', data);
        if (result.success) {
            currentToken = result.token;
            localStorage.setItem('token', currentToken);
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('adminMain').style.display = 'flex';
            document.getElementById('currentUser').textContent = result.user.username;
            loadApps();
            loadCategories();
            loadNews();
        } else {
            showToast(result.message, 'error');
        }
    } catch (e) {
        showToast('登录失败', 'error');
    }
});

function logout() {
    currentToken = null;
    localStorage.removeItem('token');
    document.getElementById('adminMain').style.display = 'none';
    document.getElementById('loginPage').style.display = 'flex';
}

// 检查登录状态
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        currentToken = token;
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('adminMain').style.display = 'flex';
        loadApps();
        loadCategories();
        loadNews();
        initDragSort();
    }
});

// 标签切换
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const tab = item.dataset.tab;
        document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
        document.getElementById(tab).style.display = 'block';
        if (tab === 'apps') loadApps();
        if (tab === 'categories') loadCategories();
        if (tab === 'news') loadNews();
    });
});

// Toast提示
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// 应用管理
async function loadApps() {
    const apps = await fetchAPI('/api/apps?limit=100');
    const tbody = document.getElementById('appsTableBody');
    tbody.innerHTML = (apps.data || apps).map(app => `
        <tr>
            <td>${app.icon}</td>
            <td>${app.name}</td>
            <td>${app.category}</td>
            <td>${app.platform === 'android' ? '🤖 安卓' : '🍎 苹果'}</td>
            <td>${formatNumber(app.downloads)}</td>
            <td>⭐ ${app.rating}</td>
            <td><span class="status ${app.status}">${app.status === 'online' ? '上线' : '下线'}</span></td>
            <td>
                <div class="table-actions">
                    <button class="action-btn edit" onclick="editApp(${app.id})">编辑</button>
                    <button class="action-btn delete" onclick="deleteApp(${app.id})">删除</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function showAppModal(id = null) {
    currentEditType = 'app';
    currentEditId = id;
    document.getElementById('modalTitle').textContent = id ? '编辑应用' : '添加应用';
    document.getElementById('appForm').style.display = 'flex';
    document.getElementById('categoryForm').style.display = 'none';
    document.getElementById('newsForm').style.display = 'none';
    
    if (id) {
        fetchAPI(`/api/apps/${id}`).then(app => {
            document.querySelector('#modalForm [name="icon"]').value = app.icon;
            document.querySelector('#modalForm [name="name"]').value = app.name;
            document.querySelector('#modalForm [name="category"]').value = app.category;
            document.querySelector('#modalForm [name="platform"]').value = app.platform;
            document.querySelector('#modalForm [name="rating"]').value = app.rating;
        });
    } else {
        document.getElementById('modalForm').reset();
    }
    
    document.getElementById('modal').classList.add('show');
}

function editApp(id) {
    showAppModal(id);
}

async function deleteApp(id) {
    if (confirm('确定删除这个应用吗？')) {
        const result = await fetchAPI(`/api/apps/${id}`, 'DELETE');
        if (result.success) {
            showToast('删除成功');
            loadApps();
        } else {
            showToast('删除失败', 'error');
        }
    }
}

// 分类管理
async function loadCategories() {
    const categories = await fetchAPI('/api/categories');
    const tbody = document.getElementById('categoriesTableBody');
    tbody.innerHTML = categories.map(cat => `
        <tr>
            <td>${cat.icon}</td>
            <td>${cat.name}</td>
            <td>${cat.displayCount}</td>
            <td>${cat.sortOrder}</td>
            <td>
                <div class="table-actions">
                    <button class="action-btn edit" onclick="editCategory(${cat.id})">编辑</button>
                    <button class="action-btn delete" onclick="deleteCategory(${cat.id})">删除</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function showCategoryModal(id = null) {
    currentEditType = 'category';
    currentEditId = id;
    document.getElementById('modalTitle').textContent = id ? '编辑分类' : '添加分类';
    document.getElementById('appForm').style.display = 'none';
    document.getElementById('categoryForm').style.display = 'flex';
    document.getElementById('newsForm').style.display = 'none';
    
    if (id) {
        fetchAPI(`/api/categories/${id}`).then(cat => {
            document.querySelector('#modalForm [name="icon"]').value = cat.icon;
            document.querySelector('#modalForm [name="name"]').value = cat.name;
            document.querySelector('#modalForm [name="displayCount"]').value = cat.displayCount;
        });
    } else {
        document.getElementById('modalForm').reset();
    }
    
    document.getElementById('modal').classList.add('show');
}

function editCategory(id) {
    showCategoryModal(id);
}

async function deleteCategory(id) {
    if (confirm('确定删除这个分类吗？')) {
        const result = await fetchAPI(`/api/categories/${id}`, 'DELETE');
        if (result.success) {
            showToast('删除成功');
            loadCategories();
        } else {
            showToast('删除失败', 'error');
        }
    }
}

// 资讯管理
async function loadNews() {
    const news = await fetchAPI('/api/news?limit=100');
    const tbody = document.getElementById('newsTableBody');
    tbody.innerHTML = news.map(item => `
        <tr>
            <td>${item.title}</td>
            <td>${item.category}</td>
            <td>${formatNumber(item.views)}</td>
            <td>
                <div class="table-actions">
                    <button class="action-btn edit" onclick="editNews(${item.id})">编辑</button>
                    <button class="action-btn delete" onclick="deleteNews(${item.id})">删除</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function showNewsModal(id = null) {
    currentEditType = 'news';
    currentEditId = id;
    document.getElementById('modalTitle').textContent = id ? '编辑资讯' : '添加资讯';
    document.getElementById('appForm').style.display = 'none';
    document.getElementById('categoryForm').style.display = 'none';
    document.getElementById('newsForm').style.display = 'flex';
    
    if (id) {
        fetchAPI(`/api/news/${id}`).then(item => {
            document.querySelector('#modalForm [name="title"]').value = item.title;
            document.querySelector('#modalForm [name="content"]').value = item.content;
            document.querySelector('#modalForm [name="category"]').value = item.category;
        });
    } else {
        document.getElementById('modalForm').reset();
    }
    
    document.getElementById('modal').classList.add('show');
}

function editNews(id) {
    showNewsModal(id);
}

async function deleteNews(id) {
    if (confirm('确定删除这条资讯吗？')) {
        const result = await fetchAPI(`/api/news/${id}`, 'DELETE');
        if (result.success) {
            showToast('删除成功');
            loadNews();
        } else {
            showToast('删除失败', 'error');
        }
    }
}

// 保存弹窗数据
async function saveModalData() {
    const form = document.getElementById('modalForm');
    const data = {};
    
    form.querySelectorAll('input, select, textarea').forEach(input => {
        if (input.name) {
            if (input.type === 'number') {
                data[input.name] = parseFloat(input.value);
            } else {
                data[input.name] = input.value;
            }
        }
    });
    
    let result;
    if (currentEditId) {
        result = await fetchAPI(`/api/${currentEditType}s/${currentEditId}`, 'PUT', data);
    } else {
        result = await fetchAPI(`/api/${currentEditType}s`, 'POST', data);
    }
    
    if (result.success) {
        showToast(currentEditId ? '修改成功' : '添加成功');
        closeModal();
        if (currentEditType === 'app') loadApps();
        if (currentEditType === 'category') loadCategories();
        if (currentEditType === 'news') loadNews();
    } else {
        showToast(result.message || '保存失败', 'error');
    }
}

function closeModal() {
    document.getElementById('modal').classList.remove('show');
    document.getElementById('modalForm').reset();
    currentEditId = null;
    currentEditType = null;
}

function formatNumber(num) {
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
}

// 首页配置功能
let homepageConfig = null;

// 布局预设配置
const layoutPresets = {
    default: {
        name: '默认布局',
        contentWidth: 'fixed',
        sidebarWidth: 280,
        description: '标准三栏布局'
    },
    compact: {
        name: '紧凑布局',
        contentWidth: 'fixed',
        sidebarWidth: 220,
        description: '减少侧边栏宽度'
    },
    wide: {
        name: '宽屏布局',
        contentWidth: 'wide',
        sidebarWidth: 300,
        description: '扩大主内容区'
    },
    mobile: {
        name: '移动端优先',
        contentWidth: 'fluid',
        sidebarWidth: 250,
        description: '优化移动端体验'
    }
};

async function loadHomepageConfig() {
    try {
        const response = await fetchAPI('/api/homepage-config');
        homepageConfig = response || getDefaultHomepageConfig();
        applyHomepageConfig();
    } catch (e) {
        homepageConfig = getDefaultHomepageConfig();
        applyHomepageConfig();
    }
}

function getDefaultHomepageConfig() {
    return {
        site: {
            title: '手赚网',
            subtitle: '专业手机赚钱软件分享平台',
            contentWidth: 'fixed',
            sidebarWidth: 280
        },
        modules: [
            { id: 'banner', enabled: true, count: 3, autoplay: true, interval: 5 },
            { id: 'dynamic', enabled: true, count: 15 },
            { id: 'hotApps', enabled: true, count: 30, layout: 'grid', sort: 'downloads' },
            { id: 'projects', enabled: true, count: 6, layout: 'grid2' },
            { id: 'topics', enabled: true, count: 6 },
            { id: 'recent', enabled: true, count: 15, layout: 'grid' },
            { id: 'leftSidebar', enabled: true, subModules: ['cat', 'android', 'video', 'rank', 'stats'] },
            { id: 'rightSidebar', enabled: true, subModules: ['notice', 'ios', 'read', 'news'] },
            { id: 'liveDynamic', enabled: true, position: 'bottom-right', count: 8, autoHide: true }
        ]
    };
}

function applyHomepageConfig() {
    if (!homepageConfig) return;
    
    // 应用站点配置
    if (homepageConfig.site) {
        const titleInput = document.querySelector('input[name="site_title"]');
        const subtitleInput = document.querySelector('input[name="site_subtitle"]');
        const contentWidthSelect = document.querySelector('select[name="content_width"]');
        const sidebarWidthInput = document.querySelector('input[name="sidebar_width"]');
        
        if (titleInput) titleInput.value = homepageConfig.site.title || '手赚网';
        if (subtitleInput) subtitleInput.value = homepageConfig.site.subtitle || '专业手机赚钱软件分享平台';
        if (contentWidthSelect) contentWidthSelect.value = homepageConfig.site.contentWidth || 'fixed';
        if (sidebarWidthInput) sidebarWidthInput.value = homepageConfig.site.sidebarWidth || 280;
    }
    
    // 应用模块配置
    if (homepageConfig.modules) {
        homepageConfig.modules.forEach(module => {
            const item = document.querySelector(`[data-module="${module.id}"]`);
            if (!item) return;
            
            const enabledInput = item.querySelector(`input[name="${module.id}_enabled"]`);
            if (enabledInput) {
                enabledInput.checked = module.enabled;
            }
            
            const countInput = item.querySelector(`input[name="${module.id}_count"]`);
            if (countInput && module.count) {
                countInput.value = module.count;
            }
            
            const layoutSelect = item.querySelector(`select[name="${module.id}_layout"]`);
            if (layoutSelect && module.layout) {
                layoutSelect.value = module.layout;
            }
            
            const positionSelect = item.querySelector(`select[name="${module.id}_position"]`);
            if (positionSelect && module.position) {
                positionSelect.value = module.position;
            }
            
            const autoplaySelect = item.querySelector(`select[name="${module.id}_autoplay"]`);
            if (autoplaySelect !== null) {
                autoplaySelect.value = String(module.autoplay !== undefined ? module.autoplay : true);
            }
            
            const intervalInput = item.querySelector(`input[name="${module.id}_interval"]`);
            if (intervalInput && module.interval) {
                intervalInput.value = module.interval;
            }
            
            const sortSelect = item.querySelector(`select[name="${module.id}_sort"]`);
            if (sortSelect && module.sort) {
                sortSelect.value = module.sort;
            }
            
            const hideSelect = item.querySelector(`select[name="${module.id}_hide"]`);
            if (hideSelect !== null) {
                hideSelect.value = String(module.autoHide !== undefined ? module.autoHide : false);
            }
            
            if (module.subModules) {
                // 先取消所有子模块选中
                const allSubInputs = item.querySelectorAll('input[type="checkbox"]');
                allSubInputs.forEach(input => {
                    if (input.name.startsWith(module.id + '_')) {
                        input.checked = false;
                    }
                });
                // 然后选中配置的子模块
                module.subModules.forEach(sub => {
                    const subInput = item.querySelector(`input[name="${module.id}_${sub}"]`);
                    if (subInput) subInput.checked = true;
                });
            }
        });
    }
}

async function saveHomepageConfig() {
    // 获取站点配置
    const siteConfig = {
        title: document.querySelector('input[name="site_title"]').value || '手赚网',
        subtitle: document.querySelector('input[name="site_subtitle"]').value || '专业手机赚钱软件分享平台',
        contentWidth: document.querySelector('select[name="content_width"]').value || 'fixed',
        sidebarWidth: parseInt(document.querySelector('input[name="sidebar_width"]').value) || 280
    };
    
    // 获取模块配置
    const moduleList = document.getElementById('moduleList');
    const items = moduleList.querySelectorAll('.module-item');
    
    const modules = [];
    items.forEach((item, index) => {
        const moduleId = item.dataset.module;
        const module = { id: moduleId, order: index };
        
        const enabledInput = item.querySelector(`input[name="${moduleId}_enabled"]`);
        if (enabledInput) module.enabled = enabledInput.checked;
        
        const countInput = item.querySelector(`input[name="${moduleId}_count"]`);
        if (countInput) module.count = parseInt(countInput.value);
        
        const layoutSelect = item.querySelector(`select[name="${moduleId}_layout"]`);
        if (layoutSelect) module.layout = layoutSelect.value;
        
        const positionSelect = item.querySelector(`select[name="${moduleId}_position"]`);
        if (positionSelect) module.position = positionSelect.value;
        
        const autoplaySelect = item.querySelector(`select[name="${moduleId}_autoplay"]`);
        if (autoplaySelect) module.autoplay = autoplaySelect.value === 'true';
        
        const intervalInput = item.querySelector(`input[name="${moduleId}_interval"]`);
        if (intervalInput) module.interval = parseInt(intervalInput.value);
        
        const sortSelect = item.querySelector(`select[name="${moduleId}_sort"]`);
        if (sortSelect) module.sort = sortSelect.value;
        
        const hideSelect = item.querySelector(`select[name="${moduleId}_hide"]`);
        if (hideSelect) module.autoHide = hideSelect.value === 'true';
        
        // 处理子模块
        const subInputs = item.querySelectorAll('input[type="checkbox"]');
        const subModules = [];
        subInputs.forEach(input => {
            if (input.checked && input.name.startsWith(moduleId + '_')) {
                subModules.push(input.name.replace(moduleId + '_', ''));
            }
        });
        if (subModules.length > 0) module.subModules = subModules;
        
        modules.push(module);
    });
    
    // 处理侧边栏配置（非拖拽模块）
    ['leftSidebar', 'rightSidebar', 'liveDynamic'].forEach(moduleId => {
        const item = document.querySelector(`.config-section .module-item[data-module="${moduleId}"]`) ||
                     document.querySelector(`.module-item.compact[data-module="${moduleId}"]`);
        if (!item) return;
        
        const existingModule = modules.find(m => m.id === moduleId);
        if (existingModule) return;
        
        const module = { id: moduleId };
        
        const enabledInput = item.querySelector(`input[name="${moduleId}_enabled"]`);
        if (enabledInput) module.enabled = enabledInput.checked;
        
        const countInput = item.querySelector(`input[name="${moduleId}_count"]`);
        if (countInput) module.count = parseInt(countInput.value);
        
        const positionSelect = item.querySelector(`select[name="${moduleId}_position"]`);
        if (positionSelect) module.position = positionSelect.value;
        
        const hideSelect = item.querySelector(`select[name="${moduleId}_hide"]`);
        if (hideSelect) module.autoHide = hideSelect.value === 'true';
        
        const subInputs = item.querySelectorAll('input[type="checkbox"]');
        const subModules = [];
        subInputs.forEach(input => {
            if (input.checked && input.name.startsWith(moduleId + '_')) {
                subModules.push(input.name.replace(moduleId + '_', ''));
            }
        });
        if (subModules.length > 0) module.subModules = subModules;
        
        modules.push(module);
    });
    
    homepageConfig = { site: siteConfig, modules };
    
    try {
        await fetchAPI('/api/homepage-config', 'POST', homepageConfig);
        showToast('首页配置已保存');
    } catch (e) {
        showToast('保存失败', 'error');
    }
}

function resetHomepageConfig() {
    homepageConfig = getDefaultHomepageConfig();
    applyHomepageConfig();
    // 重置布局预设为默认
    document.querySelectorAll('.preset-card').forEach(card => {
        card.classList.remove('active');
        if (card.dataset.preset === 'default') {
            card.classList.add('active');
        }
    });
    showToast('已重置为默认配置');
}

function previewHomepageConfig() {
    window.open('/', '_blank');
}

// 布局预设切换
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.preset-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.preset-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            const preset = layoutPresets[card.dataset.preset];
            if (preset) {
                document.querySelector('select[name="content_width"]').value = preset.contentWidth;
                document.querySelector('input[name="sidebar_width"]').value = preset.sidebarWidth;
            }
        });
    });
});

// 拖拽排序功能
function initDragSort() {
    const moduleList = document.getElementById('moduleList');
    if (!moduleList) return;
    
    let draggedItem = null;
    
    moduleList.addEventListener('dragstart', function(e) {
        if (e.target.closest('.module-item')) {
            draggedItem = e.target.closest('.module-item');
            draggedItem.classList.add('dragging');
        }
    });
    
    moduleList.addEventListener('dragend', function() {
        if (draggedItem) {
            draggedItem.classList.remove('dragging');
            draggedItem = null;
        }
    });
    
    moduleList.addEventListener('dragover', function(e) {
        e.preventDefault();
        const afterElement = getDragAfterElement(moduleList, e.clientY);
        const dragging = document.querySelector('.dragging');
        if (afterElement == null) {
            moduleList.appendChild(dragging);
        } else {
            moduleList.insertBefore(dragging, afterElement);
        }
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.module-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// 设置模块可拖拽
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.querySelectorAll('.module-item').forEach(item => {
            item.setAttribute('draggable', 'true');
        });
    }, 100);
});
