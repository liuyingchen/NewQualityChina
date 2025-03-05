class Character {
    constructor(id, name, type) {
        this.id = id;
        this.name = name;
        this.type = type; // 角色类型: 1=能源专家, 2=创新工程师
        this.score = this.type === 1 ? 50 : 100; // 调整初始积分：能源专家50，创新工程师0
        this.awards = []; // 奖项数组
        this.unlockedScenes = [1]; // 初始解锁第一个场景
        this.completedScenes = []; // 新增：已完成的场景
    }

    // 添加积分
    addScore(points) {
        this.score += points;
        return this.score;
    }

    // 添加奖项
    addAward(award) {
        // 确保奖项有 sceneId
        if (!award.sceneId) {
            console.warn('奖项缺少场景ID');
            award.sceneId = 0; // 默认值
        }
        
        // 查找是否已有相同场景的奖项
        const existingIndex = this.awards.findIndex(a => a.sceneId === award.sceneId);
        
        if (existingIndex !== -1) {
            // 替换已有的奖项
            this.awards[existingIndex] = {
                name: award.name,
                description: award.description,
                points: award.points,
                sceneId: award.sceneId,
                date: new Date().toLocaleString()
            };
        } else {
            // 添加新奖项
            this.awards.push({
                name: award.name,
                description: award.description,
                points: award.points,
                sceneId: award.sceneId,
                date: new Date().toLocaleString()
            });
        }
    }

    // 解锁新场景
    unlockScene(sceneId) {
        if (!this.unlockedScenes.includes(sceneId)) {
            this.unlockedScenes.push(sceneId);
            return true;
        }
        return false;
    }

    // 检查场景是否解锁
    isSceneUnlocked(sceneId) {
        return this.unlockedScenes.includes(sceneId);
    }

    // 新增：标记场景为已完成
    completeScene(sceneId) {
        if (!this.completedScenes.includes(sceneId)) {
            this.completedScenes.push(sceneId);
            return true;
        }
        return false;
    }
    
    // 新增：检查场景是否已完成
    isSceneCompleted(sceneId) {
        return this.completedScenes.includes(sceneId);
    }

    // 获取角色信息
    getInfo() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            score: this.score,
            awards: this.awards,
            unlockedScenes: this.unlockedScenes,
            completedScenes: this.completedScenes
        };
    }
}

// 保存角色到本地存储
function saveCharacter(character) {
    localStorage.setItem('gameCharacter', JSON.stringify(character));
}

// 从本地存储加载角色
function loadCharacter() {
    const savedCharacter = localStorage.getItem('gameCharacter');
    if (savedCharacter) {
        const charData = JSON.parse(savedCharacter);
        const character = new Character(charData.id, charData.name, charData.type);
        character.score = charData.score;
        character.awards = charData.awards;
        character.unlockedScenes = charData.unlockedScenes;
        character.completedScenes = charData.completedScenes || []; // 兼容旧存档
        return character;
    }
    return null;
} 