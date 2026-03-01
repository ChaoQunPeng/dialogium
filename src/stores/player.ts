import { computed, reactive, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import type { ICharacter, IItemInstance } from '@/interface';
import { items } from '@/items'; // 导入物品配置
import { STORAGE_KEYS, DEFAULT_PLAYER_CONFIG } from '@/constants';
import { clamp } from '@/utils/utils';
import { formatLevel, getRealmConfig, getRequiredExp } from '@/utils/levelManager';

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
      if (item.e) {
        const config = items[item.mid];
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
    };
  });

  /** 3. 核心：战斗就绪对象 (关键重构) */
  const finalPlayer = computed<ICharacter>(() => {
    // 这里使用深度克隆或结构赋值，确保不污染原始 state
    return {
      ...player,
      baseInfo: {
        ...player.baseInfo,
        // 关键：战斗系统使用的是最终计算后的上限
        maxHp: finalStats.value.maxHp,
        maxMp: finalStats.value.maxMp,
        // 当前血量依然使用 state 中的值
        hp: player.baseInfo.hp,
        mp: player.baseInfo.mp,
      },
      battle: {
        ...player.battle,
        // 关键：将装备攻击力合并进去
        attack: finalStats.value.attack,
        defense: finalStats.value.defense,
      },
    };
  });

  const realm = computed(() => {
    return formatLevel(player.baseInfo.level);
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
      mid: e.itemId,
      n: e.count,
      id: crypto.randomUUID().replace(/-/g, ''),
      e: 0,
      l: 0,
    }));

    inventory.value = [...inventory.value, ...newInstances];
  };

  /** 穿戴装备 */
  const equipItem = (instanceId: string): boolean => {
    const itemToEquip = inventory.value.find((i) => i.id === instanceId);
    if (!itemToEquip) return false;

    const itemConfig = items[itemToEquip.mid];
    if (itemConfig?.category !== 'equipment' || !itemConfig.slot) return false;

    // 自动脱下同部位装备：将所有同 slot 的装备设为未装备
    inventory.value.forEach((item) => {
      const config = items[item.mid];
      if (item.e && config?.slot === itemConfig.slot) {
        item.e = 0;
      }
    });

    // 穿上目标装备
    itemToEquip.e = 1;
    return true;
  };

  /** 脱下装备 */
  const unequipItem = (instanceId: string): boolean => {
    const item = inventory.value.find((i) => i.id === instanceId);
    if (item) {
      item.e = 0;
      return true;
    }
    return false;
  };

  /** 丢弃物品 */
  const dropItem = (instanceId: string) => {
    inventory.value = inventory.value.filter((i) => i.id !== instanceId);
  };

  /**
   * 回复血量方法
   * @param amount 回复的数值
   * @param isPercentage 是否是按百分比回复 (默认 false)
   */
  const healHp = (amount: number, isPercentage: boolean = false) => {
    const maxHp = finalStats.value.maxHp;
    let healValue = amount;

    if (isPercentage) {
      // 如果是百分比，则根据当前最大生命值计算
      healValue = Math.floor(maxHp * (amount / 100));
    }

    // 使用之前定义的 setHp 逻辑，确保血量不溢出且触发响应式
    setHp(player.baseInfo.hp + healValue);

    // 可扩展：返回实际回复的数值，方便 UI 显示“+100”字样
    return healValue;
  };

  /** 直接设置血量（特殊情况下使用）*/
  const setHp = (newHp: number) => {
    player.baseInfo.hp = clamp(newHp, 0, finalStats.value.maxHp);
  };

  /**
   * 扣除血量方法（受击处理）
   * @param damage 伤害数值
   * @param options 扩展选项（预留给未来的护盾或暴击逻辑）
   */
  const takeDamage = (damage: number) => {
    // 1. 确保伤害不为负数（防止误传负数导致变相加血）
    const actualDamage = Math.max(0, Math.floor(damage));

    // 2. 计算扣除后的血量
    const nextHp = player.baseInfo.hp - actualDamage;

    // 3. 使用统一的 setHp 逻辑
    // setHp 内部已经处理了 Math.max(0, ...)，所以血量最少只会到 0
    setHp(nextHp);

    // 4. 可扩展性：如果血量归零，可以触发死亡回调或发送事件
    if (player.baseInfo.hp <= 0) {
      // onPlayerDeath(); // 可以在这里处理掉级、掉装备或回城逻辑
    }

    // 返回实际造成的伤害值，方便 UI 弹出“红字伤害”
    return actualDamage;
  };

  /**
   * 获得经验值
   * @param amount 获得的经验数值
   */
  const gainExp = (amount: number) => {
    if (amount <= 0) return;

    // 1. 初始化字段（防止旧存档报错）
    if (player.baseInfo.currentExp === undefined) player.baseInfo.currentExp = 0;
    if (player.baseInfo.totalExp === undefined) player.baseInfo.totalExp = 0;

    // 2. 更新累计总经验 (核心修改：只加不减)
    player.baseInfo.totalExp += amount;

    // 3. 更新当前等级进度
    player.baseInfo.currentExp += amount;

    // 4. 循环判定升级
    let needed = getRequiredExp(player.baseInfo.level);
    while (player.baseInfo.currentExp >= needed) {
      player.baseInfo.currentExp -= needed;
      levelUp(); // 执行升级逻辑（增加属性等）

      // 重新获取下一级所需经验
      needed = getRequiredExp(player.baseInfo.level);
    }
  };

  /*
   * 升级逻辑
   */
  const levelUp = () => {
    const oldLevel = player.baseInfo.level;
    const newLevel = oldLevel + 1;
    const oldRealm = getRealmConfig(oldLevel);
    const newRealm = getRealmConfig(newLevel);

    // 1. 等级递增
    player.baseInfo.level = newLevel;

    // 2. 属性成长 (根据境界配置动态增长)
    // 如果进入了新境界，成长系数会变高
    const growBonus = newRealm ? newRealm.grow / 100 : 1;

    player.baseInfo.maxHp += 20 + Math.floor(growBonus * 10);
    player.baseInfo.maxMp += 10 + Math.floor(growBonus * 5);

    if (player.battle) {
      player.battle.attack += 2 + Math.floor(growBonus * 2);
      player.battle.defense += 1 + Math.floor(growBonus * 1);
    }

    // 3. 状态补满 (升级福利)
    healHp(finalStats.value.maxHp);
    player.baseInfo.mp = finalStats.value.maxMp;

    // 4. 打印反馈
    if (oldRealm?.name !== newRealm?.name) {
      console.log(`【系统】震烁古今！你已突破至 ${newRealm?.name} 境界！`);
    } else {
      console.log(`【系统】修为精进，达到 ${formatLevel(newLevel)}`);
    }
  };

  return {
    player,
    inventory,
    finalStats, // 建议 UI 绑定这个属性显示面板
    realm,
    finalPlayer,
    acquireItem,
    equipItem,
    unequipItem,
    dropItem,
    takeDamage,
    healHp,
    setHp,
    gainExp,
  };
});
