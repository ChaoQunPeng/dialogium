<!-- 角色面板视图 - 展示角色属性、装备和背包 -->
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

// ==================== 状态管理 ====================

// 当前选中的背包标签页
const activeTab = ref<InventoryTab>('equipment');
// 所有可用的背包标签页
const tabs = INVENTORY_TABS;

// ==================== 计算属性 ====================

/** 映射后的背包物品列表 */
const inventory = computed(() => mapInventoryItems(playerStore.inventory));
/** 已装备物品的映射表 */
const equippedMap = computed(() => buildEquippedMap(inventory.value));
/** 根据标签页过滤后的背包物品 */
const filteredInventory = computed(() => mergeInventoryItems(inventory.value, activeTab.value));
</script>

<style lang="scss" scoped>
.character-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>