<template>
  <div class="app-container">
    <!-- 游戏开始界面 -->
    <StartScreen v-if="!playerStore.isGameStarted" @game-started="handleGameStarted" />

    <!-- 游戏主界面 -->
    <template v-else>
      <header class="game-header">
        <BorderContainer class="header-inner">
          <div class="mud-horizontal-layout">
            <div class="identity-section">
              <div class="avatar-box">
                <img src="./assets/avatar.png" alt="修仙者" />
              </div>
              <div class="name-tag">
                <span class="p-name">{{ playerStore.player.name || '无名' }}</span>
                <span class="p-realm">{{ playerStore.realm || '凡人' }}</span>
              </div>
            </div>

            <div class="status-grid-horizontal">
              <div class="status-column">
                <div class="attr-row">
                  <span class="label">气血</span>
                  <span class="value text-red"
                    >{{ playerStore.player.baseInfo.hp }}/{{ playerStore.finalStats.maxHp }}</span
                  >
                </div>
                <div class="attr-row">
                  <span class="label">灵力</span>
                  <span class="value text-cyan"
                    >{{ playerStore.player.baseInfo.mp }}/{{ playerStore.finalStats.maxMp }}</span
                  >
                </div>
              </div>

              <!-- 灵石显示 -->
              <div class="currency-display">
                <span class="currency-label">💰 灵石：</span>
                <span class="currency-value">{{ playerStore.player.currency ?? 1000 }}</span>
              </div>
            </div>
          </div>
        </BorderContainer>
      </header>

      <main class="game-content">
        <CharacterPanel v-show="activeTab === 'realm'" />
        <SceneView v-show="activeTab === 'adventure'" />
        <SystemPanel v-show="activeTab === 'system'" />
      </main>

      <footer class="game-nav flex">
        <div
          v-for="tab in tabs"
          :key="tab.id"
          :class="['nav-item', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          <span class="nav-text">{{ tab.name }}</span>
        </div>
      </footer>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import StartScreen from './components/views/StartScreen.vue';
import SceneView from './components/views/SceneView.vue';
import CharacterPanel from './components/views/CharacterPanel.vue';
import SystemPanel from './components/views/SystemPanel.vue';
import { usePlayerStore } from '@/stores/player';
import { STORAGE_KEYS } from '@/constants';

// 引入 player store
const playerStore = usePlayerStore();

// 监听子组件的游戏启动事件
const handleGameStarted = () => {
  playerStore.setGameStarted(true);
};

// 组件挂载时检查 localStorage
onMounted(() => {
  const hasPlayerData = localStorage.getItem(STORAGE_KEYS.PLAYER_DATA);
  if (hasPlayerData) {
    playerStore.setGameStarted(true);
  }
  console.log('🎭 App.vue 初始化检查 - 游戏是否已启动:', playerStore.isGameStarted);
});

// 定义 Tab 数据
const tabs = [
  { id: 'realm', name: '修为' },
  { id: 'adventure', name: '历练' },
  { id: 'system', name: '设置' },
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
  --color-yellow: #eec43f;
  --color-green: #4dbd74; /* 优化：降低了荧光感，更护眼 */
  --color-red: #ff4d4d; /* 修正：不再叫 green 了 */
  --color-cyan: #40e0d0;
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
  padding: 12px;

  .game-header {
    .header-inner {
      padding: 10px 14px;
    }

    .mud-horizontal-layout {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    /* 身份区 */
    .identity-section {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 160px;

      .avatar-box {
        width: 48px;
        height: 48px;
        border: 1px solid #444;
        padding: 2px;
        background: #000;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          // 增加一点复古滤镜效果，让头像更融入MUD
          filter: contrast(1.1) brightness(0.9);
        }
      }

      .name-tag {
        display: flex;
        flex-direction: column;
        gap: 2px;

        .p-name {
          font-size: 1.1rem;
          font-weight: bold;
          color: var(--text-main);
        }
        .p-realm {
          font-size: 0.85rem;
          color: var(--color-cyan);
        }
      }
    }

    /* 核心数值区 - 水平列阵布局 */
    .status-grid-horizontal {
      flex: 1;
      display: flex;
      gap: 30px;
      padding: 0 20px;

      .status-column {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .attr-row,
      .currency-display {
        display: flex;
        font-family: 'Courier New', Courier, monospace; // 数值对齐
        font-size: 0.95rem;
      }

      .attr-row {
        .label {
          color: #ddd;
          margin-right: 8px;
        }
        .value {
          font-weight: bold;
        }
      }
    }

    /* 右侧动作区 */
    .action-section {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 6px;
      min-width: 100px;

      .level-box {
        font-size: 0.9rem;
        .label {
          color: #ddd;
          margin-right: 4px;
        }
        .value {
          color: var(--color-yellow);
          font-weight: bold;
        }
      }

      .mud-cmd-btn {
        background: none;
        border: none;
        color: var(--color-yellow);
        cursor: pointer;
        font-family: 'STKaiti', serif;
        font-size: 1rem;
        padding: 2px 0;

        &:hover {
          color: #fff;
          text-shadow: 0 0 5px var(--color-yellow);
        }
        &:active {
          transform: scale(0.95);
        }
      }
    }
  }

  /* 颜色辅助类 */
  .text-red {
    color: var(--color-red);
  }
  .text-cyan {
    color: var(--color-cyan);
  }
  .text-green {
    color: var(--color-green);
  }
  .text-yellow {
    color: var(--color-yellow);
  }

  /* 灵石显示样式 */
  .currency-display {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .currency-label {
      font-size: 14px;
      color: var(--text-main);
      margin-right: 8px;
    }

    .currency-value {
      font-size: 18px;
      font-weight: bold;
      color: var(--color-yellow);
    }
  }
  .game-content {
    flex: 1;
    overflow-y: auto;
    background: radial-gradient(circle at center, #222 0%, var(--bg-main) 100%);
  }

  .game-nav {
    gap: 12px;
    padding-top: 12px;

    .nav-item {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #ddd;
      border-radius: 4px;
      height: 45px;
      flex: 1;
    }
  }
}
</style>
