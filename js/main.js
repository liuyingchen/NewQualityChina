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
    
    // 检查并移除现有的奖项返回按钮事件监听器
    const backFromAwardsBtn = document.getElementById('back-from-awards');
    if (backFromAwardsBtn) {
        backFromAwardsBtn.replaceWith(backFromAwardsBtn.cloneNode(true));
    }
    
    // 再玩一次按钮
    addSafeEventListener('play-again', 'click', () => {
        // 清除保存的角色
        localStorage.removeItem('gameCharacter');
        currentCharacter = null;
        
        // 返回开始界面
        switchScreen('end-screen', 'start-screen');
    });
    
    // 检查是否从游戏返回
    const returnFromGame = localStorage.getItem('returnFromGame');
    if (returnFromGame === 'true') {
        // 清除标记
        localStorage.removeItem('returnFromGame');
        
        // 获取角色ID
        const characterId = localStorage.getItem('characterId');
        if (characterId) {
            // 从localStorage加载角色数据
            const characterData = loadCharacter();
            
            // 创建新的Character实例
            if (characterData) {
                const character = new Character(
                    characterData.id, 
                    characterData.name, 
                    characterData.avatarId,
                    characterData.score,
                    characterData.completedScenes,
                    characterData.unlockedScenes,
                    characterData.awards
                );
                
                // 显示场景选择
                setTimeout(() => {
                    switchScreen('start-screen', 'scene-select');
                    renderScenes(character);
                }, 100);
            }
        }
    }
    
    // 检查URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const screenParam = urlParams.get('screen');
    if (screenParam === 'scene-select') {
        // 从localStorage加载角色
        const characterJson = localStorage.getItem('character');
        if (characterJson) {
            const character = JSON.parse(characterJson);
            setTimeout(() => {
                switchScreen('start-screen', 'scene-select');
                renderScenes(character);
            }, 100);
        }
    }
    
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

// 显示奖项下拉菜单
function showAwardsModal(character) {
    console.log('显示奖项菜单'); // 调试日志
    
    // 检查是否已存在奖项下拉菜单
    const existingDropdown = document.querySelector('.awards-dropdown');
    if (existingDropdown) {
        existingDropdown.remove();
        return;
    }
    
    // 获取查看奖项按钮
    const awardBtn = document.getElementById('view-awards');
    if (!awardBtn) {
        console.error('无法找到奖项按钮');
        return;
    }
    
    // 创建下拉菜单
    const dropdown = document.createElement('div');
    dropdown.className = 'awards-dropdown';
    
    // 添加奖项内容
    let dropdownContent = `
        <div class="awards-header">
            <h3>你的奖项</h3>
        </div>
        <div class="awards-content">
    `;
    
    if (!character.awards || character.awards.length === 0) {
        dropdownContent += `<div class="no-awards">你还没有获得任何奖项</div>`;
    } else {
        character.awards.forEach(award => {
            // 获取对应场景名称
            const scene = gameScenes.find(s => s.id === award.sceneId);
            const sceneName = scene ? scene.name : "未知场景";
            
            dropdownContent += `
                <div class="award-item">
                    <strong>${sceneName}</strong> - ${award.points}积分 - ${award.name}
                </div>
            `;
        });
    }
    
    dropdownContent += `</div>`;
    dropdown.innerHTML = dropdownContent;
    
    // 将下拉菜单添加到顶部控制栏
    awardBtn.parentNode.appendChild(dropdown);
    
    // 添加关闭下拉菜单的功能
    document.addEventListener('click', function closeDropdown(e) {
        if (!dropdown.contains(e.target) && e.target !== awardBtn) {
            dropdown.remove();
            document.removeEventListener('click', closeDropdown);
        }
    });
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

// 修复可能的错误引用 - 确保页面中各处都使用弹窗
function handleViewAwards(character) {
    showAwardsModal(character);
}

// 确保该函数暴露给全局，以便其他地方调用
window.handleViewAwards = handleViewAwards;

// 显示Toast消息
function showToast(message, duration = 1500) {
    // 移除可能存在的旧消息
    const existingToast = document.querySelector('.toast-message');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 创建新消息
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 设置定时器自动移除
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, duration);
} 