import type { Scene } from '@/interface';

export const scene: Scene = {
  name: '封缘星',
  npcList: [
    {
      name: '重玄派师弟',
      conversationList: [
        {
          contentList: ['这是封缘星，请坐。'],
          type: 'text',
        },
      ],
    },
  ],
  monsterList: [
    {
      name: '血牙狼妖',
      type: 'elite', // 精英怪
      level: 42,
      hp: 9600,
      attack: 480,
      defense: 320,
      exp: 1450,
      conversationList: [],
      dropList: [
        {
          id: 'material',
          name: '妖狼牙齿',
          count: 2,
        },
        {
          id: 'equip',
          name: '锋利爪刃',
          count: 1,
        },
      ],
    },
    {
      name: '烈焰魔蛛',
      type: 'normal', // 普通怪
      level: 35,
      hp: 6500,
      attack: 360,
      defense: 180,
      exp: 800,
      conversationList: [],
      dropList: [
        {
          id: 'material',
          name: '魔蛛丝',
          count: 3,
        },
      ],
    },
    {
      name: '石甲力士',
      type: 'elite', // 精英怪
      level: 45,
      hp: 12000,
      attack: 520,
      defense: 450,
      exp: 1800,
      conversationList: [],
      dropList: [
        {
          id: 'item',
          name: '石甲碎片',
          count: 1,
        },
        {
          id: 'material',
          name: '精铁矿石',
          count: 5,
        },
      ],
    },
    {
      name: '幻影刺客',
      type: 'boss', // BOSS怪
      level: 50,
      hp: 20000,
      attack: 750,
      defense: 400,
      exp: 3500,
      conversationList: [],
      dropList: [
        {
          id: 'equip',
          name: '暗影匕首',
          count: 1,
        },
        {
          id: 'skill',
          name: '刺客秘籍',
          count: 1,
        },
        {
          id: 'material',
          name: '神秘精华',
          count: 3,
        },
      ],
    },
    {
      name: '冰霜法师',
      type: 'normal', // 普通怪
      level: 39,
      hp: 5800,
      attack: 550,
      defense: 200,
      exp: 950,
      conversationList: [],
      dropList: [
        {
          id: 'item',
          name: '寒冰水晶',
          count: 1,
        },
      ],
    },
  ],
};
