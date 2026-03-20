<template>
  <div class="quest-item" :class="[quest.type, quest.status]">
    <div class="quest-header">
      <div class="quest-main-info">
        <span class="quest-type-badge" :class="quest.type">
          {{ getQuestTypeLabel(quest.type) }}
        </span>
        <h3 class="quest-name">{{ quest.name }}</h3>
      </div>
      <span class="quest-status-badge" :class="quest.status">
        {{ getQuestStatusLabel(quest.status) }}
      </span>
    </div>

    <p class="quest-description">{{ quest.description }}</p>

    <div class="quest-objectives">
      <div
        v-for="objective in quest.objectives"
        :key="objective.id"
        class="objective-item"
        :class="{ completed: objective.completed }"
      >
        <span class="objective-icon">{{ getObjectiveIcon(objective.type) }}</span>
        <span class="objective-text">{{ objective.description }}</span>
        <span class="objective-progress">{{ objective.current }}/{{ objective.required }}</span>
      </div>
    </div>

    <div class="quest-rewards-preview">
      <span class="rewards-label">🎁 奖励:</span>
      <span v-for="(reward, index) in quest.rewards" :key="index" class="reward-tag">
        {{ formatReward(reward) }}
      </span>
    </div>

    <div class="quest-actions">
      <button
        v-if="quest.status === QuestStatus.Available"
        type="button"
        class="action-btn accept-btn"
        @click="emit('accept', quest.id)"
      >
        ✅ 接受任务
      </button>
      <button
        v-else-if="quest.status === QuestStatus.Completed"
        type="button"
        class="action-btn claim-btn"
        @click="emit('claim', quest.id)"
      >
        🎁 领取奖励
      </button>
      <button v-else-if="quest.status === QuestStatus.Claimed" type="button" disabled class="action-btn claimed-btn">
        ✔️ 已完成
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QuestStatus, type IQuest } from '@/interface/quest';
import {
  formatReward,
  getObjectiveIcon,
  getQuestStatusLabel,
  getQuestTypeLabel,
} from '@/features/quest/model/quest';

defineProps<{
  quest: IQuest;
}>();

const emit = defineEmits<{
  (e: 'accept', questId: string): void;
  (e: 'claim', questId: string): void;
}>();
</script>

<style lang="scss" scoped>
.quest-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 215, 0, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  &.main {
    border-left: 3px solid var(--color-yellow);
  }

  &.side {
    border-left: 3px solid var(--color-cyan);
  }

  &.daily {
    border-left: 3px solid var(--color-green);
  }
}

.quest-header,
.quest-main-info,
.quest-actions {
  display: flex;
  align-items: center;
}

.quest-header {
  justify-content: space-between;
  margin-bottom: 8px;
}

.quest-main-info {
  gap: 8px;
}

.quest-type-badge,
.quest-status-badge,
.reward-tag {
  font-size: 11px;
}

.quest-type-badge,
.quest-status-badge,
.action-btn {
  border-radius: 4px;
}

.quest-type-badge {
  padding: 2px 8px;
  font-weight: bold;
}

.quest-type-badge.main {
  background: rgba(255, 215, 0, 0.2);
  color: var(--color-yellow);
}

.quest-type-badge.side {
  background: rgba(0, 255, 255, 0.2);
  color: var(--color-cyan);
}

.quest-type-badge.daily {
  background: rgba(0, 255, 0, 0.2);
  color: var(--color-green);
}

.quest-name {
  font-size: 15px;
  color: #fff;
  margin: 0;
  font-weight: bold;
}

.quest-status-badge {
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.1);
}

.quest-status-badge.available {
  color: var(--color-green);
}

.quest-status-badge.inProgress,
.quest-status-badge.completed {
  color: var(--color-yellow);
}

.quest-description {
  font-size: 13px;
  color: var(--text-main);
  margin: 0 0 12px;
  line-height: 1.5;
  opacity: 0.8;
}

.quest-objectives {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.objective-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 4px;
  font-size: 12px;
  color: var(--text-main);
}

.objective-item.completed {
  opacity: 0.5;
  text-decoration: line-through;
}

.objective-text {
  flex: 1;
}

.objective-progress {
  font-size: 11px;
  color: var(--color-yellow);
  font-weight: bold;
}

.quest-rewards-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
  padding: 8px;
  background: rgba(255, 215, 0, 0.05);
  border-radius: 4px;
  border: 1px dashed rgba(255, 215, 0, 0.3);
}

.rewards-label {
  font-size: 12px;
  color: var(--color-yellow);
  font-weight: bold;
  margin-right: 4px;
}

.reward-tag {
  padding: 2px 6px;
  background: rgba(255, 215, 0, 0.15);
  color: var(--color-yellow);
  border-radius: 3px;
}

.quest-actions {
  gap: 8px;
  justify-content: flex-end;
}

.action-btn {
  padding: 6px 16px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  transition: all 0.3s;
}

.action-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.accept-btn {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: #fff;
}

.claim-btn {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #fff;
}

.claimed-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}
</style>