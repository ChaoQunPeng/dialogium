import type {
  CharacterType,
  CultivationType,
  DaoRealms,
  DemonicRealms,
  DivineRealms,
  ImmortalRealms,
} from '@/enums';

/**
 * 表示游戏场景的数据结构
 */
export interface Scene {
  /** 场景唯一标识 */
  id: string;
  /** 场景名称 */
  name: string;
  /** 出现的角色 */
  characters: ICharacter[];
}

// 定义特定修炼路径的境界信息
export interface IDaoCultivation {
  type: CultivationType.Dao;
  /** 级别 */
  level: number;
  /** 当前经验 */
  currentExp: number;
  /** 境界 */
  realm: DaoRealms;
  // subStage?: 'early' | 'middle' | 'late' | 'peak'; // 子阶段
}

export interface IImmortalCultivation {
  type: CultivationType.Immortal;
  /** 级别 */
  level: number;
  /** 当前经验 */
  currentExp: number;
  /** 境界 */
  realm: ImmortalRealms;
}

export interface IDemonicCultivation {
  type: CultivationType.Demonic;
  /** 级别 */
  level: number;
  /** 当前经验 */
  currentExp: number;
  /** 境界 */
  realm: DemonicRealms;
}

export interface IDivineCultivation {
  type: CultivationType.Divine;
  /** 级别 */
  level: number;
  /** 当前经验 */
  currentExp: number;
  /** 境界 */
  realm: DivineRealms;
}

// 使用联合类型表示具体的修炼状态
export type ICultivation =
  | IDaoCultivation
  | IImmortalCultivation
  | IDemonicCultivation
  | IDivineCultivation;

/**
 * 统一的游戏角色接口
 */
export interface ICharacter {
  // 核心标识
  id: string; // 建议加上唯一ID
  name: string;
  type: CharacterType;

  // 基础信息（所有角色都有）
  baseInfo: {
    level: number;
    // 生命值
    hp: number; // 当前生命值
    maxHp: number; // 最大生命值

    // 法力值（可选）
    mp: number; // 当前法力值
    maxMp: number; // 最大法力值

    // 经验值
    // exp: number; // 当前经验值
    // expToNextLevel?: number; // 下一级所需经验

    cultivation?: ICultivation;
  };

  // 战斗相关（可选）
  battle?: {
    attack: number;
    defense: number;
    // magicAttack?: number;
    // magicDefense?: number;
    // speed?: number;
    // critRate?: number;
    dropList?: IItem[]; // 建议用 dropList 更语义化
    // dropRate?: number; // 掉落概率
    // skills?: ISkill[]; // 技能列表
  };

  conversations?: IConversationItem[];

  // 交互相关（可选）
  interact?: {
    canTalk: boolean; // 明确标记是否能对话
    quests?: string[]; // 关联的任务ID
    services?: ('shop' | 'repair' | 'train')[]; // 提供的服务
    shopItems?: IItem[]; // 如果是商人
  };

  // 位置信息（游戏内定位）
  // position?: {
  //   sceneId: string;
  //   x: number;
  //   y: number;
  //   rotation?: number;
  // };

  // 外观/表现层
  // appearance?: {
  //   model: string;
  //   texture?: string;
  //   scale?: number;
  //   color?: string;
  //   animations?: string[];
  // };

  // 状态/效果
  // status?: {
  //   isDead?: boolean;
  //   isInCombat?: boolean;
  //   buffs?: IBuff[];
  //   debuffs?: IDebuff[];
  // };
}

/** 统一物品接口：采用组合模式 */
export interface IItem {
  // --- 核心标识 ---
  id: string;
  name: string;
  category: 'equipment' | 'consumable' | 'material' | 'quest';
  count: number;

  // --- 表现层 (UI用) ---
  icon?: string;
  description?: string;
  price?: number;

  // --- 组合属性模块 (Components) ---

  /** 装备/数值组件：如果物品有属性加成，就填入此项 */
  stats?: {
    level?: number;
    attack?: number;
    defense?: number;
    hpMax?: number;
    mpMax?: number;
    /** 装备位：头部、身体、武器等 */
    slot?: 'head' | 'body' | 'weapon' | 'accessory';
  };

  /** 消耗组件：如果物品可以被使用（吃药、开礼包） */
  useAction?: {
    /** 恢复值 */
    hpRestore?: number;
    mpRestore?: number;
    /** 触发的脚本ID或效果代码 */
    effectId?: string;
    /** 使用后是否消失（消耗数量） */
    isConsumable: boolean;
  };

  /** 修仙/特殊组件：存储特定逻辑数据 */
  meta?: {
    realmReq?: number; // 境界要求
    rarity?: string; // 稀有度颜色
    isLocked?: boolean; // 是否绑定
  };
}

/**
 * 表示单个对话项的数据结构
 * 包含类型和内容数组
 */
export interface IConversationItem {
  /** 对话项类型（如：text文本，choice选择等） */
  type: string;
  /** 对话内容数组 */
  contentList: string[];
}
