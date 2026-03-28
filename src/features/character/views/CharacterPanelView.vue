<!-- 角色面板视图 - 展示角色属性、装备和背包 -->
<template>
  <div class="character-panel">
    <CharacterStatsCard
      :realm="playerStore.realm"
      :level="playerStore.player.baseInfo.level"
      :stats="playerStore.finalStats"
    />

    <!-- 调息按钮 -->
    <div class="meditation-section">
      <button class="btn-meditation" @click="handleStartMeditation" :disabled="isHpFull">
        <span class="btn-icon">🧘</span>
        <span class="btn-text">
          {{ isHpFull ? '气血已满' : '闭目调息' }}
        </span>
      </button>
    </div>

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
/** 气血是否已满 */
const isHpFull = computed(() => {
  return playerStore.player.baseInfo.hp >= playerStore.finalStats.maxHp;
});

// ==================== 方法 ====================

/** 开始调息 */
const handleStartMeditation = () => {
  if (!isHpFull.value) {
    playerStore.startMeditation();
  }
};
</script>

<style lang="scss" scoped>
.character-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.meditation-section {
  padding: 0 8px;
}

.btn-meditation {
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(135deg, #40e0d0, #4dbd74);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-family: inherit;
  font-size: 20px;
  font-weight: bold;
  color: white;
  box-shadow: 0 6px 20px rgba(64, 224, 208, 0.4);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  .btn-icon {
    font-size: 28px;
  }

  .btn-text {
    letter-spacing: 4px;
  }

  .btn-hint {
    font-size: 16px;
    opacity: 0.8;
    font-weight: normal;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(64, 224, 208, 0.6);
    filter: brightness(1.1);
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: 0 4px 15px rgba(64, 224, 208, 0.4);
  }

  &:disabled {
    background: linear-gradient(135deg, #4a5568, #2d3748);
    cursor: not-allowed;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    opacity: 0.6;
  }
}
</style>
