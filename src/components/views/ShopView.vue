// 商店视图 - 用于展示 NPC 商店界面，支持商品浏览和购买
<template>
  <div class="shop-view-wrapper">
    <BaseBorderContainer>
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
    </BaseBorderContainer>

    <BaseDropConfirmModal
      ref="dropConfirmModalRef"
      @confirm="handleDropConfirm"
      @cancel="handleDropCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ICharacter } from '@/interface/character';
import type { IItem } from '@/interface/item';
import BaseBorderContainer from '../common/BaseBorderContainer.vue';
import BaseDropConfirmModal from '../common/BaseDropConfirmModal.vue';

// ==================== 接口定义 ====================

// 组件属性接口
interface Props {
  npc: ICharacter;
}

// 组件事件接口
interface Emits {
  (e: 'close'): void;
  (e: 'purchase', item: IItem): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// ==================== 商店信息 ====================

/** 商家名称 */
const merchantName = computed(() => props.npc.name);
/** 欢迎语 */
const greeting = computed(() => props.npc.interact?.greeting || '欢迎光临，随便看看！');

// ==================== 标签页配置 ====================

// 商品分类标签
const tabs = [
  { type: 'all', label: '全部' },
  { type: 'consumable', label: '丹药' },
  { type: 'equipment', label: '法宝' },
  { type: 'material', label: '材料' },
];

// 当前选中的标签
const currentTab = ref<string>('all');
// 当前选中的物品
const selectedItem = ref<IItem | null>(null);
// 确认弹窗组件引用
const dropConfirmModalRef = ref<InstanceType<typeof BaseDropConfirmModal> | null>(null);

// ==================== 商品数据 ====================

/** 获取商店商品列表 */
const shopItems = computed<IItem[]>(() => {
  return props.npc.interact?.shopItems || [];
});

/**
 * 处理购买确认（从弹窗组件事件转发到父组件）
 * @param item 购买的物品
 */
const handlePurchase = (item: IItem) => {
  console.log(`🛒 ShopView 收到购买请求：${item.name}`);
  emit('purchase', item);
};

/** 根据当前标签过滤商品列表 */
const filteredItems = computed(() => {
  if (currentTab.value === 'all') {
    return shopItems.value;
  }
  return shopItems.value.filter((item) => item.category === currentTab.value);
});

/**
 * 获取物品类型名称
 * @param category 物品类别
 */
const getItemTypeName = (category: string): string => {
  const typeMap: Record<string, string> = {
    consumable: '丹药',
    equipment: '法宝',
    material: '材料',
  };
  return typeMap[category] || '其他';
};

// ==================== 事件处理 ====================

/**
 * 选择物品并显示购买确认框
 * @param item 选择的物品
 */
const selectItem = (item: IItem) => {
  selectedItem.value = item;
  // 调用弹窗组件的 show 方法显示确认框
  dropConfirmModalRef.value?.show(item);
};

/** 关闭商店 */
const closeShop = () => {
  emit('close');
};

/** 处理确认弹窗的确认事件 */
const handleDropConfirm = (item: IItem) => {
  handlePurchase(item);
};

/** 处理确认弹窗的取消事件 */
const handleDropCancel = () => {
  selectedItem.value = null;
};
</script>

<style lang="scss" scoped>
.shop-view-wrapper {
  display: flex;
  flex-direction: column;
}

.shop-content {
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
