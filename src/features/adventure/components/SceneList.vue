<template>
  <BaseBorderContainer>
    <div class="scenes-list">
      <div v-for="scene in scenes" :key="scene.id" class="scene-item" @click="$emit('select', scene)">
        <div class="scene-header">
          <h3 class="scene-name">{{ scene.name }}</h3>
        </div>
        <div class="scene-description">
          {{ scene.description }}
        </div>
      </div>
    </div>
  </BaseBorderContainer>
</template>

<script setup lang="ts">
import BaseBorderContainer from '@/components/common/BaseBorderContainer.vue';
import type { Scene } from '@/interface/scene';

defineProps<{
  scenes: Scene[];
}>();

defineEmits<{
  (e: 'select', scene: Scene): void;
}>();
</script>

<style lang="scss" scoped>
.scenes-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
}

.scene-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.07);
    border-color: var(--color-yellow);
  }
}

.scene-name {
  color: var(--color-yellow);
  margin: 0 0 8px;
  font-size: 1.1em;
}

.scene-description {
  color: var(--text-main);
}
</style>