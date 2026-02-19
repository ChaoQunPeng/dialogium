<template>
  <div class="app-container">
    <header>
      <BorderContainer class="game-header">
        <div class="media-box mb-24">
          <div class="avatar"></div>
          <div class="body">
            <div class="character-mini-info">
              <span class="name">{{ playerStore.player.name }}</span>
              <span class="realm">{{ playerStore.realmData.zh }}</span>
            </div>
          </div>
          <div class="currency">灵石: 999</div>
        </div>

        <div class="status-bars">
          <div class="bar-row">
            <span class="bar-label">气血</span>
            <span class="bar-val">{{ player.baseInfo.hp }}</span>
          </div>
          <div class="bar-row" v-if="player.baseInfo.maxMp > 0">
            <span class="bar-label">灵力</span>
            <span class="bar-val">{{ player.baseInfo.mp }}</span>
          </div>
        </div>
      </BorderContainer>
    </header>

    <main class="game-content">
      <CharacterPanel v-if="activeTab === 'realm'" />
      <SceneView v-if="activeTab === 'adventure'" />
      <CultivationPanel v-if="activeTab === 'practice'" />
    </main>

    <footer class="game-nav">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        :class="['nav-item', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        <span class="nav-text">{{ tab.name }}</span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import SceneView from './components/scene/SceneView.vue';
import CharacterPanel from './components/CharacterPanel.vue';
import CultivationPanel from './components/CultivationPanel.vue';
import { usePlayerStore } from '@/stores/player';
const playerStore = usePlayerStore();

const player = computed(() => {
  return playerStore.player;
});

// 定义 Tab 数据，第三个修改为"修炼"
const tabs = [
  { id: 'realm', name: '修为' },
  { id: 'adventure', name: '历练' },
  { id: 'practice', name: '修炼' }, // 修改此处 id 和 name
];

const activeTab = ref('realm');
</script>

<style lang="scss">
/* 建议将此部分放入全局样式文件 */
:root {
  --bg-main: #121212;
  --bg-card: #1e1e1e;
  --text-main: #d4d4d4;
  --text-muted: #a0a0a0; /* 新增：用于次要文字 */

  --color-yellow: #d4af37;
  --color-green: #4dbd74; /* 优化：降低了荧光感，更护眼 */
  --color-red: #ff4d4d; /* 修正：不再叫 green 了 */
  --color-cyan: #40e0d0;

  --border-radius: 8px; /* 建议：增加圆角变量 */
  --transition: all 0.3s ease;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  //  'PingFang SC',
  font-family: 'STKaiti', serif; /* 加入楷体更有修仙感 */
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
  padding: 15px;

  .game-header {
    .media-box {
      display: flex;
    }
  }

  .game-content {
    flex: 1;
    overflow-y: auto;
    background: radial-gradient(circle at center, #222 0%, var(--bg-main) 100%);
  }

  .game-nav {
  }
}
</style>
