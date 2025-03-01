// 全局变量
let currentCharacter = null;

// 添加安全的事件监听器函数
function addSafeEventListener(id, event, callback) {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener(event, callback);
    } else {
        console.warn(`元素 ${id} 不存在，无法添加事件监听器`);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('页面加载完成，开始初始化');
    
    // 清除之前保存的角色，确保每次都从头开始
    localStorage.removeItem('gameCharacter');
    currentCharacter = null;
    
    // 确保开始屏幕总是显示
    const startScreen = document.getElementById('start-screen');
    if (startScreen) {
        startScreen.classList.remove('hidden');
    } else {
        console.error('找不到开始屏幕元素！');
        return; // 终止初始化
    }
    
    // 确保其他屏幕隐藏
    document.querySelectorAll('.screen:not(#start-screen)').forEach(screen => {
        screen.classList.add('hidden');
    });
    
    // 开始按钮事件
    addSafeEventListener('start-btn', 'click', () => {
        switchScreen('start-screen', 'character-select');
    });
    
    // 角色选择事件
    const characters = document.querySelectorAll('.character');
    characters.forEach(char => {
        char.addEventListener('click', () => {
            // 清除其他角色的选中状态
            characters.forEach(c => c.classList.remove('selected'));
            
            // 选中当前角色
            char.classList.add('selected');
            
            // 延迟一小段时间展示动画效果，然后自动进入下一个场景
            setTimeout(() => {
                // 创建角色
                const characterId = parseInt(char.dataset.id);
                // 使用默认角色名
                const characterName = characterId === 1 ? "能源专家" : "创新工程师";
                currentCharacter = new Character(characterId, characterName, characterId);
                
                // 保存角色
                saveCharacter(currentCharacter);
                
                // 进入场景选择
                switchScreen('character-select', 'scene-select');
                renderScenes(currentCharacter);
            }, 800); // 延迟800毫秒，让动画效果更明显
        });
    });
    
    // 事件监听器设置
    console.log('设置事件监听器');
    
    // 返回到开始界面
    addSafeEventListener('back-to-start', 'click', () => {
        switchScreen('character-select', 'start-screen');
    });
    
    // 添加返回到角色选择界面的事件监听器
    addSafeEventListener('back-to-character', 'click', () => {
        // 简化的返回逻辑，直接返回角色选择界面
        switchScreen('scene-select', 'character-select');
        
        // 清除当前角色
        localStorage.removeItem('gameCharacter');
        currentCharacter = null;
    });
    
    // 返回场景按钮（从游戏界面）
    addSafeEventListener('back-to-scenes', 'click', () => {
        switchScreen('game-screen', 'scene-select');
    });
    
    // 返回场景按钮（从奖项界面）
    addSafeEventListener('back-from-awards', 'click', () => {
        switchScreen('awards-screen', 'scene-select');
    });
    
    // 再玩一次按钮
    addSafeEventListener('play-again', 'click', () => {
        // 清除保存的角色
        localStorage.removeItem('gameCharacter');
        currentCharacter = null;
        
        // 返回开始界面
        switchScreen('end-screen', 'start-screen');
    });
    
    console.log('初始化完成');
});

// 界面切换函数
function switchScreen(fromId, toId) {
    console.log(`切换界面：从 ${fromId} 到 ${toId}`);
    const fromScreen = document.getElementById(fromId);
    const toScreen = document.getElementById(toId);
    
    if (!fromScreen) {
        console.error(`找不到元素: ${fromId}`);
        return;
    }
    
    if (!toScreen) {
        console.error(`找不到元素: ${toId}`);
        return;
    }
    
    // 添加退出动画
    fromScreen.classList.add('slide-out');
    
    // 等待动画完成后隐藏当前界面并显示目标界面
    setTimeout(() => {
        fromScreen.classList.remove('slide-out');
        fromScreen.classList.add('hidden');
        
        toScreen.classList.remove('hidden');
        toScreen.classList.add('slide-in');
        
        // 移除进入动画
        setTimeout(() => {
            toScreen.classList.remove('slide-in');
        }, 500);
    }, 450);
}

