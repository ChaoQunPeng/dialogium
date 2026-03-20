import type { IQuest, IQuestReward } from '@/interface/quest';
import { QuestObjectiveType, QuestStatus, QuestType } from '@/interface/quest';

export type QuestTabId = 'available' | 'inProgress' | 'completed';

export interface QuestTabConfig {
  id: QuestTabId;
  label: string;
  count: number;
}

export interface QuestCollections {
  available: IQuest[];
  inProgress: IQuest[];
  completed: IQuest[];
}

export const buildQuestTabConfigs = (collections: QuestCollections): QuestTabConfig[] => [
  { id: 'available', label: '可接受', count: collections.available.length },
  { id: 'inProgress', label: '进行中', count: collections.inProgress.length },
  { id: 'completed', label: '可领取', count: collections.completed.length },
];

export const getQuestListByTab = (tabId: QuestTabId, collections: QuestCollections): IQuest[] => {
  switch (tabId) {
    case 'available':
      return collections.available;
    case 'inProgress':
      return collections.inProgress;
    case 'completed':
      return collections.completed;
  }
};

export const getQuestTypeLabel = (type: QuestType): string => {
  const labels: Record<QuestType, string> = {
    [QuestType.Main]: '主线',
    [QuestType.Side]: '支线',
    [QuestType.Daily]: '日常',
  };

  return labels[type] || type;
};

export const getQuestStatusLabel = (status: QuestStatus): string => {
  const labels: Record<QuestStatus, string> = {
    [QuestStatus.Locked]: '🔒 已锁定',
    [QuestStatus.Available]: '✨ 可接受',
    [QuestStatus.InProgress]: '⚔️ 进行中',
    [QuestStatus.Completed]: '🎉 已完成',
    [QuestStatus.Claimed]: '✔️ 已领取',
  };

  return labels[status] || status;
};

export const getObjectiveIcon = (type: QuestObjectiveType): string => {
  const icons: Record<QuestObjectiveType, string> = {
    [QuestObjectiveType.Kill]: '⚔️',
    [QuestObjectiveType.Collect]: '🌿',
    [QuestObjectiveType.Talk]: '💬',
    [QuestObjectiveType.Explore]: '🗺️',
    [QuestObjectiveType.Purchase]: '💰',
    [QuestObjectiveType.DefeatBoss]: '👹',
  };

  return icons[type] || '📍';
};

export const formatReward = (reward: IQuestReward): string => {
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