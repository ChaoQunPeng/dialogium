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
  // 品质
  grade?: number;

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
}

/** * 玩家拥有的物品实例（存档数据）
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
