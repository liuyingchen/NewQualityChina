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

// 智能电网控制中心游戏初始化
function initGame2(container, character) {
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
        
        // 清空游戏场景
        gameScreen.innerHTML = '';
        
        // 创建游戏容器
        const gameContainer = document.createElement('div');
        gameContainer.id = 'puzzle-game-container';
        gameContainer.style.position = 'fixed';
        gameContainer.style.top = '0';
        gameContainer.style.left = '0';
        gameContainer.style.width = '100%';
        gameContainer.style.height = '100%';
        gameContainer.style.backgroundColor = '#f0f0f0';
        gameContainer.style.backgroundImage = 'url("assets/games/wind-bg.jpg")';
        gameContainer.style.backgroundSize = 'cover';
        gameContainer.style.backgroundPosition = 'center';
        gameContainer.style.overflow = 'hidden';
        
        // 添加游戏容器到游戏场景
        gameScreen.appendChild(gameContainer);
        
        // 创建UI元素
        createGameUI(gameContainer, character);
        
        // 创建拼图游戏
        createPuzzleGame(gameContainer, character);
    }
}

// 创建游戏UI
function createGameUI(container, character) {
    // 创建返回按钮
    const backButton = document.createElement('button');
    backButton.id = 'back-to-scene';
    backButton.className = 'back-button'; // 只使用CSS类
    backButton.textContent = 'BACK';
    
    // 调整位置，因为原始CSS可能将按钮放在不适合游戏界面的位置
    backButton.style.top = '20px'; // 覆盖CSS中的top值
    backButton.style.transform = 'none'; // 移除垂直居中
    backButton.style.zIndex = '1000'; // 确保按钮在其他元素之上
    
    // 创建积分显示
    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'score-display';
    scoreDisplay.style.position = 'fixed';
    scoreDisplay.style.top = '15px';
    scoreDisplay.style.right = '15px';
    scoreDisplay.style.backgroundColor = 'rgba(255,255,255,0.9)';
    scoreDisplay.style.borderRadius = '10px';
    scoreDisplay.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    scoreDisplay.style.padding = '12px';
    scoreDisplay.style.zIndex = '1000';
    
    scoreDisplay.innerHTML = `
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
    `;
    
    // 创建状态提示
    const statusTip = document.createElement('div');
    statusTip.id = 'status-tip';
    statusTip.textContent = 'Drag the puzzle pieces to the correct positions';
    statusTip.style.position = 'fixed';
    statusTip.style.top = '80px';
    statusTip.style.left = '50%';
    statusTip.style.transform = 'translateX(-50%)';
    statusTip.style.backgroundColor = 'rgba(0,0,0,0.7)';
    statusTip.style.color = 'white';
    statusTip.style.padding = '10px 20px';
    statusTip.style.borderRadius = '20px';
    statusTip.style.zIndex = '1000';
    

      // 创建左下角角色信息
      const playerInfo = document.createElement('div');
      playerInfo.className = 'player-info';
      
      // 添加角色头像
      const playerAvatar = document.createElement('img');
      playerAvatar.src = `assets/characters/character${character.id}.png`;
      playerAvatar.alt = character.name || (character.id === 1 ? '能源专家' : '创新工程师');
      playerAvatar.className = 'player-avatar';
      
      // 将头像添加到角色信息容器
      playerInfo.appendChild(playerAvatar);

    // 添加UI元素到容器
    container.appendChild(backButton);
    container.appendChild(scoreDisplay);
    container.appendChild(statusTip);
    container.appendChild(playerInfo); // 添加左下角角色信息
    
    // 添加返回按钮事件
    backButton.addEventListener('click', function() {

        
        // 计算已完成的拼图数量
        const placedPieces = document.querySelectorAll('.puzzle-piece.placed').length;
        const totalPieces = 9;
        
        // 如果有部分完成，给予部分积分
        if (placedPieces > 0 && placedPieces < totalPieces) {
            const partialPoints = Math.floor((placedPieces / totalPieces) * 30);

            character.addAward({
                name: "Smart Factory",
                description: "Smart Factory",
                points: partialPoints,
                sceneId: 3 // 假设风能实验室是场景2
            });

            saveCharacter(character);
           // alert(`你获得了 ${partialPoints} 积分！`);
        }
        
        // 恢复游戏场景的原始内容
        const gameScreen = document.getElementById('game-screen');
        if (gameScreen && gameScreen.hasAttribute('data-original-content')) {
            gameScreen.innerHTML = gameScreen.getAttribute('data-original-content');
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
    
    // 添加查看奖项按钮事件
    const viewAwardsBtn = document.getElementById('view-awards-btn');
    if (viewAwardsBtn) {
        viewAwardsBtn.addEventListener('click', () => {
            console.log('查看奖项按钮被点击-game2.js'); // 调试日志
            
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

// 创建拼图游戏
function createPuzzleGame(container, character) {
    // 游戏状态
    const gameState = {
        placedPieces: 0,
        totalPieces: 9,
        completed: false
    };
    
    // 创建拼图板 - 增加边框和背景对比度
    const puzzleBoard = document.createElement('div');
    puzzleBoard.className = 'puzzle-board';
    puzzleBoard.style.position = 'absolute';
    puzzleBoard.style.top = '150px';
    puzzleBoard.style.left = '50%';
    puzzleBoard.style.transform = 'translateX(-50%)';
    puzzleBoard.style.width = '450px';
    puzzleBoard.style.height = '450px';
    puzzleBoard.style.display = 'grid';
    puzzleBoard.style.gridTemplateColumns = 'repeat(3, 1fr)';
    puzzleBoard.style.gridTemplateRows = 'repeat(3, 1fr)';
    puzzleBoard.style.gap = '5px';
    puzzleBoard.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'; // 增加背景不透明度
    puzzleBoard.style.border = '3px solid rgba(255, 255, 255, 0.8)'; // 添加明显的边框
    puzzleBoard.style.borderRadius = '10px';
    puzzleBoard.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.5)'; // 添加发光效果
    puzzleBoard.style.zIndex = '10';
    
    // 创建拼图槽位
    for (let row = 1; row <= 3; row++) {
        for (let col = 1; col <= 3; col++) {
            const slot = document.createElement('div');
            slot.className = 'puzzle-slot';
            slot.dataset.position = `${row}${col}`;
            slot.style.backgroundColor = 'rgba(0, 0, 0, 0.2)'; // 更深的背景色
            slot.style.border = '2px dashed rgba(255, 255, 255, 0.8)'; // 更明显的虚线边框
            slot.style.borderRadius = '5px';
            slot.style.display = 'flex';
            slot.style.justifyContent = 'center';
            slot.style.alignItems = 'center';
            
            // 添加位置提示
            const positionHint = document.createElement('div');
            positionHint.textContent = `${row}${col}`;
            positionHint.style.color = 'rgba(255, 255, 255, 0.7)';
            positionHint.style.fontSize = '20px';
            positionHint.style.fontWeight = 'bold';
            slot.appendChild(positionHint);
            
            puzzleBoard.appendChild(slot);
            
            // 添加拖放事件
            slot.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.style.backgroundColor = 'rgba(46, 204, 113, 0.3)'; // 高亮显示可放置区域
            });
            
            slot.addEventListener('dragleave', function() {
                this.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
            });
            
            slot.addEventListener('drop', function(e) {
                e.preventDefault();
                const pieceId = e.dataTransfer.getData('text/plain');
                const piece = document.getElementById(pieceId);
                
                if (piece && piece.dataset.position === this.dataset.position) {
                    placePiece(piece, this);
                } else {
                    this.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
                }
            });
        }
    }
    
    // 创建完整图片显示
    const completeImage = document.createElement('div');
    completeImage.id = 'complete-image';
    completeImage.style.position = 'absolute';
    completeImage.style.top = '150px';
    completeImage.style.left = '50%';
    completeImage.style.transform = 'translateX(-50%)';
    completeImage.style.width = '450px';
    completeImage.style.height = '450px';
    completeImage.style.backgroundImage = 'url("assets/games/total.png")';
    completeImage.style.backgroundSize = 'contain';
    completeImage.style.backgroundPosition = 'center';
    completeImage.style.backgroundRepeat = 'no-repeat';
    completeImage.style.opacity = '0';
    completeImage.style.transition = 'opacity 1s ease';
    completeImage.style.zIndex = '5';
    
    // 创建拼图碎片容器 - 调整位置和样式
    const piecesContainer = document.createElement('div');
    piecesContainer.className = 'pieces-container';
    piecesContainer.style.position = 'absolute';
    piecesContainer.style.bottom = '20px';
    piecesContainer.style.left = '50%';
    piecesContainer.style.transform = 'translateX(-50%)';
    piecesContainer.style.width = '80%';
    piecesContainer.style.minHeight = '120px';
    piecesContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'; // 更深的背景色
    piecesContainer.style.borderRadius = '10px';
    piecesContainer.style.padding = '10px';
    piecesContainer.style.display = 'flex';
    piecesContainer.style.flexWrap = 'wrap';
    piecesContainer.style.justifyContent = 'center';
    piecesContainer.style.alignItems = 'center';
    piecesContainer.style.gap = '10px';
    piecesContainer.style.zIndex = '20';
    
    // 创建拼图碎片 - 减小尺寸
    const positions = ['11', '12', '13', '21', '22', '23', '31', '32', '33'];
    const shuffledPositions = [...positions].sort(() => Math.random() - 0.5);
    
    shuffledPositions.forEach((position, index) => {
        const piece = document.createElement('div');
        piece.id = `piece-${position}`;
        piece.className = 'puzzle-piece';
        piece.dataset.position = position;
        piece.draggable = true;
        piece.style.width = '60px'; // 减小尺寸
        piece.style.height = '60px'; // 减小尺寸
        piece.style.backgroundImage = `url("assets/games/${position}.png")`;
        piece.style.backgroundSize = 'contain';
        piece.style.backgroundPosition = 'center';
        piece.style.backgroundRepeat = 'no-repeat';
        piece.style.border = '2px solid white';
        piece.style.borderRadius = '5px';
        piece.style.cursor = 'grab';
        piece.style.transition = 'transform 0.2s, box-shadow 0.2s';
        piece.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        
        // 添加拖拽事件
        piece.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.id);
            this.style.opacity = '0.6';
            setTimeout(() => {
                this.style.display = 'none';
            }, 0);
        });
        
        piece.addEventListener('dragend', function() {
            this.style.opacity = '1';
            this.style.display = 'block';
        });
        
        piecesContainer.appendChild(piece);
    });
    
    // 添加所有元素到容器
    container.appendChild(puzzleBoard);
    container.appendChild(completeImage);
    container.appendChild(piecesContainer);
    
    // 放置拼图碎片函数
    function placePiece(piece, slot) {
        // 移除位置提示
        while (slot.firstChild) {
            slot.removeChild(slot.firstChild);
        }
        
        // 创建新的拼图碎片在槽位中
        const placedPiece = document.createElement('div');
        placedPiece.className = 'puzzle-piece placed';
        placedPiece.dataset.position = piece.dataset.position;
        placedPiece.style.width = '100%';
        placedPiece.style.height = '100%';
        placedPiece.style.backgroundImage = piece.style.backgroundImage;
        placedPiece.style.backgroundSize = 'contain';
        placedPiece.style.backgroundPosition = 'center';
        placedPiece.style.backgroundRepeat = 'no-repeat';
        placedPiece.style.border = 'none';
        placedPiece.style.borderRadius = '5px';
        placedPiece.style.transition = 'all 0.3s ease';
        
        // 添加到槽位
        slot.appendChild(placedPiece);
        slot.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        slot.style.border = '2px solid rgba(46, 204, 113, 0.8)';
        
        // 移除原始拼图碎片
        piece.remove();
        
        // 更新游戏状态
        gameState.placedPieces++;
        
        // 更新状态提示
        document.getElementById('status-tip').textContent = 
            `Completed: ${gameState.placedPieces}/${gameState.totalPieces}`;
        
        // 检查是否完成
        if (gameState.placedPieces === gameState.totalPieces && !gameState.completed) {
            gameState.completed = true;
            completeGame();
        }
    }
    
    // 完成游戏函数
    function completeGame() {
        // 显示完整图片
        setTimeout(() => {
            document.getElementById('complete-image').style.opacity = '1';
            document.getElementById('complete-image').style.zIndex = '15';
        }, 500);
        
        // 更新状态提示
        document.getElementById('status-tip').textContent = 'Congratulations! Puzzle completed!';
        document.getElementById('status-tip').style.backgroundColor = 'rgba(46, 204, 113, 0.8)';
        
        // 添加积分和奖项
        setTimeout(() => {
            const earnedPoints = 50;
            character.addScore(earnedPoints);
            
            // 更新积分显示
            const scoreDisplay = document.getElementById('game-score');
            if (scoreDisplay) {
                scoreDisplay.textContent = character.score;
            }
            
            // 添加奖项
            character.addAward({
                name: "Smart Factory",
                description: "Smart Factory",
                points: earnedPoints,
                sceneId: 3 // 假设风能实验室是场景2
            });
            
            // 标记场景完成
            character.completeScene(2);

            saveCharacter(character);
            
            // 安全地尝试解锁下一个场景
            try {
                // 检查 gameScenes 是否存在
                if (window.gameScenes) {
                    const nextScene = window.gameScenes.find(s => s.requiresSceneId === 2);
                    if (nextScene && !character.isSceneUnlocked(nextScene.id)) {
                        character.unlockScene(nextScene.id);
                        
                        // 显示解锁提示
                       // alert(`恭喜！你已解锁新场景：${nextScene.name}`);
                    }
                } else {
                    console.log('gameScenes 未定义，跳过场景解锁');
                }
            } catch (error) {
                console.error('解锁下一个场景时出错:', error);
            }
            
            // 保存角色信息
            if (typeof saveCharacter === 'function') {
                saveCharacter(character);
            } else {
                console.log('saveCharacter 函数未定义，跳过保存');
            }
            
            // 添加成功信息和返回按钮
            const gameContainer = document.getElementById('puzzle-game-container');
            const successElement = document.createElement('div');
            successElement.className = 'game-complete';
            successElement.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);background:rgba(0,0,0,0.7);color:white;padding:30px;border-radius:15px;text-align:center;min-width:300px;z-index:20;';
            
            successElement.innerHTML = `
                <h2 style="margin-top:0;color:#2ecc71;">Congratulations! Puzzle completed!</h2>
                <div style="margin:20px 0;font-size:18px;">
                    <p>Points: <span style="font-weight:bold;color:#f1c40f;">${earnedPoints}</span></p>
                </div>
            `;
            
            gameContainer.appendChild(successElement);


            setTimeout(() => {
                // 移除成功信息元素
                if (gameContainer.contains(successElement)) {
                    gameContainer.removeChild(successElement);
                }
                
                // 跳转到获奖页面
                navigateToAwardsPage();
            }, 1000);
            
            // // 添加返回按钮事件（参考stacking.js的实现）
            // document.getElementById('continue-btn').addEventListener('click', () => {
            //     // 保存角色数据
            //     saveCharacter(character);
                
            //     // 恢复游戏场景的原始内容
            //     const gameScreen = document.getElementById('game-screen');
            //     if (gameScreen) {
            //         const originalContent = gameScreen.getAttribute('data-original-content');
            //         if (originalContent) {
            //             gameScreen.innerHTML = originalContent;
            //         }
            //     }
                
            //     // 使用switchScreen切换回场景选择界面
            //     if (typeof switchScreen === 'function') {
            //         switchScreen('game-screen', 'scene-select');
                    
            //         // 重新渲染场景
            //         if (typeof renderScenes === 'function') {
            //             renderScenes(character);
            //         }
            //     } else {
            //         console.error('switchScreen函数不存在');
            //         // 备用方案：重新加载页面
            //         window.location.reload();
            //     }
            // });
        }, 1000);

        
    }


    function navigateToAwardsPage() {
        console.log('跳转到最终获奖页面');
        
        // 清空当前游戏内容
        const gameScreen = document.getElementById('game-screen');
        if (gameScreen) {
            gameScreen.innerHTML = '';
            
            // 创建获奖页面
            const awardsPage = document.createElement('div');
            awardsPage.id = 'awards-page';
            awardsPage.style.cssText = 'width:100%;height:100%;background:url("assets/games/su-bg.png") center/cover no-repeat;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;';
            
            let awardImage, awardTitle;
            if (character.score < 400) {
                awardImage = "assets/games/bone.png";
                awardTitle = "BRONZE PASS";
            } else if (character.score >= 400 && character.score <= 500) {
                awardImage = "assets/games/silver.png";
                awardTitle = "SILVER PASS";
            } else {
                awardImage = "assets/games/gold.png";
                awardTitle = "GOLD PASS";
            }

            // 获奖页面内容
            awardsPage.innerHTML = `
                <div style="background:rgba(0,0,0,0.1);padding:60px;border-radius:20px;text-align:center;max-width:1000px;animation:fadeIn 1s ease-out;">
                    <h1 style="color:#f1c40f;margin-bottom:10px;font-size:48px;animation:slideDown 0.8s ease-out;text-shadow:0 2px 5px rgba(0,0,0,0.5);">Congratulations!</h1>
                   
                    <div class="award-badge" style="margin:30px auto;width:242px;height:242px;position:relative;animation:scaleIn 1.2s ease-out, rotate 10s infinite linear, shine 3s infinite;">
                        <img src="${awardImage}" alt="${awardTitle}" style="width:130%;height:130%;object-fit:contain;filter:drop-shadow(0 0 10px rgba(255, 215, 0, 0.7));position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);">
                    </div>
                    <div style="color:#f1c40f;font-size:32px;font-weight:bold;margin-top:10px;margin-bottom:30px;animation:fadeIn 1.5s ease-out;text-shadow:0 2px 5px rgba(0,0,0,0.5);">${awardTitle === "铜奖" ? "Bronze" : awardTitle === "银奖" ? "Silver" : "Gold"} PASS</div>
                    
                      <div style="margin:30px 0;padding:15px;background:rgba(255,255,255,0.2);border-radius:10px;animation:fadeIn 2s ease-out;">
                        <p style="font-size:20px;color:#000000;margin-bottom:15px;font-weight:bold;animation:colorPulse 3s infinite;text-shadow:0 1px 1px rgba(255,255,255,0.5);">For more practical cases of China's sustainability efforts, please click here:</p>
                        <a href="https://urdu.cgtn.com/shipin/zhongguo" target="_blank" style="display:inline-block;color:#3498db;font-size:18px;font-weight:bold;text-decoration:none;padding:10px 20px;background:rgba(255,255,255,0.4);border-radius:30px;transition:all 0.3s ease;box-shadow:0 2px 5px rgba(0,0,0,0.2);animation:bounce 2s infinite;">Explore More Cases</a>
                    </div>

                </div>
            `;
            
            // 添加CSS动画
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideDown {
                    from { transform: translateY(-50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                @keyframes slideUp {
                    from { transform: translateY(50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                @keyframes scaleIn {
                    0% { transform: scale(0); opacity: 0; }
                    50% { transform: scale(1.2); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                
                @keyframes colorPulse {
                    0% { color: #000000; }
                    50% { color: #333333; }
                    100% { color: #000000; }
                }
                
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                
                @keyframes rotate {
                    0% { transform: rotate(0deg); }
                    25% { transform: rotate(3deg); }
                    50% { transform: rotate(0deg); }
                    75% { transform: rotate(-3deg); }
                    100% { transform: rotate(0deg); }
                }
                
                @keyframes shine {
                    0% { filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5)); }
                    50% { filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8)); }
                    100% { filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5)); }
                }
                
                .award-badge {
                    transform-origin: center;
                }
                
                .award-badge:hover {
                    animation: pulse 0.5s infinite !important;
                    filter: brightness(1.2);
                    cursor: pointer;
                }
                
                .award-card {
                    transition: all 0.3s ease;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                }
                
                .award-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.3);
                }
                
                #return-to-main {
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                }
                
                #return-to-main:hover {
                    background-color: #5CACEE;
                    transform: scale(1.05);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.3);
                }
            `;
            document.head.appendChild(styleElement);
              
              gameScreen.appendChild(awardsPage);
              
              // 添加分数计数动画
              setTimeout(() => {
                  const scoreCounter = document.querySelector('.score-counter');
                  if (scoreCounter) {
                      const finalScore = character.score;
                      let currentScore = 0;
                      const duration = 2000; // 2秒内完成计数
                      const interval = 20; // 每20毫秒更新一次
                      const increment = Math.max(1, Math.floor(finalScore / (duration / interval)));
                      
                      const counterInterval = setInterval(() => {
                          currentScore += increment;
                          if (currentScore >= finalScore) {
                              currentScore = finalScore;
                              clearInterval(counterInterval);
                          }
                          scoreCounter.textContent = currentScore;
                      }, interval);
                  }
              }, 500);
            
            // 添加返回主页按钮事件
            setTimeout(() => {
                const returnButton = document.getElementById('return-to-main');
                if (returnButton) {
                    returnButton.addEventListener('click', () => {
                        // 使用switchScreen切换回场景选择界面
                        if (typeof switchScreen === 'function') {
                            switchScreen('game-screen', 'scene-select');
                            
                            // 重新渲染场景
                            if (typeof renderScenes === 'function') {
                                renderScenes(character);
                            }
                        } else {
                            // 如果switchScreen不可用，直接刷新页面
                            window.location.reload();
                        }
                    });
                }
            }, 100);
        } else {
            console.error('找不到游戏屏幕元素');
        }
    }


}

// 确保showAwardsModal函数在全局作用域中可用
window.showAwardsModal = function(character) {
    console.log('显示奖项菜单-game2.js');
    
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
        character.awards.forEach(award => {
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