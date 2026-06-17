const App = {
    currentPage: 'dashboard',
    liveState: null,
    liveTimer: null,
    orderSimulator: null,

    init() {
        DataStore.init();
        this.bindEvents();
        this.renderPage('dashboard');
    },

    bindEvents() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                this.renderPage(page);
            });
        });

        document.getElementById('quickCreateBtn').addEventListener('click', () => {
            this.showPlanModal();
        });

        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target.id === 'modalOverlay') {
                this.closeModal();
            }
        });
    },

    renderPage(page) {
        this.currentPage = page;
        this.stopLiveSimulator();

        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === page) {
                item.classList.add('active');
            }
        });

        const contentArea = document.getElementById('contentArea');
        const pageTitle = document.getElementById('pageTitle');
        const pageSubtitle = document.getElementById('pageSubtitle');

        switch (page) {
            case 'dashboard':
                pageTitle.textContent = '数据概览';
                pageSubtitle.textContent = '查看直播运营核心数据指标';
                contentArea.innerHTML = this.renderDashboard();
                break;
            case 'plans':
                pageTitle.textContent = '直播计划';
                pageSubtitle.textContent = '管理直播场次和商品串讲脚本';
                contentArea.innerHTML = this.renderPlans();
                this.bindPlanEvents();
                break;
            case 'products':
                pageTitle.textContent = '商品管理';
                pageSubtitle.textContent = '管理直播间商品库和库存';
                contentArea.innerHTML = this.renderProducts();
                this.bindProductEvents();
                break;
            case 'live':
                pageTitle.textContent = '直播中控';
                pageSubtitle.textContent = '直播实时监控与商品切换';
                contentArea.innerHTML = this.renderLive();
                this.initLive();
                break;
            case 'reports':
                pageTitle.textContent = '复盘报告';
                pageSubtitle.textContent = '直播数据复盘与多场对比分析';
                contentArea.innerHTML = this.renderReports();
                this.bindReportEvents();
                break;
            case 'assistant':
                pageTitle.textContent = '选品助手';
                pageSubtitle.textContent = '智能推荐下场直播商品组合';
                contentArea.innerHTML = this.renderAssistant();
                break;
        }
    },

    renderDashboard() {
        const stats = DataStore.getDashboardStats();
        const topProducts = DataStore.getTopProducts(5);
        const recentSessions = DataStore.getRecentSessions(5);
        const categories = DataStore.getCategoryPerformance();

        const formatMoney = (num) => {
            if (num >= 10000) {
                return (num / 10000).toFixed(1) + '万';
            }
            return num.toLocaleString();
        };

        const formatNumber = (num) => {
            if (num >= 10000) {
                return (num / 10000).toFixed(1) + '万';
            }
            return num.toLocaleString();
        };

        const maxGMV = categories.length > 0 ? Math.max(...categories.map(c => c.totalGMV)) : 1;

        return `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon red">💰</div>
                        <span class="stat-trend up">↑ 12.5%</span>
                    </div>
                    <div class="stat-value">¥${formatMoney(stats.totalGMV)}</div>
                    <div class="stat-label">累计GMV</div>
                </div>
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon green">📦</div>
                        <span class="stat-trend up">↑ 8.3%</span>
                    </div>
                    <div class="stat-value">${formatNumber(stats.totalOrders)}</div>
                    <div class="stat-label">累计订单数</div>
                </div>
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon blue">👀</div>
                        <span class="stat-trend up">↑ 15.2%</span>
                    </div>
                    <div class="stat-value">${formatNumber(stats.totalViewers)}</div>
                    <div class="stat-label">累计观看人次</div>
                </div>
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon orange">🎬</div>
                        <span class="stat-trend up">↑ 3场</span>
                    </div>
                    <div class="stat-value">${stats.totalSessions}</div>
                    <div class="stat-label">累计直播场次</div>
                </div>
            </div>

            <div class="two-column">
                <div class="chart-container">
                    <div class="chart-title">类目GMV分布</div>
                    <div class="bar-chart">
                        ${categories.map(cat => `
                            <div class="bar-item">
                                <div class="bar" style="height: ${(cat.totalGMV / maxGMV * 100)}%" title="¥${formatMoney(cat.totalGMV)}"></div>
                                <div class="bar-label">${cat.categoryName.slice(0, 4)}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div class="card-title">热销商品TOP5</div>
                    </div>
                    <div class="card-body">
                        ${topProducts.length > 0 ? `
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>排名</th>
                                        <th>商品</th>
                                        <th>GMV</th>
                                        <th>销量</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${topProducts.map((p, i) => `
                                        <tr>
                                            <td>
                                                <span class="badge ${i < 3 ? 'badge-warning' : 'badge-default'}" style="width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;padding:0;">
                                                    ${i + 1}
                                                </span>
                                            </td>
                                            <td>
                                                <div style="display:flex;align-items:center;gap:10px;">
                                                    <span style="font-size:24px;">${p.image}</span>
                                                    <span style="font-size:13px;">${p.productName}</span>
                                                </div>
                                            </td>
                                            <td style="color:var(--primary-color);font-weight:600;">¥${formatMoney(p.totalGMV)}</td>
                                            <td>${formatNumber(p.totalSold)}件</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        ` : '<div class="empty-state"><div class="empty-icon">📊</div><div class="empty-text">暂无数据</div></div>'}
                    </div>
                </div>
            </div>

            <div class="card" style="margin-top:20px;">
                <div class="card-header">
                    <div class="card-title">最近直播场次</div>
                    <button class="btn btn-sm btn-outline" onclick="App.renderPage('reports')">查看全部</button>
                </div>
                <div class="card-body">
                    ${recentSessions.length > 0 ? `
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>场次名称</th>
                                    <th>日期</th>
                                    <th>主播</th>
                                    <th>峰值观看</th>
                                    <th>GMV</th>
                                    <th>订单数</th>
                                    <th>转化率</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${recentSessions.map(s => `
                                    <tr style="cursor:pointer;" onclick="App.showSessionDetail('${s.id}')">
                                        <td style="font-weight:500;">${s.title}</td>
                                        <td>${s.date}</td>
                                        <td>${s.host}</td>
                                        <td>${formatNumber(s.peakViewers)}</td>
                                        <td style="color:var(--primary-color);font-weight:600;">¥${formatMoney(s.totalGMV)}</td>
                                        <td>${formatNumber(s.totalOrders)}</td>
                                        <td>
                                            <span class="badge badge-success">${(s.conversionRate * 100).toFixed(2)}%</span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : '<div class="empty-state"><div class="empty-icon">📅</div><div class="empty-text">暂无直播记录</div></div>'}
                </div>
            </div>
        `;
    },

    renderPlans() {
        const plans = DataStore.getPlans();
        const products = DataStore.getProducts();

        const formatProducts = (planProducts) => {
            if (!planProducts || planProducts.length === 0) return '未设置商品';
            return planProducts.length + '个商品';
        };

        const getStatusBadge = (status, date) => {
            if (status === 'completed') return '<span class="badge badge-default">已结束</span>';
            if (status === 'live') return '<span class="badge badge-danger">直播中</span>';
            const today = new Date().toISOString().split('T')[0];
            if (date < today) return '<span class="badge badge-default">已过期</span>';
            if (date === today) return '<span class="badge badge-warning">今日直播</span>';
            return '<span class="badge badge-success">待开播</span>';
        };

        return `
            <div class="page-header">
                <div style="display:flex;gap:12px;align-items:center;">
                    <div class="tabs" style="margin-bottom:0;border-bottom:none;">
                        <div class="tab-item active" data-tab="all">全部计划</div>
                        <div class="tab-item" data-tab="upcoming">待开播</div>
                        <div class="tab-item" data-tab="completed">已结束</div>
                    </div>
                </div>
                <button class="btn btn-primary" onclick="App.showPlanModal()">
                    <span>+</span> 新建直播计划
                </button>
            </div>

            <div id="plansList">
                ${plans.length > 0 ? plans.map(plan => `
                    <div class="plan-card" onclick="App.showPlanDetail('${plan.id}')">
                        <div class="plan-header">
                            <div class="plan-title">${plan.title}</div>
                            ${getStatusBadge(plan.status, plan.date)}
                        </div>
                        <div class="plan-meta">
                            <span>📅 ${plan.date} ${plan.startTime}</span>
                            <span>⏱️ ${plan.duration}分钟</span>
                            <span>🎤 ${plan.host}</span>
                            <span>🛍️ ${formatProducts(plan.products)}</span>
                            <span>👥 预计${plan.expectedViewers?.toLocaleString() || 0}人观看</span>
                        </div>
                        <div style="font-size:13px;color:var(--text-secondary);margin-bottom:12px;">
                            ${plan.description || '暂无描述'}
                        </div>
                        <div class="plan-products">
                            ${(plan.products || []).slice(0, 5).map(p => {
                                const prod = products.find(pr => pr.id === p.productId);
                                return prod ? `
                                    <span class="plan-product-tag">
                                        <span>${prod.image}</span>
                                        <span>${prod.name.substring(0, 10)}...</span>
                                    </span>
                                ` : '';
                            }).join('')}
                            ${(plan.products || []).length > 5 ? 
                                `<span class="plan-product-tag">+${(plan.products.length - 5)}个</span>` : ''}
                        </div>
                    </div>
                `).join('') : `
                    <div class="empty-state">
                        <div class="empty-icon">📅</div>
                        <div class="empty-text">暂无直播计划</div>
                        <div class="empty-hint">创建你的第一场直播计划吧</div>
                        <button class="btn btn-primary" onclick="App.showPlanModal()">创建直播计划</button>
                    </div>
                `}
            </div>
        `;
    },

    bindPlanEvents() {
        document.querySelectorAll('[data-tab]').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('[data-tab]').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.filterPlans(e.target.dataset.tab);
            });
        });
    },

    filterPlans(tab) {
        const plans = DataStore.getPlans();
        let filtered = plans;
        const today = new Date().toISOString().split('T')[0];

        if (tab === 'upcoming') {
            filtered = plans.filter(p => p.status === 'upcoming' && p.date >= today);
        } else if (tab === 'completed') {
            filtered = plans.filter(p => p.status === 'completed' || p.date < today);
        }

        const products = DataStore.getProducts();
        const formatProducts = (planProducts) => {
            if (!planProducts || planProducts.length === 0) return '未设置商品';
            return planProducts.length + '个商品';
        };
        const getStatusBadge = (status, date) => {
            if (status === 'completed') return '<span class="badge badge-default">已结束</span>';
            if (status === 'live') return '<span class="badge badge-danger">直播中</span>';
            if (date < today) return '<span class="badge badge-default">已过期</span>';
            if (date === today) return '<span class="badge badge-warning">今日直播</span>';
            return '<span class="badge badge-success">待开播</span>';
        };

        const plansList = document.getElementById('plansList');
        plansList.innerHTML = filtered.length > 0 ? filtered.map(plan => `
            <div class="plan-card" onclick="App.showPlanDetail('${plan.id}')">
                <div class="plan-header">
                    <div class="plan-title">${plan.title}</div>
                    ${getStatusBadge(plan.status, plan.date)}
                </div>
                <div class="plan-meta">
                    <span>📅 ${plan.date} ${plan.startTime}</span>
                    <span>⏱️ ${plan.duration}分钟</span>
                    <span>🎤 ${plan.host}</span>
                    <span>🛍️ ${formatProducts(plan.products)}</span>
                    <span>👥 预计${plan.expectedViewers?.toLocaleString() || 0}人观看</span>
                </div>
                <div style="font-size:13px;color:var(--text-secondary);margin-bottom:12px;">
                    ${plan.description || '暂无描述'}
                </div>
                <div class="plan-products">
                    ${(plan.products || []).slice(0, 5).map(p => {
                        const prod = products.find(pr => pr.id === p.productId);
                        return prod ? `
                            <span class="plan-product-tag">
                                <span>${prod.image}</span>
                                <span>${prod.name.substring(0, 10)}...</span>
                            </span>
                        ` : '';
                    }).join('')}
                    ${(plan.products || []).length > 5 ? 
                        `<span class="plan-product-tag">+${(plan.products.length - 5)}个</span>` : ''}
                </div>
            </div>
        `).join('') : `
            <div class="empty-state">
                <div class="empty-icon">📅</div>
                <div class="empty-text">暂无直播计划</div>
            </div>
        `;
    },

    showPlanModal(planId = null) {
        const plan = planId ? DataStore.getPlanById(planId) : null;
        const products = DataStore.getProducts();
        const isEdit = !!plan;

        const productOptions = products.map(p => `
            <option value="${p.id}">${p.image} ${p.name}</option>
        `).join('');

        this.showModal(`
            <div class="modal-header">
                <div class="modal-title">${isEdit ? '编辑直播计划' : '新建直播计划'}</div>
                <button class="modal-close" onclick="App.closeModal()">✕</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label">直播标题 <span class="required">*</span></label>
                    <input type="text" class="form-input" id="planTitle" placeholder="请输入直播标题" value="${plan?.title || ''}">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">直播日期 <span class="required">*</span></label>
                        <input type="date" class="form-input" id="planDate" value="${plan?.date || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">开始时间 <span class="required">*</span></label>
                        <input type="time" class="form-input" id="planStartTime" value="${plan?.startTime || '19:00'}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">预计时长（分钟）</label>
                        <input type="number" class="form-input" id="planDuration" value="${plan?.duration || 120}" min="30" step="30">
                    </div>
                    <div class="form-group">
                        <label class="form-label">主播</label>
                        <input type="text" class="form-input" id="planHost" placeholder="主播名称" value="${plan?.host || ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">预计观看人数</label>
                    <input type="number" class="form-input" id="planViewers" placeholder="预计观看人数" value="${plan?.expectedViewers || 10000}">
                </div>
                <div class="form-group">
                    <label class="form-label">直播描述</label>
                    <textarea class="form-textarea" id="planDesc" placeholder="简单描述一下这场直播...">${plan?.description || ''}</textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">商品串讲脚本</label>
                    <div id="productScriptList">
                        ${(plan?.products || []).map((p, i) => this.renderScriptItem(p, i)).join('')}
                    </div>
                    <button type="button" class="btn btn-outline btn-sm" style="margin-top:8px;" onclick="App.addScriptItem()">
                        <span>+</span> 添加商品
                    </button>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="App.closeModal()">取消</button>
                <button class="btn btn-primary" onclick="App.savePlan('${planId || ''}')">保存</button>
            </div>
        `, 'modal-lg');
    },

    renderScriptItem(scriptItem, index) {
        const products = DataStore.getProducts();
        const product = scriptItem ? products.find(p => p.id === scriptItem.productId) : null;

        return `
            <div class="script-item" style="display:flex;gap:12px;padding:12px;background:var(--bg-primary);border-radius:8px;margin-bottom:8px;align-items:center;">
                <div style="width:30px;height:30px;border-radius:50%;background:var(--primary-color);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:13px;flex-shrink:0;">
                    ${index + 1}
                </div>
                <div style="flex:1;">
                    <select class="form-input script-product-select" style="margin-bottom:8px;" onchange="App.updateScriptItemOrder()">
                        <option value="">请选择商品</option>
                        ${products.map(p => `
                            <option value="${p.id}" ${product?.id === p.id ? 'selected' : ''}>${p.image} ${p.name} - ¥${p.livePrice}</option>
                        `).join('')}
                    </select>
                    <input type="text" class="form-input script-script-input" placeholder="串讲脚本要点..." value="${scriptItem?.script || ''}">
                </div>
                <button type="button" class="btn btn-sm btn-outline" onclick="this.closest('.script-item').remove();App.updateScriptItemOrder();" style="flex-shrink:0;">
                    删除
                </button>
            </div>
        `;
    },

    addScriptItem() {
        const list = document.getElementById('productScriptList');
        const items = list.querySelectorAll('.script-item');
        const newItem = document.createElement('div');
        newItem.innerHTML = this.renderScriptItem(null, items.length);
        list.appendChild(newItem.firstElementChild);
        this.updateScriptItemOrder();
    },

    updateScriptItemOrder() {
        const items = document.querySelectorAll('#productScriptList .script-item');
        items.forEach((item, index) => {
            const numEl = item.querySelector('div:first-child');
            if (numEl) numEl.textContent = index + 1;
        });
    },

    savePlan(planId) {
        const title = document.getElementById('planTitle').value.trim();
        const date = document.getElementById('planDate').value;
        const startTime = document.getElementById('planStartTime').value;
        const duration = parseInt(document.getElementById('planDuration').value) || 120;
        const host = document.getElementById('planHost').value.trim();
        const expectedViewers = parseInt(document.getElementById('planViewers').value) || 10000;
        const description = document.getElementById('planDesc').value.trim();

        if (!title) {
            alert('请输入直播标题');
            return;
        }
        if (!date) {
            alert('请选择直播日期');
            return;
        }
        if (!startTime) {
            alert('请选择开始时间');
            return;
        }

        const scriptItems = document.querySelectorAll('#productScriptList .script-item');
        const products = [];
        scriptItems.forEach((item, index) => {
            const select = item.querySelector('.script-product-select');
            const scriptInput = item.querySelector('.script-script-input');
            if (select.value) {
                products.push({
                    productId: select.value,
                    order: index + 1,
                    script: scriptInput.value.trim()
                });
            }
        });

        const planData = {
            title,
            date,
            startTime,
            duration,
            host,
            expectedViewers,
            description,
            products
        };

        if (planId) {
            DataStore.updatePlan(planId, planData);
        } else {
            DataStore.addPlan(planData);
        }

        this.closeModal();
        this.renderPage('plans');
    },

    showPlanDetail(planId) {
        const plan = DataStore.getPlanById(planId);
        if (!plan) return;

        const products = DataStore.getProducts();
        const today = new Date().toISOString().split('T')[0];
        const canStart = plan.date >= today;

        this.showModal(`
            <div class="modal-header">
                <div class="modal-title">直播计划详情</div>
                <button class="modal-close" onclick="App.closeModal()">✕</button>
            </div>
            <div class="modal-body">
                <div style="margin-bottom:20px;">
                    <h3 style="font-size:20px;margin-bottom:12px;">${plan.title}</h3>
                    <div style="display:flex;gap:20px;color:var(--text-secondary);font-size:13px;flex-wrap:wrap;">
                        <span>📅 ${plan.date} ${plan.startTime}</span>
                        <span>⏱️ ${plan.duration}分钟</span>
                        <span>🎤 ${plan.host}</span>
                        <span>👥 预计${plan.expectedViewers?.toLocaleString() || 0}人</span>
                    </div>
                </div>

                ${plan.description ? `
                    <div style="margin-bottom:20px;padding:16px;background:var(--bg-primary);border-radius:8px;">
                        <div style="font-weight:500;margin-bottom:8px;">直播描述</div>
                        <div style="color:var(--text-secondary);font-size:13px;">${plan.description}</div>
                    </div>
                ` : ''}

                <div>
                    <div style="font-weight:600;margin-bottom:12px;">商品串讲脚本顺序表</div>
                    ${(plan.products || []).length > 0 ? `
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th style="width:60px;">顺序</th>
                                    <th>商品</th>
                                    <th>直播价</th>
                                    <th>库存</th>
                                    <th>串讲脚本</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${plan.products.map(p => {
                                    const prod = products.find(pr => pr.id === p.productId);
                                    if (!prod) return '';
                                    const isLowStock = prod.stock <= prod.stockWarning;
                                    return `
                                        <tr>
                                            <td>
                                                <span class="badge badge-info">${p.order}</span>
                                            </td>
                                            <td>
                                                <div style="display:flex;align-items:center;gap:10px;">
                                                    <span style="font-size:28px;">${prod.image}</span>
                                                    <span style="font-size:13px;">${prod.name}</span>
                                                </div>
                                            </td>
                                            <td style="color:var(--primary-color);font-weight:600;">¥${prod.livePrice}</td>
                                            <td class="${isLowStock ? 'stock-warning-text' : ''}">
                                                ${prod.stock}件
                                                ${isLowStock ? '<span class="badge badge-danger" style="margin-left:6px;">库存紧张</span>' : ''}
                                            </td>
                                            <td style="font-size:12px;color:var(--text-secondary);">${p.script || '-'}</td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    ` : '<div class="empty-state"><div class="empty-icon">🛍️</div><div class="empty-text">还没有添加商品</div></div>'}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="App.deletePlan('${planId}')">删除计划</button>
                <button class="btn btn-outline" onclick="App.closeModal();App.showPlanModal('${planId}')">编辑</button>
                ${canStart ? `<button class="btn btn-primary" onclick="App.startLiveFromPlan('${planId}')">开始直播</button>` : ''}
            </div>
        `, 'modal-lg');
    },

    deletePlan(planId) {
        if (confirm('确定要删除这个直播计划吗？')) {
            DataStore.deletePlan(planId);
            this.closeModal();
            this.renderPage('plans');
        }
    },

    startLiveFromPlan(planId) {
        const plan = DataStore.getPlanById(planId);
        if (!plan) return;

        const products = DataStore.getProducts();
        const liveProducts = (plan.products || []).map(p => {
            const prod = products.find(pr => pr.id === p.productId);
            if (!prod) return null;
            return {
                productId: prod.id,
                productName: prod.name,
                image: prod.image,
                order: p.order,
                script: p.script,
                originalPrice: prod.originalPrice,
                livePrice: prod.livePrice,
                initialStock: prod.stock,
                currentStock: prod.stock,
                soldQuantity: 0,
                gmv: 0,
                viewers: 0,
                peakViewers: 0,
                stockWarning: prod.stockWarning
            };
        }).filter(p => p !== null).sort((a, b) => a.order - b.order);

        const sessionData = {
            planId: plan.id,
            title: plan.title,
            date: new Date().toISOString().split('T')[0],
            startTime: new Date().toISOString(),
            endTime: null,
            duration: 0,
            host: plan.host,
            peakViewers: 0,
            totalViewers: 0,
            totalOrders: 0,
            totalGMV: 0,
            avgWatchTime: 0,
            conversionRate: 0,
            products: liveProducts,
            status: 'live',
            currentProductIndex: 0
        };

        DataStore.setCurrentSession(sessionData);
        this.closeModal();
        this.renderPage('live');
    },

    renderProducts() {
        const products = DataStore.getProducts();
        const categories = DataStore.getCategories();

        return `
            <div class="page-header">
                <div class="filter-bar" style="margin-bottom:0;">
                    <div class="filter-item">
                        <select id="productCategoryFilter" onchange="App.filterProducts()">
                            <option value="">全部分类</option>
                            ${categories.map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="filter-item">
                        <select id="productStockFilter" onchange="App.filterProducts()">
                            <option value="">全部库存</option>
                            <option value="low">库存紧张</option>
                            <option value="normal">库存正常</option>
                        </select>
                    </div>
                </div>
                <button class="btn btn-primary" onclick="App.showProductModal()">
                    <span>+</span> 添加商品
                </button>
            </div>

            <div id="productsGrid" class="product-grid">
                ${products.map(product => this.renderProductCard(product)).join('')}
            </div>
        `;
    },

    renderProductCard(product) {
        const isLowStock = product.stock <= product.stockWarning;
        const discount = Math.round((1 - product.livePrice / product.originalPrice) * 100);

        return `
            <div class="product-card ${isLowStock ? 'stock-warning' : ''}" onclick="App.showProductDetail('${product.id}')">
                <div class="product-image">${product.image}</div>
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-price">
                        ¥${product.livePrice}
                        <span class="original">¥${product.originalPrice}</span>
                    </div>
                    <div class="product-meta">
                        <span>库存: ${product.stock}件</span>
                        <span class="tag tag-primary" style="margin:0;">${discount}%OFF</span>
                    </div>
                    ${isLowStock ? '<div class="badge badge-danger" style="margin-top:8px;">库存紧张</div>' : ''}
                </div>
            </div>
        `;
    },

    bindProductEvents() {
    },

    filterProducts() {
        const category = document.getElementById('productCategoryFilter').value;
        const stock = document.getElementById('productStockFilter').value;
        
        let products = DataStore.getProducts();
        
        if (category) {
            products = products.filter(p => p.categoryId === category);
        }
        
        if (stock === 'low') {
            products = products.filter(p => p.stock <= p.stockWarning);
        } else if (stock === 'normal') {
            products = products.filter(p => p.stock > p.stockWarning);
        }

        document.getElementById('productsGrid').innerHTML = products.length > 0 
            ? products.map(p => this.renderProductCard(p)).join('')
            : '<div class="empty-state" style="grid-column:1/-1;"><div class="empty-icon">🔍</div><div class="empty-text">没有找到匹配的商品</div></div>';
    },

    showProductModal(productId = null) {
        const product = productId ? DataStore.getProductById(productId) : null;
        const categories = DataStore.getCategories();
        const isEdit = !!product;

        this.showModal(`
            <div class="modal-header">
                <div class="modal-title">${isEdit ? '编辑商品' : '添加商品'}</div>
                <button class="modal-close" onclick="App.closeModal()">✕</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label">商品名称 <span class="required">*</span></label>
                    <input type="text" class="form-input" id="productName" placeholder="请输入商品名称" value="${product?.name || ''}">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">商品分类 <span class="required">*</span></label>
                        <select class="form-select" id="productCategory">
                            <option value="">请选择分类</option>
                            ${categories.map(c => `
                                <option value="${c.id}" ${product?.categoryId === c.id ? 'selected' : ''}>${c.icon} ${c.name}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">商品图标</label>
                        <input type="text" class="form-input" id="productImage" placeholder="emoji或图标" value="${product?.image || '🎁'}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">原价 <span class="required">*</span></label>
                        <input type="number" class="form-input" id="productOriginalPrice" placeholder="原价" value="${product?.originalPrice || ''}" min="0" step="0.01">
                    </div>
                    <div class="form-group">
                        <label class="form-label">直播价 <span class="required">*</span></label>
                        <input type="number" class="form-input" id="productLivePrice" placeholder="直播特价" value="${product?.livePrice || ''}" min="0" step="0.01">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">库存数量 <span class="required">*</span></label>
                        <input type="number" class="form-input" id="productStock" placeholder="库存上限" value="${product?.stock || 0}" min="0">
                    </div>
                    <div class="form-group">
                        <label class="form-label">库存预警阈值</label>
                        <input type="number" class="form-input" id="productStockWarning" placeholder="低于此数量预警" value="${product?.stockWarning || 20}" min="0">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">商品描述</label>
                    <textarea class="form-textarea" id="productDescription" placeholder="商品卖点、特点描述...">${product?.description || ''}</textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="App.closeModal()">取消</button>
                <button class="btn btn-primary" onclick="App.saveProduct('${productId || ''}')">保存</button>
            </div>
        `);
    },

    saveProduct(productId) {
        const name = document.getElementById('productName').value.trim();
        const categoryId = document.getElementById('productCategory').value;
        const image = document.getElementById('productImage').value.trim() || '🎁';
        const originalPrice = parseFloat(document.getElementById('productOriginalPrice').value) || 0;
        const livePrice = parseFloat(document.getElementById('productLivePrice').value) || 0;
        const stock = parseInt(document.getElementById('productStock').value) || 0;
        const stockWarning = parseInt(document.getElementById('productStockWarning').value) || 20;
        const description = document.getElementById('productDescription').value.trim();

        if (!name) {
            alert('请输入商品名称');
            return;
        }
        if (!categoryId) {
            alert('请选择商品分类');
            return;
        }
        if (originalPrice <= 0) {
            alert('请输入有效的原价');
            return;
        }
        if (livePrice <= 0) {
            alert('请输入有效的直播价');
            return;
        }

        const categories = DataStore.getCategories();
        const category = categories.find(c => c.id === categoryId);

        const productData = {
            name,
            categoryId,
            category: category?.name || '',
            image,
            originalPrice,
            livePrice,
            stock,
            stockWarning,
            description
        };

        if (productId) {
            DataStore.updateProduct(productId, productData);
        } else {
            DataStore.addProduct(productData);
        }

        this.closeModal();
        this.renderPage('products');
    },

    showProductDetail(productId) {
        const product = DataStore.getProductById(productId);
        if (!product) return;

        const isLowStock = product.stock <= product.stockWarning;
        const discount = Math.round((1 - product.livePrice / product.originalPrice) * 100);

        this.showModal(`
            <div class="modal-header">
                <div class="modal-title">商品详情</div>
                <button class="modal-close" onclick="App.closeModal()">✕</button>
            </div>
            <div class="modal-body">
                <div style="display:flex;gap:24px;margin-bottom:20px;">
                    <div style="width:160px;height:160px;border-radius:12px;background:var(--bg-tertiary);display:flex;align-items:center;justify-content:center;font-size:72px;flex-shrink:0;">
                        ${product.image}
                    </div>
                    <div style="flex:1;">
                        <h3 style="font-size:18px;margin-bottom:12px;line-height:1.4;">${product.name}</h3>
                        <div style="margin-bottom:12px;">
                            <span style="font-size:28px;font-weight:700;color:var(--primary-color);">¥${product.livePrice}</span>
                            <span style="font-size:16px;color:var(--text-tertiary);text-decoration:line-through;margin-left:10px;">¥${product.originalPrice}</span>
                            <span class="tag tag-primary" style="margin-left:10px;">${discount}%OFF</span>
                        </div>
                        <div style="display:flex;gap:20px;color:var(--text-secondary);font-size:13px;">
                            <span>分类：${product.category}</span>
                            <span>销量：${product.salesCount}件</span>
                        </div>
                    </div>
                </div>

                <div class="stats-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:20px;">
                    <div class="stat-card" style="padding:16px;">
                        <div class="stat-value" style="font-size:22px;">${product.stock}件</div>
                        <div class="stat-label">当前库存</div>
                        ${isLowStock ? '<div class="badge badge-danger" style="margin-top:8px;">库存紧张</div>' : ''}
                    </div>
                    <div class="stat-card" style="padding:16px;">
                        <div class="stat-value" style="font-size:22px;">${product.stockWarning}件</div>
                        <div class="stat-label">预警阈值</div>
                    </div>
                    <div class="stat-card" style="padding:16px;">
                        <div class="stat-value" style="font-size:22px;">${(product.conversionRate * 100).toFixed(1)}%</div>
                        <div class="stat-label">历史转化率</div>
                    </div>
                </div>

                <div style="padding:16px;background:var(--bg-primary);border-radius:8px;">
                    <div style="font-weight:500;margin-bottom:8px;">商品描述</div>
                    <div style="color:var(--text-secondary);font-size:13px;line-height:1.6;">
                        ${product.description || '暂无描述'}
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary danger" onclick="App.deleteProduct('${productId}')">删除商品</button>
                <button class="btn btn-outline" onclick="App.closeModal();App.showProductModal('${productId}')">编辑</button>
                <button class="btn btn-primary" onclick="App.adjustStock('${productId}')">调整库存</button>
            </div>
        `, 'modal-lg');
    },

    adjustStock(productId) {
        const product = DataStore.getProductById(productId);
        const adjust = prompt('请输入库存调整数量（正数增加，负数减少）：', '0');
        
        if (adjust === null) return;
        
        const adjustNum = parseInt(adjust);
        if (isNaN(adjustNum)) {
            alert('请输入有效的数字');
            return;
        }

        const newStock = product.stock + adjustNum;
        if (newStock < 0) {
            alert('库存不能为负数');
            return;
        }

        DataStore.updateProduct(productId, { stock: newStock });
        this.closeModal();
        this.showProductDetail(productId);
    },

    deleteProduct(productId) {
        if (confirm('确定要删除这个商品吗？')) {
            DataStore.deleteProduct(productId);
            this.closeModal();
            this.renderPage('products');
        }
    },

    renderLive() {
        const currentSession = DataStore.getCurrentSession();
        
        if (!currentSession) {
            const plans = DataStore.getPlans();
            const today = new Date().toISOString().split('T')[0];
            const todayPlans = plans.filter(p => p.date === today);

            return `
                <div class="empty-state" style="padding:80px 20px;">
                    <div class="empty-icon" style="font-size:80px;">🎬</div>
                    <div class="empty-text" style="font-size:18px;font-weight:600;margin-bottom:8px;">当前没有进行中的直播</div>
                    <div class="empty-hint">选择一个直播计划开始，或创建新的直播</div>
                    
                    ${todayPlans.length > 0 ? `
                        <div style="margin-top:24px;text-align:left;max-width:500px;margin-left:auto;margin-right:auto;">
                            <div style="font-weight:600;margin-bottom:12px;color:var(--text-secondary);">今日直播计划</div>
                            ${todayPlans.map(plan => `
                                <div class="plan-card" style="margin-bottom:12px;" onclick="App.startLiveFromPlan('${plan.id}')">
                                    <div class="plan-header">
                                        <div class="plan-title">${plan.title}</div>
                                        <span class="badge badge-warning">${plan.startTime}</span>
                                    </div>
                                    <div class="plan-meta">
                                        <span>🎤 ${plan.host}</span>
                                        <span>🛍️ ${(plan.products || []).length}个商品</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    <div style="margin-top:24px;display:flex;gap:12px;justify-content:center;">
                        <button class="btn btn-primary btn-lg" onclick="App.renderPage('plans')">
                            <span>+</span> 创建直播计划
                        </button>
                        <button class="btn btn-outline btn-lg" onclick="App.startQuickLive()">
                            快速开播
                        </button>
                    </div>
                </div>
            `;
        }

        const products = currentSession.products || [];
        const currentIndex = currentSession.currentProductIndex || 0;
        const currentProduct = products[currentIndex];

        if (!currentProduct) {
            return `<div class="empty-state">没有商品数据</div>`;
        }

        const isLowStock = currentProduct.currentStock <= currentProduct.stockWarning;
        const stockPercent = (currentProduct.currentStock / currentProduct.initialStock) * 100;

        return `
            <div class="live-container">
                <div class="live-main">
                    <div class="current-product">
                        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
                            <div style="display:flex;align-items:center;gap:10px;">
                                <span class="badge badge-info">第 ${currentIndex + 1} / ${products.length} 个</span>
                                <span style="font-weight:500;">当前讲解商品</span>
                            </div>
                            ${isLowStock ? '<span class="badge badge-danger">⚠️ 库存紧张</span>' : ''}
                        </div>
                        
                        <div class="current-product-header">
                            <div class="current-product-image">${currentProduct.image}</div>
                            <div class="current-product-detail">
                                <div class="current-product-name">${currentProduct.productName}</div>
                                <div class="current-product-price">
                                    <span class="current-price">¥${currentProduct.livePrice}</span>
                                    <span class="original-price">¥${currentProduct.originalPrice}</span>
                                    <span class="discount-tag">${Math.round((1 - currentProduct.livePrice / currentProduct.originalPrice) * 100)}% OFF</span>
                                </div>
                                ${currentProduct.script ? `
                                    <div style="padding:12px;background:var(--bg-primary);border-radius:8px;font-size:13px;color:var(--text-secondary);">
                                        <strong style="color:var(--text-primary);">📝 串讲要点：</strong>${currentProduct.script}
                                    </div>
                                ` : ''}
                            </div>
                        </div>

                        <div class="live-stats">
                            <div class="live-stat">
                                <div class="live-stat-value" id="liveViewers">${(currentSession.peakViewers || 0).toLocaleString()}</div>
                                <div class="live-stat-label">观看人数</div>
                            </div>
                            <div class="live-stat">
                                <div class="live-stat-value" id="liveOrders">${currentSession.totalOrders}</div>
                                <div class="live-stat-label">本场订单</div>
                            </div>
                            <div class="live-stat">
                                <div class="live-stat-value" style="color:var(--primary-color);" id="liveGMV">¥${(currentSession.totalGMV / 10000).toFixed(1)}万</div>
                                <div class="live-stat-label">本场GMV</div>
                            </div>
                            <div class="live-stat">
                                <div class="live-stat-value ${isLowStock ? 'danger' : ''}" id="liveStock">${currentProduct.currentStock}</div>
                                <div class="live-stat-label">剩余库存</div>
                            </div>
                        </div>

                        <div style="margin-bottom:8px;display:flex;justify-content:space-between;font-size:12px;color:var(--text-secondary);">
                            <span>库存进度</span>
                            <span>${currentProduct.soldQuantity} / ${currentProduct.initialStock} 已售</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill ${isLowStock ? 'danger' : 'success'}" 
                                 id="stockProgress" 
                                 style="width:${100 - stockPercent}%"></div>
                        </div>
                    </div>

                    <div class="product-queue">
                        <div class="product-queue-header">
                            <span>商品串讲队列</span>
                            <span style="font-size:12px;color:var(--text-secondary);">点击切换</span>
                        </div>
                        <div class="product-queue-list" id="productQueueList">
                            ${products.map((p, i) => `
                                <div class="queue-item ${i === currentIndex ? 'active' : ''} ${i < currentIndex ? 'past' : ''}"
                                     onclick="App.switchProduct(${i})">
                                    <div class="queue-order">${p.order}</div>
                                    <div class="queue-item-image">${p.image}</div>
                                    <div class="queue-item-info">
                                        <div class="queue-item-name">${p.productName}</div>
                                        <div class="queue-item-price">¥${p.livePrice} · 已售${p.soldQuantity}件</div>
                                    </div>
                                    <div class="queue-item-status">
                                        ${i < currentIndex ? '已讲' : (i === currentIndex ? '讲解中' : '待讲解')}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="live-controls">
                        <button class="control-btn prev" ${currentIndex === 0 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} 
                                onclick="App.prevProduct()">
                            ◀ 上一个
                        </button>
                        <button class="control-btn next" ${currentIndex === products.length - 1 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}
                                onclick="App.nextProduct()">
                            下一个 ▶
                        </button>
                    </div>
                </div>

                <div class="live-sidebar">
                    <div class="live-status-card">
                        <div class="live-status-header">
                            <div class="live-dot"></div>
                            <div class="live-status-text">直播进行中</div>
                        </div>
                        <div class="live-duration" id="liveDuration">00:00:00</div>
                        <button class="btn btn-danger btn-block btn-sm" style="margin-top:12px;" onclick="App.endLive()">
                            结束直播
                        </button>
                    </div>

                    <div class="quick-stats">
                        <h3>实时数据</h3>
                        <div class="quick-stat-item">
                            <span class="quick-stat-label">峰值在线</span>
                            <span class="quick-stat-value" id="peakViewers">${(currentSession.peakViewers || 0).toLocaleString()}</span>
                        </div>
                        <div class="quick-stat-item">
                            <span class="quick-stat-label">商品点击数</span>
                            <span class="quick-stat-value" id="productClicks">0</span>
                        </div>
                        <div class="quick-stat-item">
                            <span class="quick-stat-label">加购数</span>
                            <span class="quick-stat-value" id="cartAdds">0</span>
                        </div>
                        <div class="quick-stat-item">
                            <span class="quick-stat-label">当前转化率</span>
                            <span class="quick-stat-value" id="liveConversion">0%</span>
                        </div>
                        <div class="quick-stat-item">
                            <span class="quick-stat-label">商品讲解数</span>
                            <span class="quick-stat-value">${currentIndex + 1}/${products.length}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    initLive() {
        const currentSession = DataStore.getCurrentSession();
        if (!currentSession) return;

        this.liveState = { ...currentSession };
        
        const startTime = new Date(currentSession.startTime).getTime();
        this.updateDuration(startTime);
        
        this.liveTimer = setInterval(() => {
            this.updateDuration(startTime);
        }, 1000);

        this.startOrderSimulator();
    },

    updateDuration(startTime) {
        const now = Date.now();
        const diff = Math.floor((now - startTime) / 1000);
        const hours = Math.floor(diff / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
        const seconds = (diff % 60).toString().padStart(2, '0');
        
        const durationEl = document.getElementById('liveDuration');
        if (durationEl) {
            durationEl.textContent = `${hours}:${minutes}:${seconds}`;
        }
    },

    startOrderSimulator() {
        this.orderSimulator = setInterval(() => {
            if (!this.liveState || this.liveState.status !== 'live') return;

            const currentIndex = this.liveState.currentProductIndex || 0;
            const currentProduct = this.liveState.products[currentIndex];
            if (!currentProduct) return;

            const orderChance = 0.3;
            if (Math.random() < orderChance) {
                const orders = Math.floor(Math.random() * 5) + 1;
                const actualOrders = Math.min(orders, currentProduct.currentStock);
                
                if (actualOrders > 0) {
                    currentProduct.soldQuantity += actualOrders;
                    currentProduct.currentStock -= actualOrders;
                    currentProduct.gmv += actualOrders * currentProduct.livePrice;
                    
                    this.liveState.totalOrders += actualOrders;
                    this.liveState.totalGMV += actualOrders * currentProduct.livePrice;

                    DataStore.setCurrentSession(this.liveState);
                    this.updateLiveUI();
                }
            }

            const viewerChange = Math.floor((Math.random() - 0.3) * 200);
            const currentViewers = Math.max(100, (this.liveState.peakViewers || 0) + viewerChange);
            this.liveState.peakViewers = Math.max(this.liveState.peakViewers || 0, currentViewers);
            this.liveState.totalViewers = (this.liveState.totalViewers || 0) + Math.abs(viewerChange);

            DataStore.setCurrentSession(this.liveState);
            this.updateLiveViewers(currentViewers);
        }, 2000);
    },

    stopLiveSimulator() {
        if (this.liveTimer) {
            clearInterval(this.liveTimer);
            this.liveTimer = null;
        }
        if (this.orderSimulator) {
            clearInterval(this.orderSimulator);
            this.orderSimulator = null;
        }
    },

    updateLiveUI() {
        const currentIndex = this.liveState.currentProductIndex || 0;
        const currentProduct = this.liveState.products[currentIndex];
        if (!currentProduct) return;

        const stockEl = document.getElementById('liveStock');
        if (stockEl) {
            stockEl.textContent = currentProduct.currentStock;
            if (currentProduct.currentStock <= currentProduct.stockWarning) {
                stockEl.classList.add('danger');
            } else {
                stockEl.classList.remove('danger');
            }
        }

        const ordersEl = document.getElementById('liveOrders');
        if (ordersEl) {
            ordersEl.textContent = this.liveState.totalOrders;
        }

        const gmvEl = document.getElementById('liveGMV');
        if (gmvEl) {
            gmvEl.textContent = '¥' + (this.liveState.totalGMV / 10000).toFixed(1) + '万';
        }

        const progressEl = document.getElementById('stockProgress');
        if (progressEl) {
            const percent = (currentProduct.soldQuantity / currentProduct.initialStock) * 100;
            progressEl.style.width = percent + '%';
        }

        const queueList = document.getElementById('productQueueList');
        if (queueList) {
            const items = queueList.querySelectorAll('.queue-item');
            items.forEach((item, i) => {
                const product = this.liveState.products[i];
                if (product) {
                    const priceEl = item.querySelector('.queue-item-price');
                    if (priceEl) {
                        priceEl.textContent = `¥${product.livePrice} · 已售${product.soldQuantity}件`;
                    }
                }
            });
        }
    },

    updateLiveViewers(viewers) {
        const viewersEl = document.getElementById('liveViewers');
        if (viewersEl) {
            viewersEl.textContent = viewers.toLocaleString();
        }

        const peakEl = document.getElementById('peakViewers');
        if (peakEl) {
            peakEl.textContent = (this.liveState.peakViewers || 0).toLocaleString();
        }

        const convEl = document.getElementById('liveConversion');
        if (convEl && this.liveState.totalViewers > 0) {
            const rate = (this.liveState.totalOrders / this.liveState.totalViewers * 100).toFixed(2);
            convEl.textContent = rate + '%';
        }
    },

    switchProduct(index) {
        if (!this.liveState) return;
        if (index < 0 || index >= this.liveState.products.length) return;

        this.liveState.currentProductIndex = index;
        DataStore.setCurrentSession(this.liveState);
        
        const items = document.querySelectorAll('.queue-item');
        items.forEach((item, i) => {
            item.classList.remove('active', 'past');
            if (i === index) item.classList.add('active');
            if (i < index) item.classList.add('past');
            
            const statusEl = item.querySelector('.queue-item-status');
            if (statusEl) {
                statusEl.textContent = i < index ? '已讲' : (i === index ? '讲解中' : '待讲解');
            }
        });

        const currentProduct = this.liveState.products[index];
        const currentImage = document.querySelector('.current-product-image');
        const currentName = document.querySelector('.current-product-name');
        const currentPrice = document.querySelector('.current-price');
        const originalPrice = document.querySelector('.original-price');
        const discountTag = document.querySelector('.discount-tag');

        if (currentImage) currentImage.textContent = currentProduct.image;
        if (currentName) currentName.textContent = currentProduct.productName;
        if (currentPrice) currentPrice.textContent = '¥' + currentProduct.livePrice;
        if (originalPrice) originalPrice.textContent = '¥' + currentProduct.originalPrice;
        if (discountTag) {
            const discount = Math.round((1 - currentProduct.livePrice / currentProduct.originalPrice) * 100);
            discountTag.textContent = discount + '% OFF';
        }

        const orderBadge = document.querySelector('.badge.badge-info');
        if (orderBadge) {
            orderBadge.textContent = `第 ${index + 1} / ${this.liveState.products.length} 个`;
        }

        this.updateLiveUI();
    },

    nextProduct() {
        if (!this.liveState) return;
        const nextIndex = (this.liveState.currentProductIndex || 0) + 1;
        if (nextIndex < this.liveState.products.length) {
            this.switchProduct(nextIndex);
        }
    },

    prevProduct() {
        if (!this.liveState) return;
        const prevIndex = (this.liveState.currentProductIndex || 0) - 1;
        if (prevIndex >= 0) {
            this.switchProduct(prevIndex);
        }
    },

    endLive() {
        if (!confirm('确定要结束直播吗？结束后将生成复盘报告。')) return;

        this.stopLiveSimulator();

        const session = this.liveState;
        session.endTime = new Date().toISOString();
        session.duration = Math.floor((new Date(session.endTime) - new Date(session.startTime)) / 1000 / 60);
        session.status = 'completed';
        session.conversionRate = session.totalViewers > 0 ? session.totalOrders / session.totalViewers : 0;
        session.avgWatchTime = 15 + Math.random() * 10;

        session.products.forEach(p => {
            const product = DataStore.getProductById(p.productId);
            if (product) {
                DataStore.updateProduct(p.productId, {
                    stock: p.currentStock,
                    salesCount: product.salesCount + p.soldQuantity,
                    totalSales: product.totalSales + p.gmv
                });
            }
        });

        DataStore.addSession(session);
        DataStore.clearCurrentSession();
        this.liveState = null;

        this.showSessionDetail(session.id, true);
    },

    startQuickLive() {
        const products = DataStore.getProducts();
        if (products.length === 0) {
            alert('请先添加商品');
            this.renderPage('products');
            return;
        }

        const selectedProducts = products.slice(0, 5).map((p, i) => ({
            productId: p.id,
            productName: p.name,
            image: p.image,
            order: i + 1,
            script: '',
            originalPrice: p.originalPrice,
            livePrice: p.livePrice,
            initialStock: p.stock,
            currentStock: p.stock,
            soldQuantity: 0,
            gmv: 0,
            viewers: 0,
            peakViewers: 0,
            stockWarning: p.stockWarning
        }));

        const sessionData = {
            planId: null,
            title: '快速开播 - ' + new Date().toLocaleDateString(),
            date: new Date().toISOString().split('T')[0],
            startTime: new Date().toISOString(),
            endTime: null,
            duration: 0,
            host: '主播',
            peakViewers: 0,
            totalViewers: 0,
            totalOrders: 0,
            totalGMV: 0,
            avgWatchTime: 0,
            conversionRate: 0,
            products: selectedProducts,
            status: 'live',
            currentProductIndex: 0
        };

        DataStore.setCurrentSession(sessionData);
        this.renderPage('live');
    },

    renderReports() {
        const sessions = DataStore.getSessions().filter(s => s.status === 'completed');
        const topProducts = DataStore.getTopProducts(10);
        const categories = DataStore.getCategoryPerformance();

        const formatMoney = (num) => {
            if (num >= 10000) {
                return (num / 10000).toFixed(1) + '万';
            }
            return num.toLocaleString();
        };

        const formatNumber = (num) => {
            if (num >= 10000) {
                return (num / 10000).toFixed(1) + '万';
            }
            return num.toLocaleString();
        };

        const maxGMV = sessions.length > 0 ? Math.max(...sessions.map(s => s.totalGMV)) : 1;

        return `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon red">💰</div>
                    </div>
                    <div class="stat-value">¥${formatMoney(sessions.reduce((s, x) => s + x.totalGMV, 0))}</div>
                    <div class="stat-label">总GMV</div>
                </div>
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon green">📦</div>
                    </div>
                    <div class="stat-value">${sessions.reduce((s, x) => s + x.totalOrders, 0).toLocaleString()}</div>
                    <div class="stat-label">总订单数</div>
                </div>
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon blue">👀</div>
                    </div>
                    <div class="stat-value">${formatMoney(sessions.reduce((s, x) => s + x.totalViewers, 0))}</div>
                    <div class="stat-label">总观看人次</div>
                </div>
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon orange">🎬</div>
                    </div>
                    <div class="stat-value">${sessions.length}</div>
                    <div class="stat-label">直播场次</div>
                </div>
            </div>

            <div class="two-column">
                <div class="chart-container">
                    <div class="chart-title">场次GMV趋势</div>
                    ${sessions.length > 0 ? `
                        <div class="bar-chart" style="height:220px;">
                            ${sessions.slice().reverse().map(s => `
                                <div class="bar-item">
                                    <div class="bar" style="height:${(s.totalGMV / maxGMV * 100)}%" title="¥${formatMoney(s.totalGMV)}"></div>
                                    <div class="bar-label">${s.date.slice(5)}</div>
                                </div>
                            `).join('')}
                        </div>
                    ` : '<div class="empty-state"><div class="empty-icon">📊</div><div class="empty-text">暂无数据</div></div>'}
                </div>

                <div class="card">
                    <div class="card-header">
                        <div class="card-title">类目表现对比</div>
                    </div>
                    <div class="card-body">
                        ${categories.length > 0 ? `
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>类目</th>
                                        <th>GMV</th>
                                        <th>销量</th>
                                        <th>场次</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${categories.map(cat => `
                                        <tr>
                                            <td style="font-weight:500;">${cat.categoryName}</td>
                                            <td style="color:var(--primary-color);font-weight:600;">¥${formatMoney(cat.totalGMV)}</td>
                                            <td>${formatNumber(cat.totalSold)}件</td>
                                            <td>${cat.sessionCount}场</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        ` : '<div class="empty-state"><div class="empty-icon">📊</div><div class="empty-text">暂无数据</div></div>'}
                    </div>
                </div>
            </div>

            <div class="card" style="margin-top:20px;">
                <div class="card-header">
                    <div class="card-title">直播场次记录</div>
                </div>
                <div class="card-body">
                    ${sessions.length > 0 ? `
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>场次名称</th>
                                    <th>日期</th>
                                    <th>主播</th>
                                    <th>时长</th>
                                    <th>峰值观看</th>
                                    <th>GMV</th>
                                    <th>订单数</th>
                                    <th>转化率</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${sessions.map(s => `
                                    <tr>
                                        <td style="font-weight:500;">${s.title}</td>
                                        <td>${s.date}</td>
                                        <td>${s.host}</td>
                                        <td>${s.duration}分钟</td>
                                        <td>${formatNumber(s.peakViewers)}</td>
                                        <td style="color:var(--primary-color);font-weight:600;">¥${formatMoney(s.totalGMV)}</td>
                                        <td>${formatNumber(s.totalOrders)}</td>
                                        <td>
                                            <span class="badge badge-success">${(s.conversionRate * 100).toFixed(2)}%</span>
                                        </td>
                                        <td>
                                            <button class="action-btn" onclick="App.showSessionDetail('${s.id}')">查看详情</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : '<div class="empty-state"><div class="empty-icon">📅</div><div class="empty-text">暂无直播记录</div></div>'}
                </div>
            </div>

            <div class="card" style="margin-top:20px;">
                <div class="card-header">
                    <div class="card-title">商品销售排行榜</div>
                </div>
                <div class="card-body">
                    ${topProducts.length > 0 ? `
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>排名</th>
                                    <th>商品</th>
                                    <th>类目</th>
                                    <th>累计GMV</th>
                                    <th>累计销量</th>
                                    <th>上播次数</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${topProducts.map((p, i) => `
                                    <tr>
                                        <td>
                                            <span class="badge ${i < 3 ? 'badge-warning' : 'badge-default'}" style="width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;padding:0;">
                                                ${i + 1}
                                            </span>
                                        </td>
                                        <td>
                                            <div style="display:flex;align-items:center;gap:10px;">
                                                <span style="font-size:24px;">${p.image}</span>
                                                <span style="font-size:13px;">${p.productName}</span>
                                            </div>
                                        </td>
                                        <td>${p.category || '-'}</td>
                                        <td style="color:var(--primary-color);font-weight:600;">¥${formatMoney(p.totalGMV)}</td>
                                        <td>${formatNumber(p.totalSold)}件</td>
                                        <td>${p.sessionCount}次</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : '<div class="empty-state"><div class="empty-icon">🏆</div><div class="empty-text">暂无销售数据</div></div>'}
                </div>
            </div>
        `;
    },

    bindReportEvents() {
    },

    showSessionDetail(sessionId, isNew = false) {
        const session = DataStore.getSessionById(sessionId);
        if (!session) return;

        const formatMoney = (num) => {
            if (num >= 10000) {
                return (num / 10000).toFixed(2) + '万';
            }
            return num.toLocaleString();
        };

        const formatNumber = (num) => {
            if (num >= 10000) {
                return (num / 10000).toFixed(1) + '万';
            }
            return num.toLocaleString();
        };

        const products = session.products || [];
        const maxGMV = products.length > 0 ? Math.max(...products.map(p => p.gmv)) : 1;

        this.showModal(`
            <div class="modal-header">
                <div class="modal-title">${isNew ? '🎉 直播复盘报告' : '直播详情'}</div>
                <button class="modal-close" onclick="App.closeModal()">✕</button>
            </div>
            <div class="modal-body">
                ${isNew ? `
                    <div style="padding:20px;background:linear-gradient(135deg, rgba(255,71,87,0.1), rgba(46,213,115,0.1));border-radius:12px;margin-bottom:20px;text-align:center;">
                        <div style="font-size:32px;font-weight:700;color:var(--primary-color);margin-bottom:8px;">¥${formatMoney(session.totalGMV)}</div>
                        <div style="color:var(--text-secondary);">本场总GMV</div>
                    </div>
                ` : ''}

                <div style="margin-bottom:20px;">
                    <h3 style="font-size:18px;margin-bottom:12px;">${session.title}</h3>
                    <div style="display:flex;gap:20px;color:var(--text-secondary);font-size:13px;flex-wrap:wrap;">
                        <span>📅 ${session.date}</span>
                        <span>🎤 ${session.host}</span>
                        <span>⏱️ ${session.duration}分钟</span>
                    </div>
                </div>

                <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px;">
                    <div class="stat-card" style="padding:16px;">
                        <div class="stat-value" style="font-size:20px;">¥${formatMoney(session.totalGMV)}</div>
                        <div class="stat-label">总GMV</div>
                    </div>
                    <div class="stat-card" style="padding:16px;">
                        <div class="stat-value" style="font-size:20px;">${formatNumber(session.totalOrders)}</div>
                        <div class="stat-label">订单数</div>
                    </div>
                    <div class="stat-card" style="padding:16px;">
                        <div class="stat-value" style="font-size:20px;">${formatNumber(session.totalViewers)}</div>
                        <div class="stat-label">观看人次</div>
                    </div>
                    <div class="stat-card" style="padding:16px;">
                        <div class="stat-value" style="font-size:20px;">${(session.conversionRate * 100).toFixed(2)}%</div>
                        <div class="stat-label">转化率</div>
                    </div>
                </div>

                <div style="margin-bottom:20px;">
                    <div style="font-weight:600;margin-bottom:12px;">商品销售明细</div>
                    ${products.length > 0 ? `
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th style="width:50px;">序号</th>
                                    <th>商品</th>
                                    <th>直播价</th>
                                    <th>销量</th>
                                    <th>GMV</th>
                                    <th>转化率</th>
                                    <th>库存剩余</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${products.map((p, i) => {
                                    const soldOut = p.endStock <= 0;
                                    const lowStock = p.endStock <= p.initialStock * 0.2;
                                    return `
                                        <tr>
                                            <td>${i + 1}</td>
                                            <td>
                                                <div style="display:flex;align-items:center;gap:10px;">
                                                    <span style="font-size:24px;">${p.image}</span>
                                                    <span style="font-size:13px;">${p.productName}</span>
                                                </div>
                                            </td>
                                            <td>¥${p.livePrice}</td>
                                            <td style="font-weight:600;">${p.soldQuantity}件</td>
                                            <td style="color:var(--primary-color);font-weight:600;">¥${formatMoney(p.gmv)}</td>
                                            <td>
                                                <span class="badge badge-success">${(p.conversionRate * 100).toFixed(2)}%</span>
                                            </td>
                                            <td>
                                                ${p.endStock}件
                                                ${soldOut ? '<span class="badge badge-danger" style="margin-left:6px;">售罄</span>' : 
                                                  lowStock ? '<span class="badge badge-warning" style="margin-left:6px;">库存少</span>' : ''}
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    ` : '<div class="empty-state"><div class="empty-icon">🛍️</div><div class="empty-text">暂无商品数据</div></div>'}
                </div>

                <div>
                    <div style="font-weight:600;margin-bottom:12px;">GMV贡献分布</div>
                    ${products.length > 0 ? `
                        <div class="bar-chart" style="height:160px;">
                            ${products.map(p => `
                                <div class="bar-item">
                                    <div class="bar" style="height:${(p.gmv / maxGMV * 100)}%" title="¥${formatMoney(p.gmv)}"></div>
                                    <div class="bar-label">${p.productName.slice(0, 4)}</div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="App.closeModal()">关闭</button>
                <button class="btn btn-primary" onclick="App.closeModal();App.renderPage('assistant');">用选品助手规划下场</button>
            </div>
        `, 'modal-lg');
    },

    renderAssistant() {
        const recommended = DataStore.getRecommendedProducts(8);
        const categories = DataStore.getCategoryPerformance();
        const topCategory = categories.length > 0 ? categories[0] : null;

        const formatMoney = (num) => {
            if (num >= 10000) {
                return (num / 10000).toFixed(1) + '万';
            }
            return num.toLocaleString();
        };

        return `
            <div class="assistant-card">
                <div class="assistant-title">
                    <span style="font-size:28px;">🤖</span>
                    AI 选品助手
                </div>
                <div class="assistant-desc">
                    根据历史直播数据分析，结合当前库存情况，为您智能推荐下场直播最适合的商品组合。
                    ${topCategory ? `<strong style="color:var(--primary-color);">「${topCategory.categoryName}」</strong>类目表现最佳，建议重点布局。` : ''}
                </div>
            </div>

            <div class="page-header" style="margin-top:24px;">
                <h2 style="font-size:18px;font-weight:600;">推荐商品组合</h2>
                <button class="btn btn-primary" onclick="App.createPlanFromRecommendation()">
                    <span>+</span> 一键生成直播计划
                </button>
            </div>

            <div class="product-grid" style="margin-bottom:24px;">
                ${recommended.map((product, index) => `
                    <div class="product-card" style="position:relative;">
                        <div style="position:absolute;top:10px;left:10px;z-index:10;">
                            <span class="recommend-score">${index + 1}</span>
                        </div>
                        <div class="product-image">${product.image}</div>
                        <div class="product-info">
                            <div class="product-name">${product.name}</div>
                            <div class="product-price">
                                ¥${product.livePrice}
                                <span class="original">¥${product.originalPrice}</span>
                            </div>
                            <div class="product-meta">
                                <span>库存: ${product.stock}件</span>
                                <span class="tag tag-primary" style="margin:0;">
                                    ${Math.round((1 - product.livePrice / product.originalPrice) * 100)}%OFF
                                </span>
                            </div>
                            <div class="recommend-reason">${product.reason}</div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="two-column">
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">📊 类目表现分析</div>
                    </div>
                    <div class="card-body">
                        ${categories.length > 0 ? `
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>类目</th>
                                        <th>GMV占比</th>
                                        <th>表现评级</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${categories.map((cat, i) => {
                                        const total = categories.reduce((s, c) => s + c.totalGMV, 0);
                                        const percent = total > 0 ? (cat.totalGMV / total * 100).toFixed(1) : 0;
                                        let rating = '⭐';
                                        if (i === 0) rating = '⭐⭐⭐ 爆款';
                                        else if (i === 1) rating = '⭐⭐ 潜力';
                                        else if (i === 2) rating = '⭐ 一般';
                                        return `
                                            <tr>
                                                <td style="font-weight:500;">${cat.categoryName}</td>
                                                <td>
                                                    <div style="display:flex;align-items:center;gap:8px;">
                                                        <div style="flex:1;height:6px;background:var(--bg-tertiary);border-radius:3px;">
                                                            <div style="width:${percent}%;height:100%;background:var(--primary-color);border-radius:3px;"></div>
                                                        </div>
                                                        <span style="font-size:12px;min-width:45px;">${percent}%</span>
                                                    </div>
                                                </td>
                                                <td><span class="tag ${i === 0 ? 'tag-primary' : 'tag-success'}">${rating}</span></td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        ` : '<div class="empty-state"><div class="empty-icon">📊</div><div class="empty-text">暂无数据</div></div>'}
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div class="card-title">💡 选品建议</div>
                    </div>
                    <div class="card-body">
                        <div style="padding:16px;background:rgba(46,213,115,0.08);border-radius:8px;margin-bottom:12px;">
                            <div style="font-weight:600;color:var(--secondary-color);margin-bottom:6px;">✅ 推荐策略</div>
                            <ul style="color:var(--text-secondary);font-size:13px;padding-left:20px;line-height:1.8;">
                                <li>重点推荐高转化率商品，提升GMV</li>
                                <li>搭配高折扣商品吸引流量</li>
                                <li>确保库存充足，避免断货</li>
                                <li>建议每场上播5-8个商品最佳</li>
                            </ul>
                        </div>
                        <div style="padding:16px;background:rgba(255,165,2,0.08);border-radius:8px;margin-bottom:12px;">
                            <div style="font-weight:600;color:var(--warning-color);margin-bottom:6px;">⚠️ 注意事项</div>
                            <ul style="color:var(--text-secondary);font-size:13px;padding-left:20px;line-height:1.8;">
                                <li>库存紧张的商品建议尽快补货</li>
                                <li>新商品可先小范围测试转化率</li>
                                <li>关注竞品价格动态</li>
                            </ul>
                        </div>
                        <div style="padding:16px;background:rgba(55,66,250,0.08);border-radius:8px;">
                            <div style="font-weight:600;color:var(--info-color);margin-bottom:6px;">📈 优化方向</div>
                            <ul style="color:var(--text-secondary);font-size:13px;padding-left:20px;line-height:1.8;">
                                <li>${topCategory ? `深耕「${topCategory.categoryName}」类目` : '挖掘潜力类目'}</li>
                                <li>提升直播开场商品吸引力</li>
                                <li>优化商品讲解顺序和节奏</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    createPlanFromRecommendation() {
        const recommended = DataStore.getRecommendedProducts(5);
        if (recommended.length === 0) {
            alert('暂无可推荐的商品');
            return;
        }

        const products = recommended.map((p, i) => ({
            productId: p.id,
            order: i + 1,
            script: ''
        }));

        const planData = {
            title: 'AI推荐 - ' + new Date().toLocaleDateString() + ' 直播',
            date: new Date().toISOString().split('T')[0],
            startTime: '19:00',
            duration: 120,
            host: '主播',
            expectedViewers: 10000,
            description: '由AI选品助手智能推荐的商品组合',
            products
        };

        DataStore.addPlan(planData);
        alert('已成功生成直播计划！');
        this.renderPage('plans');
    },

    showModal(content, size = '') {
        const overlay = document.getElementById('modalOverlay');
        const modal = document.getElementById('modalContent');
        modal.className = 'modal ' + size;
        modal.innerHTML = content;
        overlay.classList.add('show');
    },

    closeModal() {
        const overlay = document.getElementById('modalOverlay');
        overlay.classList.remove('show');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});