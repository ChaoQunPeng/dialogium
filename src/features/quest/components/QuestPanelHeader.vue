<!-- 任务面板头部 - 展示任务标题和标签页切换器 -->
<template>
  <div>
    <div class="panel-header">
      <h2 class="panel-title">📜 任务列表</h2>
    </div>

    <BaseTabSwitcher :model-value="modelValue" :tabs="tabs" @update:modelValue="handleTabChange" />
  </div>
</template>

<script setup lang="ts">
import BaseTabSwitcher from '@/components/common/BaseTabSwitcher.vue';
import type { QuestTabConfig, QuestTabId } from '@/features/quest/model/quest';

// ==================== Props & Emits ====================

// 组件属性：当前选中的标签页、标签页配置
defineProps<{
  modelValue: QuestTabId;
  tabs: QuestTabConfig[];
}>();

// 组件事件：更新选中值
const emit = defineEmits<{
  (e: 'update:modelValue', value: QuestTabId): void;
}>();

/** 处理标签页切换 */
const handleTabChange = (value: string) => {
  emit('update:modelValue', value as QuestTabId);
};
</script>

<style lang="scss" scoped>
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(255, 215, 0, 0.3);
}

.panel-title {
  font-size: 24px;
  color: var(--color-yellow);
  margin: 0;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}
</style>