import type { IItem, IInventoryItem, IItemInstance, SlotType } from '@/interface/item';
import { items } from '@/items';

export type InventoryTab = 'equipment' | 'consumable' | 'material';

export interface InventoryTabConfig {
  key: InventoryTab;
  name: string;
}

export interface EquipmentSlotConfig {
  key: SlotType;
  label: string;
}

export type CharacterInventoryItem = IInventoryItem & {
  stats?: IItem['stats'];
};

export const INVENTORY_TABS: InventoryTabConfig[] = [
  { key: 'equipment', name: '装备' },
  { key: 'consumable', name: '丹药' },
  { key: 'material', name: '材料' },
];

export const EQUIPMENT_SLOTS: EquipmentSlotConfig[] = [
  { key: 'weapon', label: '武器' },
  { key: 'body', label: '上衣' },
  { key: 'shoulder', label: '头肩' },
  { key: 'belt', label: '腰带' },
  { key: 'leg', label: '下装' },
  { key: 'shoes', label: '鞋子' },
];

const toFallbackInventoryItem = (itemInstance: IItemInstance): CharacterInventoryItem => ({
  id: itemInstance.mid,
  name: '未知物品',
  category: 'unknown',
  description: '未知物品',
  slot: 'none',
  level: 1,
  price: 0,
  stackable: false,
  grade: 'Normal',
  count: itemInstance.n,
  isLocked: itemInstance.l === 1,
  isEquipped: itemInstance.e === 1,
  instanceId: itemInstance.id,
});

export const mapInventoryItems = (inventory: IItemInstance[]): CharacterInventoryItem[] => {
  return inventory.map((itemInstance) => {
    const itemConfig = items[itemInstance.mid];
    if (!itemConfig) return toFallbackInventoryItem(itemInstance);

    return {
      id: itemConfig.id,
      name: itemConfig.name,
      category: itemConfig.category,
      description: itemConfig.description || '--',
      slot: itemConfig.slot || 'none',
      level: itemConfig.level || 1,
      price: itemConfig.price || 0,
      stackable: itemConfig.stackable ?? false,
      grade: itemConfig.grade || 'Normal',
      stats: itemConfig.stats,
      count: itemInstance.n,
      isLocked: itemInstance.l === 1,
      isEquipped: itemInstance.e === 1,
      instanceId: itemInstance.id,
    };
  });
};

export const buildEquippedMap = (
  inventory: CharacterInventoryItem[],
): Partial<Record<SlotType, CharacterInventoryItem>> => {
  const equippedMap: Partial<Record<SlotType, CharacterInventoryItem>> = {};

  inventory.forEach((item) => {
    if (item.isEquipped && item.slot !== 'none') {
      equippedMap[item.slot as SlotType] = item;
    }
  });

  return equippedMap;
};

export const mergeInventoryItems = (
  inventory: CharacterInventoryItem[],
  activeTab: InventoryTab,
): CharacterInventoryItem[] => {
  const mergedItems = new Map<string, CharacterInventoryItem>();

  inventory
    .filter((item) => !item.isEquipped)
    .filter((item) => item.category === activeTab)
    .forEach((item) => {
      const existing = mergedItems.get(item.id);
      if (existing) {
        existing.count += item.count;
        return;
      }

      mergedItems.set(item.id, { ...item });
    });

  return Array.from(mergedItems.values()).sort((a, b) => a.name.localeCompare(b.name));
};