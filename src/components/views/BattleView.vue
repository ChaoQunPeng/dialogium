<template>
  <FeatureBattleView
    :player="playerStore.finalPlayer"
    :enemy="enemy"
    :scene-name="sceneName"
    :show-close-button="showCloseButton"
    @battle-end="emit('battleEnd', $event)"
    @close="emit('close')"
  />
</template>

<script setup lang="ts">
import FeatureBattleView from '@/features/battle/views/BattleView.vue';
import { usePlayerStore } from '@/stores/player';
import type { ICharacter } from '@/interface/character';
import type { IBattleSummary } from '@/utils/battle';

const playerStore = usePlayerStore();

defineProps<{
  enemy: ICharacter;
  sceneName?: string;
  showCloseButton?: boolean;
}>();

const emit = defineEmits<{
  (e: 'battleEnd', result: IBattleSummary): void;
  (e: 'close'): void;
}>();
</script>
