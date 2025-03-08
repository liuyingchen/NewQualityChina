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

     // 播放游戏背景音乐
     if (typeof audioManager !== 'undefined') {
        // 先加载音频文件（如果尚未加载）
        audioManager.load('electric', 'assets/audio/electric.mp3', 'music');
        audioManager.setVolume('stacking', 1);
        // 播放背景音乐，设置循环播放
        audioManager.play('electric', true);
    }

    
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
            <div class="electric-street-game" style="
                width: 100%;
                height: 100%; /* 或其他适当的高度 */
                position: relative;
                overflow: hidden;
            ">
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
                        <!-- 添加四辆车 -->
                        <div class="car-container" id="car1-container" style="
                            position: absolute;
                            left: 20%;
                            bottom: 10%;
                            width: 340px;
                            height: 200px;
                            cursor: pointer;
                            z-index: 1000;
                        ">
                            <img src="assets/games/car1.png" id="car1" style="width: 100%; height: auto;">
                        </div>
                        
                        <div class="car-container" id="car2-container" style="
                            position: absolute;
                            right: 20%;
                            bottom: 15%;
                            width: 240px;
                            height: 150px;
                            cursor: pointer;
                            z-index: 1000;
                        ">
                            <img src="assets/games/car2.png" id="car2" style="width: 100%; height: auto;">
                        </div>
                        
                        <!-- 新增的两辆车 -->
                        <div class="car-container" id="car4-container" style="
                            position: absolute;
                            left: 5%;
                            bottom: 1%;
                            width: 240px;
                            height: 160px;
                            cursor: pointer;
                            z-index: 1000;
                        ">
                            <img src="assets/games/car4.png" id="car4" style="width: 100%; height: auto;">
                        </div>
                        
                       
                        
                        <div class="car-container" id="car6-container" style="
                            position: absolute;
                            left: 40%;
                            bottom: 20%;
                            width: 250px;
                            height: 100px;
                            cursor: pointer;
                            z-index: 1000;
                        ">
                            <img src="assets/games/car6.png" id="car6" style="width: 100%; height: auto;">
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
                    <span id="status-text">Please choose a tool</span>
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
                 <div class="score-display" style="
                    position: fixed;
                    top: 15px;
                    right: 15px;
                    background-color: rgba(41, 128, 185, 0.1);
                    color: #2c3e50;
                    border: 2px solid #2980b9;
                    padding: 8px 15px;
                    border-radius: 5px;
                    font-weight: bold;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                ">
                    SCORES: <span id="game-score" style="margin-left: 5px; color: #2980b9;">${character.score}</span>
                </div>

                <!-- 左下角角色信息 - 使用CSS类而不是内联样式 -->
            <div class="player-info">
                <img src="assets/characters/character${character.id}.png" alt="${character.name}" class="player-avatar">
            </div>
                
                 <!-- 返回按钮 - 修改为使用.back-button类 -->
         <button id="back-to-scene" class="back-button game-back-button">BACK</button>
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
    // 初始化游戏状态
    const gameState = {
        selectedTool: null,
        convertedCars: 0,
        gameCompleted: false,
        totalCars: 4, // 更新为5辆车
        carStatus: {
            car1: false,
            car2: false,
            car4: false,
        
            car6: false
        }
    };
    
    // 获取DOM元素
    const car1Container = document.getElementById('car1-container');
    const car2Container = document.getElementById('car2-container');
    const car4Container = document.getElementById('car4-container');
    
    const car6Container = document.getElementById('car6-container');
    const car1 = document.getElementById('car1');
    const car2 = document.getElementById('car2');
    const car4 = document.getElementById('car4');
    
    const car6 = document.getElementById('car6');
    const tool1 = document.getElementById('tool1');
    const tool2 = document.getElementById('tool2');
    const statusText = document.getElementById('status-text');
    const progressBar = document.getElementById('progress-bar');
    const gameArea = document.getElementById('game-area');
    const backButton = document.getElementById('back-to-scene');
    const viewAwardsBtn = document.getElementById('view-awards-btn');
    
    // 工具选择事件
    tool1.addEventListener('click', () => {

        if (typeof audioManager !== 'undefined') {
            audioManager.play('click');
        }

        resetToolSelection();
        tool1.style.transform = 'scale(1.1)';
        tool1.style.boxShadow = '0 0 15px rgba(52, 152, 219, 0.7)';
        gameState.selectedTool = 'tool1';
        statusText.textContent = 'You have chosen the new energy tool. Click on the vehicle to transform it into a new energy vehicle.';
    });
    
    tool2.addEventListener('click', () => {

        if (typeof audioManager !== 'undefined') {
            audioManager.play('click');
        }

        resetToolSelection();
        tool2.style.transform = 'scale(1.1)';
        tool2.style.boxShadow = '0 0 15px rgba(46, 204, 113, 0.7)';
        gameState.selectedTool = 'tool2';
        statusText.textContent = 'You have chosen the charging tool. Click on the vehicle to charge it.';
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
        if (gameState.carStatus.car1) {
            statusText.textContent = 'This car has been transformed';
            return;
        }
        
        if (!gameState.selectedTool) {
            statusText.textContent = 'Please choose a tool';
            return;
        }
        
        // 转换汽车
        convertCar(car1, 'car1');
    });
    
    car2Container.addEventListener('click', () => {
        if (gameState.carStatus.car2) {
            statusText.textContent = 'This car has been transformed';
            return;
        }
        
        if (!gameState.selectedTool) {
            statusText.textContent = 'Please choose a tool';
            return;
        }
        
        // 转换汽车
        convertCar(car2, 'car2');
    });
    
    // 新增三辆车的点击事件
    car4Container.addEventListener('click', () => {
        if (gameState.carStatus.car4) {
            statusText.textContent = 'This car has been transformed';
            return;
        }
        
        if (!gameState.selectedTool) {
            statusText.textContent = 'Please choose a tool';
            return;
        }
        
        // 转换汽车
        convertCar(car4, 'car4');
    });
    
  
    
    car6Container.addEventListener('click', () => {
        if (gameState.carStatus.car6) {
            statusText.textContent = 'This car has been transformed';
            return;
        }
        
        if (!gameState.selectedTool) {
            statusText.textContent = 'Please choose a tool';
            return;
        }
        
        // 转换汽车
        convertCar(car6, 'car6');
    });
    
    // 转换汽车函数
    function convertCar(carElement, carId) {


        if (typeof audioManager !== 'undefined') {
            
            // 播放背景音乐，设置循环播放
            audioManager.play('click');
        }
        // 显示转换动画
        carElement.style.transition = 'transform 0.5s, filter 0.5s';
        carElement.style.transform = 'scale(1.2)';
        carElement.style.filter = 'brightness(1.5)';

         // 添加粒子效果容器
         const particleContainer = document.createElement('div');
         particleContainer.className = 'particle-container';
         particleContainer.style.cssText = `
             position: absolute;
             top: 0;
             left: 0;
             width: 100%;
             height: 100%;
             pointer-events: none;
             z-index: 1000;
         `;
         carElement.parentNode.appendChild(particleContainer);
         
         // 创建粒子效果
         for (let i = 0; i < 30; i++) {
             createParticle(particleContainer, carElement);
         }
         
         // 添加光环效果
         const glowEffect = document.createElement('div');
         glowEffect.className = 'glow-effect';
         glowEffect.style.cssText = `
             position: absolute;
             top: 50%;
             left: 50%;
             transform: translate(-50%, -50%);
             width: 0;
             height: 0;
             border-radius: 50%;
             background: radial-gradient(circle, rgba(46, 204, 113, 0.8) 0%, rgba(46, 204, 113, 0) 70%);
             z-index: 999;
             animation: glowPulse 1s ease-out;
         `;
         carElement.parentNode.appendChild(glowEffect);
        
        setTimeout(() => {
            // 替换为电动车图片
            try {
                carElement.src = `assets/games/${carId}-e.png`;
            } catch (e) {
                // 如果图片不存在，使用CSS滤镜模拟电动车效果
                carElement.style.filter = 'hue-rotate(90deg) brightness(1.2)';
            }
            
            carElement.style.transform = 'scale(1)';
            
            // 更新游戏状态
            gameState.carStatus[carId] = true;
            gameState.convertedCars++;
            statusText.textContent = `Successfully transformed a car！(${gameState.convertedCars}/${gameState.totalCars})`;
            
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
        const progressPercentage = (gameState.convertedCars / gameState.totalCars) * 100;
        document.getElementById('progress-bar').style.width = `${progressPercentage}%`;
        
        // 检查游戏是否完成
        if (gameState.convertedCars === gameState.totalCars) {
            document.getElementById('status-text').textContent = 'Congratulations! You have completed the city\'s green upgrade.';
            // 这里可以添加游戏完成的奖励逻辑 Congratulations! You have completed the city's green upgrade.
        }
    }
    
    // 检查游戏是否完成
    function checkGameCompletion() {
        console.log('gameState finish:', gameState.convertedCars);
        if (gameState.convertedCars === gameState.totalCars && !gameState.gameCompleted) {
            gameComplete = true;

            // 停止背景音乐
            if (typeof audioManager !== 'undefined') {
                audioManager.stop('electric');  // 停止背景音乐
            }
            // 移除灰度滤镜，使场景变亮 
            gameArea.style.filter = 'grayscale(0%) brightness(1.2)';
            
            // 显示完成消息
            statusText.textContent = `Congratulations! You have completed the city's green upgrade`;
            
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

        //播放成功音效
        if (typeof audioManager !== 'undefined') {
            audioManager.play('sucess');
        }

        // 获取当前角色
        const character = window.gameData.currentCharacter;
        if (!character) {
            console.error('无法获取角色数据');
            return;
        }
        
        // 创建完成动画元素
        const completionAnim = document.createElement('div');
        completionAnim.style.position = 'fixed';
        completionAnim.style.top = '50%';
        completionAnim.style.left = '50%';
        completionAnim.style.transform = 'translate(-50%, -50%)';
        completionAnim.style.backgroundColor = 'rgba(46, 204, 113, 0.9)';
        completionAnim.style.color = 'white';
        completionAnim.style.padding = '20px 30px';
        completionAnim.style.borderRadius = '10px';
        completionAnim.style.fontSize = '24px';
        completionAnim.style.fontWeight = 'bold';
        completionAnim.style.zIndex = '1000';
        completionAnim.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)';
        //completionAnim.textContent = `Congratulations！Got 50 Points ！`;

        completionAnim.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">Congratulations！Got 50 Points！</div>
        <div style="text-align: center;">
            <button id="completion-back-btn" style="
                background: #87CEEB;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 30px;
                font-size: 16px;
                cursor: pointer;
                transition: background-color 0.3s;
            ">BACK</button>
        </div>
    `;
        
        document.body.appendChild(completionAnim);
        
        const backBtn = document.getElementById('completion-back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                //停止背景音乐
                if (typeof audioManager !== 'undefined') {
                    audioManager.play('click');  // 播放点击音效
                    audioManager.stop('electric');  // 停止背景音乐
                }
                // 移除完成动画
                if (document.body.contains(completionAnim)) {
                    document.body.removeChild(completionAnim);
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
        }
        // 3秒后移除
        // setTimeout(() => {
        //     document.body.removeChild(completionAnim);
        // }, 3000);
    }
    
    // 返回按钮功能
    backButton.addEventListener('click', () => {

        // 停止背景音乐
        if (typeof audioManager !== 'undefined') {
            audioManager.play('click');  // 播放点击音效
            audioManager.stop('electric');  // 停止背景音乐
        }

        // 如果游戏未完成，给予部分积分
        if (!gameState.gameCompleted && gameState.convertedCars > 0) {
            const partialPoints = Math.floor(25 * (gameState.convertedCars / gameState.totalCars));
            character.addScore(partialPoints);
            saveCharacter(character);
            //alert(`游戏未完成，获得${partialPoints}积分。完成游戏可获得更多积分！`);
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
                            <strong>${sceneName}</strong> - ${award.points}Points
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
            dropdown.style.zIndex = '100';
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
                    <strong>${sceneName}</strong> - ${award.points}Points
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

// 创建粒子效果函数
function createParticle(container, sourceElement) {
    const particle = document.createElement('div');
    
    // 获取元素位置
    const rect = sourceElement.getBoundingClientRect();
    const x = rect.width / 2;
    const y = rect.height / 2;
    
    // 随机粒子颜色
    const colors = ['#2ecc71', '#3498db', '#1abc9c', '#f1c40f'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // 设置粒子样式
    particle.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${Math.random() * 10 + 5}px;
        height: ${Math.random() * 10 + 5}px;
        background-color: ${color};
        border-radius: 50%;
        pointer-events: none;
        opacity: ${Math.random() * 0.5 + 0.5};
        z-index: 1000;
    `;
    
    container.appendChild(particle);
    
    // 随机方向和速度
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3 + 2;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    
    // 粒子动画
    let opacity = 1;
    const animate = () => {
        if (opacity <= 0) {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
            return;
        }
        
        const currentX = parseFloat(particle.style.left);
        const currentY = parseFloat(particle.style.top);
        
        particle.style.left = `${currentX + vx}px`;
        particle.style.top = `${currentY + vy}px`;
        
        opacity -= 0.02;
        particle.style.opacity = opacity;
        
        requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
} 