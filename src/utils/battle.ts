// src/utils/battle.ts
import type { ICharacter, IItem } from '@/interface';
import { getRandomElement } from './arrayUtils';
import { items } from '@/items';

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

/** 战斗事件描述 - MUD 沉浸版 */
const getActionMsg = (
  actorName: string,
  targetName: string,
  dmg: number,
  isCounter: boolean,
): string => {
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]!;

  // --- 1. 【无伤/闪避/格挡】 (dmg <= 0) ---
  if (dmg <= 0) {
    const dodgeMoves = [
      '侧身一闪',
      '后撤半步',
      '压低重心',
      '化作残影',
      '轻盈跃起',
      '负手而立',
      '预判走位',
      '面无表情地偏头',
      '信步闲庭',
      '犹如惊鸿掠影',
    ];
    const dodgeResults = [
      '让这一招落了空',
      '毫发无伤地躲过',
      '使得大气被击碎但人已远去',
      '让攻击擦着鼻尖划过',
      '彻底瓦解了对方的攻势',
      '让这势大力沉的一击打在了棉花上',
    ];
    return `${targetName} ${pick(dodgeMoves)}，${pick(dodgeResults)}。${actorName} 这一招未能损其分毫。`;
  }

  // --- 2. 【轻微伤害】 (0 < dmg < 20) ---
  if (dmg < 20) {
    const normalActions = isCounter
      ? ['顺势反踢', '借力抽击', '反手横切', '撤步弹指', '膝击腹部', '肘击胸口']
      : ['挥剑斜劈', '踏步直刺', '勾拳重击', '凌空抽射', '短刀突袭', '掌心横击'];

    const bodyParts = ['肩部', '小腿', '侧腰', '手臂', '胸膛', '面门'];

    const minorEffects = [
      `留下一道红印，带走 ${dmg} 点气血`,
      `使其身形微晃，造成 ${dmg} 点伤害`,
      `割破了布甲，侵入 ${dmg} 点劲力`,
      `溅起几点血星，损耗 ${dmg} 点体力`,
      `留下浅浅血痕，造成 ${dmg} 点轻伤`,
      `震得对方虎口发麻，带去 ${dmg} 点创伤`,
    ];

    return `${actorName} 对准 ${targetName} 的${pick(bodyParts)}${pick(normalActions)}，${pick(minorEffects)}。`;
  }

  // --- 3. 【沉重伤害】 (20 <= dmg < 60) ---
  if (dmg < 60) {
    const heavyPrefix = isCounter
      ? ['抓准那瞬息的破绽', '利用对方的重心不稳', '在防御的间隙中']
      : ['凝聚全身的气劲', '发出震天的怒吼', '燃烧斗志'];

    const heavyActions = [
      '发动了狂暴猛攻',
      '使出贯穿性重击',
      '挥出势如破竹的一刀',
      '打出音爆般的一拳',
      '将武器狠狠砸下',
    ];

    const heavyImpacts = [
      `令其吐出一口鲜血，狂掠 ${dmg} 点气血`,
      `迫使对方连退五步，造成 ${dmg} 点沉重伤害`,
      `发出痛苦的闷哼，强行剥离 ${dmg} 点生命`,
      `震碎了护甲，倾泻 ${dmg} 点内劲`,
      `令其半跪在地上喘息，带走高达 ${dmg} 点气血`,
    ];

    return `${actorName} ${pick(heavyPrefix)}${pick(heavyActions)}！${targetName} ${pick(heavyImpacts)}！`;
  }

  // --- 4. 【毁灭/处决伤害】 (dmg >= 60) ---
  const ultimateStarters = ['四周空气凝固了', '天空中隐约传来雷鸣', '杀气化作实质的领域'];
  const ultimateMoves = ['使出了禁忌的奥义', '化身杀戮的死神', '斩出了撕裂空间的一击'];
  const dmgDesc = [
    `瞬间将其贯穿，恐怖的 ${dmg} 点伤害爆发开来`,
    `直接将其轰飞，生命力瞬间蒸发 ${dmg} 点`,
    `这是致命的一击，强行抹去 ${dmg} 点气血`,
  ];
  const ultimateEnds = ['这是教科书般的终结', '胜负在那一刻已经分晓', '那是凡人无法触及的境界'];

  return `🔥 ${pick(ultimateStarters)}！${actorName} ${pick(ultimateMoves)}，${pick(dmgDesc)}！${pick(ultimateEnds)}。`;
};

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
      msg: getActionMsg(attacker.name, defender.name, aDamage, false),
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
      msg: getActionMsg(defender.name, attacker.name, dDamage, true),
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
      reason: '实力悬殊！请变强后再来挑战吧。',
      code: 2,
    };
  }

  return {
    canFight: true,
    reason: '',
    code: 0,
  };
}

/**
 * 处理战斗结束后的物品掉落
 * 从怪物的dropList中随机获取一个物品给玩家
 * @param monster 被击败的怪物
 * @returns 获得的物品，如果没有掉落则返回null
 */
export function handleLootDrop(monster: ICharacter): IItem | null {
  // 检查怪物是否有掉落列表
  const dropList = monster.battle?.dropList;

  if (!dropList || dropList.length === 0) {
    console.log(`${monster.name} 没有掉落任何物品`);
    return null;
  }

  // 从掉落列表中随机选择一个itemId
  const droppedItemId = getRandomElement(dropList);

  if (!droppedItemId) {
    console.log(`${monster.name} 的掉落列表为空`);
    return null;
  }

  // 根据itemId查询对应的物品配置
  const droppedItemConfig = items[droppedItemId];

  if (!droppedItemConfig) {
    console.log(`⚠️ 警告：找不到ID为 ${droppedItemId} 的物品配置`);
    return null;
  }

  // 创建物品实例（添加count属性）
  const droppedItem: IItem = {
    ...droppedItemConfig,
    count: 1, // 默认掉落数量为1，可以根据需要调整
  };

  console.log(`🎉 你获得了 ${droppedItem.name} x${droppedItem.count}！`);
  return droppedItem;
}

/**
 * 处理战斗胜利后的完整奖励流程
 * 包括经验获取和物品掉落
 * @param player 玩家角色
 * @param monster 被击败的怪物
 * @returns 战斗奖励详情
 */
export interface IBattleReward {
  expGained: number;
  droppedItems: IItem[];
  levelUp: boolean;
}

/**
 * 处理战斗胜利后的完整奖励流程
 * 包括经验获取和物品掉落
 * @param player 玩家角色
 * @param monster 被击败的怪物
 * @returns 战斗奖励详情
 */
export function handleBattleRewards(player: ICharacter, monster: ICharacter): IBattleReward {
  const reward: IBattleReward = {
    expGained: 0,
    droppedItems: [],
    levelUp: false,
  };

  // 1. 获取经验奖励（从怪物的exp字段）
  const expReward = monster.battle?.exp || 0;
  if (expReward > 0 && player.baseInfo.cultivation) {
    player.baseInfo.currentExp += expReward;
    reward.expGained = expReward;
    console.log(`✨ 获得 ${expReward} 点经验值`);
  }

  // 2. 处理物品掉落
  const droppedItem = handleLootDrop(monster);
  if (droppedItem) {
    reward.droppedItems.push(droppedItem);
  }

  // 3. 检查是否升级（简化版本）
  // 这里可以根据具体的游戏规则来实现升级逻辑
  // 暂时只是简单记录是否有升级

  return reward;
}
