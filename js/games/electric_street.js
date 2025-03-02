// 将这段代码添加到游戏初始化函数之外，确保它是全局可用的
window.showAwardsList = function() {
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

// 电动街头游戏初始化
function initElectricStreetGame(container, character) {
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
        gameContainer.style.zIndex = '0';
        
        // 修改HTML模板，移除任何onclick属性
        gameContainer.innerHTML = `
            <div class="electric-street-game">
                <!-- 游戏区域 -->
                <div class="game-area" id="game-area" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: url('assets/games/city-bg.jpg') no-repeat center center;
                    background-size: cover;
                    filter: grayscale(70%);
                    transition: filter 1.5s ease;
                    z-index: 0;
                ">
                    <div class="game-content">
                        <!-- 添加两辆车 -->
                        <div class="car-container" id="car1-container" style="
                            position: absolute;
                            left: 20%;
                            bottom: 30%;
                            width: 120px;
                            height: 80px;
                            cursor: pointer;
                            z-index: 2;
                        ">
                            <img src="assets/games/car1.png" id="car1" style="width: 100%; height: auto;">
                        </div>
                        
                        <div class="car-container" id="car2-container" style="
                            position: absolute;
                            right: 30%;
                            bottom: 25%;
                            width: 140px;
                            height: 90px;
                            cursor: pointer;
                            z-index: 1;
                        ">
                            <img src="assets/games/car2.png" id="car2" style="width: 100%; height: auto;">
                        </div>
                    </div>
                </div>

                <!-- 工具箱 -->
                <div class="toolbox" style="
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: rgba(255,255,255,0.9);
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                    padding: 15px;
                    display: flex;
                    gap: 15px;
                    z-index: 100;
                ">
                    <div class="tool" id="tool1" style="
                        width: 60px;
                        height: 60px;
                        background-color: #3498db;
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        transition: all 0.3s;
                    ">
                        <img src="assets/games/battery-icon.png" alt="电池" style="width: 70%; height: auto;" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 24 24%22><path fill=%22white%22 d=%22M16 20H8V6h8m.67-2H15V2H9v2H7.33C6.6 4 6 4.6 6 5.33v15.34C6 21.4 6.6 22 7.33 22h9.34c.73 0 1.33-.6 1.33-1.33V5.33C18 4.6 17.4 4 16.67 4z%22/></svg>'">
                    </div>
                    <div class="tool" id="tool2" style="
                        width: 60px;
                        height: 60px;
                        background-color: #2ecc71;
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        transition: all 0.3s;
                    ">
                        <img src="assets/games/charging-icon.png" alt="充电器" style="width: 70%; height: auto;" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 24 24%22><path fill=%22white%22 d=%22M19 7h-1V6h-2v1h-1c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h1v1h2v-1h1c.55 0 1-.45 1-1V8c0-.55-.45-1-1-1zM7 13v-1.5c0-.83-.67-1.5-1.5-1.5S4 10.67 4 11.5V13c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1zm-1 0h-2v-1.5c0-.28.22-.5.5-.5s.5.22.5.5V13z%22/></svg>'">
                    </div>
                </div>

                <!-- 游戏状态显示 -->
                <div class="game-status" style="
                    position: fixed;
                    top: 70px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: rgba(0,0,0,0.7);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 20px;
                    font-size: 18px;
                    z-index: 100;
                ">
                    <span id="status-text">请选择工具并点击汽车进行改造</span>
                </div>
                
                <!-- 进度显示 -->
                <div class="progress-container" style="
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 300px;
                    height: 20px;
                    background-color: rgba(255,255,255,0.3);
                    border-radius: 10px;
                    overflow: hidden;
                    z-index: 100;
                ">
                    <div id="progress-bar" style="
                        width: 0%;
                        height: 100%;
                        background-color: #2ecc71;
                        transition: width 0.5s ease;
                    "></div>
                </div>
                
                <!-- 积分卡片 -->
                <div class="score-display" style="position:fixed;top:15px;right:15px;background-color:rgba(255,255,255,0.9);border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,0.2);padding:12px;z-index:10000;">
                    <div style="font-size:16px;font-weight:bold;color:#333;margin-bottom:10px;">积分: <span id="game-score">${character.score}</span></div>
                    <button id="view-awards-btn" style="background-color:#3498db;color:white;border:none;padding:8px 15px;border-radius:8px;font-size:14px;cursor:pointer;width:100%;">查看奖项</button>
                </div>
                
                 <!-- 返回按钮 - 修改为使用.back-button类 -->
         <button id="back-to-scene" class="back-button game-back-button">返回</button>
            </div>
        `;
        
        // 清空游戏场景并添加游戏容器
        gameScreen.innerHTML = '';
        gameScreen.appendChild(gameContainer);
        
         // 游戏变量初始化
    let score = 0;
    let gameComplete = false;
        // 游戏逻辑初始化
        initElectricStreetGameLogic(character);
    }
}

