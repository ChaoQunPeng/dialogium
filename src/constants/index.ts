/**
 * 玩家相关常量配置
 */

import { CharacterType } from '@/enums';
import type { ICharacter, IItemInstance } from '@/interface';

// 本地存储键名
export const STORAGE_KEYS = {
  /** 玩家基础数据存储键 */
  PLAYER_DATA: 'PD',
  /** 玩家背包物品存储键 */
  PLAYER_ITEMS: 'PI',
  /** 玩家任务进度存储键 */
  PLAYER_QUESTS: 'PQ',
  /** 完整存档导出键 */
  SAVE_FILE: 'dialogium_save',
} as const;

// 默认玩家配置
export const DEFAULT_PLAYER_CONFIG = {
  id: 'player',
  name: '李强',
  type: CharacterType.Player,
  baseInfo: {
    level: 1,
    currentExp: 0,
    totalExp: 0,
    hp: 100,
    maxHp: 100,
    mp: 0,
    maxMp: 0,
  },
  battle: { attack: 10, defense: 10 },
  currency: 1000, // 初始货币：灵石
} as ICharacter;

/** 默认玩家背包物品 */
export const initialItems: IItemInstance[] = [
  {
    id: crypto.randomUUID(),
    mid: 'zi_yan_xin', // 对应你静态配置表中的 ID
    n: 1,
    e: 1, // 紫炎心是入体的，默认就是激活/穿戴状态
    l: 1, // 核心至宝，锁定防止误删
  },
  {
    id: crypto.randomUUID(),
    mid: 'man_tian_xin_body',
    n: 1,
    e: 1,
    l: 1,
  },
  {
    id: crypto.randomUUID(),
    mid: 'man_tian_xin_shoulder',
    n: 1,
    e: 1,
    l: 1,
  },
  {
    id: crypto.randomUUID(),
    mid: 'man_tian_xin_belt',
    n: 1,
    e: 1,
    l: 1,
  },
  {
    id: crypto.randomUUID(),
    mid: 'man_tian_xin_leg',
    n: 1,
    e: 1,
    l: 1,
  },
  {
    id: crypto.randomUUID(),
    mid: 'man_tian_xin_shoes',
    n: 1,
    e: 1,
    l: 1,
  },
];
