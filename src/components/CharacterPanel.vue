<template>
  <div>
    <BorderContainer title="个人属性">
      <div>攻击力: {{ player.battle?.attack }}</div>
      <div>防御力: {{ player.battle?.attack }}</div>
    </BorderContainer>

    <BorderContainer title="穿戴装备">
      <div class="equip-line-grid">
        <div v-for="slot in equipmentSlots" :key="slot.key" class="slot-item">
          <div class="slot-inner">
            <span class="s-label">{{ slot.label }}:</span>
            <span :class="['s-name', { 'is-empty': !equippedMap[slot.key] }]">
              {{ equippedMap[slot.key] ? equippedMap[slot.key].name : '空' }}
            </span>
          </div>
        </div>
      </div>
    </BorderContainer>

    <BorderContainer :title="`储物纳戒 (${filteredInventory.length})`">
      <div class="tab-row">
        <div
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab-link', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          {{ activeTab === tab.key ? `[${tab.name}]` : tab.name }}
        </div>
      </div>

      <div class="text-list">
        <div class="list-head">序号. 名称 数量 指令</div>
        <div class="dot-line">----------------------------------------</div>
        <div v-for="(item, index) in filteredInventory" :key="index" class="list-row">
          <span class="idx">{{ (index + 1).toString().padStart(2, '0') }}.</span>
          <span class="name"
            >{{ item.name }} <span v-if="item.isLocked" class="lock">[锁]</span></span
          >
          <span class="cnt">x{{ item.count }}</span>
          <div class="cmds">
            <span
              v-if="item.category === 'equipment'"
              class="cmd-btn cyan"
              @click="item.isEquipped ? handleUnequip(item) : equipItem(item.instanceId)"
            >
              {{ item.isEquipped ? '卸' : '穿' }}
            </span>
            <span
              v-if="!item.isEquipped && !item.isLocked"
              class="cmd-btn red"
              @click="showDropConfirm(item)"
              >弃</span
            >
          </div>
        </div>
        <div v-if="filteredInventory.length === 0" class="empty-text">--- 纳戒空无一物 ---</div>
      </div>
    </BorderContainer>

    <div v-if="showDropDialog" class="modal-overlay" @click="closeDropDialog">
      <div class="modal-box" @click.stop>
        <div class="modal-header">! 确认丢弃 !</div>
        <div class="modal-body">确认将 [ {{ selectedItem?.name }} ] 丢弃？</div>
        <div class="modal-footer">
          <span class="modal-btn red" @click="confirmDrop">[ 确认 ]</span>
          <span class="modal-btn" @click="closeDropDialog">[ 取消 ]</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
// 假设类型定义和物品数据在指定路径下存在
import type { IItemInstance } from '../interface/index';
import { items } from '../items/index';
import { usePlayerStore } from '../stores/player';
const playerStore = usePlayerStore();

const player = computed(() => {
  return playerStore.player;
});

// 纳戒数据与分类逻辑
const activeTab = ref('equipment');
const tabs = [
  // { name: '全部', key: 'all' },
  { name: '装备', key: 'equipment' },
  { name: '丹药', key: 'consumable' },
  { name: '材料', key: 'material' },
];

// 丢弃功能相关状态
const showDropDialog = ref(false);
const selectedItem = ref<any>(null);

// 定义固定的五个部位及其展示名称
const equipmentSlots = [
  { key: 'weapon', label: '武器' },
  { key: 'body', label: '上衣' },
  { key: 'shoulder', label: '头肩' },
  { key: 'belt', label: '腰带' },
  { key: 'leg', label: '下装' },
  { key: 'shoes', label: '鞋子' },
];

// 计算当前已穿戴的装备映射表
const equippedMap = computed(() => {
  const map: Record<string, any> = {};
  inventory.value.forEach((item) => {
    if (item.isEquipped && item.slot) {
      map[item.slot] = item;
    }
  });
  return map;
});

// 将物品实例转换为展示格式
const inventory = computed(() => {
  return playerStore.inventory.map((itemInstance: IItemInstance) => {
    // 根据 itemId 查找物品配置
    const itemConfig = items[itemInstance.itemId];

    if (!itemConfig) {
      // 如果找不到配置，使用默认值
      return {
        id: crypto.randomUUID(),
        name: '未知物品',
        category: '',
        //
        count: itemInstance.count,
        isLocked: itemInstance.isLocked,
        isEquipped: itemInstance.isEquipped,
        instanceId: itemInstance.instanceId,
      };
    }

    return {
      id: itemConfig.id,
      name: itemConfig.name,
      category: itemConfig.category,
      description: itemConfig.description,
      slot: itemConfig.slot,
      level: itemConfig.level,
      price: itemConfig.price,
      stackable: itemConfig.stackable,
      stats: itemConfig.stats,
      // 用户数据
      count: itemInstance.count,
      isLocked: itemInstance.isLocked,
      isEquipped: itemInstance.isEquipped,
      instanceId: itemInstance.instanceId,
    };
  });
});

// 核心：分类过滤逻辑
const filteredInventory = computed(() => {
  if (activeTab.value === 'all') return inventory.value;
  return inventory.value.filter(
    (item: (typeof inventory.value)[number]) => item.category === activeTab.value,
  );
});

// 是否是特殊装备
const isSpecialEquipment = (itemId: string) => {
  return ['zi_yan_xin'].includes(itemId);
};

// 装备相关方法
const equipItem = (instanceId: string) => {
  playerStore.equipItem(instanceId);
};

// 丢弃物品相关方法
const showDropConfirm = (item: any) => {
  if (item.isEquipped || item.isLocked) {
    return;
  }
  selectedItem.value = item;
  showDropDialog.value = true;
};

const closeDropDialog = () => {
  showDropDialog.value = false;
  selectedItem.value = null;
};

const confirmDrop = () => {
  if (selectedItem.value && !selectedItem.value.isEquipped && !selectedItem.value.isLocked) {
    playerStore.dropItem(selectedItem.value.instanceId);
    closeDropDialog();
  }
};

/**
 * 处理脱下点击
 * @param item 装备实例
 */
const handleUnequip = (item: any) => {
  if (!item) return; // 没装备时不操作

  // 可以在这里加个简单的提示，或者直接脱下
  playerStore.unequipItem(item.instanceId);
  console.log(`脱下了：${item.name}`);
};

// 组件挂载时加载数据
onMounted(() => {});
</script>

<style lang="scss" scoped>
.tab-row {
  display: flex;

  .tab-link {
    margin-right: 8px;
    cursor: pointer;

    &.active {
      color: var(--color-yellow);
    }
  }
}
</style>
