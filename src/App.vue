<template>
  <div class="app-container">
    <header class="game-header">
      <BorderContainer class="header-inner">
        <div class="mud-horizontal-layout">
          <div class="identity-section">
            <div class="avatar-box">
              <img src="./assets/avatar.png" alt="修仙者" />
            </div>
            <div class="name-tag">
              <span class="p-name">{{ playerStore.player.name }}</span>
              <span class="p-realm">【{{ playerStore.realm }}】</span>
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
                  >{{ playerStore.player.baseInfo.mp || 0 }}/{{
                    playerStore.finalStats.maxMp || 0
                  }}</span
                >
              </div>
            </div>
            <div class="status-column">
              <div class="attr-row">
                <span class="label">攻击</span>
                <span class="value text-yellow">{{ playerStore.finalPlayer.battle!.attack }}</span>
              </div>
              <div class="attr-row">
                <span class="label">防御</span>
                <span class="value text-green">{{ playerStore.finalPlayer.battle!.defense }}</span>
              </div>
            </div>
          </div>

          <div class="action-section">
            <div class="level-box">
              <span class="label">等级</span>
              <span class="value">{{ playerStore.player.baseInfo.level }}</span>
            </div>
            <button class="mud-cmd-btn" @click="playerStore.healHp(100, true)">[ 调息 ]</button>
          </div>
        </div>
      </BorderContainer>
    </header>

    <main class="game-content">
      <CharacterPanel v-show="activeTab === 'realm'" />
      <SceneView v-show="activeTab === 'adventure'" />
      <!-- <CultivationPanel v-if="activeTab === 'practice'" /> -->
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SceneView from './components/SceneView.vue';
import CharacterPanel from './components/CharacterPanel.vue';
// import CultivationPanel from './components/CultivationPanel.vue';
import { usePlayerStore } from '@/stores/player';
const playerStore = usePlayerStore();

// 定义 Tab 数据，第三个修改为"修炼"
const tabs = [
  { id: 'realm', name: '修为' },
  { id: 'adventure', name: '历练' },
  // { id: 'practice', name: '修炼' }, // 修改此处 id 和 name
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
    margin-bottom: 12px;

    .header-inner {
      padding: 10px 14px;
    }

    .mud-horizontal-layout {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }

    /* 身份区 */
    .identity-section {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 180px;

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
      border-left: 1px solid #333;
      border-right: 1px solid #333;
      padding: 0 20px;

      .status-column {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .attr-row {
        display: flex;
        justify-content: space-between;
        font-family: 'Courier New', Courier, monospace; // 数值对齐
        font-size: 0.95rem;

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
