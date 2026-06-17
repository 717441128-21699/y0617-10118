const DataStore = {
    STORAGE_KEYS: {
        PRODUCTS: 'live_products',
        PLANS: 'live_plans',
        SESSIONS: 'live_sessions',
        CURRENT_SESSION: 'current_live_session'
    },

    init() {
        if (!localStorage.getItem(this.STORAGE_KEYS.PRODUCTS)) {
            localStorage.setItem(this.STORAGE_KEYS.PRODUCTS, JSON.stringify(this.getMockProducts()));
        }
        if (!localStorage.getItem(this.STORAGE_KEYS.PLANS)) {
            localStorage.setItem(this.STORAGE_KEYS.PLANS, JSON.stringify(this.getMockPlans()));
        }
        if (!localStorage.getItem(this.STORAGE_KEYS.SESSIONS)) {
            localStorage.setItem(this.STORAGE_KEYS.SESSIONS, JSON.stringify(this.getMockSessions()));
        }
    },

    getMockProducts() {
        return [
            {
                id: 'p001',
                name: '高端无线蓝牙耳机 Pro Max',
                category: '数码电子',
                categoryId: 'cat_digital',
                originalPrice: 599,
                livePrice: 299,
                stock: 500,
                stockWarning: 50,
                image: '🎧',
                description: '主动降噪，40小时续航，HiFi音质',
                salesCount: 1280,
                conversionRate: 0.125,
                totalSales: 358000,
                createTime: '2026-05-01'
            },
            {
                id: 'p002',
                name: '轻奢真皮女款时尚手提包单肩斜挎包',
                category: '服饰箱包',
                categoryId: 'cat_fashion',
                originalPrice: 899,
                livePrice: 459,
                stock: 200,
                stockWarning: 30,
                image: '👜',
                description: '头层牛皮，经典款，多色可选',
                salesCount: 856,
                conversionRate: 0.158,
                totalSales: 492000,
                createTime: '2026-05-05'
            },
            {
                id: 'p003',
                name: '智能运动手表多功能运动监测',
                category: '数码电子',
                categoryId: 'cat_digital',
                originalPrice: 1299,
                livePrice: 699,
                stock: 300,
                stockWarning: 40,
                image: '⌚',
                description: '心率监测、血氧检测、50米防水',
                salesCount: 920,
                conversionRate: 0.102,
                totalSales: 642000,
                createTime: '2026-05-10'
            },
            {
                id: 'p004',
                name: '天然有机护肤套装补水保湿',
                category: '美妆护肤',
                categoryId: 'cat_beauty',
                originalPrice: 398,
                livePrice: 168,
                stock: 1000,
                stockWarning: 100,
                image: '💄',
                description: '植物提取，温和不刺激，敏感肌可用',
                salesCount: 2560,
                conversionRate: 0.185,
                totalSales: 430000,
                createTime: '2026-05-12'
            },
            {
                id: 'p005',
                name: '高端商务休闲男鞋透气运动鞋',
                category: '服饰箱包',
                categoryId: 'cat_fashion',
                originalPrice: 499,
                livePrice: 199,
                stock: 800,
                stockWarning: 80,
                image: '👟',
                description: '飞织透气，轻盈舒适，百搭款式',
                salesCount: 1890,
                conversionRate: 0.142,
                totalSales: 376000,
                createTime: '2026-05-15'
            },
            {
                id: 'p006',
                name: '家用多功能破壁机多功能料理机',
                category: '家用电器',
                categoryId: 'cat_home',
                originalPrice: 799,
                livePrice: 399,
                stock: 150,
                stockWarning: 20,
                image: '🍳',
                description: '八叶刀头，智能变频，静音设计',
                salesCount: 580,
                conversionRate: 0.095,
                totalSales: 231000,
                createTime: '2026-05-18'
            },
            {
                id: 'p007',
                name: '儿童益智早教机器人故事机',
                category: '母婴用品',
                categoryId: 'cat_baby',
                originalPrice: 459,
                livePrice: 259,
                stock: 400,
                stockWarning: 50,
                image: '🤖',
                description: 'AI智能对话，海量早教内容',
                salesCount: 720,
                conversionRate: 0.138,
                totalSales: 186000,
                createTime: '2026-05-20'
            },
            {
                id: 'p008',
                name: '网红零食大礼包整箱装',
                category: '食品生鲜',
                categoryId: 'cat_food',
                originalPrice: 168,
                livePrice: 89,
                stock: 2000,
                stockWarning: 200,
                image: '🍿',
                description: '30包零食，荤素搭配，超值装',
                salesCount: 3200,
                conversionRate: 0.225,
                totalSales: 284000,
                createTime: '2026-05-22'
            },
            {
                id: 'p009',
                name: '男士护肤套装控油祛痘',
                category: '美妆护肤',
                categoryId: 'cat_beauty',
                originalPrice: 358,
                livePrice: 158,
                stock: 600,
                stockWarning: 60,
                image: '🧴',
                description: '专为男士设计，控油保湿',
                salesCount: 1450,
                conversionRate: 0.165,
                totalSales: 229000,
                createTime: '2026-05-25'
            },
            {
                id: 'p010',
                name: '空气炸锅家用多功能无油',
                category: '家用电器',
                categoryId: 'cat_home',
                originalPrice: 599,
                livePrice: 289,
                stock: 250,
                stockWarning: 30,
                image: '🍗',
                description: '5L大容量，智能触控，无油烹饪',
                salesCount: 1120,
                conversionRate: 0.112,
                totalSales: 324000,
                createTime: '2026-05-28'
            }
        ];
    },

    getMockPlans() {
        const today = new Date();
        const formatDate = (d) => {
            return d.toISOString().split('T')[0];
        };
        const addDays = (d, days) => {
            const nd = new Date(d);
            nd.setDate(nd.getDate() + days);
            return formatDate(nd);
        };

        return [
            {
                id: 'plan001',
                title: '618年中大促·数码专场',
                date: addDays(today, 1),
                startTime: '19:00',
                duration: 180,
                host: '小美主播',
                description: '618数码产品大促，耳机、手表超值价',
                products: [
                    { productId: 'p001', order: 1, script: '开场爆品，限时特价，历史最低价' },
                    { productId: 'p003', order: 2, script: '智能手表，功能强大' },
                    { productId: 'p006', order: 3, script: '厨房好物，解放双手' }
                ],
                status: 'upcoming',
                createdAt: formatDate(today),
                expectedViewers: 50000
            },
            {
                id: 'plan002',
                title: '美妆护肤夏日特惠场',
                date: addDays(today, 3),
                startTime: '20:00',
                duration: 150,
                host: '美妆达人Lily',
                description: '夏季护肤攻略，好物推荐',
                products: [
                    { productId: 'p004', order: 1, script: '主打爆款，补水神器' },
                    { productId: 'p009', order: 2, script: '男士也需要护肤' }
                ],
                status: 'upcoming',
                createdAt: formatDate(today),
                expectedViewers: 30000
            },
            {
                id: 'plan003',
                title: '美食零食狂欢夜',
                date: addDays(today, -2),
                startTime: '19:30',
                duration: 120,
                host: '吃货小王',
                description: '网红零食超值装，超值',
                products: [
                    { productId: 'p008', order: 1, script: '零食大礼包，追剧必备' },
                    { productId: 'p004', order: 2, script: '吃完零食护护肤' }
                ],
                status: 'completed',
                createdAt: addDays(today, -5),
                expectedViewers: 25000
            }
        ];
    },

    getMockSessions() {
        const today = new Date();
        const formatDate = (d) => d.toISOString().split('T')[0];
        const addDays = (d, days) => {
            const nd = new Date(d);
            nd.setDate(nd.getDate() + days);
            return formatDate(nd);
        };

        return [
            {
                id: 'session001',
                planId: 'plan003',
                title: '美食零食狂欢夜',
                date: addDays(today, -2),
                startTime: '2026-06-15 19:30:00',
                endTime: '2026-06-15 21:30:00',
                duration: 120,
                host: '吃货小王',
                peakViewers: 12800,
                totalViewers: 45600,
                totalOrders: 1856,
                totalGMV: 285600,
                avgWatchTime: 18.5,
                conversionRate: 0.041,
                products: [
                    {
                        productId: 'p008',
                        productName: '网红零食大礼包整箱装',
                        image: '🍿',
                        order: 1,
                        originalPrice: 168,
                        livePrice: 89,
                        initialStock: 2000,
                        soldQuantity: 1280,
                        endStock: 720,
                        gmv: 113920,
                        viewers: 38000,
                        conversionRate: 0.0337,
                        avgStayTime: 240
                    },
                    {
                        productId: 'p004',
                        productName: '天然有机护肤套装补水保湿',
                        image: '💄',
                        order: 2,
                        originalPrice: 398,
                        livePrice: 168,
                        initialStock: 1000,
                        soldQuantity: 576,
                        endStock: 424,
                        gmv: 96768,
                        viewers: 28000,
                        conversionRate: 0.0206,
                        avgStayTime: 180
                    }
                ],
                status: 'completed'
            },
            {
                id: 'session002',
                planId: null,
                title: '数码好物分享会',
                date: addDays(today, -7),
                startTime: '2026-06-10 19:00:00',
                endTime: '2026-06-10 22:00:00',
                duration: 180,
                host: '科技达人阿杰',
                peakViewers: 18500,
                totalViewers: 62000,
                totalOrders: 2340,
                totalGMV: 528000,
                avgWatchTime: 22.3,
                conversionRate: 0.0377,
                products: [
                    {
                        productId: 'p001',
                        productName: '高端无线蓝牙耳机 Pro Max',
                        image: '🎧',
                        order: 1,
                        originalPrice: 599,
                        livePrice: 299,
                        initialStock: 500,
                        soldQuantity: 420,
                        endStock: 80,
                        gmv: 125580,
                        viewers: 45000,
                        conversionRate: 0.0093,
                        avgStayTime: 320
                    },
                    {
                        productId: 'p003',
                        productName: '智能运动手表多功能运动监测',
                        image: '⌚',
                        order: 2,
                        originalPrice: 1299,
                        livePrice: 699,
                        initialStock: 300,
                        soldQuantity: 280,
                        endStock: 20,
                        gmv: 195720,
                        viewers: 38000,
                        conversionRate: 0.0074,
                        avgStayTime: 280
                    },
                    {
                        productId: 'p010',
                        productName: '空气炸锅家用多功能无油',
                        image: '🍗',
                        order: 3,
                        originalPrice: 599,
                        livePrice: 289,
                        initialStock: 250,
                        soldQuantity: 180,
                        endStock: 70,
                        gmv: 52020,
                        viewers: 25000,
                        conversionRate: 0.0072,
                        avgStayTime: 200
                    }
                ],
                status: 'completed'
            },
            {
                id: 'session003',
                planId: null,
                title: '时尚穿搭分享',
                date: addDays(today, -12),
                startTime: '2026-06-05 20:00:00',
                endTime: '2026-06-05 22:30:00',
                duration: 150,
                host: '时尚博主Luna',
                peakViewers: 15200,
                totalViewers: 48000,
                totalOrders: 2100,
                totalGMV: 612000,
                avgWatchTime: 19.8,
                conversionRate: 0.0438,
                products: [
                    {
                        productId: 'p002',
                        productName: '轻奢真皮女款时尚手提包单肩斜挎包',
                        image: '👜',
                        order: 1,
                        originalPrice: 899,
                        livePrice: 459,
                        initialStock: 200,
                        soldQuantity: 185,
                        endStock: 15,
                        gmv: 84915,
                        viewers: 35000,
                        conversionRate: 0.0053,
                        avgStayTime: 360
                    },
                    {
                        productId: 'p005',
                        productName: '高端商务休闲男鞋透气运动鞋',
                        image: '👟',
                        order: 2,
                        originalPrice: 499,
                        livePrice: 199,
                        initialStock: 800,
                        soldQuantity: 720,
                        endStock: 80,
                        gmv: 143280,
                        viewers: 32000,
                        conversionRate: 0.0225,
                        avgStayTime: 220
                    },
                    {
                        productId: 'p007',
                        productName: '儿童益智早教机器人故事机',
                        image: '🤖',
                        order: 3,
                        originalPrice: 459,
                        livePrice: 259,
                        initialStock: 400,
                        soldQuantity: 320,
                        endStock: 80,
                        gmv: 82880,
                        viewers: 20000,
                        conversionRate: 0.016,
                        avgStayTime: 150
                    }
                ],
                status: 'completed'
            }
        ];
    },

    getProducts() {
        const data = localStorage.getItem(this.STORAGE_KEYS.PRODUCTS);
        return data ? JSON.parse(data) : [];
    },

    getProductById(id) {
        const products = this.getProducts();
        return products.find(p => p.id === id);
    },

    addProduct(product) {
        const products = this.getProducts();
        product.id = 'p' + Date.now();
        product.salesCount = 0;
        product.conversionRate = 0;
        product.totalSales = 0;
        product.createTime = new Date().toISOString().split('T')[0];
        products.unshift(product);
        localStorage.setItem(this.STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
        return product;
    },

    updateProduct(id, updates) {
        const products = this.getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updates };
            localStorage.setItem(this.STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
            return products[index];
        }
        return null;
    },

    deleteProduct(id) {
        const products = this.getProducts();
        const filtered = products.filter(p => p.id !== id);
        localStorage.setItem(this.STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
    },

    getPlans() {
        const data = localStorage.getItem(this.STORAGE_KEYS.PLANS);
        return data ? JSON.parse(data) : [];
    },

    getPlanById(id) {
        const plans = this.getPlans();
        return plans.find(p => p.id === id);
    },

    addPlan(plan) {
        const plans = this.getPlans();
        plan.id = 'plan' + Date.now();
        plan.status = 'upcoming';
        plan.createdAt = new Date().toISOString().split('T')[0];
        plans.unshift(plan);
        localStorage.setItem(this.STORAGE_KEYS.PLANS, JSON.stringify(plans));
        return plan;
    },

    updatePlan(id, updates) {
        const plans = this.getPlans();
        const index = plans.findIndex(p => p.id === id);
        if (index !== -1) {
            plans[index] = { ...plans[index], ...updates };
            localStorage.setItem(this.STORAGE_KEYS.PLANS, JSON.stringify(plans));
            return plans[index];
        }
        return null;
    },

    deletePlan(id) {
        const plans = this.getPlans();
        const filtered = plans.filter(p => p.id !== id);
        localStorage.setItem(this.STORAGE_KEYS.PLANS, JSON.stringify(filtered));
    },

    getSessions() {
        const data = localStorage.getItem(this.STORAGE_KEYS.SESSIONS);
        return data ? JSON.parse(data) : [];
    },

    getSessionById(id) {
        const sessions = this.getSessions();
        return sessions.find(s => s.id === id);
    },

    addSession(session) {
        const sessions = this.getSessions();
        session.id = 'session' + Date.now();
        sessions.unshift(session);
        localStorage.setItem(this.STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
        return session;
    },

    updateSession(id, updates) {
        const sessions = this.getSessions();
        const index = sessions.findIndex(s => s.id === id);
        if (index !== -1) {
            sessions[index] = { ...sessions[index], ...updates };
            localStorage.setItem(this.STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
            return sessions[index];
        }
        return null;
    },

    getCurrentSession() {
        const data = localStorage.getItem(this.STORAGE_KEYS.CURRENT_SESSION);
        return data ? JSON.parse(data) : null;
    },

    setCurrentSession(session) {
        if (session) {
            localStorage.setItem(this.STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));
        } else {
            localStorage.removeItem(this.STORAGE_KEYS.CURRENT_SESSION);
        }
    },

    clearCurrentSession() {
        localStorage.removeItem(this.STORAGE_KEYS.CURRENT_SESSION);
    },

    getCategories() {
        return [
            { id: 'cat_digital', name: '数码电子', icon: '📱' },
            { id: 'cat_fashion', name: '服饰箱包', icon: '👗' },
            { id: 'cat_beauty', name: '美妆护肤', icon: '💄' },
            { id: 'cat_home', name: '家用电器', icon: '🏠' },
            { id: 'cat_food', name: '食品生鲜', icon: '🍎' },
            { id: 'cat_baby', name: '母婴用品', icon: '👶' }
        ];
    },

    getDashboardStats() {
        const sessions = this.getSessions().filter(s => s.status === 'completed');
        const products = this.getProducts();
        
        const totalGMV = sessions.reduce((sum, s) => sum + (s.totalGMV || 0), 0);
        const totalOrders = sessions.reduce((sum, s) => sum + (s.totalOrders || 0), 0);
        const totalViewers = sessions.reduce((sum, s) => sum + (s.totalViewers || 0), 0);
        const totalSessions = sessions.length;

        return {
            totalGMV,
            totalOrders,
            totalViewers,
            totalSessions,
            avgConversionRate: totalViewers > 0 ? (totalOrders / totalViewers) : 0,
            totalProducts: products.length,
            avgGMVPerSession: totalSessions > 0 ? totalGMV / totalSessions : 0
        };
    },

    getTopProducts(limit = 5) {
        const sessions = this.getSessions().filter(s => s.status === 'completed');
        const productMap = {};

        sessions.forEach(session => {
            if (session.products) {
                session.products.forEach(p => {
                    if (!productMap[p.productId]) {
                        productMap[p.productId] = {
                            productId: p.productId,
                            productName: p.productName,
                            image: p.image,
                            category: '',
                            totalSold: 0,
                            totalGMV: 0,
                            sessionCount: 0
                        };
                    }
                    productMap[p.productId].totalSold += p.soldQuantity;
                    productMap[p.productId].totalGMV += p.gmv;
                    productMap[p.productId].sessionCount += 1;
                });
            }
        });

        const products = this.getProducts();
        Object.keys(productMap).forEach(id => {
            const product = products.find(p => p.id === id);
            if (product) {
                productMap[id].category = product.category;
            }
        });

        return Object.values(productMap)
            .sort((a, b) => b.totalGMV - a.totalGMV)
            .slice(0, limit);
    },

    getCategoryPerformance() {
        const sessions = this.getSessions().filter(s => s.status === 'completed');
        const products = this.getProducts();
        const categoryMap = {};

        sessions.forEach(session => {
            if (session.products) {
                session.products.forEach(p => {
                    const product = products.find(prod => prod.id === p.productId);
                    if (product) {
                        if (!categoryMap[product.categoryId]) {
                            categoryMap[product.categoryId] = {
                                categoryId: product.categoryId,
                                categoryName: product.category,
                                totalGMV: 0,
                                totalSold: 0,
                                productCount: 0,
                                sessionCount: 0
                            };
                        }
                        categoryMap[product.categoryId].totalGMV += p.gmv;
                        categoryMap[product.categoryId].totalSold += p.soldQuantity;
                        categoryMap[product.categoryId].sessionCount += 1;
                    }
                });
            }
        });

        return Object.values(categoryMap).sort((a, b) => b.totalGMV - a.totalGMV);
    },

    getRecommendedProducts(limit = 8) {
        const products = this.getProducts();
        const sessions = this.getSessions().filter(s => s.status === 'completed');
        const categories = this.getCategoryPerformance();
        
        const categoryScores = {};
        categories.forEach((cat, i) => {
            categoryScores[cat.categoryId] = categories.length - i;
        });
        
        const totalCategoryGMV = categories.reduce((s, c) => s + c.totalGMV, 0);
        
        const productScores = products.map(product => {
            let score = 0;
            let sessionAppearances = 0;
            let totalConversion = 0;
            let totalProductGMV = 0;

            sessions.forEach(session => {
                const sp = session.products?.find(p => p.productId === product.id);
                if (sp) {
                    sessionAppearances++;
                    totalConversion += sp.conversionRate;
                    totalProductGMV += sp.gmv;
                }
            });

            const avgConversion = sessionAppearances > 0 ? totalConversion / sessionAppearances : product.conversionRate;
            
            score += avgConversion * 1000;
            
            const categoryScore = categoryScores[product.categoryId] || 0;
            score += categoryScore * 2;
            
            const discountRate = product.originalPrice > 0 ? 
                (1 - product.livePrice / product.originalPrice) : 0;
            score += discountRate * 5;
            
            const stockScore = product.stock > product.stockWarning * 3 ? 3 :
                              product.stock > product.stockWarning * 2 ? 2 :
                              product.stock > product.stockWarning ? 1 : 0;
            score += stockScore * 1.5;
            
            if (sessionAppearances > 0) {
                score += Math.log10(totalProductGMV + 1) * 0.5;
            }
            
            const stockLevel = product.stock > product.stockWarning * 3 ? 'high' :
                              product.stock > product.stockWarning * 2 ? 'medium' :
                              product.stock > product.stockWarning ? 'low' : 'critical';
            
            const categoryHeat = totalCategoryGMV > 0 ? 
                (categories.find(c => c.categoryId === product.categoryId)?.totalGMV / totalCategoryGMV * 100 || 0) : 0;

            return {
                ...product,
                score: Math.round(score * 100) / 100,
                stockLevel,
                categoryHeat: Math.round(categoryHeat * 10) / 10,
                avgConversion: Math.round(avgConversion * 10000) / 100,
                sessionAppearances,
                reason: this.generateRecommendReason(product, avgConversion, discountRate, stockLevel, categoryHeat)
            };
        });

        return productScores
            .filter(p => p.stock > p.stockWarning)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    },

    generateRecommendReason(product, conversionRate, discountRate, stockLevel, categoryHeat) {
        const reasons = [];
        
        if (conversionRate > 0.08) {
            reasons.push({ type: 'conversion', text: '历史转化率高', icon: '📈' });
        } else if (conversionRate > 0.03) {
            reasons.push({ type: 'conversion', text: '转化率良好', icon: '📈' });
        }
        
        if (categoryHeat > 20) {
            reasons.push({ type: 'category', text: '所属类目热度高', icon: '🔥' });
        } else if (categoryHeat > 10) {
            reasons.push({ type: 'category', text: '类目表现不错', icon: '🔥' });
        }
        
        if (stockLevel === 'high') {
            reasons.push({ type: 'stock', text: '库存非常充足', icon: '📦' });
        } else if (stockLevel === 'medium') {
            reasons.push({ type: 'stock', text: '库存充足', icon: '📦' });
        }
        
        if (discountRate > 0.4) {
            reasons.push({ type: 'discount', text: '折扣力度大', icon: '💰' });
        } else if (discountRate > 0.2) {
            reasons.push({ type: 'discount', text: '价格有优势', icon: '💰' });
        }
        
        if (product.totalSales > 300000) {
            reasons.push({ type: 'sales', text: '累计销量高', icon: '🏆' });
        }
        
        if (reasons.length === 0) {
            reasons.push({ type: 'potential', text: '潜力商品，推荐测试', icon: '⭐' });
        }
        
        return reasons;
    },

    getRecentSessions(limit = 5) {
        return this.getSessions()
            .filter(s => s.status === 'completed')
            .slice(0, limit);
    }
};
