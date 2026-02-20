<template>
  <div v-if="equipment">
    <div class="equipment-item" :class="getRarityClass()" @click="showDetail">
      <span class="equipment-name">
        <slot :item="equipment">{{ equipment.name }}</slot>
      </span>
    </div>

    <ItemDetailModal
      ref="detailModalRef"
      @equip="handleEquip"
      @unequip="handleUnequip"
      @drop="handleShowDropConfirm"
    />

    <DropConfirmModal ref="dropConfirmModalRef" @confirm="handleDropConfirm" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ItemDetailModal from './ItemDetailModal.vue';
import DropConfirmModal from './DropConfirmModal.vue';
import type { IInventoryItem } from '@/interface';
import { usePlayerStore } from '../stores/player';
const playerStore = usePlayerStore();

interface EquipmentItemProps {
  equipment?: IInventoryItem;
}

interface EquipmentItemEmits {
  (e: 'equip', instanceId: string): void;
  (e: 'unequip', item: any): void;
  (e: 'drop', item: any): void;
}

const props = withDefaults(defineProps<EquipmentItemProps>(), {});

const emits = defineEmits<EquipmentItemEmits>();

// 引用详情弹窗组件
const detailModalRef = ref<InstanceType<typeof ItemDetailModal> | null>(null);
// 引用丢弃确认弹窗组件
const dropConfirmModalRef = ref<InstanceType<typeof DropConfirmModal> | null>(null);

// /** 品级配置信息（用于 UI 渲染） */
// const GRADE_CONFIG: Record<ItemGrade, { label: string; color: string; level: number }> = {
//   Normal: { label: '普通', color: '#ffffff', level: 1 },
//   Advanced: { label: '高级', color: '#1eff00', level: 2 },
//   Rare: { label: '稀有', color: '#0070dd', level: 3 },
//   Artifact: { label: '神器', color: '#a335ee', level: 4 },
//   Epic: { label: '史诗', color: '#ff8000', level: 5 },
//   Legendary: { label: '传说', color: '#e6cc80', level: 6 },
// };

// 根据装备等级获取品级颜色类名
const getRarityClass = () => {
  // 直接将 grade 字符串转为小写作为 CSS 类名，保持逻辑一致性
  const grade = props.equipment?.grade;
  return grade ? grade.toLowerCase() : 'normal';
};

// 显示详情 - 调用子组件的show方法
const showDetail = () => {
  detailModalRef.value?.show(props.equipment);
};

// 装备处理
const handleEquip = (instanceId: string) => {
  emits('equip', instanceId);

  playerStore.equipItem(instanceId);
};

// 卸下处理
const handleUnequip = (item: any) => {
  emits('unequip', item);

  if (item.instanceId) {
    playerStore.unequipItem(item.instanceId);
  }
};

// 显示丢弃确认弹窗
const handleShowDropConfirm = (item: any) => {
  emits('drop', item);
  dropConfirmModalRef.value?.show(item);
};

// 确认丢弃处理
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
