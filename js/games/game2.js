// 第二个游戏的初始化函数
function initGame2(container, character) {
    // 暂时只显示一个提示信息，但已添加场景完成逻辑
    container.innerHTML = `
        <div class="game-message">
            <h3>风能实验室游戏</h3>
            <p>这个游戏正在开发中...</p>
            <button id="complete-game2">模拟完成游戏</button>
        </div>
    `;
    
    // 添加一个按钮用于模拟完成游戏
    document.getElementById('complete-game2').addEventListener('click', () => {
        // 标记当前场景为已完成
        character.completeScene(2); // 风能实验室的ID是2
        
        // 自动解锁下一个场景
        const nextScene = gameScenes.find(s => s.requiresSceneId === 2);
        if (nextScene && !character.isSceneUnlocked(nextScene.id)) {
            character.unlockScene(nextScene.id);
        }
        
        // 添加奖项和积分
        character.addScore(100);
        character.addAward({
            name: "风能技术专家",
            description: "完成了风能实验室的挑战",
            points: 100,
            sceneId: 2
        });
        
        // 保存角色信息
        saveCharacter(character);
        
        // 显示完成信息
        container.innerHTML = `
            <div class="game-complete">
                <h2>恭喜！你成功完成了风能实验室的挑战</h2>
                <p>获得积分: 100</p>
                <p>当前总积分: ${character.score}</p>
                <button id="continue-btn">返回场景</button>
            </div>
        `;
        
        // 继续按钮事件
        document.getElementById('continue-btn').addEventListener('click', () => {
            switchScreen('game-screen', 'scene-select');
            renderScenes(character);
        });
    });
}
