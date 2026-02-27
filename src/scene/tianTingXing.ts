import type { Scene } from '@/interface';
import {
  chengZiZhong,
  fengKaiYun,
  guSongHuangShang,
  houPiJing,
  meiJingJing,
  yuanBa,
  zhaoHao,
  fuShan,
} from '@/npc/index';

export const tianTingXing: Scene = {
  id: 'tianTingXing',
  name: '天庭星',
  description: '承载地球古文明印记、地貌丰富多样、修真与世俗文明交织且纷争不断的异星世界。',
  characters: [
    fuShan,
    zhaoHao,
    chengZiZhong,
    meiJingJing,
    yuanBa,
    houPiJing,
    guSongHuangShang,
    fengKaiYun,
  ],
};
