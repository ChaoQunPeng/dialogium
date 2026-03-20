import { describe, expect, it } from 'vitest';
import type { ICharacter } from '@/interface/character';
import type { IItemInstance } from '@/interface/item';
import { QuestObjectiveType, QuestStatus, QuestType, type IQuest } from '@/interface/quest';
import type { Scene } from '@/interface/scene';
import {
  getCharacterTypeClass,
  isBattleVictory,
  partitionSceneCharacters,
} from '@/features/adventure/model/scene';
import {
  buildEquippedMap,
  mapInventoryItems,
  mergeInventoryItems,
} from '@/features/character/model/inventory';
import {
  buildQuestTabConfigs,
  formatReward,
  getObjectiveIcon,
  getQuestListByTab,
  getQuestStatusLabel,
  getQuestTypeLabel,
} from '@/features/quest/model/quest';

const createCharacter = (id: string, type: ICharacter['type']): ICharacter => ({
  id,
  name: id,
  type,
  baseInfo: {
    level: 1,
    hp: 100,
    maxHp: 100,
    mp: 20,
    maxMp: 20,
  },
});

const createQuest = (id: string, status: QuestStatus): IQuest => ({
  id,
  name: id,
  description: `${id} description`,
  type: QuestType.Side,
  status,
  objectives: [
    {
      id: `${id}-objective`,
      description: '击败目标',
      type: QuestObjectiveType.Kill,
      target: 'any',
      current: 0,
      required: 1,
      completed: false,
    },
  ],
  rewards: [{ type: 'exp', amount: 10 }],
});

describe('feature models', () => {
  it('partitions scene characters by gameplay role', () => {
    const scene: Scene = {
      id: 'tian-ting',
      name: '天庭星',
      characters: [
        createCharacter('enemy-1', 'enemy'),
        createCharacter('boss-1', 'boss'),
        createCharacter('npc-1', 'npc'),
        createCharacter('merchant-1', 'merchant'),
      ],
    };

    const groups = partitionSceneCharacters(scene);

    expect(groups.enemies.map((character) => character.id)).toEqual(['enemy-1', 'boss-1']);
    expect(groups.npcs.map((character) => character.id)).toEqual(['npc-1', 'merchant-1']);
    expect(getCharacterTypeClass('merchant')).toBe('merchant-type');
    expect(isBattleVictory('player-1', 'player-1')).toBe(true);
    expect(isBattleVictory('enemy-1', 'player-1')).toBe(false);
  });

  it('maps, groups, and indexes inventory items for the character feature', () => {
    const inventory: IItemInstance[] = [
      { mid: 'jin_die_dao_weapon', id: 'weapon-1', n: 1, e: 1, l: 0 },
      { mid: 'pu_tong_cao_yao', id: 'consumable-1', n: 2, e: 0, l: 0 },
      { mid: 'pu_tong_cao_yao', id: 'consumable-2', n: 3, e: 0, l: 0 },
      { mid: 'unknown_item', id: 'unknown-1', n: 1, e: 0, l: 1 },
    ];

    const mappedInventory = mapInventoryItems(inventory);
    const equippedMap = buildEquippedMap(mappedInventory);
    const consumables = mergeInventoryItems(mappedInventory, 'consumable');

    expect(equippedMap.weapon?.id).toBe('jin_die_dao_weapon');
    expect(consumables).toHaveLength(1);
    expect(consumables[0]).toMatchObject({ id: 'pu_tong_cao_yao', count: 5 });
    expect(mappedInventory.find((item) => item.instanceId === 'unknown-1')).toMatchObject({
      id: 'unknown_item',
      name: '未知物品',
      isLocked: true,
    });
  });

  it('builds quest tabs and quest presentation helpers', () => {
    const collections = {
      available: [createQuest('quest-1', QuestStatus.Available)],
      inProgress: [createQuest('quest-2', QuestStatus.InProgress)],
      completed: [createQuest('quest-3', QuestStatus.Completed)],
    };

    expect(buildQuestTabConfigs(collections)).toEqual([
      { id: 'available', label: '可接受', count: 1 },
      { id: 'inProgress', label: '进行中', count: 1 },
      { id: 'completed', label: '可领取', count: 1 },
    ]);
    expect(getQuestListByTab('inProgress', collections).map((quest) => quest.id)).toEqual(['quest-2']);
    expect(getQuestTypeLabel(QuestType.Main)).toBe('主线');
    expect(getQuestStatusLabel(QuestStatus.Completed)).toBe('🎉 已完成');
    expect(getObjectiveIcon(QuestObjectiveType.Talk)).toBe('💬');
    expect(formatReward({ type: 'currency', amount: 88 })).toBe('88 灵石');
  });
});
