// 自动刷新脚本 - 开发工具
(function() {
    // 配置
    const refreshInterval = 2000; // 检查间隔，毫秒
    const lastModifiedKey = 'last-code-update';
    
    // 获取上次更新时间
    let lastModified = localStorage.getItem(lastModifiedKey) || Date.now();
    
    // 检查是否需要刷新
    function checkForRefresh() {
        // 创建时间戳请求
        fetch('?t=' + Date.now())
            .then(response => {
                // 获取Last-Modified头
                const headerDate = response.headers.get('last-modified');
                if (headerDate) {
                    const serverDate = new Date(headerDate).getTime();
                    
                    // 如果服务器文件比本地存储的时间新，则刷新
                    if (serverDate > lastModified) {
                        console.log('检测到文件更新，刷新页面...');
                        localStorage.setItem(lastModifiedKey, serverDate);
                        window.location.reload();
                    }
                }
            })
            .catch(err => console.error('刷新检查失败:', err));
    }
    
    // 启动定时检查
    setInterval(checkForRefresh, refreshInterval);
    console.log('自动刷新已启用 - 间隔:', refreshInterval, 'ms');
})(); 