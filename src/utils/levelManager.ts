export enum DaoRealms {
  XuanZhao = '旋照',
  KaiGuang = '开光',
  RongHe = '融合',
  XinDong = '心动',
  LingJi = '灵寂',
  YuanYing = '元婴',
  ChuQiao = '出窍',
  FenShen = '分神',
  HeTi = '合体',
  DuJie = '渡劫',
  DaCheng = '大乘',
}

/** 每一大境界包含 9 小层，总共 11 个大境界 */
export const REALM_STEPS = [
  { name: DaoRealms.XuanZhao, min: 1, max: 9, base: 100, grow: 50 },
  { name: DaoRealms.KaiGuang, min: 10, max: 18, base: 1000, grow: 200 },
  { name: DaoRealms.RongHe, min: 19, max: 27, base: 5000, grow: 800 },
  { name: DaoRealms.XinDong, min: 28, max: 36, base: 15000, grow: 2000 },
  { name: DaoRealms.LingJi, min: 37, max: 45, base: 50000, grow: 5000 },
  { name: DaoRealms.YuanYing, min: 46, max: 54, base: 150000, grow: 15000 },
  { name: DaoRealms.ChuQiao, min: 55, max: 63, base: 400000, grow: 40000 },
  { name: DaoRealms.FenShen, min: 64, max: 72, base: 1000000, grow: 100000 },
  { name: DaoRealms.HeTi, min: 73, max: 81, base: 2500000, grow: 250000 },
  { name: DaoRealms.DuJie, min: 82, max: 90, base: 6000000, grow: 600000 },
  { name: DaoRealms.DaCheng, min: 91, max: 99, base: 15000000, grow: 1500000 },
];

/** 获取当前等级所需的升级经验 */
export const getRequiredExp = (level: number): number => {
  const realm = REALM_STEPS.find((r) => level >= r.min && level <= r.max);
  if (!realm) return Infinity;
  return realm.base + (level - realm.min) * realm.grow;
};

/** 格式化境界名称 */
export const formatLevel = (level: number): string => {
  const realm = REALM_STEPS.find((r) => level >= r.min && level <= r.max);
  return realm ? `${realm.name}期 ${level - realm.min + 1}层` : '未知大能';
};

export const calculateFinalDamage = (attacker: any, defender: any) => {
  // 基础伤害 = 攻 - 防
  const baseDamage = Math.max(1, attacker.atk - defender.def);

  // 获取压制系数
  const suppression = getSuppressionMultiplier(attacker.level, defender.level);

  // 最终伤害
  const finalDamage = Math.floor(baseDamage * suppression);

  console.log(
    `[战斗] ${attacker.name} 发动攻击，境界系数: ${suppression.toFixed(2)}, 最终伤害: ${finalDamage}`,
  );
  return finalDamage;
};

/** 境界压制配置 */
const SUPPRESSION_CONFIG = {
  // 每一层大境界差距提供的增伤/减伤系数 (0.1 = 10%)
  PER_REALM_GAP: 0.15,
  // 最大压制上限 (比如最多压制 80%，防止无敌或伤害归零)
  MAX_SUPPRESSION: 0.8,
};

/**
 * 计算境界压制系数
 * @param attackerLevel 攻击者等级
 * @param defenderLevel 防御者等级
 * @returns { damageMultiplier: number } 伤害倍率
 */
export const getSuppressionMultiplier = (attackerLevel: number, defenderLevel: number) => {
  // 1. 获取双方的大境界索引 (0=旋照, 1=开光...)
  const attackerRealmIdx = Math.floor((attackerLevel - 1) / 9);
  const defenderRealmIdx = Math.floor((defenderLevel - 1) / 9);

  // 2. 计算境界差
  const realmGap = attackerRealmIdx - defenderRealmIdx;

  if (realmGap === 0) return 1.0; // 同境界无压制

  let multiplier = 1.0;

  if (realmGap > 0) {
    // 攻击者境界更高：增伤
    // 例如高 2 个大境界：1 + (2 * 0.15) = 1.3 倍伤害
    const bonus = realmGap * SUPPRESSION_CONFIG.PER_REALM_GAP;
    multiplier = 1 + Math.min(bonus, SUPPRESSION_CONFIG.MAX_SUPPRESSION);
  } else {
    // 攻击者境界更低：减伤 (被压制)
    // 例如低 2 个大境界：1 - (2 * 0.15) = 0.7 倍伤害
    const penalty = Math.abs(realmGap) * SUPPRESSION_CONFIG.PER_REALM_GAP;
    multiplier = 1 - Math.min(penalty, SUPPRESSION_CONFIG.MAX_SUPPRESSION);
  }

  return multiplier;
};
