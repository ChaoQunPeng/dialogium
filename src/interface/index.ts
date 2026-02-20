// 统一导出所有接口定义

// 从各个模块重新导出接口
export type { ICharacter } from './character';
export type { IConversationItem } from './conversation';
export type {
  IDaoCultivation,
  IImmortalCultivation,
  IDemonicCultivation,
  IDivineCultivation,
  ICultivation,
} from './cultivation';
export type { IItem, IItemInstance, IInventoryItem } from './item';
export type { Scene } from './scene';

// 重新导出所需的枚举类型
export { CharacterType } from '@/enums';
export type {
  CultivationType,
  DaoRealms,
  ImmortalRealms,
  DemonicRealms,
  DivineRealms,
} from '@/enums';
