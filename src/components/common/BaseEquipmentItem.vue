<!-- 基础装备物品 - 用于展示和操作装备物品的通用组件 -->
<template>
  <div class="equipment-item" :class="getRarityClass()" @click="showDetail">
    <span class="equipment-name">
      <slot :item="equipment">{{ equipment?.name }}</slot>
    </span>

    <BaseItemDetailModal
      ref="detailModalRef"
      :item-data="equipment"
      @remove="handleRemove"
      @equip="handleEquip"
      @unequip="handleUnequip"
    />

    <BaseDropConfirmModal ref="dropConfirmModalRef" @confirm="handleDropConfirm" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseItemDetailModal from './BaseItemDetailModal.vue';
import BaseDropConfirmModal from './BaseDropConfirmModal.vue';
import type { IInventoryItem } from '@/interface';
import { usePlayerStore } from '@/stores/player';

const playerStore = usePlayerStore();

// ==================== 接口定义 ====================

// 组件属性接口
interface EquipmentItemProps {
  equipment?: IInventoryItem;
}

// 组件事件接口
interface EquipmentItemEmits {
  (e: 'equip', instanceId: string): void;
  (e: 'unequip', item: any): void;
  (e: 'drop', item: any): void;
}

const props = withDefaults(defineProps<EquipmentItemProps>(), {});

const emits = defineEmits<EquipmentItemEmits>();

// ==================== 引用组件 ====================

// 物品详情弹窗引用
const detailModalRef = ref<InstanceType<typeof BaseItemDetailModal> | null>(null);
// 丢弃确认弹窗引用
const dropConfirmModalRef = ref<InstanceType<typeof BaseDropConfirmModal> | null>(null);

// ==================== 核心逻辑 ====================

/**
 * 根据装备等级获取品级 CSS 类名
 */
const getRarityClass = () => {
  // 直接将 grade 字符串转为小写作为 CSS 类名，保持逻辑一致性
  const grade = props.equipment?.grade;
  return grade ? grade.toLowerCase() : 'normal';
};

// ==================== 事件处理 ====================

/** 显示物品详情 - 调用子组件的 show 方法 */
const showDetail = () => {
  detailModalRef.value?.show(props.equipment);
};

/**
 * 装备物品
 * @param instanceId 物品实例 ID
 */
const handleEquip = (instanceId: string) => {
  emits('equip', instanceId);
  playerStore.equipItem(instanceId);
};

/**
 * 卸下装备
 * @param item 要卸下的装备
 */
const handleUnequip = (item: any) => {
  if (item.instanceId || item.id) {
    playerStore.unequipItem(item.instanceId || item.id);
  }
};

/**
 * 移除处理（丢弃）
 * @param item 要丢弃的物品
 */
const handleRemove = (item: any) => {
  if (item.instanceId && !item.isEquipped && !item.isLocked) {
    dropConfirmModalRef.value?.show(item);
  }
};

/**
 * 确认丢弃处理
 * @param item 确认丢弃的物品
 */
const handleDropConfirm = (item: any) => {
  if (item.instanceId && !item.isEquipped && !item.isLocked) {
    playerStore.dropItem(item.instanceId);
  }
};
</script>

<style lang="scss" scoped>
.equipment-item {
  cursor: pointer;

  .equipment-name {
    font-weight: 500;
  }

  // 品级颜色样式
  &.normal {
    color: #ffffff; // 普通 - 白色
  }

  &.advanced {
    color: #167be0; // 高级 - 蓝色
  }

  &.rare {
    color: #a633f4; // 稀有 - 紫色
  }

  &.artifact {
    color: #ee10d4; // 神器 - 紫色
  }

  &.epic {
    color: gold; // 史诗 - 橙色
    // text-shadow: 0 0 4px rgba(255, 128, 0, 0.4);
  }

  // &.legendary {
  //   color: #e6cc80; // 传说 - 暗金色
  //   text-shadow: 0 0 6px rgba(230, 204, 128, 0.6);
  //   font-weight: bold;
  // }
}
</style>
