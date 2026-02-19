<template>
  <div class="realm-dashboard mud-core">
    <div class="panel-toggle">
      <div
        :class="['toggle-btn', { active: currentPanel === 'character' }]"
        @click="currentPanel = 'character'"
      >
        [ 角色面板 ]
      </div>
      <div
        :class="['toggle-btn', { active: currentPanel === 'codex' }]"
        @click="currentPanel = 'codex'"
      >
        [ 物品图鉴 ]
      </div>
    </div>

    <div v-show="currentPanel === 'character'" class="mud-border-container">
      <header class="section-box">
        <div class="title-line">
          <span class="corner">+</span><span class="line"></span><span class="corner">+</span>
        </div>
        <div class="title-content">
          <div class="char-name">{{ player.name }}</div>
          <div class="char-realm">境界：{{ playerStore.realmData.zh }}</div>
        </div>
      </header>

      <section class="section-box">
        <div class="status-bars">
          <div class="bar-row">
            <span class="bar-label">气血</span>
            <div class="bar-frame">
              <div
                class="bar-fill hp"
                :style="{ width: (player.baseInfo.hp / player.baseInfo.maxHp) * 100 + '%' }"
              ></div>
            </div>
            <span class="bar-val">{{ player.baseInfo.hp }}</span>
          </div>
          <div class="bar-row" v-if="player.baseInfo.maxMp > 0">
            <span class="bar-label">灵力</span>
            <div class="bar-frame">
              <div
                class="bar-fill mp"
                :style="{ width: (player.baseInfo.mp / player.baseInfo.maxMp) * 100 + '%' }"
              ></div>
            </div>
            <span class="bar-val">{{ player.baseInfo.mp }}</span>
          </div>
        </div>
      </section>

      <section class="section-box no-border">
        <div class="sub-header">| 个人属性 |</div>
        <div class="attr-text">
          <span>攻击力: {{ player.battle?.attack }}</span>
          <span>防御力: {{ player.battle?.attack }}</span>
        </div>
      </section>

      <section class="section-box">
        <div class="sub-header">| 已穿戴法宝 |</div>
        <div class="equip-line-grid">
          <div v-for="slot in equipmentSlots" :key="slot.key" class="slot-item">
            <div class="slot-inner">
              <span class="s-label">{{ slot.label }}:</span>
              <span :class="['s-name', { 'is-empty': !equippedMap[slot.key] }]">
                {{ equippedMap[slot.key] ? equippedMap[slot.key].name : '空' }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section class="section-box inventory-box">
        <div class="sub-header">| 储物纳戒 ({{ filteredInventory.length }}/50) |</div>

        <div class="tab-row">
          <span
            v-for="tab in tabs"
            :key="tab.key"
            :class="['tab-link', { active: activeTab === tab.key }]"
            @click="activeTab = tab.key"
          >
            {{ tab.name }}
          </span>
        </div>

        <div class="text-list">
          <div class="list-head">序号. 名称 数量 指令</div>
          <div class="dot-line">----------------------------------------</div>
          <div v-for="(item, index) in filteredInventory" :key="index" class="list-row">
            <span class="idx">{{ (index + 1).toString().padStart(2, '0') }}.</span>
            <span class="name"
              >{{ item.name }} <span v-if="item.isLocked" class="lock">[锁]</span></span
            >
            <span class="cnt">x{{ item.count }}</span>
            <div class="cmds">
              <span
                v-if="item.category === 'equipment'"
                class="cmd-btn cyan"
                @click="item.isEquipped ? handleUnequip(item) : equipItem(item.instanceId)"
              >
                {{ item.isEquipped ? '卸' : '穿' }}
              </span>
              <span
                v-if="!item.isEquipped && !item.isLocked"
                class="cmd-btn red"
                @click="showDropConfirm(item)"
                >弃</span
              >
            </div>
          </div>
          <div v-if="filteredInventory.length === 0" class="empty-text">--- 纳戒空无一物 ---</div>
        </div>
      </section>
    </div>

    <div v-show="currentPanel === 'codex'">
      <ItemCodex />
    </div>

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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
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

// 是否是特殊装备
const isSpecialEquipment = (itemId: string) => {
  return ['zi_yan_xin'].includes(itemId);
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
  --color-yellow: #d4af37;
  --color-green: #4dbd74;
  --color-red: #ff4d4d;
  --color-cyan: #40e0d0;
  --text-main: #d4d4d4;

  padding: 15px;
  background-color: #121212; /* 背景保持纯净 */
  color: var(--text-main);
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
}

/* 顶部切换按钮 */
.panel-toggle {
  display: flex;
  margin-bottom: 20px;
  .toggle-btn {
    padding: 5px 15px;
    cursor: pointer;
    color: #666;
    &.active {
      color: var(--color-yellow);
    }
  }
}

/* 盒子基类：仅边框 */
.section-box {
  border: 1px solid #333;
  padding: 12px;
  margin-bottom: 15px;
  position: relative;
  &.no-border {
    border: none;
    padding-left: 0;
    padding-right: 0;
  }
}

.sub-header {
  color: var(--color-yellow);
  margin-bottom: 10px;
  font-weight: bold;
}

/* 头部样式 */
.char-name {
  font-size: 1.2rem;
  color: var(--color-yellow);
  text-align: center;
}
.char-realm {
  text-align: center;
  color: #888;
  font-size: 0.9rem;
}

/* 状态条样式：线框化 */
.bar-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  .bar-label {
    width: 40px;
    color: #888;
  }
  .bar-frame {
    flex: 1;
    height: 6px;
    border: 1px solid #333;
    padding: 1px;
    .bar-fill {
      height: 100%;
      &.hp {
        background: var(--color-red);
      }
      &.mp {
        background: var(--color-cyan);
      }
    }
  }
  .bar-val {
    width: 60px;
    text-align: right;
    font-size: 12px;
    color: #aaa;
  }
}

