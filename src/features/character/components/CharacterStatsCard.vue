<!-- 角色属性卡片 - 展示角色基础属性和境界 -->
<template>
  <BaseBorderContainer title="个人属性">
    <div class="stats-grid">
      <div class="stat-item">
        <span class="stat-label">境界</span>
        <span class="stat-value realm">{{ realm }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">攻击</span>
        <span class="stat-value">{{ stats.attack }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">防御</span>
        <span class="stat-value">{{ stats.defense }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">生命</span>
        <span class="stat-value">{{ stats.maxHp }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">灵力</span>
        <span class="stat-value">{{ stats.maxMp }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">等级</span>
        <span class="stat-value">Lv.{{ level }}</span>
      </div>
    </div>
  </BaseBorderContainer>
</template>

<script setup lang="ts">
import BaseBorderContainer from '@/components/common/BaseBorderContainer.vue';

// ==================== Props ====================

// 组件属性：境界、等级、属性数据
defineProps<{
  realm: string;
  level: number;
  stats: {
    attack: number;
    defense: number;
    maxHp: number;
    maxMp: number;
  };
}>();
</script>

<style lang="scss" scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-border);
  border-radius: 4px;
}

.stat-label {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.stat-value {
  color: var(--color-yellow);
  font-weight: bold;
}

.realm {
  color: var(--color-cyan);
}
</style>