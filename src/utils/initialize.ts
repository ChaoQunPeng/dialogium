import type { IItemInstance, ICharacter } from '@/interface';
import { DEFAULT_PLAYER_CONFIG, STORAGE_KEYS } from '@/constants';

/**
 * 统一初始化方法
 * 同时初始化角色数据、背包数据和任务数据到 localStorage
 * 这是游戏启动时应该调用的主要初始化方法
 * 
 * 注意：此方法只负责向 localStorage 写入初始数据，不负责加载到内存
 */
export const initializeGame = () => {
  console.log('=== 开始初始化飘邈之旅游戏数据 ===');

  // 初始化角色数据 (写入 localStorage)
  initializeCharacterData();

  // 初始化物品数据 (写入 localStorage)
  initializePlayerItemsData();

  // 初始化任务数据 (写入 localStorage)
  initializeQuestData();

  console.log('=== 游戏初始化完成，所有数据已写入 localStorage ===');
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
  const existingData = localStorage.getItem(STORAGE_KEYS.PLAYER_ITEMS);
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
      id: crypto.randomUUID(),
      mid: 'bai_ren_qiang', // 对应你静态配置表中的 ID
      n: 1,
      e: 0, // 紫炎心是入体的，默认就是激活/穿戴状态
      l: 0,
    },
    {
      id: crypto.randomUUID(),
      mid: 'zi_yan_xin', // 对应你静态配置表中的 ID
      n: 1,
      e: 0, // 紫炎心是入体的，默认就是激活/穿戴状态
      l: 0, // 核心至宝，锁定防止误删
    },
    {
      id: crypto.randomUUID(),
      mid: 'man_tian_xin_body',
      n: 1,
      e: 0,
      l: 0,
    },
    {
      id: crypto.randomUUID(),
      mid: 'man_tian_xin_shoulder',
      n: 1,
      e: 0,
      l: 0,
    },
    {
      id: crypto.randomUUID(),
      mid: 'man_tian_xin_belt',
      n: 1,
      e: 0,
      l: 0,
    },
    {
      id: crypto.randomUUID(),
      mid: 'man_tian_xin_leg',
      n: 1,
      e: 0,
      l: 0,
    },
    {
      id: crypto.randomUUID(),
      mid: 'man_tian_xin_shoes',
      n: 1,
      e: 0,
      l: 0,
    },
  ];

  // 3. 写入 LocalStorage
  try {
    localStorage.setItem(STORAGE_KEYS.PLAYER_ITEMS, JSON.stringify(initialItems));
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
    return DEFAULT_PLAYER_CONFIG;
  }

  // 1. 检查本地存档
  const existingData = localStorage.getItem(STORAGE_KEYS.PLAYER_DATA);
  if (existingData) {
    console.log('检测到已有元神存档，载入中...');
    return JSON.parse(existingData) as ICharacter;
  }

  // 2. 创建新角色 (初始设定：重入修真的李强)
  const newCharacter = DEFAULT_PLAYER_CONFIG;

  // 3. 写入存档
  try {
    localStorage.setItem(STORAGE_KEYS.PLAYER_DATA, JSON.stringify(newCharacter));
    console.log('【天道提示】:元神归位，李强，欢迎来到修真界。');
    return newCharacter;
  } catch (e) {
    console.error('元神存档失败:', e);
    return newCharacter;
  }
};

/**
 * 初始化任务数据到 localStorage
 * 仅在首次游戏时调用，将初始任务配置写入持久化存储
 */
export const initializeQuestData = () => {
  // 环境检查
  if (typeof localStorage === 'undefined') {
    console.warn('当前环境不支持 localStorage，无法初始化任务数据');
    return;
  }

  // 1. 检查是否已经有任务存档
  const existingProgress = localStorage.getItem(STORAGE_KEYS.PLAYER_QUESTS);
  
  if (!existingProgress) {
    // 首次游戏，初始化空的进度数据
    const initialProgress = {
      p: {}, // 空的进度对象
      a: null, // 没有激活的任务
    };
    
    try {
      localStorage.setItem(STORAGE_KEYS.PLAYER_QUESTS, JSON.stringify(initialProgress));
      console.log('📜 任务数据已初始化到 localStorage (新游戏)');
    } catch (e) {
      console.error('任务数据初始化失败:', e);
    }
  } else {
    console.log('📜 检测到已有任务存档，跳过初始化');
  }
};

