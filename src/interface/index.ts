/**
 * 表示游戏场景的数据结构
 */
export interface Scene {
  /** 场景名称 */
  name: string;
  /** NPC 列表 */
  npcList: INpc[];
  /** 怪物列表 */
  monsterList: IMonster[];
}

/**
 * 表示游戏中NPC的数据结构
 * 包含名称和对话列表
 */
export interface INpc {
  __type: 'npc';
  /** NPC 名称 */
  name: string;
  /** 对话列表 */
  conversationList: IConversationItem[];
}

/**
 * 表示游戏中怪物的数据结构
 * 包含基本信息、战斗属性和掉落物品
 */
export interface IMonster {
  __type: 'monster';
  /** 怪物名称 */
  name: string;
  /** 对话列表 */
  conversationList: IConversationItem[];
  /** 怪物类型（如：elite精英怪，normal普通怪等） */
  type: string;
  /** 行为 battle,event,talk */
  action: string;
  /** 生命值 */
  hp: number;
  /** 攻击力 */
  attack: number;
  /** 防御力 */
  defense: number;
  /** 经验值 */
  exp: number;
  /** 等级 */
  level: number;
  /** 掉落物品列表 */
  dropList: IItem[];
  /** 权重值，影响出现概率 */
  weight: number;
}

/**
 * 表示单个对话项的数据结构
 * 包含类型和内容数组
 */
export interface IConversationItem {
  __type: 'conversationItem';
  /** 对话项类型（如：text文本，choice选择等） */
  type: string;
  /** 对话内容数组 */
  contentList: string[];
}

/**
 * 表示物品的数据结构
 * 包含ID、名称和数量
 */
export interface IItem {
  /** 物品唯一标识ID */
  id: string;
  /** 物品名称 */
  name: string;
  /** 物品数量 */
  count: number;
}

export interface IEquip {
  /** 装备ID */
  id: string;
  /** 装备名称 */
  name: string;
  /** 装备类型 */
  type: string;
  /** 装备等级 */
  level: number;
  /** 装备攻击力 */
  attack: number;
  /** 装备防御力 */
  defense: number;
  /** 装备价格 */
  price: number;
  /** 装备图标 */
  icon: string;
}

export interface ICultivation {
  /** 级别 */
  level: number;
  /** 当前经验 */
  currentExp: number;
  /** 境界 */
  realm: number;
}

export interface IPlayer {
  /** 玩家名称 */
  name: string;
  /** 生命值 */
  hp: number;
  /** 法力值 */
  mp: number;
  /** 攻击力 */
  atk: number;
  /** 防御力 */
  def: number;
  /** 修真者 */
  daoCultivation?: ICultivation;
  /** 修仙者 */
  immortalCultivation?: ICultivation;
  /** 修魔者 */
  demonicCultivation?: ICultivation;
  /** 修神者 */
  divineCultivation?: ICultivation;
}
