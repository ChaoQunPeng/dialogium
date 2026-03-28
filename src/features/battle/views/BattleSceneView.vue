<!-- 全屏战斗场景视图 - 提供沉浸式战斗体验的全屏视图 -->
<template>
  <div class="battle-scene-view-full-screen">
    <div class="battle-scene-container">
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

      <BattleLogPanel :battle-logs="battleLogs" />
    </div>
  </div>
</template>

<script setup lang="ts">
import BattleLogPanel from '@/features/battle/components/BattleLogPanel.vue';
import BattleStagePanel from '@/features/battle/components/BattleStagePanel.vue';
import type { ICharacter } from '@/interface/character';
import type { IBattleReward } from '@/utils/battle';

// ==================== Props & Emits ====================

// 组件属性：玩家、玩家属性、敌人、回合数、战斗状态、奖励、日志
defineProps<{
  player: ICharacter;
  playerStats: any;
  enemy: ICharacter;
  currentTurns: number;
  battleStatus: 'idle' | 'fighting' | 'finished';
  battleRewards: IBattleReward | null;
  battleLogs: string[];
}>();

// 组件事件：再次挑战、退出
defineEmits<{
  (e: 'rematch'): void;
  (e: 'quit'): void;
}>();
</script>

<style lang="scss" scoped>
.battle-scene-view-full-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  overflow: hidden;
}

.battle-scene-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.battle-scene {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 1200px;
  height: 100%;
}
</style>
