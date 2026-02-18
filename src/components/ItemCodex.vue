<template>
  <div class="mud-codex-container mud-core">
    <header class="codex-toolbar">
      <div class="search-wrapper">
        <span class="search-icon">🔍</span>
        <input v-model="searchQuery" type="text" placeholder="输入物品名称..." class="mud-input" />
      </div>
      <div class="stats-mini">解锁: {{ filteredItems.length }}/{{ allItems.length }}</div>
    </header>

    <nav class="mud-tabs-mini">
      <span
        v-for="tab in categoryTabs"
        :key="tab.key"
        :class="['tab-item', { active: activeCategory === tab.key }]"
        @click="activeCategory = tab.key"
      >
        {{ tab.name }}
      </span>
    </nav>

    <main class="codex-content">
      <div class="list-header">
        <span class="col-idx">#</span>
        <span class="col-name">名称</span>
        <span class="col-lvl">品阶</span>
        <span class="col-type">类型</span>
      </div>

      <div class="list-body">
        <div
          v-for="(item, index) in filteredItems"
          :key="item.id"
          class="item-row-compact"
          @click="selectedItem = item"
        >
          <span class="col-idx">{{ (index + 1).toString().padStart(2, '0') }}</span>
          <span class="col-name" :class="getItemRarityClass(item)">{{ item.name }}</span>
          <span class="col-lvl">{{ getItemLevelDisplay(item.level) }}</span>
          <span class="col-type">{{ getCategoryDisplayName(item.category) }}</span>
        </div>
        <div v-if="filteredItems.length === 0" class="empty-text">—— 无匹配项 ——</div>
      </div>
    </main>

    <Transition name="fade">
      <div v-if="selectedItem" class="mud-modal-overlay" @click.self="selectedItem = null">
        <div class="mud-modal-card">
          <div class="modal-close" @click="selectedItem = null">×</div>

          <div class="modal-header">
            <h2 :class="getItemRarityClass(selectedItem)">{{ selectedItem.name }}</h2>
            <div class="modal-subtitle">
              {{ getCategoryDisplayName(selectedItem.category) }} ·
              {{ getItemLevelDisplay(selectedItem.level) }}品 ·
              {{ selectedItem.slot ? getSlotDisplayName(selectedItem.slot) : '消耗品' }}
            </div>
          </div>

          <div class="modal-divider"></div>

          <div class="modal-body">
            <p class="modal-desc">“{{ selectedItem.description }}”</p>

            <div v-if="selectedItem.stats" class="modal-stats">
              <div v-for="(v, k) in selectedItem.stats" :key="k" class="stat-entry">
                <span class="label">【{{ getStatDisplayName(k) }}】</span>
                <span class="value">+{{ v }}</span>
              </div>
            </div>

            <div class="modal-extra">
              <div v-if="selectedItem.setTag" class="set-tag">
                ★ 套装：{{ getSetName(selectedItem.setTag) }}
              </div>
              <div>
                价值：<span class="gold">{{
                  selectedItem.price > 0 ? selectedItem.price + ' 灵石' : '不可交易'
                }}</span>
              </div>
              <div>堆叠限制：{{ selectedItem.stackable ? '可堆叠' : '唯一物品' }}</div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="mud-btn" @click="selectedItem = null">返回图鉴</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { IItemConfig } from '@/items/interface';
import { items } from '@/items/index';

// 状态管理
const searchQuery = ref('');
const activeCategory = ref('all');
const selectedItem = ref<IItemConfig | null>(null);

const categoryTabs = [
  { name: '全部', key: 'all' },
  { name: '装备', key: 'equipment' },
  { name: '丹药', key: 'consumable' },
  { name: '材料', key: 'material' },
];

const allItems = computed<IItemConfig[]>(() => Object.values(items));

