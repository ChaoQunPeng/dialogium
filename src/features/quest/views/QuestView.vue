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
const activeTab = ref<QuestTabId>('available');

const questCollections = computed<QuestCollections>(() => ({
  available: questStore.availableQuests,
  inProgress: questStore.inProgressQuests,
  completed: questStore.completedQuests,
}));

const tabConfigs = computed(() => buildQuestTabConfigs(questCollections.value));
const displayQuests = computed(() => getQuestListByTab(activeTab.value, questCollections.value));

const handleAcceptQuest = (questId: string) => {
  questStore.acceptQuest(questId);
};

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