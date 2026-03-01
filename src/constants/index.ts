/**
 * 玩家相关常量配置
 */

import { CharacterType } from '@/enums';
import type { ICharacter, IItemInstance } from '@/interface';

// 本地存储键名
export const STORAGE_KEYS = {
  /** 玩家基础数据存储键 */
  PLAYER_DATA: 'DIALOGIUM_PLAYER_DATA',
  /** 玩家背包物品存储键 */
  PLAYER_ITEMS: 'DIALOGIUM_PLAYER_ITEMS',
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
} as ICharacter;

/** 默认玩家背包物品 */
export const initialItems: IItemInstance[] = [
  {
    instanceId: crypto.randomUUID(),
    itemId: 'zi_yan_xin', // 对应你静态配置表中的 ID
    count: 1,
    isEquipped: true, // 紫炎心是入体的，默认就是激活/穿戴状态
    isLocked: true, // 核心至宝，锁定防止误删
  },
  {
    instanceId: crypto.randomUUID(),
    itemId: 'man_tian_xin_body',
    count: 1,
    isEquipped: true,
    isLocked: true,
  },
  {
    instanceId: crypto.randomUUID(),
    itemId: 'man_tian_xin_shoulder',
    count: 1,
    isEquipped: true,
    isLocked: true,
  },
  {
    instanceId: crypto.randomUUID(),
    itemId: 'man_tian_xin_belt',
    count: 1,
    isEquipped: true,
    isLocked: true,
  },
  {
    instanceId: crypto.randomUUID(),
    itemId: 'man_tian_xin_leg',
    count: 1,
    isEquipped: true,
    isLocked: true,
  },
  {
    instanceId: crypto.randomUUID(),
    itemId: 'man_tian_xin_shoes',
    count: 1,
    isEquipped: true,
    isLocked: true,
  },
];
