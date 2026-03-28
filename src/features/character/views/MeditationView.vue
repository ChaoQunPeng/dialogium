// 调息视图组件 - 全屏调息界面
<template>
  <div class="meditation-overlay">
    <div class="meditation-container">
      <!-- 标题 -->
      <h2 class="meditation-title">
        <span class="title-icon">🧘</span>
        闭目调息
      </h2>

      <!-- 气血恢复进度 -->
      <div class="hp-recovery-section">
        <div class="hp-bar-container">
          <div 
            class="hp-bar-fill" 
            :style="{ width: hpPercent + '%' }"
          >
            <div class="hp-bar-glow"></div>
          </div>
        </div>
        
        <div class="hp-text">
          <span class="current-hp">{{ playerStore.player.baseInfo.hp }}</span>
          <span class="hp-separator">/</span>
          <span class="max-hp">{{ playerStore.finalStats.maxHp }}</span>
        </div>

        <!-- 恢复动画提示 -->
        <div class="recovery-animation" v-if="isRecovering">
          <span class="recovery-icon">+❤️</span>
          <span class="recovery-text">气血恢复中...</span>
        </div>
      </div>

      <!-- 调息时间显示 -->
      <div class="meditation-time">
        <span class="time-label">已调息：</span>
        <span class="time-value">{{ formattedTime }}</span>
      </div>

      <!-- 恢复速率提示 -->
      <div class="recovery-rate-info">
        <span class="rate-icon">⏱️</span>
        <span class="rate-text">恢复速率：1 点/秒</span>
      </div>

      <!-- 操作按钮 -->
      <div class="meditation-actions">
        <button 
          class="btn btn-recover-full"
          @click="handleRecoverFull"
          title="测试用：立即恢复全部气血"
        >
          <span class="btn-icon">💯</span>
          满血复活 (测试)
        </button>

        <button 
          class="btn btn-end-meditation"
          @click="handleEndMeditation"
        >
          <span class="btn-icon">✖️</span>
          结束调息
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { usePlayerStore } from '@/stores/player';

const playerStore = usePlayerStore();

// ==================== 状态管理 ====================

// 计时器
const elapsedTime = ref(0);
let timerInterval: ReturnType<typeof setInterval> | null = null;

// ==================== 计算属性 ====================

/** 当前气血百分比 */
const hpPercent = computed(() => {
  const current = playerStore.player.baseInfo.hp;
  const max = playerStore.finalStats.maxHp;
  return max > 0 ? (current / max) * 100 : 0;
});

/** 是否正在恢复气血 */
const isRecovering = computed(() => {
  return playerStore.player.baseInfo.hp < playerStore.finalStats.maxHp;
});

/** 格式化已调息时间 */
const formattedTime = computed(() => {
  const seconds = Math.floor(elapsedTime.value / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}分${remainingSeconds.toString().padStart(2, '0')}秒`;
  }
  return `${remainingSeconds}秒`;
});

// ==================== 方法 ====================

/** 处理结束调息 */
const handleEndMeditation = () => {
  playerStore.stopMeditation();
};

/** 处理立即恢复全部气血（测试用） */
const handleRecoverFull = () => {
  playerStore.recoverFullHp();
};

// ==================== 生命周期 ====================

onMounted(() => {
  // 启动计时器
  timerInterval = setInterval(() => {
    elapsedTime.value += 100;
  }, 100);
});

onUnmounted(() => {
  // 清除计时器
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
});
</script>

<style lang="scss" scoped>
.meditation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

.meditation-container {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid var(--color-cyan);
  border-radius: 16px;
  padding: 48px 64px;
  box-shadow: 0 0 60px rgba(64, 224, 208, 0.3),
              inset 0 0 30px rgba(64, 224, 208, 0.1);
  text-align: center;
  max-width: 600px;
  width: 90%;
  animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.meditation-title {
  font-size: 36px;
  color: var(--color-cyan);
  margin-bottom: 48px;
  text-shadow: 0 0 20px rgba(64, 224, 208, 0.6);
  letter-spacing: 8px;
  
  .title-icon {
    margin-right: 12px;
    display: inline-block;
    animation: pulse 2s infinite;
  }
}

.hp-recovery-section {
  margin-bottom: 32px;
}

.hp-bar-container {
  width: 100%;
  height: 40px;
  background: rgba(0, 0, 0, 0.6);
  border: 2px solid rgba(64, 224, 208, 0.3);
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.5);
}

.hp-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, 
    #ff4d4d 0%, 
    #ff6b6b 50%, 
    #4dbd74 100%);
  transition: width 0.5s ease;
  position: relative;
  box-shadow: 0 0 20px rgba(77, 189, 116, 0.6);
}

.hp-bar-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite;
}

.hp-text {
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 8px;
  margin-top: 16px;
  font-size: 28px;
  color: var(--text-main);
  font-weight: bold;
  
  .current-hp {
    color: var(--color-green);
    text-shadow: 0 0 10px rgba(77, 189, 116, 0.6);
  }
  
  .hp-separator {
    color: var(--text-muted);
  }
  
  .max-hp {
    color: var(--text-main);
  }
}

.recovery-animation {
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  animation: bounceIn 0.6s ease;
  
  .recovery-icon {
    font-size: 32px;
    animation: heartbeat 1s infinite;
  }
  
  .recovery-text {
    font-size: 20px;
    color: var(--color-green);
    text-shadow: 0 0 10px rgba(77, 189, 116, 0.4);
  }
}

.meditation-time {
  margin: 24px 0;
  padding: 16px;
  background: rgba(64, 224, 208, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(64, 224, 208, 0.2);
  
  .time-label {
    color: var(--text-muted);
    font-size: 18px;
  }
  
  .time-value {
    color: var(--color-cyan);
    font-size: 24px;
    font-weight: bold;
    text-shadow: 0 0 10px rgba(64, 224, 208, 0.4);
  }
}

.recovery-rate-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 40px;
  
  .rate-icon {
    font-size: 20px;
  }
  
  .rate-text {
    color: var(--text-muted);
    font-size: 16px;
  }
}

.meditation-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.btn {
  padding: 16px 32px;
  font-size: 18px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: inherit;
  font-weight: bold;
  
  .btn-icon {
    font-size: 24px;
  }
}

.btn-recover-full {
  background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
  color: white;
  box-shadow: 0 6px 20px rgba(255, 77, 77, 0.4);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 77, 77, 0.6);
    filter: brightness(1.1);
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0 4px 15px rgba(255, 77, 77, 0.4);
  }
}

.btn-end-meditation {
  background: linear-gradient(135deg, #4a5568, #2d3748);
  color: white;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
    filter: brightness(1.1);
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  }
}

// ==================== 动画定义 ====================

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  10% {
    transform: scale(1.2);
  }
  20% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.1);
  }
  40% {
    transform: scale(1);
  }
}

@keyframes bounceIn {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }
  50% {
    transform: translateY(5px);
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>