<template>
  <div>
    <BorderContainer title="个人属性">
      <div>攻击力: {{ player.battle?.attack }}</div>
      <div>防御力: {{ player.battle?.attack }}</div>
    </BorderContainer>

    <BorderContainer title="穿戴装备">
      <div class="equip-line-grid">
        <div v-for="slot in equipmentSlots" :key="slot.key" class="slot-item">
          <div class="slot-inner">
            <span class="s-label mr-4">{{ slot.label }}:</span>
            <span :class="['s-name', { 'is-empty': !equippedMap[slot.key] }]">
              {{ equippedMap[slot.key] ? equippedMap[slot.key].name : '--' }}
            </span>
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
              <th style="min-width: 150px">名称</th>
              <th style="width: 60px">数量</th>
              <!-- <th style="width: 50px">效果</th> -->
              <!-- <th style="width: 60px">操作</th> -->
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
              <!-- <td class="item-stats">
                <div v-if="item.stats">
                  <span v-if="item.stats.attack">攻击+{{ item.stats.attack }}</span>
                  <span v-if="item.stats.defense">防御+{{ item.stats.defense }}</span>
                  <span v-if="item.stats.hp">气血+{{ item.stats.hp }}</span>
                  <span v-if="item.stats.mp">灵力+{{ item.stats.mp }}</span>
                  <span v-if="item.stats.speed">速度+{{ item.stats.speed }}</span>
                  <span v-if="item.stats.crit">暴击+{{ item.stats.crit }}</span>
                </div>
                <div v-else>--</div>
              </td> -->
              <!-- <td class="item-actions">
                <div class="cmds">
                  <span
                    v-if="item.category === 'equipment'"
                    class="cmd-btn cyan mb-2"
                    @click="item.isEquipped ? handleUnequip(item) : equipItem(item.instanceId)"
                  >
                    {{ item.isEquipped ? '卸下' : '装备' }}
                  </span>
                  <span
                    v-if="!item.isEquipped && !item.isLocked"
                    class="cmd-btn red"
                    @click="showDropConfirm(item)"
                  >
                    丢弃
                  </span>
                </div>
              </td> -->
            </tr>
          </tbody>
        </table>
        <div v-if="filteredInventory.length === 0" class="empty-text">--- 纳戒空无一物 ---</div>
      </div>
    </BorderContainer>

    <!-- 丢弃确认弹窗 -->
    <div v-if="showDropDialog" class="modal-overlay" @click="closeDropDialog">
      <div class="modal-box" @click.stop>
        <div class="modal-header">! 确认丢弃 !</div>
        <div class="modal-body">确认将 [ {{ selectedItem?.name }} ] 丢弃？</div>
        <div class="modal-footer">
          <span class="modal-btn red" @click="confirmDrop">[ 确认 ]</span>
          <span class="modal-btn" @click="closeDropDialog">[ 取消 ]</span>
        </div>
      </div>
    </div>

    <!-- 装备详情弹窗 -->
    <div v-if="showDetailDialog" class="modal-overlay" @click="closeDetailDialog">
      <div class="modal-box detail-modal" @click.stop>
        <div class="modal-header">
          <span class="item-title">{{ selectedItem?.name }}</span>
          <span v-if="selectedItem?.isLocked" class="lock-tag">[锁]</span>
          <span v-if="selectedItem?.isEquipped" class="equipped-tag">[已装备]</span>
        </div>

        <div class="modal-body">
          <div class="item-basic-info">
            <div class="info-row">
              <span class="label">类别：</span>
              <span class="value">{{ getCategoryName(selectedItem?.category) }}</span>
            </div>
            <div class="info-row">
              <span class="label">描述：</span>
              <span class="value">{{ selectedItem?.description || '无' }}</span>
            </div>
            <div v-if="selectedItem?.level" class="info-row">
              <span class="label">等级：</span>
              <span class="value">{{ selectedItem.level }}</span>
            </div>
            <div class="info-row">
              <span class="label">数量：</span>
              <span class="value">x{{ selectedItem?.count }}</span>
            </div>
          </div>

          <div v-if="selectedItem?.stats" class="item-stats-section">
            <div class="section-title">属性加成</div>
            <div class="stats-grid">
              <div v-if="selectedItem.stats.attack" class="stat-item">
                <span class="stat-label">攻击</span>
                <span class="stat-value positive">+{{ selectedItem.stats.attack }}</span>
              </div>
              <div v-if="selectedItem.stats.defense" class="stat-item">
                <span class="stat-label">防御</span>
                <span class="stat-value positive">+{{ selectedItem.stats.defense }}</span>
              </div>
              <div v-if="selectedItem.stats.hp" class="stat-item">
                <span class="stat-label">气血</span>
                <span class="stat-value positive">+{{ selectedItem.stats.hp }}</span>
              </div>
              <div v-if="selectedItem.stats.mp" class="stat-item">
                <span class="stat-label">灵力</span>
                <span class="stat-value positive">+{{ selectedItem.stats.mp }}</span>
              </div>
              <div v-if="selectedItem.stats.speed" class="stat-item">
                <span class="stat-label">速度</span>
                <span class="stat-value positive">+{{ selectedItem.stats.speed }}</span>
              </div>
              <div v-if="selectedItem.stats.crit" class="stat-item">
                <span class="stat-label">暴击</span>
                <span class="stat-value positive">+{{ selectedItem.stats.crit }}</span>
              </div>
            </div>
          </div>

          <div v-if="selectedItem?.slot" class="item-slot-section">
            <div class="section-title">装备部位</div>
            <div class="slot-info">
              {{ getSlotName(selectedItem.slot) }}
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <div class="action-buttons">
            <span
              v-if="
                selectedItem?.category === 'equipment' &&
                !selectedItem?.isEquipped &&
                !selectedItem?.isLocked
              "
              class="modal-btn cyan"
              @click="equipItem(selectedItem.instanceId)"
            >
              [ 装备 ]
            </span>
            <span
              v-if="selectedItem?.isEquipped"
              class="modal-btn cyan"
              @click="handleUnequip(selectedItem)"
            >
              [ 卸下 ]
            </span>
            <span
              v-if="!selectedItem?.isEquipped && !selectedItem?.isLocked"
              class="modal-btn red"
              @click="showDropConfirm(selectedItem)"
            >
              [ 丢弃 ]
            </span>
            <span class="modal-btn" @click="closeDetailDialog">[ 关闭 ]</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
