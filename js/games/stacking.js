// 将这段代码添加到游戏初始化函数之外，确保它是全局可用的
window.showAwardsList = function() {
    // 这里我们需要获取当前的 character 对象
    // 由于 character 是在 initStackingGame 函数内部使用的，我们需要保存一个全局引用
    const gameData = window.gameData || {};
    const character = gameData.currentCharacter;
    
    if (character) {
        showAwardsModal(character);
    } else {
        console.error('无法找到角色数据');
        alert('无法加载奖项数据');
    }
};

// 全局变量存储当前角色数据
window.gameData = window.gameData || {};
window.gameData.currentCharacter = null;

// 叠叠乐游戏初始化
function initStackingGame(container, character) {
    // 保存全局引用
    window.gameData = window.gameData || {};
    window.gameData.currentCharacter = character;
    
    // 不要清空整个body，而是只隐藏其他场景
    document.querySelectorAll('.screen').forEach(screen => {
        if (screen.id !== 'game-screen') {
            screen.classList.add('hidden');
        }
    });
    
    // 显示游戏场景
    const gameScreen = document.getElementById('game-screen');
    if (gameScreen) {
        gameScreen.classList.remove('hidden');
        
        // 保存原始内容，以便后续恢复
        const originalContent = gameScreen.innerHTML;
        gameScreen.setAttribute('data-original-content', originalContent);
        
        // 创建游戏容器
        const gameContainer = document.createElement('div');
        gameContainer.id = 'game-container';
        gameContainer.style.position = 'fixed';
        gameContainer.style.top = '0';
        gameContainer.style.left = '0';
        gameContainer.style.width = '100vw';
        gameContainer.style.height = '100vh';
        gameContainer.style.margin = '0';
        gameContainer.style.padding = '0';
        gameContainer.style.overflow = 'hidden';
        
        // 添加背景图
        gameContainer.style.background = "url('../assets/games/stack-bg.png') no-repeat center center";
        gameContainer.style.backgroundSize = "cover";
        
        // 添加游戏元素
        gameContainer.innerHTML = `
            <div class="stacking-game">
                <div class="tower-container" id="tower-container">
                    <div class="base-block"></div>
                    <div class="moving-block" id="moving-block"></div>
                </div>
                
                <div class="minimal-controls" style="
                position: fixed; 
                bottom: 10vh;           /* 距离底部10%的视口高度 */
                left: 50%; 
                transform: translateX(-50%); 
                z-index: 1000;
                text-align: center;
            ">
                <button id="place-block" style="
                    padding: 12px 30px; 
                    font-size: 18px; 
                    background-color: #2ecc71; 
                    color: white; 
                    border: none; 
                    border-radius: 8px; 
                    cursor: pointer;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                ">放置方块</button>
            </div>
                
                <div class="minimal-stats">
                    <div class="mini-progress-container">
                        <div class="mini-progress-bar" id="progress-bar"></div>
                        <span id="progress-text">0%</span>
                    </div>
                    <span id="current-level">1</span>层 | 
                    <span id="current-score">0</span>分
                </div>
                
                <!-- 积分卡片 -->
                <div class="score-display" style="position:fixed;top:15px;right:15px;background-color:rgba(255,255,255,0.9);border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,0.2);padding:12px;z-index:10000;">
                    <div style="font-size:16px;font-weight:bold;color:#333;margin-bottom:10px;">积分: <span id="game-score">${character.score}</span></div>
                    <button id="view-awards-btn" style="background-color:#3498db;color:white;border:none;padding:8px 15px;border-radius:8px;font-size:14px;cursor:pointer;width:100%;">查看奖项</button>
                </div>
                
                <!-- 返回按钮 -->
                <button id="back-to-scene" class="back-button game-back-button">返回</button>
            </div>
        `;
        
        // 清空游戏场景并添加游戏容器
        gameScreen.innerHTML = '';
        gameScreen.appendChild(gameContainer);
    }
    
    // 游戏变量初始化
    let progress = 0;
    let score = 0;
    let currentLevel = 1;
    let gameOver = false;
    let blockSpeed = 3;
    let blockDirection = 1; // 1为向右，-1为向左
    let animationId = null;
    
    // 获取DOM元素
    const towerContainer = document.getElementById('tower-container');
    const movingBlock = document.getElementById('moving-block');
    const placeBlockBtn = document.getElementById('place-block');
    const currentLevelSpan = document.getElementById('current-level');
    const currentScoreSpan = document.getElementById('current-score');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    // 设置塔容器位置
    towerContainer.style.position = 'absolute';
    towerContainer.style.left = '50%';           
    towerContainer.style.transform = 'translateX(-50%)';  
    towerContainer.style.bottom = '40vh';        
    towerContainer.style.height = '80vh';        
    
    // 初始化移动方块 - 确保在最上层
    movingBlock.style.width = '160px';
    movingBlock.style.height = '20px';
    movingBlock.style.backgroundColor = '#7f8c8d';
    movingBlock.style.position = 'absolute';
    movingBlock.style.bottom = '22px';  // 从底部开始的位置
    movingBlock.style.left = '0px';
    movingBlock.style.zIndex = '10';    // 确保移动方块在最上层
    
    // 修改基础方块的z-index，确保在移动方块下方
    const baseBlock = document.querySelector('.base-block');
    if (baseBlock) {
        baseBlock.style.width = '160px';
        baseBlock.style.position = 'absolute';
        baseBlock.style.bottom = '0px';  // 放在容器底部
    }
    
    // 返回按钮功能
    document.getElementById('back-to-scene').addEventListener('click', () => {
        // 保存角色分数
        if (score > 0) {
            const partialPoints = Math.floor(score * 0.5);
            character.addScore(partialPoints);
            saveCharacter(character);
            alert(`游戏未完成，获得${partialPoints}积分。完成游戏可获得更多积分！`);
        }
        
        // 恢复游戏场景的原始内容
        const gameScreen = document.getElementById('game-screen');
        if (gameScreen) {
            const originalContent = gameScreen.getAttribute('data-original-content');
            if (originalContent) {
                gameScreen.innerHTML = originalContent;
            }
        }
        
        // 使用switchScreen切换回场景选择界面
        if (typeof switchScreen === 'function') {
            switchScreen('game-screen', 'scene-select');
            
            // 重新渲染场景
            if (typeof renderScenes === 'function') {
                renderScenes(character);
            }
        }
    });
    
    // 重新绑定查看奖项按钮事件
    const viewAwardsBtn = document.getElementById('view-awards-btn');
    if (viewAwardsBtn) {
        viewAwardsBtn.addEventListener('click', () => {
            console.log('查看奖项按钮被点击-stacking.js'); // 调试日志
            
            // 修改：使用正确的全局游戏数据中的角色信息
            const character = window.gameData.currentCharacter;
            
            if (!character) {
                console.error('无法获取角色数据');
                return;
            }
            
            // 检查是否已存在奖项下拉菜单
            const existingDropdown = document.querySelector('.awards-dropdown');
            if (existingDropdown) {
                existingDropdown.remove();
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
                    // 获取对应场景名称，使用window.gameScenes
                    console.log('award:', award, window.gameScenes );
                    const scene = gameScenes ? gameScenes.find(s => s.id === award.sceneId) : null;
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
            
            // 将下拉菜单添加到按钮的父元素
            viewAwardsBtn.parentNode.appendChild(dropdown);
            
            // 添加样式
            dropdown.style.position = 'absolute';
            dropdown.style.top = '100%';
            dropdown.style.right = '0';
            dropdown.style.backgroundColor = 'white';
            dropdown.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
            dropdown.style.borderRadius = '5px';
            dropdown.style.zIndex = '10000';
            dropdown.style.width = '250px';
            dropdown.style.marginTop = '5px';
            
            // 添加点击其他区域关闭下拉菜单的功能
            document.addEventListener('click', function closeDropdown(e) {
                if (!dropdown.contains(e.target) && e.target !== viewAwardsBtn) {
                    dropdown.remove();
                    document.removeEventListener('click', closeDropdown);
                }
            });
        });
    } else {
        console.error('未找到查看奖项按钮');
    }
    
    // 开始方块移动动画
    startBlockAnimation();
    
    // 放置方块按钮事件
    placeBlockBtn.addEventListener('click', () => {
        console.log('放置按钮被点击'); // 调试日志
        placeBlock();
    });
    
    // 空格键放置
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !gameOver) {
            placeBlock();
        }
    });
    
    // 方块移动动画
    function startBlockAnimation() {
        const containerWidth = towerContainer.offsetWidth;
        const blockWidth = parseInt(movingBlock.style.width);
        
        function animate() {
            if (gameOver) return;
            
            let currentLeft = parseInt(movingBlock.style.left) || 0;
            
            // 改变方向
            if (currentLeft + blockWidth >= containerWidth) {
                blockDirection = -1;
            } else if (currentLeft <= 0) {
                blockDirection = 1;
            }
            
            // 移动方块
            currentLeft += blockSpeed * blockDirection;
            movingBlock.style.left = `${currentLeft}px`;
            
            animationId = requestAnimationFrame(animate);
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    // 放置方块
    function placeBlock() {
        console.log('执行 placeBlock 函数'); // 调试日志
        if (gameOver) {
            console.log('游戏已结束，无法放置方块');
            return;
        }
        
        // 停止动画
        cancelAnimationFrame(animationId);
        
        // 获取当前方块位置和尺寸
        const currentLeft = parseInt(movingBlock.style.left) || 0;
        const currentBottom = parseInt(movingBlock.style.bottom) || 22;
        const currentWidth = parseInt(movingBlock.style.width) || 140;
        console.log('当前方块位置:', currentLeft, currentBottom, currentWidth);

         // 检查第一个方块是否与基础方块重叠
         if (currentLevel === 1) {
            console.log('检查第一个方块是否与基础方块重叠');
            if (baseBlock) {
                const baseRect = baseBlock.getBoundingClientRect();
                const baseLeft = baseRect.left;
                const baseWidth = baseRect.width;
                console.log('基础方块位置:', baseLeft, baseWidth);
                
                // 计算重叠部分
                const leftOverlap = Math.max(0, baseLeft - currentLeft);
                const rightOverlap = Math.max(0, (currentLeft + currentWidth) - (baseLeft + baseWidth));
                const overlapWidth = currentWidth - leftOverlap - rightOverlap;
                
                // 如果没有重叠，游戏结束
                if (overlapWidth <= 0) {
                    console.log('第一个方块未与基础方块重叠，游戏结束');
                    endGame(false);
                    return;
                }
            }
        }
        
        console.log('当前方块位置:', { // 调试日志
            left: currentLeft,
            bottom: currentBottom,
            width: currentWidth
        });
        
        // 创建固定的方块
        const placedBlock = document.createElement('div');
        placedBlock.className = 'placed-block';
        placedBlock.style.width = `${currentWidth}px`;
        placedBlock.style.height = '22px';
         // 根据层数设置颜色
         if (currentLevel <= 6) {
            // 前6层使用灰色
            placedBlock.style.backgroundColor = '#95a5a6';  // 灰色
        } else {
            // 最后一层使用亮白色
            placedBlock.style.backgroundColor = '#ffffff';  // 亮白色
            placedBlock.style.boxShadow = '0 0 10px rgba(255,255,255,0.8)';  // 添加发光效果
        }
        placedBlock.style.position = 'absolute';
        placedBlock.style.bottom = `${currentBottom}px`;
        placedBlock.style.left = `${currentLeft}px`;
        
        console.log('新方块创建完成，准备添加到容器'); // 调试日志
        
        // 确保towerContainer存在
        if (!towerContainer) {
            console.error('找不到塔容器元素');
            return;
        }
        
        towerContainer.appendChild(placedBlock);
        console.log('新方块已添加到容器'); // 调试日志
        
        // 检查方块是否对齐
        if (currentLevel > 1) {
            const previousBlock = document.querySelector(`.placed-block:nth-last-child(2)`);
            if (!previousBlock) {
                console.error('找不到前一个方块');
                return;
            }
            
            const previousLeft = parseInt(previousBlock.style.left);
            const previousWidth = parseInt(previousBlock.style.width);
            
            // 计算重叠部分
            const leftOverlap = Math.max(0, previousLeft - currentLeft);
            const rightOverlap = Math.max(0, (currentLeft + currentWidth) - (previousLeft + previousWidth));
            const overlapWidth = currentWidth - leftOverlap - rightOverlap;
            
            // 如果没有重叠，游戏结束
            if (overlapWidth <= 0) {
                endGame(false);
                return;
            }
            
            // 调整当前方块大小为重叠部分
            placedBlock.style.width = `${overlapWidth}px`;
            placedBlock.style.left = `${Math.max(currentLeft, previousLeft)}px`;
            
            // 更新移动方块的宽度
            movingBlock.style.width = `${overlapWidth}px`;
            
            // 计算得分 - 重叠度越高分数越高
            const overlapPercentage = overlapWidth / previousWidth;
            const levelScore = Math.round(currentLevel * 10 * overlapPercentage);
            score += levelScore;
            
            // 显示得分动画
            showScoreAnimation(levelScore);
        }
        
        // 更新层数和得分
        currentLevel++;
        currentLevelSpan.textContent = currentLevel;
        currentScoreSpan.textContent = score;
        
        // 更新进度
        updateProgress(12.5);
        
        // 移动到下一层，增加底部距离
        movingBlock.style.bottom = `${currentBottom + 25}px`;  // 每层增加25px高度
        movingBlock.style.left = '0px';
        
        // 增加难度
        blockSpeed += 0.2;
        
        // 检查是否完成游戏 - 8层即可完成
        if (currentLevel > 10) {
            console.log('达到最大层数，游戏完成');
            endGame(true);
            return;
        }
        
        // 如果方块宽度太小，游戏结束
        if (parseInt(movingBlock.style.width) < 15) {
            endGame(false);
            return;
        }
        
        // 继续动画
        startBlockAnimation();
        console.log('方块放置完成，动画重新开始'); // 调试日志
    }
    
    // 生成随机颜色
    function getRandomColor() {
        const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f1c40f', '#9b59b6', '#1abc9c'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // 显示得分动画
    function showScoreAnimation(points) {
        const scoreAnim = document.createElement('div');
        scoreAnim.textContent = `+${points}`;
        scoreAnim.style.position = 'absolute';
        scoreAnim.style.left = '50%';
        scoreAnim.style.top = '50%';
        scoreAnim.style.transform = 'translate(-50%, -50%)';
        scoreAnim.style.color = '#2ecc71';
        scoreAnim.style.fontSize = '24px';
        scoreAnim.style.fontWeight = 'bold';
        scoreAnim.style.zIndex = '100';
        scoreAnim.style.opacity = '1';
        scoreAnim.style.transition = 'all 1s';
        
        towerContainer.appendChild(scoreAnim);
        
        setTimeout(() => {
            scoreAnim.style.opacity = '0';
            scoreAnim.style.transform = 'translate(-50%, -100%)';
        }, 50);
        
        setTimeout(() => {
            towerContainer.removeChild(scoreAnim);
        }, 1000);
    }
    
    // 更新进度条
    function updateProgress(increment) {
        progress += increment;
        progress = Math.min(progress, 100);
        
        // 更新进度条
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        // 更新进度文本
        if (progressText) {
            progressText.textContent = `${Math.round(progress)}%`;
        }
    }
    
    // 结束游戏
    function endGame(success) {
        gameOver = true;
        cancelAnimationFrame(animationId);
        
        // 计算获得的积分
        const basePoints = 50;
        const earnedPoints = success ? (basePoints + score) : Math.floor((basePoints + score) / 2);
        
        // 添加积分
        character.addScore(earnedPoints);
        
        // 添加奖项
        if (success) {
            // 标记当前场景为已完成
            character.completeScene(1);
            
            // 自动解锁下一个场景（如果有）
            const nextScene = window.gameScenes ? window.gameScenes.find(s => s.requiresSceneId === 1) : null;
            if (nextScene && !character.isSceneUnlocked(nextScene.id)) {
                character.unlockScene(nextScene.id);
            }
            
            character.addAward({
                name: "太阳能塔建造大师",
                description: "成功完成太阳能创新中心的叠叠乐挑战",
                points: earnedPoints,
                sceneId: 1
            });
        } else {
            character.addAward({
                name: "初级建筑师",
                description: "参与了太阳能创新中心的叠叠乐挑战",
                points: earnedPoints,
                sceneId: 1
            });
        }
        
        // 保存角色信息
        saveCharacter(character);
        
        // 显示游戏结束界面
        const gameContainer = document.getElementById('game-container');
        gameContainer.innerHTML = `
            <div class="game-complete" style="position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);background:rgba(0,0,0,0.7);color:white;padding:30px;border-radius:15px;text-align:center;min-width:300px;">
                <h2 style="margin-top:0;color:#2ecc71;">${success ? '恭喜！你成功完成了叠叠乐挑战' : '游戏结束！塔楼倒塌了'}</h2>
                <div style="margin:20px 0;font-size:18px;">
                    <p>最终层数: <span style="font-weight:bold;color:#3498db;">${currentLevel - 1}</span></p>
                    <p>游戏得分: <span style="font-weight:bold;color:#f1c40f;">${score}</span></p>
                    <p>获得积分: <span style="font-weight:bold;color:#2ecc71;">+${earnedPoints}</span></p>
                    <p>当前总积分: <span style="font-weight:bold;color:#e74c3c;">${character.score}</span></p>
                </div>
                <div style="margin-top:30px;">
                    <button id="continue-btn" style="background:#2ecc71;color:white;border:none;padding:12px 25px;border-radius:30px;font-size:16px;cursor:pointer;transition:all 0.3s;">返回场景</button>
                </div>
            </div>
        `;
        
        // 修改继续按钮的事件处理
        document.getElementById('continue-btn').addEventListener('click', () => {
            // 保存角色数据
            saveCharacter(character);
            
            // 恢复游戏场景的原始内容
            const gameScreen = document.getElementById('game-screen');
            if (gameScreen) {
                const originalContent = gameScreen.getAttribute('data-original-content');
                if (originalContent) {
                    gameScreen.innerHTML = originalContent;
                }
            }
            
            // 使用switchScreen切换回场景选择界面
            if (typeof switchScreen === 'function') {
                switchScreen('game-screen', 'scene-select');
                
                // 重新渲染场景
                if (typeof renderScenes === 'function') {
                    renderScenes(character);
                }
            }
        });
    }
}

// 确保showAwardsModal函数在全局作用域中可用
window.showAwardsModal = function(character) {
    console.log('显示奖项菜单-stacking.js'); // 调试日志
    
    // 检查是否已存在奖项下拉菜单
    const existingDropdown = document.querySelector('.awards-dropdown');
    if (existingDropdown) {
        existingDropdown.remove();
        return;
    }
    
    // 获取查看奖项按钮
    const awardBtn = document.getElementById('view-awards-btn'); // 这里使用正确的ID
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
            // 获取对应场景名称，使用window.gameScenes
            const scene = window.gameScenes.find(s => s.id === award.sceneId);
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
    
    // 将下拉菜单添加到按钮的父元素
    awardBtn.parentNode.appendChild(dropdown);
    
    // 添加样式
    dropdown.style.position = 'absolute';
    dropdown.style.top = '100%';
    dropdown.style.right = '0';
    dropdown.style.backgroundColor = 'white';
    dropdown.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    dropdown.style.borderRadius = '5px';
    dropdown.style.zIndex = '10000';
    dropdown.style.width = '250px';
    dropdown.style.marginTop = '5px';
    
    // 添加内部元素样式
    const header = dropdown.querySelector('.awards-header');
    if (header) {
        header.style.padding = '10px';
        header.style.borderBottom = '1px solid #eee';
        header.style.textAlign = 'center';
    }
    
    const content = dropdown.querySelector('.awards-content');
    if (content) {
        content.style.padding = '10px';
        content.style.maxHeight = '300px';
        content.style.overflowY = 'auto';
    }
    
    const items = dropdown.querySelectorAll('.award-item');
    items.forEach(item => {
        item.style.padding = '8px';
        item.style.borderBottom = '1px solid #f5f5f5';
        item.style.fontSize = '14px';
    });
    
    const noAwards = dropdown.querySelector('.no-awards');
    if (noAwards) {
        noAwards.style.padding = '20px';
        noAwards.style.textAlign = 'center';
        noAwards.style.color = '#999';
    }
    
    // 点击其他区域关闭下拉菜单
    document.addEventListener('click', function closeDropdown(e) {
        if (!dropdown.contains(e.target) && e.target !== awardBtn) {
            dropdown.remove();
            document.removeEventListener('click', closeDropdown);
        }
    });
};

// 在stacking.js的末尾添加以下代码，创建一个自执行函数来处理返回场景的逻辑
(function() {
    // 创建一个脚本元素，在页面加载后立即执行
    const script = document.createElement('script');
    script.textContent = `
        // 检查是否应该直接跳转到场景选择界面
        if (localStorage.getItem('directToSceneSelect') === 'true') {
            // 清除标记
            localStorage.removeItem('directToSceneSelect');
            
            // 获取当前角色ID
            const characterId = localStorage.getItem('currentCharacterId');
            if (characterId) {
                // 从localStorage加载角色数据
                const characterData = JSON.parse(localStorage.getItem('character'));
                if (characterData) {
                    // 直接切换到场景选择界面
                    setTimeout(() => {
                        // 尝试使用已有的switchScreen函数
                        if (typeof switchScreen === 'function') {
                            switchScreen('start-screen', 'scene-select');
                            
                            // 如果renderScenes函数存在，调用它
                            if (typeof renderScenes === 'function') {
                                renderScenes(characterData);
                            }
                        } else {
                            // 如果switchScreen函数不存在，尝试直接操作DOM
                            document.querySelectorAll('.screen').forEach(screen => {
                                screen.classList.add('hidden');
                            });
                            const sceneSelect = document.getElementById('scene-select');
                            if (sceneSelect) {
                                sceneSelect.classList.remove('hidden');
                            }
                        }
                    }, 500);
                }
            }
        }
    `;
    
    // 将脚本添加到页面
    document.head.appendChild(script);
})(); 