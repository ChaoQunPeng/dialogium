// src/hooks/useBattle.ts
import { ref } from 'vue';
import type { ICharacter } from '@/interface';
import { simulateBattle, type IBattleSummary, type IBattleEvent } from '@/utils/battle';

interface BattleOptions {
  delay?: number;
  /** 每回合的回调，现在传入的是完整的 Event 对象 */
  onTurn?: (event: IBattleEvent, progress: number) => void;
  onFinish?: (result: IBattleSummary) => void;
}

export function useBattle() {
  const battleLog = ref<string[]>([]);
  const isFighting = ref(false);
  const battleResult = ref<IBattleSummary | null>(null);
  const progress = ref(0);

  const startBattle = async (
    attacker: ICharacter,
    defender: ICharacter,
    options: BattleOptions = {},
  ) => {
    const { delay = 100, onTurn, onFinish } = options;

    isFighting.value = true;
    battleResult.value = null;
    battleLog.value = [];
    progress.value = 0;

    const result = simulateBattle(attacker, defender);
    battleResult.value = result;

    // 播放事件流
    for (let i = 0; i < result.events.length; i++) {
      const event = result.events[i];

      // 添加类型守卫，确保event存在且有msg属性
      if (!event || typeof event.msg === 'undefined') {
        continue;
      }

      // 1. 更新 Hook 内部的表现数据（仅日志字符串）
      battleLog.value.unshift(event.msg);
      progress.value = Math.round(((i + 1) / result.events.length) * 100);

      // 2. 触发回调，让外部 UI 层处理血量同步和特效
      if (onTurn) onTurn(event, progress.value);

      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    isFighting.value = false;
    if (onFinish) onFinish(result);
    return result;
  };

  return { battleLog, isFighting, battleResult, progress, startBattle };
}