// 过滤逻辑：支持 分类 + 名称模糊搜索
const filteredItems = computed(() => {
  return allItems.value
    .filter((item) => {
      const matchCat = activeCategory.value === 'all' || item.category === activeCategory.value;
      const matchSearch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => b.level - a.level);
});

// 辅助格式化函数
const getCategoryDisplayName = (c: string) =>
  ({ equipment: '装备', consumable: '丹药', material: '材料', quest: '任务' })[c] || c;
const getSlotDisplayName = (s: string) =>
  ({ weapon: '武器', body: '衣服', leg: '护腿', accessory: '饰品' })[s] || s;
const getStatDisplayName = (s: string) =>
  ({ attack: '攻击', defense: '防御', hp: '气血', mp: '灵力', speed: '速度' })[s] || s;
const getItemLevelDisplay = (l: number) => ['凡', '良', '精', '极', '仙', '神'][l - 1] || l;
const getSetName = (t: string) => ({ man_tian_xin: '满天星' })[t] || t;

const getItemRarityClass = (item: any) => {
  const l = item.level;
  if (l >= 5) return 'color-5'; // 金
  if (l >= 4) return 'color-4'; // 紫
  if (l >= 3) return 'color-3'; // 蓝
  return 'color-1'; // 灰
};
</script>

<style lang="scss" scoped>
/* 核心布局 */
.mud-core {
  --primary-gold: #d4af37;
  --bg-dark: #0a0a0a;
  --border-color: #2a2a2a;

  background: var(--bg-dark);
  color: #999;
  font-family: 'SimSun', monospace;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
}

/* 顶部搜索栏 */
.codex-toolbar {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  background: #111;

  .search-wrapper {
    flex: 1;
    position: relative;
    .search-icon {
      position: absolute;
      left: 8px;
      top: 4px;
      font-size: 0.8rem;
    }
    .mud-input {
      width: 100%;
      background: #000;
      border: 1px solid #444;
      color: #ccc;
      padding: 4px 4px 4px 28px;
      font-size: 0.85rem;
      outline: none;
      &:focus {
        border-color: var(--primary-gold);
      }
    }
  }
  .stats-mini {
    font-size: 0.75rem;
    color: #555;
    white-space: nowrap;
  }
}

/* 选项卡 */
.mud-tabs-mini {
  display: flex;
  padding: 0 10px;
  gap: 10px;
  border-bottom: 1px solid var(--border-color);
  .tab-item {
    padding: 6px 4px;
    font-size: 0.85rem;
    cursor: pointer;
    &.active {
      color: var(--primary-gold);
      border-bottom: 2px solid var(--primary-gold);
    }
  }
}

/* 紧凑列表 */
.codex-content {
  flex: 1;
  overflow-y: auto;

  .list-header,
  .item-row-compact {
    display: grid;
    grid-template-columns: 30px 1fr 40px 50px;
    padding: 8px 12px;
    align-items: center;
    border-bottom: 1px solid #1a1a1a;
    font-size: 0.85rem;
  }

  .list-header {
    background: #151515;
    color: #555;
    position: sticky;
    top: 0;
  }

  .item-row-compact {
    cursor: pointer;
    &:hover {
      background: #1a1a1a;
    }
    .col-idx {
      color: #333;
      font-family: monospace;
    }
    .col-lvl {
      text-align: center;
    }
    .col-type {
      color: #555;
      font-size: 0.75rem;
      text-align: right;
    }
  }
}

/* 弹出层样式 */
.mud-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;

  .mud-modal-card {
    background: #111;
    border: 1px solid var(--primary-gold);
    width: 100%;
    max-width: 300px;
    position: relative;
    padding: 20px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 1);

    .modal-close {
      position: absolute;
      right: 10px;
      top: 5px;
      font-size: 1.5rem;
      cursor: pointer;
    }

    .modal-header {
      text-align: center;
      h2 {
        margin: 0;
        font-size: 1.2rem;
      }
      .modal-subtitle {
        font-size: 0.8rem;
        color: #666;
        margin-top: 5px;
      }
    }

    .modal-divider {
      border-bottom: 1px dashed #333;
      margin: 15px 0;
    }

    .modal-desc {
      color: #aaa;
      font-size: 0.85rem;
      line-height: 1.5;
      margin-bottom: 15px;
    }

    .modal-stats {
      background: #000;
      padding: 10px;
      margin-bottom: 15px;
      .stat-entry {
        display: flex;
        justify-content: space-between;
        font-size: 0.85rem;
        margin-bottom: 4px;
        .label {
          color: #555;
        }
        .value {
          color: #4caf50;
          font-weight: bold;
        }
      }
    }

    .modal-extra {
      font-size: 0.75rem;
      color: #555;
      line-height: 1.6;
      .set-tag {
        color: #da70d6;
      }
      .gold {
        color: #d4af37;
      }
    }

    .modal-footer {
      margin-top: 20px;
      text-align: center;
      .mud-btn {
        background: none;
        border: 1px solid #444;
        color: #888;
        padding: 5px 20px;
        cursor: pointer;
        &:hover {
          border-color: var(--primary-gold);
          color: #ccc;
        }
      }
    }
  }
}

/* 稀有度颜色 */
.color-1 {
  color: #888;
}
.color-3 {
  color: #4a9eff;
}
.color-4 {
  color: #a335ee;
}
.color-5 {
  color: #ff8000;
  text-shadow: 0 0 5px rgba(255, 128, 0, 0.3);
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.empty-text {
  text-align: center;
  padding: 40px;
  color: #333;
}
</style>
