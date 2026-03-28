<!-- 任务视图 - 展示任务列表和管理任务状态 -->
<template>
  <div class="quest-view">
    <QuestPanelHeader v-model="activeTab" :tabs="tabConfigs" />
    <QuestList :items="displayQuests" @accept="handleAcceptQuest" @claim="handleClaimQuest" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import QuestList from '@/features/quest/components/QuestList.vue';
import QuestPanelHeader from '@/features/quest/components/QuestPanelHeader.vue';
import {
  buildQuestTabConfigs,
  getQuestListByTab,
  type QuestCollections,
  type QuestTabId,
} from '@/features/quest/model/quest';
import { useQuestStore } from '@/stores/quest';

const questStore = useQuestStore();

// ==================== 状态管理 ====================

// 当前选中的任务标签页
const activeTab = ref<QuestTabId>('available');

// ==================== 计算属性 ====================

/** 任务集合（按状态分类） */
const questCollections = computed<QuestCollections>(() => ({
  available: questStore.availableQuests,
  inProgress: questStore.inProgressQuests,
  completed: questStore.completedQuests,
}));

/** 标签页配置 */
const tabConfigs = computed(() => buildQuestTabConfigs(questCollections.value));
/** 根据标签页显示的任务列表 */
const displayQuests = computed(() => getQuestListByTab(activeTab.value, questCollections.value));

// ==================== 事件处理 ====================

/** 接受任务 */
const handleAcceptQuest = (questId: string) => {
  questStore.acceptQuest(questId);
};

/** 领取任务奖励 */
const handleClaimQuest = (questId: string) => {
  questStore.claimReward(questId);
};
</script>

<style lang="scss" scoped>
.quest-view {
  padding: 16px;
  height: 100%;
  overflow-y: auto;
}
</style>