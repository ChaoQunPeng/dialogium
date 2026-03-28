<!-- 任务列表 - 展示任务项集合 -->
<template>
  <div class="quest-list">
    <div v-if="items.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <div class="empty-text">暂无任务</div>
    </div>

    <QuestListItem
      v-for="quest in items"
      :key="quest.id"
      :quest="quest"
      @accept="emit('accept', $event)"
      @claim="emit('claim', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { IQuest } from '@/interface/quest';
import QuestListItem from '@/features/quest/components/QuestListItem.vue';

// ==================== Props & Emits ====================

// 组件属性：任务列表
defineProps<{
  items: IQuest[];
}>();

// 组件事件：接受任务、领取奖励
const emit = defineEmits<{
  (e: 'accept', questId: string): void;
  (e: 'claim', questId: string): void;
}>();
</script>

<style lang="scss" scoped>
.quest-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 8px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 14px;
}
</style>