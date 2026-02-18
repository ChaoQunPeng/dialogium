/**
 * 物品分类类型
 * equipment: 装备, consumable: 消耗品/丹药, material: 材料, quest: 任务道具
 */
export type ItemCategory = 'equipment' | 'consumable' | 'material' | 'quest';

/**
 * 装备位类型
 * weapon: 武器, body: 身体, leg: 腿部, shoulder: 肩部, belt: 腰带, shoes: 鞋子, accessory: 饰品, innerAlchemy: 内丹
 */
export type SlotType =
  | 'weapon'
  | 'body'
  | 'leg'
  | 'shoulder'
  | 'belt'
  | 'shoes'
  | 'accessory'
  | 'innerAlchemy';

/**
 * 物品数值属性接口
 * 全部设为可选，因为不是所有物品都有战斗加成
 */
export interface IItemStats {
  attack?: number; // 攻击力 / 真火威力
  defense?: number; // 防御力 / 仙甲防护
  hp?: number; // 气血加成
  mp?: number; // 灵力加成
  speed?: number; // 速度 / 身法
  crit?: number; // 暴击
}

/**
 * 核心物品配置接口
 */
export interface IItemConfig {
  id: string; // 唯一标识符 (与 Key 保持一致)
  name: string; // 物品名称
  category: ItemCategory; // 物品大类
  description: string; // 物品描述 (原著背景)
  slot?: SlotType; // 装备位 (可选，材料/丹药可无)
  level: number; // 需求等级 / 物品品阶
  price: number; // 价值 (0 为不可交易/至宝)
  stackable: boolean; // 是否可堆叠 (丹药/材料 true, 装备 false)
  stats?: IItemStats; // 数值属性对象
  setTag?: string; // 套装标识 (同套装的装备共享此标签)
}
