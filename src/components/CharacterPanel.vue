<template>
  <div class="realm-dashboard mud-core">
    <header class="mud-section">
      <div class="char-title">===[ {{ character.name }} ]===</div>
      <div class="char-subtitle">境界：{{ character.realm }}</div>
      <div class="char-subtitle">门派：逍遥散修</div>
    </header>

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
    </section>

    <section class="mud-section">
      <div class="mud-sub-title">【 已穿戴法宝 】</div>
      <div class="equip-list-text">
        <div v-for="n in 6" :key="n" class="equip-row">
          <span class="idx">({{ n }})</span>
          <span v-if="equips[n - 1]" class="name">{{ equips[n - 1].name }}</span>
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
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';

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
const maxStats = reactive({ 气血: 2000, 灵力: 1000 });

const coreStats = computed(() => ({ 气血: stats.气血, 灵力: stats.灵力 }));
const detailStats = computed(() => {
  const { 气血, 真元力, ...rest } = stats;
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

const inventory = reactive([
  { name: '筑基丹', count: 5, category: 'consumable', isLocked: false },
  { name: '灵石', count: 8848, category: 'material', isLocked: true },
  { name: '金蝶刀', count: 1, category: 'equipment', isLocked: false },
  { name: '寒冰石', count: 12, category: 'material', isLocked: false },
  { name: '补天丹', count: 2, category: 'consumable', isLocked: false },
]);

// 核心：分类过滤逻辑
const filteredInventory = computed(() => {
  if (activeTab.value === 'all') return inventory;
  return inventory.filter((item) => item.category === activeTab.value);
});
</script>

<style lang="scss" scoped>
.mud-core {
  padding: 20px;
  background-color: #000;
  color: #bbb;
  font-family: 'Courier New', Courier, monospace;
  line-height: 1.5;

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
