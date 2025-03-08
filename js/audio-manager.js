/**
 * 音频管理器类
 * 用于管理游戏中的所有音频资源
 */
class AudioManager {
    constructor() {
        this.sounds = {};
        this.musicVolume = 0.5;
        this.effectsVolume = 0.7;
        this.voiceVolume = 1.0;
        this.musicEnabled = true;
        this.effectsEnabled = true;
        this.voiceEnabled = true;
        
        // 预加载常用音频
        this.preloadCommonSounds();
    }
    
    /**
     * 预加载常用音频文件
     */
    preloadCommonSounds() {
        console.log('开始预加载音频文件...');
        
        try {
            // 背景音乐
            console.log('尝试加载音频: mainTheme (assets/audio/enter.mp3)');
            const mainThemeAudio = this.load('enter', 'assets/audio/enter.mp3', 'music');
            console.log('mainTheme 加载状态:', mainThemeAudio ? '成功' : '失败');
            
            // 常用音效
            console.log('尝试加载音频: buttonClick (assets/audio/click.mp3)');
            const buttonClickAudio = this.load('click', 'assets/audio/click.mp3', 'effect');
            console.log('buttonClick 加载状态:', buttonClickAudio ? '成功' : '失败');
            
            console.log('尝试加载音频: success (assets/audio/sucess.mp3)');
            const successAudio = this.load('success', 'assets/audio/sucess.mp3', 'effect');
            console.log('success 加载状态:', successAudio ? '成功' : '失败');
            
            console.log('尝试加载音频: error (assets/audio/fail.mp3)');
            const errorAudio = this.load('error', 'assets/audio/fail.mp3', 'effect');
            console.log('error 加载状态:', errorAudio ? '成功' : '失败');
            
            // 添加一个别名，使 'click' 指向 'buttonClick'
            console.log('为 buttonClick 添加别名 click');
            this.sounds['click'] = this.sounds['buttonClick'];
            
            console.log('音频预加载完成，已加载:', Object.keys(this.sounds));
        } catch (e) {
            console.error('音频预加载过程中发生错误:', e);
        }
    }
    
    /**
     * 加载音频文件
     * @param {string} id - 音频标识符
     * @param {string} path - 音频文件路径
     * @param {string} type - 音频类型 (music/effect/voice)
     */
    load(id, path, type = 'effect') {
        try {
            console.log(`开始加载音频 ${id} (${path})`);
            
            const audio = new Audio();
            
            // 添加事件监听器来跟踪加载状态
            audio.addEventListener('canplaythrough', () => {
                console.log(`音频 ${id} 已完全加载，可以播放`);
            });
            
            audio.addEventListener('error', (e) => {
                console.error(`音频 ${id} 加载失败:`, e);
            });
            
            // 设置音频源
            audio.src = path;
            
            // 根据类型设置默认属性
            switch(type) {
                case 'music':
                    audio.loop = true;
                    audio.volume = this.musicVolume;
                    console.log(`设置 ${id} 为音乐类型，循环播放，音量:`, this.musicVolume);
                    break;
                case 'effect':
                    audio.loop = false;
                    audio.volume = this.effectsVolume;
                    console.log(`设置 ${id} 为音效类型，单次播放，音量:`, this.effectsVolume);
                    break;
                case 'voice':
                    audio.loop = false;
                    audio.volume = this.voiceVolume;
                    console.log(`设置 ${id} 为语音类型，单次播放，音量:`, this.voiceVolume);
                    break;
            }
            
            this.sounds[id] = {
                audio: audio,
                type: type
            };
            
            console.log(`音频 ${id} 已添加到音频管理器`);
            
            return audio;
        } catch (e) {
            console.error(`加载音频 ${id} 时发生错误:`, e);
            return null;
        }
    }
    
