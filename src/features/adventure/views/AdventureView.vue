<!-- 冒险视图 - 场景探索主界面，管理场景、战斗、对话、商店等状态流转 -->
<template>
  <div class="scene-view-wrapper">
    <SceneList
      v-if="!currentScene && !isInBattle && !isConversationOpen && !isShopOpen"
      :scenes="scenes"
      @select="enterScene"
    />

    <SceneDetail
      v-else-if="currentScene && !isInBattle && !isConversationOpen && !isShopOpen"
      :scene="currentScene"
      :enemies="enemiesInScene"
      :npcs="npcsInScene"
      :can-fight-monster="canFightMonster"
      @back="exitScene"
      @challenge="challengeMonster"
      @talk="selectNPC"
    />

    <BattleView
      v-if="isInBattle && selectedMonster"
      :player="playerStore.finalPlayer"
      :enemy="selectedMonster"
      :scene-name="currentScene?.name"
      :show-close-button="true"
      @battle-end="onBattleEnd"
      @close="exitBattle"
    />

    <ConversationView v-if="isConversationOpen && selectedNPC" :npc="selectedNPC" @close="closeConversation" />

    <ShopView
      v-if="isShopOpen && selectedMerchant"
      :npc="selectedMerchant"
      @close="closeShop"
      @purchase="handlePurchase"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import ConversationView from '@/components/views/ConversationView.vue';
import ShopView from '@/components/views/ShopView.vue';
import BattleView from '@/features/battle/views/BattleView.vue';
import SceneDetail from '@/features/adventure/components/SceneDetail.vue';
import SceneList from '@/features/adventure/components/SceneList.vue';
import { isBattleVictory, partitionSceneCharacters } from '@/features/adventure/model/scene';
import type { ICharacter } from '@/interface/character';
import type { IItem } from '@/interface/item';
import type { Scene } from '@/interface/scene';
import { qianJieXing } from '@/scene/qianJieXing';
import { tianTingXing } from '@/scene/tianTingXing';
import { usePlayerStore } from '@/stores/player';
import { useQuestStore } from '@/stores/quest';
import type { IBattleSummary } from '@/utils/battle';
import { canFight } from '@/utils/battle';

const playerStore = usePlayerStore();
const questStore = useQuestStore();

// ==================== 数据定义 ====================

// 所有可用场景列表
const scenes: Scene[] = [tianTingXing, qianJieXing];

// ==================== 状态管理 ====================

// 当前所在场景
const currentScene = ref<Scene | null>(null);
// 当前选中的怪物
const selectedMonster = ref<ICharacter | null>(null);
// 当前选中的 NPC
const selectedNPC = ref<ICharacter | null>(null);
// 当前选中的商人
const selectedMerchant = ref<ICharacter | null>(null);
// 是否处于战斗中
const isInBattle = ref(false);
// 是否正在对话中
const isConversationOpen = ref(false);
// 是否正在商店中
const isShopOpen = ref(false);

// ==================== 计算属性 ====================

/** 当前场景中的所有角色 */
const sceneCharacters = computed(() => partitionSceneCharacters(currentScene.value));
/** 当前场景中的所有敌人 */
const enemiesInScene = computed(() => sceneCharacters.value.enemies);
/** 当前场景中的所有 NPC */
const npcsInScene = computed(() => sceneCharacters.value.npcs);

// ==================== 场景操作 ====================

/**
 * 进入指定场景
 * @param scene 目标场景
 */
const enterScene = (scene: Scene) => {
  currentScene.value = scene;
};

/**
 * 离开当前场景
 */
const exitScene = () => {
  currentScene.value = null;
  selectedMonster.value = null;
  selectedNPC.value = null;
  selectedMerchant.value = null;
};

// ==================== 战斗操作 ====================

/**
 * 挑战怪物
 * @param monster 要挑战的怪物
 */
const challengeMonster = (monster: ICharacter) => {
  selectedMonster.value = monster;
  isInBattle.value = true;
};

/**
 * 战斗结束处理
 * @param result 战斗结果摘要
 */
const onBattleEnd = (result: IBattleSummary) => {
  if (!selectedMonster.value) return;

  // 胜利时更新任务进度
  if (isBattleVictory(result.winner?.id, playerStore.player.id)) {
    questStore.updateQuestsByTarget('kill', selectedMonster.value.id, 1);
    questStore.updateQuestsByTarget('kill', 'any', 1);
  }
};

/**
 * 退出战斗
 */
const exitBattle = () => {
  isInBattle.value = false;
  selectedMonster.value = null;
};

// ==================== NPC 交互操作 ====================

/**
 * 选择 NPC 进行交互
 * @param npc 选择的 NPC
 */
const selectNPC = (npc: ICharacter) => {
  // 更新对话任务进度
  questStore.updateQuestsByTarget('talk', npc.id, 1);

  // 如果是商人，打开商店
  if (npc.type === 'merchant') {
    selectedMerchant.value = npc;
    isShopOpen.value = true;
    return;
  }

  // 否则打开对话
  selectedNPC.value = npc;
  isConversationOpen.value = true;
};

/** 关闭对话 */
const closeConversation = () => {
  isConversationOpen.value = false;
  selectedNPC.value = null;
};

/** 关闭商店 */
const closeShop = () => {
  isShopOpen.value = false;
  selectedMerchant.value = null;
};

/**
 * 处理购买物品
 * @param item 购买的物品
 */
const handlePurchase = (item: IItem) => {
  const result = playerStore.purchaseItem(item);
  alert(`【系统】${result.message}`);

  // 更新购买任务进度
  if (result.success) {
    questStore.updateQuestsByTarget('purchase', item.id, 1);
  }
};

// ==================== 工具方法 ====================

/**
 * 判断是否可以挑战怪物（等级限制检查）
 * @param monster 怪物对象
 */
const canFightMonster = (monster: ICharacter): boolean => {
  return !!monster.battle && canFight(playerStore.finalPlayer, monster).canFight;
};
</script>

<style lang="scss" scoped>
.scene-view-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>