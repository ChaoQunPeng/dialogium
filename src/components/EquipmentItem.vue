<template>
  <div 
    class="equipment-item"
    :class="getRarityClass()"
    @click="showDetail"
  >
    <span class="equipment-name">{{ equipment.name }}</span>
    <span v-if="showLevel" class="equipment-level">({{ equipment.level }}级)</span>
  </div>
</template>

<script setup lang="ts">
import type { IItemConfig } from '@/items/interface';

interface EquipmentItemProps {
  equipment: IItemConfig;
  showLevel?: boolean; // 是否显示等级
}

interface EquipmentItemEmits {
  (e: 'showDetail', equipment: IItemConfig): void;
}

const props = withDefaults(defineProps<EquipmentItemProps>(), {
  showLevel: true
});

const emits = defineEmits<EquipmentItemEmits>();

// 根据装备等级获取品级颜色类名
const getRarityClass = () => {
  const level = props.equipment.level;
  
  // 品级划分（可以根据需要调整）
  if (level >= 10) return 'legendary';     // 传说级 - 金色
  if (level >= 7) return 'epic';          // 史诗级 - 紫色
  if (level >= 5) return 'rare';          // 稀有级 - 蓝色
  if (level >= 3) return 'uncommon';      // 精良级 - 绿色
  return 'common';                        // 普通级 - 白色
};

// 点击显示详情
const showDetail = () => {
  emits('showDetail', props.equipment);
};
</script>

<style lang="scss" scoped>
.equipment-item {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
  
  .equipment-name {
    font-weight: 500;
    margin-right: 4px;
  }
  
  .equipment-level {
    font-size: 0.8em;
    opacity: 0.8;
  }
  
  // 普通级 - 白色
  &.common {
    color: var(--text-main, #d4d4d4);
    background-color: rgba(212, 212, 212, 0.1);
    border-color: rgba(212, 212, 212, 0.3);
    
    &:hover {
      background-color: rgba(212, 212, 212, 0.2);
      border-color: rgba(212, 212, 212, 0.5);
    }
  }
  
  // 精良级 - 绿色
  &.uncommon {
    color: var(--color-green, #4dbd74);
    background-color: rgba(77, 189, 116, 0.1);
    border-color: rgba(77, 189, 116, 0.3);
    
    &:hover {
      background-color: rgba(77, 189, 116, 0.2);
      border-color: rgba(77, 189, 116, 0.5);
    }
  }
  
  // 稀有级 - 蓝色
  &.rare {
    color: #4d94ff;
    background-color: rgba(77, 148, 255, 0.1);
    border-color: rgba(77, 148, 255, 0.3);
    
    &:hover {
      background-color: rgba(77, 148, 255, 0.2);
      border-color: rgba(77, 148, 255, 0.5);
    }
  }
  
  // 史诗级 - 紫色
  &.epic {
    color: #cc66ff;
    background-color: rgba(204, 102, 255, 0.1);
    border-color: rgba(204, 102, 255, 0.3);
    
    &:hover {
      background-color: rgba(204, 102, 255, 0.2);
      border-color: rgba(204, 102, 255, 0.5);
    }
  }
  
  // 传说级 - 金色
  &.legendary {
    color: var(--color-yellow, #eec43f);
    background-color: rgba(238, 196, 63, 0.1);
    border-color: rgba(238, 196, 63, 0.3);
    text-shadow: 0 0 4px rgba(238, 196, 63, 0.5);
    
    &:hover {
      background-color: rgba(238, 196, 63, 0.2);
      border-color: rgba(238, 196, 63, 0.5);
      text-shadow: 0 0 8px rgba(238, 196, 63, 0.7);
    }
  }
}
</style>