// 游戏逻辑
function initElectricStreetGameLogic(character) {
    // 游戏状态
    const gameState = {
        selectedTool: null,
        car1Converted: false,
        car2Converted: false,
        gameCompleted: false,
        progress: 0
    };
    
    // 获取DOM元素
    const car1Container = document.getElementById('car1-container');
    const car2Container = document.getElementById('car2-container');
    const car1 = document.getElementById('car1');
    const car2 = document.getElementById('car2');
    const tool1 = document.getElementById('tool1');
    const tool2 = document.getElementById('tool2');
    const statusText = document.getElementById('status-text');
    const progressBar = document.getElementById('progress-bar');
    const gameArea = document.getElementById('game-area');
    const backButton = document.getElementById('back-to-scene');
    const viewAwardsBtn = document.getElementById('view-awards-btn');
    
    // 工具选择事件
    tool1.addEventListener('click', () => {
        resetToolSelection();
        tool1.style.transform = 'scale(1.1)';
        tool1.style.boxShadow = '0 0 15px rgba(52, 152, 219, 0.7)';
        gameState.selectedTool = 'tool1';
        statusText.textContent = '已选择电池工具，点击汽车进行改造';
    });
    
    tool2.addEventListener('click', () => {
        resetToolSelection();
        tool2.style.transform = 'scale(1.1)';
        tool2.style.boxShadow = '0 0 15px rgba(46, 204, 113, 0.7)';
        gameState.selectedTool = 'tool2';
        statusText.textContent = '已选择充电器工具，点击汽车进行改造';
    });
    
    // 重置工具选择状态
    function resetToolSelection() {
        tool1.style.transform = 'scale(1)';
        tool1.style.boxShadow = 'none';
        tool2.style.transform = 'scale(1)';
        tool2.style.boxShadow = 'none';
    }
    
    // 汽车点击事件
    car1Container.addEventListener('click', () => {
        if (gameState.car1Converted) {
            statusText.textContent = '这辆车已经改造完成了';
            return;
        }
        
        if (!gameState.selectedTool) {
            statusText.textContent = '请先选择一个工具';
            return;
        }
        
        // 转换汽车
        convertCar(car1, 'car1');
    });
    
    car2Container.addEventListener('click', () => {
        if (gameState.car2Converted) {
            statusText.textContent = '这辆车已经改造完成了';
            return;
        }
        
        if (!gameState.selectedTool) {
            statusText.textContent = '请先选择一个工具';
            return;
        }
        
        // 转换汽车
        convertCar(car2, 'car2');
    });
    
    // 转换汽车函数
    function convertCar(carElement, carId) {
        // 显示转换动画
        carElement.style.transition = 'transform 0.5s, filter 0.5s';
        carElement.style.transform = 'scale(1.2)';
        carElement.style.filter = 'brightness(1.5)';
        
        setTimeout(() => {
            // 替换为电动车图片
            try {
                carElement.src = `assets/games/electric_${carId}.png`;
            } catch (e) {
                // 如果图片不存在，使用CSS滤镜模拟电动车效果
                carElement.style.filter = 'hue-rotate(90deg) brightness(1.2)';
            }
            
            carElement.style.transform = 'scale(1)';
            
            // 更新游戏状态
            if (carId === 'car1') {
                gameState.car1Converted = true;
                statusText.textContent = '第一辆车改造成功！';
            } else {
                gameState.car2Converted = true;
                statusText.textContent = '第二辆车改造成功！';
            }
            
            // 更新进度
            updateProgress();
            
            // 重置工具选择
            resetToolSelection();
            gameState.selectedTool = null;
            
            // 检查游戏是否完成
            checkGameCompletion();
        }, 500);
    }
    
    // 更新进度条
    function updateProgress() {
        let completedCount = 0;
        if (gameState.car1Converted) completedCount++;
        if (gameState.car2Converted) completedCount++;
        
        gameState.progress = (completedCount / 2) * 100;
        progressBar.style.width = `${gameState.progress}%`;
    }
    
    // 检查游戏是否完成
    function checkGameCompletion() {
        console.log('gameState finish:', gameState.car1Converted);
        if (gameState.car1Converted && gameState.car2Converted && !gameState.gameCompleted) {
            gameState.gameCompleted = true;
            
            // 移除灰度滤镜，使场景变亮
            gameArea.style.filter = 'grayscale(0%) brightness(1.2)';
            
            // 显示完成消息
            statusText.textContent = '恭喜！你成功将所有汽车改造为电动车！';
            
            // 添加完成动画
            showCompletionAnimation();
            
            // 奖励积分
            const earnedPoints = 50;
            character.addScore(earnedPoints);
            
            // 更新积分显示
            document.getElementById('game-score').textContent = character.score;
            
            // 添加奖项
            character.completeScene(2); // 假设这是场景2
            
            // 自动解锁下一个场景（如果有）
            const nextScene = window.gameScenes ? window.gameScenes.find(s => s.requiresSceneId === 2) : null;
            if (nextScene && !character.isSceneUnlocked(nextScene.id)) {
                character.unlockScene(nextScene.id);
            }
            
            character.addAward({
                name: "电动街区改造师",
                description: "成功将所有汽车改造为电动车",
                points: earnedPoints,
                sceneId: 2
            });
            
            // 保存角色信息
            saveCharacter(character);
        }
    }
    
    // 显示完成动画
    function showCompletionAnimation() {
        // 创建完成动画元素
        const completionAnim = document.createElement('div');
        completionAnim.className = 'completion-animation';
        completionAnim.style.position = 'fixed';
        completionAnim.style.top = '50%';
        completionAnim.style.left = '50%';
        completionAnim.style.transform = 'translate(-50%, -50%)';
        completionAnim.style.background = 'rgba(46, 204, 113, 0.8)';
        completionAnim.style.color = 'white';
        completionAnim.style.padding = '20px 40px';
        completionAnim.style.borderRadius = '10px';
        completionAnim.style.fontSize = '24px';
        completionAnim.style.fontWeight = 'bold';
        completionAnim.style.zIndex = '1000';
        completionAnim.style.opacity = '0';
        completionAnim.style.transition = 'all 0.5s ease';
        completionAnim.textContent = '任务完成！+50积分';
        
        document.body.appendChild(completionAnim);
        
        // 显示动画
        setTimeout(() => {
            completionAnim.style.opacity = '1';
        }, 100);
        
        // 移除动画
        setTimeout(() => {
            completionAnim.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(completionAnim);
            }, 500);
        }, 3000);
    }
    
    // 返回按钮功能
    backButton.addEventListener('click', () => {
        // 如果游戏未完成，给予部分积分
        if (!gameState.gameCompleted && gameState.progress > 0) {
            const partialPoints = Math.floor(25 * (gameState.progress / 100));
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
   // const viewAwardsBtn = document.getElementById('view-awards-btn');
    if (viewAwardsBtn) {
        viewAwardsBtn.addEventListener('click', () => {
            console.log('查看奖项按钮被点击-electric_street.js'); // 调试日志
            
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
                    console.log('scene:', scene);
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
}

// 确保showAwardsModal函数在全局作用域中可用
window.showAwardsModal = function(character) {
    console.log('显示奖项菜单-electric_street.js');
    
    // 检查是否已存在奖项下拉菜单
    const existingDropdown = document.querySelector('.awards-dropdown');
    if (existingDropdown) {
        existingDropdown.remove();
        return;
    }
    
    // 获取查看奖项按钮
    const awardBtn = document.getElementById('view-awards-btn');
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
        console.log('character.awards:', character.awards);
        character.awards.forEach(award => {
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