import { reactive, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import type { ICharacter, IItemInstance } from '@/interface';
import { CharacterType } from '@/enums';
import { items } from '@/items'; // 导入物品配置

// 1. 定义本地存储的 Key
const PLAYER_KEY = 'PMZL_PLAYER_DATA';
const INVENTORY_KEY = 'PMZL_PLAYER_ITEMS';

export const usePlayerStore = defineStore('player', () => {
  // --- 2. 状态初始化 (直接读本地，读不到就用默认值) ---

  // 玩家基础信息
  const localPlayer = localStorage.getItem(PLAYER_KEY);
  const defaultPlayer = {
    id: 'player',
    name: '李强',
    type: CharacterType.Player,
    baseInfo: {
      level: 1,
      hp: 100,
      maxHp: 100,
      mp: 50,
      maxMp: 50,
      cultivation: { realm: '凡人' },
    },
    battle: { attack: 10, defense: 10 },
  };
  const player = reactive<ICharacter>(localPlayer ? JSON.parse(localPlayer) : defaultPlayer);

  // 背包物品列表
  const localInventory = localStorage.getItem(INVENTORY_KEY);
  const inventory = ref<IItemInstance[]>(localInventory ? JSON.parse(localInventory) : []);

  // --- 3. 自动持久化 (只要数据变了，就存入本地) ---

  // 深度监听玩家属性
  watch(
    player,
    (newVal) => {
      localStorage.setItem(PLAYER_KEY, JSON.stringify(newVal));
    },
    { deep: true },
  );

  // 深度监听背包列表
  watch(
    inventory,
    (newVal) => {
      localStorage.setItem(INVENTORY_KEY, JSON.stringify(newVal));
    },
    { deep: true },
  );

  // --- 4. 业务操作 (Actions) ---

  /** 获得物品 */
  const acquireItem = (itemsToAdd: { itemId: string; count: number }[]) => {
    const finalItems = itemsToAdd.map((e) => {
      return {
        itemId: e.itemId,
        count: e.count,
        instanceId: crypto.randomUUID(),
        isEquipped: false,
        isLocked: false,
      };
    });

    inventory.value = [...inventory.value, ...finalItems];
  };

  /** 穿戴装备 */
  const equipItem = (instanceId: string): boolean => {
    try {
      // 查找要装备的物品
      const itemToEquip = inventory.value.find((item) => item.instanceId === instanceId);
      if (!itemToEquip) {
        console.warn('未找到要装备的物品');
        return false;
      }

      // 获取物品配置信息
      const itemConfig = items[itemToEquip.itemId];
      if (!itemConfig || itemConfig.category !== 'equipment' || !itemConfig.slot) {
        console.warn('物品不是装备或没有装备位');
        return false;
      }

      // 检查是否已经有相同部位的装备
      const existingEquippedItem = inventory.value.find(
        (item) => item.isEquipped && items[item.itemId]?.slot === itemConfig.slot,
      );

      // 如果有，先脱下原有装备
      if (existingEquippedItem) {
        unequipItem(existingEquippedItem.instanceId);
      }

      // 穿戴新装备
      itemToEquip.isEquipped = true;

      // 应用属性加成（如果有的话）
      if (itemConfig.stats) {
        if (itemConfig.stats.attack) {
          player.battle!.attack += itemConfig.stats.attack;
        }
        if (itemConfig.stats.defense) {
          player.battle!.defense += itemConfig.stats.defense;
        }
        if (itemConfig.stats.hp) {
          player.baseInfo.maxHp += itemConfig.stats.hp;
          // player.baseInfo.hp = Math.min(
          //   player.baseInfo.hp + itemConfig.stats.hp,
          //   player.baseInfo.maxHp,
          // );
        }
        if (itemConfig.stats.mp) {
          player.baseInfo.maxMp += itemConfig.stats.mp;
          // player.baseInfo.mp = Math.min(
          //   player.baseInfo.mp + itemConfig.stats.mp,
          //   player.baseInfo.maxMp,
          // );
        }
      }

      console.log(`成功装备: ${itemConfig.name}`);
      return true;
    } catch (error) {
      console.error('装备失败:', error);
      return false;
    }
  };

  /**
   * 脱下装备
   * @param instanceId 物品的唯一实例ID
   */
  const unequipItem = (instanceId: string): boolean => {
    try {
      const itemToUnequip = inventory.value.find((item) => item.instanceId === instanceId);
      if (!itemToUnequip || !itemToUnequip.isEquipped) {
        console.warn('未找到要脱下的装备');
        return false;
      }

      // 获取物品配置信息
      const itemConfig = items[itemToUnequip.itemId];
      if (!itemConfig) {
        console.warn('未找到物品配置');
        return false;
      }

      // 移除属性加成
      if (itemConfig.stats) {
        if (itemConfig.stats.attack) {
          player.battle!.attack -= itemConfig.stats.attack;
        }
        if (itemConfig.stats.defense) {
          player.battle!.defense -= itemConfig.stats.defense;
        }
        if (itemConfig.stats.hp) {
          player.baseInfo.maxHp -= itemConfig.stats.hp;
          player.baseInfo.hp = Math.min(player.baseInfo.hp, player.baseInfo.maxHp);
        }
        if (itemConfig.stats.mp) {
          player.baseInfo.maxMp -= itemConfig.stats.mp;
          player.baseInfo.mp = Math.min(player.baseInfo.mp, player.baseInfo.maxMp);
        }
      }

      // 设置为未装备状态
      itemToUnequip.isEquipped = false;

      console.log(`成功脱下: ${itemConfig.name}`);
      return true;
    } catch (error) {
      console.error('脱下装备失败:', error);
      return false;
    }
  };

  /** 丢弃物品 */
  const dropItem = (instanceId: string) => {
    inventory.value = inventory.value.filter((i) => i.instanceId !== instanceId);
  };

  return {
    player,
    inventory,
    acquireItem,
    equipItem,
    unequipItem,
    dropItem,
  };
});
