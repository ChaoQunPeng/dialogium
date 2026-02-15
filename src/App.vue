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
      <SceneView v-if="activeTab === 'adventure'" />
      <div v-if="activeTab === 'realm'" class="placeholder-view">境界感悟中...</div>
      <div v-if="activeTab === 'storage'" class="placeholder-view">纳戒乾坤内...</div>
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
import { ref } from 'vue';
import SceneView from './components/scene/SceneView.vue';

// 定义 Tab 数据
const tabs = [
  { id: 'adventure', name: '历练' },
  { id: 'realm', name: '境界' },
  { id: 'storage', name: '纳戒' },
];

const activeTab = ref('adventure');
</script>

<style lang="scss">
/* 修仙风格配色变量 */
$bg-dark: #1a1a1a; // 深墨色
$border-gold: #8c7355; // 古铜/金
$active-cyan: #40e0d0; // 灵力青
$text-gray: #d4d4d4;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'PingFang SC', 'Microsoft YaHei', serif;
}

body {
  background-color: $bg-dark;
  color: $text-gray;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 500px; /* 模拟手机端宽度 */
  margin: 0 auto;
  border-left: 1px solid #333;
  border-right: 1px solid #333;

  /* 头部样式 */
  .game-header {
    height: 60px;
    padding: 10px 20px;
    background: linear-gradient(to bottom, #2a2a2a, #1a1a1a);
    border-bottom: 2px solid $border-gold;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .realm {
      margin-left: 10px;
      color: $active-cyan;
      font-size: 0.9em;
    }
  }

  /* 主体内容 */
  .game-content {
    flex: 1;
    overflow-y: auto;
    padding: 15px;
    background: radial-gradient(circle at center, #262626 0%, #1a1a1a 100%);

    .placeholder-view {
      text-align: center;
      margin-top: 50px;
      color: #666;
      font-style: italic;
    }
  }

  /* 底部 Tab 导航 */
  .game-nav {
    display: flex;
    height: 70px;
    background: #222;
    border-top: 1px solid $border-gold;
    padding-bottom: env(safe-area-inset-bottom); /* 兼容刘海屏 */

    .nav-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;

      .nav-text {
        font-size: 1.1rem;
        letter-spacing: 2px;
        color: #888;
      }

      &.active {
        background: rgba(140, 115, 85, 0.1);

        .nav-text {
          color: $active-cyan;
          font-weight: bold;
          text-shadow: 0 0 8px rgba(64, 224, 208, 0.5);
        }

        /* 选中的装饰小横条 */
        &::after {
          content: '';
          position: absolute;
          bottom: 10px;
          width: 30%;
          height: 2px;
          background-color: $active-cyan;
          box-shadow: 0 0 5px $active-cyan;
        }
      }
    }
  }
}
</style>
