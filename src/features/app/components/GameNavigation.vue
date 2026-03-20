<template>
  <footer class="game-nav">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      :class="['nav-item', { active: activeTab === tab.id }]"
      @click="$emit('select', tab.id)"
    >
      <span class="nav-text">{{ tab.name }}</span>
    </button>
  </footer>
</template>

<script setup lang="ts">
import type { GameTab, GameTabId } from '@/features/app/config/navigation';

defineProps<{
  tabs: GameTab[];
  activeTab: GameTabId;
}>();

defineEmits<{
  (e: 'select', tabId: GameTabId): void;
}>();
</script>

<style lang="scss" scoped>
.game-nav {
  display: flex;
  gap: 12px;
  padding-top: 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #444;
  border-radius: 4px;
  height: 45px;
  flex: 1;
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-main);
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    border-color: var(--color-yellow);
    color: #fff;
  }

  &.active {
    border-color: var(--color-yellow);
    color: var(--color-yellow);
    background: rgba(238, 196, 63, 0.08);
  }
}

.nav-text {
  font-size: 0.95rem;
}
</style>