// 假设类型定义和物品数据在指定路径下存在
import type { IItemInstance } from '../interface/index';
import { items } from '../items/index';
import { usePlayerStore } from '../stores/player';
const playerStore = usePlayerStore();

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

// 丢弃功能相关状态
const showDropDialog = ref(false);
const selectedItem = ref<any>(null);

// 装备详情弹窗相关状态
const showDetailDialog = ref(false);

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
        category: '',
        //
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

// 装备相关方法
const equipItem = (instanceId: string) => {
  playerStore.equipItem(instanceId);
  closeDetailDialog(); // 装备后关闭详情弹窗
};

// 丢弃物品相关方法
const showDropConfirm = (item: any) => {
  if (item.isEquipped || item.isLocked) {
    return;
  }
  selectedItem.value = item;
  showDropDialog.value = true;
  closeDetailDialog(); // 关闭详情弹窗
};

const closeDropDialog = () => {
  showDropDialog.value = false;
  selectedItem.value = null;
};

const confirmDrop = () => {
  if (selectedItem.value && !selectedItem.value.isEquipped && !selectedItem.value.isLocked) {
    playerStore.dropItem(selectedItem.value.instanceId);
    closeDropDialog();
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
  closeDetailDialog(); // 卸下后关闭详情弹窗
};

// 装备详情弹窗相关方法
const showItemDetail = (item: any) => {
  selectedItem.value = item;
  showDetailDialog.value = true;
};

const closeDetailDialog = () => {
  showDetailDialog.value = false;
  selectedItem.value = null;
};

// 获取分类名称
const getCategoryName = (category: string) => {
  const categoryMap: Record<string, string> = {
    equipment: '装备',
    consumable: '丹药',
    material: '材料',
  };
  return categoryMap[category] || category;
};

// 获取装备部位名称
const getSlotName = (slot: string) => {
  const slotMap: Record<string, string> = {
    weapon: '武器',
    body: '上衣',
    shoulder: '头肩',
    belt: '腰带',
    leg: '下装',
    shoes: '鞋子',
  };
  return slotMap[slot] || slot;
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

      &:hover {
        background-color: rgba(80, 80, 80, 0.5);
        transform: scale(1.01);
        transition: all 0.2s ease;
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

// 弹窗样式
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-box {
  background-color: rgba(20, 20, 20, 0.95);
  border: 2px solid var(--color-border);
  border-radius: 8px;
  min-width: 300px;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);

  &.detail-modal {
    min-width: 400px;
    max-width: 600px;
  }
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
  background-color: rgba(50, 50, 50, 0.7);
  display: flex;
  align-items: center;
  gap: 12px;

  .item-title {
    font-size: 1.2em;
    font-weight: bold;
    color: var(--color-yellow);
  }

  .lock-tag {
    color: var(--color-red);
    font-size: 0.9em;
  }

  .equipped-tag {
    color: var(--color-green);
    font-size: 0.9em;
  }
}

.modal-body {
  padding: 20px;
  color: var(--color-text);

  .item-basic-info {
    margin-bottom: 20px;

    .info-row {
      display: flex;
      margin-bottom: 12px;

      .label {
        width: 60px;
        color: var(--color-gray);
        flex-shrink: 0;
      }

      .value {
        flex: 1;
        color: var(--color-text);
      }
    }
  }

  .item-stats-section {
    margin-bottom: 20px;

    .section-title {
      font-weight: bold;
      color: var(--color-cyan);
      margin-bottom: 12px;
      padding-bottom: 4px;
      border-bottom: 1px solid rgba(64, 224, 208, 0.3);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 12px;

      .stat-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 12px;
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.1);

        .stat-label {
          color: var(--color-gray);
        }

        .stat-value {
          &.positive {
            color: var(--color-green);
            font-weight: bold;
          }
        }
      }
    }
  }

  .item-slot-section {
    .section-title {
      font-weight: bold;
      color: var(--color-purple);
      margin-bottom: 12px;
      padding-bottom: 4px;
      border-bottom: 1px solid rgba(128, 0, 128, 0.3);
    }

    .slot-info {
      padding: 12px;
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--color-text);
      text-align: center;
    }
  }
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--color-border);
  background-color: rgba(30, 30, 30, 0.5);
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  .action-buttons {
    display: flex;
    gap: 12px;
  }
}

.modal-btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  border: 1px solid var(--color-border);
  background-color: rgba(60, 60, 60, 0.5);
  color: var(--color-text);

  &:hover {
    background-color: rgba(80, 80, 80, 0.7);
    transform: translateY(-1px);
  }

  &.cyan {
    background-color: rgba(0, 200, 200, 0.2);
    color: var(--color-cyan);
    border-color: var(--color-cyan);

    &:hover {
      background-color: rgba(0, 200, 200, 0.4);
    }
  }

  &.red {
    background-color: rgba(255, 80, 80, 0.2);
    color: var(--color-red);
    border-color: var(--color-red);

    &:hover {
      background-color: rgba(255, 80, 80, 0.4);
    }
  }
}
</style>
