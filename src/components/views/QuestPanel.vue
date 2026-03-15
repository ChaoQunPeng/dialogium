<template>
  <div class="quest-panel">
    <div class="panel-header">
      <h2 class="panel-title">📜 任务列表</h2>
    </div>

    <!-- 任务分类标签 -->
    <div class="quest-tabs">
      <button
        :class="{ active: activeTab === 'available' }"
        @click="activeTab = 'available'"
        class="tab-btn"
      >
        可接受 ({{ availableQuests.length }})
      </button>
      <button
        :class="{ active: activeTab === 'inProgress' }"
        @click="activeTab = 'inProgress'"
        class="tab-btn"
      >
        进行中 ({{ inProgressQuests.length }})
      </button>
      <button
        :class="{ active: activeTab === 'completed' }"
        @click="activeTab = 'completed'"
        class="tab-btn"
      >
        可领取 ({{ completedQuests.length }})
      </button>
    </div>

    <!-- 任务列表 -->
    <div class="quest-list">
      <div v-if="displayQuests.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <div class="empty-text">暂无任务</div>
      </div>

      <div
        v-for="quest in displayQuests"
        :key="quest.id"
        class="quest-item"
        :class="[quest.type, quest.status]"
      >
        <!-- 任务头部信息 -->
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

        <!-- 任务描述 -->
        <p class="quest-description">{{ quest.description }}</p>

        <!-- 任务目标 -->
        <div class="quest-objectives">
          <div
            v-for="objective in quest.objectives"
            :key="objective.id"
            class="objective-item"
            :class="{ completed: objective.completed }"
          >
            <span class="objective-icon">{{ getObjectiveIcon(objective.type) }}</span>
            <span class="objective-text">{{ objective.description }}</span>
            <span class="objective-progress">
              {{ objective.current }}/{{ objective.required }}
            </span>
          </div>
        </div>

        <!-- 任务奖励预览 -->
        <div class="quest-rewards-preview">
          <span class="rewards-label">🎁 奖励:</span>
          <span v-for="(reward, index) in quest.rewards" :key="index" class="reward-tag">
            {{ formatReward(reward) }}
          </span>
        </div>

        <!-- 操作按钮 -->
        <div class="quest-actions">
          <button
            v-if="quest.status === 'available'"
            @click="$emit('accept', quest.id)"
            class="action-btn accept-btn"
          >
            ✅ 接受任务
          </button>
          <button
            v-if="quest.status === 'completed'"
            @click="$emit('claim', quest.id)"
            class="action-btn claim-btn"
          >
            🎁 领取奖励
          </button>
          <button
            v-if="quest.status === 'claimed'"
            disabled
            class="action-btn claimed-btn"
          >
            ✔️ 已完成
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { IQuestReward, QuestType, QuestStatus, QuestObjectiveType } from '@/interface/quest';
import { useQuestStore } from '@/stores/quest';

defineEmits<{
  accept: [questId: string];
  claim: [questId: string];
}>();

const questStore = useQuestStore();
const activeTab = ref<'available' | 'inProgress' | 'completed'>('available');

// 根据当前标签显示对应的任务列表
const displayQuests = computed(() => {
  switch (activeTab.value) {
    case 'available':
      return questStore.availableQuests;
    case 'inProgress':
      return questStore.inProgressQuests;
    case 'completed':
      return questStore.completedQuests;
    default:
      return [];
  }
});

const availableQuests = computed(() => questStore.availableQuests);
const inProgressQuests = computed(() => questStore.inProgressQuests);
const completedQuests = computed(() => questStore.completedQuests);

// 工具函数
const getQuestTypeLabel = (type: QuestType): string => {
  const labels: Record<QuestType, string> = {
    main: '主线',
    side: '支线',
    daily: '日常',
  };
  return labels[type] || type;
};

const getQuestStatusLabel = (status: QuestStatus): string => {
  const labels: Record<QuestStatus, string> = {
    locked: '🔒 已锁定',
    available: '✨ 可接受',
    inProgress: '⚔️ 进行中',
    completed: '🎉 已完成',
    claimed: '✔️ 已领取',
  };
  return labels[status] || status;
};

const getObjectiveIcon = (type: QuestObjectiveType): string => {
  const icons: Record<QuestObjectiveType, string> = {
    kill: '⚔️',
    collect: '🌿',
    talk: '💬',
    explore: '🗺️',
    purchase: '💰',
    defeatBoss: '👹',
  };
  return icons[type] || '📍';
};

const formatReward = (reward: IQuestReward): string => {
  switch (reward.type) {
    case 'item':
      return `物品 x${reward.amount}`;
    case 'currency':
      return `${reward.amount} 灵石`;
    case 'exp':
      return `${reward.amount} 经验`;
    default:
      return '未知奖励';
  }
};
</script>

<style lang="scss" scoped>
.quest-panel {
  padding: 16px;
  height: 100%;
  overflow-y: auto;
}

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

/* 标签页 */
.quest-tabs {
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
}

/* 任务列表 */
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

  .empty-icon {
    font-size: 48px;
    margin-bottom: 12px;
  }

  .empty-text {
    font-size: 14px;
  }
}

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

.quest-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.quest-main-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quest-type-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;

  &.main {
    background: rgba(255, 215, 0, 0.2);
    color: var(--color-yellow);
  }

  &.side {
    background: rgba(0, 255, 255, 0.2);
    color: var(--color-cyan);
  }

  &.daily {
    background: rgba(0, 255, 0, 0.2);
    color: var(--color-green);
  }
}

.quest-name {
  font-size: 15px;
  color: #fff;
  margin: 0;
  font-weight: bold;
}

.quest-status-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);

  &.available {
    color: var(--color-green);
  }

  &.inProgress {
    color: var(--color-yellow);
  }

  &.completed {
    color: var(--color-yellow);
    font-weight: bold;
  }
}

.quest-description {
  font-size: 13px;
  color: var(--text-main);
  margin: 0 0 12px 0;
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

  &.completed {
    opacity: 0.5;
    text-decoration: line-through;
  }

  .objective-icon {
    font-size: 14px;
  }

  .objective-text {
    flex: 1;
  }

  .objective-progress {
    font-size: 11px;
    color: var(--color-yellow);
    font-weight: bold;
  }
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
  font-size: 11px;
  padding: 2px 6px;
  background: rgba(255, 215, 0, 0.15);
  color: var(--color-yellow);
  border-radius: 3px;
}

.quest-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.action-btn {
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.accept-btn {
    background: linear-gradient(135deg, #4ade80, #22c55e);
    color: #fff;

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #22c55e, #16a34a);
    }
  }

  &.claim-btn {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    color: #fff;

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #f59e0b, #d97706);
    }
  }

  &.claimed-btn {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