// 显示奖项弹窗
function showAwardsModal(character) {
    if (!character) {
        console.error('显示奖项时角色数据为空');
        return;
    }
    
    // 添加样式
    addModalStyles();
    
    // 创建弹窗结构
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    let modalContent = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">你的奖项</h3>
                <button class="modal-close">&times;</button>
            </div>
    `;
    
    // 添加奖项内容
    if (!character.awards || character.awards.length === 0) {
        modalContent += `<div class="no-awards">你还没有获得任何奖项</div>`;
    } else {
        character.awards.forEach(award => {
            // 获取对应场景名称
            const scene = gameScenes.find(s => s.id === award.sceneId);
            const sceneName = scene ? scene.name : "未知场景";
            
            modalContent += `
                <div class="award-item">
                    <strong>${sceneName}</strong> - ${award.points}积分 - ${award.name}
                </div>
            `;
        });
    }
    
    modalContent += `</div>`;
    modalOverlay.innerHTML = modalContent;
    
    // 添加关闭事件
    document.body.appendChild(modalOverlay);
    modalOverlay.querySelector('.modal-close').addEventListener('click', () => {
        document.body.removeChild(modalOverlay);
    });
    
    // 点击背景也关闭
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            document.body.removeChild(modalOverlay);
        }
    });
}

// 添加弹窗样式
function addModalStyles() {
    // 检查是否已添加样式
    if (!document.getElementById('modal-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'modal-styles';
        styleSheet.innerHTML = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .modal-content {
                background-color: white;
                border-radius: 15px;
                padding: 20px;
                max-width: 80%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid #eee;
            }
            .modal-title {
                font-size: 1.5rem;
                color: #3498db;
                margin: 0;
            }
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #7f8c8d;
            }
            .modal-close:hover {
                color: #e74c3c;
            }
            .award-item {
                padding: 10px;
                margin-bottom: 10px;
                border-bottom: 1px solid #eee;
            }
            .award-item:last-child {
                border-bottom: none;
            }
            .no-awards {
                text-align: center;
                color: #7f8c8d;
                padding: 20px;
            }
        `;
        document.head.appendChild(styleSheet);
    }
}

// 浏览器兼容性检测
function checkBrowserCompatibility() {
    // 检查 localStorage 支持
    if (!window.localStorage) {
        showCompatibilityWarning('您的浏览器不支持本地存储，游戏进度将无法保存。');
    }
    
    // 检查触摸事件支持
    if (!('ontouchstart' in window)) {
        // 仅在移动设备上显示警告
        if (/Mobi|Android/i.test(navigator.userAgent)) {
            showCompatibilityWarning('您的设备可能不完全支持触摸事件，游戏体验可能受到影响。');
        }
    }
}

// 显示兼容性警告
function showCompatibilityWarning(message) {
    const warning = document.createElement('div');
    warning.className = 'compatibility-warning';
    warning.innerHTML = `
        <p>${message}</p>
        <button class="close-warning">我知道了</button>
    `;
    document.body.appendChild(warning);
    
    // 关闭按钮事件
    warning.querySelector('.close-warning').addEventListener('click', () => {
        warning.remove();
    });
}

// 显示游戏结束界面
function showEndScreen(character) {
    document.getElementById('final-name').textContent = character.name;
    document.getElementById('final-score').textContent = character.score;
    
    const awardsList = document.getElementById('final-awards');
    awardsList.innerHTML = '';
    
    character.awards.forEach(award => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${award.name}</strong>: ${award.description} (${award.points}分)`;
        awardsList.appendChild(li);
    });
    
    document.getElementById('scene-select').classList.add('hidden');
    document.getElementById('end-screen').classList.remove('hidden');
}

// 添加全局错误处理
window.addEventListener('error', function(event) {
    console.error('捕获到错误:', event.message);
    
    // 显示用户友好的错误消息
    const errorMessage = document.createElement('div');
    errorMessage.style.position = 'fixed';
    errorMessage.style.top = '10px';
    errorMessage.style.left = '50%';
    errorMessage.style.transform = 'translateX(-50%)';
    errorMessage.style.backgroundColor = '#e74c3c';
    errorMessage.style.color = 'white';
    errorMessage.style.padding = '10px 20px';
    errorMessage.style.borderRadius = '5px';
    errorMessage.style.zIndex = '9999';
    errorMessage.innerHTML = '游戏加载出错了，请刷新页面重试';
    
    document.body.appendChild(errorMessage);
    
    // 5秒后自动关闭
    setTimeout(() => {
        if (errorMessage.parentNode) {
            errorMessage.parentNode.removeChild(errorMessage);
        }
    }, 5000);
}); 