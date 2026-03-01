import type { IItem } from '@/interface';

const baiRenQiang: Record<string, IItem> = {
  bai_ren_qiang: {
    id: 'bai_ren_qiang',
    name: '百刃枪',
    category: 'equipment',
    description: '李强自己修炼的第一把武器',
    slot: 'weapon',
    level: 1,
    grade: 'Rare',
    price: 0,
    stackable: false,
    stats: {
      attack: 100,
      defense: 100,
      maxHp: 100,
      maxMp: 100,
    },
  },
};

export { baiRenQiang };
