<template>
  <div class="app-container">
    <StartScreenView v-if="!playerStore.isGameStarted" @game-started="handleGameStarted" />

    <template v-else>
      <!-- 调息视图（全屏覆盖） -->
      <MeditationView v-if="playerStore.isMeditating" />

      <GameHeader />

      <main class="game-content">
        <CharacterPanelView v-show="activeTab === 'realm'" />
        <AdventureView v-show="activeTab === 'adventure'" />
        <QuestView v-show="activeTab === 'quest'" />
      </main>

      <GameNavigation :tabs="APP_TABS" :active-tab="activeTab" @select="activeTab = $event" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import GameHeader from '@/features/app/components/GameHeader.vue';
import GameNavigation from '@/features/app/components/GameNavigation.vue';
import { APP_TABS, type GameTabId } from '@/features/app/config/navigation';
import AdventureView from '@/features/adventure/views/AdventureView.vue';
import CharacterPanelView from '@/features/character/views/CharacterPanelView.vue';
import QuestView from '@/features/quest/views/QuestView.vue';
import StartScreenView from '@/features/start/views/StartScreenView.vue';
import MeditationView from '@/features/character/views/MeditationView.vue';
import { usePlayerStore } from '@/stores/player';
import { useQuestStore } from '@/stores/quest';
import { STORAGE_KEYS } from '@/constants';

const playerStore = usePlayerStore();
const questStore = useQuestStore();

const handleGameStarted = () => {
  playerStore.setGameStarted(true);
};

onMounted(() => {
  const hasPlayerData = localStorage.getItem(STORAGE_KEYS.PLAYER_DATA);
  if (hasPlayerData) {
    playerStore.loadStorageData();
    questStore.loadQuests();
    playerStore.setGameStarted(true);
  }
});

const activeTab = ref<GameTabId>('realm');
</script>

<style lang="scss">
:root {
  --bg-main: #121212;
  --bg-card: #1e1e1e;
  --text-main: #d4d4d4;
  --text-muted: #a0a0a0;
  --color-yellow: #eec43f;
  --color-green: #4dbd74;
  --color-red: #ff4d4d;
  --color-cyan: #40e0d0;
  --color-gray: #8b8b8b;
  --color-blue: #60a5fa;
  --color-purple: #c084fc;
  --color-border: rgba(255, 255, 255, 0.1);
  --transition: all 0.3s ease;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'STKaiti', serif;
  line-height: 1.25;
}

body {
  background-color: var(--bg-main);
  color: var(--text-main);
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 12px;

  .game-content {
    flex: 1;
    overflow-y: auto;
    background: radial-gradient(circle at center, #222 0%, var(--bg-main) 100%);
    padding: 16px 0;
  }
}
</style>
