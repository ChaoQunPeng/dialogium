import type { IItemInstance } from '@interface/index'; // 确保你之前定义的接口已导出

const STORAGE_KEY = 'PMZL_PLAYER_ITEMS';

/**
 * 飘邈之旅：玩家数据初始化
 * 对应原著：李强在火星地下，被傅山改造肉身，植入“紫炎心”
 */
export const initializePlayerData = () => {
  // 1. 检查本地是否已经有数据，防止覆盖玩家进度
  const existingData = localStorage.getItem(STORAGE_KEY);
  if (existingData) {
    console.log('检测到已有识海记录，跳过初始化。');
    return;
  }

  /**
   * 2. 创建初始物品：紫炎心
   * 在原著中，紫炎心不仅是能量源，更是李强炼器的核心。
   * 这里我们给它分配一个唯一的 instanceId。
   */
  const initialItems: IItemInstance[] = [
    {
      instanceId: `inst_origin_ziyanxin_${Date.now()}`,
      itemId: 'zi_yan_xin', // 对应你静态配置表中的 ID
      count: 1,
      isEquipped: true, // 紫炎心是入体的，默认就是激活/穿戴状态
      isLocked: true, // 核心至宝，锁定防止误删
    },
  ];

  // 3. 写入 LocalStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialItems));
    console.log('【天道提示】：紫炎真火入体，识海已开，修真之路开启。');
  } catch (e) {
    console.error('初始化识海失败：', e);
  }
};
