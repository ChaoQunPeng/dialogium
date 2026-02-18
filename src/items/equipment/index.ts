import { manTianXin } from './man_tian_xing';
import { ziYanXin } from './zi_yan_xin';
import { jinDieDao } from './jin_die_dao';
import { hanBiJian } from './han_bi_jian';
import { naJieShouZhuo } from './na_jie_shou_zhuo';
import { tanBoShouZhuo } from './tan_bo_shou_zhuo';
import { wuSeYanLuoZhao } from './wu_se_yan_luo_zhao';

export default {
  ...manTianXin,
  ...ziYanXin,
  ...jinDieDao,
  ...hanBiJian,
  ...naJieShouZhuo,
  ...tanBoShouZhuo,
  ...wuSeYanLuoZhao,
};
