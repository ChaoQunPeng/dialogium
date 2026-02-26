import type { ICharacter } from '@/interface/character';
import type { CharacterType } from '@/enums';

// 黑狱兵怪物实例
export const goblinMonster: ICharacter = {
  // 核心标识
  id: 'monster_goblin_001',
  name: '黑狱兵',
  type: 'monster' as CharacterType,

  // 基础信息
  baseInfo: {
    level: 3,
    hp: 8000,
    maxHp: 80,
    mp: 20,
    maxMp: 20,
  },

  // 战斗相关
  battle: {
    attack: 15,
    defense: 8,
    dropList: ['goblin_tooth', 'goblin_skin'],
    // 经验值奖励
    exp: 25,
  },

  // 对话相关（怪物通常没有对话）
  conversations: [],

  // 交互相关
  interact: {
    canTalk: false,
  },
};

// 精英黑狱兵
export const eliteGoblin: ICharacter = {
  // 核心标识
  id: 'monster_goblin_elite_001',
  name: '精英黑狱兵',
  type: 'monster' as CharacterType,

  // 基础信息
  baseInfo: {
    level: 5,
    hp: 1500,
    maxHp: 1500,
    mp: 40,
    maxMp: 40,
  },

  // 战斗相关
  battle: {
    attack: 25,
    defense: 15,
    dropList: [],
    // 经验值奖励
    exp: 50,
  },

  // 对话相关
  conversations: [],

  // 交互相关
  interact: {
    canTalk: false,
  },

  // 装备槽
  equipmentSlots: {},
};

// 黑狱兵首领
export const goblinChief: ICharacter = {
  // 核心标识
  id: 'monster_goblin_chief_001',
  name: '黑狱兵首领',
  type: 'boss' as CharacterType,

  // 基础信息
  baseInfo: {
    level: 8,
    hp: 300,
    maxHp: 300,
    mp: 80,
    maxMp: 80,
  },

  // 战斗相关
  battle: {
    attack: 40,
    defense: 25,
    dropList: [],
    // 经验值奖励
    exp: 100,
  },

  // 对话相关
  conversations: [],

  // 交互相关
  interact: {
    canTalk: false,
  },

  // 装备槽
  equipmentSlots: {
    weapon: 'chief_axe_instance',
  },
};

export default {
  goblinMonster,
  eliteGoblin,
  goblinChief,
};
