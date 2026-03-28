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

const props = defineProps<{
  player: ICharacter;
  enemy: ICharacter;
  sceneName?: string;
  showCloseButton?: boolean;
}>();

const emit = defineEmits<{
  (e: 'battleEnd', result: IBattleSummary): void;
  (e: 'close'): void;
}>();

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

// 开始战斗 - 切换到全屏战斗视图
const startBattle = () => {
  startEncounter();
};

// 退出战斗
const quitBattle = () => {
  quitEncounter();
  emit('close');
};

// 再次挑战
const rematchBattle = () => {
  rematchEncounter();
};
</script>

<style lang="scss" scoped>
.battle-view-wrapper {
  width: 100%;
}
</style>
