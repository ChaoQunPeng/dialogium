<template>
  <div class="border-container">
    <div class="title">{{ title }}</div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<style lang="scss" scoped>
.border-container {
  border: 1px solid #ddd;
  padding: 12px;
  border-radius: 2px;

  .title {
    color: var(--color-yellow);
  }
}
</style>
