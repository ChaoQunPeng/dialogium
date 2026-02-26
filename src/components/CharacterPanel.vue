<template>
  <div>
    <BorderContainer title="个人属性">
      <div>攻击力: {{ player.battle?.attack }}</div>
      <div>防御力: {{ player.battle?.defense }}</div>
    </BorderContainer>

    <BorderContainer title="穿戴装备">
      <div class="equip-line-grid">
        <div v-for="slot in equipmentSlots" :key="slot.key" class="slot-item">
          <div class="slot-inner">
            <span class="s-label mr-4">{{ slot.label }}:</span>
            <EquipmentItem :equipment="equippedMap[slot.key]!"> </EquipmentItem>
          </div>
        </div>
      </div>
    </BorderContainer>

    <BorderContainer :title="`储物纳戒 (${filteredInventory.length})`">
      <div class="tab-row">
        <div
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab-link', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          {{ activeTab === tab.key ? `[${tab.name}]` : tab.name }}
        </div>
      </div>

      <div class="inventory-table">
        <table>
          <thead>
            <tr>
              <th style="min-width: 150px; text-align: left">名称</th>
              <th style="width: 60px">数量</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredInventory" :key="index" class="item-row">
              <td class="item-name">
                <div>
                  <EquipmentItem :equipment="item">
                    <template #default="{ item }">
                      <span>【{{ item.name }}】</span>
                    </template>
                  </EquipmentItem>

                  <span v-if="item.isLocked" class="lock">[锁]</span>
                  <div class="item-description">{{ item.description || '--' }}</div>
                </div>
              </td>
              <td class="item-count">x{{ item.count }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="filteredInventory.length === 0" class="empty-text">--- 纳戒空无一物 ---</div>
      </div>
    </BorderContainer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { IItemInstance } from '../interface/index';
import type { IInventoryItem } from '../interface/item';
import { items } from '../items/index';
import EquipmentItem from './EquipmentItem.vue';
import { usePlayerStore } from '../stores/player';
const playerStore = usePlayerStore();

const player = computed(() => {
  return playerStore.player;
});

// 纳戒数据与分类逻辑
const activeTab = ref('equipment');
const tabs = [
  // { name: '全部', key: 'all' },
  { name: '装备', key: 'equipment' },
  { name: '丹药', key: 'consumable' },
  { name: '材料', key: 'material' },
];

// 定义固定的五个部位及其展示名称
const equipmentSlots = [
  { key: 'weapon', label: '武器' },
  { key: 'body', label: '上衣' },
  { key: 'shoulder', label: '头肩' },
  { key: 'belt', label: '腰带' },
  { key: 'leg', label: '下装' },
  { key: 'shoes', label: '鞋子' },
];

// 计算当前已穿戴的装备映射表
const equippedMap = computed<Record<string, IInventoryItem>>(() => {
  const map: Record<string, IInventoryItem> = {};
  inventory.value.forEach((item) => {
    if (item.isEquipped && item.slot) {
      map[item.slot] = item;
    }
  });
  return map;
});

// 将物品实例转换为展示格式
const inventory = computed<IInventoryItem[]>(() => {
  return playerStore.inventory
    .map((itemInstance: IItemInstance) => {
      // 根据 itemId 查找物品配置
      const itemConfig = items[itemInstance.itemId];

      if (!itemConfig) {
        // 如果找不到配置，使用默认值
        return {
          id: itemInstance.itemId,
          name: '未知物品',
          category: 'unknown',
          description: '未知物品',
          slot: 'none',
          level: 1,
          price: 0,
          stackable: false,
          stats: {},
          grade: 'Normal',
          count: itemInstance.count,
          isLocked: itemInstance.isLocked,
          isEquipped: itemInstance.isEquipped,
          instanceId: 'unknown',
        } as IInventoryItem;
      }

      return {
        id: itemConfig.id,
        name: itemConfig.name,
        category: itemConfig.category,
        description: itemConfig.description,
        slot: itemConfig.slot,
        level: itemConfig.level,
        price: itemConfig.price,
        stackable: itemConfig.stackable,
        stats: itemConfig.stats,
        grade: itemConfig.grade,
        // 用户数据
        count: itemInstance.count,
        isLocked: itemInstance.isLocked,
        isEquipped: itemInstance.isEquipped,
        instanceId: itemInstance.instanceId,
      };
    })
    .filter((item): item is IInventoryItem => item !== undefined);
});

// // 装备收藏 - 从库存中筛选装备并转换为IItem格式
// const equipmentCollection = computed(() => {
//   return inventory.value
//     .filter((item) => item.category === 'equipment')
//     .map((item) => ({
//       id: item.id,
//       name: item.name,
//       category: item.category as IItem['category'],
//       description: item.description || '',
//       slot: item.slot,
//       level: item.level || 1,
//       price: item.price || 0,
//       stackable: item.stackable || false,
//       stats: item.stats,
//     }))
//     .slice(0, 12); // 限制显示数量
// });

// 核心：分类过滤逻辑 - 优化堆叠物品展示
const filteredInventory = computed(() => {
  let itemsToFilter = inventory.value;

  // 如果不是显示全部，则先按分类过滤
  if (activeTab.value !== 'all') {
    itemsToFilter = itemsToFilter
      .filter((item) => !item.isEquipped)
      .filter((item: (typeof inventory.value)[number]) => item.category === activeTab.value);
  }

  // 合并可堆叠的相同物品
  const mergedItems: Record<string, (typeof inventory.value)[number]> = {};

  itemsToFilter.forEach((item) => {
    // 对于可堆叠物品，按itemId合并
    if (item.stackable) {
      const key = `${item.id}-${item.isEquipped ? 'equipped' : 'unequipped'}`;
      if (mergedItems[key]) {
        // 合并数量
        mergedItems[key].count += item.count;
      } else {
        // 创建新的合并项
        mergedItems[key] = { ...item };
      }
    } else {
      // 不可堆叠物品直接添加
      const key = `${item.instanceId}-${item.isEquipped ? 'equipped' : 'unequipped'}`;
      mergedItems[key] = { ...item };
    }
  });

  // 转换为数组并排序
  return Object.values(mergedItems).sort((a, b) => {
    // 装备的排在前面
    if (a.isEquipped && !b.isEquipped) return -1;
    if (!a.isEquipped && b.isEquipped) return 1;
    // 然后按名称排序
    return a.name.localeCompare(b.name);
  });
});

// 组件挂载时加载数据
onMounted(() => {});
</script>

<style lang="scss" scoped>
.tab-row {
  display: flex;

  .tab-link {
    margin-right: 8px;
    cursor: pointer;

    &.active {
      color: var(--color-yellow);
    }
  }
}

.inventory-table {
  margin-top: 12px;

  table {
    width: 100%;
    border-collapse: collapse;
    background-color: rgba(0, 0, 0, 0.3);
    border: 1px solid var(--color-border);

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

      &.item-name {
        color: var(--color-text);
        font-weight: 500;

        .lock {
          color: var(--color-red);
          font-size: 0.9em;
        }

        .equipped {
          color: var(--color-green);
          font-size: 0.9em;
        }
      }

      .item-description {
        font-size: 0.9em;
        color: var(--color-gray);
        margin-top: 4px;
        text-indent: 6px;
      }

      &.item-count {
        text-align: center;
        color: var(--color-blue);
      }

      &.item-stats {
        font-size: 0.9em;
        color: var(--color-cyan);

        div {
          display: flex;
          flex-direction: column;
          gap: 2px;

          span {
            white-space: nowrap;
          }
        }
      }

      &.item-level {
        text-align: center;
        color: var(--color-purple);
        font-weight: 500;
      }

      &.item-actions {
        text-align: center;

        .cmds {
          display: flex;
          justify-content: center;
          gap: 4px;
          flex-direction: column;

          .cmd-btn {
            padding: 2px 6px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 0.9em;
            transition: all 0.2s;

            &.cyan {
              background-color: rgba(0, 200, 200, 0.2);
              color: var(--color-cyan);
              border: 1px solid var(--color-cyan);

              &:hover {
                background-color: rgba(0, 200, 200, 0.4);
              }
            }

            &.red {
              background-color: rgba(255, 80, 80, 0.2);
              color: var(--color-red);
              border: 1px solid var(--color-red);

              &:hover {
                background-color: rgba(255, 80, 80, 0.4);
              }
            }
          }
        }
      }
    }

    .item-row {
      cursor: pointer;

      &:nth-child(even) {
        background-color: rgba(30, 30, 30, 0.3);
      }

      &:active,
      &:hover {
        background-color: rgba(80, 80, 80, 0.5);
      }
    }

    tr:not(.item-row):nth-child(even) {
      background-color: rgba(30, 30, 30, 0.3);
    }

    tr:not(.item-row):hover {
      background-color: rgba(80, 80, 80, 0.3);
    }
  }

  .empty-text {
    text-align: center;
    padding: 20px;
    color: var(--color-gray);
    font-style: italic;
  }
}

.equipment-collection {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
  padding: 8px;

  .equipment-item-wrapper {
    display: flex;
    justify-content: center;
  }

  .empty-collection {
    grid-column: 1 / -1;
    text-align: center;
    color: var(--text-muted, #a0a0a0);
    padding: 20px;
  }
}

.slot-inner {
  display: flex;
  align-items: center;
  min-height: 24px;

  .s-label {
    color: var(--text-label, #a0a0a0);
    font-size: 0.95em;
  }

  .s-name {
    color: var(--color-green);
    font-weight: 500;
    font-size: 0.95em;

    &.is-empty {
      color: var(--text-muted, #666);
      font-style: italic;
    }
  }
}

.equipment-display-example {
  margin-top: 20px;
  padding: 16px;
  background: rgba(30, 30, 30, 0.6);
  border-radius: 8px;

  .section-title {
    color: var(--text-main, #d4d4d4);
    margin-bottom: 12px;
    font-size: 1.1em;
  }

  .equipment-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
  }
}
</style>
