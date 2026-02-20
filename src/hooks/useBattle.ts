// src/hooks/useBattle.ts
import { ref } from 'vue';
import type { ICharacter } from '@/interface';
import { simulateBattle, type IBattleSummary, type IBattleEvent } from '@/utils/battle';
import { handleBattleRewards, type IBattleReward } from '@/utils/battle';

/** 格式化后的日志行结构 */
export interface ITurnRecord {
  msg: string;
  attack: IBattleEvent;
  defender: IBattleEvent | null;
  attackerHp: number;
  defenderHp: number;
}

/** 战斗配置选项 */
interface BattleOptions {
  delay?: number;
  /** 每回合的回调，传入该回合合并后的数据 */
  onTurn?: (logGroup: ITurnRecord, progress: number) => void;
  /** 战斗结束触发的回调 */
  onFinish?: (result: IBattleSummary) => void;
}

/**
 * 合并函数：将单步事件流转为“一攻一守”的轮次流
 */
export function formatBattleEvents(events: IBattleEvent[]): ITurnRecord[] {
  const logs: ITurnRecord[] = [];
  // 以 2 为步长，确保每一项都包含一次攻守互动
  for (let i = 0; i < events.length; i += 2) {
    const attack = events[i];
    // 如果没有攻击事件（理论上不会发生，但为了类型安全），跳过
    if (!attack) continue;

    const defender = events[i + 1] || null;

    logs.push({
      // 如果有反击则合并文字，否则只显示攻击信息
      msg: defender ? `${attack.msg}\n${defender.msg}` : attack.msg,
      attack: attack,
      defender: defender,
      attackerHp: attack.attackerHp,
      defenderHp: attack.defenderHp,
    });
  }
  return logs;
}

type BattleStatus = 'idle' | 'fighting' | 'finished';

export function useBattle() {
  const battleLog = ref<string[]>([]);
  const battleResult = ref<IBattleSummary | null>(null);
  const progress = ref(0);
  const currentTurns = ref(0);
  const battleStatus = ref<BattleStatus>('idle'); // 初始为闲置
  const battleRewards = ref<IBattleReward | null>(null); // 新增：战斗奖励

  /**
   * 开始战斗
   */
  const startBattle = async (
    attacker: ICharacter,
    defender: ICharacter,
    options: BattleOptions = {},
  ) => {
    const { delay = 1000, onTurn, onFinish } = options;

    battleStatus.value = 'fighting';

    // 1. 初始化状态
    battleResult.value = null;
    battleLog.value = [];
    progress.value = 0;
    battleRewards.value = null; // 重置奖励

    // 2. 预计算战斗结果并转换格式
    const result = simulateBattle(attacker, defender);
    battleResult.value = result;

    // 将扁平的 events 预先处理成按回合合并的 displayLogs
    const displayLogs = formatBattleEvents(result.events);

    // 3. 顺序播放战斗过程
    for (let i = 0; i < displayLogs.length; i++) {
      currentTurns.value++;
      const logGroup = displayLogs[i];

      // 【核心修复】：显式检查 logGroup 是否存在，消除 TS 的 undefined 报错
      if (!logGroup) continue;

      // 更新日志显示（最新消息在最前）
      battleLog.value.unshift(logGroup.msg);

      // 更新整体进度百分比
      progress.value = Math.round(((i + 1) / displayLogs.length) * 100);

      // 执行回合回调：将合并后的对象传回给 UI 层处理血量同步
      if (onTurn) {
        onTurn(logGroup, progress.value);
      }

      // 等待动画间隔
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    // 4. 结束战斗逻辑
    if (onFinish) {
      battleStatus.value = 'finished';
      
      // 如果玩家获胜，处理奖励
      if (result.winner?.id === attacker.id) {
        const rewards = handleBattleRewards(attacker, defender);
        battleRewards.value = rewards;
        
        // 将奖励信息添加到战斗日志
        if (rewards.expGained > 0) {
          battleLog.value.unshift(`✨ 获得 ${rewards.expGained} 点经验值`);
        }
        if (rewards.droppedItems.length > 0) {
          rewards.droppedItems.forEach(item => {
            battleLog.value.unshift(`🎉 获得 ${item.name} x${item.count}`);
          });
        }
      }
      
      onFinish(result);
    }

    return result;
  };

  /**
   * 重置战斗状态
   */
  const reset = () => {
    battleLog.value = [];
    battleStatus.value = 'idle';
    battleResult.value = null;
    progress.value = 0;
    battleRewards.value = null;
  };

  return {
    battleLog,
    battleResult,
    progress,
    startBattle,
    currentTurns,
    reset,
    battleStatus,
    battleRewards, // 导出战斗奖励
  };
}
