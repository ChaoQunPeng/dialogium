// src/utils/battle.ts
import type { ICharacter } from '@/interface';

/** 单个战斗事件：承载数据与文案 */
export interface IBattleEvent {
  type: 'attack' | 'defender' | 'system';
  turns: number; // 当前战斗轮数
  msg: string; // 仅作为文案展示
  attackerHp: number; // 该动作后攻击者的剩余血量
  defenderHp: number; // 该动作后防御者的剩余血量
  damage?: number; // 该动作产生的数值变动
}

export interface IBattleSummary {
  winner: ICharacter | null;
  loser: ICharacter | null;
  turns: number;
  events: IBattleEvent[]; // 由 log: string[] 改为事件流
  finalAttackerHp: number;
  finalDefenderHp: number;
}

export function simulateBattle(attacker: ICharacter, defender: ICharacter): IBattleSummary {
  const summary: IBattleSummary = {
    winner: null,
    loser: null,
    turns: 0,
    events: [],
    finalAttackerHp: attacker.baseInfo.hp,
    finalDefenderHp: defender.baseInfo.hp,
  };

  const aAtk = attacker.battle?.attack || 0;
  const aDef = attacker.battle?.defense || 0;
  const dAtk = defender.battle?.attack || 0;
  const dDef = defender.battle?.defense || 0;

  // 这里只保留一个“绝对无法破防”的全局跳出判断，防止死循环
  // 如果双方都无法破防，且没有其他伤害手段（如技能），则直接结束
  if (aAtk <= dDef && dAtk <= aDef) {
    summary.events.push({
      turns: 0,
      type: 'system',
      msg: '【系统】双方防御均坚不可摧，陷入僵局，战斗平局。',
      attackerHp: attacker.baseInfo.hp,
      defenderHp: defender.baseInfo.hp,
    });
    return summary;
  }

  let aHp = attacker.baseInfo.hp;
  let dHp = defender.baseInfo.hp;

  while (aHp > 0 && dHp > 0) {
    summary.turns++;

    // --- 1. 攻击者行动 ---
    const aDamage = Math.max(0, aAtk - dDef); // 如果没破防，伤害就是 0
    dHp = Math.max(0, dHp - aDamage);

    summary.events.push({
      turns: summary.turns,
      type: 'attack',
      // 根据伤害值动态生成描述
      msg:
        aDamage > 0
          ? `${attacker.name} 发起进攻，造成 ${aDamage} 点伤害`
          : `${attacker.name} 发起进攻，但未能破开 ${defender.name} 的防御！`,
      attackerHp: aHp,
      defenderHp: dHp,
      damage: aDamage,
    });

    if (dHp <= 0) {
      summary.events.push({
        turns: summary.turns,
        type: 'defender',
        // 根据伤害值动态生成描述
        msg: `${defender.name} 战败`,
        attackerHp: aHp,
        defenderHp: dHp,
        damage: aDamage,
      });

      break;
    }

    // --- 2. 防御者反击 ---
    const dDamage = Math.max(0, dAtk - aDef); // 如果没破防，伤害就是 0
    aHp = Math.max(0, aHp - dDamage);

    summary.events.push({
      turns: summary.turns,
      type: 'defender',
      msg:
        dDamage > 0
          ? `${defender.name} 发起反击，造成 ${dDamage} 点伤害`
          : `${defender.name} 试图反击，但被 ${attacker.name} 轻松化解。`,
      attackerHp: aHp,
      defenderHp: dHp,
      damage: dDamage,
    });

    if (aHp <= 0) {
      break;
    }
  }

  summary.finalAttackerHp = aHp;
  summary.finalDefenderHp = dHp;

  // 判定胜负
  if (aHp <= 0) {
    summary.winner = defender;
    summary.loser = attacker;
  } else {
    summary.winner = attacker;
    summary.loser = defender;
  }

  return summary;
}

export interface FightCheckResult {
  canFight: boolean;
  reason: string;
}

export function canFight(attacker: ICharacter, defender: ICharacter): FightCheckResult {
  // 1. 攻击方的攻击力大于防守方的防御力
  const canAttackerWin = (attacker.battle?.attack ?? 0) > (defender.battle?.defense ?? 0);

  // 2. 使用simulateBattle返回的结果中,winner的type是player
  const battleResult = simulateBattle(attacker, defender);
  const isWinnerPlayer = battleResult.winner?.type === 'player';

  if (!canAttackerWin) {
    return {
      canFight: false,
      reason: '你的攻击力过低，无法打倒对方！',
    };
  } else if (!isWinnerPlayer) {
    return {
      canFight: false,
      reason: '你最终会被对方击败!',
    };
  } else {
    return {
      canFight: true,
      reason: '',
    };
  }
}
