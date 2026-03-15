import { STORAGE_KEYS } from '@/constants';

/**
 * 存档数据结构
 */
export interface ISaveData {
  /** Player Data - 玩家基础数据 */
  PD: string | null;
  /** Player Items - 背包物品数据 */
  PI: string | null;
  /** Player Quests - 任务进度数据 */
  PQ: string | null;
}

/**
 * 导入结果
 */
export interface IImportResult {
  success: boolean;
  message: string;
}

/**
 * 导出存档为 JSON 文件
 * 自动下载文件到用户本地
 */
export const exportSaveFile = (): void => {
  try {
    // 从 localStorage 读取三个数据项
    const saveData: ISaveData = {
      PD: localStorage.getItem(STORAGE_KEYS.PLAYER_DATA),
      PI: localStorage.getItem(STORAGE_KEYS.PLAYER_ITEMS),
      PQ: localStorage.getItem(STORAGE_KEYS.PLAYER_QUESTS),
    };

    // 转换为格式化的 JSON 字符串
    const jsonString = JSON.stringify(saveData, null, 2);

    // 创建 Blob 对象
    const blob = new Blob([jsonString], { type: 'application/json' });

    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // 生成带时间戳的文件名
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    link.download = `dialogium_save_${timestamp}.json`;
    
    // 触发下载
    link.href = url;
    document.body.appendChild(link);
    link.click();
    
    // 清理
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('📤 存档文件导出成功', saveData);
  } catch (error) {
    console.error('❌ 导出存档失败', error);
    throw new Error('导出存档失败，请重试');
  }
};

/**
 * 从 JSON 文件导入存档
 * @param file 用户上传的 JSON 文件
 * @returns 导入结果
 */
export const importSaveFile = async (file: File): Promise<IImportResult> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const saveData = JSON.parse(content);

        // 验证数据结构
        if (!saveData.PD || !saveData.PI || !saveData.PQ) {
          resolve({
            success: false,
            message: '存档格式不正确，缺少必要数据（PD/PI/PQ）',
          });
          return;
        }

        // 写入 localStorage
        localStorage.setItem(STORAGE_KEYS.PLAYER_DATA, saveData.PD);
        localStorage.setItem(STORAGE_KEYS.PLAYER_ITEMS, saveData.PI);
        localStorage.setItem(STORAGE_KEYS.PLAYER_QUESTS, saveData.PQ);

        console.log('📥 存档导入成功', saveData);
        resolve({
          success: true,
          message: '存档导入成功',
        });
      } catch (error) {
        console.error('❌ 导入存档失败', error);
        resolve({
          success: false,
          message: error instanceof Error ? error.message : '文件格式不正确，请确保是有效的 JSON 文件',
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        message: '文件读取失败',
      });
    };

    reader.readAsText(file);
  });
};

/**
 * 重置游戏，清除所有存档数据
 */
export const resetGame = (): void => {
  try {
    // 清除所有 localStorage 数据
    localStorage.removeItem(STORAGE_KEYS.PLAYER_DATA);
    localStorage.removeItem(STORAGE_KEYS.PLAYER_ITEMS);
    localStorage.removeItem(STORAGE_KEYS.PLAYER_QUESTS);

    console.log('✅ 游戏数据已清除');

    // 刷新页面应用默认配置
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (error) {
    console.error('❌ 重置游戏失败', error);
    throw new Error('重置游戏失败，请手动清除浏览器数据');
  }
};
