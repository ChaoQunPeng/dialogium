<template>
  <div class="battle-scene-view-full-screen">
    <div class="ambient-bg"></div>

    <div class="battle-scene-container">
      <div class="battle-content-wrapper">
        <div class="stage-section">
          <BattleStagePanel
            :player="player"
            :player-stats="playerStats"
            :enemy="enemy"
            :current-turns="currentTurns"
            :battle-status="battleStatus"
            :battle-rewards="battleRewards"
            @rematch="$emit('rematch')"
            @quit="$emit('quit')"
          />
        </div>

        <div class="log-section">
          <BattleLogPanel :battle-logs="battleLogs" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BattleLogPanel from '@/features/battle/components/BattleLogPanel.vue';
import BattleStagePanel from '@/features/battle/components/BattleStagePanel.vue';
import type { ICharacter } from '@/interface/character';
import type { IBattleReward } from '@/utils/battle';

// ==================== Props & Emits ====================
defineProps<{
  player: ICharacter;
  playerStats: any;
  enemy: ICharacter;
  currentTurns: number;
  battleStatus: 'idle' | 'fighting' | 'finished';
  battleRewards: IBattleReward | null;
  battleLogs: string[];
}>();

defineEmits<{
  (e: 'rematch'): void;
  (e: 'quit'): void;
}>();
</script>

<style lang="scss" scoped>
.battle-scene-view-full-screen {
  position: fixed;
  inset: 0; // 使用 inset 替代 top/left/right/bottom
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background-color: #0a0a12;
  // 深邃的科幻/魔幻感渐变背景
  // 基础底色：暗巧克力色/深灰
  background-color: #12100e;

  background-image:
    // 底部中心的暗红色暖光，模拟岩浆或战场余晖
    radial-gradient(circle at 50% 120%, rgba(255, 69, 0, 0.15) 0%, transparent 70%),
    // 顶部两侧的冷色调，与底部形成对比
    radial-gradient(circle at 10% 10%, rgba(200, 200, 200, 0.03) 0%, transparent 40%),
    radial-gradient(circle at 90% 10%, rgba(200, 200, 200, 0.03) 0%, transparent 40%);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

// 氛围装饰层
.ambient-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(65, 105, 225, 0.1) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(138, 43, 226, 0.1) 0%, transparent 40%);
  filter: blur(40px);
}

.battle-scene-container {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  max-width: 1400px; // 限制最大宽度，避免超宽屏下元素太散
  margin: 0 auto;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.battle-content-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stage-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 0; // 修复 flex 容器内部滚动/溢出问题的关键

  // 可以在这里给面板包裹一层发光效果
  :deep(.battle-stage-panel) {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    padding: 24px;
  }
}

.log-section {
  height: 25%; // 日志占底部 1/4
  min-height: 160px;
  max-height: 240px;

  :deep(.battle-log-panel) {
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    overflow-y: auto;

    // 隐藏原生滚动条，使用极简样式（根据需要调整）
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
    }
  }
}

/* 进场动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(1.02);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.battle-content-wrapper {
  animation: fadeIn 0.5s ease-out;
}
</style>
