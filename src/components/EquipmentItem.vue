<template>
  <div v-if="equipment">
    <!-- 装备展示项 -->
    <div class="equipment-item" :class="getRarityClass()" @click="showDetail">
      <span class="equipment-name">
        <slot :item="equipment">{{ equipment.name }}</slot>
      </span>
    </div>

    <!-- 引入装备详情弹窗组件 -->
    <ItemDetailModal
      ref="detailModalRef"
      @equip="handleEquip"
      @unequip="handleUnequip"
      @drop="handleDrop"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { IItemConfig } from '@/items/interface';
import ItemDetailModal from './ItemDetailModal.vue';

interface EquipmentItemProps {
  equipment?: IItemConfig;
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

// 根据装备等级获取品级颜色类名
const getRarityClass = () => {
  const level = props.equipment?.level ?? 10;

  // 品级划分（可以根据需要调整）
  if (level >= 10) return 'legendary'; // 传说级 - 金色
  if (level >= 7) return 'epic'; // 史诗级 - 紫色
  if (level >= 5) return 'rare'; // 稀有级 - 蓝色
  if (level >= 3) return 'uncommon'; // 精良级 - 绿色
  return 'common'; // 普通级 - 白色
};

// 显示详情 - 调用子组件的show方法
const showDetail = () => {
  detailModalRef.value?.show(props.equipment);
};

// 装备处理
const handleEquip = (instanceId: string) => {
  emits('equip', instanceId);
};

// 卸下处理
const handleUnequip = (item: any) => {
  emits('unequip', item);
};

// 丢弃处理
const handleDrop = (item: any) => {
  emits('drop', item);
};
</script>

<style lang="scss" scoped>
.equipment-item {
  .equipment-name {
    font-weight: 500;
  }
  // 品级颜色样式（与之前保持一致）
  &.common {
    color: var(--text-main, #d4d4d4);
  }

  &.uncommon {
    color: var(--color-green, #4dbd74);
  }

  &.rare {
    color: #4d94ff;
  }

  &.epic {
    color: #cc66ff;
  }

  &.legendary {
    color: var(--color-yellow, #eec43f);
  }
}
</style>
