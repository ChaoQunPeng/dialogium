<!-- 开始屏幕视图 - 游戏启动界面，展示标题、特色功能和开始按钮 -->
<template>
  <!-- 开始屏幕容器 -->
  <div class="start-screen">
    <!-- 开始内容区域 -->
    <div class="start-content">
      <!-- 标题区域：包含游戏标题、致敬文字和标语 -->
      <div class="title-section">
        <!-- 游戏主标题 -->
        <h1 class="game-title">
          <span class="title-main">飘邈之旅</span>
        </h1>

        <!-- 致敬文字：说明游戏改编自同名小说 -->
        <div class="tribute-text">
          <span>根据同名小说《飘邈之旅》开发</span>
        </div>

        <!-- 标语包装器 -->
        <div class="tagline-wrapper">
          <!-- 游戏标语：介绍游戏特色 -->
          <p class="tagline">
            也许会看到先进的文明，也许会看到诱人的法宝，也许会看到仙人的遗迹...
            不用奇怪！这就是飘邈之旅！
          </p>
        </div>
      </div>

      <!-- 特色功能展示：横向排列的游戏特色 -->
      <div class="feature-text-flow">
        <span class="feat-node">历练战斗</span>
        <span class="feat-sep">·</span>
        <span class="feat-node">修炼突破</span>
        <span class="feat-sep">·</span>
        <span class="feat-node">法宝装备</span>
        <span class="feat-sep">·</span>
        <span class="feat-node">探索星域</span>
      </div>

      <!-- 操作区域：包含加载提示和开始按钮 -->
      <div class="action-area">
        <!-- 加载提示：当 isLoading 为 true 时显示 -->
        <div class="loading-hint" v-if="isLoading">
          <!-- 加载旋转动画 -->
          <span class="loading-spinner"></span>
          <!-- 加载文字提示 -->
          <span class="loading-text">正在进入修真界...</span>
        </div>

        <!-- 开始按钮：当 isLoading 为 false 时显示 -->
        <button v-else class="text-btn" @click="handleStart">
          <!-- 按钮文字 -->
          <span class="btn-text">[ 开启旅程 ]</span>
          <!-- 按钮光晕效果 -->
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
import { useQuestStore } from '@/stores/quest';

// ==================== 状态管理 ====================

// 是否正在加载中（控制加载动画和按钮的显示切换）
const isLoading = ref(false);

// 玩家数据管理器
const playerStore = usePlayerStore();

// 任务数据管理器
const questStore = useQuestStore();

// ==================== 事件定义 ====================

// 组件事件定义：游戏已启动时通知父组件
const emit = defineEmits<{
  'game-started': [];
}>();

// ==================== 事件处理 ====================

/**
 * 处理开始按钮点击事件
 * 执行游戏初始化流程，包括延迟动画、初始化游戏、加载数据等
 */
const handleStart = async () => {
  // 如果正在加载中，防止重复点击
  if (isLoading.value) return;
  
  // 设置为加载状态
  isLoading.value = true;

  try {
    // 延迟 1.5 秒展示加载动画，提升用户体验
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // 初始化游戏核心系统
    await initializeGame();
    
    // 从本地存储加载玩家数据
    playerStore.loadStorageData();
    
    // 加载任务数据
    questStore.loadQuests();
    
    // 通知父组件游戏已启动，切换到游戏主界面
    emit('game-started');
  } catch (error) {
    // 捕获初始化错误并记录日志
    console.error('游戏初始化失败:', error);
    
    // 重置加载状态
    isLoading.value = false;
    
    // 提示用户初始化失败
    alert('游戏初始化失败，请刷新重试');
  }
};
</script>

<style lang="scss" scoped>
.start-screen {
  position: fixed;
  inset: 0;
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
      color: #eec43f;
      text-shadow: 0 0 16px rgba(238, 196, 63, 0.7);
    }

    .btn-glow {
      opacity: 1;
    }
  }
}

.loading-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #40e0d0;
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(64, 224, 208, 0.25);
  border-top-color: #40e0d0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes pulse-bg {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.03);
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
    filter: brightness(0.95);
  }
  to {
    filter: brightness(1.1);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>