/** 境界唯一标识 Key */
export enum RealmTypeKey {
  /** 筑基期：修真入门，铸就根基 */
  ZHU_JI = 'ZHU_JI',
  /** 开光期：开启灵智，眼界初开 */
  KAI_GUANG = 'KAI_GUANG',
  /** 融合期：真元融合，肉身蜕变 */
  RONG_HE = 'RONG_HE',
  /** 心动期：心境波动，最易走火入魔 */
  XIN_DONG = 'XIN_DONG',
  /** 灵寂期：灵力沉寂，内敛巅峰 */
  LING_JI = 'LING_JI',
  /** 元婴期：破茧成婴，拥有第二条命 */
  YUAN_YING = 'YUAN_YING',
  /** 出窍期：元婴离体，神游四海 */
  CHU_QIAO = 'CHU_QIAO',
  /** 分神期：神识分裂，多重感知 */
  FEN_SHEN = 'FEN_SHEN',
  /** 合体期：身神合一，不死不灭 */
  HE_TI = 'HE_TI',
  /** 渡劫期：对抗天劫，生死一线 */
  DU_JIE = 'DU_JIE',
  /** 大乘期：肉身通神，等待飞升 */
  DA_CHENG = 'DA_CHENG',
}

/** 境界对应的数值 Code (步长留放 100，便于后期插入半步境界) */
export const RealmTypeCode: Record<RealmTypeKey, number> = {
  /** 筑基期强度值 */
  [RealmTypeKey.ZHU_JI]: 100,
  /** 开光期强度值 */
  [RealmTypeKey.KAI_GUANG]: 200,
  /** 融合期强度值 */
  [RealmTypeKey.RONG_HE]: 300,
  /** 心动期强度值 */
  [RealmTypeKey.XIN_DONG]: 400,
  /** 灵寂期强度值 */
  [RealmTypeKey.LING_JI]: 500,
  /** 元婴期强度值 */
  [RealmTypeKey.YUAN_YING]: 600,
  /** 出窍期强度值 */
  [RealmTypeKey.CHU_QIAO]: 700,
  /** 分神期强度值 */
  [RealmTypeKey.FEN_SHEN]: 800,
  /** 合体期强度值 */
  [RealmTypeKey.HE_TI]: 900,
  /** 渡劫期强度值 */
  [RealmTypeKey.DU_JIE]: 1000,
  /** 大乘期强度值 */
  [RealmTypeKey.DA_CHENG]: 1100,
};

/** 境界对应的中文名，直接用于前端文字输出 */
export const RealmTypeName: Record<RealmTypeKey, string> = {
  /** 筑基期中文描述 */
  [RealmTypeKey.ZHU_JI]: '筑基',
  /** 开光期中文描述 */
  [RealmTypeKey.KAI_GUANG]: '开光',
  /** 融合期中文描述 */
  [RealmTypeKey.RONG_HE]: '融合',
  /** 心动期中文描述 */
  [RealmTypeKey.XIN_DONG]: '心动',
  /** 灵寂期中文描述 */
  [RealmTypeKey.LING_JI]: '灵寂',
  /** 元婴期中文描述 */
  [RealmTypeKey.YUAN_YING]: '元婴',
  /** 出窍期中文描述 */
  [RealmTypeKey.CHU_QIAO]: '出窍',
  /** 分神期中文描述 */
  [RealmTypeKey.FEN_SHEN]: '分神',
  /** 合体期中文描述 */
  [RealmTypeKey.HE_TI]: '合体',
  /** 渡劫期中文描述 */
  [RealmTypeKey.DU_JIE]: '渡劫',
  /** 大乘期中文描述 */
  [RealmTypeKey.DA_CHENG]: '大乘',
};
