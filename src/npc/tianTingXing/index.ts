import { CharacterType, type ICharacter } from '@/interface';
import type { IItem } from '@/interface/item';
import { items } from '@/items';

/**
 * 赵豪 - 含林城赵记宝银饰金楼老爷子，李强的记名弟子
 * @description 七十多岁的修真者（开光期），为人豪爽、阅历丰富，曾凭一知半解的修炼方法强行修至开光期，后在李强指导下重新筑基，始终追随李强
 * @type {ICharacter}
 */
export const zhaoHao: ICharacter = {
  id: 'zhaoHao',
  name: '赵豪',
  type: CharacterType.Npc,
  baseInfo: {
    level: 15, // 开光期对应等级
    hp: 3000,
    maxHp: 3000,
    mp: 2000,
    maxMp: 2000,
  },
  conversations: [
    {
      type: 'text',
      contentList: [
        '李小子，老夫这条命，就交你手上了！',
        '含林城这地界，还轮不到黑旗军撒野！',
        '重新筑基后，老夫的修为总算走上正途了！',
      ],
    },
  ],
};

/**
 * 梅晶晶（妞妞） - 丽唐国人，七叉岭山寨大寨主
 * @description 修真者（开光初期），容貌娇俏、性格顽皮，因家族遭安郎陷害，与父母失散后流落山寨，后跟随李强
 * @type {ICharacter}
 */
export const meiJingJing: ICharacter = {
  id: 'meiJingJing',
  name: '梅晶晶',
  type: CharacterType.Npc,
  baseInfo: {
    level: 12, // 开光初期对应等级
    hp: 2500,
    maxHp: 2500,
    mp: 2500,
    maxMp: 2500,
  },
  conversations: [
    {
      type: 'text',
      contentList: [
        '强哥，我一定要找到爹娘！',
        '安郎那个坏蛋，我绝不会放过他！',
        '七叉岭的日子，可比在城里好玩多啦～',
      ],
    },
  ],
};

/**
 * 郑鹏（黑子） - 七叉岭山寨三寨主
 * @description 身高近两米的憨直壮汉，天生神力但缺乏武功技巧，因打赌输给李强而跟随其左右，性格忠厚、勇猛好斗
 * @type {ICharacter}
 */
export const zhengPeng: ICharacter = {
  id: 'zhengPeng',
  name: '郑鹏',
  type: CharacterType.Npc,
  baseInfo: {
    level: 18, // 天生神力对应等级
    hp: 5000,
    maxHp: 5000,
    mp: 1000,
    maxMp: 1000,
  },
  conversations: [
    {
      type: 'text',
      contentList: [
        '俺黑子说话算话，输了就跟李大哥走！',
        '谁敢动俺们兄弟，先过俺这关！',
        '打架俺最在行，啥黑旗军，干就完了！',
      ],
    },
  ],
};

/**
 * 侯霹净（赵岳） - 故宋国皇室宗亲，封号“大智威圣亲王”
 * @description 顶尖修真者，傅山的老友兼对头，性格洒脱、嗜酒如命，曾中“无情结”咒，被李强用酒精解开后成为其强力后盾
 * @type {ICharacter}
 */
export const houPiJing: ICharacter = {
  id: 'houPiJing',
  name: '侯霹净',
  type: CharacterType.Npc,
  baseInfo: {
    level: 70, // 顶尖修真者对应等级
    hp: 9000,
    maxHp: 9000,
    mp: 9000,
    maxMp: 9000,
  },
  conversations: [
    {
      type: 'text',
      contentList: [
        '哈哈哈，好酒！这无情结总算是解了！',
        '李强小子，老夫教你飞行之术，可别学笨了！',
        '傅山那老东西，倒是收了个好徒弟！',
      ],
    },
  ],
};

/**
 * 重要配角
 */

/**
 * 恩刚 - 黑旗军首领
 * @description 修真者，武艺高强，手持异宝“乌擎胆”，率领黑旗军围困含林城，与李强激战後两败俱伤，失去左臂
 * @type {ICharacter}
 */
export const enGang: ICharacter = {
  id: 'enGang',
  name: '恩刚',
  type: CharacterType.Enemy, // 修正为枚举中存在的Monster类型（精英怪物）
  baseInfo: {
    level: 40,
    hp: 6000,
    maxHp: 6000,
    mp: 3500,
    maxMp: 3500,
  },
  conversations: [
    {
      type: 'text',
      contentList: [
        '含林城今日必破！识相的赶紧投降！',
        '小子，竟敢伤我！此仇必报！',
        '乌擎胆的威力，岂是你能抵挡的！',
      ],
    },
  ],
};

/**
 * 丰凯云 - 含林城知府
 * @description 举人出身，因得罪人被贬至边远地区，城府较深，最初误将李强当作皇家贵族上报，后对李强恭敬有加
 * @type {ICharacter}
 */
export const fengKaiYun: ICharacter = {
  id: 'fengKaiYun',
  name: '丰凯云',
  type: CharacterType.Npc,
  baseInfo: {
    level: 5,
    hp: 1000,
    maxHp: 1000,
    mp: 500,
    maxMp: 500,
  },
  battle: {
    attack: 620,
    defense: 0,
    exp: 100,
    dropList: ['xuan_tie'],
  },
  conversations: [
    {
      type: 'text',
      contentList: [
        '贵客驾临，下官有失远迎！',
        '李大人，含林城的安危，就全靠您了！',
        '这黑旗军势大，还望大人出手相助啊！',
      ],
    },
  ],
};

