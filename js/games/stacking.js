// 叠叠乐游戏初始化
function initStackingGame(container, character) {
    let progress = 0;
    let score = 0;
    let currentLevel = 1;
    let blocksPlaced = 0;
    let gameOver = false;
    let blockSpeed = 1.5; // 降低初始移动速度
    let blockDirection = 1; // 1为向右，-1为向左
    let animationId = null;
    
    // 创建游戏界面 - 重新布局
    container.innerHTML = `
        <div class="stacking-game">
            <div class="game-area">
                <div class="in-game-stats">
                    <div class="progress-container">
                        <div id="progress-bar" class="progress-bar"></div>
                        <span id="progress-text">0%</span>
                    </div>
                    <p>积分: <span id="game-score">${character.score}</span></p>
                </div>
                <div class="tower-container" id="tower-container">
                    <div class="base-block"></div>
                    <div class="moving-block" id="moving-block"></div>
                </div>
                <div class="level-display">
                    <p>当前层数: <span id="current-level">1</span></p>
                    <p>得分: <span id="current-score">0</span></p>
                </div>
            </div>
            
            <div class="instructions">
                <h3>游戏说明</h3>
                <p>1. 点击"放置方块"按钮停止移动的方块</p>
                <p>2. 尽量精确地将方块放在下面的方块上</p>
                <p>3. 方块超出下方方块太多会掉落</p>
                <p>4. 层数越高，得分越多</p>
                <p>5. 堆叠到8层即可完成挑战</p>
            </div>
            
            <div class="game-controls">
                <button id="place-block">放置方块</button>
            </div>
        </div>
    `;
    
    const towerContainer = document.getElementById('tower-container');
    const movingBlock = document.getElementById('moving-block');
    const placeBlockBtn = document.getElementById('place-block');
    const currentLevelSpan = document.getElementById('current-level');
    const currentScoreSpan = document.getElementById('current-score');
    
    // 设置基础方块样式
    movingBlock.style.width = '120px'; // 增加初始方块宽度
    movingBlock.style.height = '20px';
    movingBlock.style.backgroundColor = '#3498db';
    movingBlock.style.position = 'absolute';
    movingBlock.style.bottom = '30px'; // 基础方块高度+10px
    movingBlock.style.left = '0px';
    
    // 在游戏区域创建触摸区域
    const touchArea = document.createElement('div');
    touchArea.className = 'touch-area';
    touchArea.addEventListener('click', placeBlock);
    towerContainer.appendChild(touchArea);
    
    // 开始方块移动动画
    startBlockAnimation();
    
    // 放置方块按钮事件
    placeBlockBtn.addEventListener('click', placeBlock);
    // 也可以通过空格键放置
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !gameOver) {
            placeBlock();
        }
    });
    
    // 触摸屏幕也可以放置方块
    towerContainer.addEventListener('touchstart', (e) => {
        if (!gameOver) {
            e.preventDefault();
            placeBlock();
        }
    });
    
    // 方块移动动画
    function startBlockAnimation() {
        const containerWidth = towerContainer.offsetWidth;
        const blockWidth = parseInt(movingBlock.style.width);
        
        animationId = requestAnimationFrame(animate);
        
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
    }
    
    // 放置方块
    function placeBlock() {
        if (gameOver) return;
        
        // 停止动画
        cancelAnimationFrame(animationId);
        
        const currentLeft = parseInt(movingBlock.style.left);
        const currentBottom = parseInt(movingBlock.style.bottom);
        const currentWidth = parseInt(movingBlock.style.width);
        
        // 创建固定的方块
        const placedBlock = document.createElement('div');
        placedBlock.className = 'placed-block';
        placedBlock.style.width = `${currentWidth}px`;
        placedBlock.style.height = '20px';
        placedBlock.style.backgroundColor = getRandomColor();
        placedBlock.style.position = 'absolute';
        placedBlock.style.bottom = `${currentBottom}px`;
        placedBlock.style.left = `${currentLeft}px`;
        
        towerContainer.appendChild(placedBlock);
        
        // 检查方块是否对齐
        if (currentLevel > 1) {
            const previousBlock = document.querySelector(`.placed-block:nth-last-child(2)`);
            const previousLeft = parseInt(previousBlock.style.left);
            const previousWidth = parseInt(previousBlock.style.width);
            
            // 计算重叠部分
            const leftOverlap = Math.max(0, previousLeft - currentLeft);
            const rightOverlap = Math.max(0, (currentLeft + currentWidth) - (previousLeft + previousWidth));
            const overlapWidth = currentWidth - leftOverlap - rightOverlap;
            
            // 增加容错率 - 即使没有重叠，也给一个最小宽度
            if (overlapWidth <= 0) {
                // 给予最小宽度而不是直接结束游戏
                const minWidth = Math.min(20, previousWidth * 0.3); // 最小宽度为20px或前一个方块的30%
                placedBlock.style.width = `${minWidth}px`;
                placedBlock.style.left = `${previousLeft + (previousWidth/2) - (minWidth/2)}px`;
                
                // 显示警告动画
                showWarningAnimation();
                
                // 更新移动方块的宽度
                movingBlock.style.width = `${minWidth}px`;
            } else {
                // 调整当前方块大小为重叠部分
                placedBlock.style.width = `${overlapWidth}px`;
                placedBlock.style.left = `${Math.max(currentLeft, previousLeft)}px`;
                
                // 更新移动方块的宽度
                movingBlock.style.width = `${overlapWidth}px`;
            }
            
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
        updateProgress(12.5); // 每层增加12.5%进度 (8层可达100%)
        
        // 移动到下一层
        movingBlock.style.bottom = `${currentBottom + 20}px`; // 每层高度20px
        movingBlock.style.left = '0px';
        
        // 增加难度 - 但增加幅度减小
        blockSpeed += 0.15;
        
        // 检查是否完成游戏 - 降低目标层数
        if (currentLevel > 8) {
            endGame(true);
            return;
        }
        
        // 如果方块宽度太小，游戏结束
        if (parseInt(movingBlock.style.width) < 10) {
            endGame(false);
            return;
        }
        
        // 继续动画
        startBlockAnimation();
    }
    
    // 显示得分动画
    function showScoreAnimation(points) {
        const scoreAnim = document.createElement('div');
        scoreAnim.className = 'score-animation';
        scoreAnim.textContent = `+${points}`;
        scoreAnim.style.position = 'absolute';
        scoreAnim.style.left = '50%';
        scoreAnim.style.top = '50%';
        scoreAnim.style.transform = 'translate(-50%, -50%)';
        scoreAnim.style.color = '#2ecc71';
        scoreAnim.style.fontSize = '24px';
        scoreAnim.style.fontWeight = 'bold';
        scoreAnim.style.zIndex = '100';
        scoreAnim.style.animation = 'scoreFloat 1s forwards';
        
        towerContainer.appendChild(scoreAnim);
        
        setTimeout(() => {
            towerContainer.removeChild(scoreAnim);
        }, 1000);
    }
    
    // 显示警告动画
    function showWarningAnimation() {
        const warningAnim = document.createElement('div');
        warningAnim.className = 'warning-animation';
        warningAnim.textContent = `危险!`;
        warningAnim.style.position = 'absolute';
        warningAnim.style.left = '50%';
        warningAnim.style.top = '50%';
        warningAnim.style.transform = 'translate(-50%, -50%)';
        warningAnim.style.color = '#e74c3c';
        warningAnim.style.fontSize = '28px';
        warningAnim.style.fontWeight = 'bold';
        warningAnim.style.zIndex = '100';
        warningAnim.style.animation = 'warningPulse 1s forwards';
        
        towerContainer.appendChild(warningAnim);
        
        setTimeout(() => {
            towerContainer.removeChild(warningAnim);
        }, 1000);
    }
    
    // 获取随机颜色
    function getRandomColor() {
        const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f1c40f', '#9b59b6', '#1abc9c'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // 更新进度条
    function updateProgress(increment) {
        progress += increment;
        if (progress > 100) progress = 100;
        
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${progress}%`;
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
            character.completeScene(1); // 太阳能创新中心的ID是1
            
            // 自动解锁下一个场景（如果有）
            const nextScene = gameScenes.find(s => s.requiresSceneId === 1);
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
        
        // 显示完成信息
        const gameContainer = document.getElementById('game-container');
        gameContainer.innerHTML = `
            <div class="game-complete">
                <h2>${success ? '恭喜！你成功完成了叠叠乐挑战' : '游戏结束！塔楼倒塌了'}</h2>
                <p>最终层数: ${currentLevel - 1}</p>
                <p>游戏得分: ${score}</p>
                <p>获得积分: ${earnedPoints}</p>
                <p>当前总积分: ${character.score}</p>
                <button id="continue-btn">返回场景</button>
            </div>
        `;
        
        // 继续按钮事件
        document.getElementById('continue-btn').addEventListener('click', () => {
            // 返回场景选择
            switchScreen('game-screen', 'scene-select');
            renderScenes(character);
            
            // 检查是否所有场景都已完成
            const allCompleted = gameScenes.every(scene => character.isSceneUnlocked(scene.id));
            if (allCompleted) {
                setTimeout(() => {
                    switchScreen('scene-select', 'end-screen');
                    showEndScreen(character);
                }, 500);
            }
        });
    }
} 