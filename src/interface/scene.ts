/**
 * 表示游戏场景的数据结构
 */
export interface Scene {
  /** 场景唯一标识 */
  id: string;
  /** 场景名称 */
  name: string;
  /** 出现的角色 */
  characters: ICharacter[];
}