/* 属性 */
.attr-text {
  display: flex;
  gap: 30px;
  color: #aaa;
}

/* 装备田字格：线框对齐 */
.equip-line-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
  .slot-inner {
    border-bottom: 1px dashed #222;
    padding: 4px 0;
    display: flex;
    justify-content: space-between;
    .s-label {
      color: #555;
    }
    .s-name {
      color: var(--color-cyan);
    }
    .is-empty {
      color: #333;
    }
  }
}

/* 纳戒列表 */
.tab-row {
  margin-bottom: 10px;
  .tab-link {
    margin-right: 15px;
    cursor: pointer;
    color: #555;
    &.active {
      color: var(--color-yellow);
      text-decoration: underline;
    }
  }
}

.text-list {
  .list-head {
    color: #555;
  }
  .dot-line {
    color: #222;
    margin: 4px 0;
  }
  .list-row {
    display: flex;
    gap: 10px;
    padding: 4px 0;
    &:hover {
      background: rgba(255, 255, 255, 0.02);
    }
    .idx {
      color: #444;
    }
    .name {
      flex: 1;
      color: #aaa;
      .lock {
        color: var(--color-red);
      }
    }
    .cnt {
      color: var(--color-yellow);
      width: 40px;
    }
    .cmds {
      display: flex;
      gap: 10px;
      .cmd-btn {
        cursor: pointer;
        &.cyan {
          color: var(--color-cyan);
        }
        &.red {
          color: var(--color-red);
        }
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

/* 弹窗线框风格 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  .modal-box {
    border: 1px solid var(--color-yellow);
    background: #121212;
    padding: 20px;
    min-width: 280px;
    .modal-header {
      color: var(--color-yellow);
      text-align: center;
      margin-bottom: 15px;
    }
    .modal-body {
      text-align: center;
      margin-bottom: 20px;
      color: #aaa;
    }
    .modal-footer {
      display: flex;
      justify-content: center;
      gap: 20px;
      .modal-btn {
        cursor: pointer;
        &.red {
          color: var(--color-red);
        }
      }
    }
  }
}

.empty-text {
  color: #333;
  text-align: center;
  padding: 20px;
}
</style>
