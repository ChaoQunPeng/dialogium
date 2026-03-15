<template>
  <div class="tab-switcher">
    <div
      v-for="(tab, index) in tabs"
      :key="tab.id || index"
      :class="{ active: modelValue === tab.id }"
      @click="$emit('update:modelValue', tab.id)"
      class="tab-btn"
    >
      <slot :name="'tab-' + (tab.id || index)" :tab="tab">
        {{ tab.label }}
        <span v-if="tab.count !== undefined" class="tab-count"> ({{ tab.count }}) </span>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface ITabOption {
  id: string;
  label: string;
  count?: number;
}

defineProps<{
  modelValue: string;
  tabs: ITabOption[];
}>();

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<style lang="scss" scoped>
.tab-switcher {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.tab-btn {
  flex: 1;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-main);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }

  &.active {
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 180, 0, 0.2));
    border-color: var(--color-yellow);
    color: var(--color-yellow);
    font-weight: bold;
  }

  .tab-count {
    font-weight: normal;
    opacity: 0.9;
  }
}
</style>
