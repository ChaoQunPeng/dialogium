import { ref, type Ref } from 'vue';
import type { IItemConfig, IItemStats } from '../items/interface'; // 请根据你的实际路径调整

/**
 * 背包物品实例：在配置基础上增加 count 属性
 */
export interface IItemStack extends IItemConfig {
  count: number;
}

/**
 * 玩家状态接口
 */
export interface IPlayerState {
  inventory: IItemStack[];
  gold: number;
  maxSlots: number;
}

/**
 * 物品管理自定义 Hook
 * 适配 Vue 3 的响应式系统
 */
export function useItemManager() {
  /**
   * 1. 获取物品
   */
  const acquireItem = (item: IItemConfig, amount: number = 1): boolean => {
    if (amount <= 0) return false;

    // 逻辑：处理堆叠
    if (item.stackable) {
      const existingItem = playerState.value.inventory.find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.count += amount;
        return true;
      }
    }

    // 逻辑：检查格子
    if (playerState.value.inventory.length >= playerState.value.maxSlots) {
      console.warn('背包已满！');
      return false;
    }

    // 添加新实例
    playerState.value.inventory.push({ ...item, count: amount });
    return true;
  };

  /**
   * 2. 丢弃物品
   */
  const dropItem = (itemId: string, amount: number = 1): boolean => {
    const index = playerState.value.inventory.findIndex((i) => i.id === itemId);
    if (index === -1) return false;

    const item = playerState.value.inventory[index];
    if (item.count < amount) return false;

    item.count -= amount;
    if (item.count <= 0) {
      playerState.value.inventory.splice(index, 1);
    }
    return true;
  };

  /**
   * 3. 出售物品
   */
  const sellItem = (itemId: string, amount: number = 1): boolean => {
    const index = playerState.value.inventory.findIndex((i) => i.id === itemId);
    if (index === -1) return false;

    const item = playerState.value.inventory[index];

    // 《飘邈之旅》逻辑：价格为 0 的属于任务道具或至宝，不可出售
    if (item.price <= 0) {
      alert(`${item.name} 乃修真重宝，不可轻易舍弃！`);
      return false;
    }

    if (item.count < amount) return false;

    const totalGold = item.price * amount;

    // 先扣物品，成功后再加钱
    if (dropItem(itemId, amount)) {
      playerState.value.gold += totalGold;
      return true;
    }

    return false;
  };

  return {
    acquireItem,
    dropItem,
    sellItem,
  };
}
