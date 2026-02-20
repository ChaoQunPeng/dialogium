import type { IItem } from '@/interface';

const goblinDropItems: IItem[] = [
  {
    id: 'goblin_tooth',
    name: '哥布林牙齿',
    category: 'material',
    count: 1,
    description: '哥布林的尖牙，散发着淡淡的绿光，可用来制作初级毒药',
    price: 5,
    grade: 1,
  },
  {
    id: 'goblin_hide',
    name: '哥布林皮',
    category: 'material',
    count: 1,
    description: '粗糙的绿色兽皮，韧性不错，可用于制作初级护甲',
    price: 8,
    grade: 1,
  },
  {
    id: 'small_health_potion',
    name: '小型回血丹',
    category: 'consumable',
    count: 1,
    description: '初级疗伤丹药，能够恢复少量气血',
    price: 15,
    grade: 1,
    useAction: {
      hpRestore: 50,
      isConsumable: true,
    },
  },
];

export default { goblinDropItems };
