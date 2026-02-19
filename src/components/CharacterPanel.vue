<template>
  <div class="realm-dashboard mud-core">
    <!-- 切换按钮 -->
    <div class="panel-toggle">
      <button :class="{ active: currentPanel === 'character' }" @click="currentPanel = 'character'">
        角色面板
      </button>
      <button :class="{ active: currentPanel === 'codex' }" @click="currentPanel = 'codex'">
        物品图鉴
      </button>
    </div>

    <!-- 角色面板 -->
    <div v-show="currentPanel === 'character'">
      <header class="mud-section">
        <div class="char-title">===[ {{ player.name }} ]===</div>
        <div class="char-subtitle">境界：{{ player.baseInfo.cultivation?.realm }}</div>
      </header>

      <section class="status-bars">
        <div class="bar-item">
          <div class="bar-label">
            <span>气血</span>
            <span class="val-text">{{ player.baseInfo.hp }}/{{ player.baseInfo.maxHp }}</span>
          </div>
          <div class="bar-track">
            <div
              :class="['bar-fill', 'hp']"
              :style="{ width: (player.baseInfo.hp / player.baseInfo.maxHp) * 100 + '%' }"
            ></div>
          </div>
        </div>

        <div v-if="player.baseInfo.maxMp > 0" class="bar-item">
          <div class="bar-label">
            <span>灵力</span>
            <span class="val-text">{{ player.baseInfo.mp }}/{{ player.baseInfo.maxMp }}</span>
          </div>
          <div class="bar-track">
            <div
              :class="['bar-fill', 'mp']"
              :style="{ width: (player.baseInfo.mp / player.baseInfo.maxMp) * 100 + '%' }"
            ></div>
          </div>
        </div>
      </section>

      <section class="mud-section">
        <div class="mud-sub-title">【 个人属性 】</div>
        <div class="attr-grid-text">
          <!-- <div v-for="(val, key) in detailStats" :key="key" class="attr-row">
            <span class="label">{{ key }}：</span>
            <span class="val">{{ val }}</span>
          </div> -->

          <div class="attr-row">
            <span class="label">攻击：</span>
            <span class="val">{{ player.battle?.attack }}</span>
          </div>

          <div class="attr-row">
            <span class="label">防御：</span>
            <span class="val">{{ player.battle?.attack }}</span>
          </div>
        </div>
      </section>

      <section class="mud-section">
        <div class="mud-sub-title">【 已穿戴法宝 】</div>
        <ul class="equip-grid">
          <li
            v-for="slot in equipmentSlots"
            :key="slot.key"
            class="equip-box"
            :class="{ 'has-item': equippedMap[slot.key] }"
            @click="handleUnequip(equippedMap[slot.key])"
          >
            <span class="slot-label">{{ slot.label }}</span>
            <div class="slot-content">
              <span v-if="equippedMap[slot.key]" class="name">
                {{ equippedMap[slot.key].name }}
              </span>
              <span v-else class="empty">-- 待装 --</span>
            </div>
          </li>
        </ul>
      </section>

      <section class="mud-section">
        <div class="mud-sub-title">【 储物纳戒 】 ({{ filteredInventory.length }}/50)</div>

        <div class="mud-tabs">
          <span
            v-for="tab in tabs"
            :key="tab.key"
            :class="['tab-item', { active: activeTab === tab.key }]"
            @click="activeTab = tab.key"
          >
            {{ activeTab === tab.key ? `[${tab.name}]` : tab.name }}
          </span>
        </div>

        <div class="inventory-text-list">
          <div class="list-header">序号 名称 数量 操作</div>
          <div class="list-divider">................................</div>

          <div v-for="(item, index) in filteredInventory" :key="index" class="inventory-row">
            <span class="item-idx">[{{ (index + 1).toString().padStart(2, '0') }}]</span>
            <span class="item-name">{{ item.name.padEnd(16, ' ') }}</span>
            <span class="item-count">x{{ item.count }}</span>
            <span v-if="item.isLocked" class="item-tag">锁</span>
            <span
              v-if="!item.isEquipped && item.category === 'equipment'"
              class="equip-btn"
              @click="equipItem(item.instanceId)"
            >
              [装备]
            </span>
            <span
              v-if="!item.isEquipped && !item.isLocked && item.category !== 'equipment'"
              class="drop-btn"
              @click="showDropConfirm(item)"
            >
              [丢弃]
            </span>
            <span v-else-if="item.isEquipped" class="disabled-btn">[已装备]</span>
            <span v-else-if="item.isLocked" class="disabled-btn">[已锁定]</span>
          </div>

          <div v-if="filteredInventory.length === 0" class="empty-hint">此分类下空空如也。</div>
          <div class="list-footer">................................</div>
        </div>
      </section>
    </div>

    <!-- 物品图鉴面板 -->
    <div v-show="currentPanel === 'codex'">
      <ItemCodex />
    </div>

    <!-- 丢弃确认弹窗 -->
    <div v-if="showDropDialog" class="drop-dialog-overlay" @click="closeDropDialog">
      <div class="drop-dialog" @click.stop>
        <div class="dialog-header">
          <div class="dialog-title">确认丢弃</div>
          <button class="close-btn" @click="closeDropDialog">×</button>
        </div>
        <div class="dialog-content">
          <p>确定要丢弃以下物品吗？</p>
          <div class="item-preview">
            <span class="preview-name">{{ selectedItem?.name }}</span>
            <span class="preview-count">x{{ selectedItem?.count }}</span>
          </div>
          <div class="warning-text" v-if="selectedItem?.isLocked">⚠️ 此物品已被锁定，无法丢弃</div>
        </div>
        <div class="dialog-actions">
          <button
            class="confirm-btn"
            :disabled="selectedItem?.isLocked || selectedItem?.isEquipped"
            @click="confirmDrop"
          >
            确认丢弃
          </button>
          <button class="cancel-btn" @click="closeDropDialog">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue';
