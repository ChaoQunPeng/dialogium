// src/utils/battle.ts
import type { ICharacter } from '@/interface';

/** 单个战斗事件：承载数据与文案 */
export interface IBattleEvent {
  type: 'attack' | 'defender' | 'system';
  turns: number;
  msg: string;
  attackerHp: number; // 该动作后攻击者的剩余血量
  defenderHp: number; // 该动作后防御者的剩余血量
  damage?: number; // 该动作产生的数值变动
}

/** 战斗总结报告 */
export interface IBattleSummary {
  winner: ICharacter | null;
  loser: ICharacter | null;
  turns: number;
  events: IBattleEvent[];
  finalAttackerHp: number;
  finalDefenderHp: number;
  isDraw: boolean;
}

/**
 * 核心战斗模拟函数
 * @param attacker 发起攻击的一方（通常是玩家）
 * @param defender 被攻击的一方（通常是怪物）
 */
export function simulateBattle(attacker: ICharacter, defender: ICharacter): IBattleSummary {
  // 使用局部变量计算，避免修改原始对象属性
  let aHp = attacker.baseInfo.hp;
  let dHp = defender.baseInfo.hp;

  const aAtk = attacker.battle?.attack ?? 0;
  const aDef = attacker.battle?.defense ?? 0;
  const dAtk = defender.battle?.attack ?? 0;
  const dDef = defender.battle?.defense ?? 0;

  const summary: IBattleSummary = {
    winner: null,
    loser: null,
    turns: 0,
    events: [],
    finalAttackerHp: aHp,
    finalDefenderHp: dHp,
    isDraw: false,
  };

  // 1. 全局判定：如果双方都无法破防，直接判定平局，防止进入无效循环
  if (aAtk <= dDef && dAtk <= aDef) {
    summary.events.push({
      turns: 0,
      type: 'system',
      msg: '【系统】双方防御均坚不可摧，陷入僵局。',
      attackerHp: aHp,
      defenderHp: dHp,
    });
    summary.isDraw = true;
    return summary;
  }

  // 2. 战斗循环
  const MAX_TURNS = 100; // 安全阈值
  while (aHp > 0 && dHp > 0 && summary.turns < MAX_TURNS) {
    summary.turns++;

    // --- 攻击方回合 ---
    const aDamage = Math.max(0, aAtk - dDef);
    dHp = Math.max(0, dHp - aDamage);

    summary.events.push({
      turns: summary.turns,
      type: 'attack',
      msg:
        aDamage > 0
          ? `⚔️ ${attacker.name} 发起攻击，造成 ${aDamage} 点伤害`
          : `🛡️ ${attacker.name} 的攻击被 ${defender.name} 轻松化解`,
      attackerHp: aHp,
      defenderHp: dHp,
      damage: aDamage,
    });

    // 重要：如果防御方已倒下，立即结束战斗，不再执行反击逻辑
    if (dHp <= 0) break;

    // --- 防御方反击回合 ---
    const dDamage = Math.max(0, dAtk - aDef);
    aHp = Math.max(0, aHp - dDamage);

    summary.events.push({
      turns: summary.turns,
      type: 'defender',
      msg:
        dDamage > 0
          ? `🔄 ${defender.name} 发起反击，造成 ${dDamage} 点伤害`
          : `🛡️ ${defender.name} 的反击未能撼动 ${attacker.name}`,
      attackerHp: aHp,
      defenderHp: dHp,
      damage: dDamage,
    });

    // 如果攻击方倒下，循环也会结束
    if (aHp <= 0) break;
  }

  // 3. 结果封存与结局文案
  summary.finalAttackerHp = aHp;
  summary.finalDefenderHp = dHp;

  if (aHp > 0 && dHp <= 0) {
    summary.winner = attacker;
    summary.loser = defender;
    summary.events.push({
      turns: summary.turns,
      type: 'system',
      msg: `🏁 战斗结束：${attacker.name} 获得了胜利！剩余生命值：${aHp}`,
      attackerHp: aHp,
      defenderHp: dHp,
    });
  } else if (dHp > 0 && aHp <= 0) {
    summary.winner = defender;
    summary.loser = attacker;
    summary.events.push({
      turns: summary.turns,
      type: 'system',
      msg: `💀 战斗结束：${attacker.name} 不幸战败... 对方剩余生命值：${dHp}`,
      attackerHp: aHp,
      defenderHp: dHp,
    });
  } else {
    summary.isDraw = true;
    summary.events.push({
      turns: summary.turns,
      type: 'system',
      msg: `⏳ 战斗结束：双方体力耗尽，最终战成平手。`,
      attackerHp: aHp,
      defenderHp: dHp,
    });
  }

  return summary;
}

/** 战斗前置校验结果接口 */
export interface FightCheckResult {
  canFight: boolean;
  reason: string;
  code: number;
}

/**
 * 在进入战斗前调用的校验函数
 */
export function canFight(attacker: ICharacter, defender: ICharacter): FightCheckResult {
  const result = simulateBattle(attacker, defender);

  // 1. 检查是否为平局
  if (result.isDraw) {
    return {
      canFight: false,
      reason: '你的攻击无法破防，打下去也只是浪费时间。',
      code: 1,
    };
  }

  // 2. 检查胜者是否为发起者（玩家）
  // 注意：这里假设通过 id 或 name 识别玩家
  if (result.winner?.name !== attacker.name) {
    return {
      canFight: false,
      reason: '实力悬殊！预测你会战败，请变强后再来挑战吧。',
      code: 2,
    };
  }

  return {
    canFight: true,
    reason: '',
    code: 0,
  };
}
