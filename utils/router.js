// 使用IIFE封装路由系统，避免变量冲突
(function() {
    // 路由配置对象
    const routes = {
        '/': {
            name: 'dashboard',
            title: '驾驶舱',
            path: 'pages/dashboard.html'
        },
        '/dashboard': {
            name: 'dashboard',
            title: '驾驶舱',
            path: 'pages/dashboard.html'
        },
        '/tasks': {
            name: 'tasks',
            title: '任务大厅',
            path: 'pages/tasks.html'
        },
        '/decision': {
            name: 'decision',
            title: '决策中心',
            path: 'pages/dashboard.html'
        },
        '/evaluation/dashboard': {
            name: 'evaluation-dashboard',
            title: '服务评价看板',
            path: 'pages/evaluation-dashboard.html'
        },
        '/evaluation/quarterly': {
            name: 'evaluation-quarterly',
            title: '季度项目服务评价',
            path: 'pages/project-evaluation.html'
        },
        '/evaluation/monthly': {
            name: 'evaluation-monthly',
            title: '月度部门中心评价',
            path: 'pages/department-evaluation.html'
        },
        '/evaluation/leader': {
            name: 'evaluation-leader',
            title: '领导评价',
            path: 'pages/leadership-evaluation.html'
        },
        '/risk': {
            name: 'risk',
            title: '风险预控',
            path: 'pages/risk.html'
        },
        '/risk/disposal': {
            name: 'risk-disposal',
            title: '风险处置',
            path: 'pages/risk-management.html'
        },
        '/risk/issues': {
            name: 'risk-issues',
            title: '项目履约问题清单',
            path: 'pages/performance_issues.html'
        },
        '/performance/dashboard': {
            name: 'performance-dashboard',
            title: '目标绩效看板',
            path: 'pages/performance-dashboard.html'
        },
        '/performance/contract': {
            name: 'performance-contract',
            title: '目标责任书',
            path: 'pages/annual-performance.html'
        },
        '/performance/annual': {
            name: 'performance-annual',
            title: '年度绩效考核',
            path: 'pages/annual-performance.html'
        },
        '/performance/details': {
            name: 'performance-details',
            title: '履职达成明细',
            path: 'pages/value-effectiveness.html'
        },

        '/settings': {
            name: 'settings',
            title: '系统设置',
            path: 'pages/settings.html'
        },
        '/settings/tags': {
            name: 'settings-tags',
            title: '中心价值戴点配置',
            path: 'pages/settings-tags.html'
        },
        '/settings/indicators': {
            name: 'settings-indicators',
            title: '目标指标库设置',
            path: 'pages/settings-tags.html'
        },
        '/settings/projects': {
            name: 'settings-projects',
            title: '服务项目设置',
            path: 'pages/settings-projects.html'
        },
        '/settings/scheduling': {
            name: 'settings-scheduling',
            title: '任务自动调度设置',
            path: 'pages/settings-scheduling.html'
        },
        '/profile': {
            name: 'profile',
            title: '个人中心',
            path: 'pages/profile.html'
        },
        '/notifications': {
            name: 'notifications',
            title: '通知中心',
            path: 'pages/notifications.html'
        },
        '/resolutions': {
            name: 'resolutions',
            title: '议题清单',
            path: 'pages/resolutions.html'
        },
        '/decision-meeting': {
            name: 'decision-meeting',
            title: '决策会议',
            path: 'pages/decision-meeting.html'
        },
        '/monthly-plan': {
            name: 'monthly-plan',
            title: '月度工作计划',
            path: 'pages/monthly-plan.html'
        }
    };

    // 路由类
    class Router {
        constructor() {
            this.currentRoute = null;
            this.contentContainer = null;
        }

        // 初始化路由
        init(containerId) {
            this.contentContainer = document.getElementById(containerId);
            if (!this.contentContainer) {
                console.error('Content container not found');
                return;
            }

            // 监听浏览器历史变化
            window.addEventListener('popstate', () => {
                this.handleRouteChange();
            });

            // 处理初始路由
            this.handleRouteChange();
        }

        // 处理路由变化
        handleRouteChange() {
            const path = window.location.pathname;
            const route = this.getRoute(path);

            if (route) {
                this.loadRoute(route);
            } else {
                // 默认加载首页
                this.loadRoute(routes['/']);
            }
        }

        // 获取路由配置
        getRoute(path) {
            return routes[path] || routes['/'];
        }

        // 加载路由内容
        loadRoute(route) {
            this.currentRoute = route;

            // 更新页面标题
            if (route.title) {
                document.title = `${route.title} - 履约协同平台`;
                // 移除更新h1标题的代码，确保h1标题保持固定
                // const pageTitleElement = document.getElementById('pageTitle');
                // if (pageTitleElement) {
                //     pageTitleElement.textContent = route.title;
                // }
                
                // 更新面包屑导航
                if (window.updateBreadcrumb) {
                    window.updateBreadcrumb(route.title);
                }
            }

            // 加载页面内容
            this.loadPageContent(route.path);

            // 更新导航状态
            this.updateNavigation(route.name);
        }

        // 加载页面内容
        loadPageContent(pagePath) {
            if (!this.contentContainer) {
                console.error('Content container not found');
                return;
            }

            console.log('Loading page:', pagePath);

            // 显示加载状态
            this.contentContainer.innerHTML = '<div class="flex items-center justify-center h-64"><div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div></div>';

            // 使用fetch加载页面内容
            // 确保使用绝对路径，避免基于当前URL解析相对路径
            const absolutePath = pagePath.startsWith('/') ? pagePath : '/' + pagePath;
            fetch(absolutePath)
                .then(response => {
                    console.log('Fetch response status:', response.status);
                    if (!response.ok) {
                        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
                    }
                    return response.text();
                })
                .then(html => {
                    console.log('Page loaded successfully, length:', html.length);
                    // 提取body内容
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const bodyContent = doc.body.innerHTML;

                    // 更新内容容器
                    this.contentContainer.innerHTML = bodyContent;
                    console.log('Content container updated');

                    // 重新初始化Lucide图标
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                        console.log('Lucide icons reinitialized');
                    }

                    // 执行页面脚本
                    this.executePageScripts(doc);
                    console.log('Page scripts executed');
                })
                .catch(error => {
                    console.error('Error loading page:', error);
                    this.contentContainer.innerHTML = `<div class="flex items-center justify-center h-64"><div class="text-red-500">页面加载失败: ${error.message}</div></div>`;
                });
        }

        // 执行页面脚本
        executePageScripts(doc) {
            const scripts = doc.querySelectorAll('script');
            scripts.forEach(script => {
                // 跳过引入router.js的脚本，避免重复声明routes变量
                if (script.src && script.src.includes('router.js')) {
                    return;
                }
                
                const newScript = document.createElement('script');
                if (script.src) {
                    newScript.src = script.src;
                } else {
                    let scriptContent = script.textContent;
                    
                    // 处理包含navigateTo函数的脚本，只移除navigateTo函数的定义，保留其他函数
                    if (scriptContent.includes('function navigateTo')) {
                        // 移除navigateTo函数定义，但保留其他函数
                        // 使用正则表达式匹配并移除navigateTo函数定义
                        scriptContent = scriptContent.replace(/function navigateTo\([^)]*\)\s*{[\s\S]*?}\s*/g, '');
                    }
                    
                    newScript.textContent = scriptContent;
                }
                document.head.appendChild(newScript);
                // 执行后移除脚本，避免重复执行
                setTimeout(() => {
                    document.head.removeChild(newScript);
                }, 0);
            });
        }

        // 更新导航状态
        updateNavigation(routeName) {
            try {
                // 移除所有导航项的活动状态
                const navItems = document.querySelectorAll('.nav-item');
                if (navItems) {
                    navItems.forEach(item => {
                        if (item && item.classList) {
                            item.classList.remove('active');
                        }
                    });
                }

                // 添加当前导航项的活动状态
                const navItem = document.getElementById(`nav-${routeName}`);
                if (navItem && navItem.classList) {
                    navItem.classList.add('active');
                }
            } catch (error) {
                console.error('Error updating navigation:', error);
            }
        }

        // 导航到指定路径
        navigate(path) {
            // 更新浏览器历史
            history.pushState(null, null, path);
            // 处理路由变化
            this.handleRouteChange();
        }
    }

    // 导出路由实例
    const router = new Router();
    window.router = router;

    // 导航函数
    function navigateTo(page) {
        if (page.startsWith('http')) {
            window.open(page, '_blank');
        } else {
            // 构建路径
            let path = page;
            if (!path.startsWith('/')) {
                if (path === 'index.html') {
                    path = '/';
                } else if (path.includes('.html')) {
                    path = '/' + path.replace('.html', '');
                } else {
                    path = '/' + path;
                }
            }
            
            // 检查路由系统是否初始化
            if (window.router) {
                router.navigate(path);
            } else {
                // 路由系统未初始化，使用默认导航
                console.warn('路由系统未初始化，使用默认导航');
                window.location.href = path;
            }
        }
    }

    // 暴露全局导航函数
    window.navigateTo = navigateTo;
})();