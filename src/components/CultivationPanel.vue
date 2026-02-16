<template>
  <div class="practice-orbit mud-core">
    <header class="mud-section">
      <div class="char-title">===[ 修炼宝地 ]===</div>
      <div class="char-subtitle">当前位置：{{ currentLocation }}</div>
      <div class="char-subtitle">灵气浓度：{{ spiritualDensity }}</div>
    </header>

    <div class="line-divider">--------------------------------</div>

    <section class="mud-section">
      <div class="mud-sub-title">【 星际传送阵 】</div>
      <div class="location-list">
        <div
          v-for="loc in locations"
          :key="loc.id"
          class="loc-item"
          @click="handleTeleport(loc.id)"
        >
          <span class="loc-name">>> {{ loc.name }}</span>
          <span class="loc-level">需：{{ loc.levelReq }} 境界</span>
        </div>
      </div>
    </section>

    <div class="line-divider">--------------------------------</div>

    <section class="mud-section">
      <div class="mud-sub-title">【 乾坤百工 】</div>
      <div class="craft-menu">
        <div class="craft-btn" @click="openAction('alchemy')">[ 开启炼丹炉 ] - 炼制灵丹妙药</div>
        <div class="craft-btn" @click="openAction('crafting')">[ 催动紫炎火 ] - 淬炼神兵利器</div>
        <div class="craft-btn locked">[ 参悟玉瞳简 ] - 寻找古遗功法 (暂未开启)</div>
      </div>
    </section>

    <div class="line-divider">--------------------------------</div>

    <footer class="mud-section status-footer">
      <div class="typing-text">>>> 阵法纹路流转，正在吸纳天地灵气...</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const currentLocation = ref('火星·地下空间');
const spiritualDensity = ref('极其浓郁');

// 副本数据：参考《飘邈之旅》经典地图
const locations = [
  { id: 'mars_depth', name: '火星深处 (初级历练)', levelReq: '筑基' },
  { id: 'green_star', name: '绿色星球 (灵草采集)', levelReq: '开光' },
  { id: 'sky_star', name: '天庭星 (高级坊市)', levelReq: '元婴' },
  { id: 'star_tomb', name: '天神之墓 (上古禁地)', levelReq: '合体' },
];

const handleTeleport = (id: string) => {
  console.log(`正在启动传送阵，目标：${id}`);
  // 这里写路由跳转或逻辑
};

const openAction = (type: string) => {
  console.log(`执行操作：${type}`);
};
</script>

<style lang="scss" scoped>
.practice-orbit {
  padding: 20px;
  background-color: #000;
  color: #bbb;
  font-family: 'Courier New', Courier, monospace;
  line-height: 1.5;

  .mud-section {
    margin-bottom: 20px;
  }
  .char-title {
    color: var(--color-gold);
    font-weight: bold;
    font-size: 1.1rem;
  }
  .mud-sub-title {
    color: var(--color-gold);
    margin-bottom: 12px;
    font-size: 0.95rem;
  }
  .line-divider {
    color: #444;
    margin: 10px 0;
  }

  /* 传送地点列表 */
  .location-list {
    .loc-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 10px;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.2s;
      font-size: 0.9rem;

      &:hover {
        background-color: rgba(64, 224, 208, 0.1);
        border-color: var(--color-cyan);
        .loc-name {
          color: var(--color-cyan);
        }
      }

      .loc-name {
        color: #ddd;
      }
      .loc-level {
        color: #555;
        font-size: 0.8rem;
      }
    }
  }

  /* 技艺菜单 */
  .craft-menu {
    .craft-btn {
      padding: 10px;
      margin-bottom: 8px;
      background: rgba(180, 155, 112, 0.05);
      border: 1px dashed #333;
      cursor: pointer;
      font-size: 0.9rem;
      color: #999;
      transition: 0.3s;

      &:hover:not(.locked) {
        border-color: var(--color-gold);
        color: var(--color-gold);
        background: rgba(180, 155, 112, 0.1);
      }

      &.locked {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }
  }

  /* 底部提示 */
  .status-footer {
    .typing-text {
      color: #555;
      font-size: 0.8rem;
      font-style: italic;
    }
  }
}
</style>
