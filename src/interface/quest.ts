/**
 * 任务类型枚举
 */
export enum QuestType {
  /** 主线任务 - 推动剧情发展 */
  Main = 'main',
  /** 支线任务 - 补充剧情或额外奖励 */
  Side = 'side',
  /** 日常任务 - 每日可重复完成 */
  Daily = 'daily',
}

/**
 * 任务状态枚举
 */
export enum QuestStatus {
  /** 已锁定 - 尚未满足解锁条件 */
  Locked = 'locked',
  /** 可接受 - 可以接取的任务 */
  Available = 'available',
  /** 进行中 - 玩家已接受并正在进行 */
  InProgress = 'inProgress',
  /** 已完成 - 目标已全部完成，待领取奖励 */
  Completed = 'completed',
  /** 已领取 - 奖励已领取，任务结束 */
  Claimed = 'claimed',
}

/**
 * 任务目标类型
 */
export enum QuestObjectiveType {
  /** 击杀怪物 */
  Kill = 'kill',
  /** 收集物品 */
  Collect = 'collect',
  /** 与 NPC 交谈 */
  Talk = 'talk',
  /** 探索场景 */
  Explore = 'explore',
  /** 购买物品 */
  Purchase = 'purchase',
  /** 击败 Boss */
  DefeatBoss = 'defeatBoss',
}

/**
 * 任务目标接口
 */
export interface IQuestObjective {
  /** 目标唯一 ID */
  id: string;
  /** 目标描述（显示给玩家看） */
  description: string;
  /** 目标类型 */
  type: QuestObjectiveType;
  /** 目标对象（怪物 ID、物品 ID、NPC ID 等） */
  target: string;
  /** 当前进度 */
  current: number;
  /** 需要完成的数量 */
  required: number;
  /** 是否已完成 */
  completed: boolean;
}

/**
 * 任务奖励接口
 */
export interface IQuestReward {
  /** 奖励类型 */
  type: 'item' | 'currency' | 'exp';
  /** 物品 ID（仅当 type='item' 时需要） */
  id?: string;
  /** 数量/数值 */
  amount: number;
}

/**
 * 任务接口
 */
export interface IQuest {
  /** 任务唯一 ID */
  id: string;
  /** 任务名称 */
  name: string;
  /** 任务详细描述 */
  description: string;
  /** 任务类型 */
  type: QuestType;
  /** 当前状态 */
  status: QuestStatus;
  /** 任务目标列表 */
  objectives: IQuestObjective[];
  /** 任务奖励列表 */
  rewards: IQuestReward[];
  /** 关联的 NPC ID（发布任务的 NPC） */
  npcId?: string;
  /** 关联的场景 ID */
  sceneId?: string;
  /** 前置任务 ID 数组（为空表示无前置要求） */
  prerequisites?: string[];
  /** 任务完成后是否可再次接受（用于日常任务） */
  repeatable?: boolean;
}
