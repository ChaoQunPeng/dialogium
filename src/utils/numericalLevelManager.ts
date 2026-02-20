const BASE_EXP = 100;
const EXP_COEFFICIENT = 1.5;

/** 公式：根据等级计算所需经验 */
export const getLevelNeedExp = (level: number): number => {
  return Math.floor(BASE_EXP * Math.pow(level, EXP_COEFFICIENT));
};

/** 计算进度百分比 (用于 UI 进度条) */
export const getExpProgress = (level: number, currentExp: number): number => {
  const need = getLevelNeedExp(level);
  return Math.min(100, Math.floor((currentExp / need) * 100));
};

/** 增加经验并返回新等级 */
export const addExpSimple = (currentLevel: number, currentExp: number, gain: number) => {
  let level = currentLevel;
  let exp = currentExp + gain;

  while (exp >= getLevelNeedExp(level)) {
    exp -= getLevelNeedExp(level);
    level++;
  }

  return { level, exp };
};
