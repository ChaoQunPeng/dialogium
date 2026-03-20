<template>
  <header class="game-header">
    <BaseBorderContainer class="header-inner">
      <div class="header-layout">
        <div class="identity-section">
          <div class="avatar-box">
            <img :src="avatarImage" alt="修仙者" />
          </div>
          <div class="name-tag">
            <span class="player-name">{{ playerStore.player.name || '无名' }}</span>
            <span class="player-realm">{{ playerStore.realm || '凡人' }}</span>
          </div>
        </div>

        <div class="status-section">
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

          <div class="currency-display">
            <span class="currency-label">💰 灵石：</span>
            <span class="currency-value">{{ playerStore.player.currency ?? 1000 }}</span>
          </div>
        </div>
      </div>
    </BaseBorderContainer>
  </header>
</template>

<script setup lang="ts">
import avatarImage from '@/assets/avatar.png';
import BaseBorderContainer from '@/components/common/BaseBorderContainer.vue';
import { usePlayerStore } from '@/stores/player';

const playerStore = usePlayerStore();
</script>

<style lang="scss" scoped>
.game-header {
  .header-inner {
    padding: 10px 14px;
  }
}

.header-layout {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.identity-section {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 160px;
}

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
    filter: contrast(1.1) brightness(0.9);
  }
}

.name-tag {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.player-name {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--text-main);
}

.player-realm {
  font-size: 0.85rem;
  color: var(--color-cyan);
}

.status-section {
  flex: 1;
  display: flex;
  gap: 30px;
  padding: 0 20px;
  align-items: center;
  justify-content: space-between;
}

.status-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.attr-row,
.currency-display {
  display: flex;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.95rem;
}

.label {
  color: #ddd;
  margin-right: 8px;
}

.value {
  font-weight: bold;
}

.currency-display {
  align-items: center;
  justify-content: flex-end;
}

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

.text-red {
  color: var(--color-red);
}

.text-cyan {
  color: var(--color-cyan);
}
</style>