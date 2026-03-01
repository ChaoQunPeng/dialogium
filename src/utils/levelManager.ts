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

export const getRealmConfig = (level: number) => {
  return REALM_STEPS.find((r) => level >= r.min && level <= r.max);
};
