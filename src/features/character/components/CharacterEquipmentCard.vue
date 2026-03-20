<template>
  <BaseBorderContainer title="穿戴装备">
    <div class="equip-line-grid">
      <div v-for="slot in equipmentSlots" :key="slot.key" class="slot-item">
        <div class="slot-inner">
          <span class="slot-label">{{ slot.label }}:</span>
          <BaseEquipmentItem v-if="equippedMap[slot.key]" :equipment="equippedMap[slot.key]" />
          <span v-else class="slot-empty">未装备</span>
        </div>
      </div>
    </div>
  </BaseBorderContainer>
</template>

<script setup lang="ts">
import BaseBorderContainer from '@/components/common/BaseBorderContainer.vue';
import BaseEquipmentItem from '@/components/common/BaseEquipmentItem.vue';
import {
  EQUIPMENT_SLOTS,
  type CharacterInventoryItem,
} from '@/features/character/model/inventory';
import type { SlotType } from '@/interface/item';

defineProps<{
  equippedMap: Partial<Record<SlotType, CharacterInventoryItem>>;
}>();

const equipmentSlots = EQUIPMENT_SLOTS;
</script>

<style lang="scss" scoped>
.equip-line-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 16px;
}

.slot-item {
  min-height: 26px;
}

.slot-inner {
  display: flex;
  align-items: center;
  gap: 8px;
}

.slot-label {
  color: #ddd;
  min-width: 48px;
}

.slot-empty {
  color: var(--text-muted);
  font-style: italic;
}
</style>