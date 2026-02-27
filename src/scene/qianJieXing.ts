import type { Scene } from '@/interface';
import {
  anLangQianJie,
  baiHuangLaoRen,
  fengZhiHao,
  lanDi,
  leiTianXiao,
  siTuYong,
  suZiQi,
  yingWuQu,
} from '@/npc';

export const qianJieXing: Scene = {
  id: 'qianJieXing',
  name: '潜杰星',
  description: '流放修真者的险恶星球，由百黄老人掌控、充斥阴狠势力且搅动修真界纷争的特殊据点。',
  characters: [
    baiHuangLaoRen,
    leiTianXiao,
    siTuYong,
    yingWuQu,
    suZiQi,
    lanDi,
    fengZhiHao,
    anLangQianJie,
  ],
};
