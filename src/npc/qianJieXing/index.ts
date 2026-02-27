import { CharacterType, type ICharacter } from '@/interface';

/**
 * 百黄老人 - 潜杰星恶霸组织首领
 * @description 修真界大宗师级人物，额头高耸、眼窝深陷，鼻梁高挺、嘴唇极薄，头发半白半黄垂至腰间，因潜杰星受封缘星压制而暂未大规模扩张势力
 * @type {ICharacter}
 */
export const baiHuangLaoRen: ICharacter = {
  id: 'baiHuangLaoRen',
  name: '百黄老人',
  type: CharacterType.Boss, // 核心反派BOSS（潜杰星最高势力）
  baseInfo: {
    level: 80, // 大宗师级对应等级
    hp: 12000,
    maxHp: 12000,
    mp: 11000,
    maxMp: 11000,
  },
  conversations: [
    {
      type: 'text',
      contentList: [
        '封缘星又如何？潜杰星迟早是老夫的天下！',
        '安郎那小子，倒是会办事，可惜太急功近利！',
        '雷天笑，去把那不识抬举的家伙处理掉！',
      ],
    },
  ],
};

/**
 * 雷天笑 - 百黄老人的核心手下
 * @description 阴毒狠辣、穷凶极恶，被花媚娘戏称为“小雷雷”，是百黄老人的得力干将，参与潜杰星及外部修真争斗
 * @type {ICharacter}
 */
export const leiTianXiao: ICharacter = {
  id: 'leiTianXiao',
  name: '雷天笑',
  type: CharacterType.Enemy, // 精英反派怪物
  baseInfo: {
    level: 65, // 核心手下对应等级
    hp: 9500,
    maxHp: 9500,
    mp: 8000,
    maxMp: 8000,
  },
  conversations: [
    {
      type: 'text',
      contentList: [
        '敢得罪百黄老人，小子你活腻了！',
        '花媚娘那婆娘，竟敢叫我小雷雷？！',
        '潜杰星的规矩，就是老夫的规矩！',
      ],
    },
  ],
};

/**
 * 司徒雍 - 百黄老人麾下“四霸将”之一，封号“斗战王”
 * @description 排名第二的核心战力，修为不弱，负责执行百黄老人的重要指令，行事彪悍、好战
 * @type {ICharacter}
 */
export const siTuYong: ICharacter = {
  id: 'siTuYong',
  name: '司徒雍',
  type: CharacterType.Enemy, // 精英反派怪物
  baseInfo: {
    level: 60, // 四霸将对应等级
    hp: 9000,
    maxHp: 9000,
    mp: 7500,
    maxMp: 7500,
  },
  conversations: [
    {
      type: 'text',
      contentList: [
        '斗战王在此，何人敢挡？！',
        '百黄老人的指令，便是天！',
        '潜杰星的地盘，容不得外人撒野！',
      ],
    },
  ],
};

/**
 * 应乌曲 - 百黄老人手下，绰号“乌头”
 * @description 活跃于暗影堡区域，负责潜杰星部分区域的势力管理及情报传递，组织内部中层执行者
 * @type {ICharacter}
 */
export const yingWuQu: ICharacter = {
  id: 'yingWuQu',
  name: '应乌曲',
  type: CharacterType.Enemy, // 普通反派怪物
  baseInfo: {
    level: 45, // 中层执行者对应等级
    hp: 7000,
    maxHp: 7000,
    mp: 5000,
    maxMp: 5000,
  },
  conversations: [
    {
      type: 'text',
      contentList: [
        '暗影堡的情报，已悉数上报百黄老人！',
        '乌头办事，你只管放心！',
        '敢泄露潜杰星的消息，格杀勿论！',
      ],
    },
  ],
};

/**
 * 苏子奇 - 潜杰星本地人，司徒雍的手下
 * @description 普通执行者，仅明确籍贯为潜杰星，跟随司徒雍参与组织相关行动，戏份较少
 * @type {ICharacter}
 */
export const suZiQi: ICharacter = {
  id: 'suZiQi',
  name: '苏子奇',
  type: CharacterType.Enemy, // 普通反派杂兵
  baseInfo: {
    level: 30, // 普通手下对应等级
    hp: 5000,
    maxHp: 5000,
    mp: 3000,
    maxMp: 3000,
  },
  conversations: [
    {
      type: 'text',
      contentList: ['司徒将军有令，随我冲！', '潜杰星本地人，岂会怕你？', '小的遵命，绝不敢怠慢！'],
    },
  ],
};

/**
 * 蓝狄 - 潜杰星籍贯普通住民
 * @description 未直接参与核心冲突，仅明确星球归属，属于潜杰星的普通关联角色
 * @type {ICharacter}
 */
export const lanDi: ICharacter = {
  id: 'lanDi',
  name: '蓝狄',
  type: CharacterType.Npc, // 普通NPC
  baseInfo: {
    level: 10, // 普通住民对应等级
    hp: 2000,
    maxHp: 2000,
    mp: 1500,
    maxMp: 1500,
  },
  conversations: [
    {
      type: 'text',
      contentList: [
        '潜杰星这地方，能活着就不错了...',
        '百黄老人的人，可惹不起啊！',
        '丽唐国的人？和咱们潜杰星没啥关系...',
      ],
    },
  ],
};

/**
 * 丰志豪 - 潜杰星籍贯普通人物
 * @description 剧情中未深入展开，仅明确其星球归属，无核心戏份
 * @type {ICharacter}
 */
export const fengZhiHao: ICharacter = {
  id: 'fengZhiHao',
  name: '丰志豪',
  type: CharacterType.Npc, // 普通NPC
  baseInfo: {
    level: 8, // 普通人物对应等级
    hp: 1800,
    maxHp: 1800,
    mp: 1200,
    maxMp: 1200,
  },
  conversations: [
    {
      type: 'text',
      contentList: [
        '俺就是潜杰星的，混口饭吃罢了',
        '没啥本事，就会点粗活',
        '不敢掺和那些修真者的事...',
      ],
    },
  ],
};

/**
 * 安郎 - 丽唐国供奉堂一品供奉（关联潜杰星）
 * @description 丽唐国皇帝皇叔，阴险狠毒，师门背景与潜杰星百黄老人关联，非潜杰星原生角色
 * @type {ICharacter}
 */
export const anLangQianJie: ICharacter = {
  id: 'anLangQianJie',
  name: '安郎',
  type: CharacterType.Boss, // 核心反派BOSS
  baseInfo: {
    level: 50, // 与之前天庭星配置保持一致
    hp: 7000,
    maxHp: 7000,
    mp: 6000,
    maxMp: 6000,
  },
  conversations: [
    {
      type: 'text',
      contentList: [
        '百黄老人那边，已替老夫打点妥当！',
        '借潜杰星的势力，定能拿下故宋国！',
        '梅家的灵丹，终究是老夫的囊中之物！',
      ],
    },
  ],
};

/**
 * 统一导出潜杰星所有角色配置
 * @description 便于外部模块批量导入，与天庭星角色配置格式统一
 */
export const qianJieXingCharacters = {
  baiHuangLaoRen,
  leiTianXiao,
  siTuYong,
  yingWuQu,
  suZiQi,
  lanDi,
  fengZhiHao,
  anLangQianJie,
};
