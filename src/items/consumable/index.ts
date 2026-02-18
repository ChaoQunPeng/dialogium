import type { IItemConfig } from '../interface';

/**
 * 满天星套装 - 傅山亲制，紫炎流转
 * 属性：高防御、高气血、增加灵力上限
 */
const puTongCaoYao: IItemConfig = {
  id: 'pu_tong_cao_yao',
  name: '普通红药',
  category: 'consumable',
  description: '普通草药，用于恢复生命值。',
  stackable: true,
  level: 1,
  price: 10,
  stats: {
    mp: 10,
  },
};

/**
 * 满天星套装 - 傅山亲制，紫炎流转
 * 属性：高防御、高气血、增加灵力上限
 */
const puTongLanYao: IItemConfig = {
  id: 'pu_tong_lan_yao',
  name: '普通蓝药',
  category: 'consumable',
  description: '普通蓝药，用于恢复灵力。',
  stackable: true,
  level: 1,
  price: 10,
  stats: {
    hp: 10,
  },
};

export default { puTongCaoYao, puTongLanYao };
