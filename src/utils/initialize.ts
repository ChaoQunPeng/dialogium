import type { IItemInstance, ICharacter } from '@/interface';
import { CharacterType } from '@/enums';

// 本地存储键名常量
const PMZL_PLAYER_ITEMS_KEY = 'PMZL_PLAYER_ITEMS';
const PMZL_PLAYER_DATA_KEY = 'PMZL_PLAYER_DATA';

/**
 * 统一初始化方法
 * 同时初始化角色数据和背包数据
 * 这是游戏启动时应该调用的主要初始化方法
 *
 * @returns 包含角色和物品数据的初始化结果
 */
export const initializeGame = () => {
  console.log('=== 开始初始化飘邈之旅游戏数据 ===');

  // 初始化角色数据
  const character = initializeCharacterData();

  // 初始化物品数据
  const items = initializePlayerItemsData();

  console.log('=== 游戏初始化完成 ===');
  console.log('角色信息：', {
    name: character.name,
    level: character.baseInfo.level,
    realm: character.baseInfo.cultivation?.realm,
    hp: `${character.baseInfo.hp}/${character.baseInfo.maxHp}`,
    mp: `${character.baseInfo.mp}/${character.baseInfo.maxMp}`,
  });
  console.log('物品数量：', items.length);

  return {
    character,
    items,
  };
};

/**
 * 初始化背包数据
 * 创建玩家的初始装备和物品
 */
export const initializePlayerItemsData = () => {
  // 环境检查
  if (typeof localStorage === 'undefined') {
    console.warn('当前环境不支持 localStorage，无法初始化物品数据');
    return [];
  }

  // 1. 检查本地是否已经有数据，防止覆盖玩家进度
  const existingData = localStorage.getItem(PMZL_PLAYER_ITEMS_KEY);
  if (existingData) {
    console.log('检测到已有识海记录，跳过初始化。');
    return JSON.parse(existingData) as IItemInstance[];
  }

  /**
   * 2. 创建初始物品：紫炎心和满天星套装
   * 在原著中，紫炎心不仅是能量源，更是李强炼器的核心。
   * 满天星套装是李强的重要装备。
   */
  const initialItems: IItemInstance[] = [
    {
      instanceId: crypto.randomUUID(),
      itemId: 'zi_yan_xin', // 对应你静态配置表中的 ID
      count: 1,
      isEquipped: true, // 紫炎心是入体的，默认就是激活/穿戴状态
      isLocked: true, // 核心至宝，锁定防止误删
    },
    {
      instanceId: crypto.randomUUID(),
      itemId: 'man_tian_xin_body',
      count: 1,
      isEquipped: true,
      isLocked: true,
    },
    {
      instanceId: crypto.randomUUID(),
      itemId: 'man_tian_xin_shoulder',
      count: 1,
      isEquipped: true,
      isLocked: true,
    },
    {
      instanceId: crypto.randomUUID(),
      itemId: 'man_tian_xin_belt',
      count: 1,
      isEquipped: true,
      isLocked: true,
    },
    {
      instanceId: crypto.randomUUID(),
      itemId: 'man_tian_xin_leg',
      count: 1,
      isEquipped: true,
      isLocked: true,
    },
    {
      instanceId: crypto.randomUUID(),
      itemId: 'man_tian_xin_shoes',
      count: 1,
      isEquipped: true,
      isLocked: true,
    },
  ];

  // 3. 写入 LocalStorage
  try {
    localStorage.setItem(PMZL_PLAYER_ITEMS_KEY, JSON.stringify(initialItems));
    console.log('【天道提示】：紫炎真火入体，识海已开，修真之路开启。');
    return initialItems;
  } catch (e) {
    console.error('初始化识海失败：', e);
    return [];
  }
};

/**
 * 初始化角色基础数据
 * 设定玩家的初始属性、境界和状态
 */
export const initializeCharacterData = (): ICharacter => {
  // 环境检查
  if (typeof localStorage === 'undefined') {
    return createDefaultCharacter();
  }

  // 1. 检查本地存档
  const existingData = localStorage.getItem(PMZL_PLAYER_DATA_KEY);
  if (existingData) {
    console.log('检测到已有元神存档，载入中...');
    return JSON.parse(existingData) as ICharacter;
  }

  // 2. 创建新角色（初始设定：重入修真的李强）
  const newCharacter = createDefaultCharacter();

  // 3. 写入存档
  try {
    localStorage.setItem(PMZL_PLAYER_DATA_KEY, JSON.stringify(newCharacter));
    console.log('【天道提示】：元神归位，李强，欢迎来到修真界。');
    return newCharacter;
  } catch (e) {
    console.error('元神存档失败：', e);
    return newCharacter;
  }
};

/**
 * 创建默认角色数据
 */
const createDefaultCharacter = (): ICharacter => {
  return {
    id: 'player_001',
    name: '李强',
    type: CharacterType.Player,
    baseInfo: {
      level: 1,
      hp: 500,
      maxHp: 500,
      mp: 300,
      maxMp: 300,
    },
    battle: {
      attack: 50,
      defense: 50,
    },
  };
};
