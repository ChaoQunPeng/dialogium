import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { IQuest, IQuestReward } from '@/interface/quest';
import { QuestStatus } from '@/interface/quest';
import { usePlayerStore } from './player';

/**
 * 任务状态管理 Store
 */
export const useQuestStore = defineStore('quest', () => {
  // --- 1. 状态初始化 ---
  const quests = ref<IQuest[]>([]);
  const activeQuestId = ref<string | null>(null);

  // --- 2. 计算属性 ---
  /** 活跃的任务（可接受 + 进行中） */
  const activeQuests = computed(() =>
    quests.value.filter(
      (q) => q.status === QuestStatus.Available || q.status === QuestStatus.InProgress
    )
  );

  /** 可进行中的任务 */
  const availableQuests = computed(() =>
    quests.value.filter((q) => q.status === QuestStatus.Available)
  );

  /** 进行中的任务 */
  const inProgressQuests = computed(() =>
    quests.value.filter((q) => q.status === QuestStatus.InProgress)
  );

  /** 已完成但未领取奖励的任务 */
  const completedQuests = computed(() =>
    quests.value.filter((q) => q.status === QuestStatus.Completed)
  );

  /** 当前选中的任务 */
  const currentQuest = computed(() =>
    quests.value.find((q) => q.id === activeQuestId.value)
  );

  // --- 3. 核心方法 ---
  /** 加载任务数据 */
  const loadQuests = (questData: IQuest[]) => {
    quests.value = questData;
    console.log(`📜 加载了 ${quests.value.length} 个任务`);
  };

  /** 接受任务 */
  const acceptQuest = (questId: string): boolean => {
    const quest = quests.value.find((q) => q.id === questId);
    if (!quest || quest.status !== QuestStatus.Available) {
      return false;
    }

    quest.status = QuestStatus.InProgress;
    activeQuestId.value = questId;
    console.log(`✅ 接受了任务：${quest.name}`);
    return true;
  };

  /** 更新任务目标进度 */
  const updateObjective = (
    questId: string,
    objectiveId: string,
    increment: number = 1
  ): void => {
    const quest = quests.value.find((q) => q.id === questId);
    if (!quest || quest.status !== 'inProgress') {
      return;
    }

    const objective = quest.objectives.find((o) => o.id === objectiveId);
    if (!objective || objective.completed) {
      return;
    }

    // 更新进度
    objective.current = Math.min(objective.current + increment, objective.required);
    objective.completed = objective.current >= objective.required;

    console.log(
      `📝 更新任务进度：${quest.name} - ${objective.description} (${objective.current}/${objective.required})`
    );

    // 检查所有目标是否完成
    if (quest.objectives.every((o) => o.completed)) {
      quest.status = QuestStatus.Completed;
      console.log(`🎉 任务完成：${quest.name}`);
    }
  };

  /** 根据目标类型批量更新任务进度 */
  const updateQuestsByTarget = (
    targetType: 'kill' | 'collect' | 'talk' | 'purchase',
    targetId: string,
    amount: number = 1
  ): void => {
    const inProgressQuestIds = inProgressQuests.value.map((q) => q.id);
    
    inProgressQuestIds.forEach((questId) => {
      const quest = quests.value.find((q) => q.id === questId);
      if (!quest) return;

      quest.objectives.forEach((obj) => {
        // 根据目标类型和目标 ID 匹配
        const isMatchByType = 
          (targetType === 'kill' && obj.type === 'kill') ||
          (targetType === 'collect' && obj.type === 'collect') ||
          (targetType === 'talk' && obj.type === 'talk') ||
          (targetType === 'purchase' && obj.type === 'purchase');

        if (isMatchByType && obj.target === targetId) {
          updateObjective(questId, obj.id, amount);
        }
      });
    });
  };

  /** 领取任务奖励 */
  const claimReward = (questId: string): { success: boolean; message: string } => {
    const quest = quests.value.find((q) => q.id === questId);
    if (!quest || quest.status !== 'completed') {
      return { success: false, message: '任务尚未完成或不存在' };
    }

    // 发放奖励
    const playerStore = usePlayerStore();
    let rewardMessages: string[] = [];

    quest.rewards.forEach((reward: IQuestReward) => {
      switch (reward.type) {
        case 'item':
          if (reward.id) {
            playerStore.acquireItem([{ itemId: reward.id, count: reward.amount }]);
            rewardMessages.push(`物品 x${reward.amount}`);
          }
          break;
        case 'currency':
          if (playerStore.player.currency === undefined) {
            playerStore.player.currency = 0;
          }
          playerStore.player.currency += reward.amount;
          rewardMessages.push(`${reward.amount} 灵石`);
          break;
        case 'exp':
          playerStore.gainExp(reward.amount);
          rewardMessages.push(`${reward.amount} 经验`);
          break;
      }
    });

    // 标记为已领取
    quest.status = QuestStatus.Claimed;
    
    const message = `领取任务【${quest.name}】奖励：${rewardMessages.join('、')}`;
    console.log(`🎁 ${message}`);
    
    return { success: true, message };
  };

  /** 检查任务是否可接受（前置条件检查） */
  const canAcceptQuest = (questId: string): boolean => {
    const quest = quests.value.find((q) => q.id === questId);
    if (!quest || (quest.status !== QuestStatus.Locked && quest.status !== QuestStatus.Available)) {
      return false;
    }

    // 检查前置任务
    if (quest.prerequisites && quest.prerequisites.length > 0) {
      const allPrerequisitesCompleted = quest.prerequisites.every((prereqId) => {
        const prereqQuest = quests.value.find((q) => q.id === prereqId);
        return prereqQuest?.status === QuestStatus.Completed || prereqQuest?.status === QuestStatus.Claimed;
      });

      if (!allPrerequisitesCompleted) {
        return false;
      }
    }

    return true;
  };

  /** 解锁任务（将 locked 状态改为 available） */
  const unlockQuest = (questId: string): void => {
    const quest = quests.value.find((q) => q.id === questId);
    if (quest && quest.status === QuestStatus.Locked) {
      quest.status = QuestStatus.Available;
      console.log(`🔓 解锁任务：${quest.name}`);
    }
  };

  /** 重置可重复任务 */
  const resetRepeatableQuest = (questId: string): void => {
    const quest = quests.value.find((q) => q.id === questId);
    if (!quest || !quest.repeatable) {
      return;
    }

    quest.status = QuestStatus.Available;
    quest.objectives.forEach((obj) => {
      obj.current = 0;
      obj.completed = false;
    });

    console.log(`🔄 重置可重复任务：${quest.name}`);
  };

  return {
    // State
    quests,
    activeQuestId,
    // Getters
    activeQuests,
    availableQuests,
    inProgressQuests,
    completedQuests,
    currentQuest,
    // Actions
    loadQuests,
    acceptQuest,
    updateObjective,
    updateQuestsByTarget,
    claimReward,
    canAcceptQuest,
    unlockQuest,
    resetRepeatableQuest,
  };
});
