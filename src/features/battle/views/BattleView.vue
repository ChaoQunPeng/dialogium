// 战斗视图 - 管理战斗准备阶段和全屏战斗执行的容器组件
<template>
  <div class="battle-view-wrapper">
    <!-- 战斗准备阶段 - 嵌入在原页面中 -->
    <BattlePreparationPanel
      v-if="!isInBattle"
      :enemy="enemy"
      :scene-name="sceneName"
      :show-close-button="showCloseButton"
      @battle="startBattle"
      @close="emit('close')"
    />

    <!-- 全屏战斗场景视图 -->
    <BattleSceneView
      v-else
      :player="player"
      :player-stats="playerStore.finalStats"
      :enemy="enemy"
      :current-turns="currentTurns"
      :battle-status="battleStatus"
      :battle-rewards="battleRewards"
      :battle-logs="battleLogs"
      @rematch="rematchBattle"
      @quit="quitBattle"
    />
  </div>
</template>

<script setup lang="ts">
import BattlePreparationPanel from '@/features/battle/components/BattlePreparationPanel.vue';
import BattleSceneView from './BattleSceneView.vue';
import { useBattleFlow } from '@/features/battle/composables/useBattleFlow';
import type { ICharacter } from '@/interface/character';
import { usePlayerStore } from '@/stores/player';
import type { IBattleSummary } from '@/utils/battle';

const playerStore = usePlayerStore();

// ==================== Props & Emits ====================

// 组件属性：玩家角色、敌人、场景名称、是否显示关闭按钮
const props = defineProps<{
  player: ICharacter;
  enemy: ICharacter;
  sceneName?: string;
  showCloseButton?: boolean;
}>();

// 组件事件：战斗结束、关闭
const emit = defineEmits<{
  (e: 'battleEnd', result: IBattleSummary): void;
  (e: 'close'): void;
}>();

// ==================== 战斗流程管理 ====================

// 使用战斗流程组合式函数
const {
  enemy,
  isInBattle,
  battleLogs,
  currentTurns,
  battleStatus,
  battleRewards,
  startEncounter,
  quitEncounter,
  rematchEncounter,
} = useBattleFlow(() => props.enemy);

// ==================== 事件处理 ====================

/** 开始战斗 - 切换到全屏战斗视图 */
const startBattle = () => {
  startEncounter();
};

/** 退出战斗 - 返回战斗准备面板 */
const quitBattle = () => {
  quitEncounter();
  // 不再 emit('close')，而是让视图返回到 BattlePreparationPanel
};

/** 再次挑战 */
const rematchBattle = () => {
  rematchEncounter();
};
</script>

<style lang="scss" scoped>
.battle-view-wrapper {
  width: 100%;
}
</style>