/**
 * 程子重 - 丰凯云的席师爷
 * @description 处世圆滑、心思缜密，全程陪同李强，为其提供天庭星的世俗资讯与礼仪指导，后跟随李强前往都城
 * @type {ICharacter}
 */
export const chengZiZhong: ICharacter = {
  id: 'chengZiZhong',
  name: '程子重',
  type: CharacterType.Npc,
  baseInfo: {
    level: 4,
    hp: 800,
    maxHp: 800,
    mp: 400,
    maxMp: 400,
  },
  conversations: [
    {
      type: 'text',
      contentList: [
        '李大人，这天庭星的规矩，容小的为您细说！',
        '知府大人，此事还需从长计议啊！',
        '前往都城的路，小的已安排妥当！',
      ],
    },
  ],
};

/**
 * 安郎 - 丽唐国供奉堂一品供奉，丽唐国皇帝的皇叔
 * @description 修真者，阴险狠毒，因强行索要梅家灵丹未果，陷害梅傲一家，是梅晶晶的仇人，丽唐国特使出使故宋国
 * @type {ICharacter}
 */
export const anLang: ICharacter = {
  id: 'anLang',
  name: '安郎',
  type: CharacterType.Boss, // 修正为枚举中存在的Boss类型（核心反派）
  baseInfo: {
    level: 50,
    hp: 7000,
    maxHp: 7000,
    mp: 6000,
    maxMp: 6000,
  },
  conversations: [
    {
      type: 'text',
      contentList: [
        '梅傲不识抬举，这就是下场！',
        '区区一个毛头小子，也敢管老夫的事？',
        '丽唐国的威严，岂容尔等践踏！',
      ],
    },
  ],
};

/**
 * 元霸 - 黑旗军第三旗将
 * @description 天生神力，率军围攻含林城，被李强与赵豪击退
 * @type {ICharacter}
 */
export const yuanBa: ICharacter = {
  id: 'yuanBa',
  name: '元霸',
  type: CharacterType.Enemy, // 修正为枚举中存在的Monster类型（普通怪物）
  introduction: '黑旗军第三旗将，天生神力，率军围攻含林城，被李强与赵豪击退',

  baseInfo: {
    level: 25,
    hp: 4500,
    maxHp: 4500,
    mp: 1500,
    maxMp: 1500,
  },

  conversations: [
    {
      type: 'text',
      contentList: ['俺元霸的力气，能扛山！', '给我冲！拿下含林城！', '这老头（赵豪）有点东西！'],
    },
  ],

  battle: {
    attack: 500,
    defense: 10,
    exp: 100,
    dropList: ['xuan_tie'],
  },
};

/**
 * 故宋国皇上 - 故宋国君主
 * @description 对侯霹净极为敬重，封李强为一品供奉、虎威将军，任命其为谈判特使，试图借助李强的修真实力解决与丽唐国的争端
 * @type {ICharacter}
 */
export const guSongHuangShang: ICharacter = {
  id: 'guSongHuangShang',
  name: '故宋国皇上',
  type: CharacterType.Npc,
  baseInfo: {
    level: 10,
    hp: 2000,
    maxHp: 2000,
    mp: 1500,
    maxMp: 1500,
  },
  conversations: [
    {
      type: 'text',
      contentList: [
        '侯亲王，朕就倚仗你了！',
        '封李强为一品供奉、虎威将军，即刻接旨！',
        '丽唐国欺人太甚，绝不能退让！',
      ],
    },
  ],
};

/**
 * 林万金 - 含林城最大商会的会长
 * @description 精明的商人，掌握着整个含林城的物资流通，与各方势力都有往来，只认钱不认人，但只要有钱什么都能买到
 * @type {ICharacter}
 */
export const linWanJin: ICharacter = {
  id: 'linWanJin',
  name: '林万金',
  type: CharacterType.Merchant,
  introduction: '含林城最大商会的会长，富可敌国的精明商人',
  baseInfo: {
    level: 8,
    hp: 1500,
    maxHp: 1500,
    mp: 800,
    maxMp: 800,
  },
  interact: {
    canTalk: true,
    services: ['shop'],
    shopName: '万宝阁',
    greeting: '哎呀，贵客临门！金银财宝、灵丹妙药，您想要啥？',
    shopItems: [
      // 丹药类
      items.pu_tong_cao_yao,
      items.pu_tong_lan_yao,
      // 装备类
      items.han_bi_jian,
      items.jin_die_dao,
      items.na_jie_shou_zhuo,
      // 材料类
      items.xuan_tie,
      items.ge_bu_lin,
    ].filter((item): item is IItem => item !== undefined),
  },
  conversations: [
    {
      type: 'text',
      contentList: [
        '哎哟，这位道友面生得很！来来来，看看我这儿有没有您需要的宝贝？',
        '嘿嘿，只要您出得起价，别说丹药法宝，就是天上的星星我也能给您弄来！',
        '做生意嘛，讲究的就是一个诚信！您说是不是这个理儿？',
      ],
    },
  ],
};

/**
 * 统一导出所有角色配置
 * @description 便于外部模块批量导入，支持按需导入或全量导入
 */
export const tianTingXingCharacters = {
  zhaoHao,
  meiJingJing,
  zhengPeng,
  houPiJing,
  enGang,
  fengKaiYun,
  chengZiZhong,
  anLang,
  yuanBa,
  guSongHuangShang,
  linWanJin,
};
