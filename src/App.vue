<template>
  <div class="app-container">
    <header class="game-header">
      <div class="character-mini-info">
        <span class="name">李强</span>
        <span class="realm">筑基初期</span>
      </div>
      <div class="currency">灵石: 8848</div>
    </header>

    <main class="game-content">
      <SceneView v-show="activeTab === 'adventure'" />
      <CharacterPanel v-show="activeTab === 'realm'" />
      <CultivationPanel v-show="activeTab === 'practice'" />
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
import { ref, onMounted } from 'vue';
import SceneView from './components/scene/SceneView.vue';
import CharacterPanel from './components/CharacterPanel.vue';
import CultivationPanel from './components/CultivationPanel.vue';
import { initializePlayerData } from '@/utils/initialize';

// 定义 Tab 数据，第三个修改为"修炼"
const tabs = [
  { id: 'realm', name: '修为' },
  { id: 'adventure', name: '历练' },
  { id: 'practice', name: '修炼' }, // 修改此处 id 和 name
];

const activeTab = ref('adventure');

onMounted(() => {
  initializePlayerData();
});
</script>

<style lang="scss">
/* 建议将此部分放入全局样式文件 */
:root {
  --bg-main: #121212;
  --bg-card: #1e1e1e;
  --text-main: #dddddd;
  --color-gold: #b49b70;
  --color-cyan: #40e0d0;
  --color-text: #d4d4d4;
  --color-sub: #dddddd;
  --border-style: 1px solid var(--color-gold);
  --shadow-glow: 0 0 10px rgba(64, 224, 208, 0.3);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  //  'PingFang SC',
  font-family: 'STKaiti', serif; /* 加入楷体更有修仙感 */
}

body {
  background-color: var(--bg-main);
  color: var(--color-text);
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 500px;
  margin: 0 auto;
  border-left: 1px solid #333;
  border-right: 1px solid #333;

  .game-header {
    height: 60px;
    padding: 0 20px;
    background: var(--bg-card);
    border-bottom: 2px solid var(--color-gold);
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);

    .realm {
      margin-left: 10px;
      color: var(--color-cyan);
      font-weight: bold;
    }

    .currency {
      color: var(--color-gold);
      font-size: 0.9em;
    }
  }

  .game-content {
    flex: 1;
    overflow-y: auto;
    background: radial-gradient(circle at center, #222 0%, var(--bg-main) 100%);
    position: relative;

    .placeholder-view,
    .practice-view {
      text-align: center;
      padding-top: 100px;
      color: var(--color-sub);
    }

    /* 简单的修炼动画演示 */
    .meditation-circle {
      width: 100px;
      height: 100px;
      border: 2px solid var(--color-cyan);
      border-radius: 50%;
      margin: 0 auto 20px;
      animation: breathe 3s infinite ease-in-out;
      box-shadow: var(--shadow-glow);
    }
  }

  .game-nav {
    display: flex;
    height: 70px;
    background: var(--bg-card);
    border-top: 1px solid var(--color-gold);
    padding-bottom: env(safe-area-inset-bottom);

    .nav-item {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: all 0.3s ease;

      .nav-text {
        font-size: 1.1rem;
        color: var(--color-sub);
      }

      &.active {
        background: rgba(180, 155, 112, 0.1);

        .nav-text {
          color: var(--color-cyan);
          text-shadow: var(--shadow-glow);
          font-weight: bold;
        }
      }
    }
  }
}

@keyframes breathe {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
}
</style>
