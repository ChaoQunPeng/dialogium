<template>
  <div class="start-screen">
    <div class="start-content">
      <div class="title-section">
        <h1 class="game-title">
          <span class="title-main">飘邈之旅</span>
        </h1>
        <p class="tagline">
          也许会看到先进的文明，也许会看到诱人的法宝，也许会看到仙人的遗迹，也许会看到西方中世纪的古堡，也许会看到各种稀奇古怪的野兽……不用奇怪！这就是飘邈之旅！
        </p>
      </div>

      <div class="feature-section">
        <div class="feature-item">
          <span class="feature-icon">⚔️</span>
          <span class="feature-text">历练战斗</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🧘</span>
          <span class="feature-text">修炼突破</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🗡️</span>
          <span class="feature-text">法宝装备</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🌌</span>
          <span class="feature-text">探索星域</span>
        </div>
      </div>

      <div class="loading-hint" v-if="isLoading">
        <span class="loading-spinner"></span>
        <span class="loading-text">正在进入修真界...</span>
      </div>

      <button v-else class="start-btn" @click="handleStart">
        <span class="btn-text">开启你的飘邈之旅</span>
        <span class="btn-glow"></span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { initializeGame } from '@/utils/initialize';

const isLoading = ref(false);

// 定义 emit
const emit = defineEmits<{
  'game-started': [];
}>();

const handleStart = async () => {
  if (isLoading.value) return;

  isLoading.value = true;

  try {
    console.log('🎮 开始初始化游戏...');

    // 延时模拟加载过程
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 执行游戏初始化
    await initializeGame();

    // 通知父组件游戏已启动
    emit('game-started');
    console.log('✅ 游戏启动状态已确认');
    console.log('✅ 即将进入游戏主界面...');
  } catch (error) {
    console.error('游戏初始化失败:', error);
    isLoading.value = false;
    alert('游戏初始化失败，请刷新页面重试');
  }
};
</script>

<style lang="scss" scoped>
.start-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: hidden;

  // 背景动画 - 星空效果
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      radial-gradient(circle at 20% 30%, rgba(76, 224, 208, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(238, 196, 63, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(255, 77, 77, 0.05) 0%, transparent 50%);
    animation: pulse 8s ease-in-out infinite;
  }
}

.start-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 40px;
  max-width: 600px;
  animation: fadeInUp 1s ease-out;
}

.title-section {
  margin-bottom: 40px;
}

.game-title {
  margin-bottom: 20px;
  animation: glow 2s ease-in-out infinite alternate;

  .title-main {
    display: block;
    font-size: 4rem;
    font-weight: bold;
    background: linear-gradient(45deg, #40e0d0, #eec43f);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 30px rgba(64, 224, 208, 0.5);
    letter-spacing: 8px;
  }

  .title-sub {
    display: block;
    font-size: 2rem;
    color: #eec43f;
    margin-top: 10px;
    letter-spacing: 12px;
    font-weight: normal;
  }
}

.tagline {
  font-size: 1rem;
  color: #a0a0a0;
  font-family: 'STKaiti', serif;
  letter-spacing: 4px;
}

.feature-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin: 40px 0;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background: rgba(30, 30, 30, 0.6);
  border: 1px solid rgba(64, 224, 208, 0.2);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(64, 224, 208, 0.5);
    box-shadow: 0 10px 30px rgba(64, 224, 208, 0.2);
  }

  .feature-icon {
    font-size: 2.5rem;
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
  }

  .feature-text {
    font-size: 1.1rem;
    color: #d4d4d4;
    font-family: 'STKaiti', serif;
    letter-spacing: 4px;
  }
}

.start-btn {
  position: relative;
  padding: 18px 30px;
  font-size: 1.5rem;
  font-family: 'STKaiti', serif;
  letter-spacing: 4px;
  color: #fff;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border: 2px solid #40e0d0;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow:
    0 4px 15px rgba(64, 224, 208, 0.3),
    inset 0 0 20px rgba(64, 224, 208, 0.1);
  text-shadow: 0 0 10px rgba(64, 224, 208, 0.5);

  &:hover {
    transform: translateY(-3px);
    box-shadow:
      0 8px 25px rgba(64, 224, 208, 0.5),
      inset 0 0 30px rgba(64, 224, 208, 0.2);
    border-color: #40e0d0;

    .btn-glow {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(64, 224, 208, 0.4);
  }

  .btn-text {
    position: relative;
    z-index: 2;
  }

  .btn-glow {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(64, 224, 208, 0.3), transparent);
    transition: left 0.5s ease;
    opacity: 0;
    z-index: 1;
  }

  &:hover .btn-glow {
    left: 100%;
  }
}

.loading-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-top: 30px;
  animation: fadeIn 0.5s ease;

  .loading-text {
    font-size: 1rem;
    color: #a0a0a0;
    font-family: 'STKaiti', serif;
    letter-spacing: 4px;
  }
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(64, 224, 208, 0.2);
  border-top-color: #40e0d0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

// 动画定义
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes glow {
  from {
    text-shadow: 0 0 20px rgba(64, 224, 208, 0.5);
  }
  to {
    text-shadow:
      0 0 30px rgba(64, 224, 208, 0.8),
      0 0 40px rgba(238, 196, 63, 0.5);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
