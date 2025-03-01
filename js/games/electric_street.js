// 电动街头游戏 - 风能实验室的第一个子场景
function initElectricStreetGame(container, character) {
    // 游戏状态变量
    let score = 0;
    let airQuality = 0;
    let innovationPoints = 0; // 初始创新点数
    let gasCarCount = 9; // 初始燃油车数量
    let evCount = 0; // 电动车数量
    let gameComplete = false;
    
    // 创建游戏UI - 简化版本
    container.innerHTML = `
        <div class="electric-street-game">
            <div class="game-stats-floating">
                <div>创新点: <span id="innovation-points">${innovationPoints}</span></div>
                <div>得分: <span id="game-score">${score}</span></div>
            </div>
            
            <div class="game-area">
                <div class="city-background"></div>
                
                <div class="cars-container" id="cars-container">
                    <!-- 汽车将在这里动态生成 -->
                </div>
                
                <div class="controls">
                    <button id="replace-car" class="action-btn">更换电动车 (获得20创新点)</button>
                </div>
            </div>
        </div>
    `;
    
    // 初始化汽车
    const carsContainer = document.getElementById('cars-container');
    initCars();
    
    // 添加事件监听器
    document.getElementById('replace-car').addEventListener('click', () => {
        if (gasCarCount > 0) {
            replaceCar();
        } else {
            showGameMessage('所有燃油车已替换完成!');
        }
    });
    
    // 初始化汽车 - 只放一辆车
    function initCars() {
        carsContainer.innerHTML = '';
        
        // 只创建一辆燃油车在左下角
        const car = document.createElement('div');
        car.className = 'car gas-car';
        car.style.left = "10%";  // 左下角位置X
        car.style.top = "80%";   // 左下角位置Y - 调整到更低的位置
        car.dataset.index = 0;
        
        car.addEventListener('click', () => {
            if (!gameComplete) {
                replaceSingleCar(car);
            }
        });
        
        carsContainer.appendChild(car);
        
        // 设置汽车计数
        gasCarCount = 1;
        
        updateAirQuality();
    }
    
    // 更换单个汽车
    function replaceSingleCar(carElement) {
        // 动画效果：燃油车淡出
        carElement.classList.add('fade-out');
        
        setTimeout(() => {
            // 创建电动车（低电状态）
            const ev = document.createElement('div');
            ev.className = 'car ev-car low-battery';
            ev.style.left = carElement.style.left;
            ev.style.top = carElement.style.top;
            
            // 移除旧车并添加新车
            carElement.remove();
            carsContainer.appendChild(ev);
            
            // 减少燃油车计数，增加电动车计数
            gasCarCount--;
            evCount++;
            
            // 获得创新点和更新得分
            innovationPoints += 20;
            document.getElementById('innovation-points').textContent = innovationPoints;
            
            // 更新得分
            score += 30;
            document.getElementById('game-score').textContent = score;
            
            // 电动车自动充电动画（2秒后）
            setTimeout(() => {
                ev.classList.remove('low-battery');
                ev.classList.add('charged');
                
                // 更新空气质量（用于背景颜色效果）
                updateAirQuality();
                
                // 检查游戏是否完成
                checkGameStatus();
            }, 2000);
        }, 500);
    }
    
    // 更换随机汽车
    function replaceCar() {
        const gasCars = document.querySelectorAll('.gas-car');
        if (gasCars.length > 0) {
            // 随机选择一辆燃油车
            const randomIndex = Math.floor(Math.random() * gasCars.length);
            replaceSingleCar(gasCars[randomIndex]);
        }
    }
    
    // 更新空气质量
    function updateAirQuality() {
        // 空气质量基于电动车比例
        const totalCars = gasCarCount + evCount;
        const chargedEVs = document.querySelectorAll('.ev-car.charged').length;
        airQuality = Math.round((chargedEVs / totalCars) * 100);
        
        // 如果所有车都是充电的电动车，检查游戏状态
        if (chargedEVs === totalCars && totalCars > 0) {
            checkGameStatus();
        }
        
        // 随着空气质量提高，调整背景亮度
        const gameArea = document.querySelector('.game-area');
        if (gameArea) {
            // 亮度从90%到120%
            const brightness = 90 + (airQuality * 0.3);
            gameArea.style.filter = `brightness(${brightness}%)`;
        }
    }
    
    // 检查游戏状态
    function checkGameStatus() {
        if (airQuality >= 100 && !gameComplete) {
            gameComplete = true;
            completeGame();
        }
    }
    
    // 完成游戏
    function completeGame() {
        // 添加完成动画和效果
        const gameArea = document.querySelector('.game-area');
        gameArea.classList.add('completed');
        
        // 计算最终得分
        const finalScore = score + (innovationPoints * 2);
        
        // 奖励创新点
        const earnedPoints = 100 + Math.round(finalScore / 5);
        character.addScore(earnedPoints);
        
        // 标记场景为已完成
        character.completeScene(2); // 风能实验室的ID是2
        
        // 添加奖项
        character.addAward({
            name: "绿色出行倡导者",
            description: "成功改善了城市空气质量",
            points: earnedPoints,
            sceneId: 2
        });
        
        // 自动解锁下一个场景
        const nextScene = gameScenes.find(s => s.requiresSceneId === 2);
        if (nextScene && !character.isSceneUnlocked(nextScene.id)) {
            character.unlockScene(nextScene.id);
        }
        
        // 保存角色
        saveCharacter(character);
        
        // 显示完成消息
        setTimeout(() => {
            container.innerHTML = `
                <div class="game-complete">
                    <h2>恭喜！你成功改善了城市空气质量</h2>
                    <p>你将所有燃油车替换为了电动车</p>
                    <p>游戏得分: ${finalScore}</p>
                    <p>获得创新点: ${earnedPoints}</p>
                    <p>总积分: ${character.score}</p>
                    <button id="continue-btn">继续</button>
                </div>
            `;
            
            document.getElementById('continue-btn').addEventListener('click', () => {
                switchScreen('game-screen', 'scene-select');
                renderScenes(character);
            });
        }, 1500);
    }
    
    // 显示游戏消息
    function showGameMessage(message) {
        showToast(message);
    }

    // 创建悬浮刷新按钮
    const refreshButton = document.createElement('button');
    refreshButton.innerText = '刷新游戏';
    refreshButton.style.position = 'fixed';
    refreshButton.style.top = '10px';
    refreshButton.style.left = '10px';
    refreshButton.style.zIndex = '1000';
    refreshButton.style.padding = '5px 10px';
    refreshButton.style.background = '#e74c3c';
    refreshButton.style.color = 'white';
    refreshButton.style.border = 'none';
    refreshButton.style.borderRadius = '5px';
    refreshButton.style.cursor = 'pointer';

    refreshButton.addEventListener('click', () => {
        window.location.reload();
    });

    document.body.appendChild(refreshButton);
} 