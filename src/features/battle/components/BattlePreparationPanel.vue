<template>
  <BaseBorderContainer :title="`当前场景：${sceneName || '荒野林径'}`">
    <div class="enemy-detail-panel">
      <div class="enemy-header">
        <span class="enemy-name">{{ enemy.name }}</span>
        <span class="enemy-level gray">LV.{{ enemy.baseInfo.level }}</span>
      </div>

      <div class="enemy-description-section mb-3">
        <p class="desc-text">{{ enemy.introduction }}</p>
      </div>

      <div class="enemy-stats-simple">
        <div class="stat-item">
          <span class="stat-label">生命值</span>
          <span class="stat-value">{{ enemy.baseInfo.maxHp }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">法力值</span>
          <span class="stat-value">{{ enemy.baseInfo.maxMp }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">攻击力</span>
          <span class="stat-value red">{{ enemy.battle?.attack ?? 0 }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">防御力</span>
          <span class="stat-value yellow">{{ enemy.battle?.defense ?? 0 }}</span>
        </div>
      </div>

      <div class="enemy-rewards-section">
        <div class="section-title">📦 击败奖励</div>
        <div class="reward-info">
          <span class="exp-icon">✨</span>
          <span class="exp-text">经验值：<span class="highlight">{{ enemy.battle?.exp ?? 0 }}</span> 点</span>
        </div>
      </div>

      <div class="enemy-drops-section" v-if="enemy.battle?.dropList && enemy.battle.dropList.length > 0">
        <div class="section-title">🎁 可能掉落</div>
        <div class="drop-list">
          <div v-for="(dropId, index) in enemy.battle.dropList" :key="index" class="drop-item">
            <span class="drop-icon">📦</span>
            <span class="drop-name">{{ getDropItemName(dropId) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="battle-actions-group">
      <button class="action-btn btn-challenge" @click="$emit('battle')">[ 战斗 ]</button>
      <button v-if="showCloseButton" class="action-btn btn-close" @click="$emit('close')">返回</button>
    </div>
  </BaseBorderContainer>
</template>

<script setup lang="ts">
import BaseBorderContainer from '@/components/common/BaseBorderContainer.vue';
import type { ICharacter } from '@/interface/character';
import type { IItem } from '@/interface/item';
import { items } from '@/items';

defineProps<{
  enemy: ICharacter;
  sceneName?: string;
  showCloseButton?: boolean;
}>();

defineEmits<{
  (e: 'battle'): void;
  (e: 'close'): void;
}>();

const getDropItemName = (dropId: string): string => {
  const item = items[dropId] as IItem | undefined;
  return item?.name || dropId;
};
</script>

<style lang="scss" scoped>
.enemy-detail-panel {
  margin-bottom: 16px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.enemy-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.enemy-name {
  color: var(--color-yellow);
  font-weight: bold;
  font-size: 1.1em;
}

.enemy-level {
  font-size: 0.85em;
}

.enemy-description-section {
  margin-top: 12px;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 3px;
}

.desc-text,
.reward-info,
.drop-item {
  color: var(--color-gray);
}

.enemy-stats-simple {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 3px;
}

.stat-label {
  font-size: 0.85em;
}

.stat-value {
  font-weight: bold;
  font-family: monospace;
  font-size: 0.95em;
}

.enemy-rewards-section,
.enemy-drops-section {
  padding: 8px 10px;
  border-radius: 3px;
}

.enemy-rewards-section {
  background: rgba(0, 255, 0, 0.05);
  border: 1px solid rgba(0, 255, 0, 0.2);
  margin-bottom: 12px;
}

.enemy-drops-section {
  background: rgba(255, 255, 0, 0.05);
  border: 1px solid rgba(255, 255, 0, 0.2);
}

.section-title {
  color: var(--color-cyan);
  font-weight: bold;
  font-size: 0.9em;
  margin-bottom: 8px;
}

.highlight,
.drop-name,
.yellow {
  color: var(--color-yellow);
}

.drop-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.drop-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
  font-size: 0.85em;
}

.battle-actions-group {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
}

.action-btn {
  min-width: 120px;
  padding: 10px 24px;
  font-size: 0.95em;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(180deg, rgba(0, 255, 255, 0.2) 0%, rgba(0, 255, 255, 0.1) 100%);
  border: 1px solid var(--color-cyan);
  color: var(--color-cyan);

  &:hover {
    background: linear-gradient(180deg, rgba(255, 255, 0, 0.25) 0%, rgba(255, 255, 0, 0.1) 100%);
    border-color: var(--color-yellow);
    color: var(--color-yellow);
  }
}

.red {
  color: var(--color-red);
}

.gray {
  color: var(--color-gray);
}
</style>