// 假设类型定义和物品数据在指定路径下存在
import type { IItemInstance } from '../interface/index';
import { items } from '../items/index';
import ItemCodex from './ItemCodex.vue';
import { usePlayerStore } from '../stores/player';
const playerStore = usePlayerStore();

// 面板切换状态
const currentPanel = ref<'character' | 'codex'>('character');

const player = computed(() => {
  return playerStore.player;
});

const detailStats = computed(() => {
  // 转换成对象数组
  return Object.entries(playerStore.player.battle!).map(([key, val]) => {
    return {
      key,
      val,
    };
  });
});

console.log(detailStats);

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

// 定义固定的五个部位及其展示名称
const equipmentSlots = [
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
};

// 丢弃物品相关方法
const showDropConfirm = (item: any) => {
  if (item.isEquipped || item.isLocked) {
    return;
  }
  selectedItem.value = item;
  showDropDialog.value = true;
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
};

// 组件挂载时加载数据
onMounted(() => {});
</script>

<style lang="scss" scoped>
.mud-core {
  padding: 20px;
  background-color: #000;
  color: #bbb;
  font-family: 'Courier New', Courier, monospace;
  line-height: 1.5;

  // 面板切换按钮样式
  .panel-toggle {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;

    button {
      flex: 1;
      padding: 8px 16px;
      background: #222;
      border: 1px solid #444;
      color: #bbb;
      cursor: pointer;
      font-family: inherit;
      font-size: 0.9rem;
      transition: all 0.2s;

      &:hover {
        background: #333;
        border-color: #666;
      }

      &.active {
        background: #d4af37;
        color: #000;
        border-color: #d4af37;
        font-weight: bold;
      }
    }
  }

  .mud-section {
    margin-bottom: 15px;
  }
  .char-title {
    color: #d4af37;
    font-weight: bold;
    font-size: 1.1rem;
  }
  .mud-sub-title {
    color: #d4af37;
    margin-bottom: 8px;
    font-size: 0.9rem;
  }

  /* 状态条 */
  .status-bars {
    .bar-item {
      margin-bottom: 12px;
      .bar-label {
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
        margin-bottom: 4px;
        color: #888;
        .val-text {
          color: #00ffff;
          font-family: monospace;
        }
      }
      .bar-track {
        height: 6px;
        background: #111;
        border-radius: 3px;
        overflow: hidden;
        border: 1px solid #222;
        .bar-fill {
          height: 100%;
          transition: width 0.6s ease;
          &.hp {
            background: linear-gradient(90deg, #820000, #ff4d4d);
            box-shadow: 0 0 5px #820000;
          }
          &.mp {
            background: linear-gradient(90deg, #004e92, #00d2ff);
            box-shadow: 0 0 5px #004e92;
          }
        }
      }
    }
  }

  /* 属性与装备 */
  .attr-grid-text,
  .equip-list-text {
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-size: 0.85rem;
    .label {
      color: #dddddd;
    }
    .val {
      color: #ddd;
    }
    .idx {
      color: #ddd;
    }
    .name {
      color: #00ffff;
    }
    .empty {
      color: #ddd;
    }
  }

  /* 纳戒分类 Tab 样式 */
  .mud-tabs {
    display: flex;
    gap: 15px;
    margin-bottom: 10px;
    font-size: 0.85rem;
    border-bottom: 1px solid #222;
    padding-bottom: 5px;

    .tab-item {
      cursor: pointer;
      color: #dddddd;
      transition: color 0.2s;

      &:hover {
        color: #bbb;
      }
      &.active {
        color: #d4af37;
        font-weight: bold;
      }
    }
  }

  /* 纳戒列表 */
  .inventory-text-list {
    font-size: 0.85rem;
    .list-header {
      color: #dddddd;
      white-space: pre;
    }
    .list-divider,
    .list-footer {
      color: #ddd;
      margin: 4px 0;
    }
    .inventory-row {
      display: flex;
      gap: 10px;
      align-items: center;
      .item-idx {
        color: #ddd;
      }
      .item-name {
        color: #bbb;
        white-space: pre;
      }
      .item-count {
        color: #d4af37;
      }
      .item-tag {
        font-size: 0.7rem;
        color: #820000;
        border: 1px solid #820000;
        padding: 0 2px;
        line-height: 1;
      }

      // 装备按钮样式
      .equip-btn {
        color: #00ff00;
        cursor: pointer;
        font-size: 0.8rem;
        padding: 2px 6px;
        border: 1px solid #00ff00;
        border-radius: 3px;
        transition: all 0.2s;

        &:hover {
          background: #00ff00;
          color: #000;
        }
      }

      // 丢弃按钮样式
      .drop-btn {
        color: #ff4d4d;
        cursor: pointer;
        font-size: 0.8rem;
        padding: 2px 6px;
        border: 1px solid #ff4d4d;
        border-radius: 3px;
        transition: all 0.2s;

        &:hover {
          background: #ff4d4d;
          color: #000;
        }
      }

      .disabled-btn {
        color: #666;
        font-size: 0.8rem;
        padding: 2px 6px;
        border: 1px solid #666;
        border-radius: 3px;
        cursor: not-allowed;
      }
    }
    .empty-hint {
      color: #ddd;
      padding: 10px 0;
      font-style: italic;
    }
  }

  /* 丢弃确认弹窗样式 */
  .drop-dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .drop-dialog {
    background: #111;
    border: 2px solid #d4af37;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    padding: 20px;
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #333;

      .dialog-title {
        color: #d4af37;
        font-size: 1.2rem;
        font-weight: bold;
      }

      .close-btn {
        background: none;
        border: none;
        color: #ddd;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          color: #ff4d4d;
        }
      }
    }

    .dialog-content {
      margin-bottom: 20px;

      p {
        color: #ddd;
        margin-bottom: 15px;
        line-height: 1.6;
      }

      .item-preview {
        background: #222;
        padding: 12px;
        border-radius: 4px;
        margin-bottom: 10px;
        border: 1px solid #333;

        .preview-name {
          color: #00ffff;
          font-weight: bold;
          margin-right: 10px;
        }

        .preview-count {
          color: #d4af37;
          font-weight: bold;
        }
      }

      .warning-text {
        color: #ff9900;
        font-size: 0.9rem;
        padding: 8px;
        background: rgba(255, 153, 0, 0.1);
        border: 1px solid #ff9900;
        border-radius: 4px;
      }
    }

    .dialog-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;

      button {
        padding: 8px 20px;
        border: none;
        border-radius: 4px;
        font-family: inherit;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s;

        &.confirm-btn {
          background: #820000;
          color: #fff;

          &:hover:not(:disabled) {
            background: #ff4d4d;
          }

          &:disabled {
            background: #444;
            color: #888;
            cursor: not-allowed;
          }
        }

        &.cancel-btn {
          background: #333;
          color: #ddd;

          &:hover {
            background: #444;
          }
        }
      }
    }
  }
}

.mud-section {
  padding: 12px;
  background: #1a1a1a;
  border: 1px solid #333;
}

.mud-sub-title {
  color: #d9a300;
  font-size: 14px;
  margin-bottom: 12px;
  text-align: center;
}

.equip-grid {
  display: flex;
  justify-content: space-between; /* 横向平铺五个 */
  gap: 8px;
  list-style: none;
  padding: 0;
}

.equip-box {
  flex: 1;
  aspect-ratio: 1 / 1; /* 保持正方形格子感 */
  border: 1px solid #444;
  background: #262626;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  padding: 4px;
  text-align: center;
}

.slot-label {
  color: #888;
  font-size: 10px;
  margin-bottom: 4px;
  border-bottom: 1px solid #333;
  width: 100%;
}

.name {
  color: #a586ff; /* 稀有装备的紫色感 */
  word-break: break-all;
  line-height: 1.2;
}

.empty {
  color: #444;
}
</style>
