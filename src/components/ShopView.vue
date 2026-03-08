<template>
  <div class="shop-view-wrapper">
    <BorderContainer :title="`🏪 ${shopName}`">
      <div class="shop-content">
        <!-- 商店头部信息 -->
        <div class="shop-header">
          <div class="merchant-info">
            <span class="merchant-name">{{ merchantName }}</span>
            <span class="merchant-greeting">{{ greeting }}</span>
          </div>
        </div>

        <!-- 商品分类 -->
        <div class="shop-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.type"
            :class="['tab-button', { active: currentTab === tab.type }]"
            @click="currentTab = tab.type"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- 商品列表 -->
        <div class="shop-items">
          <div v-if="filteredItems.length === 0" class="empty-state">
            <div class="empty-icon">📦</div>
            <div class="empty-text">暂无商品</div>
          </div>

          <div
            v-for="item in filteredItems"
            :key="item.id"
            class="item-card"
            @click="selectItem(item)"
          >
            <div class="item-main">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-type">{{ getItemTypeName(item.category) }}</span>
            </div>
            <div class="item-price">
              <span class="price-label">价格:</span>
              <span class="price-value">{{ item.price ?? 0 }}</span>
              <span class="currency-icon">💰</span>
            </div>
          </div>
        </div>

        <!-- 底部操作按钮 -->
        <div class="shop-actions">
          <button class="action-button close-button" @click="closeShop">
            <span class="icon">✕</span> 离开商店
          </button>
        </div>
      </div>
    </BorderContainer>

    <!-- 物品详情弹窗 -->
    <DropConfirmModal ref="modalRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ICharacter } from '@/interface/character';
import type { IItem } from '@/interface/item';
import BorderContainer from './borderContainer.vue';
import DropConfirmModal from './DropConfirmModal.vue';

interface Props {
  npc: ICharacter;
}

interface Emits {
  (e: 'close'): void;
  (e: 'purchase', item: IItem): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 商店信息
const shopName = computed(() => props.npc.interact?.shopName || '神秘商店');
const merchantName = computed(() => props.npc.name);
const greeting = computed(() => props.npc.interact?.greeting || '欢迎光临，随便看看！');

// 标签页
const tabs = [
  { type: 'all', label: '全部' },
  { type: 'consumable', label: '丹药' },
  { type: 'equipment', label: '法宝' },
  { type: 'material', label: '材料' },
];

const currentTab = ref<string>('all');
const selectedItem = ref<IItem | null>(null);
const modalRef = ref<InstanceType<typeof DropConfirmModal> | null>(null);

// 商品列表
const shopItems = computed<IItem[]>(() => {
  return props.npc.interact?.shopItems || [];
});

// 过滤后的商品
const filteredItems = computed(() => {
  if (currentTab.value === 'all') {
    return shopItems.value;
  }
  return shopItems.value.filter((item) => item.category === currentTab.value);
});

// 获取类型名称
const getItemTypeName = (category: string): string => {
  const typeMap: Record<string, string> = {
    consumable: '丹药',
    equipment: '法宝',
    material: '材料',
  };
  return typeMap[category] || '其他';
};

// 选择物品
const selectItem = (item: IItem) => {
  selectedItem.value = item;
  // 调用弹窗组件的 show 方法显示确认框
  modalRef.value?.show(item);
};

// 关闭商店
const closeShop = () => {
  emit('close');
};
</script>

<style lang="scss" scoped>
.shop-view-wrapper {
  display: flex;
  flex-direction: column;
}

.shop-content {
  padding: 16px;
}

.shop-header {
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.merchant-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.merchant-name {
  font-size: 18px;
  font-weight: bold;
  color: var(--color-yellow);
}

.merchant-greeting {
  font-size: 14px;
  color: var(--text-main);
  opacity: 0.8;
}

.shop-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 12px;
}

.tab-button {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: var(--text-main);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--color-yellow);
  }

  &.active {
    background: rgba(255, 215, 0, 0.2);
    border-color: var(--color-yellow);
    color: var(--color-yellow);
  }
}

.shop-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 300px;
  max-height: 500px;
  overflow-y: auto;
  padding: 8px;
}

.item-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.07);
    border-color: var(--color-yellow);
    transform: translateX(4px);
  }
}

.item-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-name {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-main);
}

.item-type {
  font-size: 12px;
  color: var(--text-secondary);
  opacity: 0.7;
}

.item-price {
  display: flex;
  align-items: center;
  gap: 4px;
}

.price-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.price-value {
  font-size: 16px;
  font-weight: bold;
  color: var(--color-yellow);
}

.currency-icon {
  font-size: 14px;
}

.shop-actions {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.action-button {
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &.close-button {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: var(--text-main);

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: var(--color-red);
      color: var(--color-red);
    }
  }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #555;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;

  .empty-icon {
    font-size: 32px;
    margin-bottom: 12px;
  }

  .empty-text {
    font-size: 14px;
    opacity: 0.6;
  }
}
</style>
