import type { IConversationItem } from '@/interface/conversation';
import type { IItem } from '@/interface/item';
import type { CharacterType } from '@/enums';
import type { ICultivation } from './cultivation';

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
    dropList?: string[]; // 建议用 dropList 更语义化
    // 怪物被击败后给予的经验值奖励
    exp?: number;
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

  /**
   * 装备位映射：存储的是玩家背包中物品的 instanceId (唯一实例标识)
   * 对应原著：修真者通常拥有多件法宝，通过灵识打上烙印(instanceId)来精准操控。
   */
  equipmentSlots?: {
    /** 武器：如金蝶刀、吸精针、百雷弓等。攻击敌人的核心法宝 */
    weapon?: string;

    /** 仙甲(上衣)：仙甲的主体部分，如"满天星"的核心护甲，防御全身精要 */
    body?: string;

    /** 仙甲(下装)：保护下盘的甲胄，维持身法稳健 */
    leg?: string;

    /** 仙甲(头肩)：保护识海与肩部的部件，通常附带增强灵识的效果 */
    shoulder?: string;

    /** 仙甲(腰带)：束缚元气，通常也是悬挂储物法宝(如扣上纳芥手镯)的位置 */
    belt?: string;

    /** 仙甲(鞋履)：增强瞬移速度与闪避身法，如"星蝉翼"类靴子 */
    shoes?: string;
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
