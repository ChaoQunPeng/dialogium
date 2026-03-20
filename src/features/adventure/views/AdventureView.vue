<template>
  <div class="scene-view-wrapper">
    <SceneList
      v-if="!currentScene && !isInBattle && !isConversationOpen && !isShopOpen"
      :scenes="scenes"
      @select="enterScene"
    />

    <SceneDetail
      v-else-if="currentScene && !isInBattle && !isConversationOpen && !isShopOpen"
      :scene="currentScene"
      :enemies="enemiesInScene"
      :npcs="npcsInScene"
      :can-fight-monster="canFightMonster"
      @back="exitScene"
      @challenge="challengeMonster"
      @talk="selectNPC"
    />

    <BattleView
      v-if="isInBattle && selectedMonster"
      :player="playerStore.finalPlayer"
      :enemy="selectedMonster"
      :scene-name="currentScene?.name"
      :show-close-button="true"
      @battle-end="onBattleEnd"
      @close="exitBattle"
    />

    <ConversationView v-if="isConversationOpen && selectedNPC" :npc="selectedNPC" @close="closeConversation" />

    <ShopView
      v-if="isShopOpen && selectedMerchant"
      :npc="selectedMerchant"
      @close="closeShop"
      @purchase="handlePurchase"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import ConversationView from '@/components/views/ConversationView.vue';
import ShopView from '@/components/views/ShopView.vue';
import BattleView from '@/features/battle/views/BattleView.vue';
import SceneDetail from '@/features/adventure/components/SceneDetail.vue';
import SceneList from '@/features/adventure/components/SceneList.vue';
import { isBattleVictory, partitionSceneCharacters } from '@/features/adventure/model/scene';
import type { ICharacter } from '@/interface/character';
import type { IItem } from '@/interface/item';
import type { Scene } from '@/interface/scene';
import { qianJieXing } from '@/scene/qianJieXing';
import { tianTingXing } from '@/scene/tianTingXing';
import { usePlayerStore } from '@/stores/player';
import { useQuestStore } from '@/stores/quest';
import type { IBattleSummary } from '@/utils/battle';
import { canFight } from '@/utils/battle';

const playerStore = usePlayerStore();
const questStore = useQuestStore();

const scenes: Scene[] = [tianTingXing, qianJieXing];

const currentScene = ref<Scene | null>(null);
const selectedMonster = ref<ICharacter | null>(null);
const selectedNPC = ref<ICharacter | null>(null);
const selectedMerchant = ref<ICharacter | null>(null);
const isInBattle = ref(false);
const isConversationOpen = ref(false);
const isShopOpen = ref(false);

const sceneCharacters = computed(() => partitionSceneCharacters(currentScene.value));
const enemiesInScene = computed(() => sceneCharacters.value.enemies);
const npcsInScene = computed(() => sceneCharacters.value.npcs);

const enterScene = (scene: Scene) => {
  currentScene.value = scene;
};

const exitScene = () => {
  currentScene.value = null;
  selectedMonster.value = null;
  selectedNPC.value = null;
  selectedMerchant.value = null;
};

const challengeMonster = (monster: ICharacter) => {
  selectedMonster.value = monster;
  isInBattle.value = true;
};

const onBattleEnd = (result: IBattleSummary) => {
  if (!selectedMonster.value) return;

  if (isBattleVictory(result.winner?.id, playerStore.player.id)) {
    questStore.updateQuestsByTarget('kill', selectedMonster.value.id, 1);
    questStore.updateQuestsByTarget('kill', 'any', 1);
  }
};

const exitBattle = () => {
  isInBattle.value = false;
  selectedMonster.value = null;
};

const selectNPC = (npc: ICharacter) => {
  questStore.updateQuestsByTarget('talk', npc.id, 1);

  if (npc.type === 'merchant') {
    selectedMerchant.value = npc;
    isShopOpen.value = true;
    return;
  }

  selectedNPC.value = npc;
  isConversationOpen.value = true;
};

const closeConversation = () => {
  isConversationOpen.value = false;
  selectedNPC.value = null;
};

const closeShop = () => {
  isShopOpen.value = false;
  selectedMerchant.value = null;
};

const handlePurchase = (item: IItem) => {
  const result = playerStore.purchaseItem(item);
  alert(`【系统】${result.message}`);

  if (result.success) {
    questStore.updateQuestsByTarget('purchase', item.id, 1);
  }
};

const canFightMonster = (monster: ICharacter): boolean => {
  return !!monster.battle && canFight(playerStore.finalPlayer, monster).canFight;
};
</script>

<style lang="scss" scoped>
.scene-view-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>