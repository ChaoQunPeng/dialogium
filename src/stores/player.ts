import { reactive, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import type { ICharacter, IItemInstance } from '@/interface';
import { CharacterType } from '@/enums';

// 1. 定义本地存储的 Key
const PLAYER_KEY = 'PMZL_PLAYER_DATA';
const INVENTORY_KEY = 'PMZL_PLAYER_ITEMS';

export const usePlayerStore = defineStore('player', () => {
  // --- 2. 状态初始化 (直接读本地，读不到就用默认值) ---

  // 玩家基础信息
  const localPlayer = localStorage.getItem(PLAYER_KEY);
  const player = reactive<ICharacter>(
    localPlayer
      ? JSON.parse(localPlayer)
      : {
          id: 'player',
          name: '李强',
          type: CharacterType.Player,
          baseInfo: { level: 1, hp: 100, maxHp: 100, mp: 50, maxMp: 50 },
          battle: { attack: 10, defense: 10 },
        },
  );

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
  const acquireItem = (items: { itemId: string; count: number }[]) => {
    const finalItems = items.map((e) => {
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

  /** 丢弃物品 */
  const dropItem = (instanceId: string) => {
    inventory.value = inventory.value.filter((i) => i.instanceId !== instanceId);
  };

  return {
    player,
    inventory,
    acquireItem,
    dropItem,
  };
});
