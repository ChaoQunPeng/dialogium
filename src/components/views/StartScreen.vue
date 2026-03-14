<template>
  <div class="start-screen">
    <div class="start-content">
      <div class="title-section">
        <h1 class="game-title">
          <span class="title-main">飘邈之旅</span>
        </h1>

        <div class="tribute-text">
          <span>根据同名小说《飘邈之旅》开发</span>
        </div>

        <div class="tagline-wrapper">
          <p class="tagline">
            也许会看到先进的文明，也许会看到诱人的法宝，也许会看到仙人的遗迹...
            不用奇怪！这就是飘邈之旅！
          </p>
        </div>
      </div>

      <div class="feature-text-flow">
        <span class="feat-node">历练战斗</span>
        <span class="feat-sep">·</span>
        <span class="feat-node">修炼突破</span>
        <span class="feat-sep">·</span>
        <span class="feat-node">法宝装备</span>
        <span class="feat-sep">·</span>
        <span class="feat-node">探索星域</span>
      </div>

      <div class="action-area">
        <div class="loading-hint" v-if="isLoading">
          <span class="loading-spinner"></span>
          <span class="loading-text">正在进入修真界...</span>
        </div>

        <button v-else class="text-btn" @click="handleStart">
          <span class="btn-text">[ 开启旅程 ]</span>
          <span class="btn-glow"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { initializeGame } from '@/utils/initialize';
import { usePlayerStore } from '@/stores/player';

const isLoading = ref(false);
const playerStore = usePlayerStore();

const emit = defineEmits<{
  'game-started': [];
}>();

const handleStart = async () => {
  if (isLoading.value) return;
  isLoading.value = true;

  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 1. 先执行游戏初始化（设置 localStorage）
    await initializeGame();

    // 2. 然后刷新 playerStore 的数据
    playerStore.initialize();

    console.log('✅ 游戏数据初始化完成，playerStore 已同步');

    // 3. 通知父组件游戏已启动
    emit('game-started');
  } catch (error) {
    console.error('游戏初始化失败:', error);
    isLoading.value = false;
    alert('游戏初始化失败，请刷新重试');
  }
};
</script>

<style lang="scss" scoped>
.start-screen {
  position: fixed;
  inset: 0;
  // 深邃的星空渐变
  background: linear-gradient(135deg, #050505 0%, #1a1a2e 50%, #16213e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(circle at 20% 30%, rgba(64, 224, 208, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(238, 196, 63, 0.05) 0%, transparent 50%);
    animation: pulse-bg 8s ease-in-out infinite alternate;
  }
}

.start-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 0 40px;
  width: 100%;
  max-width: 580px;
  animation: fadeInUp 1s ease-out;
}

.title-section {
  margin-bottom: 30px;
}

.game-title {
  margin-bottom: 8px;
  animation: title-glow 2s ease-in-out infinite alternate;

  .title-main {
    display: block;
    font-size: 4rem;
    font-weight: bold;
    background: linear-gradient(45deg, #40e0d0, #eec43f);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 30px rgba(64, 224, 208, 0.5);
    letter-spacing: 10px;
    padding-left: 10px;
  }
}

/* 根据同名小说开发：采用更纤细的字重，增加神秘感 */
.tribute-text {
  font-family: 'PingFang SC', 'STKaiti', serif;
  font-size: 0.75rem;
  color: #fff;
  opacity: 0.3;
  letter-spacing: 2px;
  margin-bottom: 20px;
  font-weight: 300;
}

.tagline-wrapper {
  max-width: 450px;
  margin: 0 auto;
  .tagline {
    font-size: 0.95rem;
    color: rgba(160, 160, 160, 0.7);
    font-family: 'STKaiti', serif;
    letter-spacing: 2px;
    line-height: 1.6;
  }
}

.feature-text-flow {
  margin: 30px 0 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  font-family: 'STKaiti', serif;

  .feat-node {
    font-size: 1.05rem;
    color: rgba(64, 224, 208, 0.9);
    letter-spacing: 1px;
    transition: all 0.3s;
    &:hover {
      color: #eec43f;
      text-shadow: 0 0 8px rgba(238, 196, 63, 0.5);
    }
  }

  .feat-sep {
    color: rgba(255, 255, 255, 0.15);
    font-weight: bold;
  }
}

.action-area {
  min-height: 80px;
}

.text-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  position: relative;
  padding: 15px 30px;
  transition: all 0.3s ease;
  outline: none;

  .btn-text {
    font-size: 1.6rem;
    font-family: 'STKaiti', serif;
    letter-spacing: 8px;
    color: #40e0d0;
    text-shadow: 0 0 10px rgba(64, 224, 208, 0.4);
    transition: all 0.4s ease;
  }

  .btn-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle, rgba(64, 224, 208, 0.15) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: translateY(-2px);
    .btn-text {
      color: #fff;
      text-shadow:
        0 0 15px #40e0d0,
        0 0 30px rgba(64, 224, 208, 0.6);
      letter-spacing: 10px;
    }
    .btn-glow {
      opacity: 1;
    }
  }

  &:active {
    transform: scale(0.96);
  }
}

.loading-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  .loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid rgba(64, 224, 208, 0.1);
    border-top-color: #40e0d0;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .loading-text {
    font-size: 0.9rem;
    color: #a0a0a0;
    font-family: 'STKaiti', serif;
    letter-spacing: 4px;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes title-glow {
  from {
    text-shadow: 0 0 20px rgba(64, 224, 208, 0.4);
  }
  to {
    text-shadow:
      0 0 35px rgba(64, 224, 208, 0.7),
      0 0 15px rgba(238, 196, 63, 0.3);
  }
}

@keyframes pulse-bg {
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
