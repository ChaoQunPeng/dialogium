import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { IQuest, IQuestReward } from '@/interface/quest';
import { QuestStatus } from '@/interface/quest';
import { usePlayerStore } from './player';
import { STORAGE_KEYS } from '@/constants';
import { initialQuests } from '@/data/quests';

/**
 * 防抖工具函数
 * @param func 需要防抖的函数
 * @param wait 等待时间 (毫秒)
 * @returns 防抖后的函数
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    // 如果已有定时器，清除它
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // 重新设置定时器
    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * 任务状态管理 Store
 */
export const useQuestStore = defineStore('quest', () => {
  // --- 1. 状态初始化 ---

  const quests = ref<IQuest[]>([]);
  const activeQuestId = ref<string | null>(null);

  // --- 2. 计算属性 ---
  /** 活跃的任务 (可接受 + 进行中) */
  const activeQuests = computed(() =>
    quests.value.filter(
      (q) => q.status === QuestStatus.Available || q.status === QuestStatus.InProgress,
    ),
  );

  /** 可进行中的任务 */
  const availableQuests = computed(() =>
    quests.value.filter((q) => q.status === QuestStatus.Available),
  );

  /** 进行中的任务 */
  const inProgressQuests = computed(() =>
    quests.value.filter((q) => q.status === QuestStatus.InProgress),
  );

  /** 已完成但未领取奖励的任务 */
  const completedQuests = computed(() =>
    quests.value.filter((q) => q.status === QuestStatus.Completed),
  );

  /** 当前选中的任务 */
  const currentQuest = computed(() => quests.value.find((q) => q.id === activeQuestId.value));

  // --- 3. 核心方法 ---
  /**
   * 从 localStorage 加载任务进度并合并到内存状态
   * 这是 Store 层的主要加载方法，应该在应用启动时调用
   */
  const loadQuests = () => {
    const savedProgress = localStorage.getItem(STORAGE_KEYS.PLAYER_QUESTS);
    if (savedProgress) {
      try {
        const progressData = JSON.parse(savedProgress);

        // 合并配置数据和存档进度
        const mergedQuests = initialQuests.map((configQuest) => {
          const savedQuest = progressData?.p?.[configQuest.id];

          if (savedQuest) {
            // 有存档进度，覆盖状态和目标进度
            return {
              ...configQuest,
              status: savedQuest.s as QuestStatus,
              objectives: configQuest.objectives.map((obj) => {
                const savedCurrent = savedQuest.o?.[obj.id] ?? 0;
                return {
                  ...obj,
                  current: savedCurrent,
                  completed: savedCurrent >= obj.required,
                };
              }),
            };
          }

          // 没有存档，使用配置数据
          return configQuest;
        });

        quests.value = mergedQuests;
        activeQuestId.value = progressData?.a || null;
        console.log(`📜 加载了 ${quests.value.length} 个任务 (包含存档进度)`);
      } catch (e) {
        console.error('任务存档解析失败，使用原始配置', e);
        quests.value = initialQuests;
      }
    } else {
      // 没有存档，直接使用配置数据
      quests.value = initialQuests;
      console.log(`📜 加载了 ${initialQuests.length} 个任务 (新游戏)`);
    }
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
  const updateObjective = (questId: string, objectiveId: string, increment: number = 1): void => {
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
      `📝 更新任务进度：${quest.name} - ${objective.description} (${objective.current}/${objective.required})`,
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
    amount: number = 1,
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

        if (!isMatchByType) return;

        // 匹配逻辑：
        // 1. 精确匹配：目标 ID 完全一致
        // 2. 通配符匹配：当任务目标的 target 为 'any' 时，匹配任意同类型目标
        const isMatchById = obj.target === targetId;
        const isMatchByAny = obj.target === 'any';

        if (isMatchById || isMatchByAny) {
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
    const rewardMessages: string[] = [];

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
        return (
          prereqQuest?.status === QuestStatus.Completed ||
          prereqQuest?.status === QuestStatus.Claimed
        );
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

  // --- 4. 持久化监听与保存 ---

  /** 提取进度数据（紧凑格式） */
  const extractProgressData = () => {
    const progress: Record<string, { s: string; o: Record<string, number> }> = {};

    quests.value.forEach((quest) => {
      // 只保存有进度变化的任务（非 locked 状态或有进度的目标）
      const hasProgress =
        quest.status !== QuestStatus.Locked || quest.objectives.some((obj) => obj.current > 0);

      if (hasProgress) {
        progress[quest.id] = {
          s: quest.status,
          o: quest.objectives.reduce(
            (acc, obj) => {
              // 只保存 current > 0 的目标
              if (obj.current > 0) {
                acc[obj.id] = obj.current;
              }
              return acc;
            },
            {} as Record<string, number>,
          ),
        };
      }
    });

    return {
      p: progress,
      a: activeQuestId.value || undefined,
    };
  };

  /** 保存到 localStorage */
  const saveProgress = () => {
    const progressData = extractProgressData();
    localStorage.setItem(STORAGE_KEYS.PLAYER_QUESTS, JSON.stringify(progressData));
    console.log('💾 任务进度已自动保存');
  };

  /** 防抖版本的保存函数（1 秒延迟） */
  const debouncedSaveProgress = debounce(saveProgress, 1000);

  // 监听任务数据变化，使用防抖保存（避免频繁更新导致卡顿）
  // 场景：战斗中每秒多次 updateObjective → 只会在最后一次更新后 1 秒保存一次
  watch(quests, debouncedSaveProgress, { deep: true });

  // 监听 activeQuestId 变化，立即保存（重要状态变更）
  // 场景：接受任务、切换追踪目标等关键操作立即保存
  watch(activeQuestId, saveProgress);

  /** 显式初始化方法
   * 用于在设置 localStorage 数据后重新加载任务数据
   * 注意：需要配合完整的任务配置数据一起使用
   */
  const initialize = () => {
    const savedProgress = localStorage.getItem(STORAGE_KEYS.PLAYER_QUESTS);

    if (savedProgress) {
      try {
        const progressData = JSON.parse(savedProgress);

        // 更新当前激活的任务 ID
        activeQuestId.value = progressData?.a || null;

        // 遍历现有任务，应用存档进度
        quests.value = quests.value.map((quest) => {
          const savedQuest = progressData?.p?.[quest.id];

          if (savedQuest) {
            return {
              ...quest,
              status: savedQuest.s as QuestStatus,
              objectives: quest.objectives.map((obj) => {
                const savedCurrent = savedQuest.o?.[obj.id] ?? 0;
                return {
                  ...obj,
                  current: savedCurrent,
                  completed: savedCurrent >= obj.required,
                };
              }),
            };
          }

          return quest;
        });

        console.log('📜 任务进度已从存档恢复', {
          questCount: quests.value.length,
          activeQuestId: activeQuestId.value,
        });
      } catch (e) {
        console.error('任务存档解析失败', e);
      }
    }
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
    initialize,
  };
});
