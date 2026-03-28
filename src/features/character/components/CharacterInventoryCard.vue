<!-- 角色背包卡片 - 展示和管理背包物品 -->
<template>
  <BaseBorderContainer :title="`储物纳戒 (${items.length})`">
    <div class="tab-row">
      <div
        v-for="tab in tabs"
        :key="tab.key"
        :class="['tab-link', { active: activeTab === tab.key }]"
        @click="$emit('change-tab', tab.key)"
      >
        {{ activeTab === tab.key ? `[${tab.name}]` : tab.name }}
      </div>
    </div>

    <div class="inventory-table">
      <table>
        <thead>
          <tr>
            <th class="name-col">名称</th>
            <th class="count-col">数量</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.instanceId" class="item-row">
            <td class="item-name">
              <div>
                <BaseEquipmentItem :equipment="item">
                  <template #default="{ item: slotItem }">
                    <span>【{{ slotItem.name }}】</span>
                  </template>
                </BaseEquipmentItem>

                <span v-if="item.isLocked" class="lock">[锁]</span>
                <div class="item-description">{{ item.description || '--' }}</div>
              </div>
            </td>
            <td class="item-count">x{{ item.count }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="items.length === 0" class="empty-text">--- 纳戒空无一物 ---</div>
    </div>
  </BaseBorderContainer>
</template>

<script setup lang="ts">
import BaseBorderContainer from '@/components/common/BaseBorderContainer.vue';
import BaseEquipmentItem from '@/components/common/BaseEquipmentItem.vue';
import type {
  CharacterInventoryItem,
  InventoryTab,
  InventoryTabConfig,
} from '@/features/character/model/inventory';

// ==================== Props & Emits ====================

// 组件属性：当前标签页、标签页配置、物品列表
defineProps<{
  activeTab: InventoryTab;
  tabs: InventoryTabConfig[];
  items: CharacterInventoryItem[];
}>();

// 组件事件：切换标签页
defineEmits<{
  (e: 'change-tab', tab: InventoryTab): void;
}>();
</script>

<style lang="scss" scoped>
.tab-row {
  display: flex;
  gap: 8px;
}

.tab-link {
  cursor: pointer;

  &.active {
    color: var(--color-yellow);
  }
}

.inventory-table {
  margin-top: 12px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--color-border);
}

th {
  background-color: rgba(50, 50, 50, 0.7);
  padding: 8px 4px;
  text-align: center;
  font-weight: bold;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-yellow);
}

td {
  padding: 6px 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  vertical-align: middle;
}

.name-col {
  min-width: 150px;
  text-align: left;
}

.count-col,
.item-count {
  width: 60px;
  text-align: center;
  color: var(--color-blue);
}

.item-name {
  color: var(--text-main);
  font-weight: 500;
}

.item-description {
  font-size: 0.9em;
  color: var(--color-gray);
  margin-top: 4px;
  text-indent: 6px;
}

.lock {
  color: var(--color-red);
  font-size: 0.9em;
}

.item-row {
  &:nth-child(even) {
    background-color: rgba(30, 30, 30, 0.3);
  }

  &:hover {
    background-color: rgba(80, 80, 80, 0.35);
  }
}

.empty-text {
  text-align: center;
  padding: 20px;
  color: var(--color-gray);
  font-style: italic;
}
</style>