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
          <span v-else class="empty">-- 无 --</span>
        </div>
      </div>
    </section>

    <div class="line-divider">--------------------------------</div>

    <section class="mud-section">
      <div class="mud-sub-title">【 储物纳戒 】 ({{ inventory.length }}/50)</div>
      <div class="inventory-text-list">
        <div class="list-header">序号 名称 数量</div>
        <div class="list-divider">................................</div>
        <div v-for="(item, index) in inventory" :key="index" class="inventory-row">
          <span class="item-idx">[{{ (index + 1).toString().padStart(2, '0') }}]</span>
          <span class="item-name">{{ item.name.padEnd(16, ' ') }}</span>
          <span class="item-count">x{{ item.count }}</span>
        </div>
        <div v-if="inventory.length === 0" class="empty-hint">你身上空空如也。</div>
        <div class="list-footer">................................</div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';

const character = reactive({ name: '李强', realm: '筑基初期' });
const stats = reactive({
  气血: 1200,
  灵力: 800,
  攻击: 150,
  防御: 85,
  速度: 45,
  幸运: 10,
  暴击: '5%',
  命中: 102,
});
const maxStats = reactive({ 气血: 2000, 灵力: 1000 });

const coreStats = computed(() => ({ 气血: stats.气血, 灵力: stats.灵力 }));
const detailStats = computed(() => {
  const { 气血, 灵力, ...rest } = stats;
  return rest;
});

const equips = reactive([{ name: '青锋剑' }, { name: '玄铁甲' }]);

const inventory = reactive([
  { name: '洗髓丹', count: 5 },
  { name: '灵石', count: 8848 },
  { name: '残破秘籍', count: 1 },
]);
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
    color: var(--color-gold);
    font-weight: bold;
    font-size: 1.1rem;
  }
  .mud-sub-title {
    color: var(--color-gold);
    margin-bottom: 8px;
    font-size: 0.9rem;
  }
  .line-divider {
    color: #444;
    margin: 10px 0;
    white-space: nowrap;
  }

  /* 核心状态条样式：保持原样（现代感渐变） */
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
          color: var(--color-cyan);
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

  /* 属性网格 */
  .attr-grid-text {
    display: grid;
    grid-template-columns: 1fr 1fr;
    .attr-row {
      font-size: 0.85rem;
      .label {
        color: #666;
      }
      .val {
        color: #ddd;
      }
    }
  }

  /* 装备列表 */
  .equip-list-text {
    display: grid;
    grid-template-columns: 1fr 1fr;
    .equip-row {
      font-size: 0.85rem;
      .idx {
        color: #444;
      }
      .name {
        color: var(--color-cyan);
      }
      .empty {
        color: #333;
      }
    }
  }

  /* 纳戒列表 */
  .inventory-text-list {
    font-size: 0.85rem;
    .list-header {
      color: #666;
      white-space: pre;
    }
    .list-divider {
      color: #333;
      margin: 4px 0;
    }
    .inventory-row {
      display: flex;
      gap: 10px;
      .item-idx {
        color: #444;
      }
      .item-name {
        color: #bbb;
        white-space: pre;
      }
      .item-count {
        color: var(--color-gold);
      }
    }
    .empty-hint {
      color: #444;
      padding: 10px 0;
    }
    .list-footer {
      color: #333;
      margin: 4px 0;
    }
  }
}
</style>
