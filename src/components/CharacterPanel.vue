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
            <EquipmentItem
              :equipment="equippedMap[slot.key]"
              @show-detail="handleEquipmentDetail"
            />
          </div>
        </div>
      </div>
    </BorderContainer>

    <!-- 装备收藏 -->
    <BorderContainer title="装备收藏">
      <div class="equipment-collection">
        <div v-for="item in equipmentCollection" :key="item.id" class="equipment-item-wrapper">
          <EquipmentItem :equipment="item" @show-detail="handleEquipmentDetail" />
        </div>
        <div v-if="equipmentCollection.length === 0" class="empty-collection">暂无收藏装备</div>
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
            <tr
              v-for="(item, index) in filteredInventory"
              :key="index"
              class="item-row"
              @click="showItemDetail(item)"
            >
              <td class="item-name">
                <div class="text-green">
                  【{{ item.name }}】 <span v-if="item.isLocked" class="lock">[锁]</span>
                </div>
                <div class="item-description">{{ item.description || '--' }}</div>
                <span v-if="item.isEquipped" class="equipped">[已装备]</span>
              </td>
              <td class="item-count">x{{ item.count }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="filteredInventory.length === 0" class="empty-text">--- 纳戒空无一物 ---</div>
      </div>
    </BorderContainer>

    <!-- 装备详情弹窗 -->
    <ItemDetailModal
      ref="itemDetailModalRef"
      @equip="handleEquipFromModal"
      @unequip="handleUnequipFromModal"
      @drop="handleDropFromModal"
    />

    <!-- 丢弃确认弹窗 -->
    <DropConfirmModal ref="dropConfirmModalRef" @confirm="confirmDrop" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { IItemInstance } from '../interface/index';
import type { IItemConfig } from '../items/interface';
import { items } from '../items/index';
import EquipmentItem from './EquipmentItem.vue';
import { usePlayerStore } from '../stores/player';
import ItemDetailModal from './ItemDetailModal.vue';
import DropConfirmModal from './DropConfirmModal.vue';

const playerStore = usePlayerStore();

// 弹窗组件引用
const itemDetailModalRef = ref<InstanceType<typeof ItemDetailModal> | null>(null);
const dropConfirmModalRef = ref<InstanceType<typeof DropConfirmModal> | null>(null);

const player = computed(() => {
  return playerStore.player;
});

// 纳戒数据与分类逻辑
const activeTab = ref('all');
const tabs = [
  { name: '全部', key: 'all' },
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
const equippedMap = computed(() => {
  const map: Record<string, any> = {};
  inventory.value.forEach((item) => {
    if (item.isEquipped && item.slot) {
      map[item.slot] = item;
    }
  });
  return map;
});

// 装备收藏 - 从库存中筛选装备并转换为IItemConfig格式
const equipmentCollection = computed(() => {
  return inventory.value
    .filter((item) => item.category === 'equipment')
    .map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category as IItemConfig['category'],
      description: item.description || '',
      slot: item.slot,
      level: item.level || 1,
      price: item.price || 0,
      stackable: item.stackable || false,
      stats: item.stats,
    }))
    .slice(0, 12); // 限制显示数量
});

// 将物品实例转换为展示格式
const inventory = computed(() => {
  return playerStore.inventory.map((itemInstance: IItemInstance) => {
    // 根据 itemId 查找物品配置
    const itemConfig = items[itemInstance.itemId];

    if (!itemConfig) {
      // 如果找不到配置，使用默认值
      return {
        id: crypto.randomUUID(),
        name: '未知物品',
        category: 'material',
        count: itemInstance.count,
        isLocked: itemInstance.isLocked,
        isEquipped: itemInstance.isEquipped,
        instanceId: itemInstance.instanceId,
      };
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
      // 用户数据
      count: itemInstance.count,
      isLocked: itemInstance.isLocked,
      isEquipped: itemInstance.isEquipped,
      instanceId: itemInstance.instanceId,
    };
  });
});

// 核心：分类过滤逻辑
const filteredInventory = computed(() => {
  if (activeTab.value === 'all') return inventory.value;
  return inventory.value.filter(
    (item: (typeof inventory.value)[number]) => item.category === activeTab.value,
  );
});

// 装备详情处理方法
const handleEquipmentDetail = (equipment: IItemConfig) => {
  itemDetailModalRef.value?.show(equipment);
};

// 装备相关方法
const equipItem = (instanceId: string) => {
  playerStore.equipItem(instanceId);
};

// 丢弃物品相关方法
const showDropConfirm = (item: any) => {
  if (item.isEquipped || item.isLocked) {
    return;
  }
  dropConfirmModalRef.value?.show(item);
};

const confirmDrop = (item: any) => {
  if (item && !item.isEquipped && !item.isLocked) {
    playerStore.dropItem(item.instanceId);
  }
};

/**
 * 处理脱下点击
 * @param item 装备实例
 */
const handleUnequip = (item: any) => {
  if (!item) return; // 没装备时不操作

  // 可以在这里加个简单的提示，或者直接脱下
  playerStore.unequipItem(item.instanceId);
  console.log(`脱下了：${item.name}`);
};

// 装备详情弹窗相关方法
const showItemDetail = (item: any) => {
  itemDetailModalRef.value?.show(item);
};

// 从弹窗触发的操作
const handleEquipFromModal = (instanceId: string) => {
  equipItem(instanceId);
};

const handleUnequipFromModal = (item: any) => {
  handleUnequip(item);
};

const handleDropFromModal = (item: any) => {
  showDropConfirm(item);
};

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
