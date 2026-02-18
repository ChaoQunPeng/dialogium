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
        <div class="char-title">===[ {{ character.name }} ]===</div>
        <div class="char-subtitle">境界：{{ character.realm }}</div>
        <div class="char-subtitle">门派：逍遥散修</div>
      </header>
      <!--
      <div class="line-divider">--------------------------------</div>

      <section class="status-bars">
        <div v-for="(val, key) in coreStats" :key="key" class="bar-item">
          <div class="bar-label">
            <span>{{ key }}</span>
            <span class="val-text">{{ val }}/{{ maxStats[key] }}</span>
          </div>
          <div class="bar-track">
            <div
              :class="['bar-fill', key === '气血' ? 'hp' : 'mp']"
              :style="{ width: (val / maxStats[key]) * 100 + '%' }"
            ></div>
          </div>
        </div>
      </section>

      <div class="line-divider">--------------------------------</div>

      <section class="mud-section">
        <div class="mud-sub-title">【 个人属性 】</div>
        <div class="attr-grid-text">
          <div v-for="(val, key) in detailStats" :key="key" class="attr-row">
            <span class="label">{{ key }}：</span>
            <span class="val">{{ val }}</span>
          </div>
        </div>
      </section> -->

      <section class="mud-section">
        <div class="mud-sub-title">【 已穿戴法宝 】</div>
        <div class="equip-list-text">
          <div v-for="n in 6" :key="n" class="equip-row">
            <span class="idx">({{ n }})</span>
            <span v-if="equips[n - 1]" class="name">{{ equips[n - 1]?.name }}</span>
            <span v-else class="empty">-- 空置 --</span>
          </div>
        </div>
      </section>

      <div class="line-divider">--------------------------------</div>

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
          <div class="list-header">序号 名称 数量</div>
          <div class="list-divider">................................</div>

          <div v-for="(item, index) in filteredInventory" :key="index" class="inventory-row">
            <span class="item-idx">[{{ (index + 1).toString().padStart(2, '0') }}]</span>
            <span class="item-name">{{ item.name.padEnd(16, ' ') }}</span>
            <span class="item-count">x{{ item.count }}</span>
            <span v-if="item.isLocked" class="item-tag">锁</span>
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

// 角色与属性
const character = reactive({ name: '李强', realm: '筑基初期' });

const stats = reactive({
  气血: 1200,
  真元力: 800,
  攻击: 150,
  防御: 85,
  速度: 0,
  幸运: 0,
  暴击: 0,
  命中: 0,
});
const maxStats = reactive({ 气血: 2000, 真元力: 1000 });

const coreStats = computed(() => ({ 气血: stats.气血, 真元力: stats.真元力 }));
const detailStats = computed(() => {
  const { ...rest } = stats;
  return rest;
});

// 装备展示
const equips = reactive([{ name: '青锋剑' }, { name: '玄铁甲' }]);

// 纳戒数据与分类逻辑
const activeTab = ref('all');
const tabs = [
  { name: '全部', key: 'all' },
  { name: '装备', key: 'equipment' },
  { name: '丹药', key: 'consumable' },
  { name: '材料', key: 'material' },
];

// 从本地存储获取物品数据
const PMZL_PLAYER_ITEMS_KEY = 'PMZL_PLAYER_ITEMS';
const playerItems = ref<IItemInstance[]>([]);

// 加载本地存储的物品数据
const loadPlayerItems = () => {
  try {
    const storedData = localStorage.getItem(PMZL_PLAYER_ITEMS_KEY);
    if (storedData) {
      const parsedItems = JSON.parse(storedData) as IItemInstance[];
      playerItems.value = parsedItems;
      console.log('成功加载玩家物品数据:', parsedItems);
    } else {
      console.log('未找到玩家物品数据');
      playerItems.value = [];
    }
  } catch (error) {
    console.error('加载玩家物品数据失败:', error);
    playerItems.value = [];
  }
};

// 将物品实例转换为展示格式
const inventory = computed(() => {
  return playerStore.inventory.map((itemInstance: IItemInstance) => {
    // 根据 itemId 查找物品配置
    const itemConfig = items[itemInstance.itemId];

    if (!itemConfig) {
      // 如果找不到配置，使用默认值
      return {
        name: `未知物品(${itemInstance.itemId})`,
        count: itemInstance.count,
        category: 'material' as const,
        isLocked: itemInstance.isLocked,
        isEquipped: itemInstance.isEquipped,
        instanceId: itemInstance.instanceId,
      };
    }

    return {
      //
      count: itemInstance.count,
      isLocked: itemInstance.isLocked,
      isEquipped: itemInstance.isEquipped,
      instanceId: itemInstance.instanceId,
      //
      name: itemConfig.name,
      category: itemConfig.category,
      description: itemConfig.description,
      level: itemConfig.level,
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

// 组件挂载时加载数据
onMounted(() => {
  loadPlayerItems();
});
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
  .line-divider {
    color: #ddd;
    margin: 10px 0;
    white-space: nowrap;
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
    }
    .empty-hint {
      color: #ddd;
      padding: 10px 0;
      font-style: italic;
    }
  }
}
</style>
