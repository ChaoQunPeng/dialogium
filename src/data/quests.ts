import type { IQuest } from '@/interface/quest';
import { QuestType, QuestStatus, QuestObjectiveType } from '@/interface/quest';

/**
 * 初始任务数据配置
 */
export const initialQuests: IQuest[] = [
  {
    id: 'quest_001',
    name: '初入仙界',
    description: '与天庭星的接引仙人交谈，了解仙界的基本情况',
    type: QuestType.Main,
    status: QuestStatus.Available,
    npcId: 'npc_guide_001',
    sceneId: 'scene_tianting',
    objectives: [
      {
        id: 'obj_001_1',
        description: '与接引仙人交谈',
        type: QuestObjectiveType.Talk,
        target: 'fuShan',
        current: 0,
        required: 1,
        completed: false,
      },
    ],
    rewards: [
      { type: 'exp', amount: 100 },
      { type: 'currency', amount: 50 },
    ],
    prerequisites: [],
    repeatable: false,
  },
  {
    id: 'quest_002',
    name: '除魔卫道',
    description: '击败 3 只哥布林，保护村民的安全',
    type: QuestType.Side,
    status: QuestStatus.Locked,
    sceneId: 'scene_qianjie',
    objectives: [
      {
        id: 'obj_002_1',
        description: '击败哥布林',
        type: QuestObjectiveType.Kill,
        target: 'enemy_gebulin_001',
        current: 0,
        required: 3,
        completed: false,
      },
    ],
    rewards: [
      { type: 'item', id: 'item_potion_small', amount: 2 },
      { type: 'currency', amount: 30 },
      { type: 'exp', amount: 50 },
    ],
    prerequisites: ['quest_001'],
    repeatable: false,
  },
  {
    id: 'quest_003',
    name: '采集灵草',
    description: '收集 5 株灵草用于炼制丹药',
    type: QuestType.Side,
    status: QuestStatus.Locked,
    sceneId: 'scene_qianjie',
    objectives: [
      {
        id: 'obj_003_1',
        description: '收集灵草',
        type: QuestObjectiveType.Collect,
        target: 'material_lingcao',
        current: 0,
        required: 5,
        completed: false,
      },
    ],
    rewards: [
      { type: 'item', id: 'item_potion_medium', amount: 1 },
      { type: 'currency', amount: 40 },
    ],
    prerequisites: ['quest_001'],
    repeatable: false,
  },
  {
    id: 'quest_004',
    name: '日常修炼',
    description: '每日必做的修炼任务，击败 5 只怪物',
    type: QuestType.Daily,
    status: QuestStatus.Available,
    objectives: [
      {
        id: 'obj_004_1',
        description: '击败任意怪物',
        type: QuestObjectiveType.Kill,
        target: 'any',
        current: 0,
        required: 5,
        completed: false,
      },
    ],
    rewards: [
      { type: 'exp', amount: 80 },
      { type: 'currency', amount: 20 },
    ],
    prerequisites: [],
    repeatable: true,
  },
];
