// 游戏场景定义
const gameScenes = [
    {
        id: 1,
        name: "Sunlit Gobi",
        description: "Sunlit Gobi",
        image: "assets/scenes/scene1.png",
        gameId: "stacking", // 对应叠叠乐游戏
        unlockScore: 0, // 初始解锁
        requiresSceneId: 0 // 不需要前置场景
    },
    {
        id: 2,
        name: "Electric Street",
        description: "Electric Street",
        image: "assets/scenes/scene2.png",
        gameId: "electric_street",
        unlockScore: 0, // 移除积分解锁
        requiresSceneId: 1 // 需要场景1完成才能解锁
    },
    {
        id: 3,
        name: "Smart Factory",
        description: "Smart Factory",
        image: "assets/scenes/scene3.png",
        gameId: "game2",
        unlockScore: 0, // 移除积分解锁
        requiresSceneId: 2 // 需要场景2完成才能解锁
    }
];

// 添加调试模式变量
const DEBUG_MODE = true; // 设置为 true 时跳过所有解锁限制

// 渲染场景选择界面
function renderScenes(character) {
    // 更新场景容器
    const sceneContainer = document.querySelector('.scene-container');
    sceneContainer.innerHTML = '';
    
    // 创建/更新右上角积分和按钮
    let topRightControls = document.querySelector('.top-right-controls');
    if (!topRightControls) {
        topRightControls = document.createElement('div');
        topRightControls.className = 'top-right-controls';
        document.getElementById('scene-select').appendChild(topRightControls);
    }
    
    topRightControls.innerHTML = `
        <div class="score-display">SCORES: <span id="player-score">${character.score}</span></div>
        <button id="view-awards">查看奖项</button>
    `;
    
    // 确保右上角控件在正确位置
    topRightControls.style.position = 'absolute';
    topRightControls.style.top = '20px';
    topRightControls.style.right = '20px';
    topRightControls.style.zIndex = '20';
    
    // 创建/更新左下角角色信息 - 只显示图片，移除文字说明
    let playerInfo = document.querySelector('.player-info');
    if (!playerInfo) {
        playerInfo = document.createElement('div');
        playerInfo.className = 'player-info';
        document.getElementById('scene-select').appendChild(playerInfo);
    }
    
    // 根据角色类型选择对应图片
    const characterImage = character.type === 1 ? 
        "assets/characters/character1.png" : 
        "assets/characters/character2.png";

    // 移除角色文字说明，只保留图片
    playerInfo.innerHTML = `<img src="${characterImage}" alt="${character.name}">`;
    
    // 渲染场景卡片
    gameScenes.forEach(scene => {
        // 修改解锁逻辑，在调试模式下忽略所有限制
        const isUnlocked = DEBUG_MODE ? true : character.isSceneUnlocked(scene.id);
        const canUnlock = DEBUG_MODE ? true : (!isUnlocked && 
            (scene.requiresSceneId === 0 || character.isSceneCompleted(scene.requiresSceneId)));
        
        const sceneElement = document.createElement('div');
        sceneElement.className = `scene ${isUnlocked ? 'unlocked' : 'locked'}`;
        sceneElement.dataset.id = scene.id;
        
        // 在调试模式下移除所有锁定状态显示
        sceneElement.innerHTML = `
            <img src="${scene.image}" alt="${scene.name}">
            <div class="scene-content">
                <div>
                    <h3>${scene.name}</h3>
                    <p>${scene.description}</p>
                </div>
                <div class="scene-status">
                    ${(!isUnlocked && !canUnlock && !DEBUG_MODE) ? 
                        `<span class="lock-status">Unlock</span>` : 
                        ''
                    }
                </div>
            </div>
            ${(!isUnlocked && !canUnlock && !DEBUG_MODE) ? '<div class="lock-icon">🔒</div>' : ''}
        `;
        
        sceneContainer.appendChild(sceneElement);
    });
    
    // 添加事件监听
    addSceneEventListeners(character);
    
    // 必须在HTML元素渲染完成后再添加事件监听器
    const viewAwardsBtn = document.getElementById('view-awards');
    if (viewAwardsBtn) {
        // 直接绑定事件，不使用setTimeout
        viewAwardsBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            showAwardsModal(character);
        };
    }
}

// 为场景添加事件监听
function addSceneEventListeners(character) {
    document.querySelectorAll('.scene').forEach(sceneElement => {
        sceneElement.addEventListener('click', () => {
            const sceneId = parseInt(sceneElement.dataset.id);
            const scene = gameScenes.find(s => s.id === sceneId);
            
            // 在调试模式下直接开始游戏，忽略所有解锁检查
            if (DEBUG_MODE || character.isSceneUnlocked(sceneId)) {
                startGame(scene, character);
            } 
            // 如果场景未解锁但可以解锁（前置场景已完成）
            else if (scene.requiresSceneId === 0 || character.isSceneCompleted(scene.requiresSceneId)) {
                character.unlockScene(sceneId);
                saveCharacter(character);
                renderScenes(character);
                startGame(scene, character);
            } 
            // 前置场景未完成
            else {
                const requiredScene = gameScenes.find(s => s.id === scene.requiresSceneId);
                showToast(`需要先完成 "${requiredScene.name}" 才能解锁此场景`);
            }
        });
    });
}

// 开始游戏
function startGame(scene, character) {
    // 切换到游戏界面
    switchScreen('scene-select', 'game-screen');
    
    // 设置游戏标题
    document.getElementById('game-title').textContent = scene.name;
    
    // 根据场景加载对应游戏
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = '';
    
    switch(scene.gameId) {
        case 'stacking':
            initStackingGame(gameContainer, character);
            break;
        case 'electric_street':
            // 改为加载电动街头游戏
            initElectricStreetGame(gameContainer, character);
            break;
        case 'game2':
            // 可以添加第三个游戏的初始化
            initGame2(gameContainer, character);
            break;
        default:
            gameContainer.innerHTML = '<p>游戏正在开发中...</p>';
    }
} 