import type { ICharacter } from '@/interface/character';
import type { CharacterType } from '@/enums';
import type { IItem } from '@/interface/item';

/**
 * 哥布林怪物数据
 * 低级怪物，常出现在新手区域，攻击力较弱但数量众多
 */

// 哥布林的基础掉落物品
const goblinDropItems: IItem[] = [
  {
    id: 'goblin_tooth',
    name: '哥布林牙齿',
    category: 'material',
    count: 1,
    description: '哥布林的尖牙，散发着淡淡的绿光，可用来制作初级毒药',
    price: 5,
    grade: 1,
  },
  {
    id: 'goblin_hide',
    name: '哥布林皮',
    category: 'material',
    count: 1,
    description: '粗糙的绿色兽皮，韧性不错，可用于制作初级护甲',
    price: 8,
    grade: 1,
  },
  {
    id: 'small_health_potion',
    name: '小型回血丹',
    category: 'consumable',
    count: 1,
    description: '初级疗伤丹药，能够恢复少量气血',
    price: 15,
    grade: 1,
    useAction: {
      hpRestore: 50,
      isConsumable: true,
    },
  },
];

// 精英哥布林额外掉落
const eliteGoblinDropItems: IItem[] = [
  ...goblinDropItems,
  {
    id: 'goblin_ear_ring',
    name: '哥布林耳环',
    category: 'equipment',
    count: 1,
    description: '哥布林首领佩戴的耳环，镶嵌着微弱的灵石',
    price: 50,
    grade: 2,
    stats: {
      attack: 10,
      defense: 5,
    },
  },
];

// 哥布林怪物实例
export const goblinMonster: ICharacter = {
  // 核心标识
  id: 'monster_goblin_001',
  name: '哥布林',
  type: 'monster' as CharacterType,

  // 基础信息
  baseInfo: {
    level: 3,
    hp: 80,
    maxHp: 80,
    mp: 20,
    maxMp: 20,
  },

  // 战斗相关
  battle: {
    attack: 15,
    defense: 8,
    dropList: goblinDropItems,
  },

  // 对话相关（怪物通常没有对话）
  conversations: [],

  // 交互相关
  interact: {
    canTalk: false,
  },

  // 装备槽（怪物一般没有装备）
  equipmentSlots: {},
};

// 精英哥布林
export const eliteGoblin: ICharacter = {
  // 核心标识
  id: 'monster_goblin_elite_001',
  name: '精英哥布林',
  type: 'monster' as CharacterType,

  // 基础信息
  baseInfo: {
    level: 5,
    hp: 150,
    maxHp: 150,
    mp: 40,
    maxMp: 40,
  },

  // 战斗相关
  battle: {
    attack: 25,
    defense: 15,
    dropList: eliteGoblinDropItems,
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

// 哥布林首领
export const goblinChief: ICharacter = {
  // 核心标识
  id: 'monster_goblin_chief_001',
  name: '哥布林首领',
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
    dropList: [
      ...eliteGoblinDropItems,
      {
        id: 'chief_axe',
        name: '首领战斧',
        category: 'equipment',
        count: 1,
        description: '哥布林首领的巨型战斧，斧刃闪烁着寒光',
        price: 200,
        grade: 3,
        stats: {
          attack: 50,
          defense: 10,
        },
      },
    ],
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
