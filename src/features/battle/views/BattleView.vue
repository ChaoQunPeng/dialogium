<template>
  <div class="battle-view">
    <BattlePreparationPanel
      v-if="!isInBattle"
      :enemy="enemy"
      :scene-name="sceneName"
      :show-close-button="showCloseButton"
      @battle="battleEnemy"
      @close="emit('close')"
    />

    <div v-else class="battle-scene">
      <BattleStagePanel
        :player="player"
        :player-stats="playerStore.finalStats"
        :enemy="enemy"
        :current-turns="currentTurns"
        :battle-status="battleStatus"
        :battle-rewards="battleRewards"
        @rematch="rematchBattle"
        @quit="quitBattle"
      />

      <BattleLogPanel :battle-logs="battleLogs" />
    </div>
  </div>
</template>

<script setup lang="ts">
import BattleLogPanel from '@/features/battle/components/BattleLogPanel.vue';
import BattlePreparationPanel from '@/features/battle/components/BattlePreparationPanel.vue';
import BattleStagePanel from '@/features/battle/components/BattleStagePanel.vue';
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

const battleEnemy = () => {
  startEncounter((result) => emit('battleEnd', result));
};

const quitBattle = () => {
  quitEncounter();
  emit('close');
};

const rematchBattle = () => {
  rematchEncounter((result) => emit('battleEnd', result));
};
</script>

<style lang="scss" scoped>
.battle-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 800px;
  width: 100%;
}

.battle-scene {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>