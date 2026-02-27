import { computed, reactive, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import type { ICharacter, IItemInstance } from '@/interface';
import { items } from '@/items'; // 导入物品配置
import { STORAGE_KEYS, DEFAULT_PLAYER_CONFIG } from '@/constants';

export const usePlayerStore = defineStore('player', () => {
  // --- 1. 数据初始化 (State) ---

  // 玩家基础信息
  const getInitialPlayer = (): ICharacter => {
    const local = localStorage.getItem(STORAGE_KEYS.PLAYER_DATA);
    if (!local) return { ...DEFAULT_PLAYER_CONFIG };
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error('玩家存档解析失败，加载默认配置', e);
      return { ...DEFAULT_PLAYER_CONFIG };
    }
  };

  const player = reactive<ICharacter>(getInitialPlayer());

  // 背包物品列表
  const getInitialInventory = (): IItemInstance[] => {
    const local = localStorage.getItem(STORAGE_KEYS.PLAYER_ITEMS);
    if (!local) return [];
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error('背包存档解析失败', e);
      return [];
    }
  };

  const inventory = ref<IItemInstance[]>(getInitialInventory());

  // --- 2. 核心计算属性 (Getters) ---

  /** * 装备提供的总加成
   * 这种写法保证了属性永远根据当前装备动态计算，不会存入存档导致叠加错误
   */
  const equipmentStats = computed(() => {
    const stats = { attack: 0, defense: 0, maxHp: 0, maxMp: 0 };

    inventory.value.forEach((item) => {
      if (item.isEquipped) {
        const config = items[item.itemId];
        if (config?.stats) {
          stats.attack += config.stats.attack || 0;
          stats.defense += config.stats.defense || 0;
          stats.maxHp += config.stats.maxHp || 0;
          stats.maxMp += config.stats.maxMp || 0;
        }
      }
    });

    return stats;
  });

  /** 最终战斗面板 (基础属性 + 装备加成) */
  const finalStats = computed(() => {
    return {
      attack: (player.battle?.attack || 0) + equipmentStats.value.attack,
      defense: (player.battle?.defense || 0) + equipmentStats.value.defense,
      maxHp: (player.baseInfo?.maxHp || 0) + equipmentStats.value.maxHp,
      maxMp: (player.baseInfo?.maxMp || 0) + equipmentStats.value.maxMp,
      // hp: (player.baseInfo?.hp || 0) + equipmentStats.value.hp,
      // mp: (player.baseInfo?.mp || 0) + equipmentStats.value.mp,
    };
  });

  const realmData = computed(() => {
    // 这里未来可以根据 player.baseInfo.level 动态计算
    return { zh: '凡人', en: 'Mortal', color: '#bbb' };
  });

  // --- 3. 持久化监听 ---

  watch(
    player,
    (nv) => {
      localStorage.setItem(STORAGE_KEYS.PLAYER_DATA, JSON.stringify(nv));
    },
    { deep: true },
  );

  watch(
    inventory,
    (nv) => {
      localStorage.setItem(STORAGE_KEYS.PLAYER_ITEMS, JSON.stringify(nv));
    },
    { deep: true },
  );

  // --- 4. 业务逻辑 (Actions) ---

  /** 获得物品 */
  const acquireItem = (itemsToAdd: { itemId: string; count: number }[]) => {
    const newInstances = itemsToAdd.map((e) => ({
      itemId: e.itemId,
      count: e.count,
      instanceId: crypto.randomUUID().replace(/-/g, ''),
      isEquipped: false,
      isLocked: false,
    }));

    inventory.value = [...inventory.value, ...newInstances];
  };

  /** 穿戴装备 */
  const equipItem = (instanceId: string): boolean => {
    const itemToEquip = inventory.value.find((i) => i.instanceId === instanceId);
    if (!itemToEquip) return false;

    const itemConfig = items[itemToEquip.itemId];
    if (itemConfig?.category !== 'equipment' || !itemConfig.slot) return false;

    // 自动脱下同部位装备：将所有同 slot 的装备设为未装备
    inventory.value.forEach((item) => {
      const config = items[item.itemId];
      if (item.isEquipped && config?.slot === itemConfig.slot) {
        item.isEquipped = false;
      }
    });

    // 穿上目标装备
    itemToEquip.isEquipped = true;
    return true;
  };

  /** 脱下装备 */
  const unequipItem = (instanceId: string): boolean => {
    const item = inventory.value.find((i) => i.instanceId === instanceId);
    if (item) {
      item.isEquipped = false;
      return true;
    }
    return false;
  };

  /** 丢弃物品 */
  const dropItem = (instanceId: string) => {
    inventory.value = inventory.value.filter((i) => i.instanceId !== instanceId);
  };

  return {
    player,
    inventory,
    finalStats, // 建议 UI 绑定这个属性显示面板
    realmData,
    acquireItem,
    equipItem,
    unequipItem,
    dropItem,
  };
});
