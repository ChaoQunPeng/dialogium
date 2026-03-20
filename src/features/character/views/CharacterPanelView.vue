<template>
  <div class="character-panel">
    <CharacterStatsCard
      :realm="playerStore.realm"
      :level="playerStore.player.baseInfo.level"
      :stats="playerStore.finalStats"
    />

    <CharacterEquipmentCard :equipped-map="equippedMap" />

    <CharacterInventoryCard
      :active-tab="activeTab"
      :tabs="tabs"
      :items="filteredInventory"
      @change-tab="activeTab = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { usePlayerStore } from '@/stores/player';
import CharacterEquipmentCard from '@/features/character/components/CharacterEquipmentCard.vue';
import CharacterInventoryCard from '@/features/character/components/CharacterInventoryCard.vue';
import CharacterStatsCard from '@/features/character/components/CharacterStatsCard.vue';
import {
  INVENTORY_TABS,
  buildEquippedMap,
  mapInventoryItems,
  mergeInventoryItems,
  type InventoryTab,
} from '@/features/character/model/inventory';

const playerStore = usePlayerStore();
const activeTab = ref<InventoryTab>('equipment');
const tabs = INVENTORY_TABS;

const inventory = computed(() => mapInventoryItems(playerStore.inventory));
const equippedMap = computed(() => buildEquippedMap(inventory.value));
const filteredInventory = computed(() => mergeInventoryItems(inventory.value, activeTab.value));
</script>

<style lang="scss" scoped>
.character-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>