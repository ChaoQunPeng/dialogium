import type {
  CultivationType,
  DaoRealms,
  ImmortalRealms,
  DemonicRealms,
  DivineRealms,
} from '@/enums';

// 定义特定修炼路径的境界信息
export interface IDaoCultivation {
  type: CultivationType.Dao;
  /** 级别 */
  level: number;
  /** 当前经验 */
  currentExp: number;
  /** 境界 */
  realm: DaoRealms;
  // subStage?: 'early' | 'middle' | 'late' | 'peak'; // 子阶段
}

export interface IImmortalCultivation {
  type: CultivationType.Immortal;
  /** 级别 */
  level: number;
  /** 当前经验 */
  currentExp: number;
  /** 境界 */
  realm: ImmortalRealms;
}

export interface IDemonicCultivation {
  type: CultivationType.Demonic;
  /** 级别 */
  level: number;
  /** 当前经验 */
  currentExp: number;
  /** 境界 */
  realm: DemonicRealms;
}

export interface IDivineCultivation {
  type: CultivationType.Divine;
  /** 级别 */
  level: number;
  /** 当前经验 */
  currentExp: number;
  /** 境界 */
  realm: DivineRealms;
}

// 使用联合类型表示具体的修炼状态
export type ICultivation =
  | IDaoCultivation
  | IImmortalCultivation
  | IDemonicCultivation
  | IDivineCultivation;
