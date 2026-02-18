import type { IItemInstance } from '@interface/index';

const ITEMS_KEY = 'PMZL_PLAYER_ITEMS';

/**
 * 【纯函数】从本地读取所有物品
 */
export const getLocalItems = (): IItemInstance[] => {
  const data = localStorage.getItem(ITEMS_KEY);
  if (!data) return [];
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error(' [Storage] 解析物品数据失败:', e);
    return [];
  }
};

/**
 * 【纯函数】全量保存物品到本地
 * 注意：此函数不关心业务，只负责把传入的数组存起来
 */
export const saveLocalItems = (items: IItemInstance[]): void => {
  try {
    localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
  } catch (e) {
    console.error(' [Storage] 保存物品数据失败:', e);
  }
};

/**
 * 【业务函数】角色获取新物品
 * 逻辑：读取旧背包 -> 生成新实例 -> 合并 -> 保存
 */
export const playerAcquireItems = (newItems: { itemId: string; count: number }[]): void => {
  // 1. 先取出当前已有的物品
  const currentItems = getLocalItems();

  // 2. 将新物品转化为带 UUID 的实例
  const instances: IItemInstance[] = newItems.map((e) => ({
    itemId: e.itemId,
    count: e.count,
    instanceId: crypto.randomUUID(),
    isEquipped: false,
    isLocked: false,
  }));

  // 3. 合并新旧数据 (这里是关键：保留旧的，追加新的)
  const finalItems = [...currentItems, ...instances];

  // 4. 全量写入
  saveLocalItems(finalItems);
};

/**
 * 3. 丢弃物品 (根据唯一实例ID)
 */
export const playerDropItem = (instanceId: string): void => {
  const currentItems = getLocalItems();
  // 过滤掉那个要丢弃的实例
  const remainItems = currentItems.filter((item) => item.instanceId !== instanceId);
  saveLocalItems(remainItems);
};

/**
 * 清空存档
 */
export const clearAllPlayerData = (): void => {
  localStorage.removeItem(ITEMS_KEY);
};
