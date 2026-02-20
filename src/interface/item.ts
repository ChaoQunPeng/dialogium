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
 * 物品分类类型
 * equipment: 装备, consumable: 消耗品/丹药, material: 材料, quest: 任务道具
 */
export type ItemCategory = 'equipment' | 'consumable' | 'material' | 'quest';

export type ItemGrade = 'Normal' | 'Advanced' | 'Rare' | 'Artifact' | 'Epic' | 'Legendary';

/** 统一物品接口：采用组合模式 */
export interface IItem {
  // --- 核心标识 ---
  id: string;
  name: string;
  category: ItemCategory;
  count?: number;

  // --- 表现层 (UI用) ---
  icon?: string;
  description?: string;
  price?: number;
  grade?: ItemGrade; // 品质

  // --- 物品配置属性 (从原来的IItemConfig迁移) ---
  slot?: SlotType; // 装备位 (可选，材料/丹药可无)
  level?: number; // 需求等级 / 物品品阶
  stackable?: boolean; // 是否可堆叠 (丹药/材料 true, 装备 false)
  setTag?: string; // 套装标识 (同套装的装备共享此标签)

  // --- 组合属性模块 (Components) ---
  /** 装备/数值组件：如果物品有属性加成，就填入此项 */
  stats?: {
    level?: number;
    attack?: number;
    defense?: number;
    hp?: number; // 气血加成
    mp?: number; // 灵力加成
    /** 装备位：头部、身体、武器等 */
    slot?: SlotType;
    speed?: number; // 速度 / 身法
    crit?: number; // 暴击
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
}

/** * 玩家拥有的物品实例,即背包（存档数据）
 * 对应数据库中的 PLAYER_TO_ITEMS 关联记录
 */
export interface IItemInstance {
  /** 唯一实例标识，用于区分两把相同的剑 (如：uuid 或 Date.now().toString()) */
  instanceId: string;

  /** 指向系统静态配置表中的物品 ID (BASE_ITEMS_CONFIG) */
  itemId: string;

  /** 持有数量：堆叠类物品有效 */
  count: number;

  /** 是否正穿戴在身上：仅装备类有效 */
  isEquipped: boolean;

  /** 锁定状态：防止误丢弃、误出售、误作为炼丹材料 */
  isLocked: boolean;

  /** * 扩展：可以在此记录玩家个性化属性
   * 如：自定义名称、强化等级、耐久度等
   */
  // customName?: string;
  // level?: number;
}

// 定义库存物品的展示格式
export interface IInventoryItem {
  id: string;
  name: string;
  category: string;
  description: string;
  slot: string;
  level: number;
  price: number;
  stackable: boolean;
  grade: ItemGrade;
  // stats: IItemStats;
  // 用户数据
  count: number;
  isLocked: boolean;
  isEquipped: boolean;
  instanceId: string; // 修正类型为string
}
