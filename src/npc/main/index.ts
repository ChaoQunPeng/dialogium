import { CharacterType, type ICharacter } from '@/interface';

/**
 * 傅山
 */
export const fuShan: ICharacter = {
  id: 'fuShan',
  name: '傅山',
  type: CharacterType.Npc,
  baseInfo: {
    level: 75,
    hp: 10000,
    maxHp: 10000,
    mp: 10000,
    maxMp: 10000,
  },
  conversations: [
    {
      type: 'text',
      contentList: ['你好李强, 跟我走吧'],
    },
  ],
};
