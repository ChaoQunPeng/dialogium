import type { Scene } from '@/interface';

export const scene: Scene = {
  name: '封缘星',
  npcList: [
    {
      name: '重玄派师弟',
      conversationList: [
        {
          content: ['这是封缘星，请坐。'],
          type: 'text',
        },
      ],
    },
  ],
  monsterList: [
    {
      name: 'monster1',
      type: 'elite', // 精英怪
      level: 38,
      hp: 8500,
      attack: 420,
      defense: 280,
      exp: 1200,
      conversationList: [],
      dropList: [
        {
          id: 'item',
          name: 'item1',
          count: 1,
        },
      ],
    },
  ],
};