    /**
     * 播放音频
     * @param {string} id - 音频标识符
     * @param {boolean} forceRestart - 是否强制重新开始播放
     */
    play(id, forceRestart = false) {
        console.log(`尝试播放音频: ${id}`);
        
        if (!this.sounds[id]) {
            console.warn(`音频 "${id}" 未找到，可用的音频有:`, Object.keys(this.sounds));
            return;
        }
        
        const sound = this.sounds[id];
        console.log(`找到音频 ${id}，类型: ${sound.type}`);
        
        // 检查是否启用了该类型的音频
        if ((sound.type === 'music' && !this.musicEnabled) ||
            (sound.type === 'effect' && !this.effectsEnabled) ||
            (sound.type === 'voice' && !this.voiceEnabled)) {
            console.warn(`音频 ${id} 类型 (${sound.type}) 已被禁用`);
            return;
        }
        
        try {
            if (forceRestart || sound.audio.paused) {
                console.log(`开始播放音频 ${id}`);
                sound.audio.currentTime = 0;
                
                const playPromise = sound.audio.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log(`音频 ${id} 开始播放成功`);
                    }).catch(error => {
                        console.error(`播放音频 ${id} 失败:`, error);
                        
                        // 如果是自动播放策略问题，提供解决方案
                        if (error.name === 'NotAllowedError') {
                            console.warn('浏览器阻止了自动播放。这通常是因为用户尚未与页面交互。');
                            console.warn('建议：将音频播放代码移至用户交互事件处理程序中（如点击事件）');
                        }
                    });
                }
            } else {
                console.log(`音频 ${id} 已经在播放中`);
            }
        } catch (e) {
            console.error(`播放音频 ${id} 时发生错误:`, e);
        }
    }
    
    /**
     * 停止播放音频
     * @param {string} id - 音频标识符
     */
    stop(id) {
        if (this.sounds[id]) {
            this.sounds[id].audio.pause();
            this.sounds[id].audio.currentTime = 0;
        }
    }
    
    /**
     * 暂停播放音频
     * @param {string} id - 音频标识符
     */
    pause(id) {
        if (this.sounds[id]) {
            this.sounds[id].audio.pause();
        }
    }
    
    /**
     * 恢复播放音频
     * @param {string} id - 音频标识符
     */
    resume(id) {
        if (this.sounds[id] && this.sounds[id].audio.paused) {
            this.sounds[id].audio.play().catch(error => {
                console.warn(`无法恢复播放音频 "${id}": ${error.message}`);
            });
        }
    }
    
    /**
     * 设置音乐音量
     * @param {number} volume - 音量值 (0-1)
     */
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        
        // 更新所有音乐的音量
        for (const id in this.sounds) {
            if (this.sounds[id].type === 'music') {
                this.sounds[id].audio.volume = this.musicVolume;
            }
        }
    }
    
    /**
     * 设置音效音量
     * @param {number} volume - 音量值 (0-1)
     */
    setEffectsVolume(volume) {
        this.effectsVolume = Math.max(0, Math.min(1, volume));
        
        // 更新所有音效的音量
        for (const id in this.sounds) {
            if (this.sounds[id].type === 'effect') {
                this.sounds[id].audio.volume = this.effectsVolume;
            }
        }
    }
    
    /**
     * 设置语音音量
     * @param {number} volume - 音量值 (0-1)
     */
    setVoiceVolume(volume) {
        this.voiceVolume = Math.max(0, Math.min(1, volume));
        
        // 更新所有语音的音量
        for (const id in this.sounds) {
            if (this.sounds[id].type === 'voice') {
                this.sounds[id].audio.volume = this.voiceVolume;
            }
        }
    }
    
    /**
     * 启用/禁用音乐
     * @param {boolean} enabled - 是否启用
     */
    enableMusic(enabled) {
        this.musicEnabled = enabled;
        
        // 如果禁用，暂停所有音乐
        if (!enabled) {
            for (const id in this.sounds) {
                if (this.sounds[id].type === 'music') {
                    this.sounds[id].audio.pause();
                }
            }
        }
    }
    
    /**
     * 启用/禁用音效
     * @param {boolean} enabled - 是否启用
     */
    enableEffects(enabled) {
        this.effectsEnabled = enabled;
    }
    
    /**
     * 启用/禁用语音
     * @param {boolean} enabled - 是否启用
     */
    enableVoice(enabled) {
        this.voiceEnabled = enabled;
    }
    
    /**
     * 停止所有音频
     */
    stopAll() {
        for (const id in this.sounds) {
            this.stop(id);
        }
    }
    
    /**
     * 停止所有音乐
     */
    stopAllMusic() {
        for (const id in this.sounds) {
            if (this.sounds[id].type === 'music') {
                this.stop(id);
            }
        }
    }
}

// 创建全局音频管理器实例
const audioManager = new AudioManager(); 