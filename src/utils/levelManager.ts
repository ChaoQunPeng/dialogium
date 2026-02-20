// 境界基础配置
const REALM_CONFIG = [
  { name: '炼气', min: 1, max: 9, base: 100, grow: 50 },
  { name: '筑基', min: 10, max: 21, base: 2000, grow: 400 },
  { name: '金丹', min: 22, max: 33, base: 20000, grow: 5000 },
];

/** 获取当前等级所需的升级经验 */
export const getRequiredExp = (level: number): number => {
  const realm = REALM_CONFIG.find((r) => level >= r.min && level <= r.max);
  if (!realm) return Infinity;
  return realm.base + (level - realm.min) * realm.grow;
};

/** 格式化境界名称 */
export const formatLevel = (level: number): string => {
  const realm = REALM_CONFIG.find((r) => level >= r.min && level <= r.max);
  return realm ? `${realm.name}期 ${level - realm.min + 1}层` : '未知大能';
};

/** 增加经验的纯函数逻辑 */
// export const calculateExpGain = (currentLevel: number, currentExp: number, gain: number) => {
//   let level = currentLevel;
//   let exp = currentExp + gain;
//   let needsBreakthrough = false;

//   while (exp >= getRequiredExp(level)) {
//     const realm = REALM_CONFIG.find((r) => level >= r.min && level <= r.max);
//     // 检查是否撞到境界天花板（如9级、21级）
//     if (realm && level === realm.max) {
//       exp = getRequiredExp(level); // 经验存满但不溢出
//       needsBreakthrough = true;
//       break;
//     }
//     exp -= getRequiredExp(level);
//     level++;
//   }

//   return { level, exp, needsBreakthrough };
// };
